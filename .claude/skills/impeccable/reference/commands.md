# Commands & Routing

Read this file when the user's request involves a sub-command (an explicit command word, a "what should I do?" no-argument invocation, or an intent that clearly maps to one command). For a general design request with no command, you don't need this file — follow the SKILL's General rules and the register reference.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, then build a feature end-to-end | [reference/craft.md](craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](shape.md) |
| `init` | Build | Set up project context: PRODUCT.md, DESIGN.md, live config, next steps | [reference/init.md](init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](audit.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](adapt.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](optimize.md) |
| `live` | Iterate | Visual variant mode: pick elements in the browser, generate alternatives | [reference/live.md](live.md) |

Plus two management commands: `pin <command>` and `unpin <command>`, detailed in the SKILL's Pin / Unpin section.

## Routing rules

1. **No argument**: the user is asking "what should I do?" Make the menu context-aware instead of static. Setup has already run `context.mjs`; if that reported `NO_PRODUCT_MD` you are already in init (setup), so finish that and skip this. Otherwise run `node .claude/skills/impeccable/scripts/context-signals.mjs` once and read its JSON, then lead with the **2-3 highest-value next commands**, each with a one-line reason pulled from the signals, followed by the full menu (the table above, grouped by category). **Never auto-run a command; the recommendation is a suggestion the user confirms.**

   Reason over the signals; there is no score to obey:
   - `setup.hasDesign` false while `setup.hasCode` true → `document` (capture the visual system).
   - `critique.latest` is `null` → the project has never been critiqued; for a set-up project with a real surface, offering `/impeccable critique <surface>` is a strong default.
   - `critique.latest` with a low `score` or non-zero `p0` / `p1` → `polish` (it reads that snapshot as its backlog), or re-run `critique` if the snapshot looks stale.
   - `git.changedFiles` pointing at one surface → scope `audit` or `polish` to those files specifically, naming them.
   - `devServer.running` true → `live` is available for in-browser iteration; if false, don't lead with `live`.
   - Otherwise group by intent exactly as init's "Recommend starting points" step does (build new / improve what's there / iterate visually), tailored to `setup.register`.

   **If `scan.targets` is non-empty, run `node .claude/skills/impeccable/scripts/detect.mjs --json <scan.targets joined by spaces>` once** (the bundled detector over local files: no network, no npx). `scan.via` tells you what they are: `git-changes` (the markup/style files in your dirty tree, the most relevant set), `source-dir` (e.g. `src`, `app`), `html`, or `root`. Fold the hits into your picks: many quality / contrast hits → `audit` or `polish`; a specific slop family → the matching command (gradient text or eyebrows → `quieter` / `typeset`, flat or gray palette → `colorize`, and so on). It's a real, current signal that beats guessing. If detect errors or the tree is large and slow, skip it and recommend the user run `audit` themselves; never block the suggestion on it.

   Keep it to 2-3 pointed picks with the exact command to type. The menu stays the fallback; the recommendation is the lede.
2. **First word matches a command**: load its reference file and follow its instructions. Everything after the command name is the target.
3. **First word doesn't match, but the intent clearly maps to one command** (e.g. "fix the spacing" → `layout`, "rewrite this error message" → `clarify`, "the colors feel flat" → `colorize`): load that command's reference and proceed as if invoked. If two commands could fit, ask once which.
4. **No clear command match**: general design invocation. Apply the setup steps, the General rules, and the loaded register reference, using the full argument as context.

Setup (context gathering, register) is already loaded by then; sub-commands don't re-invoke `/impeccable`.

If the first word is `craft`, setup still runs first, but [reference/craft.md](craft.md) owns the rest of the flow. If setup invokes `init` as a blocker, finish init, refresh context, then resume the original command and target.

`teach` is a deprecated alias for `init`: if the user types it, load [reference/init.md](init.md) and proceed as if they ran `init`.
