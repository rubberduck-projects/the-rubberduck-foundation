export type Article = { id: number; slug: string; title: string; intro?: string; body?: string; position: number };
// A trail map is one section of a trail; trail maps never nest.
export type TrailMap = { id: number; title: string; summary: string; position: number; articles: Article[] };
// One article_connections row: articleId needs requiredArticleId first.
export type ArticleConnection = { articleId: number; requiredArticleId: number };
export type Resource = { title: string; note: string; href?: string };
export type Trail = {
    id: number;
    slug: string;
    title: string;
    destination: string;
    prerequisites: Resource[];
    nextSteps: Resource[];
    updatedAt: string;
    verifiedAt: string;
    maps: TrailMap[];
    connections: ArticleConnection[];
};

const kafka = "docker exec kafka /opt/kafka/bin";
const kafkaTty = "docker exec -it kafka /opt/kafka/bin";
const server = "\\\n  --bootstrap-server localhost:9092";
const tested = "Tested with: Kafka 4.1.0 in Docker";
const testedPy = `${tested}, Python 3.12 and \`confluent-kafka\` 2.11.`;

// Mock data until the Supabase tables exist; replace this array with a build time fetch.
export const trails: Trail[] = [
    {
        id: 1,
        slug: "mastering-kafka",
        title: "Mastering Kafka",
        destination:
            "Run Kafka, produce and consume messages reliably, and build a small event pipeline you can explain in an interview.",
        prerequisites: [
            { title: "Use a terminal.", note: "Run a command, read its output and stop it with Ctrl+C." },
            {
                title: "Install Docker.",
                href: "https://docs.docker.com/get-started/get-docker/",
                note: "Every article runs Kafka in a container, so nothing else needs installing.",
            },
            {
                title: "Write a short Python script.",
                href: "https://docs.python.org/3/tutorial/",
                note: "You need this from Send messages from code onwards.",
            },
        ],
        nextSteps: [
            {
                title: "Kafka Connect",
                href: "https://kafka.apache.org/documentation/#connect",
                note: "Move data between Kafka and databases without writing a consumer.",
            },
            {
                title: "Kafka Streams",
                href: "https://kafka.apache.org/documentation/streams/",
                note: "Joins, windows and exactly once processing, handled for you in Java.",
            },
            {
                title: "Message schemas",
                note: "Agree on message formats across teams with Avro or Protobuf and a schema registry.",
            },
        ],
        updatedAt: "2026-10-04T00:00:00Z",
        verifiedAt: "2026-10-04T00:00:00Z",
        maps: [
            {
                id: 1,
                position: 1,
                title: "Messaging basics",
                summary: "Run a broker, send a message and read it back.",
                articles: [
                    {
                        id: 1,
                        position: 1,
                        slug: "send-your-first-message",
                        title: "Send your first message",
                        intro: "Every Kafka skill starts here: getting one message in and reading it back out.",
                        body: `## The short version

Kafka stores messages in named lists called **topics**. A **producer** writes messages to a topic and a **consumer** reads them. Kafka ships with a console producer and a console consumer, so you need no code yet.

## Details

A **broker** is a running Kafka server. Start one in Docker:

\`\`\`bash
docker run -d --name kafka -p 9092:9092 apache/kafka:4.1.0
\`\`\`

Kafka keeps every message after it is read. Reading does not remove anything, so many consumers can read the same topic.

## Try it yourself

Create a topic called \`greetings\`:

\`\`\`bash
${kafka}/kafka-topics.sh ${server} --create --topic greetings
\`\`\`

Open a producer, type two lines and press Enter after each. Press Ctrl+C when you are done.

\`\`\`bash
${kafkaTty}/kafka-console-producer.sh ${server} --topic greetings
>hello
>hello again
\`\`\`

Read the topic from the start:

\`\`\`bash
${kafkaTty}/kafka-console-consumer.sh ${server} --topic greetings --from-beginning
\`\`\`

You should see:

\`\`\`text
hello
hello again
\`\`\`

## Explain it to the duck

Why does reading a message from Kafka not delete it?

${tested}.
`,
                    },
                    {
                        id: 2,
                        position: 2,
                        slug: "topics-and-partitions",
                        title: "Split a topic into partitions",
                        intro: "Partitions are how Kafka spreads one topic across machines and readers, and every later article builds on them.",
                        body: `## The short version

A topic is split into **partitions**. Each partition is an ordered log of messages stored on a broker. More partitions let more consumers read in parallel.

## Details

Kafka keeps order inside a partition, not across a whole topic. You choose the number of partitions when you create a topic. You can add partitions later, but you can never remove them.

## Try it yourself

\`\`\`bash
${kafka}/kafka-topics.sh ${server} --create --topic orders --partitions 3
${kafka}/kafka-topics.sh ${server} --describe --topic orders
\`\`\`

You should see a summary line with \`PartitionCount: 3\`, followed by one line for each partition, numbered 0, 1 and 2.

## Explain it to the duck

Why does Kafka promise order inside a partition but not across a whole topic?

${tested}.
`,
                    },
                    {
                        id: 3,
                        position: 3,
                        slug: "read-from-an-offset",
                        title: "Read from an offset",
                        intro: "Offsets let a consumer stop, restart and replay without losing its place.",
                        body: `## The short version

Every message in a partition gets a number called its **offset**, starting at 0. A consumer reads from an offset and moves forward.

## Details

Offsets never change and are never reused. Because Kafka keeps messages, you can go back to an old offset and read again. This is called **replaying**.

## Try it yourself

\`\`\`bash
${kafkaTty}/kafka-console-consumer.sh ${server} --topic greetings --partition 0 --offset 1 \\
  --property print.offset=true
\`\`\`

You should see only \`hello again\`, labelled with offset 1. The first message, at offset 0, is skipped.

## Explain it to the duck

A consumer crashes halfway through a topic. How could an offset help it carry on from the right place?

${tested}.
`,
                    },
                ],
            },
            {
                id: 2,
                position: 2,
                title: "Producing and consuming",
                summary: "Control where messages land, then send and read them from code.",
                articles: [
                    {
                        id: 4,
                        position: 1,
                        slug: "keys-and-ordering",
                        title: "Keep related messages in order",
                        intro: "Keys decide which partition a message lands in, which is how you keep related events in order.",
                        body: `## The short version

A message can carry a **key**. Kafka hashes the key to pick a partition, so messages with the same key always go to the same partition and stay in order.

## Details

Messages without a key are spread across partitions. Use a key whenever order matters for one thing, such as one customer or one order. Adding partitions later changes where keys land, so choose the count with care.

## Try it yourself

Send three orders, each written as key and value separated by a colon:

\`\`\`bash
${kafkaTty}/kafka-console-producer.sh ${server} --topic orders \\
  --property parse.key=true --property key.separator=:
>alice:pizza
>bob:salad
>alice:cake
\`\`\`

Read them back with their keys and partitions:

\`\`\`bash
${kafkaTty}/kafka-console-consumer.sh ${server} --topic orders --from-beginning \\
  --property print.key=true --property print.partition=true
\`\`\`

You should see both \`alice\` messages with the same partition number, and \`pizza\` before \`cake\`.

## Explain it to the duck

Why would a shop use the customer ID as the key for its order events?

${tested}.
`,
                    },
                    {
                        id: 5,
                        position: 2,
                        slug: "send-messages-from-code",
                        title: "Send messages from code",
                        intro: "Real systems produce from application code, and that is where you decide how safe each write is.",
                        body: `## The short version

Create a producer, call \`produce\`, then call \`flush\` to wait until Kafka confirms. Set \`acks\` to \`all\` so a write only counts once every copy of the partition has it.

## Details

\`produce\` only queues the message. Kafka confirms it later through a **delivery callback**. \`flush\` waits until every queued message is confirmed or has failed. With **idempotence** turned on, a retry never writes the same message twice.

\`\`\`python
from confluent_kafka import Producer

producer = Producer({
    "bootstrap.servers": "localhost:9092",
    "acks": "all",
    "enable.idempotence": True,
})

def report(err, msg):
    print(err or f"partition {msg.partition()} offset {msg.offset()}")

producer.produce("orders", key="alice", value="soup", on_delivery=report)
producer.flush()
\`\`\`

## Try it yourself

Install the client with \`pip install confluent-kafka\`, save the code as \`produce.py\` and run \`python produce.py\` twice.

You should see a line such as \`partition 1 offset 2\` each time. The offset goes up by one, and the partition stays the same because the key is the same.

## Explain it to the duck

What is the difference between calling \`produce\` and the message being safely stored?

${testedPy}
`,
                    },
                    {
                        id: 6,
                        position: 3,
                        slug: "read-messages-from-code",
                        title: "Read messages from code",
                        intro: "A consumer in code is what turns stored events into work your system does.",
                        body: `## The short version

Create a consumer, subscribe to a topic, then call \`poll\` in a loop. Each call returns one message, or nothing if none arrived in time.

## Details

Every consumer needs a \`group.id\`. You will see why in the next article. Setting \`auto.offset.reset\` to \`earliest\` makes a new group start from the oldest message instead of waiting for new ones. Always close the consumer so Kafka knows it has left.

\`\`\`python
from confluent_kafka import Consumer

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "printer",
    "auto.offset.reset": "earliest",
})
consumer.subscribe(["orders"])

try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(msg.error())
            continue
        print(msg.key().decode(), msg.value().decode(), msg.offset())
except KeyboardInterrupt:
    pass
finally:
    consumer.close()
\`\`\`

## Try it yourself

Save the code as \`consume.py\`, run it, wait a few seconds and press Ctrl+C. Then run it again.

You should see one line for each order you sent, such as \`alice pizza 0\`. The second run prints nothing.

## Explain it to the duck

Why does the second run print nothing, even though Kafka still has every message?

${testedPy}
`,
                    },
                ],
            },
            {
                id: 3,
                position: 3,
                title: "Consumer groups",
                summary: "Share work across consumers and control when progress is saved.",
                articles: [
                    {
                        id: 7,
                        position: 1,
                        slug: "share-work-with-a-group",
                        title: "Share work with a consumer group",
                        intro: "Consumer groups are how Kafka spreads the work of one topic across many workers.",
                        body: `## The short version

Consumers that share a \`group.id\` split the partitions of a topic between them. Each partition goes to exactly one consumer in the group, so the group handles every message once.

## Details

A second group gets its own copy of every message. That is the difference from a classic queue: one group behaves like a queue, and many groups behave like publish and subscribe. A group can use at most as many consumers as there are partitions. Extra consumers wait idle until one leaves.

## Try it yourself

Run this in two terminals:

\`\`\`bash
${kafkaTty}/kafka-console-consumer.sh ${server} --topic orders --group kitchen
\`\`\`

In a third terminal, describe the group:

\`\`\`bash
${kafka}/kafka-consumer-groups.sh ${server} --describe --group kitchen
\`\`\`

You should see three rows, one for each partition, with two different values in the \`CONSUMER-ID\` column.

## Explain it to the duck

Your topic has 3 partitions and you start 5 consumers in one group. What do the extra two do, and why?

${tested}.
`,
                    },
                    {
                        id: 8,
                        position: 2,
                        slug: "commit-offsets-yourself",
                        title: "Commit offsets yourself",
                        intro: "Committing at the right moment is the difference between losing an order and handling it twice.",
                        body: `## The short version

A **commit** saves the position of a group in a partition. Turn off automatic commits and call \`commit\` after the work is done.

## Details

Automatic commits run on a timer, so a crash can skip messages that were committed but never handled. Committing after the work means a crash can only cause a repeat. This is called **at least once** delivery, so make your handling safe to repeat.

Change the config of your consumer:

\`\`\`python
consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "billing",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
})
\`\`\`

Then commit after each message is handled:

\`\`\`python
        print(msg.key().decode(), msg.value().decode(), msg.offset())
        consumer.commit(message=msg, asynchronous=False)
\`\`\`

## Try it yourself

Make both changes in \`consume.py\`, run it, then stop it with Ctrl+C and describe the group:

\`\`\`bash
${kafka}/kafka-consumer-groups.sh ${server} --describe --group billing
\`\`\`

You should see \`LAG\` at 0 on every partition, because each message was committed after it was printed.

## Explain it to the duck

Why is a repeat safer than a skip, and what does your code need to do to handle a repeat?

${testedPy}
`,
                    },
                ],
            },
            {
                id: 4,
                position: 4,
                title: "Operating a cluster",
                summary: "Keep data safe and spot consumers that fall behind.",
                articles: [
                    {
                        id: 9,
                        position: 1,
                        slug: "keep-data-safe-with-replication",
                        title: "Keep data safe with replication",
                        intro: "Replication is what keeps your topics readable when a broker dies.",
                        body: `## The short version

Each partition is copied to several brokers. One copy is the **leader** and takes all writes. The others are **followers** that copy the leader. The **replication factor** is the number of copies.

## Details

Followers that are fully caught up are the **in sync replicas**, shown as \`Isr\`. With \`acks\` set to \`all\`, a write succeeds only when every in sync replica has it. If the leader dies, Kafka promotes a follower from that list. Production clusters usually use a replication factor of 3.

## Try it yourself

Ask for three copies on a cluster with one broker:

\`\`\`bash
${kafka}/kafka-topics.sh ${server} --create --topic payments --replication-factor 3
\`\`\`

You should see this error:

\`\`\`text
Error while executing topic command : Replication factor: 3 larger than available brokers: 1.
\`\`\`

Now describe \`orders\`. Every partition lists the same single broker as its leader, its only replica and its only in sync replica.

## Explain it to the duck

Why does Kafka refuse to create more copies than there are brokers?

${tested}.
`,
                    },
                    {
                        id: 10,
                        position: 2,
                        slug: "watch-consumer-lag",
                        title: "Watch consumer lag",
                        intro: "Lag is the first number to check when a consumer falls behind or stops.",
                        body: `## The short version

**Lag** is the number of messages between the committed offset of a group and the newest message in a partition. Rising lag means consumers are slower than producers.

## Details

\`kafka-consumer-groups.sh --describe\` shows \`CURRENT-OFFSET\`, \`LOG-END-OFFSET\` and \`LAG\` for each partition. Lag that grows steadily needs more consumers or faster handling. Lag stuck on one partition often points to one bad message or one stuck consumer. In production, export lag as a metric and alert on it.

## Try it yourself

Stop every \`kitchen\` consumer. Run \`produce.py\` five times, then describe the group:

\`\`\`bash
${kafka}/kafka-consumer-groups.sh ${server} --describe --group kitchen
\`\`\`

You should see the \`LAG\` column add up to 5. Start a \`kitchen\` consumer, describe the group again, and lag is back to 0.

## Explain it to the duck

Lag is growing on one partition only. What would you check first, and why?

${tested}.
`,
                    },
                ],
            },
            {
                id: 5,
                position: 5,
                title: "Stream processing",
                summary: "Turn one stream of events into another as they arrive.",
                articles: [
                    {
                        id: 11,
                        position: 1,
                        slug: "transform-a-stream",
                        title: "Transform a stream",
                        intro: "Stream processing turns raw events into new, useful events the moment they arrive.",
                        body: `## The short version

A stream processor is a consumer and a producer in one loop: read a message, transform it, write the result to another topic, then commit.

## Details

Write the output before you commit the input. If the processor crashes in between, it repeats the work instead of losing it. In Java, Kafka Streams runs this loop for you. The script below shows what it does underneath.

\`\`\`python
from confluent_kafka import Consumer, Producer

conf = {"bootstrap.servers": "localhost:9092"}
consumer = Consumer({**conf, "group.id": "ticketer",
    "auto.offset.reset": "earliest", "enable.auto.commit": False})
producer = Producer({**conf, "acks": "all"})
consumer.subscribe(["orders"])

while True:
    msg = consumer.poll(1.0)
    if msg is None or msg.error():
        continue
    producer.produce("tickets", key=msg.key(), value=msg.value().upper())
    producer.flush()
    consumer.commit(message=msg, asynchronous=False)
\`\`\`

## Try it yourself

Create \`tickets\` with 3 partitions, save the code as \`ticketer.py\` and run it. Then read \`tickets\` with the console consumer and \`--from-beginning\`.

You should see every order in uppercase, such as \`PIZZA\` and \`CAKE\`.

## Explain it to the duck

Why must the processor write the result before it commits the input?

${testedPy}
`,
                    },
                ],
            },
            {
                id: 6,
                position: 6,
                title: "Proof project",
                summary: "Put the trail together and prove you reached the destination.",
                articles: [
                    {
                        id: 12,
                        position: 1,
                        slug: "build-an-order-pipeline",
                        title: "Build an order pipeline",
                        intro: "This project uses most of the trail at once and gives you something worth showing in an interview.",
                        body: `## The short version

Build a small pipeline. A producer sends orders keyed by customer, a processor turns them into kitchen tickets, and a group of two workers handles the tickets.

## Details

Build it in this order, and check each part works before you add the next.

1. Create \`orders\` and \`tickets\` with 3 partitions each.
2. Write a producer that sends 20 orders for 4 customers, with the customer as the key and \`acks\` set to \`all\`.
3. Write a processor that reads \`orders\`, writes one ticket for each order and commits after each write.
4. Run two workers in the group \`kitchen\` that read \`tickets\`, print each ticket and commit after printing.
5. Stop one worker halfway through, then start it again.

## Try it yourself

You are done when all of these are true:

* Every order is printed as a ticket, and none are lost when a worker stops.
* Tickets for one customer print in the order they were sent.
* Describing the \`kitchen\` group shows a lag of 0 on every partition.
* A short README explains why you chose your key and when you commit.

## Explain it to the duck

Walk through what happens to one order if the processor crashes right after writing the ticket but before committing.

${testedPy}
`,
                    },
                ],
            },
        ],
        connections: [
            { articleId: 2, requiredArticleId: 1 },
            { articleId: 3, requiredArticleId: 1 },
            { articleId: 4, requiredArticleId: 2 },
            { articleId: 5, requiredArticleId: 4 },
            { articleId: 6, requiredArticleId: 5 },
            { articleId: 6, requiredArticleId: 3 },
            { articleId: 7, requiredArticleId: 2 },
            { articleId: 7, requiredArticleId: 3 },
            { articleId: 8, requiredArticleId: 7 },
            { articleId: 8, requiredArticleId: 6 },
            { articleId: 9, requiredArticleId: 2 },
            { articleId: 10, requiredArticleId: 8 },
            { articleId: 11, requiredArticleId: 8 },
            { articleId: 11, requiredArticleId: 5 },
            { articleId: 12, requiredArticleId: 11 },
            { articleId: 12, requiredArticleId: 10 },
            { articleId: 12, requiredArticleId: 9 },
        ],
    },
];

export const getTrail = (slug: string) => trails.find((t) => t.slug === slug);

const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position;

// Reading order: trail map position, then article position. Positions may have gaps.
export const sortedMaps = (trail: Trail) => [...trail.maps].sort(byPosition);

export const allArticles = (trail: Trail) => sortedMaps(trail).flatMap((m) => [...m.articles].sort(byPosition));

// Prose at 60 words a minute; code lines get 10 seconds each because readers run or retype them.
export function readingMinutes(article: Article) {
    if (!article.body) return 0;
    const codeLines = [...article.body.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
        .flatMap((m) => m[1].split("\n"))
        .filter((line) => line.trim()).length;
    const words = article.body.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 60 + codeLines / 6));
}

export const totalMinutes = (trail: Trail) =>
    allArticles(trail).reduce((n, a) => n + readingMinutes(a), 0);

export const mapOf = (trail: Trail, slug: string) => trail.maps.find((m) => m.articles.some((a) => a.slug === slug))!;

export function connections(trail: Trail) {
    const list = allArticles(trail);
    const order = new Map(list.map((a, i) => [a.id, i]));
    const previous = new Map<number, Article[]>(list.map((a) => [a.id, []]));
    const next = new Map<number, Article[]>(list.map((a) => [a.id, []]));

    trail.connections.forEach(({ articleId, requiredArticleId }) => {
        const at = order.get(articleId);
        const before = order.get(requiredArticleId);
        if (at === undefined || before === undefined) {
            throw new Error(`Trail ${trail.slug}: connection ${requiredArticleId} to ${articleId} points at an article outside this trail`);
        }
        // Rules out loops too, and lets the tree place each article after everything it needs.
        if (before >= at) {
            throw new Error(`Trail ${trail.slug}: ${list[at].slug} requires ${list[before].slug}, which does not come earlier in reading order`);
        }
        previous.get(articleId)!.push(list[before]);
        next.get(requiredArticleId)!.push(list[at]);
    });

    const byOrder = (a: Article, b: Article) => order.get(a.id)! - order.get(b.id)!;
    previous.forEach((v) => v.sort(byOrder));
    next.forEach((v) => v.sort(byOrder));
    return { previous, next };
}
