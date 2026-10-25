import { expect, test } from '@playwright/test';

test('mobile reading tabs keep the selected explanation in view', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile page scrolling regression.');
  await page.goto(
    '/en/experiment/adrian-rate-coding?level=connections&journey=neuroscience-neural-codes&step=0&from=1920',
  );
  await expect(page.getByRole('button', { name: /2\. Connections/ })).toBeEnabled();
  const tabs = page.locator('.depth-tabs');
  await tabs.evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 120,
      behavior: 'instant',
    }),
  );
  for (const name of [
    'Go deeper',
    'Why it matters',
    'Understand the idea',
    'Go deeper',
    'Why it matters',
  ]) {
    const before = await tabs.boundingBox();
    await page.getByRole('tab', { name, exact: true }).click();
    await expect(page.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      (await page.getByRole('tab', { name, exact: true }).getAttribute('id')) as string,
    );
    // Let the content transition and browser scroll anchoring finish.
    await page
      .getByRole('tabpanel')
      .evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
    const after = await tabs.boundingBox();
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(3);
    await expect(page.getByRole('tabpanel')).toBeInViewport();
  }
});
