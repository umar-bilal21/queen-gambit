/**
 * Locking the page behind an overlay.
 *
 * Two places need this — the Intro, and the small-screen menu — and before this
 * existed they released the lock two different ways (`removeProperty` in one,
 * assignment to `''` in the other). Identical in effect today, but two idioms
 * for one concept is how they drift apart later, and a page stuck unscrollable
 * is about the worst bug this site could ship.
 *
 * Counted rather than boolean: if the menu is somehow open when the Intro
 * finishes, the last holder to release is the one that unlocks.
 */

let holders = 0;

export function lockScroll(): void {
  holders += 1;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  holders = Math.max(0, holders - 1);
  if (holders === 0) document.body.style.removeProperty('overflow');
}
