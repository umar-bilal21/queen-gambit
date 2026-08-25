import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';

import { prefersReducedMotion, whenImagesSettled } from './environment';
import { createSmoothScroll, type SmoothScroll } from './smoothScroll';

/**
 * The single client island.
 *
 * Everything that ships JavaScript to the browser starts here. No other
 * component has a script tag, so the rest of the page is static HTML and CSS,
 * and this is the one place to look when asking what the page is doing.
 */

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

export interface MotionContext {
  readonly scroller: SmoothScroll;
  /** Whether the visitor has asked for minimal motion. */
  readonly reduced: boolean;
}

type SectionInit = (context: MotionContext) => void;

const sections: SectionInit[] = [];

/**
 * Register a section's motion. Each section module calls this at import time,
 * so adding a section is an import in `main.ts` and nothing else.
 */
export function registerSection(init: SectionInit): void {
  sections.push(init);
}

export function createContext(): MotionContext {
  return {
    scroller: createSmoothScroll(),
    reduced: prefersReducedMotion(),
  };
}

export function initSections(context: MotionContext): void {
  for (const init of sections) {
    try {
      init(context);
    } catch (error) {
      /*
       * One section failing must not take the page down with it. A visitor
       * seeing a static Gallery is a far better outcome than a page where
       * nothing below the failure ever animates — and in a pitch, a silent
       * degradation is survivable where a broken page is not.
       */
      console.error('[motion] section failed to initialise', error);
    }
  }
}

/**
 * Re-measure once the photography has laid out.
 *
 * ScrollTrigger places its triggers by measuring the page. Measure before the
 * images have size and every trigger below the fold is wrong by hundreds of
 * pixels: the Beliefs section changes row at the wrong moment, the Gallery
 * starts travelling early.
 */
export async function settle(): Promise<void> {
  await whenImagesSettled();
  ScrollTrigger.refresh();
}

/**
 * Re-measure on resize.
 *
 * Width only, deliberately. Mobile browsers collapse their address bar as you
 * scroll, which fires a resize with a changed height — refreshing on that
 * would re-measure mid-scroll and make the page jump.
 */
export function watchResize(): void {
  let lastWidth = window.innerWidth;
  let timer = 0;

  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  });
}

export { gsap, ScrollTrigger };
