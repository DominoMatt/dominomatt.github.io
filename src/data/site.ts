// Studio-wide configuration and the few bits of editable copy that aren't
// tied to a specific game or note.
export const site = {
  // Brand mark shown before the site name. `mark` is plain text (a glyph
  // like "◆" works well) and appears in both the homepage header and page
  // breadcrumbs. `markSvg` is a filename under src/assets/art/, inlined at
  // build time — it replaces `mark` in the homepage header only (breadcrumbs
  // stay text-only, since the SVG reads too small there). Leave both empty
  // for no mark.
  mark: '',
  markSvg: 'single_domino_white.svg',
  name: 'FREE DOMINO GAMES',
  title: 'Free Domino Games',
  // Fallback <meta name="description"> — used on the homepage only; every
  // other page supplies its own (game/note description or dek). Also the
  // fallback og:description/twitter:description for the homepage.
  description:
    'Domino-based games for all ages, from classic domino layout variants to original titles. Play (playtest) original games... My games require generic and common components (mainly dominoes) and any additional components that are necessary are included as downloads.',
  interactCopy:
    "Everything here is free to play. If you've enjoyed a game or article, drop me a line.",

  // Per-page hero copy for the site's static pages: `title` is used as both
  // the on-page H1 and the browser <title>; `lede` is used as both the
  // on-page lede paragraph and <meta name="description">. This is the copy
  // a client is most likely to want to reword. Article/game pages aren't
  // listed here — their title/lede come from each note's or game's own
  // frontmatter (title/dek, title/description) in src/content/, not from
  // this file.
  pages: {
    home: {
      tagline: 'Domino-based games for all ages', // homepage <h1> — leave empty to hide it
    },
    contact: {
      title: 'Contact me',
      lede: "Questions about a game, a playtest report, a note about a typo in the rules or articles, or a general comment - I'd love to hear from you.",
    },
    thankYou: {
      title: 'Thanks for writing',
      lede: 'Your note has been sent. I read every one and reply when I can.',
    },
    games: {
      title: 'Games', // category name is appended to the browser <title> automatically, not to the H1
      lede: "Something for everyone; original titles to traditional variants... explore the domino as a gaming system."
    },
    notes: {
      title: 'The Boneyard',
      lede: 'Articles and Notes on dominoes and a few other topics.',
    },
  },

  // Tip jar: any external link (Ko-fi, Buy Me a Coffee, PayPal.me, etc).
  // Set tipsEnabled to false to hide the "LEAVE A TIP" button entirely.
  tipsEnabled: false,
  tipUrl: 'https://ko-fi.com/your-handle', // TODO: set your tip-jar URL

  // Contact form target: Web3Forms. GitHub Pages is static (no server), so
  // the form POSTs straight to Web3Forms' API — the endpoint below is fixed
  // and doesn't change per client. What's client-specific is the access key,
  // generated free at https://web3forms.com by entering the destination
  // inbox email. It's safe to expose in the page source (it only authorizes
  // submissions, not reads). Until it's set below the form will not deliver
  // anything.
  formAction: 'https://api.web3forms.com/submit',
  web3formsAccessKey: '023b0748-caf0-4797-9c5c-5bf4e648e4f3',

  // Homepage widget curation. Each list is an array of content ids (the
  // filename in src/content/{games,notes}/ without ".md") in the exact order
  // they should appear on the homepage. Only ids listed here show up —
  // nothing is auto-derived from "newest" or "all". Unlisted ids just don't
  // appear on the homepage (they're still reachable from /games and /notes).
  // This intentionally lives here rather than in frontmatter: it's a
  // "curate the front door" decision, not a per-item edit, so it takes a dev
  // touch — see AUTHORING.md for the day-to-day content workflow.
  homepage: {
    notes: ['dominoes', 'under_construction', 'kids_content'],
    games: ['domino_duel', 'memory', 'fish_pond', 'domino_kingdom', 'push_your_luck', 'draw_dominoes', 'the_road_from_ur', 'fish_on_a_dish', 'nine_high', 'dungeonominoes'],
  },
};
