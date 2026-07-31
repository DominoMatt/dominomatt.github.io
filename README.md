# Reference Games

A bare-metal, HTML-first Astro port of the `Studio.dc.html` Claude Design.
Zero UI framework, dark theme only, static output for GitHub Pages.

## Stack

- **Astro** (static output) — `.astro` components render to plain HTML at build time
- **`@astrojs/sitemap`** — build-time `sitemap-index.xml`, no client JS
- **Plain CSS** — one global stylesheet (`src/styles/global.css`), CSS variables for the palette
- **External fonts** — Google Fonts (Libre Caslon Display/Text, Spline Sans Mono)

Client JavaScript shipped: **one component.** The games index uses native
`<details name="games">` for the exclusive accordion; the contact form is a
real `<form>`; navigation is real pages and links. The only `<script>` on the
site is the print-mode picker in `src/components/PrintButton.astro` — see
[`docs/adr/0001-client-js-for-print-mode.md`](docs/adr/0001-client-js-for-print-mode.md)
for why.

## Structure

```
src/
  assets/
    art/*.svg    real per-game icons, referenced by filename from a game's
                 optional `art:` frontmatter (see AUTHORING.md) — also holds
                 the optional site brand mark (site.ts `markSvg`)
  content/
    games/*.md   one markdown file per game (frontmatter + rules body)
    notes/*.md   one markdown file per essay (frontmatter + body)
  content.config.ts   content-collection schemas (frontmatter validation)
  data/site.ts        studio config + copy (brand, tip URL, form endpoint,
                       homepage widget curation)
  layouts/       Base.astro  — <head>, fonts, global CSS, hardcoded data-theme="dark"
  components/    SiteHeader, TopBar, Breadcrumb, GameRow, GameCover, GameCoverGrid,
                 NoteRow, Motif, DownloadsList
  pages/
    index.astro              /              studio index + curated notes/games (site.ts)
    games/[...category].astro /games, /games/:category  all games, filterable
    rules/[game].astro       /rules/:id     one page per game (zero JS)
    notes/index.astro        /notes         the notebook
    notes/[slug].astro       /notes/:id     one page per essay, with NEXT link
                                             and any referenced games' cover art
    contact.astro            /contact       real POST form
  lib/
    content.ts   loads + sorts collections, formats dates (body is rendered as Markdown)
    links.ts     base-aware url() helper
public/
  print/         drop print-and-play PDFs here (twelves.pdf, etc.)
  .nojekyll
```

Games and notes are **Markdown with frontmatter** (Astro content collections),
rendered through Astro's built-in **GitHub Flavored Markdown** pipeline — lists,
tables, blockquotes, code, task lists, etc. all work and are styled for the dark
theme (see `.prose` in `src/styles/global.css`). In the body, `##` is a serif
section heading (with a short accent tick above it), `###` a serif subsection, and
`####` a small uppercase mono label.
See [AUTHORING.md](AUTHORING.md) for the templates a non-technical editor uses.
No new dependencies: the Markdown pipeline and glob loader are part of Astro core.

Each game/note also has a `published` flag (default `true`). Set it `false` to
take an entry off its `/games` or `/notes` listing and out of the sitemap
while still building its page at `/rules/:id` or `/notes/:id` — a link you can
share before it's publicly listed. `astro.config.mjs` reads this straight off
the frontmatter (content collections aren't queryable that early) to exclude
those same pages from `@astrojs/sitemap`.

## Commands

```sh
npm run dev       # local dev server
npm run build     # build to ./dist
npm run preview   # preview the production build
```

### GitHub Codespaces

`.devcontainer/devcontainer.json` describes a ready-to-run environment (Node 24,
matching the deploy workflow). **Code → Codespaces → Create codespace on main**,
or open the repo locally in VS Code with the Dev Containers extension. `npm ci`
runs on create, so afterwards just:

```sh
npm run dev
```

Port 4321 is forwarded automatically and opens in the editor's simple browser.

## Configuration

Three things to set before deploying — all in code, no env vars needed:

1. **`astro.config.mjs`** — set `site` to your origin. Keep `base` as
   `/reference-games-portfolio` for a GitHub **project page**; set `base: '/'`
   for a **user/org page** or a **custom domain**. All internal links route
   through `src/lib/links.ts`, so this is the only edit required.

2. **`src/data/site.ts`** — `tipUrl` (tip jar) and `formAction` (contact form
   endpoint, e.g. Formspree / Web3Forms / Basin). The contact form is static;
   it needs a third-party endpoint to actually deliver. Set `tipsEnabled: false`
   to hide the tip button. Also `homepage.notes` / `homepage.games` — the
   ordered id lists that decide what shows on the homepage (see AUTHORING.md).

3. **`public/print/`** — add the real download files (PDFs, STLs, …) at the
   paths each game's `downloads:` frontmatter points to (see AUTHORING.md).

Day-to-day content edits (adding/changing games and notes) don't touch any of
the above — they're just Markdown files. See [AUTHORING.md](AUTHORING.md).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. In the repo: **Settings → Pages → Build and deployment →
Source → GitHub Actions**.

## License

The codebase (everything under `src/`, config, and build tooling) is
**MIT** — see [LICENSE](LICENSE).

Content is licensed separately:

- **Games** (`src/content/games/*.md`) — each game declares its own
  `license:` frontmatter field, shown as a line under its mechanics tags on
  both `/games` and its rules page. All current games are **CC BY-NC**.
- **Articles** (`src/content/notes/*.md`) — **all rights reserved**. Every
  article page shows a copyright notice at the bottom automatically; no
  frontmatter needed.

## Notes on the port

Faithful to `Studio.dc.html` except where the design's single-page,
client-rendered model was replaced with HTML-first equivalents:

- SPA view-state (`state.view`) → real routes and URLs
- `<sc-for>` / `<sc-if>` → build-time `.map()` / `{cond && …}`
- index accordion (`setState`) → native `<details name="games">`
- theme toggle → removed (dark is global; no flash, no JS)
- clickable `<div>`s → `<a>` / `<button>` with focus styles and headings
- contact form (`setState` no-op) → real `<form method="POST">` with radio chips
