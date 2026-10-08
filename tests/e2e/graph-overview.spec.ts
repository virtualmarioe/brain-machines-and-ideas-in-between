import { expect, test } from '@playwright/test';

test('graph overview navigates to both ends and fits every node without changing selection', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name.startsWith('phone'),
    'Full corpus navigation uses the desktop graph.',
  );
  await page.goto('/en');
  const slider = page.getByRole('slider', { name: 'Graph position', exact: true });
  const selection = await page.locator('.entity-panel').getAttribute('data-entity-id');
  await expect(slider).toBeVisible();
  await slider.focus();
  await slider.press('Home');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
  const window = page.locator('.overview-window');
  const firstX = Number(await window.getAttribute('x'));
  await slider.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '100');
  expect(Number(await window.getAttribute('x'))).toBeGreaterThan(firstX);
  const last = page.locator('.graph-node').last();
  const canvas = page.locator('.graph-canvas');
  const lastRect = await last.boundingBox();
  const canvasRect = await canvas.boundingBox();
  expect(lastRect!.x).toBeGreaterThanOrEqual(canvasRect!.x);
  expect(lastRect!.x + lastRect!.width).toBeLessThanOrEqual(canvasRect!.x + canvasRect!.width + 1);

  const strip = await slider.boundingBox();
  await slider.click({ position: { x: strip!.width * 0.2, y: strip!.height / 2 } });
  expect(Number(await slider.getAttribute('aria-valuenow'))).toBeLessThan(50);
  const before = Number(await slider.getAttribute('aria-valuenow'));
  const rect = await window.boundingBox();
  await page.mouse.move(rect!.x + rect!.width / 2, rect!.y + rect!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    rect!.x + rect!.width / 2 + strip!.width * 0.2,
    rect!.y + rect!.height / 2,
    { steps: 8 },
  );
  await page.mouse.up();
  expect(Number(await slider.getAttribute('aria-valuenow'))).toBeGreaterThan(before);

  await page.getByRole('button', { name: 'Show all ideas', exact: true }).click();
  const allInView = await page.locator('.graph-node').evaluateAll((nodes) => {
    const view = document.querySelector('.graph-canvas')!.getBoundingClientRect();
    return nodes.every((node) => {
      const rect = node.getBoundingClientRect();
      return (
        rect.left >= view.left - 1 &&
        rect.right <= view.right + 1 &&
        rect.top >= view.top - 1 &&
        rect.bottom <= view.bottom + 1
      );
    });
  });
  expect(allInView).toBe(true);
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', selection!);
  await expect(page.getByRole('button', { name: 'Pan graph left', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Pan graph right', exact: true })).toBeDisabled();
});

test('the graph overview remains usable after filtering and on compact screens', async ({
  page,
}) => {
  await page.goto('/en/architecture/neocognitron');
  await expect(page.locator('.entity-panel')).toBeVisible();
  const frame = page.locator('.visualization-frame').first();
  if (await frame.locator(':scope > summary').isVisible()) {
    await expect(frame).not.toHaveAttribute('open');
    await frame.locator(':scope > summary').click();
  }
  await expect(page.getByRole('slider', { name: 'Graph position', exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search the atlas' }).fill('NHK');
  await expect(page.locator('.graph-node')).toHaveCount(1);
  await page.getByRole('button', { name: 'Show all ideas', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'Graph position', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '0',
  );
  await expect(page.locator('.graph-node')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});
