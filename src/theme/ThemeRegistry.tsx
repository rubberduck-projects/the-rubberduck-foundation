"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeProvider, useColorMode } from "./ColorModeContext";
import { getTheme } from "./theme";

// Static export (output: "export") has no per-request server render, so a plain
// client-side emotion cache is sufficient — no SSR style-flushing machinery needed.
function ThemedApp({ children }: { children: React.ReactNode }) {
    const { mode } = useColorMode();
    const theme = React.useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [cache] = React.useState(() => {
        const emotionCache = createCache({ key: "mui" });
        emotionCache.compat = true;
        return emotionCache;
    });

    return (
        <CacheProvider value={cache}>
            <ColorModeProvider>
                <ThemedApp>{children}</ThemedApp>
            </ColorModeProvider>
        </CacheProvider>
    );
}
