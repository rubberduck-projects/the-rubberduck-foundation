// Usage: node scripts/visualize/visualize.mjs <trail.json> [output.html]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [input, output] = process.argv.slice(2);
if (!input) {
    console.error("Usage: node scripts/visualize/visualize.mjs <trail.json> [output.html]");
    process.exit(1);
}

const trail = JSON.parse(readFileSync(resolve(input), "utf8"));
if (!Array.isArray(trail.maps)) {
    console.error("Invalid trail: missing maps array.");
    process.exit(1);
}

const slugs = new Set(trail.maps.flatMap((m) => m.articles.map((a) => a.slug)));
for (const m of trail.maps)
    for (const a of m.articles)
        for (const r of a.requires ?? [])
            if (!slugs.has(r)) console.warn(`Warning: ${a.slug} requires unknown slug "${r}".`);

// Bodies are not needed to draw the graph; keep word counts only.
const words = (b) => (Array.isArray(b) ? b.join("\n") : (b ?? "")).split(/\s+/).filter(Boolean).length;
const data = {
    slug: trail.slug,
    title: trail.title,
    destination: trail.destination,
    verifiedAt: trail.verifiedAt,
    prerequisites: trail.prerequisites ?? [],
    nextSteps: trail.nextSteps ?? [],
    maps: trail.maps.map((m) => ({
        title: m.title,
        summary: m.summary,
        articles: m.articles.map((a) => ({
            slug: a.slug,
            title: a.title,
            intro: a.intro ?? "",
            requires: a.requires ?? [],
            words: words(a.body),
        })),
    })),
};

const template = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "template.html"), "utf8");
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const html = template.replace("/*__TRAIL_DATA__*/null", () => json);

const out = resolve(output ?? join(dirname(fileURLToPath(import.meta.url)), "out", `${basename(input, ".json")}.html`));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`Wrote ${out}`);
