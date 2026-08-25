/**
 * Layout constants the motion layer has to agree with the stylesheet about.
 *
 * The header's height was encoded three times in three units — an anchor
 * offset, a ScrollTrigger start expression, and a scroll-position threshold —
 * and nothing tied them together. Changing the header's padding would have
 * silently left anchored sections tucked under the bar.
 */

/** Roughly the fixed header's height. Anchored sections clear it by this much. */
export const HEADER_HEIGHT = 72;

/**
 * How far past the Hero the visitor must be for the header to count as
 * "scrolled past it" — used both by the condense trigger and when the menu
 * closes and hands the condensed state back.
 */
export const HERO_PASSED_RATIO = 0.8;

/**
 * How long the stylesheet waits before dismissing the Intro on its own.
 *
 * Must match the `intro-failsafe` animation delay in `Intro.astro`. The island
 * needs it to tell whether it has booted so late that the overlay is already
 * gone — see the race handled in `sections/intro.ts`.
 */
export const INTRO_FAILSAFE_MS = 3200;
