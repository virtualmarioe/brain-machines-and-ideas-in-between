import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function noOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
}

test('entry actions lead to guided learning and direct search', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /Follow a learning path/ }).click();
  await expect(page.locator('details.learning-journeys')).toHaveAttribute('open', '');
  await expect(page.locator('.learning-journeys > summary')).toBeFocused();
  await page.getByRole('button', { name: /Find a concept/ }).click();
  await expect(page.locator('.search-field input')).toBeFocused();
  await page.locator('.search-field input').fill('variational autoencoders');
  await expect(page.locator('.search-recovery')).toBeVisible();
  await page.getByRole('button', { name: /Search the full catalog/ }).click();
  await expect(page.locator('.search-results')).toContainText('Variational autoencoders');
  await page
    .locator('.search-results .branch-title')
    .filter({ hasText: 'Variational autoencoders' })
    .click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'vae');
  await expect(page.locator('.research-notice')).toBeVisible();
  await noOverflow(page);
});

test('library opens an existing lab, checks a prediction, resets controls, and restores focus', async ({
  page,
}, info) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /Experiment with an idea/ }).click();
  await expect(page.locator('.experiment-grid article')).toHaveCount(33);
  await page.getByLabel('Search experiments').fill('perceptron');
  await page.getByRole('button', { name: /Open experiment: The perceptron/ }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'perceptron');
  await page.locator('.prediction-checkpoint summary').click();
  await expect(page.getByRole('button', { name: 'Check my prediction' })).toBeDisabled();
  await page.getByRole('radio', { name: 'It decreases.' }).check();
  await page.getByRole('button', { name: 'Check my prediction' }).click();
  await expect(page.locator('.prediction-feedback')).toContainText('Revisit your prediction.');
  await page.getByRole('radio', { name: 'It increases.' }).check();
  await page.getByRole('button', { name: 'Check my prediction' }).click();
  await expect(page.locator('.prediction-feedback')).toContainText('That matches this model.');
  const bias = page.getByRole('slider', { name: 'Bias b' });
  await bias.focus();
  await bias.press('End');
  await expect(bias).toHaveValue('2');
  await page.locator('dialog').getByRole('button', { name: /Reset/ }).click();
  await expect(bias).toHaveValue('0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([]);
  await page.locator('dialog').screenshot({ path: info.outputPath('prediction-lab.png') });
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Experiment with an idea/ })).toBeFocused();
  await noOverflow(page);
});

test('focused reading survives reload and history; recent discoveries can be cleared', async ({
  page,
}, info) => {
  await page.goto('/en/algorithm/perceptron');
  await page.getByRole('button', { name: 'Focus on reading', exact: true }).click();
  await expect(page).toHaveURL(/view=reading/);
  await expect(page.locator('.visualization-column')).toBeHidden();
  await page.reload();
  await expect(page.locator('.visualization-column')).toBeHidden();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'perceptron');
  await page.locator('.entity-panel').screenshot({ path: info.outputPath('focused-reading.png') });
  await page.getByRole('button', { name: 'Return to atlas view' }).click();
  await expect(page.locator('.visualization-column')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.visualization-column')).toBeHidden();
  await page.goto('/en/algorithm/backpropagation');
  await page.locator('.recent-discoveries summary').click();
  await page.locator('.recent-discoveries nav button').filter({ hasText: 'perceptron' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'perceptron');
  await page.getByRole('button', { name: 'Clear history' }).click();
  await expect(page.locator('.recent-discoveries')).toHaveCount(0);
  await noOverflow(page);
});

test('new surfaces reflow in every locale, light and dark, with blocked storage', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Unavailable');
    };
  });
  for (const locale of ['en', 'de', 'es']) {
    await page.goto(`/${locale}`);
    await page.emulateMedia({
      reducedMotion: 'reduce',
      colorScheme: locale === 'de' ? 'dark' : 'light',
    });
    await noOverflow(page);
    expect(
      (await new AxeBuilder({ page }).include('.learning-entry').analyze()).violations,
    ).toEqual([]);
    await page.locator('.learning-entry button').nth(1).click();
    await page.locator('.library-search input').fill('zzzzzz');
    await expect(page.locator('.experiment-grid article')).toHaveCount(0);
    await page.locator('.library-search input').fill('');
    await expect(page.locator('.experiment-grid article')).toHaveCount(33);
    expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([]);
    await page.locator('dialog').screenshot({ path: info.outputPath(`library-${locale}.png`) });
    await noOverflow(page);
    await page.keyboard.press('Escape');
  }
});

test('trace target selection reveals concepts beyond introductory complexity', async ({ page }) => {
  await page.goto('/en');
  await page.locator('.primary-nav').getByRole('button', { name: 'Trace an idea' }).click();
  await page.locator('.trace-banner select').selectOption('vae');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'vae');
  await expect(page).toHaveURL(/level=connections/);
  await page.reload();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'vae');
});

test('experiment URLs restore the lab and Back closes it', async ({ page }) => {
  await page.goto('/en/architecture/transformers');
  await page.locator('.entity-panel .demo-button').click();
  await expect(page).toHaveURL(/lab=1/);
  await expect(page.locator('dialog .scidemo')).toBeVisible();
  await page.goBack();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('dialog .scidemo')).toBeVisible();
  await page.reload();
  await expect(page.locator('dialog .scidemo')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/lab=1/);
});

test('empty focused search retains a way back to the atlas', async ({ page }) => {
  await page.goto('/en?view=reading&q=zzzzzzz');
  await page.getByRole('button', { name: 'Return to atlas view' }).click();
  await expect(page.locator('.learning-entry')).toBeVisible();
  await expect(page).not.toHaveURL(/view=reading/);
});
