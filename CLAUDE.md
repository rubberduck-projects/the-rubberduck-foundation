# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Build static export into out/
npm run start     # Serve a production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Type check
```

## Architecture

Minimal Next.js 15 (App Router) hello-world app, React 19, exported as a static site
(`next.config.ts`: `output: "export"`, `images.unoptimized`, `trailingSlash: true`).
No server runtime, so no route handlers, middleware, server actions, or ISR.

- `src/app/layout.tsx` — root layout
- `src/app/page.tsx` — renders "Hello, world!"
- `src/app/globals.css` — minimal global styles


## Rules

- Never use any dashes in prose or UI copy. For example, — or – or - or 
- Exception: slugs and route folders are kebab case, such as `send-your-first-message` or `/trails/how-to-write/`.