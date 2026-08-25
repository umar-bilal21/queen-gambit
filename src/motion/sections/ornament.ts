import { gsap, registerSection, type MotionContext } from '../index';

/**
 * Every ornament draws itself on.
 *
 * The crowned numerals, the dividers and the corner brackets are all strokable
 * paths for exactly this reason: gold that appears fully formed is decoration
 * placed on a page, whereas gold that is drawn is part of what the page does.
 * It is the same technique as the Queen in the Intro and the reef line work,
 * and using it everywhere is what keeps one hand across the site.
 *
 * One pass over every `[data-ornament]` on the page rather than per-section
 * wiring, so a new ornament joins by existing.
 */

function initOrnament({ reduced }: MotionContext): void {
  if (reduced) return;

  /*
   * Everything except the Intro's. The Intro is a fixed overlay removed before
   * the visitor has scrolled at all, so a scroll trigger there would either
   * fire instantly and fight the Intro's own timeline, or outlive the element
   * it was watching. Its divider is drawn by that timeline instead.
   */
  gsap.utils
    .toArray<SVGElement>('[data-ornament]')
    .filter((mark) => !mark.closest('[data-intro]'))
    .forEach((mark) => {
    const parts = gsap.utils.toArray<SVGElement>('[data-ornament-part]', mark);
    if (parts.length === 0) return;

    gsap.fromTo(
      parts,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: 0.9,
        stagger: 0.07,
        ease: 'power2.inOut',
        scrollTrigger: {
          /*
           * Triggered on the ornament's parent, not the ornament itself. A
           * crowned numeral is only a few dozen pixels tall, so a trigger on
           * its own bounds fires almost exactly when it is already in view and
           * the drawing is missed.
           */
          trigger: mark.parentElement ?? mark,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });
}

registerSection(initOrnament);
