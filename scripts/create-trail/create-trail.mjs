#!/usr/bin/env node
// Usage: node scripts/create-trail/create-trail.mjs <trail.json> [--out <file.sql>] [--stdout]
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const args = process.argv.slice(2);
const input = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");
const outIdx = args.indexOf("--out");
const toStdout = args.includes("--stdout");

if (!input) {
  console.error("Usage: node scripts/create-trail/create-trail.mjs <trail.json> [--out <file.sql>] [--stdout]");
  process.exit(1);
}

const errors = [];
const fail = (msg) => errors.push(msg);
const isStr = (v) => typeof v === "string" && v.trim() !== "";

let trail;
try {
  trail = JSON.parse(readFileSync(resolve(input), "utf8"));
} catch (e) {
  console.error(`Cannot read ${input}: ${e.message}`);
  process.exit(1);
}

function checkLinks(list, field) {
  if (list === undefined) return [];
  if (!Array.isArray(list)) {
    fail(`${field} must be an array`);
    return [];
  }
  list.forEach((item, i) => {
    if (!isStr(item?.title)) fail(`${field}[${i}].title is required`);
    if (!isStr(item?.note)) fail(`${field}[${i}].note is required`);
    if (item?.href !== undefined && !/^https?:\/\//.test(item.href)) fail(`${field}[${i}].href must start with http:// or https://`);
  });
  return list.map(({ title, href, note }) => ({ title, ...(href ? { href } : {}), note }));
}

if (!SLUG.test(trail.slug ?? "")) fail("slug must be kebab case, for example my-trail");
if (!isStr(trail.title)) fail("title is required");
if (!isStr(trail.destination)) fail("destination is required");
const prerequisites = checkLinks(trail.prerequisites, "prerequisites");
const nextSteps = checkLinks(trail.nextSteps, "nextSteps");

const maps = Array.isArray(trail.maps) ? trail.maps : [];
if (maps.length === 0) fail("maps must be a non empty array");

const articles = [];
maps.forEach((map, mi) => {
  if (!isStr(map?.title)) fail(`maps[${mi}].title is required`);
  if (!isStr(map?.summary)) fail(`maps[${mi}].summary is required`);
  if (!Array.isArray(map?.articles) || map.articles.length === 0) return fail(`maps[${mi}].articles must be a non empty array`);
  map.articles.forEach((a, ai) => {
    const where = `maps[${mi}].articles[${ai}]`;
    if (!SLUG.test(a?.slug ?? "")) fail(`${where}.slug must be kebab case`);
    if (!isStr(a?.title)) fail(`${where}.title is required`);
    if (!isStr(a?.intro)) fail(`${where}.intro is required`);
    const body = Array.isArray(a?.body) ? a.body.join("\n") : a?.body;
    if (!isStr(body)) fail(`${where}.body is required (a string, or an array of lines)`);
    if (a?.requires !== undefined && !Array.isArray(a.requires)) fail(`${where}.requires must be an array of slugs`);
    articles.push({ ...a, body, requires: a?.requires ?? [], map: mi + 1, position: articles.length + 1 });
  });
});

const slugs = new Set();
for (const a of articles) {
  if (slugs.has(a.slug)) fail(`duplicate article slug: ${a.slug}`);
  slugs.add(a.slug);
}
for (const a of articles) {
  for (const r of a.requires) {
    if (!slugs.has(r)) fail(`${a.slug} requires unknown article: ${r}`);
    if (r === a.slug) fail(`${a.slug} requires itself`);
  }
  if (new Set(a.requires).size !== a.requires.length) fail(`${a.slug} lists a requirement twice`);
}

const state = new Map();
const bySlug = new Map(articles.map((a) => [a.slug, a]));
function visit(slug, path) {
  if (state.get(slug) === 2) return;
  if (state.get(slug) === 1) return fail(`requirement cycle: ${[...path, slug].join(" > ")}`);
  state.set(slug, 1);
  for (const r of bySlug.get(slug)?.requires ?? []) if (bySlug.has(r)) visit(r, [...path, slug]);
  state.set(slug, 2);
}
if (errors.length === 0) for (const a of articles) visit(a.slug, []);

if (errors.length) {
  console.error(`${input} is invalid:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}

const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
const stamp = trail.verifiedAt ? new Date(trail.verifiedAt) : new Date();
if (Number.isNaN(stamp.getTime())) {
  console.error("verifiedAt is not a valid date");
  process.exit(1);
}
const ts = q(stamp.toISOString());
const t = `(select id from trails where slug = ${q(trail.slug)})`;
const mapId = (n) => `(select id from trail_maps where trail_id = ${t} and position = ${n})`;
const articleId = (slug) => `(select id from articles where trail_id = ${t} and slug = ${q(slug)})`;

const sql = [];
sql.push("begin;", "");
sql.push(
  `insert into trails (slug, title, destination, prerequisites, next_steps, updated_at, verified_at) values (\n  ${q(trail.slug)}, ${q(trail.title)}, ${q(trail.destination)},\n  ${q(JSON.stringify(prerequisites))}::jsonb,\n  ${q(JSON.stringify(nextSteps))}::jsonb,\n  ${ts}, ${ts}\n);`,
  "",
);
maps.forEach((m, i) => sql.push(`insert into trail_maps (trail_id, title, summary, position) values (${t}, ${q(m.title)}, ${q(m.summary)}, ${i + 1});`));
sql.push("");
for (const a of articles) {
  const body = a.body.endsWith("\n") ? a.body : `${a.body}\n`;
  sql.push(
    `insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (\n  ${t}, ${mapId(a.map)},\n  ${q(a.slug)}, ${q(a.title)},\n  ${q(a.intro)},\n  ${q(body)},\n  ${a.position}\n);`,
    "",
  );
}
for (const a of articles)
  for (const r of a.requires)
    sql.push(`insert into article_connections (trail_id, article_id, required_article_id) values (${t}, ${articleId(a.slug)}, ${articleId(r)});`);
sql.push("", "commit;", "");

const output = sql.join("\n");
if (toStdout) {
  process.stdout.write(output);
} else {
  const out = outIdx >= 0 ? resolve(args[outIdx + 1]) : join(root, "supabase", `seed_${trail.slug.replaceAll("-", "_")}.sql`);
  writeFileSync(out, output);
  console.log(`Wrote ${basename(out)}: ${maps.length} maps, ${articles.length} articles. Run it in the Supabase SQL editor.`);
}
