import { expect, test, type Page } from '@playwright/test';

async function openViews(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.entity-panel')).toBeVisible();
  for (const frame of await page.locator('.visualization-frame').all()) {
    if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  }
}

test('graph previews persist while hovered, dismiss with Escape, and stay inside the viewport', async ({
  page,
}) => {
  await openViews(page, '/en/architecture/neocognitron');
  const node = page.locator('.graph-node[aria-pressed="true"]');
  await node.hover();
  const preview = page.locator('[role="tooltip"][data-preview-kind="graph"]');
  await expect(preview).toContainText('Neocognitron');
  await expect(preview).toContainText('1980');
  await preview.hover();
  await expect(preview).toBeVisible();
  const box = await preview.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
});

test('keyboard focus exposes preview descriptions without changing selection', async ({ page }) => {
  await openViews(page, '/en/architecture/neocognitron');
  await page.keyboard.press('Tab');
  const node = page.locator('.graph-node[aria-pressed="true"]');
  await node.focus();
  const preview = page.locator('[role="tooltip"][data-preview-kind="graph"]');
  await expect(preview).toBeVisible();
  await expect(node).toHaveAttribute('aria-describedby', (await preview.getAttribute('id'))!);
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'neocognitron');
  await node.press('Escape');
  await expect(preview).toHaveCount(0);
});

test('map cards include localized geography and accurate longitude direction', async ({ page }) => {
  for (const locale of ['de', 'es'] as const) {
    await openViews(page, `/${locale}/architecture/lenet`);
    const pin = page.locator('.map-pin[aria-pressed="true"]');
    await pin.locator('circle').last().hover();
    const preview = page.locator('[role="tooltip"][data-preview-kind="map"]');
    await expect(preview).toContainText('AT&T Labs Research');
    await expect(preview).toContainText('Red Bank');
    await expect(preview).toContainText(locale === 'de' ? 'Vereinigte Staaten' : 'Estados Unidos');
    await expect(preview).toContainText(locale === 'de' ? '74,06° W' : '74,06° O');
    await expect(preview).toContainText('1998');
    await page.keyboard.press('Escape');
  }
});

test('co-located London discoveries have distinct reachable hover targets', async ({ page }) => {
  await openViews(page, '/en?q=DeepMind&scope=all&context=1');
  const pins = page.locator('.map-pin[aria-label*="London"]');
  expect(await pins.count()).toBeGreaterThanOrEqual(2);
  for (const pin of await pins.all()) {
    const name = (await pin.getAttribute('aria-label'))!.split(' · ')[0];
    await pin.locator('circle').last().hover();
    const preview = page.locator('[role="tooltip"][data-preview-kind="map"]');
    await expect(preview.getByRole('heading')).toHaveText(name);
    await expect(preview).toContainText('United Kingdom');
    await page.keyboard.press('Escape');
  }
});
