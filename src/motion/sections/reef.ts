import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The reef line work strokes itself in as the visitor arrives — the same
 * DrawSVG technique as the Queen in the Intro, which is what stops the Intro
 * reading as a preamble bolted onto the front of the site.
 *
 * A reveal, not a scrub: it plays once on entry and is then left alone. Scrub
 * would tie the drawing to scroll speed, and a visitor flicking past would see
 * it snap rather than draw.
 */

function initReef({ reduced }: MotionContext): void {
  if (reduced) return;

  const section = document.querySelector<HTMLElement>('#reef');
  if (!section) return;

  gsap.utils.toArray<HTMLElement>('[data-reef-art]', section).forEach((art) => {
    const parts = gsap.utils.toArray<SVGElement>('[data-reef-part]', art);
    if (parts.length === 0) return;

    gsap.fromTo(
      parts,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: 1.4,
        stagger: 0.06,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      },
    );
  });
}

registerSection(initReef);
