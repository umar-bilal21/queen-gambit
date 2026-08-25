import { ScrollTrigger, registerSection, type MotionContext } from '../index';
import { HEADER_HEIGHT } from '../layout';

/**
 * The header condenses from transparent to solid navy once the Hero has passed.
 *
 * A class flip rather than a scrubbed animation: it is a change of state, not
 * of position, and animating it against scroll would make it flicker at the
 * boundary.
 *
 * The small-screen menu lives in its own module — this one is only about how
 * the bar reacts to scroll.
 */

function initHeader(_context: MotionContext): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.querySelector<HTMLElement>('#hero');
  if (!header || !hero) return;

  ScrollTrigger.create({
    trigger: hero,
    // Condense as the Hero's foot passes the bar, so it solidifies exactly when
    // it stops sitting over the photograph.
    start: `bottom top+=${HEADER_HEIGHT}`,
    onEnter: () => {
      header.dataset.condensed = 'true';
    },
    onLeaveBack: () => {
      header.dataset.condensed = 'false';
    },
  });
}

registerSection(initHeader);
