# Print files

Drop downloadable files here, at whatever path each game's `downloads:`
frontmatter entry sets as its `file` (see AUTHORING.md).

None of the current games (`memory`, `fish_pond`, `domino_kingdom`,
`push_your_luck`) have a `downloads:` list yet, so nothing is required here
today — `kd_example.png` is an inline rules illustration referenced from
`domino_kingdom.md`'s body, not a download.

Each game's downloads list can hold any number of entries (PDFs, STLs, …),
including none — a game with no `downloads:` in its frontmatter just shows no
downloads section. The link for each entry points at `/print/<file>`; until
the real file exists at that path, the link 404s — the rest of the site works
regardless.
