import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Motif = 'pips' | 'diamond' | 'circle' | 'line';

export interface DownloadVersion {
  version: string;
  note: string;
  date: string;
  file?: string; // path under public/print/ — omitted if this old version isn't downloadable
}

export interface Download {
  title: string;
  file: string; // path under public/print/
  description: string; // may be multi-line — split into paragraphs on render
  type: string; // PDF / IMG / STL / …, derived from file's extension
  spec?: string; // e.g. "A4 + LETTER · 6 PP" — meta line, omitted if not set
  version: string;
  history: DownloadVersion[]; // earlier releases of this file, newest first
}

export interface Game {
  entry: CollectionEntry<'games'>; // pass to render() for the markdown body
  id: string;
  no: string;
  title: string;
  boxArtTitle?: string; // shown on the box-art image; omit to use the title instead
  category: string;
  players: string;
  age?: string; // e.g. "8+" — shown between players and time in the eyebrow
  time: string;
  accent: string;
  ink: string;
  motif?: Motif;
  art?: string; // filename under src/assets/art/, resolved via getGameArt() — undefined for games without real art yet
  description: string;
  mechanics: string[]; // tag list of the game's mechanics — display only, not used for filtering
  license: string; // e.g. "CC BY-NC" — shown as a brow line after the mechanics pills
  contents: string; // what the player gets, e.g. "Rules Sheet" — the /games row
  requires: string; // what the player supplies, e.g. "Double Six Dominoes" — the rules page only; distinct from a Download's `spec` (print metadata)
  downloads: Download[]; // empty = nothing to download, e.g. print-from-page-only games
  relatedGames: string[]; // ids of other games cross-linked from this one's frontmatter
  attributions: string[]; // credit lines, e.g. "Box Art by CoolArtist" — empty = nothing to credit
  published: boolean; // false = built at /rules/:id but left out of /games + the sitemap
}

export interface Note {
  entry: CollectionEntry<'notes'>;
  id: string;
  title: string;
  date: Date;
  dateShort: string;
  dateFull: string;
  accent: string;
  dek: string;
  games: string[]; // ids of games referenced from this article's frontmatter
  published: boolean; // false = built at /notes/:id but left out of /notes + the sitemap
}

export interface GameCategory {
  slug: string;
  label: string;
}

// ---- date formatting (UTC, to avoid off-by-one across timezones) ----------

const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTHS_FULL = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function shortDate(d: Date): string {
  const yy = String(d.getUTCFullYear() % 100).padStart(2, '0');
  return `${MONTHS_SHORT[d.getUTCMonth()]} ’${yy}`;
}

function fullDate(d: Date): string {
  return `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// A download's type tag (PDF / IMG / STL / …) is never hand-authored — it's
// read straight off the file's own extension, so adding a download never
// needs a second field kept in sync with the first.
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);

function fileType(file: string): string {
  const ext = file.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'PDF';
  if (IMAGE_EXTENSIONS.has(ext)) return 'IMG';
  if (ext === 'stl') return 'STL';
  return ext ? ext.toUpperCase() : 'FILE';
}

// A download's `description` is a YAML block scalar and may hold more than
// one line — folded (`>`) style turns blank lines into paragraph breaks,
// literal (`|`) style keeps every line as its own line. Either way, splitting
// on newlines and rendering one <p> per line covers both.
export function descriptionLines(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// ---- loaders --------------------------------------------------------------
//
// The markdown body is rendered by Astro's own pipeline (GitHub Flavored
// Markdown is on by default). Detail pages call `render(entry)` to get the
// <Content /> component; these loaders just shape the frontmatter + order.

export async function getGames(): Promise<Game[]> {
  const entries = await getCollection('games');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((e) => ({
      entry: e,
      id: e.id,
      no: String(e.data.order).padStart(2, '0'),
      title: e.data.title,
      boxArtTitle: e.data.boxArtTitle,
      category: e.data.category,
      players: e.data.players,
      age: e.data.age,
      time: e.data.time,
      accent: e.data.accent,
      ink: e.data.ink,
      motif: e.data.motif,
      art: e.data.art,
      description: e.data.description,
      mechanics: e.data.mechanics,
      license: e.data.license,
      contents: e.data.contents,
      requires: e.data.requires,
      downloads: (e.data.downloads ?? []).map((d) => ({ ...d, type: fileType(d.file) })),
      relatedGames: e.data.relatedGames ?? [],
      attributions: e.data.attributions ?? [],
      published: e.data.published,
    }));
}

export async function getNotes(): Promise<Note[]> {
  const entries = await getCollection('notes');
  return entries
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((e) => ({
      entry: e,
      id: e.id,
      title: e.data.title,
      date: e.data.date,
      dateShort: shortDate(e.data.date),
      dateFull: fullDate(e.data.date),
      accent: e.data.accent,
      dek: e.data.dek,
      games: e.data.games ?? [],
      published: e.data.published,
    }));
}

// The "next" article link is auto-derived (unlike homepage curation or an
// article's own `games:` references, which are deliberate picks), so it
// should never hand a reader an unpublished note — walk forward through the
// newest-first list until landing on one that's published.
export function nextPublished(notes: Note[], fromIndex: number): Note {
  for (let step = 1; step <= notes.length; step++) {
    const candidate = notes[(fromIndex + step) % notes.length];
    if (candidate.published) return candidate;
  }
  return notes[fromIndex];
}

// ---- homepage curation ------------------------------------------------
//
// `site.homepage` (src/data/site.ts) holds ordered id lists for both
// widgets. Only ids present there are shown, in the order listed — see the
// comment on that config for why this lives in code, not frontmatter.

function resolveIds<T extends { id: string }>(ids: string[], items: T[], context: string): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids
    .map((id) => {
      const item = byId.get(id);
      if (!item) console.warn(`[content] ${context}: no entry with id "${id}"`);
      return item;
    })
    .filter((item): item is T => Boolean(item));
}

export async function getFeaturedGames(): Promise<Game[]> {
  return resolveIds(site.homepage.games, await getGames(), 'site.ts homepage.games');
}

export async function getFeaturedNotes(): Promise<Note[]> {
  return resolveIds(site.homepage.notes, await getNotes(), 'site.ts homepage.notes');
}

// Resolves the game ids referenced from a note's `games` frontmatter to the
// full Game objects, in the order given, dropping any id that doesn't match
// an existing game.
export function getReferencedGames(note: Note, games: Game[]): Game[] {
  return resolveIds(note.games, games, `note "${note.id}" games`);
}

// Same idea, but for a game cross-linking other games via its own
// `relatedGames` frontmatter — drops a self-reference too, in case a game
// accidentally lists its own id.
export function getRelatedGames(game: Game, games: Game[]): Game[] {
  return resolveIds(game.relatedGames, games, `game "${game.id}" relatedGames`).filter((g) => g.id !== game.id);
}

// ---- game art (masthead icon) ------------------------------------------
//
// Real per-game SVGs live in src/assets/art/, referenced by filename from a
// game's optional `art:` frontmatter. Astro inlines an imported .svg as a
// component, so this resolves straight to a renderable component — same
// "resolve by name, drop + warn if missing" pattern as the id resolvers
// above, so a typo'd filename fails loud in the console instead of quietly
// breaking the build.

const artModules = import.meta.glob('/src/assets/art/*.svg', { eager: true });
const artByFilename = new Map(
  Object.entries(artModules).map(([path, mod]) => [path.split('/').pop()!, (mod as any).default])
);

export function getGameArt(game: Game) {
  if (!game.art) return undefined;
  const component = artByFilename.get(game.art);
  if (!component) console.warn(`[content] game "${game.id}" art: no file "${game.art}" in src/assets/art/`);
  return component;
}

// The site-wide brand mark (site.ts `markSvg`) resolves through the same
// folder and failure mode as per-game art.
export function getSiteMark() {
  if (!site.markSvg) return undefined;
  const component = artByFilename.get(site.markSvg);
  if (!component) console.warn(`[content] site.ts markSvg: no file "${site.markSvg}" in src/assets/art/`);
  return component;
}

// ---- game eyebrow (category · players · age? · time) -------------------

export function getGameEyebrow(game: Game): string {
  return [game.category, game.players, game.age, game.time].filter(Boolean).join(' · ');
}

// ---- game categories (for the /games filter) ---------------------------
//
// `category` is freeform text on each game, so the set of filterable
// categories is derived from whatever's actually in use at build time.

export function getGameCategories(games: Game[]): GameCategory[] {
  const bySlug = new Map<string, GameCategory>();
  for (const g of games) {
    const slug = slugify(g.category);
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, label: g.category });
  }
  return [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label));
}
