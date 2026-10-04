"use client";

import { useEffect, useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { useColorMode } from "@/theme/ColorModeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { layout, palette } from "@/theme/tokens";
import DuckMark from "./DuckMark";

export default function SiteHeader() {
    const { mode, toggleColorMode } = useColorMode();
    const onTrails = usePathname().startsWith("/trails");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
            <AppBar
                position="sticky"
                color="transparent"
                elevation={0}
                sx={(t) => ({
                    backdropFilter: "saturate(180%) blur(12px)",
                    bgcolor:
                        t.palette.mode === "light"
                            ? "rgba(251, 250, 247, 0.82)"
                            : "rgba(18, 17, 16, 0.82)",
                    borderColor: scrolled ? t.palette.surface.hairline : "transparent",
                    transition: "border-color 200ms ease",
                })}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        maxWidth: layout.maxWidth,
                        width: "100%",
                        mx: "auto",
                        px: { xs: `${layout.gutter.xs}px`, md: `${layout.gutter.md}px` },
                        minHeight: { xs: 60, md: 68 },
                        gap: 2,
                    }}
                >
                    <Box
                        component={Link}
                        href="/"
                        aria-label="Rubberduck Foundation, home"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.25,
                            textDecoration: "none",
                            color: "text.primary",
                            mr: "auto",
                        }}
                    >
                        <DuckMark size={26} />
                        <Typography
                            component="span"
                            sx={{ fontWeight: 640, letterSpacing: "-0.02em", fontSize: "1.0625rem" }}
                        >
                            Rubberduck
                        </Typography>
                    </Box>

                    <Box component="nav" aria-label="Primary">
                        <Box
                            component={Link}
                            href="/trails/"
                            aria-current={onTrails ? "page" : undefined}
                            sx={(t) => ({
                                px: 1.5,
                                py: 0.75,
                                fontSize: "0.9375rem",
                                fontWeight: onTrails ? 600 : 500,
                                color: onTrails ? "text.primary" : "text.secondary",
                                textDecoration: "none",
                                borderBottom: "2px solid",
                                borderColor: onTrails ? palette.duck[400] : "transparent",
                                "&:hover": { color: "text.primary" },
                                "&:focus-visible": { outline: "2px solid", outlineColor: t.palette.primary.main, outlineOffset: 2 },
                            })}
                        >
                            Trails
                        </Box>
                    </Box>

                    <IconButton
                        onClick={toggleColorMode}
                        size="small"
                        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
                        sx={{ color: "text.secondary" }}
                    >
                        {mode === "light" ? (
                            <DarkModeOutlined fontSize="small" />
                        ) : (
                            <LightModeOutlined fontSize="small" />
                        )}
                    </IconButton>
                </Toolbar>
            </AppBar>
    );
}
