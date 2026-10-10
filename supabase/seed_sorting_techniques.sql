-- DuckTrails seed: the Sorting techniques trail.
-- Rows are linked by slug and position instead of id, so it works whatever ids the identity columns hand out.
-- Article positions are unique across the whole trail, not per map.
begin;

insert into trails (slug, title, destination, prerequisites, next_steps, updated_at, verified_at) values (
  'sorting-techniques', 'Sorting Techniques', 'Write the classic sorting algorithms, explain their speed and stability, and pick the right one for a job.',
  '[{"title":"Write a short Python script.","href":"https://docs.python.org/3/tutorial/","note":"Every example is Python."},{"title":"Read a loop and a function.","note":"You should be comfortable with for loops, while loops and recursion basics."}]'::jsonb,
  '[{"title":"Searching","href":"https://docs.python.org/3/library/bisect.html","note":"Binary search needs sorted data, so it is the natural next step."},{"title":"Heaps and priority queues","href":"https://docs.python.org/3/library/heapq.html","note":"Get the smallest item without sorting everything."},{"title":"Algorithm analysis","note":"Learn to compare algorithms by how their work grows with input size."}]'::jsonb,
  '2026-10-06T00:00:00Z', '2026-10-06T00:00:00Z'
);

insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'sorting-techniques'), 'Simple sorts', 'Sort with Python, then write your first sorts by hand.', 1);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'sorting-techniques'), 'Faster sorts', 'Split the problem to sort large lists quickly.', 2);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'sorting-techniques'), 'Choosing a sort', 'Understand stability and measure real speed.', 3);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'sorting-techniques'), 'Proof project', 'Put the trail together and prove you reached the destination.', 4);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 1),
  'sort-with-python', 'Sort with Python',
  'Start with the tool you will use in real code, so you know what your own versions must match.',
  '## The short version

`sorted()` returns a new sorted list. `list.sort()` sorts a list in place and returns nothing. Both accept a `key` function and a `reverse` flag.

## Details

Python sorts with Timsort, which is fast and stable. Stable means items that compare equal keep their original order. You will rely on that later.

## Try it yourself

```python
numbers = [5, 2, 9, 1]
print(sorted(numbers))
print(numbers)
numbers.sort(reverse=True)
print(numbers)
```

You should see `[1, 2, 5, 9]`, then the original `[5, 2, 9, 1]`, then `[9, 5, 2, 1]`.

## Explain it to the duck

Why does sorted() leave the original list alone while list.sort() changes it?

Tested with: Python 3.13.
',
  1
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 1),
  'selection-sort', 'Selection sort',
  'The easiest sort to explain: find the smallest item, put it first, repeat.',
  '## The short version

Selection sort scans the unsorted part for the smallest item and swaps it to the front. Then it repeats on what is left.

## Details

It always does about n squared comparisons, even on a list that is already sorted. It makes few swaps, which matters only when writing is expensive.

## Try it yourself

```python
def selection_sort(items):
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]

data = [5, 2, 9, 1]
selection_sort(data)
print(data)
```

You should see `[1, 2, 5, 9]`.

## Explain it to the duck

Why does selection sort take the same time on a sorted list as on a shuffled one?

Tested with: Python 3.13.
',
  2
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 1),
  'insertion-sort', 'Insertion sort',
  'Sort the way you sort playing cards, and see why nearly sorted data is cheap.',
  '## The short version

Insertion sort keeps a sorted section at the front. It takes the next item and slides it left until it sits in the right place.

## Details

On a list that is already sorted, each item stays put, so the work is linear. On a reversed list it is n squared. Insertion sort is stable and is often used for very small lists.

## Try it yourself

```python
def insertion_sort(items):
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current

data = [5, 2, 9, 1]
insertion_sort(data)
print(data)
```

You should see `[1, 2, 5, 9]`.

## Explain it to the duck

Why is insertion sort fast on a list that is almost sorted?

Tested with: Python 3.13.
',
  3
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 2),
  'merge-sort', 'Merge sort',
  'Split the list, sort each half, then merge: your first divide and conquer algorithm.',
  '## The short version

Merge sort splits a list in half, sorts each half the same way, then merges the two sorted halves into one.

## Details

Halving takes about log n levels and each level merges n items, so the total is n log n whatever the input. Merging needs extra space for the result.

## Try it yourself

```python
def merge_sort(items):
    if len(items) <= 1:
        return items
    middle = len(items) // 2
    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    return merged + left[i:] + right[j:]

print(merge_sort([5, 2, 9, 1]))
```

You should see `[1, 2, 5, 9]`.

## Explain it to the duck

Why does using <= instead of < when merging keep the sort stable?

Tested with: Python 3.13.
',
  4
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 2),
  'quicksort', 'Quicksort',
  'The sort most libraries are built around, and the one with an unlucky worst case.',
  '## The short version

Quicksort picks a **pivot**, puts smaller items on one side and larger items on the other, then sorts each side the same way.

## Details

With a good pivot the sides are about equal and the work is n log n. With a bad pivot, such as always taking the first item of a sorted list, one side is empty every time and the work becomes n squared. Picking a random pivot makes that unlikely.

## Try it yourself

```python
import random

def quicksort(items):
    if len(items) <= 1:
        return items
    pivot = random.choice(items)
    smaller = [x for x in items if x < pivot]
    equal = [x for x in items if x == pivot]
    larger = [x for x in items if x > pivot]
    return quicksort(smaller) + equal + quicksort(larger)

print(quicksort([5, 2, 9, 1, 5]))
```

You should see `[1, 2, 5, 5, 9]`.

## Explain it to the duck

What input makes quicksort slow when the pivot is always the first item, and why?

Tested with: Python 3.13.
',
  5
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 3),
  'stable-sorting-and-keys', 'Stable sorting and keys',
  'Sort records by more than one field without writing a new algorithm.',
  '## The short version

A **stable** sort keeps equal items in their original order. That lets you sort by one field, then sort again by another, and keep the first ordering inside ties.

## Details

A `key` function tells Python what to compare. Python calls it once per item, so it is cheap even for complex records.

## Try it yourself

```python
people = [("Ana", 30), ("Ben", 25), ("Cy", 30), ("Di", 25)]
by_name = sorted(people, key=lambda p: p[0])
by_age = sorted(by_name, key=lambda p: p[1])
print(by_age)
```

You should see `[(''Ben'', 25), (''Di'', 25), (''Ana'', 30), (''Cy'', 30)]`. Names stay in order inside each age.

## Explain it to the duck

Why would this two step sort give the wrong answer with an unstable algorithm?

Tested with: Python 3.13.
',
  6
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 3),
  'compare-sorting-speeds', 'Compare sorting speeds',
  'Measure the algorithms you wrote instead of trusting the theory.',
  '## The short version

Timing the same input across algorithms shows how n squared and n log n diverge as the list grows.

## Details

Use `time.perf_counter()` for short timings. Build the input once, copy it for each run, and test more than one size so the trend is visible.

## Try it yourself

Reuse `insertion_sort` and `merge_sort` from earlier articles.

```python
import random, time

for size in (1000, 4000):
    data = [random.random() for _ in range(size)]
    for name, fn in (("insertion", insertion_sort), ("merge", merge_sort), ("python", sorted)):
        copy = list(data)
        start = time.perf_counter()
        fn(copy)
        print(size, name, round(time.perf_counter() - start, 4))
```

Quadrupling the size should make insertion sort roughly sixteen times slower and merge sort a little over four times slower.

## Explain it to the duck

Why does the built in sort still beat your merge sort at the same size?

Tested with: Python 3.13.
',
  7
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'sorting-techniques'), (select id from trail_maps where trail_id = (select id from trails where slug = 'sorting-techniques') and position = 4),
  'sort-a-list-of-records', 'Sort a list of records',
  'Use what you learned to sort real data and defend your choice.',
  '## The short version

Take a list of records, sort it by two fields, and explain which algorithm you used and why.

## Try it yourself

Create a list of at least ten students with a `grade` and a `name`. Sort them by grade from high to low, with names in alphabetical order inside each grade. Use `sorted()` with a key, then repeat the task with your own `merge_sort` and compare the results.

## Prove it

Both approaches print the same list, and you can explain in two sentences why a stable sort made the second field work.

## Explain it to the duck

Walk through how you chose your algorithm and what would change if the list had ten million records.

Tested with: Python 3.13.
',
  8
);

insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'selection-sort'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'sort-with-python'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'insertion-sort'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'selection-sort'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'merge-sort'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'insertion-sort'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'quicksort'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'merge-sort'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'stable-sorting-and-keys'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'sort-with-python'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'compare-sorting-speeds'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'quicksort'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'compare-sorting-speeds'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'stable-sorting-and-keys'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'sorting-techniques'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'sort-a-list-of-records'), (select id from articles where trail_id = (select id from trails where slug = 'sorting-techniques') and slug = 'compare-sorting-speeds'));

commit;
