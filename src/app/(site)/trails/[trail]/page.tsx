import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import { Suspense } from "react";
import { ArticleDialog, ArticleLinkInterceptor, type DialogArticle } from "@/components/trail/ArticleDialog";
import ResourceList from "@/components/trail/ResourceList";
import { TrailTree } from "@/components/trail/TrailTree";
import Markdown from "@/components/ui/Markdown";
import { allArticles, getTrail, mapOf, readingMinutes, totalMinutes, trails } from "@/content/trails";
import { layout } from "@/theme/tokens";

type Params = { trail: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return trails.map((t) => ({ trail: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const trail = getTrail((await params).trail);
    return trail ? { title: `${trail.title} | Trails`, description: trail.destination } : {};
}

const sectionHeading = { fontSize: "1.125rem", fontWeight: 640, letterSpacing: "-0.01em", mb: 1.5 } as const;

// Fixed locale and zone so the static build prints the same date for every visitor.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function TrailPage({ params }: { params: Promise<Params> }) {
    const trail = getTrail((await params).trail);
    if (!trail) notFound();

    const articles = allArticles(trail);
    const first = articles[0];
    const dialogArticles: DialogArticle[] = articles.map((a) => ({
        slug: a.slug,
        title: a.title,
        minutes: readingMinutes(a),
        intro: a.intro,
        map: mapOf(trail, a.slug).title,
        body: a.body && <Markdown>{a.body}</Markdown>,
    }));

    return (
        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 10 } }}>
            <Box sx={{ maxWidth: layout.proseWidth }}>
                <Typography variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "3rem" }, letterSpacing: "-0.03em", mb: 2 }}>
                    {trail.title}
                </Typography>
                <Typography sx={{ fontSize: "1.125rem", lineHeight: 1.6, mb: 1.5 }}>{trail.destination}</Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                    {trail.maps.length} trail maps · {articles.length} articles · {totalMinutes(trail)} min reading, plus a task to try in each article
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5, display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                    <VerifiedRounded aria-hidden sx={{ fontSize: 16, color: "success.main" }} />
                    <span>
                        Last verified <time dateTime={trail.verifiedAt}>{formatDate(trail.verifiedAt)}</time>
                        {trail.updatedAt > trail.verifiedAt && (
                            <>, changed since on <time dateTime={trail.updatedAt}>{formatDate(trail.updatedAt)}</time></>
                        )}
                    </span>
                </Typography>

                <ArticleLinkInterceptor>
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 2, rowGap: 1, mt: 3, mb: { xs: 5, md: 6 } }}>
                        <Button
                            href={`/trails/${trail.slug}/${first.slug}/`}
                            data-article={first.slug}
                            variant="contained"
                            disableElevation
                            size="large"
                            endIcon={<ArrowForwardRounded />}
                            sx={{ textTransform: "none", fontWeight: 640 }}
                        >
                            Start the trail
                        </Button>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                            First up: {first.title}
                            {readingMinutes(first) > 0 && `, ${readingMinutes(first)} min`}
                        </Typography>
                    </Box>
                </ArticleLinkInterceptor>

                {trail.prerequisites.length > 0 && (
                    <Box component="section" aria-labelledby="before-you-start" sx={{ mb: { xs: 5, md: 7 } }}>
                        <Typography id="before-you-start" component="h2" sx={sectionHeading}>Before you start</Typography>
                        <ResourceList items={trail.prerequisites} />
                    </Box>
                )}
            </Box>

            <Box sx={{ maxWidth: 880 }}>
                <ArticleLinkInterceptor>
                    <TrailTree trail={trail} />
                </ArticleLinkInterceptor>
            </Box>

            {/* Query params only exist in the browser on a static export, so the popup renders client side; crawlers follow the real article URLs. */}
            <Suspense fallback={null}>
                <ArticleDialog trailSlug={trail.slug} articles={dialogArticles} />
            </Suspense>

            <Box sx={{ maxWidth: layout.proseWidth }}>
                {trail.nextSteps.length > 0 && (
                    <Box component="section" aria-labelledby="after-this-trail" sx={{ mt: { xs: 6, md: 8 } }}>
                        <Typography id="after-this-trail" component="h2" sx={sectionHeading}>After this trail</Typography>
                        <ResourceList items={trail.nextSteps} />
                    </Box>
                )}
            </Box>
        </Container>
    );
}
