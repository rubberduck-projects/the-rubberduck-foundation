import type { PaletteMode } from "@mui/material";

// Duck yellow is a marker, not a surface. It underlines, bullets, and rules —
// it never fills a large area, which keeps contrast honest against warm paper.
export const palette = {
    duck: {
        50: "#FDF6E3",
        100: "#FAE9BC",
        200: "#F6D882",
        300: "#F2C64A",
        400: "#EDB01B",
        500: "#D99406",
        600: "#B67704",
        700: "#8C5A06",
    },
    ink: {
        50: "#F7F6F3",
        100: "#EDEBE5",
        200: "#DDD9D0",
        300: "#BDB7AA",
        400: "#8C857A",
        500: "#635D54",
        600: "#45403A",
        700: "#2E2A26",
        800: "#1F1C19",
        900: "#141210",
    },
    pond: {
        300: "#7FB3C8",
        500: "#2E7D9A",
        700: "#1B4E61",
    },
    moss: {
        500: "#4E7A4A",
    },
    rust: {
        500: "#A8472A",
    },
    plum: {
        500: "#7E5BB0",
    },
    berry: {
        500: "#B5487A",
    },
} as const;

export const space = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160] as const;

export const radius = {
    sm: 4,
    md: 8,
    lg: 14,
    pill: 999,
} as const;

export const fonts = {
    sans: "var(--font-sans), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "var(--font-mono), ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, monospace",
};

export const layout = {
    maxWidth: 1160,
    proseWidth: 680,
    gutter: { xs: 20, md: 40 },
};

type Surfaces = {
    canvas: string;
    raised: string;
    sunken: string;
    inverse: string;
    hairline: string;
    hairlineStrong: string;
};

export function surfaces(mode: PaletteMode): Surfaces {
    return mode === "light"
        ? {
              canvas: "#FBFAF7",
              raised: "#FFFFFF",
              sunken: palette.ink[50],
              inverse: palette.ink[800],
              hairline: "rgba(31, 28, 25, 0.10)",
              hairlineStrong: "rgba(31, 28, 25, 0.18)",
          }
        : {
              canvas: "#121110",
              raised: "#1A1917",
              sunken: "#0D0C0B",
              inverse: palette.ink[50],
              hairline: "rgba(237, 235, 229, 0.12)",
              hairlineStrong: "rgba(237, 235, 229, 0.22)",
          };
}
