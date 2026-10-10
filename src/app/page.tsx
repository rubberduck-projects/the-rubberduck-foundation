import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import HandymanRounded from "@mui/icons-material/HandymanRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import LoopRounded from "@mui/icons-material/LoopRounded";
import FormatQuoteRounded from "@mui/icons-material/FormatQuoteRounded";
import ArticleRounded from "@mui/icons-material/ArticleRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import DatasetRounded from "@mui/icons-material/DatasetRounded";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import DuckMark from "@/components/layout/DuckMark";
import SkipLink from "@/components/ui/SkipLink";
import { allArticles, getTrails, totalMinutes, type Trail } from "@/content/trails";
import { layout, palette } from "@/theme/tokens";

// Same cadence as the trail pages, so the featured trails never lag behind /trails/ by more than a minute.
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Rubberduck Foundation | Learn, build and connect for free",
    description:
        "The Rubberduck Foundation builds the free alternative for learning, building and community. Writing, playbooks, software and open data, tested in public and open to reuse.",
};

const container = { maxWidth: layout.maxWidth, px: { xs: `${layout.gutter.xs}px`, md: `${layout.gutter.md}px` } } as const;
const focusRing = { "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 } } as const;

// Same locale and zone as the trail page so both print the same date.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="eyebrow" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: palette.duck[400] }} />
            {children}
        </Typography>
    );
}

const pond = palette.pond[500];
const moss = palette.moss[500];
const amber = palette.duck[600];

// Positions are percentages of the illustration box; the path below threads through the same points.
const stops = [
    { x: 20, y: 11, color: pond, state: "done" },
    { x: 66, y: 24, color: pond, state: "done" },
    { x: 36, y: 44, color: moss, state: "next" },
    { x: 74, y: 58, color: moss, state: "open" },
    { x: 34, y: 76, color: amber, state: "open" },
    { x: 72, y: 90, color: amber, state: "finish" },
] as const;

const trailPath = stops
    .map((s, i) => {
        if (i === 0) return `M${s.x} ${s.y}`;
        const p = stops[i - 1];
        const midY = (p.y + s.y) / 2;
        return `C${p.x} ${midY} ${s.x} ${midY} ${s.x} ${s.y}`;
    })
    .join(" ");

const ribbon = {
    position: "absolute",
    left: "50%",
    bottom: -7,
    transform: "translateX(-50%)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.625rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1,
    px: 0.75,
    py: 0.375,
    borderRadius: "999px",
    bgcolor: palette.ink[800],
    color: palette.duck[200],
    whiteSpace: "nowrap",
} as const;

function TrailIllustration() {
    return (
        <Box
            aria-hidden
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: 440,
                mx: "auto",
                aspectRatio: { xs: "1 / 1", md: "4 / 5" },
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: 3,
            }}
        >
            {/* A faint dot grid, like the paper of a printed map. */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    color: "surface.hairlineStrong",
                    backgroundImage: "radial-gradient(currentColor 1px, transparent 1.2px)",
                    backgroundSize: "18px 18px",
                }}
            />
            <Box component="svg" viewBox="0 0 100 100" preserveAspectRatio="none" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <Box component="path" d={trailPath} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" sx={{ color: "surface.hairlineStrong", strokeWidth: 10, strokeLinecap: "round" }} />
                <Box component="path" d={trailPath} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" sx={{ color: "text.disabled", strokeWidth: 2, strokeLinecap: "round" }} />
            </Box>

            {stops.map((s, i) => {
                const isDone = s.state === "done";
                const isNext = s.state === "next";
                const isFinish = s.state === "finish";
                return (
                    <Box key={i} sx={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}>
                        <Box sx={{ position: "relative", p: "4px", borderRadius: "50%", bgcolor: "surface.sunken" }}>
                            {isNext && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        border: `2px solid ${palette.duck[400]}`,
                                        animation: "trail-pulse 2.4s ease-out infinite",
                                    }}
                                />
                            )}
                            <Box
                                sx={{
                                    width: { xs: 42, sm: 50 },
                                    height: { xs: 42, sm: 50 },
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    border: `3px solid ${s.color}`,
                                    bgcolor: isDone ? s.color : isFinish ? palette.ink[800] : isNext ? palette.duck[300] : "background.paper",
                                    color: isDone ? "#fff" : isFinish ? palette.duck[300] : isNext ? palette.ink[900] : "text.primary",
                                    boxShadow: `0 3px 0 ${s.color}`,
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                }}
                            >
                                {isDone ? <CheckRounded sx={{ fontSize: 26 }} /> : isFinish ? <EmojiEventsRounded sx={{ fontSize: 24 }} /> : i + 1}
                            </Box>
                            {(isNext || isFinish) && <Box component="span" sx={ribbon}>{isNext ? "Next" : "Finish"}</Box>}
                        </Box>
                    </Box>
                );
            })}

            {/* The duck waits beside the next article, asking for the explanation every article ends with. */}
            <Box sx={{ position: "absolute", left: "4%", top: "44%", transform: "translateY(calc(17px - 100%))", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.75 }}>
                <Box
                    sx={{
                        maxWidth: 90,
                        px: 1.25,
                        py: 0.75,
                        borderRadius: "10px 10px 10px 2px",
                        bgcolor: "text.primary",
                        color: "background.paper",
                        fontSize: "0.75rem",
                        fontWeight: 560,
                        lineHeight: 1.3,
                        boxShadow: 2,
                    }}
                >
                    Explain it back to me?
                </Box>
                <DuckMark size={34} />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: "999px",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    boxShadow: 1,
                }}
            >
                <VerifiedRounded sx={{ fontSize: 16, color: "success.main" }} />
                Last verified this month
            </Box>
        </Box>
    );
}

function Hero() {
    return (
        <Box
            component="section"
            aria-labelledby="hero-title"
            sx={{
                position: "relative",
                overflow: "hidden",
                borderBottom: "1px solid",
                borderColor: "divider",
                // A soft wash of duck yellow behind the illustration, kept faint so it marks rather than fills.
                backgroundImage: `radial-gradient(60% 70% at 85% 30%, ${palette.duck[300]}24, transparent 70%)`,
            }}
        >
            <Container
                sx={{
                    ...container,
                    pt: { xs: 5, md: 9 },
                    pb: { xs: 7, md: 11 },
                    display: "grid",
                    gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.15fr) minmax(0, 0.85fr)" },
                    columnGap: 8,
                    rowGap: 6,
                    alignItems: "center",
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 3,
                            pl: 0.5,
                            pr: 1.5,
                            py: 0.5,
                            borderRadius: "999px",
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                        }}
                    >
                        <DuckMark size={22} />
                        <Typography component="span" sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                            Rubberduck Foundation
                        </Typography>
                        <Typography component="span" sx={{ fontSize: "0.8125rem", color: "text.secondary", display: { xs: "none", sm: "inline" } }}>
                            Free, open and kept honest
                        </Typography>
                    </Box>

                    <Typography id="hero-title" variant="h1" sx={{ mb: 3, maxWidth: 640, textWrap: "balance" }}>
                        Go from curious to{" "}
                        <Box component="span" sx={{ whiteSpace: "nowrap", px: 1, mx: -1, borderRadius: "8px", bgcolor: `${palette.duck[300]}80` }}>
                            capable
                        </Box>
                        , wherever you start.
                    </Typography>

                    <Typography variant="lead" sx={{ color: "text.secondary", maxWidth: 560, mb: 4 }}>
                        Learning, building and community for developers with no course budget, no network. Our writing and playbooks are free to read, open to reuse, and
                        checked to still work.
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                        <Button component={Link} href="/trails/" variant="contained" size="large" endIcon={<ArrowForwardRounded />} sx={{ ...focusRing }}>
                            Explore the trails
                        </Button>
                        <Button component="a" href="#what-we-build" variant="outlined" size="large" color="inherit" sx={{ ...focusRing }}>
                            What we build
                        </Button>
                    </Box>

                </Box>

                <TrailIllustration />
            </Container>
        </Box>
    );
}

const duckReasons = [
    { title: "Saying it out loud shows its shape.", body: "Explaining a problem forces its structure into the open, often before you reach the end of the sentence." },
    { title: "The duck never makes you feel stupid.", body: "No question is too small to ask. That is the kind of place we are building." },
];

const anywhere = ["Slow connections", "Machines without admin rights", "Languages other than English"];

function Foundation() {
    return (
        <Box component="section" aria-labelledby="foundation-title">
            <Container sx={{ ...container, py: { xs: 8, md: 12 } }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.1fr) minmax(0, 0.9fr)" },
                        gap: { xs: 5, md: 10 },
                        alignItems: "start",
                    }}
                >
                    <Box>
                        <Eyebrow>Why the Rubberduck Foundation exists</Eyebrow>
                        <Typography id="foundation-title" variant="h2" sx={{ mb: 3, maxWidth: 620, textWrap: "balance" }}>
                            Most of what makes a developer good is rarely said out loud.
                        </Typography>
                        <Typography variant="lead" sx={{ color: "text.secondary", mb: 2.5, maxWidth: 580 }}>
                            It surfaces as an aside in a code review, as a habit one senior engineer never thinks to explain, as an
                            answer in a private chat that someone learned the hard way, or as the part of a course that costs a
                            month&apos;s rent. It stays unsaid because repeating it and keeping it current does not pay.
                        </Typography>
                        <Typography sx={{ color: "text.secondary", maxWidth: 580 }}>
                            The Rubberduck Foundation builds the free alternative to all of it: learning, building and community.
                            Here the unspoken gets said out loud, then tested and maintained so free never quietly means worse.
                            Knowledge kept private stays small.
                            Knowledge made public, tested and maintained compounds. We are building for the compounding.
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "16px", bgcolor: palette.ink[800], color: palette.ink[50], position: "relative", overflow: "hidden" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                            <DuckMark size={40} />
                            <Typography variant="mono" sx={{ color: palette.duck[300], fontWeight: 600 }}>
                                Why a rubber duck?
                            </Typography>
                        </Box>
                        <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3 }}>
                            {duckReasons.map((r, i) => (
                                <Box component="li" key={r.title} sx={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 1.5 }}>
                                    <Box
                                        aria-hidden
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            display: "grid",
                                            placeItems: "center",
                                            bgcolor: palette.duck[300],
                                            color: palette.ink[900],
                                            fontFamily: "var(--font-mono)",
                                            fontWeight: 700,
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                    <Box>
                                        <Typography component="h3" variant="h6" sx={{ mb: 0.5 }}>
                                            {r.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: palette.ink[200] }}>
                                            {r.body}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Box
                    component="figure"
                    sx={{
                        m: 0,
                        mt: { xs: 7, md: 10 },
                        pt: { xs: 5, md: 6 },
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
                        gap: { xs: 2, md: 4 },
                        alignItems: "start",
                    }}
                >
                    <FormatQuoteRounded aria-hidden sx={{ fontSize: 48, color: palette.duck[400], transform: "scaleX(-1)" }} />
                    <Box>
                        <Box component="blockquote" sx={{ m: 0 }}>
                            <Typography component="p" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 620, letterSpacing: "-0.02em", lineHeight: 1.25, maxWidth: 860, textWrap: "balance" }}>
                                To help people learn, build and connect, by the easiest path that still leaves something worth keeping.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

const pillars = [
    {
        Icon: SchoolRounded,
        color: pond,
        name: "Learn",
        title: "Paths that say what they assume.",
        body: "Maintained writing and playbooks that tell you what to know first, what you will be able to do after, and when they were last checked to still work.",
        items: ["Published as trails you can read today", "What you need first, stated up front", "A last verified date on every trail"],
        live: true,
    },
    {
        Icon: HandymanRounded,
        color: moss,
        name: "Build",
        title: "Start building in one sitting.",
        body: "Low ceremony entry, real scaffolding, and a sandbox where nothing is at stake while you find out whether the idea holds.",
        items: ["Working starter code, not a slide deck", "A clear seam where your part begins", "A free sandbox you can throw away"],
        live: false,
    },
    {
        Icon: GroupsRounded,
        color: amber,
        name: "Connect",
        title: "Circles, not crowds.",
        body: "Small groups around a topic, a technology or a city. Small enough that no one is anonymous, large enough that no one is a bottleneck.",
        items: ["Open sessions and mentorship", "A public commons, answered within a day", "Answers that stay searchable afterwards"],
        live: false,
    },
];

const loop = ["A path", "hands you off to a build", "that raises questions a Circle answers", "and the best answers become a path"];

function Pillars() {
    return (
        <Box component="section" id="what-we-build" aria-labelledby="pillars-title" sx={{ scrollMarginTop: 80, bgcolor: "surface.sunken", borderBlock: "1px solid", borderColor: "divider" }}>
            <Container sx={{ ...container, py: { xs: 8, md: 12 } }}>
                <Eyebrow>What the Foundation builds</Eyebrow>
                <Typography id="pillars-title" variant="h2" sx={{ maxWidth: 680, mb: { xs: 5, md: 7 }, textWrap: "balance" }}>
                    Learn, build, connect. Each one feeds the next.
                </Typography>

                <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
                    {pillars.map(({ Icon, color, name, title, body, items, live }) => (
                        <Box
                            component="li"
                            key={name}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                p: { xs: 3, md: 4 },
                                borderRadius: "16px",
                                border: "1px solid",
                                borderColor: live ? color : "divider",
                                bgcolor: "background.paper",
                                boxShadow: live ? `0 4px 0 ${color}` : "none",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Box
                                    aria-hidden
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        border: `3px solid ${color}`,
                                        boxShadow: `0 3px 0 ${color}`,
                                        bgcolor: live ? palette.duck[300] : "background.paper",
                                        color: live ? palette.ink[900] : "text.primary",
                                    }}
                                >
                                    <Icon sx={{ fontSize: 24 }} />
                                </Box>
                                {live && (
                                    <Box
                                        component="span"
                                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.5, borderRadius: "999px", bgcolor: palette.ink[800], color: palette.duck[200], ...ribbonText }}
                                    >
                                        <DuckMark size={14} />
                                        Open now
                                    </Box>
                                )}
                            </Box>
                            <Typography variant="mono" component="p" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
                                {name}
                            </Typography>
                            <Typography component="h3" variant="h4" sx={{ mb: 1.25 }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                                {body}
                            </Typography>
                            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: live ? 3 : 0, display: "grid", gap: 1, flexGrow: 1, alignContent: "start" }}>
                                {items.map((item) => (
                                    <Box component="li" key={item} sx={{ display: "flex", gap: 1, fontSize: "0.875rem" }}>
                                        <CheckRounded aria-hidden sx={{ fontSize: 18, color, mt: "1px", flexShrink: 0 }} />
                                        {item}
                                    </Box>
                                ))}
                            </Box>
                            {live && (
                                <Button component={Link} href="/trails/" variant="contained" endIcon={<ArrowForwardRounded />} sx={{ alignSelf: "flex-start", ...focusRing }}>
                                    Explore the trails
                                </Button>
                            )}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: { xs: 5, md: 6 }, display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 }, flexWrap: "wrap" }}>
                    <LoopRounded aria-hidden sx={{ fontSize: 22, color: "text.secondary" }} />
                    <Typography sx={{ color: "text.secondary" }}>
                        {loop.map((part, i) => (
                            <Box component="span" key={part} sx={i === 0 ? { color: "text.primary", fontWeight: 600 } : undefined}>
                                {i > 0 && " "}
                                {part}
                            </Box>
                        ))}
                        . The loop is meant to close by itself.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

const ribbonText = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1,
} as const;

const outputs = [
    { Icon: ArticleRounded, color: pond, name: "Writing", body: "Guides, articles and structured learning paths. Written for the reader's next hour, not for search engines.", onTrails: true },
    { Icon: MenuBookRounded, color: moss, name: "Playbooks", body: "End to end workflows and development processes. Each names the problem it solves, the steps in order, and where it stops applying.", onTrails: true },
    { Icon: CodeRounded, color: amber, name: "Software", body: "Libraries, tools and abstractions. Judged by whether someone outside the Foundation depends on them, not by lines of code.", onTrails: false },
    { Icon: DatasetRounded, color: palette.plum[500], name: "Models and data", body: "Curated models and open evaluation datasets. Provenance and license stated up front, not discovered later.", onTrails: false },
];

function Produce() {
    return (
        <Box component="section" aria-labelledby="produce-title">
            <Container sx={{ ...container, py: { xs: 8, md: 12 } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: { xs: 2, md: 10 }, alignItems: "end", mb: { xs: 5, md: 7 } }}>
                    <Box>
                        <Eyebrow>What we produce</Eyebrow>
                        <Typography id="produce-title" variant="h2" sx={{ textWrap: "balance" }}>
                            Depth other people can stand on.
                        </Typography>
                    </Box>
                    <Typography sx={{ color: "text.secondary" }}>
                        We would rather ship ten things a thousand people depend on than a thousand things nobody finishes.
                        Everything carries a license that permits reuse without asking, and an owner who is a person, not just
                        an org name.
                    </Typography>
                </Box>

                <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>
                    {outputs.map(({ Icon, color, name, body, onTrails }) => (
                        <Box
                            component="li"
                            key={name}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                p: 3,
                                borderRadius: "14px",
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: onTrails ? color : "divider",
                                boxShadow: onTrails ? `0 3px 0 ${color}` : "none",
                            }}
                        >
                            <Box
                                aria-hidden
                                sx={{
                                    width: 44,
                                    height: 44,
                                    mb: 2.5,
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    border: `3px solid ${color}`,
                                    color: "text.primary",
                                }}
                            >
                                <Icon sx={{ fontSize: 22 }} />
                            </Box>
                            <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
                                {name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: onTrails ? 2.5 : 0, flexGrow: 1 }}>
                                {body}
                            </Typography>
                            {onTrails && (
                                <Box
                                    component={Link}
                                    href="/trails/"
                                    sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.875rem", fontWeight: 600, color: "text.primary", textDecoration: "none", ...focusRing }}
                                >
                                    Read it as trails
                                    <ArrowForwardRounded aria-hidden sx={{ fontSize: 18 }} />
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                <Typography variant="body2" sx={{ mt: 4, color: "text.secondary", maxWidth: 720 }}>
                    Building with AI is one of the areas we actively support, and we expect it to be a busy one. It is not what
                    defines the Foundation. Good practice, openly maintained, is.
                </Typography>
            </Container>
        </Box>
    );
}

const steps = [
    { title: "Pick a trail", body: "Each trail leads to one proof project, named in a single sentence." },
    { title: "Follow the trail maps", body: "The big skills on the way, laid out in the order you need them." },
    { title: "Take one article at a time", body: "Each teaches one small skill in about 2 minutes, then gives you 10 to practise it." },
    { title: "Build the proof project", body: "Put the skills together in a small project worth showing. It is the goal of the whole trail." },
];
const stepColors = [pond, moss, amber];

function HowItWorks() {
    return (
        <Box component="section" id="how-it-works" aria-labelledby="how-title" sx={{ scrollMarginTop: 80, bgcolor: "surface.sunken", borderTop: "1px solid", borderColor: "divider" }}>
            <Container sx={{ ...container, pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 } }}>
                <Eyebrow>Trails · How our writing and playbooks are published</Eyebrow>
                <Typography id="how-title" variant="h2" sx={{ maxWidth: 640, mb: 2, textWrap: "balance" }}>
                    Writers explain it to the duck.
                </Typography>
                <Typography variant="lead" sx={{ color: "text.secondary", maxWidth: 620, mb: { xs: 5, md: 7 } }}>
                    Every writer here treats the platform as their rubber duck, explaining each idea until it holds up. A
                    trail turns that writing into one path that ends at a proof project, for the curious beginner and the
                    busy professional alike.
                </Typography>

                <Box
                    component="ol"
                    sx={{
                        listStyle: "none",
                        p: 0,
                        m: 0,
                        position: "relative",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                        gap: 4,
                        // The trail joining the steps: down the left on small screens, across the top on wide ones.
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            borderColor: "divider",
                            borderStyle: "solid",
                            borderWidth: 0,
                            top: 24,
                            bottom: { xs: 24, md: "auto" },
                            left: { xs: 24, md: "12.5%" },
                            right: { md: "12.5%" },
                            borderLeftWidth: { xs: 2, md: 0 },
                            borderTopWidth: { xs: 0, md: 2 },
                        },
                    }}
                >
                    {steps.map((step, i) => {
                        const isLast = i === steps.length - 1;
                        const color = stepColors[i] ?? amber;
                        return (
                            <Box
                                component="li"
                                key={step.title}
                                sx={{
                                    position: "relative",
                                    display: "grid",
                                    gridTemplateColumns: { xs: "48px 1fr", md: "1fr" },
                                    columnGap: 2.5,
                                    justifyItems: { md: "center" },
                                    textAlign: { md: "center" },
                                }}
                            >
                                <Box
                                    aria-hidden
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        border: `3px solid ${color}`,
                                        bgcolor: isLast ? palette.ink[800] : i === 0 ? palette.duck[300] : "background.paper",
                                        color: isLast ? palette.duck[300] : i === 0 ? palette.ink[900] : "text.primary",
                                        boxShadow: `0 3px 0 ${color}`,
                                        fontFamily: "var(--font-mono)",
                                        fontWeight: 700,
                                        mb: { md: 2.5 },
                                        outline: "4px solid",
                                        outlineColor: "background.default",
                                    }}
                                >
                                    {isLast ? <EmojiEventsRounded sx={{ fontSize: 24 }} /> : i + 1}
                                </Box>
                                <Box sx={{ maxWidth: 260 }}>
                                    <Typography component="h3" variant="h5" sx={{ mb: 0.75 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {step.body}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}

function TrailCard({ trail }: { trail: Trail }) {
    return (
        <Box
            component={Link}
            href={`/trails/${trail.slug}/`}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                p: 3,
                textDecoration: "none",
                color: "text.primary",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
                transition: "border-color 160ms ease, transform 160ms ease",
                "&:hover": { borderColor: "text.disabled", transform: "translateY(-2px)" },
                "&:hover .go": { color: "primary.main" },
                ...focusRing,
            }}
        >
            <Box sx={{ display: "flex", gap: 0.75, mb: 2.5 }} aria-hidden>
                {trail.maps.slice(0, 6).map((m, i) => (
                    <Box key={m.id} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: [pond, moss, amber, palette.rust[500], palette.plum[500], palette.berry[500]][i] }} />
                ))}
            </Box>
            <Typography component="h3" sx={{ fontSize: "1.25rem", fontWeight: 640, letterSpacing: "-0.02em", mb: 1 }}>
                {trail.title}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1 }}>{trail.destination}</Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 0.5 }}>
                {trail.maps.length} trail maps · {allArticles(trail).length} articles · {totalMinutes(trail)} min reading
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VerifiedRounded aria-hidden sx={{ fontSize: 16, color: "success.main" }} />
                    Verified <time dateTime={trail.verifiedAt}>{formatDate(trail.verifiedAt)}</time>
                </Typography>
                <ArrowForwardRounded className="go" aria-hidden sx={{ fontSize: 20, color: "text.disabled", transition: "color 160ms ease" }} />
            </Box>
        </Box>
    );
}

function FeaturedTrails({ trails }: { trails: Trail[] }) {
    const featured = trails.slice(0, 3);
    return (
        <Box component="section" aria-labelledby="trails-title" sx={{ bgcolor: "surface.sunken", borderBottom: "1px solid", borderColor: "divider" }}>
            <Container sx={{ ...container, pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 12 } }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 3 }}>
                    <Typography id="trails-title" variant="h4" component="h3">
                        Open trails, ready today
                    </Typography>
                    {trails.length > 0 && (
                        <Button component={Link} href="/trails/" color="inherit" endIcon={<ArrowForwardRounded />} sx={{ fontWeight: 600, ...focusRing }}>
                            {trails.length > featured.length ? `See all ${trails.length} trails` : "Go to the trails"}
                        </Button>
                    )}
                </Box>

                {featured.length === 0 ? (
                    <Box sx={{ p: { xs: 4, md: 6 }, borderRadius: "14px", border: "1px solid", borderColor: "divider", textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <DuckMark size={40} />
                        </Box>
                        <Typography variant="h5" component="p" sx={{ mb: 1 }}>
                            The first trails are being verified.
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>A trail only goes up once every step has been checked to work. Check back soon.</Typography>
                    </Box>
                ) : (
                    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
                        {featured.map((t) => (
                            <Box component="li" key={t.slug}>
                                <TrailCard trail={t} />
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

const people = [
    { who: "The newcomer", has: "Knows enough to be dangerous, not enough to know what to search for.", finds: "A path that says what to know first, and never punishes a question." },
    { who: "The self taught builder", has: "Has an idea and momentum, but no team and no budget.", finds: "A way from zero to a working thing in one sitting." },
    { who: "The developer without a network", has: "Solved this problem before, somewhere nobody saw it.", finds: "A place to write it down once, and a Circle of peers who respect your time." },
    { who: "The maintainer", has: "Wrote something useful and cannot sustain it alone.", finds: "Collaborators who can find the work and trust that it is real." },
];
const personColors = [pond, moss, amber, palette.plum[500]];
const roles = ["Contributor", "Mentor", "Circle organiser", "Maintainer"];

function Community() {
    return (
        <Box component="section" aria-labelledby="community-title">
            <Container sx={{ ...container, py: { xs: 8, md: 12 } }}>
                <Eyebrow>The community</Eyebrow>
                <Typography id="community-title" variant="h2" sx={{ maxWidth: 680, mb: 2, textWrap: "balance" }}>
                    Built for people who never had the shortcut.
                </Typography>
                <Typography variant="lead" sx={{ color: "text.secondary", maxWidth: 620, mb: { xs: 5, md: 7 } }}>
                    Not for those who already have a paid course, a mentor or great onboarding docs. For whoever shows up
                    without them, on a slow connection, without admin rights, in any language.
                </Typography>

                <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>
                    {people.map((p, i) => (
                        <Box
                            component="li"
                            key={p.who}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                p: 3,
                                borderRadius: "14px",
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                borderTop: `4px solid ${personColors[i]}`,
                            }}
                        >
                            <Typography component="h3" variant="h5" sx={{ mb: 1.5 }}>
                                {p.who}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5, flexGrow: 1 }}>
                                {p.has}
                            </Typography>
                            <Typography variant="mono" component="p" sx={{ color: "text.secondary", mb: 0.75 }}>
                                Finds here
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 560 }}>
                                {p.finds}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        mt: 3,
                        p: { xs: 3, md: 4 },
                        borderRadius: "14px",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
                        gap: 3,
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography component="h3" variant="h5" sx={{ mb: 0.75 }}>
                            Open to anyone, whatever your background. For any role.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Track record is shown in public work.
                        </Typography>
                    </Box>
                    <Box component="ul" aria-label="Open roles" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {roles.map((r) => (
                            <Box component="li" key={r} sx={{ px: 1.5, py: 0.75, borderRadius: "999px", bgcolor: "surface.sunken", border: "1px solid", borderColor: "divider", fontSize: "0.8125rem", fontWeight: 600 }}>
                                {r}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

const horizon = [
    { title: "A learning path for anything worth learning", body: "Including what is locked behind one employer, one country's universities, or a niche too small for any course platform." },
    { title: "A sandbox that scales with the learner", body: "A first hello world and a first distributed system, both free. Limits get renegotiated in public, never quietly." },
    { title: "A commons that outlives any single answer", body: "Dense enough that most questions are already answered before they are asked twice." },
    { title: "A Circle within reach of anywhere", body: "Forming in places that never had a scene, run by people the Foundation did not hand pick." },
    { title: "Independence from any one funder", body: "No funding with editorial strings, and a core that keeps working if any single revenue line disappears." },
];

function HowFar() {
    return (
        <Box component="section" aria-labelledby="horizon-title" sx={{ bgcolor: "surface.sunken", borderBlock: "1px solid", borderColor: "divider" }}>
            <Container
                sx={{
                    ...container,
                    py: { xs: 8, md: 12 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
                    gap: { xs: 5, md: 10 },
                    alignItems: "start",
                }}
            >
                <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
                    <Eyebrow>How far this goes</Eyebrow>
                    <Typography id="horizon-title" variant="h2" sx={{ mb: 2.5, textWrap: "balance" }}>
                        A promise of a direction, not a date.
                    </Typography>
                    <Typography variant="lead" sx={{ color: "text.secondary", maxWidth: 460 }}>
                        Stated plainly so it can be checked later. Are we closer this year than last, and can anyone outside the
                        Foundation verify that?
                    </Typography>
                </Box>
                <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0 }}>
                    {horizon.map((h, i) => (
                        <Box
                            component="li"
                            key={h.title}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "40px 1fr",
                                gap: 2,
                                py: 3,
                                borderTop: i === 0 ? "none" : "1px solid",
                                borderColor: "divider",
                                pt: i === 0 ? 0 : 3,
                            }}
                        >
                            <Typography variant="mono" sx={{ color: "text.secondary", fontWeight: 600, pt: "3px" }}>
                                0{i + 1}
                            </Typography>
                            <Box>
                                <Typography component="h3" variant="h5" sx={{ mb: 0.75 }}>
                                    {h.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    {h.body}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

function ClosingCta() {
    return (
        <Container sx={{ ...container, p: { xs: 8, md: 12 } }}>
            <Box
                component="section"
                aria-labelledby="closing-title"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "20px",
                    bgcolor: palette.ink[800],
                    color: palette.ink[50],
                    border: "1px solid",
                    borderColor: "divider",
                    px: { xs: 3, sm: 5, md: 8 },
                    py: { xs: 6, md: 8 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
                    alignItems: "center",
                    gap: 4,
                    backgroundImage: `radial-gradient(${palette.ink[600]} 1px, transparent 1.2px)`,
                    backgroundSize: "18px 18px",
                }}
            >
                <Box>
                    <Box sx={{ mb: 3 }}>
                        <DuckMark size={48} />
                    </Box>
                    <Typography id="closing-title" variant="h2" sx={{ mb: 1.5, maxWidth: 600, textWrap: "balance" }}>
                        Bring a question. Leave with something worth keeping.
                    </Typography>
                    <Typography sx={{ color: palette.ink[200], maxWidth: 540 }}>
                        Success here is someone leaving with something built or understood. Start with our writing and
                        playbooks: your first trail article takes about two minutes, and the duck is listening.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    href="/trails/"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                        justifySelf: { xs: "start", md: "end" },
                        bgcolor: palette.duck[300],
                        color: palette.ink[900],
                        "&:hover": { bgcolor: palette.duck[200] },
                        "&:focus-visible": { outline: "2px solid", outlineColor: palette.duck[300], outlineOffset: 3 },
                    }}
                >
                    Start a trail
                </Button>
            </Box>
        </Container>
    );
}

export default async function Home() {
    const trails = await getTrails();
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SkipLink />
            <SiteHeader />
            <Box component="main" id="main" sx={{ flexGrow: 1 }}>
                <Hero />
                <Foundation />
                <Pillars />
                <Produce />
                <HowItWorks />
                <FeaturedTrails trails={trails} />
                <Community />
                <HowFar />
                <ClosingCta />
            </Box>
            <SiteFooter />
        </Box>
    );
}
