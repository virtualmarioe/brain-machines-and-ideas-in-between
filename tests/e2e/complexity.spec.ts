import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('complexity is visible, nested, persistent and keyboard accessible', async ({ page }) => {
  await page.goto('/en');
  const essentials = page.getByRole('button', { name: /1\. Essentials/ });
  const connections = page.getByRole('button', { name: /2\. Connections/ });
  const expert = page.getByRole('button', { name: /3\. Expert/ });
  await expect(essentials).toHaveAttribute('aria-pressed', 'true');
  await expect(essentials).toContainText('20 nodes');
  await page
    .locator('.complexity-control')
    .screenshot({ path: `/tmp/intelligence-atlas-complexity-${test.info().project.name}.png` });
  await expect(expert).toContainText('157 nodes');
  await connections.focus();
  await page.keyboard.press('Enter');
  await expect(connections).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/level=connections/);
  await expert.click();
  await expect(page).toHaveURL(/level=expert/);
  await page.reload();
  await expect(expert).toHaveAttribute('aria-pressed', 'true');
  await expect(expert).toBeEnabled();
  await page.goBack();
  await expect(connections).toHaveAttribute('aria-pressed', 'true');
  await essentials.click();
  await expect(essentials).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  const audit = await new AxeBuilder({ page }).include('.complexity-control').analyze();
  expect(audit.violations).toEqual([]);
});
test('ancient deep links open the expert catalog with date and source caveats', async ({
  page,
}) => {
  await page.goto('/en/concept/aristotelian-syllogistic');
  await expect(page.getByRole('button', { name: /3\. Expert/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.entity-panel')).toHaveAttribute(
    'data-entity-id',
    'aristotelian-syllogistic',
  );
  await expect(page.locator('.entity-year')).toContainText('350 BCE');
  await expect(page.locator('.research-notice')).toContainText('pending source verification');
  await page.locator('.research-notice a').click();
  await expect(page).toHaveURL(/research#c_aristotelian_syllogistic/);
  await expect(page.locator('#c_aristotelian_syllogistic')).toBeVisible();
});
test('research registers support scientist search and links into the atlas', async ({ page }) => {
  await page.goto('/en/research');
  await page.getByLabel('Search people').fill('Thomas Bayes');
  await expect(page.locator('#people tbody tr')).toHaveCount(1);
  await page.locator('#people').getByRole('link', { name: 'Bayesian inference' }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute(
    'data-entity-id',
    'bayesian-inference',
  );
  await expect(page.locator('.entity-panel')).toContainText('1763');
});
test('localized controls identify the original language of research', async ({ page }) => {
  await page.goto('/de/concept/bayesian-inference');
  await expect(page.getByRole('heading', { name: 'Komplexität des Atlas' })).toBeVisible();
  await expect(page.locator('.research-notice')).toContainText('englisches Original');
  await page.goto('/es?level=expert');
  await expect(page.getByRole('button', { name: /3\. Experto/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('research reader stays accessible and scrolls tables inside the mobile viewport', async ({
  page,
}) => {
  await page.goto('/en/research');
  await expect(page.getByLabel('Search concepts')).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await expect(
    page.getByRole('link', { name: 'Download the complete research dossier (.md)' }),
  ).toHaveAttribute('href', '/research/history-2026-10-08.md');
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test('research navigation supports Back and Forward outside atlas history', async ({ page }) => {
  await page.goto('/en?level=connections');
  await expect(page.getByRole('button', { name: /2\. Connections/ })).toBeEnabled();
  await page.getByRole('link', { name: 'Research catalog ↗', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Research catalog', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('button', { name: /2\. Connections/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Research catalog', exact: true })).toBeVisible();
});
