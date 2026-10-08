import { test, expect } from '@playwright/test';
import { settleMotion } from './motion';

for (const theme of ['light', 'dark']) {
  test(`map cluster cards share the overlay material in ${theme}`, async ({
    page,
    isMobile,
  }, info) => {
    await page.goto('/en/architecture/neocognitron');
    for (const frame of await page.locator('.visualization-frame').all()) {
      if (isMobile) await expect(frame).toHaveJSProperty('open', false);
      if ((await frame.getAttribute('open')) === null)
        await frame.locator(':scope > summary').click();
    }
    await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
    const node = page.locator('.graph-node[aria-pressed="true"]');
    await node.scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    await node.focus();
    const normal = page.locator('[data-preview-kind="graph"]');
    await expect(normal).toBeVisible();
    await settleMotion(page);
    const material = await normal.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundImage, blur: style.backdropFilter };
    });
    expect(material.background).toContain('0.75');
    expect(material.background).toContain('0.45');
    await page.keyboard.press('Escape');
    const marker = page.locator('.map-city').first();
    await marker.scrollIntoViewIfNeeded();
    await marker.focus();
    const cluster = page.locator('[data-preview-kind="map-cluster"]');
    await expect(cluster).toBeVisible();
    await settleMotion(page);
    for (const card of await cluster.locator('.glass-surface').all()) {
      await expect(card).toHaveCSS('background-image', material.background);
      await expect(card).toHaveCSS('backdrop-filter', material.blur);
    }
    // Retained ancestor opacity animations isolate nested backdrop filters even at opacity 1.
    expect(
      await cluster.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) =>
            (animation.effect as KeyframeEffect).getKeyframes().some((frame) => 'opacity' in frame),
          ),
      ),
    ).toBe(false);
    await page.screenshot({ path: info.outputPath(`glass-${theme}.png`) });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });
    await expect(cluster.locator('article').first()).toHaveCSS('background-image', 'none');
    await expect(cluster.locator('article').first()).toHaveCSS('backdrop-filter', 'none');
    await cdp.detach();
  });
}
