# The Queen's Gambit Castle — homepage

**Live: <https://umar-bilal21.github.io/queen-gambit/>**

A redesign of the homepage for [thequeensgambithouse.com](https://thequeensgambithouse.com)
— an oceanfront castle in New Smyrna Beach, Florida, built as a work of art by
Frank J. Russo.

This is a **pitch**, not a replacement. It is one route whose job is to win the
client's approval on a direction. It does not touch the existing WordPress and
WooCommerce site, it has no CMS, and it has no inner pages — see
[ADR 0001](docs/adr/0001-astro-over-wordpress.md).

## Running it

```bash
pnpm install
pnpm dev        # localhost:4321, hot reload
pnpm build      # production build to dist/
pnpm preview    # serve the production build — what the tests run against
pnpm check      # typecheck; the build does NOT do this
pnpm test       # unit tests (Vitest)
pnpm test:e2e   # end-to-end (Playwright, Chromium + WebKit)
```

`pnpm check` matters more than it looks: `astro build` does not typecheck, so a
type error will build cleanly and break in the browser. The deploy workflow runs
it before publishing for exactly that reason.

## Deploying

Every push to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The link above is
always the current design, so it never needs re-sending.

The base path is applied **only in CI** — locally the site stays at the root, so
`localhost:4321` keeps working.

## The page

Eleven sections, in order:

| Section | Ground | What it does |
| --- | --- | --- |
| Intro | deepest navy | A fixed ~3.5s timeline: the Queen draws herself in gold, the line resolves, the screen lifts. Skippable by click, scroll or Escape. Not a preloader — [ADR 0003](docs/adr/0003-intro-is-a-fixed-timeline.md). |
| Hero | photograph | One committed image, slow drift, the display line. |
| Story | cream | Two paragraphs travelling through a fixed window, recolouring navy → aqua behind the reader. Reef line work drifts around it. |
| Masterwork | photographs | Three bands that stack over one another as you scroll. |
| Explore Every Corner | shared water | Three room frames that open outward as they rise. |
| Our Beliefs | shared water | Five convictions, gold crowned numerals, a photograph behind whichever row you are reading. |
| The returning passage | cream | The Story's copy again, deliberately — set differently so it reads as a return. |
| Gallery | shared water | A rail that drifts on its own, pauses on hover, and can be dragged. |
| Manifesto | cream | Frank J. Russo's statement, travelling through a window. |
| Enter | photographs | The closing invitation and a working `mailto:`. |
| Footer | navy | The pool running out to the ocean, bleeding into the ground. |

## How it is built

Astro (static), GSAP 3.15 with ScrollTrigger and DrawSVG, and Lenis for smooth
scrolling — [ADR 0002](docs/adr/0002-gsap-and-lenis.md). All the JavaScript lives
in **one client island** (`src/motion/`); no other component ships any.

```
src/
  content/site.ts     every visitor-facing word — copy changes are one file
  content/images.ts   photographs by what they are, never by filename
  components/         one per section, plus ornament/ primitives
  motion/             the island: state.ts is pure and unit-tested
  styles/tokens.css   the palette and type scale
e2e/                  the smoke suite, run against the production build
docs/adr/             decisions that were hard to reverse
CONTEXT.md            the glossary — normative for vocabulary
```

**Two test seams**, deliberately only two. `src/motion/state.ts` holds the only
real logic (which Belief is Active, the Intro's state machine) and imports
neither the DOM nor GSAP, so it is unit-tested. Everything observable is covered
by one Playwright spec against the production build. Visual fidelity is *not*
tested — it is reviewed by screenshot, because a test that pins pixels fails on
every legitimate design change and teaches you to ignore it.

## Decisions worth reading before changing things

- [0001](docs/adr/0001-astro-over-wordpress.md) — why Astro and not the existing WordPress
- [0002](docs/adr/0002-gsap-and-lenis.md) — why GSAP and Lenis, and what was rejected
- [0003](docs/adr/0003-intro-is-a-fixed-timeline.md) — why the Intro has no progress bar
- [0004](docs/adr/0004-castle-not-landmark.md) — why "Castle" against four sources saying "Landmark"
- [0005](docs/adr/0005-castle-direction.md) — the navy-and-gold direction
- [0006](docs/adr/0006-corrections-from-review.md) — what client review changed, and why

## Still open, and needing the client rather than code

- **The name.** The logo, the live site title, the email address and a plaque on
  the building all say *Landmark* or *House*; the copy says *Castle*. The site is
  internally consistent; the brand is not. [ADR 0004](docs/adr/0004-castle-not-landmark.md).
- **Photography rights.** The listing shoot is Florida Home Photo's. Copyright
  most likely sits with them or the brokerage, not the client. This repo is public.
- **Typefaces.** Newsreader and Instrument Sans stand in for the client's
  references, Victor Serif and TT Commons Pro, which are paid licences. Swapping
  them is two CSS variables.
- **Phone and social accounts.** None exist in any material supplied, so the
  footer omits them rather than rendering dead links.
- **The Intro replays on every load.** Correct for a pitch, hostile in production.
  Change it to once-per-session before any real launch.
