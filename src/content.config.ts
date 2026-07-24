import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Games: one markdown file per game in src/content/games/.
// Frontmatter holds the card metadata; the body holds the rules, written as
// "## Section / ### Subsection" markdown (see AUTHORING.md).
const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    order: z.number(), // sort order on the index; also the displayed 01/02/...
    category: z.string(),
    players: z.string(),
    age: z.string().optional(), // e.g. "8+" — shown between players and time in the eyebrow; omit if not relevant
    time: z.string(),
    accent: z.string(), // cover / swatch colour, e.g. "#bd7f2e"
    ink: z.string(), // motif + cover-title colour
    motif: z.enum(['pips', 'diamond', 'circle', 'line']).optional(), // omit for games without a motif or real art yet
    art: z.string().optional(), // filename under src/assets/art/, shown in the rules-page masthead icon in place of the flat accent square; omit for games without real art yet
    description: z.string(),
    mechanics: z.array(z.string()), // tag list of the game's mechanics — display only, not used for filtering
    license: z.string(), // e.g. "CC BY-NC" — shown as a brow line after the mechanics pills; code is MIT, game content is licensed separately
    contents: z.string(),
    spec: z.string(),
    // ordered list of downloadable files for this game. Omit entirely (or
    // leave empty) for a game that's play-from-the-page only, with nothing
    // to download.
    downloads: z
      .array(
        z.object({
          title: z.string(),
          file: z.string(), // path under public/print/, e.g. "twelves.pdf" or "twelves/deck.pdf"
          description: z.string(), // short blurb, always shown; may be multi-line
          spec: z.string().optional(), // e.g. "A4 + LETTER · 6 PP" — omit to hide the meta line
          version: z.string().default('V1.0'),
          // earlier releases of this same file, newest first. Omit entirely
          // for a file with no version history to show.
          history: z
            .array(
              z.object({
                version: z.string(),
                note: z.string(),
                date: z.string(),
                file: z.string().optional(), // path under public/print/ — omit to leave this old version undownloadable
              })
            )
            .default([]),
        })
      )
      .optional(),
    relatedGames: z.array(z.string()).optional(), // other game ids to cross-link at the end
    // credit lines shown as a bulleted "Attributions" list in the Attachments
    // section, below downloads. Omit entirely for a game with nothing to credit.
    attributions: z.array(z.string()).optional(), // e.g. "Box Art by CoolArtist"
    // false hides it from /games and the sitemap; the page itself still
    // builds at /rules/<id> — a URL-only "unlisted" state, not a draft.
    published: z.boolean().default(true),
  }),
});

// Notes: one markdown file per essay in src/content/notes/.
// Sorted newest-first by `date`; the body uses the same
// "## Section / ### Subsection" convention as games.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    accent: z.string(),
    dek: z.string(),
    games: z.array(z.string()).optional(), // game ids to show as "box art" at the end
    // false hides it from /notes and the sitemap; the page itself still
    // builds at /notes/<id> — a URL-only "unlisted" state, not a draft.
    published: z.boolean().default(true),
  }),
});

export const collections = { games, notes };
