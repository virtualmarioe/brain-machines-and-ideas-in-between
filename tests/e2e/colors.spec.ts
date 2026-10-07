import { settleMotion } from './motion';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark'] as const) {
  test(`scientific palette and signed scales remain readable in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.goto('/en/experiment/hubel-wiesel');
    await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
    await page.getByRole('button', { name: 'ƒ Try the idea' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('[data-scale="signed"]')).toHaveCount(3);
    const pixels = dialog.locator('.scidemo-pixel');
    await expect(pixels.first()).toHaveCSS('fill', 'rgb(255, 255, 255)');
    await expect(dialog.locator('.scidemo-stimulus-bg')).toHaveCSS('fill', 'rgb(0, 0, 0)');
    await expect(dialog.locator('.scidemo-response-cell').first()).toHaveCSS(
      'background-color',
      'rgb(224, 230, 236)',
    );
    await settleMotion(page);
    const violations = await new AxeBuilder({ page })
      .include('dialog')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(violations.violations).toEqual([]);
    const path = testInfo.outputPath(`signed-${theme}.png`);
    await page.screenshot({ path, fullPage: true });
    await testInfo.attach('signed-scale', { path, contentType: 'image/png' });
    await page.keyboard.press('Escape');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(37, 37, 37)');
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`all five discipline labels pass contrast checks in ${theme}`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        /hydrat|server.rendered|did not match/i.test(message.text())
      )
        errors.push(message.text());
    });
    for (const route of [
      '/en/experiment/hubel-wiesel',
      '/en/publication/mcculloch-pitts',
      '/en/architecture/neocognitron',
      '/en/algorithm/perceptron',
      '/en/publication/dopamine',
    ]) {
      await page.goto(route);
      await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
      await settleMotion(page);
      const scan = await new AxeBuilder({ page })
        .include('.entity-panel')
        .withRules(['color-contrast'])
        .analyze();
      expect(scan.violations, route).toEqual([]);
    }
    await page.goto('/en');
    await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
    await page.getByRole('tab', { name: 'Go deeper', exact: true }).click();
    await expect(page.locator('.entity-panel .reference-list').first()).toBeVisible();
    await page.getByRole('tab', { name: 'Why it matters', exact: true }).click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    expect(errors).toEqual([]);
    const path = testInfo.outputPath(`palette-${theme}.png`);
    await page.screenshot({ path, fullPage: true });
    await testInfo.attach('palette-overview', { path, contentType: 'image/png' });
  });
}
