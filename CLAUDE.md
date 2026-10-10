# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build into .next/
npm run start     # Serve a production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Type check
```

## Architecture

Next.js 15 (App Router), React 19, served by a Node runtime (`next start`) with
`images.unoptimized` and `trailingSlash: true`. Content lives in Supabase and is read in
`src/content/trails.ts`. Pages under `src/app/(site)/` use time based ISR: `revalidate = 60`
in `src/app/(site)/layout.tsx`, and unknown trail or article slugs render on first request.

- `src/app/layout.tsx` — root layout
- `src/app/page.tsx` — renders "Hello, world!"
- `src/app/globals.css` — minimal global styles


## Rules

- Never use any dashes in prose or UI copy. For example, — or – or - or 
- Exception: slugs and route folders are kebab case, such as `send-your-first-message` or `/trails/how-to-write/`.