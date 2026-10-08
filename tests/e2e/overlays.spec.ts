import { settleMotion } from './motion';
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function views(page: Page) {
  await page.goto('/en/architecture/neocognitron');
  await expect(page.locator('.entity-panel')).toBeVisible();
  for (const frame of await page.locator('.visualization-frame').all()) {
    if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  }
}
for (const theme of ['light', 'dark']) {
  test(`connection previews show evidence and glass surfaces in ${theme}`, async ({
    page,
  }, testInfo) => {
    await views(page);
    await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
    await page.keyboard.press('Tab');
    const edge = page.locator('.graph-edge [data-edge-id="hubel-neocognitron"]');
    await edge.focus();
    const card = page.locator('[data-preview-kind="edge"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('18 calendar years later');
    await expect(card).toContainText('Supporting sources');
    await expect(card).toContainText('Evidence confidence');
    await expect(edge).toHaveAttribute('aria-describedby', (await card.getAttribute('id'))!);
    await expect(card).toHaveCSS('backdrop-filter', /blur\(3px\)/);
    await expect(card).toHaveCSS('background-image', /radial-gradient.*0\.75.*0\.45/);
    await card.hover();
    await expect(card).toBeVisible();
    const sourceBox = (await edge.boundingBox())!;
    const cardBox = (await card.boundingBox())!;
    expect(
      cardBox.x + cardBox.width <= sourceBox.x ||
        cardBox.x >= sourceBox.x + sourceBox.width ||
        cardBox.y + cardBox.height <= sourceBox.y ||
        cardBox.y >= sourceBox.y + sourceBox.height,
    ).toBe(true);
    await settleMotion(page);
    const scan = await new AxeBuilder({ page })
      .include('[data-preview-kind="edge"]')
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();
    expect(scan.violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`glass-edge-${theme}.png`), fullPage: true });
    await page.keyboard.press('Escape');
    await expect(card).toHaveCount(0);
    await edge.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveClass(/glass-surface/);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByLabel('Show intellectual connections').check();
    await page.keyboard.press('Tab');
    const mapEdge = page.locator('.map-edge [data-edge-id="hubel-neocognitron"]');
    await mapEdge.focus();
    const mapCard = page.locator('[data-preview-kind="map-edge"]');
    await expect(mapCard).toContainText('not travel routes');
    await mapCard.hover();
    await settleMotion(page);
    const mapSource = (await mapEdge.boundingBox())!;
    const mapBubble = (await mapCard.boundingBox())!;
    expect(
      mapBubble.x + mapBubble.width <= mapSource.x ||
        mapBubble.x >= mapSource.x + mapSource.width ||
        mapBubble.y + mapBubble.height <= mapSource.y ||
        mapBubble.y >= mapSource.y + mapSource.height,
    ).toBe(true);
    await expect(page.getByRole('tooltip')).toHaveCount(1);
    await mapEdge.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
  });
}

test('timeline previews show sourced temporal links and clustered periods', async ({
  page,
}, testInfo) => {
  await page.goto('/en/architecture/neocognitron?from=1978&to=1982');
  const marker = page.locator('.time-event[aria-pressed="true"]');
  await marker.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab');
  await marker.focus();
  const card = page.locator('[data-preview-kind="timeline"]');
  await expect(card).toContainText('18 calendar years earlier');
  await expect(card).toContainText('18 calendar years later');
  await expect(card).toContainText('Chronology alone does not establish influence');
  await card.hover();
  await expect(card).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('timeline-preview.png'), fullPage: true });
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Navigate through time: Reset view', exact: true })
    .click();
  const cluster = page.locator('.time-event.clustered').first();
  await page.keyboard.press('Tab');
  await cluster.focus();
  await expect(card).toContainText('grouped for display');
  await cluster.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(card).toHaveCount(0);
});

test('connection curves open on pointer hover and preserve their preview while reading', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Pointer hover applies to desktop; phone keyboard access is covered separately.',
  );
  await views(page);
  const edge = page.locator('.graph-edge [data-edge-id="hubel-neocognitron"]');
  await page.keyboard.press('Tab');
  await edge.focus();
  await edge.scrollIntoViewIfNeeded();
  await page.keyboard.press('Escape');
  const point = await edge.evaluate((element) => {
    const path = element as SVGPathElement;
    for (const fraction of [0.5, 0.7, 0.3, 0.8, 0.2]) {
      const sample = path.getPointAtLength(path.getTotalLength() * fraction);
      const screen = new DOMPoint(sample.x, sample.y).matrixTransform(path.getScreenCTM()!);
      if (document.elementFromPoint(screen.x, screen.y) === path)
        return { x: screen.x, y: screen.y };
    }
    return null;
  });
  expect(point, 'Connection must have a reachable pointer target').not.toBeNull();
  await page.mouse.move(point!.x, point!.y);
  const card = page.locator('[data-preview-kind="edge"]');
  await expect(card).toContainText('Fukushima explicitly cites');
  await card.hover();
  await expect(card).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
});

test('timeline recognition previews are localized and respect reduced transparency', async ({
  page,
}) => {
  for (const locale of ['de', 'es'] as const) {
    await page.goto(`/${locale}?nobel=1`);
    const award = page.locator('.nobel-event').first();
    await award.scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    await award.focus();
    const card = page.locator('[data-preview-kind="timeline"]');
    await expect(card).toContainText(
      locale === 'de' ? 'Kalenderjahre später' : 'años calendario después',
    );
    await expect(card).toContainText('1906');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });
    await expect(card).toHaveCSS('backdrop-filter', 'none');
    await cdp.detach();
    await page.keyboard.press('Escape');
  }
});

test('People category persists and resets when selecting a non-person connection', async ({
  page,
}) => {
  await views(page);
  await page.getByLabel('Node category', { exact: true }).selectOption('person');
  await expect(page.locator('.graph-node')).toHaveCount(3);
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'cajal');
  await expect(page).toHaveURL(/category=person/);
  await page.reload();
  await expect(page.getByLabel('Node category', { exact: true })).toHaveValue('person');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'cajal');
  await page.locator('.entity-connections button').filter({ hasText: 'neuron doctrine' }).click();
  await expect(page.getByLabel('Node category', { exact: true })).toHaveValue('all');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'neuron-doctrine');
});
