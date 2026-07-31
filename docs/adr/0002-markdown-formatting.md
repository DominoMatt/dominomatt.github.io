# 0002. Prettier for Markdown, split by directory, enforced pre-commit

- **Status:** accepted
- **Date:** 2026-07-31
- **Principle breached:** "No new dependencies" (adds `prettier`). Also retires
  an earlier informal rule that line breaks in prose belonged to the author and
  not to a formatter.

## Context

Markdown wrapping in this repo was never written down, so it drifted. Content
files are hand-wrapped inconsistently, and when `AGENTS.md` and the first ADR
were written they were hard-wrapped at ~80 on nothing more than habit — coding
agents pull hard toward that width for repo documentation, because that is what
the training data looks like.

That exposed a real gap rather than a style quibble. `AGENTS.md` told agents not
to _re-wrap_ existing prose, which governs editing text that already exists. It
said nothing about what wrapping to use when _authoring_ new prose, and the file
fell through its own gap.

A formatter was the obvious fix, but the reason none was in place is that
Markdown formatters had previously mangled the embedded HTML in `src/content/` —
the `<ol type="a">` sub-step blocks that Markdown has no syntax for. That risk
had to be disproved before adopting one, not assumed away.

**Prettier was tested against all 13 content files by diffing rendered HTML, not
source.** Every embedded block survived: the tab-and-space-mixed `<ol>` in
`memory.md`, the three-space-indented one in `push_your_luck.md`, the one nested
inside a blockquote in `dominoes_as_cards.md`, the `&nbsp;` indentation and
`<br>` in `domino_kingdom.md`. `diff -rw` across all 21 built pages was empty.
The only changes were whitespace a browser collapses anyway.

Alternatives considered:

- **Instruction only** — state the convention in `AGENTS.md` and rely on
  compliance. Rejected: a rule opposing a strong model prior gets violated most
  by the small, fast models Copilot Free routes to, and the client cannot pick a
  model.
- **CI check** — rejected outright. A failed deploy is a terrible way to learn
  about a line break, and blocking the client's publish over formatting is worse
  than the formatting.
- **dprint** — tested because it exposes `emphasisKind`/`strongKind` that
  Prettier does not, and it honoured them. Rejected: it hard-errors on
  `dominoes_as_cards.md` with _"Formatting not stable. Bailed after 5 tries.
  This indicates a bug in the plugin."_ A formatter that cannot converge on one
  of thirteen files cannot be in a commit path.
- **Format on save** — rejected: it reflows a paragraph while someone is still
  typing in it.
- **One convention for all Markdown** — rejected: the two kinds have opposite
  readers, see below.

## Decision

Add `prettier` as a devDependency and let it own Markdown formatting, with two
conventions split by directory in `prettier.config.mjs`:

| Files          | `proseWrap`    | Reader                                                                           |
| -------------- | -------------- | -------------------------------------------------------------------------------- |
| root, `docs/`  | `"always"` @80 | Developers and agents reading diffs — a one-word change stays a one-line diff    |
| `src/content/` | `"never"`      | A non-technical editor in the browser, who should never hand-manage a line break |

Enforcement is `.githooks/pre-commit`, activated by `core.hooksPath` from the
devcontainer's `postCreateCommand`, so Codespaces and coding agents both get it
without a separate install step.

The hook is deliberately incapable of failing a commit. Prettier missing warns
and exits 0; a file with unstaged edits is skipped rather than have that work
swept into the commit; only staged files are touched.

`yzhang.markdown-all-in-one` was removed from the devcontainer as part of this.
It reformats tables and renumbers lists on its own schedule, independently of
Prettier and of the `[markdown]` save settings, and is the likeliest source of
the original mangling — Prettier demonstrably is not.

## Consequences

- **`AGENTS.md` got shorter.** Its wrapping and list-style rules are gone; the
  hook enforces them. The scope rules stay, because a formatter has no opinion
  on whether "proofread this" licensed a rewrite. Codifying mechanics in tooling
  is what lets the instructions spend their length on judgement.
- **Adoption has a tail.** Only staged files are formatted, so there was no bulk
  reformat — but the _first_ edit to each not-yet-conforming file will carry
  that file's full reformat in its diff. `README.md`, `AUTHORING.md` and all of
  `src/content/` are in that state deliberately.
- **Prettier's Markdown opinions are not configurable**, and will land on
  content as files are touched: `*italic*` becomes `_italic_`, and `| --- |`
  table dividers get padded to the column width. `AUTHORING.md` teaches the
  short form; it stays correct as input, but the saved result will differ from
  what was typed. Worth re-checking if it confuses the editor.
- **The lockfile must be resolved on Linux.** Adding this dependency from
  Windows pruned two optional peer packages that a Linux install keeps, and
  Codespaces and CI both build on Linux. `AGENTS.md` now says to install with
  `npm ci` and never bare `npm install`.
- **The hook is bypassable** with `git commit --no-verify`, by design. It is a
  convenience, not a gate.
