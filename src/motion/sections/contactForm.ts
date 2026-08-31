import { registerSection, type MotionContext } from '../index';

/**
 * The Contact page's inquiry form.
 *
 * There is no backend — this is a pitch (ADR 0001) — so the form opens the
 * visitor's mail client with the enquiry assembled: the shared prefilled
 * subject and a body carrying the filled-in fields. The same trade the
 * homepage's CONTACT US button makes, extended to a form.
 *
 * A native `mailto:` form action would also work, but it drops the field
 * names and lets the mail client decide the body. Building the href here
 * keeps the enquiry readable when it arrives.
 */

function initContactForm(_context: MotionContext): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const subject = encodeURIComponent(form.dataset.subject ?? 'Enquiry — The Queen’s Gambit Castle');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const lines: string[] = [];
    for (const [key, value] of data) {
      if (typeof value === 'string' && value.trim()) {
        lines.push(`${key}: ${value.trim()}`);
      }
    }

    const body = encodeURIComponent(lines.join('\n'));
    const email = form.getAttribute('action') ?? '';
    const base = email.split('?')[0];
    window.location.href = `${base}?subject=${subject}&body=${body}`;
  });
}

registerSection(initContactForm);
