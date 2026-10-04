import type { Metadata } from "next";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import { allArticles, totalMinutes, trails } from "@/content/trails";
import { layout } from "@/theme/tokens";

export const metadata: Metadata = {
    title: "DuckTrails | Rubberduck Foundation",
    description: "Choose a topic and follow the trail. Every step builds on the last, and ends with something you can actually do.",
};

export default function TrailsPage() {
    return (
        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 10 } }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "3rem" }, letterSpacing: "-0.03em", mb: 2 }}>
                DuckTrails
            </Typography>
            <Typography sx={{ color: "text.secondary", maxWidth: layout.proseWidth, mb: 2 }}>
                Choose a topic and follow the trail. Every step builds on the last, and ends with something you can
                actually do.
            </Typography>
            <Box
                component={Link}
                href="/how-to/trails/"
                sx={{
                    display: "inline-block",
                    mb: { xs: 5, md: 7 },
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    "&:hover": { textDecoration: "none" },
                    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
                }}
            >
                How to write a DuckTrail
            </Box>

            {trails.length === 0 && (
                <Typography sx={{ color: "text.secondary" }}>No trails yet. Check back soon.</Typography>
            )}

            <Box
                component="ul"
                sx={{
                    listStyle: "none",
                    p: 0,
                    m: 0,
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                }}
            >
                {trails.map((trail) => (
                    <Box component="li" key={trail.slug} sx={{ display: "flex" }}>
                        <Box
                            component={Link}
                            href={`/trails/${trail.slug}/`}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                p: 3,
                                textDecoration: "none",
                                color: "text.primary",
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: "14px",
                                transition: "border-color 160ms ease, transform 160ms ease",
                                "&:hover": { borderColor: "text.disabled", transform: "translateY(-2px)" },
                                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
                                "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
                            }}
                        >
                            <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 640, letterSpacing: "-0.02em", mb: 1 }}>
                                {trail.title}
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1 }}>{trail.destination}</Typography>
                            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                                {trail.maps.length} trail maps · {allArticles(trail).length} articles · {totalMinutes(trail)} min reading
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
