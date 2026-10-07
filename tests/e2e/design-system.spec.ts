import { settleMotion } from './motion';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [375, 768, 1280, 1440, 1920, 2560]) {
  test(`reading hierarchy and three modes at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('phone'), 'Explicit viewports cover these layouts.');
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/en');
    const navigation = page.getByRole('navigation', { name: 'Ways to explore' });
    for (const [mode, label, purpose] of [
      ['explore', 'Explore', 'Open discovery'],
      ['story', 'Story', 'Guided narrative'],
      ['trace', 'Trace an idea', 'Conceptual genealogy'],
    ]) {
      await navigation.getByRole('button', { name: label, exact: true }).click();
      await expect(navigation.getByRole('button', { name: label, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('.mode-purpose')).toHaveText(purpose);
      const metrics = await page.evaluate(() => {
        const style = (s: string) => getComputedStyle(document.querySelector(s)!);
        const rect = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          reading: parseFloat(style('.entity-reading > p').fontSize),
          metadata: parseFloat(style('.entity-meta').fontSize),
          navHeight: rect('.primary-nav button').height,
          panelRight: rect('.entity-panel').right,
          graphLeft: rect('.visualization-column').left,
        };
      });
      expect(metrics.overflow).toBe(false);
      expect(metrics.reading).toBeGreaterThanOrEqual(18);
      expect(metrics.metadata).toBeGreaterThanOrEqual(12);
      expect(metrics.navHeight).toBeGreaterThanOrEqual(44);
      if (mode === 'story' && width > 1200)
        expect(metrics.panelRight).toBeLessThanOrEqual(metrics.graphLeft + 1);
      if ([375, 768, 1440, 2560].includes(width)) {
        const path = testInfo.outputPath(`${mode}-${width}.png`);
        await page.screenshot({ path, fullPage: true, animations: 'disabled' });
        await testInfo.attach(`${mode}-${width}`, { path, contentType: 'image/png' });
      }
      if (width === 1440) {
        await settleMotion(page);
        const scan = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(scan.violations).toEqual([]);
      }
    }
  });
}

test('translated navigation and text reflow on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const locale of ['de', 'es']) {
    await page.goto(`/${locale}/architecture/transformers?mode=trace`);
    await expect(page.locator('.mode-guide')).toBeVisible();
    await expect(page.locator('.trace-banner select')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.locator('.primary-nav button').first().click();
    await expect(page.locator('.story-progress')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test('enlarged text reorganizes the reading layout without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/en?mode=story');
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  await expect(page.locator('.mode-purpose')).toHaveText('Guided narrative');
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    columns: getComputedStyle(document.querySelector('.atlas-workspace')!).display,
    reading: parseFloat(getComputedStyle(document.querySelector('.entity-reading > p')!).fontSize),
  }));
  expect(metrics.overflow).toBe(false);
  expect(metrics.columns).toBe('flex');
  expect(metrics.reading).toBeGreaterThanOrEqual(36);
});
