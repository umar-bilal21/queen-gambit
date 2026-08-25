import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The reef, alive.
 *
 * The line work draws itself in once and then, before this, sat perfectly
 * still — which is what made the cream sections read as a page with drawings on
 * it rather than as water. Turtles now drift, kelp sways, bubbles rise.
 *
 * Continuous rather than scrubbed. Water does not stop when the visitor stops
 * scrolling, and tying this to scroll position would freeze the reef at exactly
 * the moment somebody settles down to read.
 *
 * Everything here is slow to the point of being barely perceptible. That is the
 * brief: these sections carry the site's two longest pieces of writing, and
 * motion that pulls the eye off the sentence is worse than no motion at all. If
 * you can watch it, it is too fast.
 *
 * Each element is seeded from its index so the left and right compositions
 * never move in lockstep — two identical drifts read as a repeated graphic,
 * two different ones read as a current.
 */

/**
 * Where each kelp group is anchored to the sea floor, in the artwork's own
 * coordinates. Rotation has to pivot there rather than at the centre of a
 * bounding box, or the stems detach from the floor as they sway.
 *
 * `svgOrigin` rather than a CSS `transform-origin`: GSAP writes the transform
 * attribute directly on SVG elements and would override the stylesheet.
 */
const KELP_ORIGINS = ['60 458', '187 458'];

function initReef({ reduced }: MotionContext): void {
  /*
   * The draw-on runs regardless of the drift below, and lives here rather than
   * in the Story: the artwork is about to appear in two different sections and
   * the drawing belongs to the artwork, not to whichever section happens to
   * hold it.
   */
  gsap.utils.toArray<SVGElement>('[data-reef-art]').forEach((art) => {
    const parts = gsap.utils.toArray<SVGElement>('[data-reef-part]', art);
    if (parts.length === 0 || reduced) return;

    gsap.fromTo(
      parts,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: 1.4,
        stagger: 0.06,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: art, start: 'top 92%', once: true },
      },
    );
  });

  if (reduced) return;

  gsap.utils.toArray<SVGElement>('[data-reef-art]').forEach((art, artIndex) => {
    // Turtles: a long shallow drift with a little rise, and a slow roll.
    gsap.utils.toArray<SVGElement>('[data-reef-turtle]', art).forEach((turtle, i) => {
      const seed = artIndex * 2 + i;

      gsap.to(turtle, {
        x: 14 + seed * 3,
        y: -9 - seed * 2,
        duration: 26 + seed * 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: seed * 2.5,
      });

      gsap.to(turtle, {
        rotation: 2.5,
        transformOrigin: '50% 50%',
        duration: 17 + seed * 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // Kelp: a sway about the floor it grows from.
    gsap.utils.toArray<SVGElement>('[data-reef-kelp]', art).forEach((kelp, i) => {
      gsap.to(kelp, {
        rotation: i % 2 === 0 ? 1.9 : -1.9,
        svgOrigin: KELP_ORIGINS[i] ?? KELP_ORIGINS[0],
        duration: 11 + i * 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 1.6,
      });
    });

    /*
     * Bubbles rise, fading in as they leave and out before they arrive, so each
     * loop dissolves rather than snapping back to the floor.
     *
     * Keyframes rather than an onUpdate writing opacity by hand: a callback
     * setting the same property the tween is animating means two things fight
     * over it every frame.
     */
    gsap.utils.toArray<SVGElement>('[data-reef-bubble]', art).forEach((bubble, i) => {
      gsap.fromTo(
        bubble,
        { y: 0, opacity: 0 },
        {
          keyframes: {
            y: [0, -22, -52, -76],
            opacity: [0, 1, 1, 0],
            easeEach: 'none',
          },
          duration: 9 + i * 2,
          ease: 'none',
          repeat: -1,
          delay: i * 3,
        },
      );
    });
  });
}

registerSection(initReef);
