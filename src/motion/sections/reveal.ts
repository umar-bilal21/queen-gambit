import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The site's shared entrance vocabulary.
 *
 * Every reference the client chose moves the same way: headings wipe up from
 * behind their own baseline, photographs uncover rather than fade, and blocks
 * of copy rise in a beat after the thing they belong to. Before this the page
 * had motion in individual sections and nothing tying them together, so
 * arriving at a section felt like arriving at a different site.
 *
 * Four behaviours, declared in markup rather than wired per section:
 *
 *   data-reveal-heading  a display line wiping up behind a mask
 *   data-reveal-image    a frame uncovering, its photograph settling from a
 *                        slight over-scale
 *   data-reveal-group    children rising in sequence
 *   data-reveal          a single element rising in
 *
 * All of it is `once`. These are arrivals, not scrubs: replaying them every
 * time a visitor scrolls back up would turn a considered page into a
 * flickering one.
 *
 * Nothing here hides anything in CSS. If this module never runs — no
 * JavaScript, or an error upstream — the page is simply already in its finished
 * state, which is the only failure mode worth having.
 *
 * Two rules keep the reveals from costing anyone the page:
 *
 * 1. Opacity, never `autoAlpha`. GSAP's `autoAlpha` also sets
 *    `visibility: hidden`, which takes the element out of the accessibility
 *    tree — so a contact button three sections down was unreachable to a screen
 *    reader and skipped in tab order until somebody happened to scroll to it.
 * 2. Focus finishes a reveal immediately. Even at `opacity: 0` an element is
 *    still focusable, so tabbing ahead of the scroll would otherwise move focus
 *    to something invisible.
 */

const START = 'top 85%';

/** Reveals still waiting to play, so focus can finish one early. */
const pending = new Map<HTMLElement, gsap.core.Animation>();

function track(scope: HTMLElement, animation: gsap.core.Animation): void {
  pending.set(scope, animation);
  animation.eventCallback('onComplete', () => pending.delete(scope));
}

/**
 * If a visitor tabs to something that has not revealed yet, finish its reveal
 * rather than leaving focus on an invisible control.
 */
function initFocusRescue(): void {
  document.addEventListener(
    'focusin',
    (event) => {
      const target = event.target as Element | null;
      if (!target) return;

      for (const [scope, animation] of pending) {
        if (scope === target || scope.contains(target)) {
          animation.progress(1);
          pending.delete(scope);
        }
      }
    },
    true,
  );
}

function initReveals({ reduced }: MotionContext): void {
  if (reduced) return;

  initFocusRescue();

  /*
   * Headings wipe up from behind their own bounds. The clip runs slightly past
   * 100% at both ends so descenders are not shaved by a boundary that lands
   * exactly on the text box.
   */
  gsap.utils.toArray<HTMLElement>('[data-reveal-heading]').forEach((el) => {
    const animation = gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 108% 0%)', yPercent: 8 },
      {
        clipPath: 'inset(0% 0% -8% 0%)',
        yPercent: 0,
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: START, once: true },
      },
    );
    track(el, animation);
  });

  /*
   * Photographs uncover. The frame's clip opens while the image inside settles
   * back from a slight over-scale, so the picture appears to be arriving rather
   * than being switched on.
   */
  gsap.utils.toArray<HTMLElement>('[data-reveal-image]').forEach((frame) => {
    const image = frame.querySelector('img');

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: frame, start: START, once: true },
    });

    track(frame, timeline);

    timeline.fromTo(
      frame,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' },
    );

    if (image) {
      timeline.fromTo(
        image,
        { scale: 1.18 },
        { scale: 1, duration: 1.6, ease: 'power3.out' },
        0,
      );
    }
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (children.length === 0) return;

    const animation = gsap.from(children, {
      y: 26,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.11,
      scrollTrigger: { trigger: group, start: START, once: true },
    });
    track(group, animation);
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const animation = gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: START, once: true },
    });
    track(el, animation);
  });
}

registerSection(initReveals);
