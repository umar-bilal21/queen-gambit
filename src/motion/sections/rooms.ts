import { gsap, registerSection, type MotionContext } from '../index';

/**
 * Each room frame rises into place as it enters the viewport, so the section
 * assembles around the visitor rather than being there already.
 *
 * Per-item triggers rather than one staggered batch: on a phone the three
 * frames are stacked and far apart, and a batch would fire the third one while
 * it is still two screens below.
 */

function initRooms({ reduced }: MotionContext): void {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>('[data-room]').forEach((item) => {
    gsap.from(item, {
      y: 56,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
    });
  });
}

registerSection(initRooms);
