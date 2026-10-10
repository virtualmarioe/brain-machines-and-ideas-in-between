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
  await page.clock.runFor(600);
  const offset = await trails
    .first()
    .evaluate((p) => Number((p as SVGPathElement).style.strokeDashoffset));
  expect(offset).toBeGreaterThan(0);
  expect(offset).toBeLessThan(1);
  await page.clock.runFor(1000);
  await expect(trails.first()).toHaveCSS('stroke-dashoffset', '0px');
  await map.screenshot({ path: `/tmp/map-animation-${test.info().project.name}.png` });
  const count = await trails.count();
  await page.clock.runFor((count - 1) * 650 + 1100 + 3700 - 1600 + 150);
  expect(await trails.last().evaluate((p) => (p as SVGPathElement).style.opacity)).toBe('0');
  await page.getByRole('button', { name: 'Animate chronology' }).click();
  await expect(trails.first()).toHaveCSS('stroke-dasharray', 'none');
  await page.getByRole('button', { name: 'Animate chronology' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(trails.first()).toHaveCSS('stroke-dasharray', 'none');
  await expect(map.locator('.map-connection-head').first()).toHaveCSS('opacity', '0');
});
