# Developer Notes Template

Append this section verbatim to the bottom of the brief or issue file when closing a task. If the work was not tracked in a file, put the same substance in the PR or commit body. Fill it in as work progresses; it becomes the permanent record once the commit lands.

---

```markdown
## Developer notes

### Task framing

- Restated problem in concrete terms.
- Blast radius: routes, sections, components and lib modules touched.
- Acceptance criteria pulled from the brief.

### Plan

- Content / data changes (frontmatter fields, loader changes in `src/lib/articles.ts` or `src/lib/courses.ts`).
- Markdown pipeline changes (`src/lib/markdown.ts`).
- Routing / static generation (new routes, `generateStaticParams`).
- Components and sections (server vs. client boundary, motion).
- Styling (tokens in `globals.css`, `.prose`, responsive behavior).
- Site identity / config (`src/lib/site.ts`, `next.config.ts`).
- SEO (`generateMetadata`, JSON-LD, sitemap, robots, OG image).

### Trade-offs and assumptions

- Non-obvious decisions and why each was made.
- Assumptions about content shape, volume, or authoring workflow.
- Explicit out-of-scope items.
- Open questions remaining after merge.

### Execution log

- Ordered list of what was built, in the order it landed.

### Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build` results.
- Routes checked by hand, including dynamic ones.
- 375px overflow check.
- Content edge cases exercised (empty `coverImage`, missing optional frontmatter, long titles, empty catalog, body with no headings).

### Review

- Fresh engineer subagent findings.
- How each blocking finding was resolved.
- Non-blocking feedback noted for follow-up.

### Closing notes

- Commit SHA(s).
- Key files changed.
- Trade-offs accepted.
- Follow-ups / deferred items.
```

---

## Filling it in

- **Task framing** — write this before touching any file.
- **Plan** — write this after Step 2 (layer analysis) and before Step 4 (execution).
- **Trade-offs and assumptions** — write this as part of Step 3, before coding.
- **Execution log** — update live as each piece lands.
- **Verification** — fill in after Step 5.
- **Review** — fill in after Step 6 (peer review subagent).
- **Closing notes** — fill in after the commit.

Leaving any section blank is acceptable only if the section genuinely does not apply (e.g., no SEO surface in a pure styling change). If a section is blank, write `N/A — [reason]`.
