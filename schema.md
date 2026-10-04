# DuckTrails schema

Postgres on Supabase. The static site reads these tables once at build time with the publishable key.

## Decisions

* Article slugs are unique within a trail, because the URL is `/trails/[trail]/[article]/` with no map in it.
* `trail_id` is copied onto `articles` and `article_connections` so the database can enforce slug uniqueness per trail and keep connections inside one trail.
* Article content is two text columns: `intro` and `body`. `body` is markdown.
* Reading time is computed from `body` at build time and never stored.
* Every prerequisite is stored as a row in `article_connections`. There is no implicit "previous article" rule. The first article has no rows, and any other article without rows shows as an extra starting point.
* `updated_at` has no trigger. Whatever writes a trail, map or article must set `updated_at` on the trail.
* Reorderable `position` columns use deferred unique constraints so two rows can swap positions in one transaction.

## Tables

```sql
create table trails (
  id            integer generated always as identity primary key,
  slug          varchar(255) not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         varchar(255) not null,
  destination   varchar(500) not null,
  prerequisites jsonb not null default '[]' check (jsonb_typeof(prerequisites) = 'array'), -- [{title, note, href?}]
  next_steps    jsonb not null default '[]' check (jsonb_typeof(next_steps) = 'array'),    -- [{title, note, href?}]
  updated_at    timestamptz not null default now(),
  verified_at   timestamptz not null
);

create table trail_maps (
  id       integer generated always as identity primary key,
  trail_id integer not null references trails(id) on delete cascade,
  title    varchar(255) not null,
  summary  varchar(500) not null,
  position integer not null,
  unique (id, trail_id), -- target for the composite foreign key on articles
  unique (trail_id, position) deferrable initially deferred
);

create table articles (
  id           integer generated always as identity primary key,
  trail_id     integer not null,
  trail_map_id integer not null,
  slug         varchar(255) not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        varchar(255) not null,
  intro        varchar(500),  -- one sentence on why the skill matters; also the page meta description
  body         text,          -- markdown; null while the article is a draft
  position     integer not null,
  foreign key (trail_map_id, trail_id) references trail_maps(id, trail_id) on delete cascade,
  unique (trail_id, slug),
  unique (trail_id, position)
);

create table article_connections (
  trail_id            integer not null,
  article_id          integer not null,
  required_article_id integer not null,
  primary key (article_id, required_article_id),
  foreign key (article_id, trail_id) references articles(id, trail_id) on delete cascade,
  foreign key (required_article_id, trail_id) references articles(id, trail_id) on delete cascade,
  check (article_id <> required_article_id)
);
```

## Access

The publishable key ships in the site bundle, so the tables must be read only for everyone except the service role.

```sql
alter table trails enable row level security;
alter table trail_maps enable row level security;
alter table articles enable row level security;
alter table article_connections enable row level security;

create policy "Public read" on trails for select to anon using (true);
create policy "Public read" on trail_maps for select to anon using (true);
create policy "Public read" on articles for select to anon using (true);
create policy "Public read" on article_connections for select to anon using (true);
```

## Reading order

Reading order is `trail_maps.position`, then `articles.position`. Positions may have gaps.

## Checked at build time

The database cannot enforce these, so the build fails when any of them is broken.

* Every item in `prerequisites` and `next_steps` has a `title` and a `note`, and `href` is a URL when present.
* `article_connections` has no loops.
* Every required article comes earlier in reading order than the article that requires it.
* Every trail map has at least one article.
