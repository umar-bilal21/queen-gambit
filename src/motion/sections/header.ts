import { ScrollTrigger, registerSection, type MotionContext } from '../index';

/**
 * The header condenses from transparent to solid navy once the Hero has passed,
 * and the small-screen menu opens and closes.
 *
 * The condensing is a class flip rather than a scrubbed animation: it is a
 * change of state, not a change of position, and animating it against scroll
 * would make it flicker at the boundary.
 */

function initHeader(_context: MotionContext): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.querySelector<HTMLElement>('#hero');

  if (header && hero) {
    ScrollTrigger.create({
      trigger: hero,
      // Condense as the Hero's foot passes the top of the header, so the bar
      // solidifies exactly when it stops sitting over the photograph.
      start: 'bottom top+=80',
      onEnter: () => {
        header.dataset.condensed = 'true';
      },
      onLeaveBack: () => {
        header.dataset.condensed = 'false';
      },
    });
  }

  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    /*
     * The menu covers the page, so the page must not scroll behind it. Same
     * reasoning as the Intro: what is underneath is not reachable, so it should
     * not move.
     */
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Choosing a destination closes the menu. Without this the visitor arrives at
  // the section with the menu still covering it.
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  /*
   * Crossing into desktop layout with the menu open would leave the body
   * unscrollable behind a menu that is no longer displayed.
   */
  const desktop = window.matchMedia('(min-width: 56rem)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

registerSection(initHeader);
