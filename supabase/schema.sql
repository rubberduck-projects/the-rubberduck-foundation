-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.trails (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  slug character varying NOT NULL UNIQUE CHECK (slug::text ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text),
  title character varying NOT NULL,
  destination character varying NOT NULL,
  prerequisites jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(prerequisites) = 'array'::text),
  next_steps jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(next_steps) = 'array'::text),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  verified_at timestamp with time zone NOT NULL,
  CONSTRAINT trails_pkey PRIMARY KEY (id)
);
CREATE TABLE public.trail_maps (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  trail_id integer NOT NULL,
  title character varying NOT NULL,
  summary character varying NOT NULL,
  position integer NOT NULL,
  CONSTRAINT trail_maps_pkey PRIMARY KEY (id),
  CONSTRAINT trail_maps_trail_id_fkey FOREIGN KEY (trail_id) REFERENCES public.trails(id)
);
CREATE TABLE public.articles (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  trail_id integer NOT NULL,
  trail_map_id integer NOT NULL,
  slug character varying NOT NULL CHECK (slug::text ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text),
  title character varying NOT NULL,
  intro character varying,
  body text,
  position integer NOT NULL,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_trail_map_id_trail_id_fkey FOREIGN KEY (trail_map_id) REFERENCES public.trail_maps(id),
  CONSTRAINT articles_trail_map_id_trail_id_fkey FOREIGN KEY (trail_id) REFERENCES public.trails(id)
);
CREATE TABLE public.article_connections (
  trail_id integer NOT NULL,
  article_id integer NOT NULL,
  required_article_id integer NOT NULL,
  CONSTRAINT article_connections_pkey PRIMARY KEY (article_id, required_article_id),
  CONSTRAINT article_connections_required_article_id_trail_id_fkey FOREIGN KEY (required_article_id) REFERENCES public.articles(id),
  CONSTRAINT article_connections_required_article_id_trail_id_fkey FOREIGN KEY (trail_id) REFERENCES public.trails(id),
  CONSTRAINT article_connections_article_id_trail_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_connections_article_id_trail_id_fkey FOREIGN KEY (trail_id) REFERENCES public.articles(trail_id)
);
