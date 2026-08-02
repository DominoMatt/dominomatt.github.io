# AGENTS.md

Instructions for AI coding agents working in this repository.

Read this before making any change. **The most common failure here is doing more
than was asked**, which is what the first section is about, after ## 0. How this
file is loaded.

## 0. How this file is loaded

- The devcontainer runs `npm ci && git config core.hooksPath .githooks` on every
  Codespace creation (`.devcontainer/devcontainer.json`).
- VS Code setting `chat.useAgentsMdFile: true` enables AGENTS.md reading. If
  disabled, these instructions are ignored with no warning.

## 1. Do only what was asked

Match the size of your change to the size of the request. Every change is
reviewed as a diff. A twenty-line diff for a one-line request is hard to review
and buries the change that was actually wanted, so an over-broad edit is worse
than no edit at all.

Before touching a file, state the scope in one line — _"Scope: fix the two typos
in the Setup section of `twelves.md`, nothing else"_ — then hold to it.

### Scope by request type

| Request                   | In scope                             | Out of scope                                                                        |
| ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| "Fix this typo"           | that typo                            | the rest of the sentence, paragraph, or file                                        |
| "Proofread this section"  | misspellings, grammar, punctuation   | rewording clear sentences, reordering, cutting or adding content, changing headings |
| "Turn this into a list"   | the markup for those items           | the wording inside the items, the prose around it                                   |
| "Add a new game"          | one new file in `src/content/games/` | existing game files, components, styles                                             |
| "Change the player count" | that one frontmatter field           | other fields, the body                                                              |

### Specifically, unless you are asked to

- **Do not hand-format Markdown.** Line wrapping, list markers, table padding
  and trailing whitespace are normalised automatically when you commit (see §3)
  — Prettier owns them. Don't reformat a file to tidy it either: a reformat
  nobody asked for is still an unrelated change.
- **Do not improve wording** when asked to fix mechanics. A proofread is not a
  rewrite.
- **Do not fix unrelated problems you notice.** Report them instead, at the end
  of your reply: _"Also spotted: the Scoring section says 3 players but the
  frontmatter says 2–4 — want me to fix that?"_ The decision is not yours to
  make.
- **Do not add comments, docstrings, or type annotations** to code or content
  you did not otherwise change.
- **Do not refactor, tidy, or restructure** as a side effect of another task.

One request means one focused set of edits. If a request genuinely cannot be
done without a large change, say so and get agreement before making it.

## 2. Read before you write

Never speculate about a file you have not opened. If a request names a file,
open it first. A confident guess about content that turns out to be wrong costs
a full review cycle, so grounded answers matter more than fast ones.

## 3. Verify before you report

Run `npm run build`. It validates every game's and note's frontmatter against
`src/content.config.ts`, so it catches the most common content mistakes.

If the build fails, either fix it or say plainly that it fails and why. Never
report a change as done without building.

Then list what you changed, file by file. Just the delta — no summary of the
project.

**Formatting is not your job.** `.githooks/pre-commit` runs Prettier over staged
Markdown as you commit, so wrapping and list style fix themselves. Don't run a
formatter by hand, don't reformat to match what you expect, and don't undo what
it does. If a commit comes back with formatting changes attached, that is the
hook working, not a problem.

## 4. What this project is

A static Astro site: a portfolio of tabletop game rules and short essays. It
builds to plain HTML and deploys to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`).

- **Content** — Markdown + frontmatter in `src/content/games/` and
  `src/content/notes/`
- **Templates** — `.astro` files in `src/components/`, `src/layouts/`,
  `src/pages/`
- **Styling** — one global stylesheet, `src/styles/global.css`; dark theme only
- **Config and site copy** — `src/data/site.ts`

`AUTHORING.md` is the human-facing guide to writing games and notes, with full
templates. `src/content.config.ts` is the authoritative frontmatter schema and
its comments explain every field. Prefer reading those over guessing.

### Content edits are routine; everything else is not

Editing `src/content/games/*.md`, `src/content/notes/*.md`, and files under
`public/print/` is normal work. Do it, within the scope rules above.

Changes to components, layouts, pages, `global.css`, `astro.config.mjs` or
`package.json` are not routine. Make them when asked, but say what you are
changing and why first. **Never add a dependency without asking.**

**Install with `npm ci`, never bare `npm install`.** `npm install` re-resolves
platform-specific optional dependencies and rewrites `package-lock.json` to suit
whichever OS it ran on. Codespaces and CI both build on Linux, so a lockfile
written anywhere else shows up as unexplained churn in the diff. If a dependency
genuinely has to be added, it has to be resolved on Linux.

**A push to `main` publishes the site.** There is no staging step and no
approval gate — the deploy runs on push and is live within a couple of minutes.
Committing is safe; pushing to `main` is publishing. Don't push unless
publishing is what was asked for.

## 5. Content conventions worth knowing

The traps the schema alone won't tell you:

- **The filename is the URL.** `src/content/games/twelves.md` →
  `/rules/twelves`. Lowercase, no spaces. Renaming a file breaks every existing
  link to it.
- **Quote the hex colours.** `accent: "#bd7f2e"` — unquoted, YAML reads `#` as
  the start of a comment and the value disappears.
- **Tables need the divider row.** A `| --- | --- |` line must sit directly
  under the header row, or Markdown renders the table as plain text.
- **`published: false`** hides an entry from its listing page and the sitemap,
  but the page still builds at its URL. It means "unlisted", not "draft".
- **Heading levels carry meaning:** `##` is a section, `###` a subsection,
  `####` a small uppercase label. Don't change a level to adjust how something
  looks.
- **Lettered sub-steps** use a literal `<ol type="a">` HTML block, because
  Markdown has no syntax for them. This is the one intended exception to "no raw
  HTML" in bodies.

## 6. Design principles, and how to breach one

This project holds a few deliberate constraints:

1. **Ship as little client JavaScript as possible.** The site is HTML-first.
2. **Dark theme only.** `data-theme="dark"` is hardcoded in
   `src/layouts/Base.astro`.
3. **No new dependencies** without an agreed reason.
4. **Static output only** — no server runtime, no client-side routing.
5. **No raw HTML in content** beyond the documented `<ol type="a">` sub-step
   block.

None of these are absolutes. They are defaults that can be overridden by a
decision on the record — `docs/adr/0001-client-js-for-print-mode.md`, for
instance, records why the print picker in `src/components/PrintButton.astro`
ships the site's only `<script>`.

**If a request cannot be fulfilled without breaching one of them, stop before
you edit.** Don't breach it silently and don't quietly engineer around it.
Instead:

1. Name the principle the request runs into, and why it applies.
2. Give the options, including the one that keeps the principle intact.
3. Wait for an explicit decision.
4. If the decision is to breach it, add a short ADR in `docs/adr/` recording
   why, in the same change. See `docs/adr/README.md`.

A breach with an ADR behind it is a decision. A breach nobody agreed to is a
bug.
