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

test('neuroscience journey follows all seven dated papers and restores its final stop', async ({
  page,
}) => {
  const milestones = [
    ['adrian-rate-coding', '1926'],
    ['hartline-receptive-fields', '1940'],
    ['hubel-wiesel-1959', '1959'],
    ['barlow-hill-direction', '1963'],
    ['okeefe-dostrovsky-place', '1971'],
    ['desimone-gross-faces', '1984'],
    ['hafting-moser-grid', '2005'],
  ];
  for (const [locale, title, next] of [
    ['en', 'Neuroscience:', 'Next stop'],
    ['de', 'Neurowissenschaft:', 'Nächste Station'],
    ['es', 'Neurociencia:', 'Siguiente parada'],
  ]) {
    await page.goto(`/${locale}`);
    await page.locator('.learning-journeys > summary').click();
    await page
      .locator('.learning-journey-options article')
      .filter({ hasText: title })
      .getByRole('button')
      .click();
    const journey = page.locator('.learning-journey-active');
    await expect(journey.locator('ol > li')).toHaveCount(7);
    for (const [index, [id, year]] of milestones.entries()) {
      await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', id);
      await expect(journey.locator('.journey-paper')).toContainText(year);
      await expect(journey.locator('.journey-paper a')).toHaveAttribute(
        'href',
        /^https:\/\/doi.org\//,
      );
      await expect(journey.locator('[aria-current="step"]')).toContainText(year);
      if (index < milestones.length - 1) await journey.getByRole('button', { name: next }).click();
    }
    await page.reload();
    await expect(page).toHaveURL(/step=6/);
    await expect(page.locator('.entity-panel')).toHaveAttribute(
      'data-entity-id',
      'hafting-moser-grid',
    );
    await expect(journey.locator('.journey-award')).toContainText('2014');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    if (locale === 'en') {
      const audit = await new AxeBuilder({ page }).include('.learning-journey-active').analyze();
      expect(audit.violations).toEqual([]);
      await journey.screenshot({ path: test.info().outputPath('neuroscience-path.png') });
    }
  }
});
