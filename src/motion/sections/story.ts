import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The Story's words recolour from navy to aqua, scrubbed by scroll.
 *
 * Bound to position rather than played on a timer, so scrolling back up runs it
 * backwards and the effect is never spent. The words are already real elements
 * in the HTML — split at build time, not here — so this only animates them.
 *
 * Note the direction: words start navy and fade *to* aqua as they pass. The
 * legible state is therefore also the default state, which is what makes the
 * no-JavaScript and reduced-motion paths correct without any extra work.
 */

function initStory({ reduced }: MotionContext): void {
  if (reduced) return;

  const section = document.querySelector<HTMLElement>('#story');
  if (!section) return;

  const words = gsap.utils.toArray<HTMLElement>('[data-story-word]', section);
  if (words.length === 0) return;

  gsap.fromTo(
    words,
    { color: 'var(--navy)' },
    {
      color: 'var(--aqua)',
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: section,
        // Starting once the passage is comfortably on screen and ending before
        // it leaves means the recolour happens while the visitor is reading it,
        // rather than beginning while it is still below the fold.
        start: 'top center',
        end: 'bottom center+=20%',
        scrub: 0.6,
      },
    },
  );
}

registerSection(initStory);
