---
name: ui-ux-pro-max
description: "UI/UX design intelligence: searchable database of styles, color palettes, font pairings, charts, and UX guidelines across 13 stacks. Use for plan/build/design/review/fix/improve of UI — websites, landing pages, dashboards, admin panels, SaaS, mobile apps, and .html/.tsx/.vue/.svelte. Covers styles (glassmorphism, minimalism, brutalism, bento, dark mode), color palettes, typography/font pairing, layout, spacing, accessibility, animation, and charts. Integrates shadcn/ui MCP."
---
# UI/UX Pro Max - Design Intelligence

Searchable design database with priority-based recommendations for web and mobile. Styles, color palettes, font pairings, UX guidelines, and charts across 13 technology stacks.

## Rule Priorities

| Priority | Category | Impact | Domain |
|----------|----------|--------|--------|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Touch & Interaction | CRITICAL | `ux` |
| 3 | Performance | HIGH | `ux` |
| 4 | Layout & Responsive | HIGH | `ux` |
| 5 | Typography & Color | MEDIUM | `typography`, `color` |
| 6 | Animation | MEDIUM | `ux` |
| 7 | Style Selection | MEDIUM | `style`, `product` |
| 8 | Charts & Data | LOW | `chart` |

The full rule text for each lives in the CSV data and is returned by the search CLI — search the relevant domain rather than relying on this table.

## How to Use This Skill

When the user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow. Requires Python (`python3 --version || python --version`; if missing, install for the user's OS, e.g. `winget install Python.Python.3.12` on Windows).

### Step 1: Analyze requirements

Extract: **product type** (SaaS, dashboard, landing page…), **style keywords** (minimal, dark mode…), **industry**, and **stack**. If no stack is given, default to `react` / `nextjs` for app work (this project ships real components), or `html-tailwind` for throwaway mockups.

### Step 2: Generate design system (REQUIRED)

Always start with `--design-system` for complete recommendations with reasoning:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This searches 5 domains in parallel (product, style, color, landing, typography), applies the reasoning rules in `ui-reasoning.csv`, and returns a complete design system (pattern, style, colors, typography, effects) plus anti-patterns.

### Step 2b: Persist (optional, Master + Overrides)

Add `--persist` to save the system for reuse across sessions:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" [--page "dashboard"]
```

Creates `design-system/MASTER.md` (global source of truth) and `design-system/pages/<page>.md` (page-specific overrides). When building a page, check `design-system/pages/<page>.md` first — if present its rules override MASTER; otherwise use MASTER.

### Step 3: Supplement with domain searches (as needed)

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Need | Domain |
|------|--------|
| More style options | `style` |
| Chart recommendations | `chart` |
| UX best practices / anti-patterns | `ux` |
| Alternative fonts | `typography` |
| Landing structure / CTA | `landing` |
| Color palettes by product type | `color` |
| React/Next performance | `react` |
| Web a11y guidelines | `web` |

### Step 4: Stack guidelines

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`. Default `react`/`nextjs` for app work; `html-tailwind` for mockups.

Then synthesize the design system + searches and implement.

## Output formats

`--design-system` supports ASCII box (default, best for terminal) or markdown (`-f markdown`, best for docs).

## Tips

1. Be specific with keywords ("healthcare SaaS dashboard" > "app").
2. Combine domains: style + typography + color = complete system.
3. Always check `ux` for "animation", "z-index", "accessibility".
4. Iterate with different keywords if the first search misses.

> Visual-quality rules (no emoji icons, stable hover states, cursor-pointer on clickables, light/dark contrast, floating-navbar spacing) and the pre-delivery checklist are enforced by the **impeccable** skill's General rules and Absolute bans — follow those rather than duplicating them here.
