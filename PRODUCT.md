# Rubberduck Foundation

## Why we exist

Rubber-duck debugging works for two reasons. Explaining a problem out loud forces its structure into the open — and the duck never makes you feel stupid for asking.

Almost everything that makes a developer good is unwritten. It lives in one senior engineer's head, in a private Slack full of hard-won answers, in a $2,000 course, in a company whose onboarding docs are better than anything public. None of that knowledge is rare because it's hard to write down. It's rare because writing it down and maintaining it doesn't pay, so almost nobody does it, and the people who could benefit most never see it.

We think that's a solvable problem, not a permanent condition of the industry. The Rubberduck Foundation exists to build the free alternative to all of it — learning, building, and community — and to keep it honest enough that "free" doesn't quietly mean "worse."

That's the whole bet: that knowledge kept private mostly stays small, and knowledge made public, tested, and maintained compounds. We're building for the compounding.

---

## Mission

**To help people learn, build, and connect — by the easiest path that still leaves something worth keeping.**

"Easiest path" means we optimize for time-to-first-real-progress, not for completeness or prestige. "Something worth keeping" means every session, path, or project produces an artifact — code, a written answer, a tested claim — that outlives the moment it was created for. If a path is easy but leaves nothing behind, it's not done. If it's thorough but nobody finishes it, it's not working.

---

## Vision

A developer anywhere can go from curious to capable without paying for a course, knowing the right people, or working at the right company. Not eventually, not in theory — in practice, today, for whoever shows up. What they learn here is open, tested in public, and owned by no vendor.

"Anywhere" is load-bearing: low-bandwidth connections, machines without admin rights, and languages other than English are constraints we design for, not edge cases we get to later. We are not trying to be the best learning platform for people who already have options. We are trying to be the reason someone with no options gets one.

We measure ourselves against the gap, not against other platforms. The gap is: how much of what a well-connected developer knows by osmosis is still invisible to everyone else. Our job is to close it, in public, faster than it reopens.

---

## Who this is for

- **The newcomer** — knows enough to be dangerous, not enough to know what to search for. Needs a path that says what to know first and doesn't punish them for asking.
- **The self-taught builder** — has an idea and momentum, not a team or a budget. Needs to go from zero to a working thing in one sitting, in a sandbox where breaking it is free.
- **The experienced developer without a network** — solved this problem before, somewhere nobody sees it. Needs a place to write it down once and point to it forever, and a Circle of peers who won't waste their time.
- **The maintainer** — wrote something useful, can't sustain it alone. Needs collaborators who can find the work and trust it's real.

We are not building for people who already have access — a paid course, a mentor, a company with strong internal docs. If a path serves them too, that's a side effect, not the target.

---

## What that looks like

**Learn.** Maintained learning paths that state honestly what you need to know first, what you'll be able to do after, and when they were last verified to still work. A path with broken steps is worse than no path. Every path has an owner, a last-verified date, and a visible way to report "this step is broken now" that gets triaged, not lost. Paths that go stale get flagged before a learner hits the rot, not after.

**Build.** A place to start building in one sitting. Low-ceremony entry, real scaffolding, and a sandbox tier where nothing is at stake while you find out whether the idea holds. Scaffolding means working starter code and a clear seam for where your part begins — not a slide deck. The sandbox has real limits (compute, storage, time) but zero cost and zero cleanup burden: throwing it away is as easy as starting it.

**Connect.** Circles — small self-organising groups around a topic, a technology, or a city — plus open sessions, mentorship, and a public commons where questions get answered within a day and stay searchable afterwards. Circles are small enough that no one is anonymous and large enough that no single person is a bottleneck. Mentorship here is asynchronous by default and scheduled by exception — a mentor's answer should help the next ten people who have the same question, not just the one who asked.

None of these three stand alone for long. A path should hand you off into a build. A build should surface questions a Circle answers. An answer good enough to reuse should become part of a path. The system is supposed to close that loop by itself, not rely on someone manually stitching it together every time.

---

## What we produce

- **Software** — libraries, tools, and abstractions. Judged by whether someone outside the Foundation depends on them, not by lines of code.
- **Playbooks** — end-to-end workflows and development processes. Each one names the problem it solves, the steps in order, and the point where it stops applying.
- **Writing** — guides, articles, and structured learning paths. Written for the reader's next hour, not for search engines.
- **Models & data** — curated models and open evaluation datasets. Provenance and license are stated up front, not discovered by the user later.

Building with AI is one of the areas we actively support, and we expect it to be a busy one. It is not what defines the Foundation. Good practice, openly maintained, is — whatever the tools of the moment turn out to be.

Everything we produce carries a license that permits reuse without asking permission, and an owner who is a person, not just an org name, so there's someone to ask when something's unclear.

We'd rather ship ten things a thousand people depend on than a thousand things nobody finishes. Breadth is not the goal. Depth that other people can stand on is.

---

## How far this goes

Most of this document describes what exists to be used today. This section describes what we're building toward, stated plainly so it can be checked against later, not just aspired to.

- **A learning path for anything worth learning.** Not just web development and the languages with the biggest communities — the paths that are currently locked behind a specific employer, a specific country's university system, or a niche too small for any course platform to bother with. If it's real, valuable, and currently only taught in private, it belongs on the list.
- **A sandbox that scales with the learner, not against them.** Someone's first "hello world" and someone's first distributed system should both be able to run here, free, without either one subsidizing hardship for the other. That's a capacity and cost problem, not a slogan, and we treat it as one — sandbox limits get renegotiated in public as usage and funding change, never quietly.
- **A commons that outlives any single answer.** Today a good answer helps the next ten people who search for it. The goal is an archive dense and well-organized enough that most questions are already answered before they're asked twice — where writing something down once is strictly better than answering it in a DM, because the written version keeps working after you've moved on.
- **A Circle within reach of anywhere, not just tech hubs.** Access to peers who take your work seriously shouldn't depend on living in a city with a scene. Success looks like Circles forming in places that have never had one, run by people the Foundation didn't hand-pick.
- **Independence from any one funder, platform, or company's roadmap.** A mission this size is expensive to run and easy to compromise. We plan to diversify funding sources deliberately, refuse funding that comes with editorial strings, and keep the core paths, sandbox, and commons usable even if any single revenue line disappeared tomorrow.

None of this is a promise of a date. It's a promise of a direction, and a standard to hold the direction against: are we closer this year than last, and can anyone outside the Foundation verify that from the outside.

---

## How we keep it honest

Claims rot faster than code. A tutorial that worked in March can be wrong in June because a dependency changed underneath it. Ambition makes this worse, not better — the more paths, sandboxes, and Circles we run, the more surface area there is for something to quietly go stale. Our answer is process, not vigilance:

- **Every claim ships with a reproduction.** A command to run, a test to check, a dataset to inspect. "Trust me" is not a citation.
- **Every artifact has a last-verified date.** Undated is untrusted. We'd rather mark something stale in public than let it quietly mislead.
- **Anyone can flag rot.** Reporting a broken step or a false claim doesn't require being a maintainer — it requires being right, and it's checked quickly because the whole model depends on flags being cheap to raise.
- **Corrections are public.** If a path or claim was wrong, the fix and the fact that it was wrong both stay visible. We don't quietly edit history.
- **Growth doesn't outrun verification.** We don't launch a new path, sandbox capability, or Circle faster than we can keep the existing ones honest. A backlog of unverified content is a debt, and we track it like one.

---

## What we won't do

- **Depend on one vendor.** Nothing we publish should require a particular company's product. Where a specific tool is genuinely the best teaching example, we say so and name at least one alternative that works too.
- **Gatekeep by credential.** No degree, employer, or years of experience required for any role — as a contributor, a mentor, a Circle organiser, or a maintainer. Track record is demonstrated in public work, not asserted on a resume.
- **Publish what can't be checked.** Every claim comes with a way to reproduce it. If it can't be reproduced, it's an opinion, and we label it as one.
- **Charge for the path.** Access to a learning path, the sandbox, or the commons is never metered by ability to pay. Optional paid support (custom mentorship, hosted compute beyond sandbox limits) can exist, but never as a precondition for learning.
- **Optimize for engagement over outcome.** We don't design for time-on-site, streaks, or notification loops. Success is someone leaving with something built or understood, even if that means they leave.
- **Chase scale that breaks the promise.** We will turn down growth — a partnership, a feature, a headline number — if it means a path ships unverified, a sandbox gets throttled quietly, or a Circle stops being a place where no one is anonymous.

---

## What success looks like

- A learner ships something in their first sitting, not their first week.
- A path's last-verified date is never more than one release cycle stale.
- A question in the commons gets a real answer within a day, and that answer still resolves the same question a year later.
- Someone outside the Foundation depends on something we shipped, without needing our permission or our uptime.
- A Circle keeps running after its founding organiser steps back.
- A path exists for a subject that, before us, had no free and current option anywhere.
- Someone with no network, no budget, and no credential can point to something they built here and it holds up.
