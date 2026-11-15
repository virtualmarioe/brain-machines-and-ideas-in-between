import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('location search, viewport controls, and keyboard navigation work together', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/en/architecture/neocognitron?level=connections');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').first().click();
  const map = page.locator('.map-section');
  await map.getByRole('searchbox', { name: 'Find a city or institution' }).fill('London');
  await map.locator('.map-location-results button').first().click();
  await expect(map.getByRole('combobox', { name: 'City', exact: true })).toHaveValue(
    'london, united kingdom',
  );
  await expect(map.locator('.map-navigation output')).toHaveText('3.0×');
  const canvas = map.locator('svg.world-map');
  const transform = await canvas.locator(':scope > g').first().getAttribute('transform');
  await canvas.focus();
  await canvas.press('ArrowRight');
  await expect(canvas.locator(':scope > g').first()).not.toHaveAttribute('transform', transform!);
  await canvas.press('+');
  await expect(map.locator('.map-navigation output')).toHaveText('3.5×');
  await canvas.press('Home');
  await expect(map.locator('.map-navigation output')).toHaveText('1.0×');
  await map.getByRole('button', { name: 'Locate selected discovery' }).click();
  await expect(map.locator('.map-navigation output')).toHaveText('3.0×');
  await map.getByRole('searchbox').fill('no-such-location');
  await expect(map.locator('.map-location-results')).toContainText('No matching locations');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).include('.map-navigation').analyze()).violations).toEqual(
    [],
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await map.screenshot({ path: info.outputPath('map-navigation.png') });
});

test('zoom preserves the viewport center and crowded clusters can be expanded', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en/architecture/neocognitron?level=connections');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').first().click();
  const map = page.locator('.map-section');
  const canvas = map.locator('svg.world-map');
  await canvas.focus();
  await canvas.press('ArrowRight');
  const center = async () => {
    const transform = await canvas.locator(':scope > g').first().getAttribute('transform');
    const values = transform!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    return [(360 - values[0]) / values[2], (147 - values[1]) / values[2]];
  };
  const before = await center();
  await map.getByRole('button', { name: 'Where ideas took shape: Zoom in', exact: true }).click();
  const after = await center();
  expect(after[0]).toBeCloseTo(before[0], 5);
  expect(after[1]).toBeCloseTo(before[1], 5);
  await canvas.focus();
  await canvas.press('Home');
  const cluster = map
    .locator('.map-city')
    .filter({ has: page.locator('text') })
    .and(map.getByRole('button', { name: / · / }))
    .first();
  await cluster.focus();
  await cluster.press('Enter');
  await map.getByRole('button', { name: 'Expand this cluster' }).click();
  await expect(map.locator('.map-navigation output')).toHaveText('2.0×');
});

test('regional shortcuts and direct zoom work in both map modes', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/en/architecture/neocognitron?level=connections');
  const frame = page.locator('#map-view');
  if (isMobile) await expect(frame).toHaveJSProperty('open', false);
  if ((await frame.getAttribute('open')) === null) await frame.locator('summary').first().click();
  const map = page.locator('.map-section');
  for (const mode of ['cities', 'discoveries']) {
    await map.getByRole('combobox', { name: 'Map view', exact: true }).selectOption(mode);
    await map.getByRole('button', { name: 'Europe', exact: true }).click();
    await expect(map.locator('.map-navigation output')).toHaveText('3.5×');
    await map.getByRole('button', { name: 'World', exact: true }).click();
    await expect(map.locator('.map-navigation output')).toHaveText('1.0×');
    await map.locator('svg.world-map').dblclick({ position: { x: 35, y: 35 } });
    await expect(map.locator('.map-navigation output')).toHaveText('2.0×');
  }
  await map.getByRole('button', { name: 'World', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).include('.map-section').analyze()).violations).toEqual([]);
  await map.screenshot({ path: info.outputPath('map-refined.png') });
});
