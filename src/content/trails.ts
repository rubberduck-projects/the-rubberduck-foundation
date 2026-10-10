import { cache } from "react";
import { supabase } from "@/lib/supabase";

export type Article = { id: number; slug: string; title: string; intro?: string; body?: string; position: number };
// A trail map is one section of a trail; trail maps never nest.
export type TrailMap = { id: number; title: string; summary: string; position: number; articles: Article[] };
// One article_connections row: articleId needs requiredArticleId first.
export type ArticleConnection = { articleId: number; requiredArticleId: number };
export type Resource = { title: string; note: string; href?: string };
export type Trail = {
    id: number;
    slug: string;
    title: string;
    destination: string;
    prerequisites: Resource[];
    nextSteps: Resource[];
    updatedAt: string;
    verifiedAt: string;
    maps: TrailMap[];
    connections: ArticleConnection[];
};

type ArticleRow = { id: number; slug: string; title: string; intro: string | null; body: string | null; position: number };
type TrailRow = {
    id: number;
    slug: string;
    title: string;
    destination: string;
    prerequisites: unknown;
    next_steps: unknown;
    updated_at: string;
    verified_at: string;
    trail_maps: { id: number; title: string; summary: string; position: number; articles: ArticleRow[] }[];
};
type ConnectionRow = { trail_id: number; article_id: number; required_article_id: number };

// jsonb columns are only checked as arrays by the database, so their items are checked here.
function resources(value: unknown, where: string): Resource[] {
    const valid = (r: Resource) =>
        typeof r?.title === "string" && typeof r?.note === "string" && (r.href === undefined || URL.canParse(r.href));
    if (!Array.isArray(value) || !value.every(valid)) {
        throw new Error(`${where} must be a list of { title, note, href? } where href is a URL`);
    }
    return value;
}

async function fetchTrails(): Promise<Trail[]> {
    // article_connections has no foreign key to trails, so it cannot be embedded and is fetched on its own.
    const [trailsResult, connectionsResult] = await Promise.all([
        supabase
            .from("trails")
            .select(
                "id, slug, title, destination, prerequisites, next_steps, updated_at, verified_at, trail_maps(id, title, summary, position, articles(id, slug, title, intro, body, position))",
            )
            .order("id")
            .overrideTypes<TrailRow[], { merge: false }>(),
        supabase.from("article_connections").select("trail_id, article_id, required_article_id").overrideTypes<ConnectionRow[], { merge: false }>(),
    ]);
    if (trailsResult.error) throw new Error(`Could not load trails: ${trailsResult.error.message}`);
    if (connectionsResult.error) throw new Error(`Could not load article connections: ${connectionsResult.error.message}`);

    return trailsResult.data.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        destination: t.destination,
        prerequisites: resources(t.prerequisites, `Trail ${t.slug}: prerequisites`),
        nextSteps: resources(t.next_steps, `Trail ${t.slug}: next_steps`),
        // Normalised so the string comparison of the two dates on the trail page is reliable.
        updatedAt: new Date(t.updated_at).toISOString(),
        verifiedAt: new Date(t.verified_at).toISOString(),
        maps: t.trail_maps.map((m) => {
            if (m.articles.length === 0) throw new Error(`Trail ${t.slug}: trail map "${m.title}" has no articles`);
            return {
                ...m,
                articles: m.articles.map((a) => ({ ...a, intro: a.intro ?? undefined, body: a.body ?? undefined })),
            };
        }),
        connections: connectionsResult.data
            .filter((c) => c.trail_id === t.id)
            .map((c) => ({ articleId: c.article_id, requiredArticleId: c.required_article_id })),
    }));
}

// One fetch per render; freshness comes from the route level `revalidate` in the site layout.
export const getTrails = cache(fetchTrails);

export const getTrail = async (slug: string) => (await getTrails()).find((t) => t.slug === slug);

const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position;

// Reading order: trail map position, then article position. Positions may have gaps.
export const sortedMaps = (trail: Trail) => [...trail.maps].sort(byPosition);

export const allArticles = (trail: Trail) => sortedMaps(trail).flatMap((m) => [...m.articles].sort(byPosition));

// Prose at 60 words a minute; code lines get 10 seconds each because readers run or retype them.
export function readingMinutes(article: Article) {
    if (!article.body) return 0;
    const codeLines = [...article.body.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
        .flatMap((m) => m[1].split("\n"))
        .filter((line) => line.trim()).length;
    const words = article.body.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 60 + codeLines / 6));
}

export const totalMinutes = (trail: Trail) =>
    allArticles(trail).reduce((n, a) => n + readingMinutes(a), 0);

export const mapOf = (trail: Trail, slug: string) => trail.maps.find((m) => m.articles.some((a) => a.slug === slug))!;

export function connections(trail: Trail) {
    const list = allArticles(trail);
    const order = new Map(list.map((a, i) => [a.id, i]));
    const previous = new Map<number, Article[]>(list.map((a) => [a.id, []]));
    const next = new Map<number, Article[]>(list.map((a) => [a.id, []]));

    trail.connections.forEach(({ articleId, requiredArticleId }) => {
        const at = order.get(articleId);
        const before = order.get(requiredArticleId);
        if (at === undefined || before === undefined) {
            throw new Error(`Trail ${trail.slug}: connection ${requiredArticleId} to ${articleId} points at an article outside this trail`);
        }
        // Rules out loops too, and lets the tree place each article after everything it needs.
        if (before >= at) {
            throw new Error(`Trail ${trail.slug}: ${list[at].slug} requires ${list[before].slug}, which does not come earlier in reading order`);
        }
        previous.get(articleId)!.push(list[before]);
        next.get(requiredArticleId)!.push(list[at]);
    });

    const byOrder = (a: Article, b: Article) => order.get(a.id)! - order.get(b.id)!;
    previous.forEach((v) => v.sort(byOrder));
    next.forEach((v) => v.sort(byOrder));
    return { previous, next };
}
