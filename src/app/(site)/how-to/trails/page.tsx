import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import Markdown from "@/components/ui/Markdown";
import { layout } from "@/theme/tokens";

export const metadata: Metadata = {
    title: "How to write a DuckTrail | Rubberduck Foundation",
    description:
        "How to write a trail that takes a beginner or a professional to one destination, through trail maps and short articles they can skip, practise and explain back.",
};

const body = `## What a trail is

A trail is a learning path to one destination: a skill to pick up or a job to be ready for. Examples are "Mastering Kafka", "Junior frontend developer" or "Data analyst with SQL". A reader who reaches the destination can do something they could not do before, and can prove it.

A trail has two parts, and only two.

* **Trail maps** are the sections of a trail. Each one covers a big skill on the way, such as "Consumer groups".
* **Articles** are attached to a trail map. Each one teaches one small skill, reads in 2 minutes and can be practised in 10.

Trail maps never contain other trail maps. If a trail map feels too big, split it into two trail maps side by side.

A trail is not an explainer. "How the web works" is an article, not a destination.

## What makes a DuckTrail different

Most tutorials are written for one kind of reader and never checked. A DuckTrail serves a curious beginner and a busy professional on the same path, because every article keeps three promises.

1. **Do, not just read.** Every article ends with a task the reader can check on their own machine.
2. **Skip what you know.** Every article teaches one small skill, so a reader who already has it can move straight on.
3. **Explain it to the duck.** Every article asks the reader to explain the idea out loud, in their own words. If they cannot, they are not done yet.

## Know your three readers

Write every article with all three in mind.

* **The newcomer** has never done this before. They need the simplest version, plain words and no gaps.
* **The switcher** already knows a similar tool. They need the differences, and they skip what is familiar.
* **The professional** wants to fill one gap fast. They jump to the article they need and skim what they already know.

## The shape of a trail

1. **Pick one destination.** Name the skill or the role in one sentence. If you need the word "and" twice, split it into two trails.
2. **Lay out the trail maps.** List the big skills on the way, in order. For "Mastering Kafka" they could be "Messaging basics", "Producing and consuming", "Consumer groups", "Operating a cluster" and "Stream processing". For a job trail they are the skills the role asks for. Give each trail map a title and a one line summary.
3. **Attach articles to each trail map.** Break the skill into the small steps a reader needs, and write one article for each. Keep a trail map to a handful of articles.
4. **Keep it flat.** When a trail map grows too large, split it into two trail maps rather than nesting one inside another.
5. **Finish with a proof project.** The last trail map holds a small project that uses most of the articles together and has a clear definition of done. For a job trail, make it something worth showing in an interview.

## Connect the articles

Articles are linked by prerequisite order, across the whole trail and not only inside one trail map.

* Every article connects to the article before it and the article after it.
* The first article has no previous article. The last article has no next article.
* An article can have several previous articles when it needs more than one thing first. Consumer groups, for example, need both topics and offsets.
* An article can have several next articles when it unlocks more than one thing.
* A connection means "learn this first". Never add one just because two topics feel related.
## Begin and end

* **The first article names the prerequisites.** Say what the reader should already know, and link to a trail that teaches it if one exists.
* **The last article suggests next steps.** Point to a related trail, a harder skill, a project to build or the next role up.

## Start simple

* The first article should be the simplest skill in the whole trail, something a complete beginner can do in minutes, like sending one message to Kafka. If a newcomer could skip it, it is not simple enough.
* Break every skill down to its simplest version. Teach that version first, then add one idea at a time.
* If an article needs more than 2 minutes of reading, split it into smaller articles in the same trail map.

## The shape of an article

Every article has the same parts in the same order, so readers always know where they are.

1. **Title:** the skill, as something the reader can do. "Send your first message", not "Messages".
2. **Intro:** one sentence on why this skill matters for the destination.
3. **The short version:** the answer in a sentence or two, before any detail.
4. **Details:** short paragraphs, one idea each.
5. **Try it yourself:** a task that practises the skill, followed by what the reader should see when it works.
6. **Explain it to the duck:** one question the reader answers out loud in their own words, the way a developer explains a bug to a rubber duck.

Store each article as two parts: \`intro\` holds the intro sentence and \`body\` holds everything from The short version onwards. The page adds links to the previous and next articles from the connections you add, so add one for every article to learn first, including the article just before it. Reading time is worked out from the body, so you never set it.

## Writing rules

* Lead with the answer, then explain it.
* Use short sentences and everyday words.
* Define a term the first time it appears.
* Show a working example for every claim you can test.
* Keep code blocks small enough to read without scrolling.
* Say what the reader should see, not only what they should type.
* Copy error messages exactly, so readers can search for them.
* Name the versions you tested with, such as "Tested with Kafka 3.8".
* Leave out "just", "simply" and "obviously". What is obvious to you is the reason someone is reading.
* Teach the current way first. Mention older ways only when readers will meet them in real code.

> A claim you cannot reproduce is an opinion.

## Trail map template

Add one trail map for each big skill. \`position\` sets its place in the trail.

* **title:** Messaging basics
* **summary:** Run a broker, send a message and read it back.
* **position:** 1

## Article template

Add one article to a trail map for each small skill. \`position\` sets its place in the trail map.

* **slug:** send-your-first-message
* **title:** Send your first message
* **intro:** One sentence on why this skill matters for the destination.* **position:** 1

Then add one connection for each article to learn first. The first article in the trail has none.

Write the body in markdown:

\`\`\`md
## The short version

Say what to do in a sentence or two.

## Details

Explain one idea.

## Try it yourself

Give a task the reader can do.

You should see: the result that proves it worked.

## Explain it to the duck

One question the reader answers out loud.

Tested with: tool and version.
\`\`\`

## Slugs and files

Slugs are kebab case: lowercase letters and numbers, with words joined by hyphens and no spaces or other symbols. Choose one that matches the title, such as \`send-your-first-message\`. Article slugs must be unique across the whole trail.

## Keep it fresh

When a tool you teach releases a major version, rerun every Try it yourself in your trail and update "Tested with". A trail that silently stops working costs a beginner hours and a professional their trust.

## Before you publish

* The destination is a skill or a role, stated in one sentence.
* Every trail map has a title, a one line summary and at least one article.
* No trail map sits inside another trail map.
* The trail ends with a proof project and a clear definition of done.
* The first article is the simplest skill in the trail and lists its prerequisites.* The last article suggests next steps.
* Every other article links to a previous article and a next article.
* Links only mean "learn this first".
* Every article has a Try it yourself with the expected result, and an Explain it to the duck question.
* Every article reads in 2 minutes, and its task takes 10 minutes or less.
* Every command and snippet has been run, and the versions are named.
* No term is used before it is explained.
`;

export default function HowToWritePage() {
    return (
        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 10 } }}>
            <Box component="article" sx={{ maxWidth: layout.proseWidth }}>
                <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, letterSpacing: "-0.03em", mb: 2 }}>
                    How to write a DuckTrail
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 3 }}>6 min read</Typography>
                <Typography sx={{ fontSize: "1.125rem", lineHeight: 1.6, mb: 5 }}>
                    A good trail leads to one destination through a few trail maps of connected articles. Each article
                    starts simple, lets experienced readers skip ahead, and ends with something the reader can do,
                    check and explain back.
                </Typography>

                <Markdown>{body}</Markdown>
            </Box>
        </Container>
    );
}
