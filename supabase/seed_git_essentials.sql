-- DuckTrails seed: the Git essentials trail.
-- Rows are linked by slug and position instead of id, so it works whatever ids the identity columns hand out.
begin;

insert into trails (slug, title, destination, prerequisites, next_steps, updated_at, verified_at) values (
  'git-essentials', 'Git Essentials', 'Track your work with Git, branch and merge safely, undo mistakes, and share changes through a pull request.',
  '[{"title":"Use a terminal.","note":"Run a command and read its output."},{"title":"Install Git.","href":"https://git-scm.com/downloads","note":"Run git --version to check it works."},{"title":"Create a GitHub account.","href":"https://github.com/signup","note":"You need this from Push and pull onwards."}]'::jsonb,
  '[{"title":"Rebasing","href":"https://git-scm.com/book/en/v2/Git-Branching-Rebasing","note":"Keep a branch history straight instead of merging."},{"title":"Git hooks","href":"https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks","note":"Run checks automatically before each commit."},{"title":"Continuous integration","note":"Run tests on every push so broken changes are caught early."}]'::jsonb,
  '2026-10-06T00:00:00Z', '2026-10-06T00:00:00Z'
);

insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'git-essentials'), 'Getting started', 'Save snapshots of your work and see what changed.', 1);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'git-essentials'), 'Branching', 'Work on an idea in isolation, then bring it back.', 2);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'git-essentials'), 'Working with remotes', 'Share your work and fix clashes with other people.', 3);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'git-essentials'), 'Undoing mistakes', 'Take back changes without losing work.', 4);
insert into trail_maps (trail_id, title, summary, position) values ((select id from trails where slug = 'git-essentials'), 'Proof project', 'Put the trail together and prove you reached the destination.', 5);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 1),
  'save-your-first-commit', 'Save your first commit',
  'A commit is the unit of everything in Git, so start by making one.',
  '## The short version

A **repository** is a folder Git tracks. A **commit** is a saved snapshot of your files with a message that says why. You choose what goes into a commit by **staging** files first.

## Details

Git has three places a change can live: your working folder, the staging area, and the history of commits. `git add` moves a change into the staging area. `git commit` turns everything staged into a commit.

## Try it yourself

```bash
mkdir duck-notes
cd duck-notes
git init
echo "Quack" > notes.txt
git add notes.txt
git commit -m "Add first note"
git log --oneline
```

You should see one line with a short commit id and the message `Add first note`.

## Explain it to the duck

Why does Git make you stage a file before you commit it?

Tested with: Git 2.51.
',
  1
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 1),
  'see-what-changed', 'See what changed',
  'Before you commit, check exactly what you are about to save.',
  '## The short version

`git status` tells you which files changed and which are staged. `git diff` shows the lines that changed.

## Details

`git diff` compares your working folder with the staging area. Add `--staged` to compare the staging area with the last commit instead. Reading both before you commit catches stray edits.

## Try it yourself

```bash
echo "Quack again" >> notes.txt
git status
git diff
git add notes.txt
git diff --staged
```

The first diff shows the new line. After `git add`, the plain diff is empty and the staged diff shows the line.

## Explain it to the duck

Which diff would you run to review exactly what the next commit will contain?

Tested with: Git 2.51.
',
  2
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 2),
  'create-and-switch-branches', 'Create and switch branches',
  'Branches let you try an idea without touching the work that already functions.',
  '## The short version

A **branch** is a movable name that points at a commit. Creating one is instant and costs almost nothing.

## Details

Your current branch is where new commits go. Switching branches changes the files in your folder to match that branch.

## Try it yourself

```bash
git switch -c add-greeting
echo "Hello" > greeting.txt
git add greeting.txt
git commit -m "Add greeting"
git switch main
ls
```

Back on `main`, `greeting.txt` is gone. Switch to `add-greeting` and it returns.

## Explain it to the duck

Where did greeting.txt go when you switched back to main?

Tested with: Git 2.51.
',
  3
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 2),
  'merge-a-branch', 'Merge a branch',
  'Merging brings the work from one branch into another.',
  '## The short version

`git merge` takes the commits from another branch and combines them into the branch you are on.

## Details

If `main` has not moved since you branched, Git just moves the `main` name forward. This is a **fast forward**. If both branches have new commits, Git creates a **merge commit** with two parents.

## Try it yourself

```bash
git switch main
git merge add-greeting
git log --oneline
git branch -d add-greeting
```

You should see the greeting commit in the history of `main`. The last command deletes the branch name, not the commit.

## Explain it to the duck

When does a merge create a new commit and when does it not?

Tested with: Git 2.51.
',
  4
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 3),
  'push-and-pull', 'Push and pull',
  'Remotes are how your commits reach other people and other machines.',
  '## The short version

A **remote** is a copy of your repository hosted somewhere else, usually GitHub. `git push` sends your commits to it. `git pull` brings new commits from it into your branch.

## Details

By convention the main remote is called `origin`. The first push of a branch needs `-u` so Git remembers which remote branch to track.

## Try it yourself

Create an empty repository on GitHub, then run:

```bash
git remote add origin https://github.com/YOUR_NAME/duck-notes.git
git push -u origin main
git pull
```

Refresh the GitHub page and you should see your files. `git pull` should report that everything is up to date.

## Explain it to the duck

What is the difference between a local branch and the remote branch it tracks?

Tested with: Git 2.51 and GitHub.
',
  5
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 3),
  'resolve-a-merge-conflict', 'Resolve a merge conflict',
  'Conflicts look scary the first time, but they are just Git asking you to choose.',
  '## The short version

A **conflict** happens when two branches change the same lines. Git cannot guess which version you want, so it stops and marks the file for you to fix.

## Details

Git writes both versions into the file between markers: `<<<<<<<`, `=======` and `>>>>>>>`. You edit the file to the result you want, remove the markers, then stage and commit.

## Try it yourself

```bash
git switch -c left
echo "left" > clash.txt
git add clash.txt
git commit -m "Left"
git switch main
git switch -c right
echo "right" > clash.txt
git add clash.txt
git commit -m "Right"
git merge left
```

Git reports a conflict in `clash.txt`. Open it, keep the line you want, delete the markers, then run:

```bash
git add clash.txt
git commit
```

## Explain it to the duck

Why can Git merge most changes on its own but not these?

Tested with: Git 2.51.
',
  6
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 4),
  'undo-changes-safely', 'Undo changes safely',
  'Know which undo command touches what before you run one.',
  '## The short version

Use `git restore` to throw away edits in a file. Use `git revert` to undo a commit by adding a new one. Both are safe to use on shared history.

## Details

`git restore` discards uncommitted changes and cannot be undone, so check `git diff` first. `git revert` leaves the original commit in place and records its opposite, which is why it is safe after you have pushed.

## Try it yourself

```bash
echo "oops" >> notes.txt
git restore notes.txt
git log --oneline -1
git revert HEAD
```

After the restore, `notes.txt` is back to its last committed text. After the revert, a new commit appears that undoes the latest one.

## Explain it to the duck

Why is revert safer than deleting a commit once it has been pushed?

Tested with: Git 2.51.
',
  7
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 4),
  'stash-unfinished-work', 'Stash unfinished work',
  'Park half done changes so you can switch branches cleanly.',
  '## The short version

`git stash` puts your uncommitted changes on a shelf and gives you a clean folder. `git stash pop` brings them back.

## Details

Stashes belong to the repository, not to a branch, so you can stash on one branch and pop on another. New files are only stashed if you add `-u`.

## Try it yourself

```bash
echo "draft" >> notes.txt
git stash
git status
git stash pop
git status
```

The first status shows a clean folder. After the pop, `notes.txt` is modified again.

## Explain it to the duck

When would a stash be better than a commit?

Tested with: Git 2.51.
',
  8
);

insert into articles (trail_id, trail_map_id, slug, title, intro, body, position) values (
  (select id from trails where slug = 'git-essentials'), (select id from trail_maps where trail_id = (select id from trails where slug = 'git-essentials') and position = 5),
  'ship-a-change-with-a-pull-request', 'Ship a change with a pull request',
  'Use everything from this trail to get one change reviewed and merged.',
  '## The short version

A **pull request** asks other people to review a branch before it joins `main`. It is the normal way teams share changes.

## Details

The flow is always the same: branch, commit, push, open the request, respond to feedback, merge. Keep the change small so it is easy to review.

## Try it yourself

```bash
git switch -c improve-notes
echo "Better note" >> notes.txt
git add notes.txt
git commit -m "Improve notes"
git push -u origin improve-notes
```

Open the link Git prints, create the pull request, merge it on GitHub, then update your folder:

```bash
git switch main
git pull
```

## Prove it

Your `main` branch should contain the commit `Improve notes`, and your repository on GitHub should show the merged pull request.

## Explain it to the duck

Walk through each step from a new branch to a merged pull request and say why it exists.

Tested with: Git 2.51 and GitHub.
',
  9
);

insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'see-what-changed'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'save-your-first-commit'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'create-and-switch-branches'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'save-your-first-commit'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'merge-a-branch'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'create-and-switch-branches'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'push-and-pull'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'save-your-first-commit'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'resolve-a-merge-conflict'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'merge-a-branch'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'undo-changes-safely'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'see-what-changed'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'stash-unfinished-work'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'create-and-switch-branches'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'ship-a-change-with-a-pull-request'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'push-and-pull'));
insert into article_connections (trail_id, article_id, required_article_id) values ((select id from trails where slug = 'git-essentials'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'ship-a-change-with-a-pull-request'), (select id from articles where trail_id = (select id from trails where slug = 'git-essentials') and slug = 'resolve-a-merge-conflict'));

commit;
