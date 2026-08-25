import { ScrollTrigger, registerSection, type MotionContext } from '../index';
import { activeBeliefIndex } from '../state';
import { isCoarsePointer } from '../environment';

/**
 * The Beliefs section: a photograph washes in behind whichever row the visitor
 * is reading.
 *
 * Scroll decides by default so the section performs itself for someone who
 * never moves their mouse — which is exactly what the client will do when
 * reviewing this — and a pointer resting on a row takes over while it is there.
 *
 * The decision itself is `activeBeliefIndex`, tested in `../state`. This module
 * only supplies it with inputs and paints the result: if the Active row ever
 * looks wrong, the bug is in one of those two places, not spread between them.
 */

function initBeliefs(_context: MotionContext): void {
  const section = document.querySelector<HTMLElement>('[data-beliefs]');
  if (!section) return;

  const list = section.querySelector<HTMLElement>('[data-beliefs-list]');
  const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-belief]'));
  const photos = Array.from(section.querySelectorAll<HTMLElement>('[data-belief-photo]'));
  if (rows.length === 0) return;

  let progress = 0;
  let hovered: number | null = null;
  let painted = -1;

  const paint = (): void => {
    const index = activeBeliefIndex(progress, rows.length, hovered);
    if (index === painted) return;
    painted = index;

    rows.forEach((row, i) => {
      row.dataset.active = String(i === index);
    });
    photos.forEach((photo, i) => {
      photo.dataset.active = String(i === index);
    });
  };

  ScrollTrigger.create({
    /*
     * The list, not the section. Measuring the whole section hands the eyebrow,
     * title and introduction above it a share of the scroll range, so by the
     * time the first row is being read the progress is already into the second
     * or third — the photograph leads the row instead of matching it.
     */
    trigger: list ?? section,
    start: 'top center',
    end: 'bottom center',
    onUpdate: (self) => {
      progress = self.progress;
      paint();
    },
  });

  /*
   * No hover on a coarse pointer. A tap would set `hovered` and latch that row
   * permanently, since nothing ever fires the matching leave — the section
   * would stop responding to scroll for the rest of the visit.
   */
  if (!isCoarsePointer()) {
    rows.forEach((row, index) => {
      row.addEventListener('pointerenter', () => {
        hovered = index;
        paint();
      });
      row.addEventListener('pointerleave', () => {
        hovered = null;
        paint();
      });
    });
  }

  paint();
}

registerSection(initBeliefs);
