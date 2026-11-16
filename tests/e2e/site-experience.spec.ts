import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { entities, references } from '../../content';
import { searchEntities } from '../../lib/search';

test('every search result remains reachable and explicit reading moves focus', async ({
  page,
}, info) => {
  await page.goto('/en?level=expert&q=learning');
  const expected = searchEntities(entities, 'learning', 'en', references);
  let more = page.locator('.search-show-more');
  while (await more.count()) {
    await more.first().click();
    more = page.locator('.search-show-more');
  }
  await expect(page.locator('.search-result')).toHaveCount(expected.length);
  const target = expected.at(-1)!;
  await page.locator('.search-results .branch-title').filter({ hasText: target.title.en }).click();
  await expect(page.locator('#reading-view')).toHaveAttribute('data-entity-id', target.id);
  await expect(page.locator('#reading-view')).toBeFocused();
  await expect(page.locator('#reading-view')).toBeInViewport();
  await page.screenshot({ path: info.outputPath('search-reading.png'), fullPage: true });
});

test('responsive discovery picker exposes the full filtered catalog', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en?level=expert&q=learning');
  const picker = page.getByLabel('Choose a discovery');
  const matches = searchEntities(entities, 'learning', 'en', references);
  await expect(picker.locator('option')).toHaveCount(matches.length);
  await picker.selectOption(matches.at(-1)!.id);
  await expect(page.locator('#reading-view')).toHaveAttribute('data-entity-id', matches.at(-1)!.id);
  await expect(page.locator('#reading-view')).toBeFocused();
});

test('secondary pages retain exploration context and share language and theme controls', async ({
  page,
}, info) => {
  await page.goto('/en/architecture/transformers?level=connections&view=reading');
  await page.locator('footer').getByRole('link').click();
  const header = page.locator('.section-header');
  await expect(header.getByRole('link', { name: 'Resume exploration' })).toHaveAttribute(
    'href',
    /transformers.*view=reading/,
  );
  await header.getByRole('combobox').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await header.getByRole('link', { name: 'Deutsch', exact: true }).click();
  await expect(
    page.locator('.section-header').getByRole('link', { name: 'Erkundung fortsetzen' }),
  ).toHaveAttribute('href', /^\/de\/architecture\/transformers/);
  await page.locator('.section-header').getByRole('link', { name: 'Forschungskatalog' }).click();
  await expect(page).toHaveURL(/\/de\/research/);
  await expect(page.locator('.section-header select')).toHaveValue('dark');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).include('.section-header').analyze()).violations).toEqual(
    [],
  );
  await page.screenshot({ path: info.outputPath('research-navigation.png') });
  await page.locator('.section-header').getByRole('link', { name: 'Erkundung fortsetzen' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'transformers');
  await expect(page).toHaveURL(/view=reading/);
});

test('path cards guide the learner to reading and clipboard errors have feedback', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Denied')) },
      configurable: true,
    });
  });
  await page.goto('/en');
  await page.getByRole('button', { name: /Follow a learning path/ }).click();
  await expect(page.locator('.journey-stop-count')).toHaveCount(4);
  await page
    .locator('.learning-journey-options article')
    .filter({ hasText: 'Rules versus learning' })
    .getByRole('button')
    .click();
  await page.getByRole('button', { name: 'Read the current stop' }).click();
  await expect(page.locator('#reading-view')).toBeFocused();
  await page.getByRole('button', { name: 'Copy link to this view' }).click();
  await expect(page.locator('.share-view [role="status"]')).toContainText('Copy unavailable');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('path-reader.png') });
});

test('new controls reflow in translated narrow layouts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const locale of ['de', 'es']) {
    await page.goto(`/${locale}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.goto(`/${locale}/about`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    expect(
      (await new AxeBuilder({ page }).include('.section-header').analyze()).violations,
    ).toEqual([]);
  }
});

test('sharing copies the current exploration URL and storage denial has a safe fallback', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Denied');
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (value: string) => {
          document.documentElement.setAttribute('data-copied-url', value);
          return Promise.resolve();
        },
      },
      configurable: true,
    });
  });
  await page.goto('/en/architecture/transformers?view=reading');
  await page.getByRole('button', { name: 'Copy link to this view' }).click();
  await expect(page.locator('.share-view [role="status"]')).toHaveText('Link copied.');
  await expect(page.locator('html')).toHaveAttribute('data-copied-url', page.url());
  await page.goto('/en/about');
  await expect(
    page.locator('.section-header').getByRole('link', { name: 'Resume exploration' }),
  ).toHaveAttribute('href', '/en');
});

test('timeline date labels remain separated on phones and tablets', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en');
    const labels = page.locator('.time-tick span');
    await expect(labels.first()).toBeVisible();
    await expect
      .poll(async () => {
        const bounds = await labels.evaluateAll((nodes) =>
          nodes.map((node) => ({
            left: node.getBoundingClientRect().left,
            right: node.getBoundingClientRect().right,
          })),
        );
        return bounds.every((bound, index) => !index || bound.left >= bounds[index - 1].right + 4);
      })
      .toBe(true);
  }
});
