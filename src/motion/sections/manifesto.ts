import { gsap, registerSection, type MotionContext } from '../index';

/**
 * The manifesto travels through a fixed window while the section is held still,
 * so six paragraphs and a signature cost one screen rather than many.
 *
 * Same device as the Story, deliberately paced slower. The Story's two
 * paragraphs are a passage the reader is carried through; this is a statement
 * they are being asked to weigh. The window is taller, the travel is longer
 * relative to it, and the scrub is softer — the reader should always have
 * several sentences in view rather than a line at a time.
 *
 * Nothing moves unless the visitor scrolls, so anyone can stop and finish the
 * sentence in front of them. That is the mitigation for the one real cost of
 * this device, which is that it takes reading pace out of the reader's hands.
 */

function initManifesto({ reduced }: MotionContext): void {
  const section = document.querySelector<HTMLElement>('[data-manifesto]');
  if (!section) return;

  /*
   * Under reduced motion nothing runs, so the pinning flag is never set and the
   * section lays out at its natural height with the whole statement readable.
   */
  if (reduced) return;

  const track = section.querySelector<HTMLElement>('[data-manifesto-track]');
  const windowEl = section.querySelector<HTMLElement>('[data-manifesto-window]');
  if (!track || !windowEl) return;

  /*
   * Only now is the fixed window switched on. Until this point the statement is
   * at its natural height, so a visitor whose JavaScript never arrived reads
   * all of it rather than a clipped fragment.
   */
  section.dataset.manifestoPinned = 'true';

  /*
   * Measured rather than assumed: the statement reflows with the viewport, and
   * a hard-coded distance would either strand the closing lines below the fold
   * or scroll past the signature before the section ends.
   */
  const travel = (): number => Math.max(0, track.scrollHeight - windowEl.clientHeight);

  gsap.fromTo(
    track,
    { y: 0 },
    {
      y: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    },
  );
}

registerSection(initManifesto);
