import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import { allArticles, connections, getTrail, getTrails, mapOf, readingMinutes, type Article } from "@/content/trails";
import ResourceList from "@/components/trail/ResourceList";
import { FinishOnNavigate } from "@/components/trail/TrailProgress";
import Markdown from "@/components/ui/Markdown";
import { layout, palette } from "@/theme/tokens";

type Params = { trail: string; article: string };

export async function generateStaticParams(): Promise<Params[]> {
    return (await getTrails()).flatMap((t) => allArticles(t).map((a) => ({ trail: t.slug, article: a.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const p = await params;
    const trail = await getTrail(p.trail);
    const article = trail && allArticles(trail).find((a) => a.slug === p.article);
    return article ? { title: `${article.title} | ${trail.title}`, description: article.intro } : {};
}

const navCard = {
    display: "block",
    p: 2,
    color: "text.primary",
    textDecoration: "none",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: "divider",
    "&:hover": { borderColor: "text.disabled" },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
} as const;

const navLabel = { fontSize: "0.8125rem", color: "text.secondary", mb: 1 } as const;
const plainList = { listStyle: "none", p: 0, m: 0, display: "grid", gap: 1 } as const;

function Callout({ label, children }: { label: string; children: ReactNode }) {
    return (
        <Box
            component="aside"
            aria-label={label}
            sx={{
                mb: 5,
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderLeft: `3px solid ${palette.duck[400]}`,
                borderRadius: "8px",
                bgcolor: "background.paper",
            }}
        >
            <Typography sx={{ fontWeight: 640, mb: 1 }}>{label}</Typography>
            {children}
        </Box>
    );
}

function ArticleLinks({ id, label, trailSlug, items, align }: { id: string; label: string; trailSlug: string; items: Article[]; align?: "right" }) {
    return (
        <Box sx={{ textAlign: { sm: align } }}>
            <Typography id={id} sx={navLabel}>{label}</Typography>
            <Box component="ul" aria-labelledby={id} sx={plainList}>
                {items.map((a) => (
                    <li key={a.slug}>
                        <Box component={Link} href={`/trails/${trailSlug}/${a.slug}/`} sx={navCard}>
                            {a.title}
                        </Box>
                    </li>
                ))}
            </Box>
        </Box>
    );
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
    const p = await params;
    const trail = await getTrail(p.trail);
    if (!trail) notFound();

    const list = allArticles(trail);
    const index = list.findIndex((a) => a.slug === p.article);
    if (index < 0) notFound();

    const article = list[index];
    const map = mapOf(trail, article.slug);
    const links = connections(trail);
    const previous = links.previous.get(article.id)!;
    const next = links.next.get(article.id)!;
    const isStart = previous.length === 0;
    const isEnd = next.length === 0;
    const minutes = readingMinutes(article);
    const nextSide = isEnd ? (
        <Box sx={{ gridColumn: { sm: 2 }, textAlign: { sm: "right" } }}>
            <Typography sx={navLabel}>Finished</Typography>
            <Box component={Link} href={`/trails/${trail.slug}/`} sx={navCard}>
                Back to {trail.title}
            </Box>
        </Box>
    ) : (
        <Box sx={{ gridColumn: { sm: 2 } }}>
            <ArticleLinks
                id="next-articles"
                label={next.length > 1 ? "Next articles" : "Next article"}
                trailSlug={trail.slug}
                items={next}
                align="right"
            />
        </Box>
    );

    return (
        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 10 } }}>
            <Box component="article" sx={{ maxWidth: layout.proseWidth }}>
                <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, letterSpacing: "-0.03em", mb: 2 }}>
                    {article.title}
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 3 }}>
                    {map.title} · Article {index + 1} of {list.length}
                    {minutes > 0 && ` · ${minutes} min read`}
                </Typography>
                {article.intro && <Typography sx={{ fontSize: "1.125rem", lineHeight: 1.6, mb: 5 }}>{article.intro}</Typography>}

                {isStart && trail.prerequisites.length > 0 && (
                    <Callout label="Before you start">
                        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>This trail assumes you can already do the following.</Typography>
                        <ResourceList items={trail.prerequisites} />
                    </Callout>
                )}


                {article.body ? (
                    <Markdown>{article.body}</Markdown>
                ) : (
                    <Typography sx={{ color: "text.secondary", mt: 2 }}>This article has not been written yet.</Typography>
                )}

                {isEnd && trail.nextSteps.length > 0 && (
                    <Box component="section" aria-labelledby="next-steps" sx={{ mt: 6 }}>
                        <Typography id="next-steps" component="h2" sx={{ fontSize: "1.5rem", fontWeight: 640, letterSpacing: "-0.02em", mb: 1.5 }}>
                            Where to go next
                        </Typography>
                        <ResourceList items={trail.nextSteps} />
                    </Box>
                )}

                <Box
                    component="nav"
                    aria-label="Trail navigation"
                    sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, alignItems: "start", gap: 3, mt: 7 }}
                >
                    {!isStart && (
                        <ArticleLinks
                            id="previous-articles"
                            label={previous.length > 1 ? "Learn these first" : "Previous article"}
                            trailSlug={trail.slug}
                            items={previous}
                        />
                    )}
                    {article.body ? (
                        <FinishOnNavigate trailSlug={trail.slug} slug={article.slug}>
                            {nextSide}
                        </FinishOnNavigate>
                    ) : (
                        nextSide
                    )}
                </Box>
            </Box>
        </Container>
    );
}
