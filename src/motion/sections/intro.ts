import { gsap, registerSection, type MotionContext } from '../index';
import {
  createIntroState,
  introReducer,
  isIntroFinished,
  type IntroEvent,
  type IntroState,
} from '../state';
import { lockScroll, unlockScroll } from '../scrollLock';
import { INTRO_FAILSAFE_MS } from '../layout';

/**
 * The arrival.
 *
 * A fixed timeline of roughly 3.5 seconds: the Queen draws herself in, the line
 * resolves beneath her, the screen lifts. It is art direction, not
 * instrumentation — there is no progress bar because there is no honest
 * progress to report, and a fabricated percentage would be a lie told to the
 * visitor in the first frame of the brand experience (ADR 0003).
 *
 * The state machine lives in `../state` where its terminal transitions are
 * tested. Nothing here decides state; it only reacts to it.
 */

function initIntro({ reduced }: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-intro]');
  if (!root) return;

  let state: IntroState = createIntroState({ prefersReducedMotion: reduced });

  let locked = false;

  const finish = (): void => {
    root.dataset.introState = 'done';
    root.remove();
    if (locked) unlockScroll();
  };

  if (isIntroFinished(state)) {
    finish();
    return;
  }

  /*
   * The overlay may already be gone.
   *
   * The stylesheet fades it out on a timer so that a bundle which never
   * arrives cannot leave the Castle unreachable. If the bundle arrives *after*
   * that timer, the visitor has already been shown the Hero — and setting
   * `data-intro-state="running"` below would cancel the CSS animation, snap
   * the navy overlay back over the page, and play the whole timeline with the
   * body locked. Rather than a continuous arrival that would be the page
   * yanked backwards. So if we are late, we are done.
   */
  if (performance.now() >= INTRO_FAILSAFE_MS) {
    finish();
    return;
  }

  /*
   * Cancels the CSS failsafe in the component: from here the timeline owns the
   * overlay's life, and the stylesheet must stop trying to fade it out.
   */
  root.dataset.introState = 'running';

  /*
   * The page must not scroll underneath the Intro. A visitor who scrolls during
   * it would otherwise arrive at the Hero already halfway down the Story.
   */
  lockScroll();
  locked = true;

  const parts = gsap.utils.toArray<SVGElement>('[data-queen] [data-queen-part]');
  const ruleParts = gsap.utils.toArray<SVGElement>(
    '[data-intro] [data-ornament-part]',
  );
  const line = root.querySelector<HTMLElement>('[data-intro-line]');
  const skip = root.querySelector<HTMLElement>('[data-intro-skip]');
  const queen = root.querySelector<SVGElement>('[data-queen]');

  const timeline = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => send('completed'),
  });

  /*
   * The Queen assembles crown-first: the strokes run in markup order, and the
   * SVG's paths are authored top to bottom for exactly that reason.
   *
   * The whole sequence lands at a little under four seconds. Every duration below is part
   * of that budget, and the hold in the middle is the largest single piece of
   * it — the line has to be read, not merely displayed, and reading is slower
   * than animating.
   */
  timeline
    .set(root, { autoAlpha: 1 })
    .set(parts, { drawSVG: '0%' })
    .set(line, { autoAlpha: 0, y: 14 })
    .set(ruleParts, { drawSVG: '0%' })
    .set(skip, { autoAlpha: 0 })
    .to(parts, {
      drawSVG: '100%',
      duration: 0.9,
      stagger: 0.022,
      ease: 'power1.inOut',
    })
    .to(queen, { scale: 1.015, duration: 1.1, ease: 'sine.inOut' }, '-=0.5')
    .to(line, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.75')
    .to(
      ruleParts,
      { drawSVG: '100%', duration: 0.6, stagger: 0.05, ease: 'power2.inOut' },
      '-=0.45',
    )
    .to(skip, { autoAlpha: 1, duration: 0.3 }, '-=0.5')
    // The reading hold.
    .to({}, { duration: 0.65 })
    .to([line, skip], { autoAlpha: 0, duration: 0.3 })
    .to(queen, { autoAlpha: 0, scale: 1.06, duration: 0.45, ease: 'power2.in' }, '-=0.15')
    // The lift: the overlay rises rather than fading, so the Hero is revealed by
    // something moving out of the way instead of one page dissolving into
    // another.
    .to(root, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' }, '-=0.2');

  function send(event: IntroEvent): void {
    const next = introReducer(state, event);
    if (next === state) return;
    state = next;

    if (state === 'skipped') {
      /*
       * Play first. The timeline may be paused waiting on the Hero photograph
       * to decode, and tweening the timeScale of a paused timeline does
       * nothing — skip would silently do nothing on exactly the slow
       * connection where a visitor most wants it.
       */
      timeline.play();
      /*
       * Fast-forward rather than cut. A visitor who skips still gets the reveal
       * — they just get it quickly — which keeps the Hero's entrance intact
       * instead of snapping to it.
       */
      gsap.to(timeline, { timeScale: 6, duration: 0.25, ease: 'power2.in' });
      return;
    }

    if (isIntroFinished(state)) finish();
  }

  const requestSkip = (): void => send('skipped');

  skip?.addEventListener('click', requestSkip);
  root.addEventListener('click', requestSkip);
  window.addEventListener('wheel', requestSkip, { passive: true, once: true });
  window.addEventListener('touchstart', requestSkip, { passive: true, once: true });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') requestSkip();
  });

  /*
   * The Hero photograph is preloaded by the document head, but the timeline
   * does not wait on it — the Intro's length is fixed by design. This only
   * guards the one case that would look broken: an image so slow that the lift
   * would reveal an empty frame. In that case the reveal holds until it lands.
   */
  const hero = document.querySelector<HTMLImageElement>('[data-hero-media] img');
  if (hero && !hero.complete) {
    timeline.pause();
    hero
      .decode()
      .catch(() => undefined)
      .finally(() => timeline.play());
  }
}

registerSection(initIntro);
