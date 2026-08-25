import { registerSection, type MotionContext } from '../index';
import { lockScroll, unlockScroll } from '../scrollLock';
import { HERO_PASSED_RATIO } from '../layout';

/**
 * The small-screen menu.
 *
 * Split out of the header module, which was changing for two unrelated
 * reasons: how the bar reacts to scroll, and everything about opening and
 * closing an overlay — expanded state, focus, Escape, the scroll lock, and
 * what happens when the viewport crosses into desktop layout.
 */

function initMenu(_context: MotionContext): void {
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!toggle || !menu) return;

  let open = false;

  const setOpen = (next: boolean): void => {
    if (next === open) return;
    open = next;

    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;

    if (open) lockScroll();
    else unlockScroll();

    /*
     * The open menu is a navy panel; without this the bar above it stays
     * transparent over the Hero photograph and the monogram and toggle sit on
     * bright sky. Closing hands the condensed state back to the scroll trigger,
     * unless the visitor is already past the Hero.
     */
    if (open) header?.setAttribute('data-condensed', 'true');
    else if (window.scrollY < window.innerHeight * HERO_PASSED_RATIO) {
      header?.setAttribute('data-condensed', 'false');
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  // Choosing a destination closes the menu. Without this the visitor arrives at
  // the section with the menu still covering it.
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !open) return;
    setOpen(false);
    toggle.focus();
  });

  /*
   * Crossing into desktop layout with the menu open would leave the body
   * unscrollable behind a menu that is no longer displayed.
   */
  window
    .matchMedia('(min-width: 56rem)')
    .addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
}

registerSection(initMenu);
