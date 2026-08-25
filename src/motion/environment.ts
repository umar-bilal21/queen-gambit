/**
 * What the visitor's browser and preferences allow.
 *
 * Every motion decision reads from here rather than sniffing `window` at the
 * point of use, so there is one place to look when asking "why is this not
 * animating on my phone".
 */

/**
 * Whether the visitor has asked the system to minimise motion.
 *
 * Read once at boot and not watched. A visitor who flips the setting mid-visit
 * gets it on their next page load; re-running the Intro or tearing down live
 * ScrollTriggers underneath them would be worse than the inconsistency.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Whether this is a coarse-pointer device.
 *
 * Used for two separate decisions that happen to share an answer: smooth scroll
 * is disabled here because native momentum is genuinely better than anything we
 * can hijack, and Belief hover is disabled because there is no hover — a tap
 * would latch a row permanently.
 */
export function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Whether smooth scrolling should be installed at all. */
export function shouldSmoothScroll(): boolean {
  return !prefersReducedMotion() && !isCoarsePointer();
}

/**
 * Resolves once every image currently in the document has decoded, or after a
 * ceiling, whichever comes first.
 *
 * ScrollTrigger measures the page to place its triggers. Measure before the
 * photography has laid out and every trigger below the fold is wrong by
 * hundreds of pixels — the Beliefs section changes row at the wrong moment and
 * the Gallery starts travelling early. The ceiling exists so that one slow
 * image cannot leave the page unmeasured forever.
 */
export function whenImagesSettled(timeoutMs = 4000): Promise<void> {
  const images = Array.from(document.images);

  const decoded = Promise.all(
    images.map((image) =>
      image.complete
        ? Promise.resolve()
        : image.decode().catch(() => undefined),
    ),
  ).then(() => undefined);

  const ceiling = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  return Promise.race([decoded, ceiling]);
}
