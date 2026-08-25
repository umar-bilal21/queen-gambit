import { HEADER_HEIGHT } from './layout';
import type { SmoothScroll } from './smoothScroll';

/**
 * Anchor navigation, routed through whichever scroller is active.
 *
 * Left to itself the browser would jump instantly to the target while Lenis
 * carries on animating from where it thought it was — the page ends up in two
 * places at once and settles with a lurch. So anchor clicks are intercepted and
 * handed to the scroller.
 *
 * The header is fixed and would otherwise cover the top of whatever section you
 * arrive at, hence the offset.
 */

export function initAnchors(scroller: SmoothScroll): void {
  document.addEventListener('click', (event) => {
    // Let the browser handle modified clicks — a visitor holding Cmd wants a
    // new tab, not a scroll.
    if (event.defaultPrevented) return;
    const mouse = event as MouseEvent;
    if (mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey) return;
    if (mouse.button !== 0) return;

    const target = event.target as Element | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    const destination = document.querySelector<HTMLElement>(id);
    if (!destination) return;

    event.preventDefault();
    scroller.scrollTo(destination, { offset: -HEADER_HEIGHT });

    /*
     * Scrolling somewhere is not the same as going somewhere. Without this a
     * keyboard visitor's focus stays on the link they just activated, so the
     * next Tab continues from the header rather than from the section they
     * asked for.
     */
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  });

  const backToTop = document.querySelector<HTMLElement>('[data-back-to-top]');
  backToTop?.addEventListener('click', () => {
    scroller.scrollTo(0);
  });
}
