"use client";

import { useEffect, useRef, useState, useTransition, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Dialog, IconButton, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import OpenInFullRounded from "@mui/icons-material/OpenInFullRounded";
import { palette } from "@/theme/tokens";
import { setDone } from "./progress";

export type DialogArticle = {
    slug: string;
    title: string;
    minutes: number;
    intro?: string;
    map: string;
    body: ReactNode;
    needs: ArticleRef[];
};
type ArticleRef = { slug: string; title: string };

const PARAM = "article";

const inlineLink = {
    color: "primary.main",
    textUnderlineOffset: 3,
    borderRadius: "2px",
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
} as const;

// Closing pops the history entry the tree pushed, so Back never reopens a closed popup.
let pushedFromTrail = false;

// Plain clicks on tree links open the popup; modified clicks and crawlers follow the real article URL.
export function ArticleLinkInterceptor({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const onClickCapture = (e: MouseEvent) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-article]");
        if (!link) return;
        e.preventDefault();
        pushedFromTrail = true;
        router.push(`${pathname}?${PARAM}=${encodeURIComponent(link.dataset.article!)}`, { scroll: false });
    };

    return <div onClickCapture={onClickCapture}>{children}</div>;
}

export function ArticleDialog({ trailSlug, articles }: { trailSlug: string; articles: DialogArticle[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pending, startTransition] = useTransition();
    const [pendingDir, setPendingDir] = useState<"prev" | "next">("next");

    const slug = params.get(PARAM);
    const index = articles.findIndex((a) => a.slug === slug);
    const article = index >= 0 ? articles[index] : undefined;
    const prev = articles[index - 1];
    const next = articles[index + 1];

    const hrefFor = (s: string) => `${pathname}?${PARAM}=${encodeURIComponent(s)}`;
    const go = (s: string, dir: "prev" | "next") => {
        setPendingDir(dir);
        startTransition(() => router.replace(hrefFor(s), { scroll: false }));
    };

    // Moving forward counts as finishing the article; unwritten ones stay open on the trail.
    const finish = () => {
        if (article?.body) setDone(trailSlug, article.slug, true);
    };

    const close = () => {
        if (pushedFromTrail) {
            pushedFromTrail = false;
            router.back();
        } else {
            router.replace(pathname, { scroll: false });
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
        if (!slug) pushedFromTrail = false;
    }, [slug]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("input, textarea")) return;
        // Focus usually sits on the dialog container, so the article pane would not scroll natively.
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            scrollRef.current?.scrollBy({ top: e.key === "ArrowDown" ? 80 : -80, behavior: "smooth" });
            return;
        }
        if (target.closest("pre") || pending) return;
        if (e.key === "ArrowLeft" && prev) go(prev.slug, "prev");
        if (e.key === "ArrowRight" && next) {
            finish();
            go(next.slug, "next");
        }
    };

    const onArticleLink = (e: MouseEvent, s: string, dir: "prev" | "next") => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (!pending) go(s, dir);
    };

    return (
        <Dialog
            open={!!article}
            onClose={close}
            onKeyDown={onKeyDown}
            fullScreen={fullScreen}
            maxWidth={false}
            scroll="paper"
            aria-labelledby="article-dialog-title"
            slotProps={{
                paper: {
                    sx: {
                        width: { sm: "min(960px,calc(100% - 48px))" },
                        maxHeight: { sm: "calc(100% - 64px)" },
                        borderRadius: { sm: "16px" },
                        bgcolor: "background.default",
                        backgroundImage: "none",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            {article && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: { xs: 2, sm: 3 },
                            py: 1.25,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Box
                            aria-hidden
                            sx={{
                                minWidth: 28,
                                height: 28,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                border: `2px solid ${palette.duck[500]}`,
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                            }}
                        >
                            {index + 1}
                        </Box>
                        <Typography sx={{ flex: 1, minWidth: 0, fontSize: "0.8125rem", color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            Article {index + 1} of {articles.length} · {article.map}
                        </Typography>
                        <IconButton component={Link} href={`/ducktrails/${trailSlug}/${article.slug}/`} aria-label="Open full page" size="small">
                            <OpenInFullRounded fontSize="small" />
                        </IconButton>
                        <IconButton onClick={close} aria-label="Close" size="small">
                            <CloseRounded fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box sx={{ height: 3, flexShrink: 0 }}>
                        {pending && <LinearProgress aria-label="Loading article" sx={{ height: 3 }} />}
                    </Box>

                    <Box
                        ref={scrollRef}
                        component="article"
                        aria-busy={pending}
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            px: { xs: 2.5, sm: 5 },
                            pt: { xs: 3, sm: 4 },
                            pb: 4,
                            opacity: pending ? 0.45 : 1,
                            transition: "opacity 150ms ease",
                            pointerEvents: pending ? "none" : undefined,
                        }}
                    >
                        <Typography id="article-dialog-title" component="h2" sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" }, fontWeight: 680, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                            {article.title}
                        </Typography>
                        {article.minutes > 0 && <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 1 }}>{article.minutes} min read</Typography>}
                        {article.needs.length > 0 && (
                            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
                                Learn first:{" "}
                                {article.needs.map((n, i) => (
                                    <span key={n.slug}>
                                        {i > 0 && ", "}
                                        <Box component="a" href={`/ducktrails/${trailSlug}/${n.slug}/`} onClick={(e: MouseEvent) => onArticleLink(e, n.slug, "prev")} sx={inlineLink}>
                                            {n.title}
                                        </Box>
                                    </span>
                                ))}
                            </Typography>
                        )}
                        {article.intro && <Typography sx={{ fontSize: "1.0625rem", lineHeight: 1.6, mt: 2.5 }}>{article.intro}</Typography>}

                        <Box sx={{ mt: 4 }}>
                            {article.body ?? <Typography sx={{ color: "text.secondary" }}>This article has not been written yet.</Typography>}
                        </Box>
                    </Box>

                    <Box
                        component="nav"
                        aria-label="Article navigation"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            px: { xs: 1.5, sm: 3 },
                            py: 1.25,
                            borderTop: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Button
                            href={prev ? `/ducktrails/${trailSlug}/${prev.slug}/` : undefined}
                            onClick={(e: MouseEvent) => prev && onArticleLink(e, prev.slug, "prev")}
                            disabled={!prev}
                            loading={pending && pendingDir === "prev"}
                            loadingPosition="start"
                            startIcon={<ChevronLeftRounded />}
                            sx={{ textTransform: "none", minWidth: 0 }}
                        >
                            Previous
                        </Button>
                        <Typography aria-hidden sx={{ display: { xs: "none", sm: "block" }, fontSize: "0.75rem", color: "text.secondary" }}>
                            Use ← → to switch articles and ↑ ↓ to scroll
                        </Typography>
                        {next ? (
                            <Button
                                href={`/ducktrails/${trailSlug}/${next.slug}/`}
                                onClick={(e: MouseEvent) => {
                                    finish();
                                    onArticleLink(e, next.slug, "next");
                                }}
                                loading={pending && pendingDir === "next"}
                                loadingPosition="end"
                                endIcon={<ChevronRightRounded />}
                                variant="contained"
                                disableElevation
                                sx={{ textTransform: "none", minWidth: 0 }}
                            >
                                Next article
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    finish();
                                    close();
                                }}
                                variant="contained" disableElevation sx={{ textTransform: "none", minWidth: 0 }}>
                                Back to the map
                            </Button>
                        )}
                    </Box>
                </>
            )}
        </Dialog>
    );
}
