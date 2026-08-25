/**
 * The project's only real logic, kept away from the browser.
 *
 * Nothing here imports the DOM, GSAP or Lenis. That is the point: which Belief
 * is Active and what state the Intro is in are the two behaviours with genuine
 * edge cases, and inside an animation callback they would be untestable and
 * invisible. Out here they are ordinary functions with ordinary tests.
 */

/* -------------------------------------------------------------------------- */
/* Beliefs                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Which Belief is Active.
 *
 * The brief asked for the photograph to appear "when you hover over it ... as
 * you scroll down", which is two triggers in one sentence. This resolves it:
 * scroll position decides by default, so the section performs itself for a
 * visitor who never moves their mouse, and a pointer resting on a row takes
 * over while it is there.
 *
 * Exactly one Belief is Active for any input. There is no "none" state — a
 * section with no photograph showing looks broken, not neutral.
 *
 * @param scrollProgress How far through the section, 0 to 1. Values outside
 *   that range are clamped rather than rejected: ScrollTrigger reports slightly
 *   beyond both ends during overscroll, and that is not an error.
 * @param beliefCount How many Beliefs there are.
 * @param hoveredIndex The row under a fine pointer, or null. An index outside
 *   the range is ignored rather than trusted.
 */
export function activeBeliefIndex(
  scrollProgress: number,
  beliefCount: number,
  hoveredIndex: number | null,
): number {
  if (beliefCount <= 0) return 0;

  if (
    hoveredIndex !== null &&
    Number.isInteger(hoveredIndex) &&
    hoveredIndex >= 0 &&
    hoveredIndex < beliefCount
  ) {
    return hoveredIndex;
  }

  // NaN can reach here from a division by zero upstream during a resize, when
  // the section briefly has no height. Treat it as the start of the section.
  const progress = Number.isFinite(scrollProgress) ? scrollProgress : 0;
  const clamped = Math.min(Math.max(progress, 0), 1);

  return Math.min(Math.floor(clamped * beliefCount), beliefCount - 1);
}

/* -------------------------------------------------------------------------- */
/* Intro                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * - `playing`  — the timeline is running normally.
 * - `skipped`  — the visitor asked to skip; the timeline is fast-forwarding.
 *                Still a distinct state because the overlay is still on screen.
 * - `done`     — the timeline finished, however it got there. Terminal.
 * - `bypassed` — reduced motion; the Intro never ran. Terminal.
 */
export type IntroState = 'playing' | 'skipped' | 'done' | 'bypassed';

export type IntroEvent = 'skipped' | 'completed';

export interface IntroInit {
  prefersReducedMotion: boolean;
}

/**
 * `bypassed` is only ever entered here, at initialisation. A visitor who turns
 * reduced motion on mid-visit should not have the Intro reappear or the page
 * jump — whatever is on screen plays out.
 */
export function createIntroState({ prefersReducedMotion }: IntroInit): IntroState {
  return prefersReducedMotion ? 'bypassed' : 'playing';
}

/**
 * `done` and `bypassed` are terminal.
 *
 * That matters more than it looks: skip is bound to click, scroll and Escape,
 * so events keep arriving long after the Intro has finished. Without terminal
 * states, the first scroll after the reveal would replay the whole thing.
 */
export function introReducer(state: IntroState, event: IntroEvent): IntroState {
  if (state === 'done' || state === 'bypassed') return state;

  switch (event) {
    case 'skipped':
      return state === 'playing' ? 'skipped' : state;
    case 'completed':
      return 'done';
    default:
      return state;
  }
}

/** Whether the Castle is reachable — the overlay can be torn down. */
export function isIntroFinished(state: IntroState): boolean {
  return state === 'done' || state === 'bypassed';
}
