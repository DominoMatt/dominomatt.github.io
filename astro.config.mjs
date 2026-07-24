import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { FontaineTransform } from "fontaine";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// astro:content isn't queryable this early (the content layer hasn't booted
// yet), so `published: false` games/notes are found the same low-tech way
// for the sitemap filter below: read each file's frontmatter block off disk
// and regex out the one field we need. Keep this in sync with the
// `published` schema default (true) in src/content.config.ts.
function unpublishedIds(relDir) {
  const dir = fileURLToPath(new URL(relDir, import.meta.url));
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => {
      const frontmatter =
        readFileSync(`${dir}/${file}`, "utf-8").match(
          /^---\r?\n([\s\S]*?)\r?\n---/,
        )?.[1] ?? "";
      return /^published:\s*false\s*$/m.test(frontmatter);
    })
    .map((file) => file.replace(/\.md$/, ""));
}

const unpublishedGames = unpublishedIds("./src/content/games/");
const unpublishedNotes = unpublishedIds("./src/content/notes/");

// A game/note page still builds (reachable if you know the URL) even when
// unpublished — it just shouldn't be indexable, so drop it from the sitemap.
function isUnpublishedPage(pageUrl) {
  const segments = new URL(pageUrl).pathname.split("/").filter(Boolean);
  const kindIndex = segments.findIndex((s) => s === "rules" || s === "notes");
  if (kindIndex === -1) return false;
  const id = segments[kindIndex + 1];
  const unpublished =
    segments[kindIndex] === "rules" ? unpublishedGames : unpublishedNotes;
  return unpublished.includes(id);
}

// GitHub Pages configuration.
//
//   Project page  -> https://USERNAME.github.io/reference-games-portfolio
//       keep `base` as-is, set `site` to your github.io origin.
//   User/org page -> https://USERNAME.github.io
//   Custom domain -> https://your-domain.com
//       in both of these cases set `base: '/'` and `site` to that origin.
//
// All internal links go through src/lib/links.ts, so changing `base` here
// is the only edit needed to move between these hosting shapes.
export default defineConfig({
  site: "https://dominomatt.github.io",
  base: "/",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !isUnpublishedPage(page),
    }),
  ],
  // Code blocks are plain notation, not source — render them as bare
  // <pre><code> so the warm tinted box in `.prose` styles them (Shiki would
  // otherwise inject an inline theme background that overrides it).
  markdown: {
    syntaxHighlight: false,
  },
  vite: {
    plugins: [
      // Generates a size-matched local-font fallback (`"<Family> fallback"`)
      // for each self-hosted @fontsource face, so the pre-load reflow in
      // global.css's --serif-display/--serif-text/--sans/--mono stacks is
      // as small as possible while the real face downloads.
      FontaineTransform.vite({
        fallbacks: {
          "Libre Caslon Display": ["Georgia", "Times New Roman"],
          "Libre Caslon Text": ["Georgia", "Times New Roman"],
          "Libre Franklin": ["Arial", "Helvetica Neue", "Helvetica"],
          "Spline Sans Mono": ["Courier New"],
        },
      }),
    ],
  },
});
