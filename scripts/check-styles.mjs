// Guards the CSS split recorded in docs/adr/0004-css-split-into-partials.md.
//
// `src/styles/global.css` holds no rules — it is a list of @imports, and Vite
// inlines them into one stylesheet at build time. That means a partial nobody
// imports is not a build error: the build succeeds and the rules simply never
// ship. Nothing else in the toolchain notices.
//
// (A *broken* @import path is already caught — the build fails to resolve it.
// This script covers the silent case, and re-checks the loud one for a clearer
// message.)
//
// Run with: npm run check:styles

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stylesDir = path.join(root, 'src', 'styles');
const entry = path.join(stylesDir, 'global.css');

const rel = (file) => path.relative(root, file).replace(/\\/g, '/');

// Every stylesheet actually on disk.
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) return walk(full);
    return item.isFile() && item.name.endsWith('.css') ? [full] : [];
  });
}

// Every stylesheet reachable from the entry, following @import transitively —
// a partial is allowed to import another partial, so this cannot just read
// global.css and stop.
const IMPORT = /@import\s+(?:url\()?["']([^"']+)["']\)?/g;
const reachable = new Set();
const missing = [];

function follow(file) {
  if (reachable.has(file)) return;
  reachable.add(file);
  for (const [, spec] of readFileSync(file, 'utf-8').matchAll(IMPORT)) {
    if (/^(https?:)?\/\//.test(spec)) continue; // remote sheet, not ours to check
    const target = path.resolve(path.dirname(file), spec);
    if (existsSync(target)) follow(target);
    else missing.push({ from: file, spec });
  }
}

if (!existsSync(entry)) {
  console.error(`check:styles — no entry stylesheet at ${rel(entry)}`);
  process.exit(1);
}

follow(entry);

const onDisk = walk(stylesDir);
const orphans = onDisk.filter((file) => !reachable.has(file));
let failed = false;

if (missing.length) {
  failed = true;
  console.error('@import points at a file that does not exist:\n');
  for (const { from, spec } of missing) {
    console.error(`  ${rel(from)}  ->  ${spec}`);
  }
  console.error('');
}

if (orphans.length) {
  failed = true;
  console.error(
    'Stylesheet is never imported, so none of its rules reach the site:\n',
  );
  for (const file of orphans) console.error(`  ${rel(file)}`);
  console.error(
    `\nAdd an @import to ${rel(entry)}. Position matters — import order is\n` +
      'cascade order, so put it with the group it belongs to rather than at\n' +
      'the end.\n',
  );
}

if (failed) process.exit(1);

console.log(
  `check:styles — ${onDisk.length} stylesheets, all reachable from ${rel(entry)}`,
);
