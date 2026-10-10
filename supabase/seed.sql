-- DuckTrails seed: the Mastering Kafka trail from the original mock data.
-- Rows are linked by slug and position instead of id, so it works whatever ids the identity columns hand out.
begin;

insert into trails (slug, title, destination, prerequisites, next_steps, updated_at, verified_at) values (
  'mastering-kafka', 'Mastering Kafka', 'Run Kafka, produce and consume messages reliably, and build a small event pipeline you can explain in an interview.',
  '[{"title":"Use a terminal.","note":"Run a command, read its output and stop it with Ctrl+C."},{"title":"Install Docker.","href":"https://docs.docker.com/get-started/get-docker/","note":"Every article runs Kafka in a container, so nothing else needs installing."},{"title":"Write a short Python script.","href":"https://docs.python.org/3/tutorial/","note":"You need this from Send messages from code onwards."}]'::jsonb,
  '[{"title":"Kafka Connect","href":"https://kafka.apache.org/documentation/#connect","note":"Move data between Kafka and databases without writing a consumer."},{"title":"Kafka Streams","href":"https://kafka.apache.org/documentation/streams/","note":"Joins, windows and exactly once processing, handled for you in Java."},{"title":"Message schemas","note":"Agree on message formats across teams with Avro or Protobuf and a schema registry."}]'::jsonb,
  '2026-10-04T00:00:00Z', '2026-10-04T00:00:00Z'
);

insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Messaging basics', 'Run a broker, send a message and read it back.', 1);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Producing and consuming', 'Control where messages land, then send and read them from code.', 2);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Consumer groups', 'Share work across consumers and control when progress is saved.', 3);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Operating a cluster', 'Keep data safe and spot consumers that fall behind.', 4);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Stream processing', 'Turn one stream of events into another as they arrive.', 5);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'mastering-kafka'), 'Proof project', 'Put the trail together and prove you reached the destination.', 6);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 1),
  'send-your-first-message', 'Send your first message',
  'Every Kafka skill starts here: getting one message in and reading it back out.',
  '## The short version

Kafka stores messages in named lists called **topics**. A **producer** writes messages to a topic and a **consumer** reads them. Kafka ships with a console producer and a console consumer, so you need no code yet.

## Details

A **broker** is a running Kafka server. Start one in Docker:

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:4.1.0
```

Kafka keeps every message after it is read. Reading does not remove anything, so many consumers can read the same topic.

## Try it yourself

Create a topic called `greetings`:

```bash
docker exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --topic greetings
```

Open a producer, type two lines and press Enter after each. Press Ctrl+C when you are done.

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 --topic greetings
>hello
>hello again
```

Read the topic from the start:

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic greetings --from-beginning
```

You should see:

```text
hello
hello again
```

## Explain it to the duck

Why does reading a message from Kafka not delete it?

Tested with: Kafka 4.1.0 in Docker.
',
  1
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 1),
  'topics-and-partitions', 'Split a topic into partitions',
  'Partitions are how Kafka spreads one topic across machines and readers, and every later article builds on them.',
  '## The short version

A topic is split into **partitions**. Each partition is an ordered log of messages stored on a broker. More partitions let more consumers read in parallel.

## Details

Kafka keeps order inside a partition, not across a whole topic. You choose the number of partitions when you create a topic. You can add partitions later, but you can never remove them.

## Try it yourself

```bash
docker exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --topic orders --partitions 3
docker exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --describe --topic orders
```

You should see a summary line with `PartitionCount: 3`, followed by one line for each partition, numbered 0, 1 and 2.

## Explain it to the duck

Why does Kafka promise order inside a partition but not across a whole topic?

Tested with: Kafka 4.1.0 in Docker.
',
  2
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 1),
  'read-from-an-offset', 'Read from an offset',
  'Offsets let a consumer stop, restart and replay without losing its place.',
  '## The short version

Every message in a partition gets a number called its **offset**, starting at 0. A consumer reads from an offset and moves forward.

## Details

Offsets never change and are never reused. Because Kafka keeps messages, you can go back to an old offset and read again. This is called **replaying**.

## Try it yourself

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic greetings --partition 0 --offset 1 \
  --property print.offset=true
```

You should see only `hello again`, labelled with offset 1. The first message, at offset 0, is skipped.

## Explain it to the duck

A consumer crashes halfway through a topic. How could an offset help it carry on from the right place?

Tested with: Kafka 4.1.0 in Docker.
',
  3
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 2),
  'keys-and-ordering', 'Keep related messages in order',
  'Keys decide which partition a message lands in, which is how you keep related events in order.',
  '## The short version

A message can carry a **key**. Kafka hashes the key to pick a partition, so messages with the same key always go to the same partition and stay in order.

## Details

Messages without a key are spread across partitions. Use a key whenever order matters for one thing, such as one customer or one order. Adding partitions later changes where keys land, so choose the count with care.

## Try it yourself

Send three orders, each written as key and value separated by a colon:

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 --topic orders \
  --property parse.key=true --property key.separator=:
>alice:pizza
>bob:salad
>alice:cake
```

Read them back with their keys and partitions:

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic orders --from-beginning \
  --property print.key=true --property print.partition=true
```

You should see both `alice` messages with the same partition number, and `pizza` before `cake`.

## Explain it to the duck

Why would a shop use the customer ID as the key for its order events?

Tested with: Kafka 4.1.0 in Docker.
',
  4
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 2),
  'send-messages-from-code', 'Send messages from code',
  'Real systems produce from application code, and that is where you decide how safe each write is.',
  '## The short version

Create a producer, call `produce`, then call `flush` to wait until Kafka confirms. Set `acks` to `all` so a write only counts once every copy of the partition has it.

## Details

`produce` only queues the message. Kafka confirms it later through a **delivery callback**. `flush` waits until every queued message is confirmed or has failed. With **idempotence** turned on, a retry never writes the same message twice.

```python
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
```

## Try it yourself

Install the client with `pip install confluent-kafka`, save the code as `produce.py` and run `python produce.py` twice.

You should see a line such as `partition 1 offset 2` each time. The offset goes up by one, and the partition stays the same because the key is the same.

## Explain it to the duck

What is the difference between calling `produce` and the message being safely stored?

Tested with: Kafka 4.1.0 in Docker, Python 3.12 and `confluent-kafka` 2.11.
',
  5
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 2),
  'read-messages-from-code', 'Read messages from code',
  'A consumer in code is what turns stored events into work your system does.',
  '## The short version

Create a consumer, subscribe to a topic, then call `poll` in a loop. Each call returns one message, or nothing if none arrived in time.

## Details

Every consumer needs a `group.id`. You will see why in the next article. Setting `auto.offset.reset` to `earliest` makes a new group start from the oldest message instead of waiting for new ones. Always close the consumer so Kafka knows it has left.

```python
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
```

## Try it yourself

Save the code as `consume.py`, run it, wait a few seconds and press Ctrl+C. Then run it again.

You should see one line for each order you sent, such as `alice pizza 0`. The second run prints nothing.

## Explain it to the duck

Why does the second run print nothing, even though Kafka still has every message?

Tested with: Kafka 4.1.0 in Docker, Python 3.12 and `confluent-kafka` 2.11.
',
  6
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 3),
  'share-work-with-a-group', 'Share work with a consumer group',
  'Consumer groups are how Kafka spreads the work of one topic across many workers.',
  '## The short version

Consumers that share a `group.id` split the partitions of a topic between them. Each partition goes to exactly one consumer in the group, so the group handles every message once.

## Details

A second group gets its own copy of every message. That is the difference from a classic queue: one group behaves like a queue, and many groups behave like publish and subscribe. A group can use at most as many consumers as there are partitions. Extra consumers wait idle until one leaves.

## Try it yourself

Run this in two terminals:

```bash
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic orders --group kitchen
```

In a third terminal, describe the group:

```bash
docker exec kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --describe --group kitchen
```

You should see three rows, one for each partition, with two different values in the `CONSUMER-ID` column.

## Explain it to the duck

Your topic has 3 partitions and you start 5 consumers in one group. What do the extra two do, and why?

Tested with: Kafka 4.1.0 in Docker.
',
  7
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 3),
  'commit-offsets-yourself', 'Commit offsets yourself',
  'Committing at the right moment is the difference between losing an order and handling it twice.',
  '## The short version

A **commit** saves the position of a group in a partition. Turn off automatic commits and call `commit` after the work is done.

## Details

Automatic commits run on a timer, so a crash can skip messages that were committed but never handled. Committing after the work means a crash can only cause a repeat. This is called **at least once** delivery, so make your handling safe to repeat.

Change the config of your consumer:

```python
consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "billing",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
})
```

Then commit after each message is handled:

```python
        print(msg.key().decode(), msg.value().decode(), msg.offset())
        consumer.commit(message=msg, asynchronous=False)
```

## Try it yourself

Make both changes in `consume.py`, run it, then stop it with Ctrl+C and describe the group:

```bash
docker exec kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --describe --group billing
```

You should see `LAG` at 0 on every partition, because each message was committed after it was printed.

## Explain it to the duck

Why is a repeat safer than a skip, and what does your code need to do to handle a repeat?

Tested with: Kafka 4.1.0 in Docker, Python 3.12 and `confluent-kafka` 2.11.
',
  8
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 4),
  'keep-data-safe-with-replication', 'Keep data safe with replication',
  'Replication is what keeps your topics readable when a broker dies.',
  '## The short version

Each partition is copied to several brokers. One copy is the **leader** and takes all writes. The others are **followers** that copy the leader. The **replication factor** is the number of copies.

## Details

Followers that are fully caught up are the **in sync replicas**, shown as `Isr`. With `acks` set to `all`, a write succeeds only when every in sync replica has it. If the leader dies, Kafka promotes a follower from that list. Production clusters usually use a replication factor of 3.

## Try it yourself

Ask for three copies on a cluster with one broker:

```bash
docker exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --topic payments --replication-factor 3
```

You should see this error:

```text
Error while executing topic command : Replication factor: 3 larger than available brokers: 1.
```

Now describe `orders`. Every partition lists the same single broker as its leader, its only replica and its only in sync replica.

## Explain it to the duck

Why does Kafka refuse to create more copies than there are brokers?

Tested with: Kafka 4.1.0 in Docker.
',
  9
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 4),
  'watch-consumer-lag', 'Watch consumer lag',
  'Lag is the first number to check when a consumer falls behind or stops.',
  '## The short version

**Lag** is the number of messages between the committed offset of a group and the newest message in a partition. Rising lag means consumers are slower than producers.

## Details

`kafka-consumer-groups.sh --describe` shows `CURRENT-OFFSET`, `LOG-END-OFFSET` and `LAG` for each partition. Lag that grows steadily needs more consumers or faster handling. Lag stuck on one partition often points to one bad message or one stuck consumer. In production, export lag as a metric and alert on it.

## Try it yourself

Stop every `kitchen` consumer. Run `produce.py` five times, then describe the group:

```bash
docker exec kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --describe --group kitchen
```

You should see the `LAG` column add up to 5. Start a `kitchen` consumer, describe the group again, and lag is back to 0.

## Explain it to the duck

Lag is growing on one partition only. What would you check first, and why?

Tested with: Kafka 4.1.0 in Docker.
',
  10
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 5),
  'transform-a-stream', 'Transform a stream',
  'Stream processing turns raw events into new, useful events the moment they arrive.',
  '## The short version

A stream processor is a consumer and a producer in one loop: read a message, transform it, write the result to another topic, then commit.

## Details

Write the output before you commit the input. If the processor crashes in between, it repeats the work instead of losing it. In Java, Kafka Streams runs this loop for you. The script below shows what it does underneath.

```python
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
```

## Try it yourself

Create `tickets` with 3 partitions, save the code as `ticketer.py` and run it. Then read `tickets` with the console consumer and `--from-beginning`.

You should see every order in uppercase, such as `PIZZA` and `CAKE`.

## Explain it to the duck

Why must the processor write the result before it commits the input?

Tested with: Kafka 4.1.0 in Docker, Python 3.12 and `confluent-kafka` 2.11.
',
  11
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'mastering-kafka'), (select id from trail_maps where trail_id = (select id from trails where slug = 'mastering-kafka') and position = 6),
  'build-an-order-pipeline', 'Build an order pipeline',
  'This project uses most of the trail at once and gives you something worth showing in an interview.',
  '## The short version

Build a small pipeline. A producer sends orders keyed by customer, a processor turns them into kitchen tickets, and a group of two workers handles the tickets.

## Details

Build it in this order, and check each part works before you add the next.

1. Create `orders` and `tickets` with 3 partitions each.
2. Write a producer that sends 20 orders for 4 customers, with the customer as the key and `acks` set to `all`.
3. Write a processor that reads `orders`, writes one ticket for each order and commits after each write.
4. Run two workers in the group `kitchen` that read `tickets`, print each ticket and commit after printing.
5. Stop one worker halfway through, then start it again.

## Try it yourself

You are done when all of these are true:

* Every order is printed as a ticket, and none are lost when a worker stops.
* Tickets for one customer print in the order they were sent.
* Describing the `kitchen` group shows a lag of 0 on every partition.
* A short README explains why you chose your key and when you commit.

## Explain it to the duck

Walk through what happens to one order if the processor crashes right after writing the ticket but before committing.

Tested with: Kafka 4.1.0 in Docker, Python 3.12 and `confluent-kafka` 2.11.
',
  12
);

insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'topics-and-partitions'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'send-your-first-message'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-from-an-offset'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'send-your-first-message'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'keys-and-ordering'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'topics-and-partitions'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'send-messages-from-code'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'keys-and-ordering'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-messages-from-code'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'send-messages-from-code'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-messages-from-code'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-from-an-offset'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'share-work-with-a-group'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'topics-and-partitions'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'share-work-with-a-group'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-from-an-offset'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'commit-offsets-yourself'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'share-work-with-a-group'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'commit-offsets-yourself'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'read-messages-from-code'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'keep-data-safe-with-replication'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'topics-and-partitions'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'watch-consumer-lag'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'commit-offsets-yourself'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'transform-a-stream'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'commit-offsets-yourself'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'transform-a-stream'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'send-messages-from-code'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'build-an-order-pipeline'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'transform-a-stream'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'build-an-order-pipeline'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'watch-consumer-lag'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'mastering-kafka'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'build-an-order-pipeline'), (select id from articles where trail_id = (select id from trails where slug = 'mastering-kafka') and slug = 'keep-data-safe-with-replication'));

commit;
