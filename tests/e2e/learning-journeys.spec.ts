import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('guided journeys synchronize discoveries and preserve progress across reload and history', async ({
  page,
}) => {
  await page.goto('/en');
  await page.locator('.learning-journeys > summary').click();
  await page
    .locator('.learning-journey-options article')
    .filter({ hasText: 'Rules versus learning' })
    .getByRole('button')
    .click();
  await expect(page.locator('.learning-journey-active')).toBeVisible();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'mcculloch-pitts');
  await expect(page).toHaveURL(/journey=rules-and-learning/);
  await expect(page.getByRole('button', { name: /2\. Connections/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Next stop' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'logic-theorist');
  await expect(page).toHaveURL(/step=1/);
  await page.reload();
  await expect(page.locator('.learning-journey-active [aria-current]')).toContainText('2.');
  await page.getByRole('button', { name: 'Next stop' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'expert-systems');
  await page.goBack();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'logic-theorist');
  await page.locator('.journey-reflection summary').click();
  await expect(page.locator('.journey-reflection')).toContainText('efficiently choosing');
  const audit = await new AxeBuilder({ page }).include('.learning-journey-active').analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole('button', { name: 'Leave journey' }).click();
  await expect(page).not.toHaveURL(/journey=/);
});

test('reading depth follows complexity and graph spacing is explicitly explained', async ({
  page,
}) => {
  for (const [level, tab] of [
    ['essentials', 'Why it matters'],
    ['connections', 'Understand the idea'],
    ['expert', 'Go deeper'],
  ]) {
    await page.goto(`/en/architecture/neocognitron?level=${level}`);
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.reading-level-note')).toHaveAttribute('data-reading-level', level);
    for (const frame of await page.locator('.visualization-frame').all()) {
      if ((await frame.getAttribute('open')) === null)
        await frame.locator('summary').first().click();
    }
    await expect(page.locator('.graph-chronology-note')).toContainText(
      'not a proportional time scale',
    );
    await expect(page.locator('.graph-chronology-note a')).toHaveAttribute(
      'href',
      '#timeline-view',
    );
  }
});

test('review queue separates checked claims from unresolved historical claims', async ({
  page,
}) => {
  await page.goto('/en/research');
  await page.getByLabel('Verification filter').selectOption('checked');
  await expect(page.locator('.research-audit > ul > li')).toHaveCount(16);
  await page
    .locator('.research-audit > ul > li')
    .filter({ hasText: 'Variational autoencoders' })
    .getByRole('link', { name: 'Variational autoencoders' })
    .click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'vae');
  await expect(page.locator('.entity-panel .research-source-check')).toContainText(
    'One claim checked',
  );
  await page.locator('.research-source-check summary').click();
  await expect(page.locator('.research-source-check')).toContainText('not sole priority');
  await expect(page.locator('.entity-panel > .entity-reading > .verification')).toContainText(
    'Needs review',
  );
});
