# 0004. CSS split into per-surface partials

- **Status:** accepted
- **Date:** 2026-08-21
- **Principle breached:** none — but this sets a convention future changes have
  to follow

## Context

`src/styles/global.css` had reached 1710 lines in one flat file: design tokens,
layout, eleven distinct component surfaces, the rendered-markdown styling, a
narrow-screen block, and 296 lines of print rules. Nothing was wrong with it —
the section comments were good — but every edit meant scrolling one file to find
the thirty lines that mattered, and an agent working from `AGENTS.md` had to
load the whole thing to change a button.

Two problems had already crept in, and both are the kind a long file hides:
`.row`, `.col` and `.input` — used only by `src/pages/contact.astro` — sat below
the `/* mechanics tags */` header, having drifted away from the contact-form
section they belong to; and the focus-visibility block sat at the very end of
the file, implying it needed to win a cascade fight it never had.

Three alternatives were ruled out:

- **Astro scoped `<style>` blocks in each component.** The most idiomatic Astro
  answer, and wrong here: most of the CSS styles markdown-rendered HTML, which
  scoped styles do not reach without wrapping nearly every rule in `:global()`.
  It would also scatter the design system across files that are edited for
  markup reasons.
- **Cascade layers (`@layer`).** Would make ordering explicit, but changes
  cascade semantics in ways that break overrides subtly, and adds a concept for
  no benefit this project can currently spend.
- **A preprocessor (Sass/Less).** A new dependency, which principle 3 rules out,
  to do something plain CSS already does.

Plain CSS `@import` needs none of them. Vite — Astro's bundler — resolves and
inlines `@import` at build time. This was verified against a real build before
committing to it: one stylesheet in `dist/_astro/`, zero `@import` statements
left in the output, and after the mechanical split the emitted CSS was
byte-identical to the build before it.

## Decision

`src/styles/global.css` holds no rules. It is a table of contents: a header
comment and an ordered list of `@import`s, and nothing else.

Rules live in partials beside it, divided by **page surface** rather than by
abstract layer:

- `tokens.css` — the `:root` palette and type variables
- `base.css` — element defaults and focus visibility
- `layout.css` — the page container
- `prose.css` — title blocks and rendered markdown
- `components/<name>.css` — one file per component surface
- `print.css` — every `@media print` rule

**Import order is cascade order.** Two rules of equal specificity are settled by
which file is imported first, so a new partial goes in the right group in
`global.css`, never appended at the end.

Responsive overrides are colocated: a component's `@media (max-width: 640px)`
rules live at the bottom of that component's own file, so each file describes
its surface at every width. `print.css` is the deliberate exception — it is
organised by medium, not by surface, because print here is not a set of
responsive tweaks but a separate design with its own logic (compact mode,
two-column mode, ink inversion) that would be unmaintainable spread across
twelve files.

### Keeping the split honest

Splitting one file into seventeen adds a failure mode the single file could not
have. A broken `@import` path fails the build loudly, and so does invalid CSS —
both were tested. But a partial that exists and nothing imports is silent: the
build succeeds and the rules simply never ship.

`npm run check:styles` (`scripts/check-styles.mjs`, no dependencies) walks the
`@import` graph out from `global.css` and fails if any stylesheet under
`src/styles/` is unreachable. It follows imports transitively, so a partial is
free to import another partial.

That check runs in CI on pull requests, from a new `.github/workflows/ci.yml`
that installs, checks, and builds. Until now `deploy.yml` was the only workflow
and it fires on push to `main`, so the first sign of a broken build was a broken
deployment — the outcome ADR 0002 objected to when it rejected a CI formatting
gate. This job is not a style gate and deliberately checks no conventions; it
answers only "does this still build".

## Consequences

- Editing styles means editing a partial. `global.css` is touched only to
  register a whole new one, and then the position of the `@import` matters.
- The build still emits exactly one stylesheet, so there is no extra request.
  The output grew by 69 bytes (0.2%), entirely from three additional
  `@media (max-width: 640px)` wrappers — the minifier does not merge media
  blocks across files. That is the price of colocating responsive rules.
- No new dependency, and no change to `astro.config.mjs`. The orphan check is
  plain Node against the standard library.
- `check:styles` is deliberately not wired into `npm run build`. The build stays
  a build, and the pull-request job is where the gate belongs. The cost is that
  a commit pushed straight to `main`, bypassing a PR, is not checked — if that
  becomes the normal way work lands here, wire it into `build` instead.
- CI now runs on pull requests as well as on push to `main`. That is a new
  expectation for any change, not just a CSS one: it has to build before it can
  merge.
- Cascade safety is now a review question. The mechanical split was verified
  byte-identical; the three subsequent moves (focus into `base.css`, the
  stranded contact-form rules into `components/contact-form.css`, and the
  narrow-screen block dissolved into its component files) were verified by
  comparing flattened rule sets — 304 rules before and after, identical, with no
  same-selector overlapping-property pair changing relative order.
- ADRs [0001](0001-client-js-for-print-mode.md) and
  [0003](0003-raw-html-page-breaks.md) describe the print rules as living in
  `src/styles/global.css`. Both decisions still stand exactly as written; the
  file those passages mean is now `src/styles/print.css`.
- One thing this deliberately did not fix: `.input` sets `outline: none` and
  signals focus only through `border-color`, a weaker keyboard indicator than
  the outline every link and button gets. Moving the rule made it visible;
  changing it would change rendering, so it is left for its own decision.
