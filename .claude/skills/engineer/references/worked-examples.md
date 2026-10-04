# Worked Examples

Concrete before/after examples for the four most common task types. Use these to calibrate the output format and level of specificity required.

---

## Example 1 — Feature request

**User:** "Let people filter the course catalog."

### Weak response

Launches into: a filter sidebar with track, level, duration and price facets, a search box, URL-synced query state, a results counter, saved filter presets, and an empty state illustration.

### Strong response

**Restated:** The catalog at `/courses` lists every course in one flat grid. As the catalog grows, someone landing there cannot narrow to the courses they can actually take. The sharpest single cut is `level` (Beginner / Intermediate / Advanced), which is already a required frontmatter field.

**Minimum viable version:**

- A client component `CourseFilter` holding the selected level in `useState`.
- `/courses/page.tsx` stays a server component: it loads all courses at build time and passes them to the filter component as props. Filtering happens client-side over an already-loaded array — no data fetching, which is the only option under static export anyway.
- Three toggle buttons plus "All", styled with existing tokens (`bg-surface`, `border-line`, active state in `text-duck`).
- No results state: a single line of copy, no illustration.

**Out of scope:** track and price facets, text search, URL query sync, pagination.

**Trade-offs:**

1. **Client-side filter vs. static per-level routes.** Pre-rendering `/courses/level/beginner/` would be zero-JS and indexable, but it triples the route surface and splits the canonical catalog for SEO. With a catalog this size, shipping the full list and filtering in the browser is simpler and the payload is already there. Revisit if the catalog passes a few hundred courses.
2. **Local state vs. URL query param.** A query param makes filters shareable, but `trailingSlash: true` plus static export means the param is purely client-side anyway. Skipping it keeps `/courses` as one canonical URL. Easy to add later without restructuring.
3. **Making the page client-side.** Not doing it. The page keeps reading `src/lib/courses.ts` at build time; only the filter UI is a client boundary, so the content loader never reaches the bundle.

**Acceptance criteria:**

- Given the catalog page, when no filter is selected, then every course renders, newest first.
- Given "Beginner" is selected, when the grid renders, then only courses with `level: Beginner` are visible.
- Given a filter matches nothing, when the grid renders, then the empty line shows instead of a blank area.
- Given 375px width, when any filter state is active, then there is no horizontal overflow.

**Next action:** Confirm level is the right first facet rather than track, then I will start with the filter component.

---

## Example 2 — Bug

**User:** "The article page sometimes has no table of contents."

### Weak response

Lists 15 generic reasons a React component might not render.

### Strong response

**Symptom:** `TableOfContents` renders nothing on some `/articles/[slug]/` pages, while others are fine. Static export means this is decided at build time, so it is a property of the content, not a runtime race.

**Most likely root causes, ranked:**

1. **The body has no headings at all.** Heading extraction in `src/lib/markdown.ts` returns an empty array and the component renders an empty shell. Most likely, and matches "some articles" precisely — short posts often have no `##` at all.
2. **The headings are at a depth the extractor filters out.** If extraction collects only `h2`/`h3`, an article written entirely with `####` yields nothing. Same empty-array symptom, different cause.
3. **Slug collision or missing slug.** If `rehype-slug` does not assign an id (e.g. a heading that is only an emoji or punctuation), the entry may be dropped or produce a dead anchor.

**Isolation steps:**

1. Find which articles are affected: `grep -L '^## ' content/articles/*.md` lists files with no level-2 heading. If that set matches the broken pages, it is cause 1 or 2.
2. Read the extraction code in `src/lib/markdown.ts` and note which depths it collects.
3. For a broken page that does have headings, inspect the built HTML in `out/articles/<slug>/index.html` for `id` attributes on the heading tags. Missing ids point at cause 3.

**Smallest safe fix (pending the grep result):**

- If the article genuinely has no headings, the component should render nothing at all rather than an empty container — an explicit early return when the heading list is empty.
- If the depth filter is too narrow, widen it in `src/lib/markdown.ts` so both loaders benefit, rather than patching the component.

**Verify:** `npm run build`, then check one article with no headings and one with deep-only headings. Confirm the first renders no TOC container and the second renders a populated one with working anchors.

**Next action:** Share the output of the grep and I will confirm which branch to fix.

---

## Example 3 — Architecture / design

**User:** "Should we add a CMS for the articles?"

### Weak response

Lists pros and cons of headless CMSes generically.

### Strong response

**Short answer:** No — not yet.

**Why not:** A CMS solves an authoring problem: non-technical people need to publish without touching git, or several authors need to work concurrently with review and scheduling. Neither is in evidence here. What a CMS would cost this project is concrete: content stops being local markdown read at build time, so `src/lib/articles.ts` becomes a network call, the build gains an external dependency and an API token, preview stops being `npm run dev`, and the static export needs a rebuild hook on every publish. That is real infrastructure in exchange for an editing surface nobody has asked for.

**What to do instead:** Keep markdown in `content/articles/`. The existing `new-article` skill already scaffolds correct frontmatter, which is the part authors actually get wrong. If the friction is writing rather than publishing, that is a better place to spend effort.

**Trade-off accepted:** Publishing requires a git commit and a rebuild. For a site where the same few people write and deploy, that is a familiar workflow, not a blocker.

**Revisit when:** someone outside the repo needs to publish without a pull request, or scheduled publishing becomes a requirement. Those are the concrete signals — not the article count.

---

## Example 4 — Code review

**User:** _(shares diff adding a featured-courses strip to the landing page)_

### Weak response

"Looks good overall! A few minor things..."

### Strong response

**Correctness:**

- `src/app/sections/learn.tsx:14` — the file gained `"use client"` to use `motion.div`, but it also calls `getCourses()` from `src/lib/courses.ts`, which reads the filesystem. This will fail the build. Keep `learn.tsx` a server component and move the animation into a small client wrapper that takes the course list as props, matching how the other animated sections are split.
- `src/app/sections/learn.tsx:38` — `courses.filter(c => c.featured).slice(0, 3)` with no fallback. If no course is marked featured, the strip renders an empty grid with a heading above it. Fall back to the three newest, or hide the section.

**Conventions:**

- `src/app/sections/learn.tsx:52` — hardcodes `#f5c542` for the accent. The palette token is `--duck`, exposed as `text-duck`. Use the token so a palette change propagates.
- `src/components/course-card.tsx:21` — new `<a href={...}>` for internal navigation. The rest of the codebase uses `next/link`. Swap it, or client-side navigation and prefetch are lost.

**Responsive:**

- `src/app/sections/learn.tsx:44` — `grid-cols-3` with no breakpoint prefix. At 375px this produces three columns roughly 100px wide and the card titles overflow. `CLAUDE.md` requires no horizontal overflow at 375px. Make it `grid-cols-1 md:grid-cols-3`.

**Accessibility:**

- `src/components/course-card.tsx:34` — the cover image has `alt=""` on a decorative-looking image that is in fact the only visual identifier of the course. Either give it the course title as alt text, or confirm it is decorative because the title is already adjacent in text.

**Non-blocking:**

- `src/app/sections/learn.tsx:29` — the motion variants are defined inline rather than pulled from `src/lib/animation-variants.ts`. Worth consolidating if these match an existing variant, but not blocking.

Five blocking issues (client-boundary build break, empty featured fallback, hardcoded color, raw anchor, mobile overflow). Fix before merging. Verify with `npm run build` — the first one will fail the build, so a green build is the proof.
