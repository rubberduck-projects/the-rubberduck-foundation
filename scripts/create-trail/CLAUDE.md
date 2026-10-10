# Creating a trail

Follow the phases in order. Finish and confirm each phase before starting the next. Content is authored as one JSON file, validated and turned into SQL by `create-trail.mjs`. Start from `sample-trail.json`.

Writing rules from the root CLAUDE.md apply: never use dashes in prose or titles. Slugs are the only exception and are kebab case.

## Phase 1: Declare the topic

1. Name the topic in one line, for example "Git essentials".
2. Write the `destination`: one sentence on what the learner can do at the end. It must be something observable, not "understand Git".
3. Write the `prerequisites`: what the learner must already be able to do. Each has a `title`, a `note`, and an optional `href`.
4. Write the `nextSteps`: where to go after this trail. Same shape as prerequisites.
5. Pick the `slug` (usually the title in kebab case) and set `verifiedAt` to today.

Stop here and confirm the topic and destination with the user.

## Phase 2: Plan the maps and article titles

Draft one list: every map with its article titles beneath it. Doing both at once shows gaps and misplaced articles early.

1. Decide scope and depth first. Ask what must be covered, what is out of scope, and how deep the trail goes (ideally fluent use). Write the answer down as the trail's boundary.
2. Group articles into maps. A map is a stage of progress, not a category. Aim for 8 to 15 maps and 7 to 15 articles per map.
3. Title each article as one idea the learner can finish in one sitting. If a title needs "and", split it.
4. Order articles so each builds on the ones before it. Article position follows the order in the file, across maps.
5. Choose each article slug (kebab case, unique across the trail).
6. Set `requires` only for hard dependencies: the learner truly cannot follow without that article. No self references, no repeats, no cycles. The script rejects all three.

Show the list to the user and wait for approval before writing any prose.

## Phase 3: Write the map summaries

1. 2 to 3 sentences per map, written after the article list is final.
2. Say what the learner can do after the map, not what the map contains.

## Phase 4: Write every article intro

1. Write all intros before any article body, so the trail reads as a whole.
2. One line each: why this article matters to the learner right now.
3. Do not repeat the title. Do not preview the answer.

## Phase 5: Deep dive, one article at a time

Finish one article completely before starting the next. For each article, in this order:

1. Add the details. Explain the idea in plain language, define terms when first used, and keep to the depth set in Phase 2.
2. Add examples where they help. Prefer something the learner can run or inspect, then say what they should see. Put code in fenced blocks with a language tag.
3. End with a short version under the exact heading `## As you quack it to the rubberduck!`. Three to five sentences that the learner could say aloud to a rubber duck from memory. This is always the last section.

Do not pad. If a section does not change what the learner can do, cut it.

## Phase 6: Validate and generate

1. Save the file as `scripts/create-trail/<slug>.json`.
2. Ask the user to run `node scripts/create-trail/create-trail.mjs scripts/create-trail/<slug>.json`.

## JSON shape

```json
{
  "slug": "kebab-case",
  "title": "Trail title",
  "destination": "One sentence.",
  "verifiedAt": "2026-10-06T00:00:00Z",
  "prerequisites": [{ "title": "", "note": "", "href": "https://optional" }],
  "nextSteps": [{ "title": "", "note": "", "href": "https://optional" }],
  "maps": [
    {
      "title": "",
      "summary": "",
      "articles": [
        { "slug": "kebab-case", "title": "", "intro": "", "requires": ["other-slug"], "body": ["markdown lines"] }
      ]
    }
  ]
}
```

`body` is a string or an array of lines. In JSON, escape quotes and use `\n` only in the string form.
