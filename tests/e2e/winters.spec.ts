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
    await expect(card.locator('.winter-flake')).toHaveCount(70);
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

test('winter cards retain localized copy and the hover card stays readable', async ({
  page,
  isMobile,
}) => {
  for (const [locale, label, learn, heading] of [
    ['de', 'Zweiter KI-Winter', 'Mehr erfahren', 'Die KI-Winter verstehen'],
    ['es', 'Segundo invierno de la IA', 'Más información', 'Entender los inviernos de la IA'],
  ]) {
    await page.goto(`/${locale}?level=connections&from=1950`);
    const trigger = page.getByRole('button', { name: new RegExp(label) });
    if (isMobile) await trigger.tap();
    else await trigger.hover();
    const card = page.getByRole('dialog', { name: label });
    await expect(card).toBeVisible();
    if (!isMobile) await card.hover();
    await expect(card.getByRole('link', { name: learn })).toBeVisible();
    await card.screenshot({ path: test.info().outputPath(`winter-card-${locale}.png`) });
    await card.getByRole('link', { name: learn }).click();
    await expect(page.locator('#winter-guide-heading')).toHaveText(heading);
    await expect(page.locator('#ai-winters-guide')).toHaveAttribute('open');
  }
});

test('each winter bubble points to its label and adds a sparse larger crystal layer', async ({
  page,
}) => {
  await page.goto('/en?from=1950&to=2026');
  for (const label of ['First AI Winter', 'Second AI Winter']) {
    const trigger = page.getByRole('button', { name: new RegExp(label) });
    await trigger.click();
    const card = page.getByRole('dialog', { name: label });
    await expect(card).toBeVisible();
    await expect
      .poll(async () => {
        const bounds = await trigger.locator('[data-preview-anchor]').boundingBox();
        const path = await page.locator('.bubble-tail path').last().getAttribute('d');
        const numbers = path!.match(/-?[\d.]+/g)!.map(Number);
        return Math.hypot(
          numbers[4] - (bounds!.x + bounds!.width / 2),
          numbers[5] - (bounds!.y + bounds!.height / 2),
        );
      })
      .toBeLessThan(2);
    await expect(card.locator('.winter-flake:not(.winter-crystal)')).toHaveCount(28);
    await expect(card.locator('.winter-crystal:not(.winter-crystal-large)')).toHaveCount(28);
    await expect(card.locator('.winter-crystal-large')).toHaveCount(14);
    const layers = await card.evaluate((element) => {
      const regular = element.querySelector<HTMLElement>(
        '.winter-crystal:not(.winter-crystal-large)',
      )!;
      const large = element.querySelector<HTMLElement>('.winter-crystal-large')!;
      return [regular, large].map((particle) => {
        const style = getComputedStyle(particle);
        return {
          size: parseFloat(style.getPropertyValue('--flake-size')),
          duration: style.animationDuration,
          delay: style.animationDelay,
          drift: style.getPropertyValue('--drift'),
        };
      });
    });
    expect(layers[1].size).toBe(layers[0].size * 4);
    expect(parseFloat(layers[1].duration)).toBeGreaterThan(parseFloat(layers[0].duration));
    await expect(card.locator('.winter-crystal-large svg').first()).toHaveCSS(
      'animation-name',
      'winter-crystal-tumble',
    );
    await page.keyboard.press('Escape');
    await expect(card).toHaveCount(0);
  }
});
