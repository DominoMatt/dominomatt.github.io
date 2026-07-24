# Writing games & notes

All game and note content lives in plain Markdown files. You never touch code.

- **Games** → `src/content/games/<id>.md`
- **Notes** → `src/content/notes/<id>.md`

The file name (without `.md`) becomes the page URL — `twelves.md` →
`/rules/twelves`, `onepage.md` → `/notes/onepage`. Use lowercase, no spaces.

Every game and note also appears on its catalogue page automatically — all
games at `/games` (filterable by category), all notes at `/notes` — unless
you mark it `published: false` (see below).

Each file has two parts: the **frontmatter** (the block between the `---`
lines at the top — the card details) and the **body** (everything below — the
prose).

## The section convention (used in both games and notes)

The body is ordinary **Markdown** (full GitHub Flavored Markdown — see below).
Headings run big → small, so a reader can scan a page by its headings alone.
Leave a blank line between paragraphs.

```markdown
## Setup
### The boneyard

Shuffle every tile face down. This pool is the boneyard.

The youngest player lays the first tile.
```

renders as:

```
Setup                 (large serif title — short accent tick above it)
The boneyard          (medium serif subtitle)
Shuffle every tile face down. This pool is the boneyard.
The youngest player lays the first tile.
```

- `##` is a **section** — a large serif heading with a small accent tick above
  it. These are the headings the page is scanned by; one per real section.
- `###` is a **subsection** — a medium serif heading under a section. Optional:
  a section can go straight into prose with no `###`.
- `####` is a **label** — a small uppercase mono line, for tagging a sub-bit
  (e.g. a "Notation" key). Use it sparingly.

## Full Markdown is supported

Inside any section you can use the full range of GitHub Flavored Markdown and it
will be styled to match the site:

```markdown
Regular paragraphs, **bold**, *italic*, ~~strikethrough~~, and [links](https://example.com).

- bullet lists
- with nested items
  1. numbered
  2. sub-items

> Blockquotes for an aside.

| Component | Count |
| --- | --- |
| Tiles | 28 |
| Score pad | 1 |

`inline code`, and fenced code blocks:

​```
plain code block
​```
```

> **Tables need the divider row.** A table must have the `| --- | --- |` line
> directly under the header row, or Markdown treats it as plain text.

## New game — template

Create `src/content/games/<id>.md`:

```markdown
---
title: Twelves
order: 1                      # position on the index (1, 2, 3, …)
category: Domino Variant
players: 2–4
# age: 8+                      # optional — shown in the eyebrow as players · age · time
time: 20 min
accent: "#bd7f2e"            # cover colour — keep the quotes
ink: "#1d1408"              # symbol/title colour on the cover — keep the quotes
# motif: pips                 # optional — pips | diamond | circle | line; see below
# art: dominos_black.svg      # optional — real icon shown in the rules-page masthead; see below
description: "One or two sentences shown on the card and rules page."
mechanics: [Tile Placement, Push Your Luck, Hand Management]  # tag list — display only
license: CC BY-NC             # shown as a line under the mechanics tags
contents: 28 printed tiles · 1-page rules · score pad
spec: PDF · A4 + LETTER · 6 PP
downloads:
  - title: Print & Play PDF
    file: twelves.pdf                 # path under public/print/
    description: The 28 printed tiles, the rules, and a score pad on a single sheet.
    spec: PDF · A4 + LETTER · 6 PP     # optional — omit to hide the spec text
# attributions: ["Box Art by CoolArtist", "3D Tokens by CoolPrinter"]  # optional — credit lines; see below
# relatedGames: [smallkings, wake]   # optional — cross-links these games at the end
# published: false                  # optional — omit for the normal case; see below
---

## Components
### A set of bones

What the player prints and needs to play.

## Setup
### The boneyard

How the game begins.

## Winning
### Going long

How the game ends.
```

`downloads:` is optional — omit it entirely for a game that's play-from-the-page
only, with nothing to print or download; the game just won't show a downloads
section. When present, it renders as an "Attachments" section at the bottom
of the game's rules page — every entry's name, description, and GET button are
always visible (nothing to expand to reach the file). It's an ordered list,
one entry per file:

```yaml
downloads:
  - title: Print & Play PDF
    file: twelves.pdf
    description: The 28 printed tiles, the rules, and a score pad on a single sheet.
    spec: PDF · A4 + LETTER · 6 PP
  - title: Tile STL
    file: twelves/tiles.stl
    description: >
      3D-printable domino tiles, sized for a 0.4mm nozzle.

      Print at 100% infill for the right heft.
    spec: STL · 6 PARTS · 20MM
    version: V1.2
    history:
      - version: V1.0
        note: Original release
        date: FEB '26
        file: twelves/tiles-v1.stl
```

- `title` — the file's name, shown above its description.
- `file` — where the file lives under `public/print/`. A flat name
  (`twelves.pdf`) works for a single file; use a subfolder
  (`twelves/tiles.stl`) once a game has more than one, so filenames across
  games don't collide. The `PDF` / `IMG` / `STL` type tag shown next to the
  name is read straight off this path's extension — never a separate field
  to keep in sync.
- `description` — a short blurb, always shown under the name. Can run more
  than one line — either YAML folded (`>`, blank line = paragraph break) or
  literal (`|`, every line kept as-is) block scalars both work; each
  resulting line renders as its own paragraph.
- `spec` — optional one-line meta string (paper size, page count, print
  settings, whatever's relevant) shown next to the version. Omit it and that
  entry just shows no spec text.
- `version` — optional; defaults to `V1.0` if you leave it out.
- `history` — optional list of earlier releases of this same file, newest
  first, each with a `version`, a one-line `note` on what changed, and a
  `date`. Leave it out entirely for a file with no version history — a
  "N EARLIER VERSIONS" toggle only appears when this list is non-empty. Each
  entry's own `file` is optional — set it (same `public/print/` convention as
  above) to show a small "GET →" link for that old version specifically;
  leave it out for a past release you no longer keep a copy of, and that row
  just shows its version/note/date with no link.

A game can have any number of entries, in any order — including zero (a game
played straight from the rules page, with nothing to print).

`attributions:` is an optional list of plain credit-line strings, e.g.
`"Box Art by CoolArtist"` or `"3D Tokens by CoolPrinter"`. When present, they
show as a bulleted "Attributions" list in the Attachments section, right
after Downloads. Leave it out entirely for a game with nothing to credit —
zero entries hides the list, same as `downloads:`. A game with attributions
but no downloads still gets an Attachments section (just the Attributions
list, no Downloads block).

`motif:` is optional — one of `pips | diamond | circle | line`, a small
plain shape drawn on the "box art" cover (top area, title pinned to the
bottom below it) as a placeholder until the game has real art. Leave it out
entirely for a game with neither `motif` nor `art` and the cover just shows
the flat `accent` colour with the title at the bottom — no shape.

`art:` is optional. Give it the filename of an SVG already dropped into
`src/assets/art/` (ask a dev to add the file itself — this is the one asset
type that isn't a plain content edit) and that icon replaces the flat
accent-colour square (and any `motif` shape) everywhere this game's identity
shows up: the rules page masthead, the small swatch on the games index row,
the "box art" cover shown when that row is expanded, and wherever this
game is cross-linked as a related/referenced game on another page. Leave it
out entirely and every one of those stays exactly as it is today (flat
colour, plain motif shape if set) — most games don't have real art yet.
Pick whichever variant (if more than one exists for the same icon) reads
clearly against this game's `accent` colour.

`mechanics:` is a tag list of the game's mechanics (e.g. `Push Your Luck`,
`Bluffing`) — display only, never used for filtering. The first three show up
in the index's game widget, right after the description; the full list shows
under the description on the game's own rules page.

`license:` is required — a short plain-text label (e.g. `CC BY-NC`) shown as
a small line right after the mechanics tags, both on the games index row and
the game's own rules page. This is the license for the game's content (rules
text, described components, etc.) — separate from the codebase's own MIT
license (see the repo's `LICENSE` file). Every current game ships under
`CC BY-NC`; if a future game needs different terms, just change its value.

`category:` is free text, not a fixed list — whatever you type becomes a
filter chip on `/games`. Capitalization doesn't matter (`Domino Variant` and
`domino variant` share a chip), but the words themselves must match — spell
it **exactly the same** on every game that should group together
(`Domino Variant` and `Domino Variants` make two separate chips).

`relatedGames:` is optional. List the ids (filenames, no `.md`) of other
games worth pointing a reader to — their cover art renders at the end of
this game's rules page, each linking to its own rules. Leave it out entirely
for a game with no natural cross-link.

### Publishing a game early, or not at all

`published: false` takes a game off `/games` (and its category filter) and
out of the sitemap, but the page still builds at `/rules/<id>` — useful for
sharing a preview link before it's ready to be found. Leave `published` out
entirely (or set it `true`) for the normal case: listed everywhere. Either
way, anything already featured on the homepage (`src/data/site.ts`) or
referenced from a note's `games:` list keeps showing there regardless —
those are hand-picked, not auto-listed.

## New note — template

Create `src/content/notes/<id>.md`:

```markdown
---
title: Why a game should fit on one page
date: 2026-03-01              # YYYY-MM-DD — notes sort newest first by this
accent: "#bd7f2e"            # keep the quotes
dek: "One-line summary shown under the title."
# games: [twelves, wake]      # optional — shows these games' cover art at the end
# published: false            # optional — omit for the normal case; see below
---

## The premise
### One sheet, no escape

First section's prose.

## The constraint
### Subtraction as design

Another section. Blank line between paragraphs makes new paragraphs.
```

The date drives both the short label on the list (`MAR ’26`) and the full one
on the article (`MARCH 2026`) — you only enter it once, as `YYYY-MM-DD`.

`games:` is optional. List the ids (filenames, no `.md`) of any games the
article talks about, in brackets and separated by commas — the game's cover
art renders at the end of the piece, linking to its rules page. Leave it out
entirely for a note that isn't about a specific game.

Every article automatically gets a "© {year} dominomatt. All rights reserved."
line at the bottom, using the year from its own `date:` — nothing to add in
frontmatter. Games are licensed separately (`CC BY-NC`, see `license:` above);
articles are all-rights-reserved by default.

### Publishing a note early, or not at all

`published: false` takes a note off `/notes` and out of the sitemap (and out
of the neighboring "NEXT" link on other articles), but the page still builds
at `/notes/<id>` — a preview link you can share before it's public. Leave
`published` out entirely (or set it `true`) for the normal case.

## A few rules of thumb

- Always keep the **quotes** around colours (`"#bd7f2e"`) and around
  `description` / `dek`. Everything else can be unquoted.
- `players: "2"` — wrap a bare number in quotes (e.g. a 2-player game).
- To **remove** a game or note, delete its `.md` file. To **reorder** games,
  change their `order:` numbers.
- Adding a game or note doesn't put it on the homepage automatically, and
  removing its `.md` file doesn't take it off either — the homepage's two
  widgets (latest notes, featured games) are a separate, hand-picked list in
  `src/data/site.ts` (`homepage.notes` / `homepage.games`), in whatever order
  they're listed. Every published game and note is reachable from `/games`
  and `/notes` regardless of what's featured on the homepage — see
  `published:` above for the unlisted-but-still-live case. Changing the
  homepage lineup is a dev edit, not a frontmatter one.
- After saving, run `npm run dev` to preview, or just push — the site
  rebuilds and deploys on its own.
