import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { entities } from '../../content';
import { distinctKinds } from '../../types/history';
import { distinctCopy } from '../../content/translations/distinct-demos';
import { settleMotion } from './motion';
for (const kind of distinctKinds)
  test(`${kind}: unique interaction and reset`, async ({ page }, info) => {
    const entity = entities.find((e) => e.demo === kind)!;
    await page.goto(`/en/${entity.type}/${entity.slug}`);
    await page.locator('.demo-button').click();
    const d = page.getByRole('dialog');
    await expect(
      d.getByRole('heading', { name: distinctCopy[kind].title[0], exact: true }),
    ).toBeVisible();
    const exercise = d.locator('.distinct-demo');
    const before = await exercise.textContent();
    if (kind === 'digits') await d.getByRole('button', { name: 'Load 1', exact: true }).click();
    else if (kind === 'replay')
      await d.getByRole('button', { name: 'Draw another sample' }).click();
    else {
      await d.getByRole('slider').first().focus();
      await d.getByRole('slider').first().press('End');
    }
    expect(await exercise.textContent()).not.toBe(before);
    if (kind === 'q-update') {
      await d.getByRole('button', { name: 'Apply one update' }).click();
      await expect(exercise).toContainText('0.93');
    }
    if (kind === 'representations') {
      const distances = await d.getByRole('table').textContent();
      await d.getByRole('button', { name: 'Swap model units' }).click();
      expect(await d.getByRole('table').textContent()).toBe(distances);
    }
    expect(await d.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await settleMotion(page);
    const scan = await new AxeBuilder({ page })
      .include('dialog')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(scan.violations).toEqual([]);
    if (['digits', 'orientation', 'representations'].includes(kind))
      await page.screenshot({ path: info.outputPath(`${kind}.png`) });
    await d.getByRole('button', { name: '↺ Reset', exact: true }).click();
    expect(await exercise.textContent()).toBe(before);
  });
test('About page has repository, unassigned DOI, localized text, and return navigation', async ({
  page,
}) => {
  await page.goto('/en');
  await page.locator('footer').getByRole('link', { name: 'About this atlas' }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(
    page.getByRole('link', { name: 'GitHub: brain-machines-and-ideas-in-between' }),
  ).toHaveAttribute('href', 'https://github.com/virtualmarioe/brain-machines-and-ideas-in-between');
  await expect(page.getByText('Zenodo DOI: pending deposit', { exact: true })).toBeVisible();
  await expect(page.locator('a[href*="doi.org"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Deutsch' }).click();
  await expect(page.getByRole('heading', { name: 'Über den Atlas', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page.getByRole('heading', { name: 'Acerca del atlas', exact: true })).toBeVisible();
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.getByRole('link', { name: 'Volver al atlas', exact: false }).click();
  await expect(page).toHaveURL(/\/es$/);
});
