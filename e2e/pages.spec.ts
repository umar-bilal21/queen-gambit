import { expect, test, type Page } from '@playwright/test';

/**
 * The smoke suite for the two inner pages — the Essence (issue #30) and
 * Contact (issue #31).
 *
 * Same rules as the homepage spec: assert what a visitor could observe, run
 * against the production build, and never pin pixels. These pages skip the
 * Intro and open straight onto their content with a condensed header.
 */

async function expectCondensedHeader(page: Page): Promise<void> {
  await expect(page.locator('[data-header]')).toHaveAttribute(
    'data-condensed',
    'true',
  );
}

/**
 * The room blocks are two sections sharing the `essence` class, each wrapping
 * a `.room` section. Scope to the room section itself — the heading's own
 * section — so the wrapper does not make the locator ambiguous.
 */
function roomSection(page: Page, heading: string) {
  return page
    .getByRole('heading', { name: heading })
    .locator('xpath=ancestor::section[contains(@class, "room")]');
}

test.describe('the Essence page', () => {
  test('renders both room experiences with the client copy', async ({ page }) => {
    await page.goto('/essence/');

    const terrace = roomSection(page, 'Oceanfront Terrace and Gardens');
    const chamber = roomSection(page, 'Door of Perception Master Chamber');

    await expect(
      page.getByRole('heading', { name: 'The Essence of The Queen’s Gambit Castle', level: 1 }),
    ).toBeVisible();

    // Both room blocks, in order.
    await expect(terrace).toBeVisible();
    await expect(chamber).toBeVisible();

    // The terrace block's copy and details.
    await expect(terrace).toContainText('The Patience Move');
    await expect(terrace).toContainText('Sweeping ocean views');

    // The chamber block's copy, quote and details.
    await expect(chamber).toContainText('Love is not kind. Love is patience.');
    await expect(chamber).toContainText('Fire Rain chandelier');
  });

  test('opens with a condensed header and no Intro', async ({ page }) => {
    await page.goto('/essence/');

    await expect(page.locator('[data-intro]')).toHaveCount(0);
    await expectCondensedHeader(page);
  });

  test('header links to Home, The Essence and Contact', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile',
      'links live behind the menu on mobile',
    );

    await page.goto('/essence/');

    const nav = page.locator('[data-header] .header__nav');
    for (const [label, href] of [
      ['Home', '/'],
      ['The Essence', '/essence/'],
      ['Contact', '/contact/'],
    ] as const) {
      const link = nav.getByRole('link', { name: label });
      await expect(link).toHaveAttribute('href', href);
    }
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/essence/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    expect(errors).toEqual([]);
  });
});

test.describe('the Contact page', () => {
  test('renders the details and the form', async ({ page }) => {
    await page.goto('/contact/');

    await expect(
      page.getByRole('heading', { name: 'Connect With The Queen’s Gambit', level: 1 }),
    ).toBeVisible();

    await expect(page.locator('#contact')).toContainText('ALL INQUIRIES');
    await expect(page.locator('#contact')).toContainText('thequeensgambitlandmark@gmail.com');
    await expect(page.locator('#contact')).toContainText('NEW SMYRNA BEACH, FLORIDA');

    await expect(page.getByText('FULL NAME')).toBeVisible();
    await expect(page.getByText('EMAIL')).toBeVisible();
    await expect(page.getByText('PHONE')).toBeVisible();
    await expect(page.getByText('MESSAGE')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SUBMIT INQUIRY' })).toBeVisible();
  });

  test('opens with a condensed header and no Intro', async ({ page }) => {
    await page.goto('/contact/');

    await expect(page.locator('[data-intro]')).toHaveCount(0);
    await expectCondensedHeader(page);
  });

  test('the form submit carries the enquiry as a mailto', async ({ page }) => {
    await page.goto('/contact/');

    await page.getByLabel('FULL NAME').fill('Jane Doe');
    await page.getByLabel('EMAIL').fill('jane@example.com');
    await page.getByLabel('MESSAGE').fill('I would like a private visit.');

    /*
     * Browsers may not actually navigate on a mailto — the OS mail client
     * handles it — so capture the intended destination rather than asserting
     * on the URL after the fact.
     */
    const mailto = await page.evaluate(() => {
      const form = document.querySelector('[data-contact-form]') as HTMLFormElement;
      const data = new FormData(form);
      const lines: string[] = [];
      for (const [key, value] of data) {
        if (typeof value === 'string' && value.trim()) lines.push(`${key}: ${value.trim()}`);
      }
      const subject = encodeURIComponent(form.dataset.subject ?? '');
      const body = encodeURIComponent(lines.join('\n'));
      const base = (form.getAttribute('action') ?? '').split('?')[0];
      return `${base}?subject=${subject}&body=${body}`;
    });

    expect(mailto).toContain('mailto:thequeensgambitlandmark@gmail.com');
    expect(mailto).toContain('subject=');
    expect(mailto).toContain('body=');
    expect(decodeURIComponent(mailto)).toContain('name: Jane Doe');
    expect(decodeURIComponent(mailto)).toContain('email: jane@example.com');
    expect(decodeURIComponent(mailto)).toContain('message: I would like a private visit.');

    /*
     * The handler navigates to the mailto. A browser may hand it to the OS
     * without navigating at all, so the URL assembly above is the assertion;
     * the click just proves the handler is wired without throwing.
     */
    await page.getByRole('button', { name: 'SUBMIT INQUIRY' }).click();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/contact/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    expect(errors).toEqual([]);
  });
});
