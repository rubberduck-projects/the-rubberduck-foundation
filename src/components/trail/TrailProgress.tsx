"use client";

import type { MouseEvent, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { clearProgress, setDone, useDone } from "./progress";

export type ProgressArticle = { slug: string; title: string; minutes: number };

function useProgress(trailSlug: string, articles: ProgressArticle[]) {
    const done = useDone(trailSlug);
    const doneHere = articles.filter((a) => done.includes(a.slug));
    const next = articles.find((a) => !done.includes(a.slug));
    return { done: doneHere, next };
}

// The tree is server rendered; it styles done and next articles from these attributes.
export function ProgressScope({ trailSlug, articles, children }: { trailSlug: string; articles: ProgressArticle[]; children: ReactNode }) {
    const { done, next } = useProgress(trailSlug, articles);
    return (
        <div data-done={done.map((a) => a.slug).join(" ")} data-next={done.length > 0 ? next?.slug : undefined} data-started={done.length > 0 || undefined}>
            {children}
        </div>
    );
}

const small = { fontSize: "0.8125rem", color: "text.secondary" } as const;

export function TrailCta({ trailSlug, articles }: { trailSlug: string; articles: ProgressArticle[] }) {
    const { done, next } = useProgress(trailSlug, articles);
    const target = next ?? articles.at(-1);
    if (!target) return null;
    const started = done.length > 0;
    const label = !started ? "Start the trail" : next ? "Continue the trail" : "Revisit the proof project";
    const note = !started ? "First up" : next ? "Up next" : "You finished every article";

    const clear = () => {
        if (window.confirm("Clear your progress on this trail? This cannot be undone.")) clearProgress(trailSlug);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 2, rowGap: 1 }}>
                <Button
                    href={`/ducktrails/${trailSlug}/${target.slug}/`}
                    data-article={target.slug}
                    variant="contained"
                    disableElevation
                    size="large"
                    endIcon={<ArrowForwardRounded />}
                    disableFocusRipple
                    sx={{ textTransform: "none", fontWeight: 640, "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 } }}
                >
                    {label}
                </Button>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                    {next ? `${note}: ${target.title}${target.minutes > 0 ? `, ${target.minutes} min` : ""}` : note}
                </Typography>
            </Box>
            {started && (
                <Typography sx={{ ...small, mt: 1.25, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
                    <span>
                        {done.length} of {articles.length} articles done, saved in this browser.
                    </span>
                    <Box
                        component="button"
                        type="button"
                        onClick={clear}
                        sx={{
                            p: 0,
                            border: 0,
                            bgcolor: "transparent",
                            font: "inherit",
                            color: "text.secondary",
                            textDecoration: "underline",
                            textUnderlineOffset: 3,
                            cursor: "pointer",
                            borderRadius: "4px",
                            "&:hover": { color: "text.primary" },
                            "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                        }}
                    >
                        Clear progress
                    </Box>
                </Typography>
            )}
        </Box>
    );
}

// Following a next link counts as finishing the article. display: contents keeps the parent grid intact.
export function FinishOnNavigate({ trailSlug, slug, children }: { trailSlug: string; slug: string; children: ReactNode }) {
    const onClickCapture = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("a")) setDone(trailSlug, slug, true);
    };
    return (
        <div onClickCapture={onClickCapture} style={{ display: "contents" }}>
            {children}
        </div>
    );
}
