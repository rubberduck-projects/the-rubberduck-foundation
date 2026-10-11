import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import { Suspense } from "react";
import { ArticleDialog, ArticleLinkInterceptor, type DialogArticle } from "@/components/trail/ArticleDialog";
import ResourceList from "@/components/trail/ResourceList";
import { ProgressScope, TrailCta, type ProgressArticle } from "@/components/trail/TrailProgress";
import { TrailTree } from "@/components/trail/TrailTree";
import Markdown from "@/components/ui/Markdown";
import { allArticles, connections, getTrail, getTrails, mapOf, readingMinutes, totalMinutes } from "@/content/trails";
import { layout } from "@/theme/tokens";

type Params = { trail: string };

export async function generateStaticParams(): Promise<Params[]> {
    return (await getTrails()).map((t) => ({ trail: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const trail = await getTrail((await params).trail);
    return trail ? { title: `${trail.title} | Trails`, description: trail.destination } : {};
}

const sectionHeading = { fontSize: "1.125rem", fontWeight: 640, letterSpacing: "-0.01em", mb: 1.5 } as const;

// Fixed locale and zone so the static build prints the same date for every visitor.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function TrailPage({ params }: { params: Promise<Params> }) {
    const trail = await getTrail((await params).trail);
    if (!trail) notFound();

    const articles = allArticles(trail);
    // Drafts cannot be finished, so progress only counts written articles.
    const progressArticles: ProgressArticle[] = articles.filter((a) => a.body).map((a) => ({ slug: a.slug, title: a.title, minutes: readingMinutes(a) }));
    const links = connections(trail);
    const ref = ({ slug, title }: { slug: string; title: string }) => ({ slug, title });
    const dialogArticles: DialogArticle[] = articles.map((a) => ({
        needs: links.previous.get(a.id)!.map(ref),
        slug: a.slug,
        title: a.title,
        minutes: readingMinutes(a),
        intro: a.intro,
        map: mapOf(trail, a.slug).title,
        body: a.body && <Markdown>{a.body}</Markdown>,
    }));

    return (
        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 10 } }}>
            <ProgressScope trailSlug={trail.slug} articles={progressArticles}>
                {/* Same columns as the trail map grid below, so the button lines up with the legend. */}
                <Box
                    component="header"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 300px" },
                        gridTemplateAreas: { xs: `"title" "details" "cta"`, md: `"title cta" "details cta"` },
                        columnGap: 6,
                        rowGap: 3,
                        alignItems: "start",
                    }}
                >
                    <Typography variant="h1" sx={{ gridArea: "title", maxWidth: layout.proseWidth, fontSize: { xs: "2.25rem", md: "3rem" }, letterSpacing: "-0.03em" }}>
                        {trail.title}
                    </Typography>
                    <Box sx={{ gridArea: "details", maxWidth: layout.proseWidth, mt: { md: -1 } }}>
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
                    </Box>
                    {/* Nudged down so the button centers on the first line of the title. */}
                    <Box sx={{ gridArea: "cta", mt: { md: 0.75 } }}>
                        <ArticleLinkInterceptor>
                            <TrailCta trailSlug={trail.slug} articles={progressArticles} />
                        </ArticleLinkInterceptor>
                    </Box>
                </Box>

                {trail.prerequisites.length > 0 && (
                    <Box component="section" aria-labelledby="before-you-start" sx={{ maxWidth: layout.proseWidth, mt: { xs: 5, md: 6 } }}>
                        <Typography id="before-you-start" component="h2" sx={sectionHeading}>Before you start</Typography>
                        <ResourceList items={trail.prerequisites} />
                    </Box>
                )}

                <Box sx={{ mt: { xs: 5, md: 6 } }}>
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
            </ProgressScope>
        </Container>
    );
}
