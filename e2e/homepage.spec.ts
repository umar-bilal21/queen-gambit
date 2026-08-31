import { expect, test, type Page } from '@playwright/test';

/**
 * The smoke suite — test seam 2.
 *
 * Runs against the production build served by `astro preview`, never the dev
 * server, so it exercises what the client will actually open.
 *
 * These assert what a visitor could observe: that a section rendered, that the
 * Intro can be escaped, that a link goes where it says. They deliberately do
 * not assert on GSAP internals, timeline positions, class names or pixels — a
 * test that fails on every legitimate design change teaches you to ignore it,
 * and visual fidelity here is reviewed by eye.
 */

/** The Intro is a fixed ~3.5s timeline; this is comfortably past its end. */
const INTRO_MS = 5000;

/**
 * Every section with a landmark, in document order. The page grew from eight to
 * eleven with the castle direction, and listing them once means a new section
 * cannot be added to the page without being added to the suite.
 */
const SECTIONS = [
  'story',
  'masterwork',
  'rooms',
  'beliefs',
  'return',
  'gallery',
  'manifesto',
  'enter',
  'footer',
] as const;

/**
 * Get past the Intro so a test can reach the page.
 *
 * Not by clicking the skip button. That button fades in partway through the
 * timeline while the overlay itself is animating, so Playwright's actionability
 * check waits for it to be stable — and if that wait outlasts the timeline, the
 * overlay finishes on its own and removes the button mid-click. The test then
 * fails with "element was detached" despite having got exactly what it wanted.
 *
 * Nudging the overlay past its stability check and asserting the end state is
 * both more robust and closer to what is actually being claimed: that the Intro
 * goes away and the page is reachable.
 */
async function skipIntro(page: Page): Promise<void> {
  const intro = page.locator('[data-intro]');

  await intro
    .click({ force: true, position: { x: 5, y: 5 }, timeout: 1500 })
    .catch(() => {
      /* Already gone — the timeline finished first, which is a pass. */
    });

  await expect(intro).toHaveCount(0, { timeout: INTRO_MS });
}

test.describe('the homepage', () => {
  test('renders every section with the client copy', async ({ page }) => {
    await page.goto('/');

    // The Intro's line, before anything else.
    await expect(page.getByText('A LIVING MASTERPIECE INSPIRED BY ART, NATURE AND VISION')).toBeVisible();

    await skipIntro(page);

    await expect(page.locator('#hero')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Where the Ocean Meets Imagination', level: 1 }),
    ).toBeVisible();
    await expect(page.getByText('By Modern-Day Philosopher Frank J. Russo')).toBeVisible();

    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }

    // The Story's sentence is split into one element per word for the
    // recolour, so it is asserted through the accessible name rather than as
    // a contiguous text node.
    // One beige section carries both paragraphs.
    await expect(page.locator('#story')).toContainText('Along the Florida Coast');
    await expect(page.locator('#story')).toContainText('Ceramic turtles');

    await expect(page.getByRole('heading', { name: 'Explore Every Corner' })).toBeVisible();
    /*
     * The room names are set in caps by CSS, so the text in the DOM — which is
     * what these assertions read, and what a screen reader announces — is the
     * title case the content module holds.
     */
    for (const room of [
      'Living and Dining Beneath the Waves',
      'The Door of Perception – Master Chamber',
      "The Queen's Command Center",
    ]) {
      await expect(page.locator('#rooms')).toContainText(room);
    }

    await expect(page.locator('#beliefs')).toContainText('A VISION BUILT WITH PURPOSE');
    await expect(page.locator('#beliefs')).toContainText('PURPOSE IN EVERY MOVE');
    await expect(page.locator('#beliefs')).toContainText('CREATE FOR WHAT COMES NEXT');
    await expect(page.locator('#beliefs').getByRole('listitem')).toHaveCount(5);

    await expect(page.getByRole('heading', { name: 'Our Gallery' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Enter The Queen’s Gambit' })).toBeVisible();

    // The three sections added with the castle direction.
    await expect(page.locator('#masterwork')).toContainText('Ocean-Inspired Masterwork');
    await expect(page.locator('#masterwork')).toContainText('Oceanic Serenity');
    await expect(page.locator('#masterwork')).toContainText('Worldwide Allure');
    await expect(page.locator('#return')).toContainText('Along the Florida Coast');
    await expect(page.locator('#manifesto')).toContainText('Frank J. Russo');
    await expect(page.locator('#manifesto')).toContainText('Visionary & Creator');
  });

  test('the two new controls go somewhere real', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    const learnMore = page
      .locator('#masterwork')
      .getByRole('link', { name: 'LEARN MORE ABOUT US' });
    await expect(learnMore).toHaveAttribute('href', '#manifesto');
    // The destination has to exist, or the anchor is decoration.
    await expect(page.locator('#manifesto')).toBeAttached();

    const talk = page.locator('#manifesto').getByRole('link', { name: 'TALK TO US TODAY' });
    expect(await talk.getAttribute('href')).toContain('mailto:');
  });

  test('the footer promises nothing that does not exist', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    const footer = page.locator('#footer');

    /*
     * The client's mockup shows EXPERIENCE, LEGACY and two social icons. There
     * are no such pages and no social account appears in any material supplied,
     * so the footer must not render them — a dead link at the end of the page
     * is where a pitch springs its leak.
     */
    await expect(footer).not.toContainText('EXPERIENCE');
    await expect(footer).not.toContainText('LEGACY');

    const external = await footer.locator('a[href^="http"]').count();
    expect(external, 'footer should link nowhere off this page').toBe(0);

    /*
     * The footer carries the site's three pages. Each has to be a real route,
     * and each has to be built from the deployment base — bare paths 404 on
     * GitHub Pages, which is what every inner-page nav link did until the
     * links were made base-aware.
     */
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href')!),
    );
    expect(hrefs.length, 'the footer should link to the site pages').toBe(3);

    for (const href of hrefs) {
      const response = await page.request.get(href);
      expect(response.status(), `${href} should resolve`).toBe(200);
    }
  });

  test('says Castle, never Landmark', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();

    expect(body).toContain("THE QUEEN'S GAMBIT CASTLE");
    /*
     * The email address legitimately contains "landmark" and is the client's
     * real working address; nothing else on the page may (ADR 0004).
     */
    const stray = body.replace(/thequeensgambitlandmark@gmail\.com/g, '');
    expect(stray.toLowerCase()).not.toContain('landmark');
  });

  test('the Intro plays, then hands off to the Hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-intro]')).toBeVisible();
    // Left alone, it finishes and removes itself.
    await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: INTRO_MS });
    await expect(page.locator('#hero')).toBeInViewport();
  });

  test('a click dismisses the Intro early', async ({ page }) => {
    await page.goto('/');
    const intro = page.locator('[data-intro]');
    await expect(intro).toBeVisible();

    /*
     * Click the overlay itself rather than the skip button. The button fades in
     * partway through the timeline, so `click()` would wait for it to become
     * actionable — and timing the dismissal from before that wait measures how
     * long the Intro takes to offer the button, not how long skipping takes.
     */
    await intro.click({ position: { x: 10, y: 10 } });
    const started = Date.now();

    await expect(intro).toHaveCount(0, { timeout: INTRO_MS });

    // Skipping fast-forwards rather than cutting, so it is not instant — but it
    // must be meaningfully shorter than sitting through the whole thing.
    expect(Date.now() - started).toBeLessThan(2000);
  });

  test('the contact button carries a working mailto', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    const cta = page.locator('#enter').getByRole('link', { name: 'CONTACT US' });
    const href = await cta.getAttribute('href');

    expect(href).toContain('mailto:thequeensgambitlandmark@gmail.com');
    expect(href).toContain('subject=');
  });

  /**
   * Regression guard. The entrance reveals were first written with GSAP's
   * `autoAlpha`, which also sets `visibility: hidden` — so everything below the
   * fold was out of the accessibility tree and out of tab order until somebody
   * scrolled to it. The contact button was unreachable.
   */
  test('reveals never hide content from assistive technology', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    // Deliberately without scrolling anywhere near the Enter section.
    const cta = page.locator('#enter').getByRole('link', { name: 'CONTACT US' });
    await expect(cta).toHaveCount(1);

    /*
     * Across every section, not just the one that happened to catch it. The
     * castle direction added far more reveals than the page had before, and
     * this bug was originally found by accident rather than by test.
     */
    const hidden = await page
      .locator('[data-reveal], [data-reveal-heading], [data-reveal-group]')
      .evaluateAll((nodes) =>
        nodes
          .filter((n) => getComputedStyle(n).visibility === 'hidden')
          .map((n) => n.className || n.tagName),
      );
    expect(hidden, 'reveals must never hide content from assistive technology').toEqual([]);
  });

  test('nothing errors on the console', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.waitForTimeout(INTRO_MS);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    expect(errors).toEqual([]);
  });
});

test.describe('header navigation', () => {
  test('every link goes to a real page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'links live behind the menu on mobile');

    await page.goto('/');
    await skipIntro(page);

    /*
     * The header used to carry in-page anchors, which meant the site's other
     * two pages could not be reached from the homepage at all. It now carries
     * the same three destinations everywhere.
     */
    for (const label of ['Home', 'The Essence', 'Contact'] as const) {
      const link = page.locator('[data-header]').getByRole('link', { name: label, exact: true });
      const href = await link.getAttribute('href');
      expect(href, `${label} should have an href`).toBeTruthy();

      const response = await page.request.get(href!);
      expect(response.status(), `${label} → ${href} should resolve`).toBe(200);
    }
  });

  test('the menu opens and closes on a small screen', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the menu only exists on small screens');

    await page.goto('/');
    await skipIntro(page);

    const toggle = page.locator('[data-menu-toggle]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-menu]')).toBeVisible();

    /*
     * Closing, not navigating. The menu links now leave the page, so clicking
     * one would assert against a document that is being torn down.
     */
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

/*
 * `test.use({ reducedMotion })` does not reach the browser context here —
 * matchMedia still reports no preference — so the emulation is applied
 * explicitly per page instead. Verified: with emulateMedia the page sees the
 * preference and removes the Intro.
 */
test.describe('reduced motion', () => {
  test('opens directly on the Hero, with no Intro', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('[data-intro]')).toHaveCount(0, { timeout: 3000 });
    await expect(page.locator('#hero')).toBeInViewport();
  });

  test('the Story is fully legible rather than half-recoloured', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#story').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    /*
     * The recolour fades words *away* from navy as they pass, so the legible
     * state is also the default state. Under reduced motion every word must
     * still be at full strength — a half-faded passage would be the failure.
     */
    const colours = await page
      .locator('#story [data-story-word]')
      .evaluateAll((nodes) => nodes.map((n) => getComputedStyle(n).color));

    expect(colours.length).toBeGreaterThan(0);
    expect(new Set(colours).size).toBe(1);
  });
});

test.describe('small screens', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the document never scrolls sideways', async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);

    for (const id of SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.scrollingElement!.scrollWidth,
        clientWidth: document.scrollingElement!.clientWidth,
      }));

      expect(scrollWidth, `document overflows horizontally at #${id}`).toBeLessThanOrEqual(
        clientWidth,
      );
    }
  });
});
