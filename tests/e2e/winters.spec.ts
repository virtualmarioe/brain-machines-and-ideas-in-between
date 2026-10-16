import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('winter cards open a guide adapted to each complexity level', async ({ page }) => {
  for (const level of ['essentials', 'connections', 'expert']) {
    await page.goto(`/en?level=${level}&from=1950&to=2026`);
    const guide = page.locator('#ai-winters-guide');
    await expect(guide).not.toHaveAttribute('open');
    await page.getByRole('button', { name: /First AI Winter/ }).click();
    const card = page.getByRole('dialog', { name: 'First AI Winter' });
    await expect(card).toBeVisible();
    await expect(card.locator('.winter-flake')).toHaveCount(56);
    await expect(card.getByRole('link', { name: 'Learn more' })).toBeFocused();
    await card.getByRole('link', { name: 'Learn more' }).press('Enter');
    await expect(guide).toHaveAttribute('open');
    await expect(page.locator('#winter-guide-heading')).toBeFocused();
    await expect(card).toHaveCount(0);
    await expect(guide).toContainText('Neither period was a uniform worldwide halt');
    await expect(guide.locator('.winter-search-demo')).toHaveCount(level === 'essentials' ? 0 : 1);
    await expect(guide.locator('table')).toHaveCount(level === 'expert' ? 1 : 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test('search demo responds to controls and the linked guide is accessible', async ({ page }) => {
  await page.goto('/en?level=expert#ai-winters-guide');
  const guide = page.locator('#ai-winters-guide');
  await expect(guide).toHaveAttribute('open');
  const demo = guide.locator('.winter-search-demo');
  await expect(demo).toContainText('81');
  await demo.getByRole('slider', { name: /Choices per decision/ }).fill('4');
  await demo.getByRole('slider', { name: /Decisions in a path/ }).fill('5');
  await expect(demo.locator('.winter-demo-result')).toContainText('1,024');
  await expect(demo.locator('.winter-demo-result')).toContainText('4,096');
  const audit = await new AxeBuilder({ page }).include('#ai-winters-guide').analyze();
  expect(audit.violations).toEqual([]);
  await guide.screenshot({ path: test.info().outputPath('winter-guide.png') });
});

test('winter cards retain localized copy and the hover card stays readable', async ({ page }) => {
  for (const [locale, label, learn, heading] of [
    ['de', 'Zweiter KI-Winter', 'Mehr erfahren', 'Die KI-Winter verstehen'],
    ['es', 'Segundo invierno de la IA', 'Más información', 'Entender los inviernos de la IA'],
  ]) {
    await page.goto(`/${locale}?level=connections&from=1950`);
    await page.getByRole('button', { name: new RegExp(label) }).hover();
    const card = page.getByRole('dialog', { name: label });
    await expect(card).toBeVisible();
    await card.hover();
    await expect(card.getByRole('link', { name: learn })).toBeVisible();
    await card.screenshot({ path: test.info().outputPath(`winter-card-${locale}.png`) });
    await card.getByRole('link', { name: learn }).click();
    await expect(page.locator('#winter-guide-heading')).toHaveText(heading);
    await expect(page.locator('#ai-winters-guide')).toHaveAttribute('open');
  }
});
