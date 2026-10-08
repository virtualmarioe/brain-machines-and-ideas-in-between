import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { entities } from '../../content';
import { groupMapCities } from '../../lib/map-pins';
import { settleMotion } from './motion';
test('city clusters expose every discovery and retain synchronized selection', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/en/architecture/neocognitron');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  const map = page.locator('.map-section');
  const cityNames = await map
    .locator('.map-city')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label')?.split(': ')[0]));
  const visibleCities = groupMapCities(entities).filter((city) => cityNames.includes(city.name));
  const group =
    visibleCities.find((city) => city.key === 'london, united kingdom') ??
    visibleCities.find((city) => !city.entities.some((entity) => entity.id === 'neocognitron'))!;
  await map.getByRole('combobox', { name: 'Map view', exact: true }).selectOption('cities');
  await expect(map.locator('.map-city')).toHaveCount(visibleCities.length);
  await expect(map.locator('.map-pin')).toHaveCount(0);
  const london = map.getByRole('button', {
    name: `${group.name}: ${group.entities.length} Discoveries`,
    exact: true,
  });
  await london.focus();
  await london.press('Enter');
  const panel = map.locator('.map-city-details');
  await expect(panel.getByRole('combobox', { name: 'City', exact: true })).toHaveValue(group.key);
  await expect(panel.locator('li')).toHaveCount(group.entities.length);
  await panel.locator('li button').first().click();
  await expect(page.locator('.entity-panel')).toHaveAttribute(
    'data-entity-id',
    group.entities[0].id,
  );
  await expect(map.locator('.map-city[aria-pressed="true"]')).toHaveAttribute(
    'aria-label',
    `${group.name}: ${group.entities.length} Discoveries`,
  );
  await settleMotion(page);
  expect(
    (
      await new AxeBuilder({ page })
        .include('.map-section')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await map.screenshot({ path: info.outputPath('city-clusters.png') });
  await map.getByRole('combobox', { name: 'Map view', exact: true }).selectOption('discoveries');
  await expect(map.locator('.map-pin').first()).toBeVisible();
  await expect(map.locator('.map-city')).toHaveCount(0);
  await expect(panel).toBeVisible();
});

test('two-line city labels never overlap in either map mode', async ({ page, isMobile }) => {
  await page.goto('/en/architecture/neocognitron');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  const map = page.locator('.map-section');
  for (const mode of ['discoveries', 'cities']) {
    await map.getByRole('combobox', { name: 'Map view', exact: true }).selectOption(mode);
    const labels = map.locator('[data-map-label] text');
    await expect(labels.first()).toBeVisible();
    const boxes = await labels.evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
    );
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j];
        expect(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y).toBe(
          true,
        );
      }
    const country = map.locator('[data-map-label] .map-country').first();
    await expect(country).toHaveCSS('font-size', '10px');
    expect(await country.textContent()).toMatch(/^[A-Z]{2,3}$/);
    await expect(labels.first()).toHaveCSS('font-size', /1[45]px/);
  }
});

test('geographic anchors stay fixed and marker diameter grows with zoom', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/en/architecture/neocognitron');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  const map = page.locator('.map-section');
  const marker = map.locator('.map-city[aria-pressed="true"]');
  const before = await marker.getAttribute('transform');
  const diameter = (await marker.locator('circle').nth(1).boundingBox())!.width;
  await map.getByRole('button', { name: /Zoom in/i }).click();
  await map.getByRole('button', { name: /Zoom in/i }).click();
  expect((await marker.getAttribute('transform'))!.split(' scale')[0]).toBe(
    before!.split(' scale')[0],
  );
  expect((await marker.locator('circle').nth(1).boundingBox())!.width).toBeGreaterThan(
    diameter * 1.1,
  );
  await expect(map.locator('.map-label-leader')).toHaveCount(0);
  await expect(map.locator('.map-edge')).toHaveCount(0);
  await map.getByLabel('Show intellectual connections').check();
  expect(await map.locator('.map-edge').count()).toBeGreaterThan(0);
  await settleMotion(page);
  await map.screenshot({ path: info.outputPath('geographic-zoom.png') });
});
