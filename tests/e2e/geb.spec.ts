import { test, expect } from '@playwright/test';
import { settleMotion } from './motion';

test('GEB and its author have localized routes, evidence, and geographic context', async ({
  page,
}, info) => {
  for (const locale of ['en', 'de', 'es']) {
    await page.goto(`/${locale}/publication/godel-escher-bach`);
    const panel = page.locator('.entity-panel');
    await expect(panel).toHaveAttribute('data-entity-id', 'godel-escher-bach');
    await expect(panel).toContainText('1979');
    await expect(panel).toContainText('1980');
    await expect(panel).toContainText('Johann Sebastian Bach');
    await expect(panel).toContainText('Kurt Gödel');
    await expect(panel).toContainText('Basic Books');
    await settleMotion(page);
    if (locale === 'en') await panel.screenshot({ path: info.outputPath('geb-entry.png') });
    await page.goto(`/${locale}/person/douglas-hofstadter`);
    await expect(panel).toHaveAttribute('data-entity-id', 'douglas-hofstadter');
    await expect(panel).toContainText('Bloomington');
    await expect(panel).toContainText('1979');
  }
});
