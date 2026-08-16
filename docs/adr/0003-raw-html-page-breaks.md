# 0003. Raw HTML page breaks in content

- **Status:** accepted
- **Date:** 2026-08-16
- **Principle breached:** "No raw HTML in content" beyond the documented
  `<ol type="a">` sub-step block

## Context

Rules pages are meant to be printed, and print layout is driven from
`src/styles/global.css` by the `data-print-mode` attribute. The Road from Ur
rules need a hard page break before its Variants section so that section starts
on a fresh page.

Markdown has no syntax for a page break. Doing it from CSS would mean targeting
the auto-generated heading ID (`#variants`) in `global.css`, which couples a
global stylesheet to one game's heading text — reword the heading and the rule
silently stops matching. The `<ol type="a">` sub-step block already establishes
the precedent this project uses for the one thing Markdown cannot express: a
narrow, documented raw-HTML exception.

## Decision

Allow one additional raw-HTML element in content files: a
`<div style="break-before: page; height: 0; overflow: hidden;">&nbsp;</div>`
that forces a page break in print. The style is inline so the element is
self-contained and needs no CSS rule in `src/styles/global.css`. The `&nbsp;`
content and `height: 0; overflow: hidden` keep it invisible on screen while
giving the break something to attach to — an empty element is unreliable inside
the two-column multicol container.

## Consequences

- The "no raw HTML" principle now has two documented exceptions: the
  `<ol type="a">` sub-step block and the page-break div. Both exist because
  Markdown has no syntax for what they do.
- The element is inert on screen — it has no visual effect outside print.
- The exception stays narrow: a new kind of raw HTML still needs its own ADR.
- The inline style is repeated at each use site; if the break behaviour ever
  needs to change, every occurrence must be edited. A class-based rule in
  `global.css` would be the alternative if that becomes a burden.
