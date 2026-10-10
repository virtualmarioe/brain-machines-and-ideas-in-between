import { test, expect } from '@playwright/test';
import { entities } from '../../content';
import { settleMotion } from './motion';
test('clusters cover all ideas, split on zoom, and expose separate anchored cards', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/en/architecture/neocognitron?level=connections');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator(':scope > summary').click();
  const map = page.locator('.map-section');
  const markers = map.locator('.map-city');
  const ids = await markers.evaluateAll((nodes) =>
    [...new Set(nodes.flatMap((node) => node.getAttribute('data-entities')!.split(' ')))].sort(),
  );
  expect(ids).toEqual(
    entities
      .filter((entity) => entity.locations.length)
      .map((entity) => entity.id)
      .sort(),
  );
  const wide = await markers.count();
  const cluster = markers.filter({ hasText: /^[2-9]|^[1-9][0-9]/ }).first();
  const count = Number(await cluster.locator('text').textContent());
  await cluster.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab');
  await cluster.focus();
  const preview = page.locator('[data-preview-kind="map-cluster"]');
  await expect(preview).toBeVisible();
  await expect(preview.locator('article')).toHaveCount(count);
  await preview.hover();
  await settleMotion(page);
  await expect(page.locator('[data-cluster-tail]').first()).toBeVisible();
  const rects = await preview.locator('article').evaluateAll((nodes) =>
    nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    }),
  );
  for (let i = 1; i < rects.length; i++)
    expect(rects[i].top - rects[i - 1].bottom).toBeGreaterThanOrEqual(12);
  await page.screenshot({ path: info.outputPath('cluster-cards.png') });
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
  await cluster.press('Enter');
  await expect(map.locator('div.map-city-details li')).toHaveCount(count);
  for (let i = 0; i < 12; i++) await map.getByRole('button', { name: /Zoom in/i }).click();
  expect(await markers.count()).toBeGreaterThan(wide);
  await map.getByRole('combobox', { name: 'Map view', exact: true }).selectOption('discoveries');
  const endpoints = await map
    .locator('.map-edge')
    .evaluateAll((nodes) =>
      nodes.flatMap((node) => [node.getAttribute('data-source'), node.getAttribute('data-target')]),
    );
  for (const id of new Set(endpoints)) {
    const entity = entities.find((entity) => entity.id === id)!;
    await expect(
      map
        .locator('.map-pin')
        .filter({ has: page.locator('circle') })
        .and(
          map.getByRole('button', {
            name: `${entity.title.en} · ${entity.locations[0].name}`,
            exact: true,
          }),
        ),
    ).toBeVisible();
  }
});

test('background is sparse, pauses signals and respects reduced motion', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('.network-node')).toHaveCount(30);
  expect(await page.locator('.network-signal').count()).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause background motion' }).click();
  await expect(page.locator('.network-signal').first()).toHaveCSS('animation-play-state', 'paused');
  await expect(page.locator('.network-node-ring').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.network-signal').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.network-node-core').first()).toHaveCSS('animation-name', 'none');
});
