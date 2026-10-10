-- Template for adding a trail. Copy this file, replace the example values and run it.
-- Rows are linked by slug and position instead of id, so it works whatever ids the identity columns hand out.
-- Article positions are unique across the whole trail, not per map, so number them 1, 2, 3 and so on straight through.
begin;

insert into trails (slug, title, destination, prerequisites, next_steps, updated_at, verified_at) values (
  'example-trail', 'Example Trail', 'One sentence on what the learner can do at the end.',
  '[{"title":"Use a terminal.","note":"Why it is needed."},{"title":"Install a tool.","href":"https://example.com/install","note":"href is optional."}]'::jsonb,
  '[{"title":"Next topic","href":"https://example.com/docs","note":"Where to go after this trail."}]'::jsonb,
  now(), now()
);

insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'example-trail'), 'First map', 'What this group of articles covers.', 1);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'example-trail'), 'Second map', 'What the next group covers.', 2);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'example-trail'), (select id from trail_maps where trail_id = (select id from trails where slug = 'example-trail') and position = 1),
  'first-article', 'First article',
  'One line on why this article matters.',
  '## The short version

Summary of the idea.

## Details

The explanation.

## Try it yourself

```bash
echo "a command to run"
```

You should see the expected result.

## Explain it to the duck

A question the learner answers in their own words.

Tested with: tool version.
',
  1
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'example-trail'), (select id from trail_maps where trail_id = (select id from trails where slug = 'example-trail') and position = 2),
  'second-article', 'Second article',
  'One line on why this article matters.',
  '## The short version

Summary of the idea.
',
  2
);

-- article_id requires required_article_id
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'example-trail'), (select id from articles where trail_id = (select id from trails where slug = 'example-trail') and slug = 'second-article'), (select id from articles where trail_id = (select id from trails where slug = 'example-trail') and slug = 'first-article'));

commit;
