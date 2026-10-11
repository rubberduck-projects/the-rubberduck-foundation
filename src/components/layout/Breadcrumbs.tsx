"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Container } from "@mui/material";
import { ArrowBack, ChevronRight } from "@mui/icons-material";
import { layout } from "@/theme/tokens";

export type CrumbTitles = Record<string, { title: string; articles: Record<string, string> }>;
type Crumb = { label: string; href: string };

function crumbsFor(pathname: string, titles: CrumbTitles): Crumb[] {
    const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
    if (path === "/") return [];

    const crumbs: Crumb[] = [{ label: "Trails", href: "/ducktrails/" }];
    if (path === "/how-to/trails/") crumbs.push({ label: "How to write a DuckTrail", href: path });

    const [, section, trailSlug, articleSlug] = path.split("/");
    const trail = section === "ducktrails" && trailSlug ? titles[trailSlug] : undefined;
    if (trail) {
        crumbs.push({ label: trail.title, href: `/ducktrails/${trailSlug}/` });
        const article = articleSlug && trail.articles[articleSlug];
        if (article) crumbs.push({ label: article, href: `/ducktrails/${trailSlug}/${articleSlug}/` });
    }
    return crumbs;
}

const linkSx = {
    color: "inherit",
    textDecoration: "none",
    borderRadius: "4px",
    transition: "color 160ms ease",
    "&:hover": { color: "text.primary" },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
} as const;

export default function Breadcrumbs({ titles }: { titles: CrumbTitles }) {
    const crumbs = crumbsFor(usePathname(), titles);
    if (crumbs.length < 2) return null;

    const parent = crumbs[crumbs.length - 2];
    const current = crumbs[crumbs.length - 1];
    const ancestors = crumbs.slice(0, -1);

    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: layout.maxWidth,
                pt: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                minHeight: 40,
                fontSize: "0.8125rem",
                color: "text.disabled",
                transition: "color 160ms ease",
                "&:hover, &:focus-within": { color: "text.secondary" },
            }}
        >
            <Box
                component={Link}
                href={parent.href}
                aria-label={`Back to ${parent.label}`}
                title={`Back to ${parent.label}`}
                sx={{
                    ...linkSx,
                    flexShrink: 0,
                    display: "inline-flex",
                    p: 0.5,
                    ml: -0.5,
                }}
            >
                <ArrowBack sx={{ fontSize: 18 }} aria-hidden />
            </Box>

            <Box component="nav" aria-label="Breadcrumb" sx={{ minWidth: 0 }}>
                <Box
                    component="ol"
                    sx={{ listStyle: "none", m: 0, p: 0, display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}
                >
                    {ancestors.map((c) => (
                        <Box
                            component="li"
                            key={c.href}
                            sx={{ display: { xs: "none", sm: "inline-flex" }, alignItems: "center", gap: 0.5, flexShrink: 0 }}
                        >
                            <Box component={Link} href={c.href} sx={{ ...linkSx, whiteSpace: "nowrap" }}>
                                {c.label}
                            </Box>
                            <ChevronRight aria-hidden sx={{ fontSize: 14 }} />
                        </Box>
                    ))}
                    <Box
                        component="li"
                        aria-current="page"
                        title={current.label}
                        sx={{
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {current.label}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
