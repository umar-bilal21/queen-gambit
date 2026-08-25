import { registerSection, type MotionContext } from '../index';
import { isCoarsePointer } from '../environment';

/**
 * The Masterwork cards turn to show their text.
 *
 * Hover where there is a pointer, tap where there is not. A card that only
 * responds to hover is inert on a phone, and the back of these cards carries
 * real copy rather than decoration — it is not optional content.
 *
 * The card is a button, so click and Enter and Space already work. This adds
 * the pointer behaviour on top and makes sure only one thing owns the state:
 * `aria-expanded` is the single source of truth, read by the stylesheet for the
 * rotation and by assistive technology for the same fact.
 */

function initFlip({ reduced }: MotionContext): void {
  if (reduced) return;

  const cards = document.querySelectorAll<HTMLElement>('[data-flip-card]');
  const coarse = isCoarsePointer();

  cards.forEach((card) => {
    const set = (open: boolean) => card.setAttribute('aria-expanded', String(open));

    card.addEventListener('click', () => {
      set(card.getAttribute('aria-expanded') !== 'true');
    });

    if (coarse) return;

    card.addEventListener('pointerenter', () => set(true));
    card.addEventListener('pointerleave', () => set(false));
    /* Keyboard focus should show the same thing hovering does, or tabbing to a
       card lands on a face whose content the visitor cannot reach. */
    card.addEventListener('focus', () => set(true));
    card.addEventListener('blur', () => set(false));
  });
}

registerSection(initFlip);
