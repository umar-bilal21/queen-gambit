import { gsap, ScrollTrigger, registerSection, type MotionContext } from '../index';

/**
 * The Story's passage travels through a fixed window while the section is held
 * still, and its words recolour from navy to aqua behind the reader.
 *
 * The travel is what keeps the section's cost predictable: a long passage laid
 * out down the page consumes however many lines it happens to run to, whereas
 * this consumes one screen no matter how much writing is in it.
 *
 * Everything is bound to scroll position rather than played on a timer, so
 * scrolling back up runs it backwards and the effect is never spent.
 */

function initStory({ reduced }: MotionContext): void {
  const section = document.querySelector<HTMLElement>('[data-story]');
  if (!section) return;

  /*
   * Under reduced motion nothing here runs — which also means the pinning flag
   * below is never set, so the section lays out at its natural height and the
   * whole passage is simply readable.
   */
  if (reduced) return;

  const track = section.querySelector<HTMLElement>('[data-story-track]');
  const windowEl = section.querySelector<HTMLElement>('[data-story-window]');
  const words = gsap.utils.toArray<HTMLElement>('[data-story-word]', section);

  if (!track || !windowEl || words.length === 0) return;

  /*
   * Only now is the fixed-height window switched on. Until this point the
   * passage has been at its natural height, so a visitor whose JavaScript never
   * arrived reads all of it rather than a clipped fragment of it.
   */
  section.dataset.storyPinned = 'true';

  /*
   * How far the passage has to move for its last line to reach the top of the
   * window. Measured rather than assumed: the passage reflows with the
   * viewport, and a hard-coded distance would leave the closing words either
   * stranded below the fold or scrolled past before the section ends.
   */
  const travel = (): number => Math.max(0, track.scrollHeight - windowEl.clientHeight);

  gsap.fromTo(
    track,
    { y: 0 },
    {
      y: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    },
  );

  /*
   * The words arrive as well as leave. The recolour below fades them behind the
   * reader; this lifts them in as the passage first appears, so the writing is
   * alive at the moment it is read rather than only on its way out.
   */
  gsap.from(words, {
    y: 14,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.012,
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  });

  /*
   * The recolour runs over the same range, so a word fading is a word leaving.
   * `stagger: 1` spreads the tweens evenly across the scrub, which lines up
   * with the travel closely enough that the two read as one effect.
   */
  gsap.fromTo(
    words,
    { color: 'var(--navy)' },
    {
      color: 'var(--aqua-faded)',
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    },
  );

  // The passage reflows on resize, so the distance it must travel changes.
  ScrollTrigger.addEventListener('refreshInit', () => {
    gsap.set(track, { y: 0 });
  });
}

registerSection(initStory);
