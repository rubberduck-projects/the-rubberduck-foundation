import { createTheme, alpha, type PaletteMode, type ThemeOptions } from "@mui/material/styles";
import { fonts, palette, radius, surfaces } from "./tokens";

declare module "@mui/material/styles" {
    interface Palette {
        surface: ReturnType<typeof surfaces>;
        duck: typeof palette.duck;
        ink: typeof palette.ink;
    }
    interface PaletteOptions {
        surface: ReturnType<typeof surfaces>;
        duck: typeof palette.duck;
        ink: typeof palette.ink;
    }
    interface TypographyVariants {
        mono: React.CSSProperties;
        eyebrow: React.CSSProperties;
        lead: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        mono?: React.CSSProperties;
        eyebrow?: React.CSSProperties;
        lead?: React.CSSProperties;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        mono: true;
        eyebrow: true;
        lead: true;
    }
}

// Fluid type: clamp() so headings scale with the viewport instead of stepping
// at breakpoints — avoids the awkward mid-range where a 56px headline wraps badly.
const typography: ThemeOptions["typography"] = {
    fontFamily: fonts.sans,
    h1: {
        fontSize: "clamp(2.5rem, 1.6rem + 3.9vw, 4.25rem)",
        fontWeight: 680,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
    },
    h2: {
        fontSize: "clamp(1.875rem, 1.35rem + 2.2vw, 2.75rem)",
        fontWeight: 660,
        lineHeight: 1.12,
        letterSpacing: "-0.022em",
    },
    h3: {
        fontSize: "clamp(1.375rem, 1.15rem + 1vw, 1.75rem)",
        fontWeight: 640,
        lineHeight: 1.22,
        letterSpacing: "-0.015em",
    },
    h4: { fontSize: "1.1875rem", fontWeight: 640, lineHeight: 1.32, letterSpacing: "-0.01em" },
    h5: { fontSize: "1.0625rem", fontWeight: 640, lineHeight: 1.4 },
    h6: { fontSize: "0.9375rem", fontWeight: 660, lineHeight: 1.45 },
    lead: {
        fontSize: "clamp(1.0625rem, 0.99rem + 0.33vw, 1.3125rem)",
        lineHeight: 1.58,
        fontWeight: 400,
        letterSpacing: "-0.005em",
    },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.9375rem", lineHeight: 1.6 },
    mono: {
        fontFamily: fonts.mono,
        fontSize: "0.8125rem",
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
    },
    eyebrow: {
        fontFamily: fonts.mono,
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
    },
    button: { fontWeight: 560, textTransform: "none", letterSpacing: "-0.005em" },
    caption: { fontSize: "0.8125rem", lineHeight: 1.5 },
};

export function getTheme(mode: PaletteMode) {
    const isLight = mode === "light";
    const s = surfaces(mode);

    return createTheme({
        palette: {
            mode,
            duck: palette.duck,
            ink: palette.ink,
            surface: s,
            primary: {
                main: isLight ? palette.duck[600] : palette.duck[300],
                light: palette.duck[300],
                dark: palette.duck[700],
                contrastText: isLight ? "#FFFFFF" : palette.ink[900],
            },
            secondary: {
                main: isLight ? palette.pond[500] : palette.pond[300],
            },
            success: { main: palette.moss[500] },
            warning: { main: palette.duck[500] },
            error: { main: palette.rust[500] },
            background: { default: s.canvas, paper: s.raised },
            text: {
                primary: isLight ? palette.ink[800] : palette.ink[50],
                secondary: isLight ? palette.ink[500] : palette.ink[300],
                disabled: isLight ? palette.ink[400] : palette.ink[500],
            },
            divider: s.hairline,
        },
        typography,
        shape: { borderRadius: radius.md },
        // Flat by design: the page reads as print, so elevation is expressed with
        // hairlines and surface shifts instead of shadow stacks.
        shadows: [
            "none",
            `0 1px 2px ${alpha("#1F1C19", isLight ? 0.06 : 0.5)}`,
            `0 2px 6px ${alpha("#1F1C19", isLight ? 0.07 : 0.55)}`,
            `0 6px 20px ${alpha("#1F1C19", isLight ? 0.09 : 0.6)}`,
            `0 14px 44px ${alpha("#1F1C19", isLight ? 0.12 : 0.65)}`,
            ...Array<string>(20).fill(`0 14px 44px ${alpha("#1F1C19", isLight ? 0.12 : 0.65)}`),
        ] as unknown as ThemeOptions["shadows"],
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: { WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" },
                    "::selection": {
                        background: alpha(palette.duck[300], 0.42),
                        color: isLight ? palette.ink[900] : palette.ink[900],
                    },
                    ":focus-visible": {
                        outline: `2px solid ${isLight ? palette.duck[600] : palette.duck[300]}`,
                        outlineOffset: 2,
                        borderRadius: 3,
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                        "*, *::before, *::after": {
                            animationDuration: "0.01ms !important",
                            transitionDuration: "0.01ms !important",
                            scrollBehavior: "auto !important",
                        },
                    },
                },
            },
            MuiTypography: {
                defaultProps: {
                    variantMapping: { mono: "span", eyebrow: "p", lead: "p" },
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: radius.sm + 2,
                        paddingInline: 18,
                        transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
                    },
                    sizeLarge: { paddingBlock: 11, paddingInline: 24, fontSize: "0.975rem" },
                    outlined: { borderColor: s.hairlineStrong },
                },
            },
            MuiPaper: {
                defaultProps: { elevation: 0 },
                styleOverrides: { root: { backgroundImage: "none" } },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontFamily: fonts.mono, fontSize: "0.75rem", fontWeight: 500 },
                },
            },
            MuiLink: {
                defaultProps: { underline: "none" },
                styleOverrides: {
                    root: {
                        transition: "color 140ms ease",
                        textUnderlineOffset: "0.22em",
                    },
                },
            },
            MuiContainer: {
                defaultProps: { maxWidth: false },
            },
        },
    });
}
