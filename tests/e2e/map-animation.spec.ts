import { test, expect } from '@playwright/test';

test('map draws chronological trails, resets, and offers a static view', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('button', { name: /1\. Essentials/ })).toBeEnabled();
  await page.clock.install();
  const frame = page.locator('#map-view');
  if ((await frame.getAttribute('open')) === null) await frame.locator(':scope > summary').click();
  const map = page.locator('.world-map');
  await map.evaluate((element) => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await expect(map).toBeInViewport();
  await page.waitForTimeout(100);
  const trails = map.locator('.map-connection-trail');
  await expect(trails.first()).toBeAttached();
  const target = await map.locator('.map-edge').first().getAttribute('data-target');
  const receivingNode = map.locator(`[data-entities~="${target}"] .map-node-border`).first();
  const initialFill = await receivingNode.evaluate((node) => getComputedStyle(node).fill);
  const initialStroke = await receivingNode.evaluate((node) => getComputedStyle(node).stroke);
  await page.clock.runFor(600);
  const offset = await trails
    .first()
    .evaluate((p) => Number((p as SVGPathElement).style.strokeDashoffset));
  expect(offset).toBeGreaterThan(0);
  expect(offset).toBeLessThan(1);
  await page.clock.runFor(2100);
  await expect(trails.first()).toHaveCSS('stroke-dashoffset', '0px');
  const firstRings = map.locator('.map-edge').first().locator('.map-arrival-ring');
  await expect(firstRings).toHaveCount(3);
  expect(
    await firstRings.first().evaluate((ring) => Number((ring as SVGCircleElement).style.opacity)),
  ).toBeGreaterThan(0);
  const radii = await firstRings.evaluateAll((rings) =>
    rings.map((ring) => Number(ring.getAttribute('r'))),
  );
  expect(radii[0]).toBeGreaterThan(radii[1]);
  expect(radii[1]).toBeGreaterThan(radii[2]);
  await page.clock.runFor(250);
  expect(
    await firstRings.last().evaluate((ring) => Number((ring as SVGCircleElement).style.opacity)),
  ).toBeGreaterThan(0);
  const growth = await firstRings
    .first()
    .evaluate(
      (ring) => Number(ring.getAttribute('r')) / Number((ring as SVGCircleElement).dataset.radius),
    );
  expect(growth).toBeGreaterThan(1);
  expect(growth).toBeLessThan(3);
  const colors = await trails.evaluateAll((paths) =>
    paths.map((path) => getComputedStyle(path).stroke),
  );
  expect(new Set(colors).size).toBeGreaterThan(1);
  await expect(firstRings.first()).toHaveCSS('stroke', colors[0]);
  const routes = await trails.evaluateAll((paths) => paths.map((path) => path.getAttribute('d')));
  expect(new Set(routes).size).toBe(routes.length);
  expect(await receivingNode.evaluate((node) => getComputedStyle(node).stroke)).not.toBe(
    initialStroke,
  );
  await expect(map.locator('.map-connection-head').nth(1)).toHaveCSS('opacity', '0');
  await map.screenshot({ path: `/tmp/map-animation-${test.info().project.name}.png` });
  await page.clock.runFor(1900);
  await expect(receivingNode).toHaveCSS('stroke', initialStroke);
  await expect(receivingNode).toHaveCSS('fill', initialFill);
  await expect(map.locator('.map-connection-head').nth(1)).toHaveCSS('opacity', '1');
  const count = await trails.count();
  await page.clock.runFor((count * 3200 + 3700) / 0.7 - 4850 + 150);
  expect(await trails.last().evaluate((p) => (p as SVGPathElement).style.opacity)).toBe('0');
  await page.getByRole('switch', { name: 'Animate chronology' }).click();
  await expect(trails.first()).toHaveCSS('stroke-dasharray', 'none');
  await expect(firstRings.first()).toHaveCSS('opacity', '0');
  await page.getByRole('switch', { name: 'Animate chronology' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(trails.first()).toHaveCSS('stroke-dasharray', 'none');
  await expect(firstRings.first()).toHaveCSS('opacity', '0');
  await expect(map.locator('.map-connection-head').first()).toHaveCSS('opacity', '0');
});

test('map information card and animation switch support pointer and keyboard', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en');
  await expect(page.getByRole('button', { name: /1\. Essentials/ })).toBeEnabled();
  const frame = page.locator('#map-view');
  if ((await frame.getAttribute('open')) === null) await frame.locator(':scope > summary').click();
  const info = page.getByRole('button', { name: 'About map connections' });
  const card = page.locator('[data-preview-kind="map-info"]');
  await expect(card).toHaveCount(0);
  if (isMobile) await info.tap();
  else await info.hover();
  await expect(card).toBeVisible();
  await expect(card).toContainText(
    'Connections appear when both discoveries exist, in date order.',
  );
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  const toggle = page.getByRole('switch', { name: 'Animate chronology' });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await page.keyboard.press('Tab');
  await info.focus();
  await expect(card).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await page
    .locator('.map-section')
    .screenshot({ path: `/tmp/map-controls-${test.info().project.name}.png` });
});
