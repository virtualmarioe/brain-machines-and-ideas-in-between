import { expect, test } from '@playwright/test';

test('Nobel medal photographs are static and thirty percent smaller', async ({ page }) => {
  await page.goto(
    '/en/experiment/adrian-rate-coding?level=connections&journey=neuroscience-neural-codes&step=0&nobel=1',
  );
  const medal = page.locator('.journey-award .nobel-medal');
  await expect(medal).toBeVisible();
  await expect(medal.locator('.nobel-medal-glint')).toHaveCSS(
    'animation-name',
    'nobel-medal-glint',
  );
  await expect(medal).toHaveAttribute('aria-hidden', 'true');
  expect(Number(await medal.getAttribute('width'))).toBeCloseTo(15.4);
  await expect(medal.locator('image')).toHaveAttribute('href', '/images/nobel-medal-front.jpg');
  await expect(medal).toHaveCSS('animation-name', 'none');
  const photo = await page.request.get('/images/nobel-medal-front.jpg');
  expect(photo.ok()).toBe(true);
  expect(photo.headers()['content-type']).toContain('image/jpeg');
  await expect(page.locator('.nobel-note > span .nobel-medal')).toBeVisible();
  expect(await page.locator('.nobel-event .nobel-medal').count()).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause background motion' }).click();
  await expect(medal).toHaveCSS('animation-name', 'none');
  await expect(medal.locator('.nobel-medal-glint')).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(medal.locator('.nobel-medal-glint')).toHaveCSS('display', 'none');
  await expect(medal).toHaveCSS('animation-name', 'none');
  await page
    .locator('.journey-award')
    .screenshot({ path: test.info().outputPath('nobel-medal.png') });
});
