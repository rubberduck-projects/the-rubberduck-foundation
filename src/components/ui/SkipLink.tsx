"use client";

import { Box } from "@mui/material";

export default function SkipLink() {
    return (
        <Box
            component="a"
            href="#main"
            sx={(t) => ({
                position: "absolute",
                left: 12,
                top: -100,
                zIndex: t.zIndex.tooltip + 1,
                px: 2,
                py: 1.25,
                borderRadius: 1,
                bgcolor: t.palette.surface.raised,
                border: "1px solid",
                borderColor: t.palette.surface.hairlineStrong,
                color: t.palette.text.primary,
                fontSize: "0.875rem",
                fontWeight: 560,
                textDecoration: "none",
                transition: "top 140ms ease",
                "&:focus-visible": { top: 12 },
            })}
        >
            Skip to content
        </Box>
    );
}
