import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { shouldSmoothScroll } from './environment';

/**
 * Inertial smooth scrolling, and its agreement with ScrollTrigger.
 *
 * Every reference site the client chose scrolls this way, and it accounts for a
 * good deal of why they read as expensive. The cost is real though: any scroll
 * hijack degrades find-in-page and can feel laggy on weak hardware, so it is
 * off under reduced motion and off on touch, where the native momentum is
 * better than anything we would install.
 */

export interface SmoothScroll {
  /** Scroll to an element or offset, respecting whichever scroller is active. */
  scrollTo(target: string | HTMLElement | number, options?: { offset?: number }): void;
  /** Current scroll position, from whichever scroller is active. */
  destroy(): void;
}

/** A no-op standing in for Lenis where smooth scrolling is not wanted. */
function nativeScroller(): SmoothScroll {
  return {
    scrollTo(target, options) {
      const offset = options?.offset ?? 0;
      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior: 'smooth' });
        return;
      }
      const element =
        typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    destroy() {},
  };
}

export function createSmoothScroll(): SmoothScroll {
  if (!shouldSmoothScroll()) return nativeScroller();

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    // Belt and braces: `shouldSmoothScroll` already excludes coarse pointers,
    // but a hybrid device that reports a fine pointer should still keep its
    // native touch momentum.
    syncTouch: false,
  });

  /*
   * The two halves of the bridge.
   *
   * Lenis moves the page on its own schedule, so ScrollTrigger must be told
   * whenever it does — otherwise triggers fire against a stale position. And
   * Lenis must be driven from GSAP's ticker rather than its own rAF loop, so
   * the two are never a frame apart. lagSmoothing is off because GSAP's
   * catch-up jump on a slow frame lands as a visible lurch in a scrubbed
   * timeline.
   */
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return {
    scrollTo(target, options) {
      lenis.scrollTo(target, { offset: options?.offset ?? 0 });
    },
    destroy() {
      lenis.destroy();
    },
  };
}
