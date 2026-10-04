"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { PaletteMode } from "@mui/material";

type ColorModeContextValue = {
    mode: PaletteMode;
    toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

const STORAGE_KEY = "rd-color-mode";

// Runs before paint so the first frame already has the right palette.
export const colorModeInitScript = `(function(){try{var m=localStorage.getItem("${STORAGE_KEY}");if(m!=="light"&&m!=="dark"){m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.colorMode=m;document.documentElement.style.colorScheme=m}catch(e){}})()`;

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>("light");

    useEffect(() => {
        const initial = document.documentElement.dataset.colorMode;
        if (initial === "light" || initial === "dark") setMode(initial);
    }, []);

    const toggleColorMode = useCallback(() => {
        setMode((prev) => {
            const next: PaletteMode = prev === "light" ? "dark" : "light";
            try {
                window.localStorage.setItem(STORAGE_KEY, next);
            } catch {}
            document.documentElement.dataset.colorMode = next;
            document.documentElement.style.colorScheme = next;
            return next;
        });
    }, []);

    const value = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode]);

    return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error("useColorMode must be used within a ColorModeProvider");
    }
    return ctx;
}
