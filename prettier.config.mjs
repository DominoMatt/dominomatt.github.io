// Prettier is used in this project for **Markdown only**. Astro/TS/CSS keep the
// editor's own formatters (see .devcontainer/devcontainer.json) — see also
// .prettierignore, which keeps `prettier .` from reformatting the whole codebase.
//
// The two kinds of Markdown here want opposite wrapping, so `overrides` splits them:
//
//   docs/, README.md, AGENTS.md, AUTHORING.md   -> proseWrap: "always"
//     Read and edited as diffs, by developers and coding agents. Hard wrapping at
//     80 keeps a one-word change to a one-line diff instead of repainting a whole
//     paragraph.
//
//   src/content/**/*.md                          -> proseWrap: "never"
//     Written by a non-technical editor in the browser (Codespaces). Each paragraph
//     stays on one long line and soft-wraps in the editor, so nobody ever has to
//     hand-manage a line break.
//
// To swap the two conventions, swap these two values. Nothing else depends on them.
export default {
  proseWrap: 'always',
  printWidth: 80,
  overrides: [
    {
      files: 'src/content/**/*.md',
      options: { proseWrap: 'never' },
    },
  ],
};
