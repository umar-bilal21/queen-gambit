import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The Gallery rail travels on its own, and can be dragged.
 *
 * It used to be scrubbed by vertical scroll — the photographs moved sideways
 * only while the page moved down, so the section was still whenever the visitor
 * was. It now drifts continuously and can be taken hold of.
 *
 * The rail is a real overflow-scroll container, so before any of this runs it
 * is already swipeable on touch, scrollable by trackpad and reachable by
 * keyboard. This drives `scrollLeft` on top of that rather than replacing it,
 * which is why all of those keep working.
 *
 * The photographs are rendered twice. When the drift passes the halfway point
 * it is rewound by exactly one set, so the loop has no seam and no end.
 */

/**
 * Pixels per second. Fast enough that the rail is visibly moving when a visitor
 * arrives at it, slow enough that it still reads as drift rather than as a
 * carousel demanding to be watched.
 */
const SPEED = 44;

function initGallery({ reduced }: MotionContext): void {
  const rail = document.querySelector<HTMLElement>('[data-gallery-rail]');
  if (!rail) return;

  /*
   * Under reduced motion the rail simply does not move on its own. It stays a
   * perfectly good scroller — the visitor moves it, which is the whole point of
   * the preference.
   */
  if (reduced) return;

  let paused = false;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  /* Fractional pixels accumulate here: scrollLeft is integer, and rounding
     26px/s to zero every frame would leave the rail motionless. */
  let carry = 0;

  const half = (): number => rail.scrollWidth / 2;

  const tick = (_t: number, deltaMs: number): void => {
    if (paused || dragging) return;

    carry += (SPEED * deltaMs) / 1000;
    const whole = Math.floor(carry);
    if (whole > 0) {
      carry -= whole;
      rail.scrollLeft += whole;
    }

    // Wrap by exactly one set of photographs, which is invisible.
    if (rail.scrollLeft >= half()) rail.scrollLeft -= half();
  };

  gsap.ticker.add(tick);

  /* Hovering pauses it: a visitor who has stopped on a photograph is looking at
     it, and sliding it out from under them is rude. */
  rail.addEventListener('pointerenter', () => {
    paused = true;
  });
  rail.addEventListener('pointerleave', () => {
    paused = false;
  });

  // Drag to slide.
  rail.addEventListener('pointerdown', (event) => {
    // Touch already has native momentum scrolling; hijacking it is worse.
    if (event.pointerType === 'touch') return;

    dragging = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.dataset.dragging = 'true';
    rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    event.preventDefault();
    rail.scrollLeft = startScroll - (event.clientX - startX);
  });

  const endDrag = (event: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    delete rail.dataset.dragging;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);

  /*
   * Dragging backwards past the start would hit the beginning of the rail and
   * stop dead, so the wrap has to work in both directions.
   */
  rail.addEventListener('scroll', () => {
    if (rail.scrollLeft <= 0) rail.scrollLeft += half();
  });
}

registerSection(initGallery);
