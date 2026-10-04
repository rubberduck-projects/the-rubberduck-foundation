"use client";

import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { GitHub, Forum, RssFeed } from "@mui/icons-material";
import { layout } from "@/theme/tokens";
import DuckMark from "./DuckMark";

const socials = [
    { label: "GitHub", href: "#", Icon: GitHub },
    { label: "Community forum", href: "#", Icon: Forum },
    { label: "RSS feed", href: "#", Icon: RssFeed },
];

export default function SiteFooter() {
    return (
        <Box
            component="footer"
            sx={(t) => ({
                bgcolor: t.palette.surface.sunken,
                borderTop: "1px solid",
                borderColor: t.palette.surface.hairline,
            })}
        >
            <Box
                sx={{
                    maxWidth: layout.maxWidth,
                    mx: "auto",
                    px: { xs: `${layout.gutter.xs}px`, md: `${layout.gutter.md}px` },
                    py: { xs: 1, md: 2 },
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
                >
                    <Typography variant="mono" sx={{ color: "text.disabled" }}>
                        © {new Date().getFullYear()} Rubberduck Foundation · CC BY 4.0
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}
