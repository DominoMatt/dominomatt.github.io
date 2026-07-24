# Print files

Drop downloadable files here, at whatever path each game's `downloads:`
frontmatter entry sets as its `file` (see AUTHORING.md) — currently:

- `twelves.pdf`
- `smallkings.pdf`
- `parish.pdf`
- `wake.pdf`
- `memory.pdf`

Each game's downloads list can hold any number of entries (PDFs, STLs, …),
including none — a game with no `downloads:` in its frontmatter just shows no
downloads section. The link for each entry points at `/print/<file>`; until
the real file exists at that path, the link 404s — the rest of the site works
regardless.
