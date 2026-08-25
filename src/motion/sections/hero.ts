import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The Hero drifts, and lifts away from its text on scroll.
 *
 * Two separate motions with different jobs. The drift is a slow, endless
 * scale-and-pan that makes the page feel alive without asking for attention —
 * it is deliberately slower than anything a visitor would consciously notice.
 * The parallax is scroll-bound and gives the section depth as it leaves.
 */

function initHero({ reduced }: MotionContext): void {
  if (reduced) return;

  const media = document.querySelector<HTMLElement>('[data-hero-media]');
  const content = document.querySelector<HTMLElement>('[data-hero-content]');
  const hero = document.querySelector<HTMLElement>('#hero');
  if (!hero || !media) return;

  // The drift. 28 seconds for one pass, yoyoing forever: long enough that the
  // frame never appears to be "doing" anything.
  gsap.to(media, {
    scale: 1.08,
    xPercent: -1.5,
    duration: 28,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  // The parallax. The photograph rises more slowly than the page, and the text
  // fades before it reaches the top so it never collides with the header.
  gsap.to(media, {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });

  if (content) {
    gsap.to(content, {
      yPercent: -18,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

registerSection(initHero);
