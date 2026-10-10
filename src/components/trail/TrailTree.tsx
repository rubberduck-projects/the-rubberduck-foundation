import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import { allArticles, connections, readingMinutes, sortedMaps, type Article, type Trail, type TrailMap } from "@/content/trails";
import { palette } from "@/theme/tokens";
import { TrailViews } from "./TrailViews";

// One color per trail map; each passes 3:1 against both light and dark canvases.
const mapColors = [palette.pond[500], palette.moss[500], palette.duck[600], palette.rust[500], palette.plum[500], palette.berry[500]];

// Share of its slot a node and its label may cover; tracks stay outside it.
const NODE_SHARE = 0.85;
const TRACK_GAP = 0.03;
const MEDALLION = 52;
const RING = 4;
const CENTER = RING + MEDALLION / 2;
// Share of a row, measured from a node's center, that its label may fill; connections only bend below it.
const LABEL_DEPTH = 62;

const srOnly = {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
} as const;

// Each article sits below everything it requires and never above an article that comes earlier, so the numbers read top to bottom.
function layoutTree(trail: Trail) {
    const list = allArticles(trail);
    const { previous } = connections(trail);

    // connections() guarantees every required article comes earlier in reading order, so its row is already set.
    const rowOf = new Map<number, number>();
    list.forEach((a, i) => {
        const afterRequired = Math.max(-1, ...previous.get(a.id)!.map((p) => rowOf.get(p.id)!)) + 1;
        rowOf.set(a.id, Math.max(afterRequired, i > 0 ? rowOf.get(list[i - 1].id)! : 0));
    });

    const ancestors = new Map<number, Set<number>>();
    list.forEach((a) => ancestors.set(a.id, new Set(previous.get(a.id)!.flatMap((p) => [p.id, ...ancestors.get(p.id)!]))));

    const rowCount = Math.max(...rowOf.values()) + 1;
    const rows: Article[][] = Array.from({ length: rowCount }, () => []);
    list.forEach((a) => rows[rowOf.get(a.id)!].push(a));

    const xOf = new Map<number, number>();
    const slotOf = new Map<number, number>();
    rows.forEach((row) =>
        row.forEach((a, i) => {
            xOf.set(a.id, (i + 0.5) / row.length);
            slotOf.set(a.id, 1 / row.length);
        }),
    );

    // A connection that skips rows runs in one vertical track clear of every node it passes, so it never reads as touching them.
    const tracks: { g: number; from: number; to: number }[] = [];
    const blocked = (g: number, r: number) => rows[r].some((a) => Math.abs(g - xOf.get(a.id)!) < (slotOf.get(a.id)! * NODE_SHARE) / 2);
    const trackFor = (x1: number, r1: number, x2: number, r2: number) => {
        const between = Array.from({ length: r2 - r1 - 1 }, (_, i) => r1 + 1 + i);
        const bounds = between.flatMap((r) => Array.from({ length: rows[r].length + 1 }, (_, k) => k / rows[r].length));
        const steps = Array.from({ length: tracks.length + 1 }, (_, k) => k * TRACK_GAP);
        const inside = bounds.flatMap((b) => steps.flatMap((s) => [b - s, b + s])).filter((g) => g >= 0 && g <= 1);
        // Past the edges only when every inside track is taken; those run into the box padding.
        const outside = steps.flatMap((s) => [-s - TRACK_GAP, 1 + s + TRACK_GAP]);
        const free = (g: number) =>
            between.every((r) => !blocked(g, r)) && !tracks.some((t) => t.from < r2 && r1 < t.to && Math.abs(t.g - g) < TRACK_GAP * 0.9);
        const mid = (x1 + x2) / 2;
        const nearest = (list: number[]) => list.filter(free).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))[0];
        const g = nearest(inside) ?? nearest(outside);
        tracks.push({ g, from: r1, to: r2 });
        return g;
    };

    const curve = (x1: number, y1: number, x2: number, y2: number) => `C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`;
    const spans = trail.connections
        .map((c) => ({ ...c, r1: rowOf.get(c.requiredArticleId)!, r2: rowOf.get(c.articleId)! }))
        .sort((a, b) => a.r2 - a.r1 - (b.r2 - b.r1));
    // Every connection drops straight down behind its own label, then bends in the gap above the next row.
    const paths = spans.map(({ articleId, requiredArticleId, r1, r2 }) => {
        const x1 = xOf.get(requiredArticleId)!;
        const x2 = xOf.get(articleId)!;
        const [px, py, x, y] = [x1 * 100, r1 * 100, x2 * 100, r2 * 100];
        const stem = `M${px} ${py} L${px} ${py + LABEL_DEPTH}`;
        const key = `${requiredArticleId}-${articleId}`;
        if (r2 - r1 === 1) return { key, d: `${stem} ${curve(px, py + LABEL_DEPTH, x, y)}` };
        const g = trackFor(x1, r1, x2, r2) * 100;
        return { key, d: `${stem} ${curve(px, py + LABEL_DEPTH, g, py + 100)} L${g} ${y - 100 + LABEL_DEPTH} ${curve(g, y - 100 + LABEL_DEPTH, x, y)}` };
    });

    return { list, previous, ancestors, rowCount, rowOf, xOf, slotOf, paths };
}

const mapIndexById = (maps: TrailMap[]) => new Map(maps.flatMap((m, i) => m.articles.map((a) => [a.id, i] as const)));

const ribbon = {
    position: "absolute",
    left: "50%",
    bottom: -6,
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

function TreeNode({
    article,
    number,
    color,
    mapTitle,
    needs,
    isStart,
    isFinish,
    href,
}: {
    article: Article;
    number: number;
    color: string;
    mapTitle: string;
    needs: Article[];
    isStart: boolean;
    isFinish: boolean;
    href: string;
}) {
    const isDraft = !article.body;
    return (
        <Box
            component={Link}
            href={href}
            data-article={article.slug}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                color: "text.primary",
                textDecoration: "none",
                borderRadius: "12px",
                outline: "none",
                "&:hover .medallion, &:focus-visible .medallion": { transform: "translateY(-3px)", boxShadow: `0 6px 0 ${color}, 0 10px 18px rgba(20, 18, 16, 0.22)` },
                "&:hover .title": { textDecoration: "underline", textDecorationColor: palette.duck[400], textUnderlineOffset: 3 },
                "&:focus-visible .ring": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
            }}
        >
            <Box className="ring" sx={{ position: "relative", p: `${RING}px`, borderRadius: "50%", bgcolor: "surface.sunken" }}>
                <Box
                    aria-hidden
                    className="pulse"
                    sx={{
                        display: isStart ? "block" : "none",
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: `2px solid ${palette.duck[400]}`,
                        animation: "trail-pulse 2.4s ease-out 3",
                        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    }}
                />
                <Box
                    className="medallion"
                    sx={{
                        width: MEDALLION,
                        height: MEDALLION,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        border: `3px ${isDraft ? "dashed" : "solid"} ${color}`,
                        bgcolor: isFinish ? palette.ink[800] : isStart ? palette.duck[300] : "background.paper",
                        color: isFinish ? palette.duck[300] : isStart ? palette.ink[900] : "text.primary",
                        boxShadow: isDraft ? "none" : `0 3px 0 ${color}`,
                        opacity: isDraft ? 0.6 : 1,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "1.0625rem",
                        transition: "transform 160ms ease, box-shadow 160ms ease",
                        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                    }}
                >
                    <Box component="span" aria-hidden className="face" sx={{ display: "grid", placeItems: "center" }}>
                        {isFinish ? <EmojiEventsRounded sx={{ fontSize: 28 }} /> : number}
                    </Box>
                    <CheckRounded aria-hidden className="check" sx={{ display: "none", fontSize: 30 }} />
                </Box>
                {(isStart || isFinish) && (
                    <Box component="span" aria-hidden className="ribbon-fixed" sx={ribbon}>
                        {isStart ? "Start" : "Finish"}
                    </Box>
                )}
                <Box component="span" aria-hidden className="ribbon-next" sx={{ ...ribbon, display: "none" }}>
                    Next
                </Box>
            </Box>
            <Box
                component="span"
                sx={{ mt: 1.25, px: 0.75, py: 0.25, borderRadius: "6px", bgcolor: "surface.sunken", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Box
                    component="span"
                    className="title"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" }, fontWeight: 600, lineHeight: 1.3, color: isDraft ? "text.secondary" : undefined }}
                >
                    <Box component="span" sx={srOnly}>Article {number}:{" "}</Box>
                    {article.title}
                </Box>
                <Box component="span" sx={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "text.secondary", mt: 0.25 }}>
                    {isDraft ? "Not written yet" : `${readingMinutes(article)} min`}
                </Box>
                <Box component="span" sx={srOnly}>
                    {`. Part of ${mapTitle}.`}
                    {isStart && " Start here."}
                    <Box component="span" className="done-sr" sx={{ display: "none" }}> Done.</Box>
                    <Box component="span" className="next-sr" sx={{ display: "none" }}> Up next.</Box>
                    {needs.length > 0 && ` Learn first: ${needs.map((n) => n.title).join(", ")}.`}
                </Box>
            </Box>
        </Box>
    );
}

// Pure CSS, so the static page needs no client code: pointing at an article or a trail map dims everything outside it.
function highlightRules(trail: Trail, ancestors: Map<number, Set<number>>, mapIndex: Map<number, number>, mapCount: number) {
    const dim = { opacity: 0.25 };
    const lit = { opacity: 1 };
    const litEdge = { opacity: 1, color: "primary.main", strokeWidth: 3 };
    const pointed = (id: number) => `[data-node="${id}"] a:is(:hover, :focus-visible)`;
    const rules: Record<string, object> = {
        "& [data-node], & [data-edge]": {
            transition: "opacity 150ms ease, color 150ms ease",
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        },
        "&:has([data-node] a:is(:hover, :focus-visible), [data-legend]:hover) :is([data-node], [data-edge])": dim,
    };
    ancestors.forEach((before, id) => {
        const chain = [id, ...before];
        const edges = trail.connections.filter((c) => c.articleId === id || before.has(c.articleId));
        rules[`&:has(${pointed(id)}) :is(${chain.map((n) => `[data-node="${n}"]`).join(", ")})`] = lit;
        if (edges.length) rules[`&:has(${pointed(id)}) :is(${edges.map((c) => `[data-edge="${c.requiredArticleId}-${c.articleId}"]`).join(", ")})`] = litEdge;
    });
    for (let m = 0; m < mapCount; m++) rules[`&:has([data-legend="${m}"][data-legend]:hover) [data-map="${m}"]`] = lit;
    // Connections inside one trail map light up with it.
    const sameMap = trail.connections.filter((c) => mapIndex.get(c.articleId) === mapIndex.get(c.requiredArticleId));
    for (let m = 0; m < mapCount; m++) {
        const edges = sameMap.filter((c) => mapIndex.get(c.articleId) === m);
        if (edges.length) rules[`&:has([data-legend="${m}"][data-legend]:hover) :is(${edges.map((c) => `[data-edge="${c.requiredArticleId}-${c.articleId}"]`).join(", ")})`] = litEdge;
    }
    return rules;
}

// ProgressScope sets data-done and data-next above the tree from browser storage; these rules turn them into done and next states.
function progressRules(list: Article[], colorOf: (a: Article) => string) {
    const rules: Record<string, object> = { "[data-started] & [data-node] .pulse": { display: "none" } };
    list.forEach((a) => {
        const done = `[data-done~="${a.slug}"] & [data-node="${a.id}"]`;
        const next = `[data-next="${a.slug}"] & [data-node="${a.id}"]`;
        rules[`${done} .medallion`] = { bgcolor: colorOf(a), borderColor: colorOf(a), color: "#fff" };
        rules[`${done} .face`] = { display: "none" };
        rules[`${done} .check`] = { display: "block" };
        rules[`${done} .done-sr`] = { display: "inline" };
        rules[`${next} :is(.pulse, .ribbon-next)`] = { display: "block" };
        rules[`${next} .ribbon-fixed`] = { display: "none" };
        rules[`${next} .next-sr`] = { display: "inline" };
    });
    return rules;
}

const legendKey = { display: "flex", alignItems: "center", gap: 0.75 } as const;

// The same nodes as the map, grouped by trail map; it shares the node classes so progress and highlight rules apply here too.
function TrailList({ trail, maps, list, previous }: { trail: Trail; maps: TrailMap[]; list: Article[]; previous: Map<number, Article[]> }) {
    const numberOf = new Map(list.map((a, i) => [a.id, i + 1]));
    const lastId = list.at(-1)!.id;
    return (
        <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 3 }}>
            {maps.map((map, m) => (
                <Box component="li" key={map.id}>
                    <Typography component="h3" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.9375rem", fontWeight: 640, mb: 1 }}>
                        <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: mapColors[m % mapColors.length] }} />
                        {map.title}
                    </Typography>
                    <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0, border: "1px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden" }}>
                        {[...map.articles].sort((a, b) => a.position - b.position).map((a) => {
                            const n = numberOf.get(a.id)!;
                            const needs = previous.get(a.id)!;
                            const isDraft = !a.body;
                            const isStart = n === 1;
                            const isFinish = a.id === lastId;
                            const color = mapColors[m % mapColors.length];
                            return (
                                <Box component="li" key={a.id} data-node={a.id} data-map={m} sx={{ "& + &": { borderTop: "1px solid", borderColor: "divider" } }}>
                                    <Box
                                        component={Link}
                                        href={`/trails/${trail.slug}/${a.slug}/`}
                                        data-article={a.slug}
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "36px 1fr",
                                            columnGap: 1.5,
                                            alignItems: "center",
                                            px: 1.5,
                                            py: 1.25,
                                            color: "text.primary",
                                            textDecoration: "none",
                                            "&:hover": { bgcolor: "action.hover" },
                                            "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 },
                                        }}
                                    >
                                        <Box
                                            className="medallion"
                                            aria-hidden
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "50%",
                                                display: "grid",
                                                placeItems: "center",
                                                border: `2.5px ${isDraft ? "dashed" : "solid"} ${color}`,
                                                bgcolor: isFinish ? palette.ink[800] : isStart ? palette.duck[300] : "background.paper",
                                                color: isFinish ? palette.duck[300] : isStart ? palette.ink[900] : "text.primary",
                                                opacity: isDraft ? 0.6 : 1,
                                                fontFamily: "var(--font-mono)",
                                                fontWeight: 700,
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            <Box component="span" className="face" sx={{ display: "grid", placeItems: "center" }}>
                                                {isFinish ? <EmojiEventsRounded sx={{ fontSize: 20 }} /> : n}
                                            </Box>
                                            <CheckRounded className="check" sx={{ display: "none", fontSize: 22 }} />
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                                <Box component="span" sx={{ fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.35, color: isDraft ? "text.secondary" : undefined }}>
                                                    <Box component="span" sx={srOnly}>Article {n}:{" "}</Box>
                                                    {a.title}
                                                </Box>
                                                {(isStart || isFinish) && (
                                                    <Box component="span" aria-hidden className="ribbon-fixed" sx={{ ...ribbon, position: "static", transform: "none" }}>
                                                        {isStart ? "Start" : "Finish"}
                                                    </Box>
                                                )}
                                                <Box component="span" aria-hidden className="ribbon-next" sx={{ ...ribbon, position: "static", transform: "none", display: "none" }}>
                                                    Next
                                                </Box>
                                            </Box>
                                            <Box sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
                                                <Box component="span" sx={{ fontFamily: "var(--font-mono)" }}>{isDraft ? "Not written yet" : `${readingMinutes(a)} min`}</Box>
                                                {needs.length > 0 && ` · Learn first: ${needs.map((p) => numberOf.get(p.id)).join(", ")}`}
                                                <Box component="span" sx={srOnly}>
                                                    <Box component="span" className="done-sr" sx={{ display: "none" }}> Done.</Box>
                                                    <Box component="span" className="next-sr" sx={{ display: "none" }}> Up next.</Box>
                                                    {needs.length > 0 && ` (${needs.map((p) => p.title).join(", ")})`}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export function TrailTree({ trail }: { trail: Trail }) {
    const { list, previous, ancestors, rowCount, rowOf, xOf, slotOf, paths } = layoutTree(trail);
    const maps = sortedMaps(trail);
    const mapIndex = mapIndexById(maps);
    const lastId = list.at(-1)!.id;
    const rowVar = { "--row": "180px", "@media (min-width: 600px)": { "--row": "164px" } };

    const mapView = (
        <>
            <Box
                sx={{
                    ...rowVar,
                    position: "relative",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "surface.sunken",
                    backgroundImage: "radial-gradient(circle, rgba(140, 133, 122, 0.28) 1px, transparent 1.5px)",
                    backgroundSize: "18px 18px",
                    px: { xs: 1, sm: 3 },
                    pt: 3.5,
                    pb: 1,
                }}
            >
                <Box sx={{ position: "relative", height: `calc(var(--row) * ${rowCount})` }}>
                    <Box
                        component="svg"
                        aria-hidden
                        viewBox={`0 0 100 ${(rowCount - 1) * 100}`}
                        preserveAspectRatio="none"
                        sx={{ position: "absolute", left: 0, top: CENTER, width: "100%", height: `calc(var(--row) * ${rowCount - 1})`, overflow: "visible" }}
                    >
                        {paths.map(({ key, d }) => (
                            <Box
                                component="path"
                                key={key}
                                data-edge={key}
                                d={d}
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                                sx={{ color: palette.ink[400], strokeWidth: 1.5 }}
                            />
                        ))}
                    </Box>

                    <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {list.map((a, i) => {
                            const m = mapIndex.get(a.id)!;
                            return (
                                <Box
                                    component="li"
                                    key={a.id}
                                    data-node={a.id}
                                    data-map={m}
                                    sx={{
                                        position: "absolute",
                                        top: `calc(var(--row) * ${rowOf.get(a.id)!})`,
                                        left: `${xOf.get(a.id)! * 100}%`,
                                        width: `${slotOf.get(a.id)! * 100}%`,
                                        maxWidth: 200,
                                        transform: "translateX(-50%)",
                                        display: "flex",
                                        justifyContent: "center",
                                        px: 0.5,
                                    }}
                                >
                                    <TreeNode
                                        article={a}
                                        number={i + 1}
                                        color={mapColors[m % mapColors.length]}
                                        mapTitle={maps[m].title}
                                        needs={previous.get(a.id)!}
                                        isStart={i === 0}
                                        isFinish={a.id === lastId}
                                        href={`/trails/${trail.slug}/${a.slug}/`}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </>
    );

    return (
        <Box
            component="section"
            aria-labelledby="trail-maps"
            sx={{
                ...highlightRules(trail, ancestors, mapIndex, maps.length),
                ...progressRules(list, (a) => mapColors[mapIndex.get(a.id)! % mapColors.length]),
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 300px" },
                gridTemplateAreas: { md: `"views side"` },
                columnGap: 6,
                alignItems: "start",
            }}
        >
            <Box
                sx={{
                    gridArea: { md: "side" },
                    mb: { xs: 4, md: 0 },
                    position: { md: "sticky" },
                    top: { md: 92 },
                    maxHeight: { md: "calc(100vh - 108px)" },
                    overflowY: { md: "auto" },
                    // Room for hover backgrounds and focus rings that the scroll box would otherwise clip.
                    px: { md: 1 },
                    mx: { md: -1 },
                    pb: { md: 1 },
                }}
            >
                <Typography id="trail-maps" component="h2" sx={{ fontSize: "1.125rem", fontWeight: 640, letterSpacing: "-0.01em", mb: 1 }}>
                    Trail maps
                </Typography>

                <Box
                    component="ul"
                    aria-labelledby="trail-maps"
                    sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr" }, gap: 0.5 }}
                >
                    {maps.map((map, i) => (
                        <Box
                            component="li"
                            key={map.id}
                            data-legend={i}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "12px 1fr",
                                columnGap: 1.25,
                                alignItems: "baseline",
                                px: 1,
                                py: 0.75,
                                mx: -1,
                                borderRadius: "8px",
                                transition: "background-color 150ms ease",
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <Box aria-hidden sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: mapColors[i % mapColors.length], transform: "translateY(1px)" }} />
                            <Box>
                                <Box component="span" sx={{ fontWeight: 640, fontSize: "0.9375rem" }}>{map.title}</Box>{" "}
                                <Box component="span" sx={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "text.secondary" }}>
                                    {map.articles.length} {map.articles.length === 1 ? "article" : "articles"}
                                </Box>
                                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.5, mt: 0.25 }}>{map.summary}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={{ gridArea: { md: "views" }, minWidth: 0 }}>
                <TrailViews map={mapView} list={<TrailList trail={trail} maps={maps} list={list} previous={previous} />} />
            </Box>
        </Box>
    );
}
