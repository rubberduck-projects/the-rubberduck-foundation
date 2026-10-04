"use client";

import { Box } from "@mui/material";
import { palette } from "@/theme/tokens";

export default function DuckMark({ size = 28 }: { size?: number }) {
    return (
        <Box
            component="svg"
            viewBox="0 0 32 32"
            aria-hidden
            focusable="false"
            sx={{ width: size, height: size, display: "block", flexShrink: 0 }}
        >
            <circle cx="16" cy="16" r="15" fill={palette.duck[300]} />
            <path
                d="M11.4 21.6c-1.9-1.1-3-3-3-5.2 0-3.6 3-6.5 6.8-6.5 3.7 0 6.7 2.9 6.7 6.5 0 .5-.1 1-.2 1.5l2.6.5c-.9 2.9-3.7 5-7 5h-5.9z"
                fill={palette.ink[800]}
            />
            <circle cx="18.6" cy="14.2" r="1.25" fill={palette.duck[100]} />
            <path
                d="M22.2 15.8l4.1-1.1c.4-.1.7.3.5.7l-1.6 2.6-3-2.2z"
                fill={palette.duck[600]}
            />
        </Box>
    );
}
