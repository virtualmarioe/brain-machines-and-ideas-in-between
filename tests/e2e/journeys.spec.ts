import { settleMotion } from './motion';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.setTimeout(25000);

test('Story detours preserve the chapter through Trace, reload, and return', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Begin the story', exact: true }).click();
  await page.getByRole('button', { name: 'Next chapter' }).click();
  await page.getByRole('button', { name: 'Trace this idea', exact: true }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'cajal');
  await page.getByRole('button', { name: 'The neuron doctrine', exact: true }).click();
  await expect(page.locator('.visited-path button[aria-current]')).toContainText('neuron doctrine');
  await page.reload();
  await expect(page.locator('.visited-path')).toContainText('Cajal');
  await page.getByRole('button', { name: 'Return to saved chapter', exact: true }).click();
  await expect(page.locator('.story-banner')).toContainText('CHAPTER 02');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'cajal');
});

test('Trace branch evidence and backtracking stay synchronized with the atlas', async ({
  page,
}, info) => {
  await page.goto('/en/architecture/neocognitron?mode=trace');
  await page
    .locator('.trace-branches')
    .getByRole('button', { name: 'LeNet: learning to read digits', exact: true })
    .click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'lenet');
  await expect(page).toHaveURL(/trail=neocognitron%2Clenet/);
  await page
    .locator('.trace-branch')
    .first()
    .getByRole('button', { name: 'Inspect evidence' })
    .click();
  await expect(page.getByRole('dialog')).toContainText('Evidence confidence');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Return to starting idea' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'neocognitron');
  await page.screenshot({
    path: info.outputPath('trace-journey.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('scientist and conceptual searches offer contextual results and direct traces', async ({
  page,
}) => {
  await page.goto('/en');
  await page.getByRole('searchbox').fill('Cajal');
  const results = page.locator('.search-results');
  await expect(results.getByRole('heading', { name: 'People 1' })).toBeVisible();
  await expect(results).toContainText('recorded connections');
  await results.getByRole('button', { name: 'Trace this idea →' }).first().click();
  await expect(page.locator('.trace-journey')).toBeVisible();
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await page.goBack();
  await expect(page.getByRole('searchbox')).toHaveValue('Cajal');
});

test('bubble placement preserves the source and reduced motion removes travel', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/architecture/neocognitron?from=1978&to=1982');
  const marker = page.locator('.time-event[aria-pressed="true"]');
  await marker.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab');
  await marker.focus();
  const card = page.locator('[data-preview-kind="timeline"]');
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS('animation-name', 'none');
  const a = (await marker.boundingBox())!,
    b = (await card.boundingBox())!;
  expect(
    b.x + b.width <= a.x || b.x >= a.x + a.width || b.y + b.height <= a.y || b.y >= a.y + a.height,
  ).toBe(true);
  await expect(page.locator('.bubble-tail')).toBeVisible();
  await expect(card).toHaveCSS('background-color', /0\.68\)/);
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await page.getByRole('tab', { name: 'Understand the idea', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Go deeper', exact: true })).toBeFocused();
});

test('spatial layers explain a receptive field with a 2D and tabular alternative', async ({
  page,
}, info) => {
  await page.goto('/en/architecture/neocognitron');
  await page.locator('.demo-button').click();
  await page.getByText('Explore receptive fields across layers', { exact: true }).click();
  const lab = page.locator('.spatial-lab');
  await expect(lab).toContainText('1 + 3 × (3 − 1) = 7');
  await lab.getByRole('button', { name: 'Spatial layers', exact: true }).click();
  await lab.getByRole('slider', { name: 'Convolution layers', exact: true }).press('End');
  await lab.getByRole('combobox', { name: 'Kernel width', exact: true }).selectOption('5');
  await expect(lab).toContainText('1 + 4 × (5 − 1) = 17');
  await expect(lab.getByRole('table')).toContainText('17 × 17');
  await lab.getByRole('slider', { name: 'Viewing angle', exact: true }).press('ArrowRight');
  await page.screenshot({
    path: info.outputPath('spatial-receptive-field.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await settleMotion(page);
  const scan = await new AxeBuilder({ page })
    .include('.spatial-lab')
    .withTags(['wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  await lab.getByRole('button', { name: 'Reset spatial explanation' }).click();
  await expect(lab.getByRole('button', { name: '2D footprint', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('new exploration controls reflow from 360px through ultrawide screens', async ({
  page,
  isMobile,
}, info) => {
  test.skip(isMobile, 'Explicit viewport sweep runs in the desktop project.');
  for (const width of [360, 390, 768, 1024, 1366, 1440, 1920, 3440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/en/architecture/neocognitron?mode=trace');
    await expect(page.locator('.trace-journey')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    if (width === 1440) {
      await settleMotion(page);
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(scan.violations).toEqual([]);
    }
    if (width === 360 || width === 1920)
      await page.screenshot({
        path: info.outputPath(`journey-${width}.png`),
        fullPage: true,
        animations: 'disabled',
      });
  }
});
