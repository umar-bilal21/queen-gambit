import { ScrollTrigger, registerSection, type MotionContext } from '../index';

/**
 * The Gallery rail travels sideways as the visitor scrolls down.
 *
 * The rail is a real overflow-scroll container in the markup, so it is already
 * swipeable on touch and reachable by keyboard before any of this runs. This
 * drives its `scrollLeft` from scroll position rather than replacing it, which
 * means the two never disagree: a visitor can swipe the rail and keep scrolling
 * the page and neither fights the other.
 *
 * Transforming a strip would have been simpler to write and worse to use —
 * nothing to swipe, nothing to tab through, and a fixed width that breaks the
 * moment the photography changes.
 */

function initGallery({ reduced }: MotionContext): void {
  if (reduced) return;

  const section = document.querySelector<HTMLElement>('[data-gallery]');
  const rail = document.querySelector<HTMLElement>('[data-gallery-rail]');
  if (!section || !rail) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'bottom bottom',
    scrub: 0.8,
    onUpdate: (self) => {
      const travel = rail.scrollWidth - rail.clientWidth;
      // Nothing to travel: fewer photographs than fit, or a very wide screen.
      if (travel <= 0) return;
      rail.scrollLeft = travel * self.progress;
    },
  });
}

registerSection(initGallery);
