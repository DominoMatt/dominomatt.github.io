# 0001. Client JavaScript for the print-mode picker

- **Status:** accepted
- **Date:** 2026-07-31 (recorded retroactively; the change shipped in PR #2)
- **Principle breached:** "Ship as little client JavaScript as possible"

## Context

The site was built HTML-first and, until this change, shipped no client JavaScript at
all: the games index uses native `<details name="games">` for its exclusive accordion,
the contact form is a real `<form>`, and navigation is real links.

Rules pages are meant to be printed. A single print stylesheet can only encode one
layout, but the useful layouts differ by intent — standard spacing for a reference copy,
tightened spacing to save paper, two columns to save more. Choosing between them is a
decision the reader makes at print time, and the browser's own print dialog offers no
hook for it.

Approaches considered:

- **CSS only.** No way to let the reader choose before printing. Would have meant picking
  one layout for everyone.
- **Three separate print URLs** (`/rules/twelves/compact`, etc.). Keeps zero JS, but
  multiplies routes per game, splits the printable page away from the canonical one, and
  still needs links that explain themselves.
- **A checkbox/`:has()` CSS toggle.** Avoids scripting the mode switch, but cannot call
  `window.print()`, so the reader still has to open the print dialog separately and the
  control has no obvious affordance.

## Decision

Ship a small inline `<script>` in `src/components/PrintButton.astro` — the site's only
client JavaScript. It opens a native `<dialog>`, sets `data-print-mode` on
`<html>` to `compact` or `two-column` (or removes it for normal), and calls
`window.print()`.

All layout remains in CSS, driven by the `data-print-mode` attribute in
`src/styles/global.css`. The script does nothing but set an attribute and open dialogs.

## Consequences

- The claim "this site ships no client JavaScript" is no longer true, and the README has
  been corrected. New work should say "as little as possible", not "none".
- Without JavaScript the PRINT button does nothing. Browser printing still works normally
  and produces the standard layout, so no content becomes unreachable.
- The precedent is narrow: scripting is acceptable for a reader-facing control that has
  no HTML or CSS equivalent, stays inside one component, and degrades to a working page.
  It is not a general licence to add interactivity — a new `<script>` needs its own ADR.
- `data-print-mode` on `<html>` is now a contract between `PrintButton.astro` and the
  print rules in `global.css`. Changing either name breaks the feature silently.
