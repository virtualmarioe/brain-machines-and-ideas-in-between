import { expect, test } from '@playwright/test';

test('visualization content stays inside its sections at phone, desktop and ultrawide widths', async ({
  page,
}, testInfo) => {
  const widths = testInfo.project.name.startsWith('phone')
    ? [390, 650]
    : [768, 1440, 1920, 2560, 3440];

  for (const width of widths) {
    await test.step(`${width}px wide`, async () => {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto('/en/architecture/neocognitron?from=1870&to=2026');
      await expect(page.locator('.entity-panel')).toBeVisible();
      for (const frame of await page.locator('.visualization-frame').all()) {
        if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
      }
      await expect(page.locator('.world-map')).toBeVisible();

      const bounds = await page.evaluate(() => {
        const rect = (selector: string) => {
          const box = document.querySelector(selector)!.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, height: box.height };
        };
        return {
          graph: rect('.graph-section'),
          graphCanvas: rect('.graph-canvas'),
          graphOverview: rect('.graph-overview'),
          graphLegend: rect('.graph-legend'),
          map: rect('.map-section'),
          mapCanvas: rect('.world-map'),
          mapCaption: rect('.map-caption'),
          workspace: rect('.atlas-workspace'),
          timeline: rect('.timeline-section'),
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });
      await testInfo.attach(`layout-${width}px`, {
        body: JSON.stringify(bounds, null, 2),
        contentType: 'application/json',
      });

      expect(bounds.graphCanvas.height).toBeGreaterThan(200);
      expect(bounds.mapCanvas.height).toBeGreaterThanOrEqual(200);
      expect(bounds.graphCanvas.top).toBeGreaterThanOrEqual(bounds.graph.top);
      expect(bounds.graphCanvas.bottom).toBeLessThanOrEqual(bounds.graph.bottom + 1);
      expect(bounds.graphCanvas.bottom).toBeLessThanOrEqual(bounds.graphOverview.top + 1);
      expect(bounds.graphOverview.bottom).toBeLessThanOrEqual(bounds.graphLegend.top + 1);
      expect(bounds.graphLegend.bottom).toBeLessThanOrEqual(bounds.graph.bottom + 1);
      expect(bounds.graph.bottom).toBeLessThanOrEqual(bounds.map.top + 1);
      expect(bounds.mapCanvas.top).toBeGreaterThanOrEqual(bounds.map.top);
      expect(bounds.mapCanvas.bottom).toBeLessThanOrEqual(bounds.mapCaption.top + 1);
      expect(bounds.mapCaption.bottom).toBeLessThanOrEqual(bounds.map.bottom + 1);
      expect(bounds.map.bottom).toBeLessThanOrEqual(bounds.workspace.bottom + 1);
      expect(bounds.pageWidth).toBeLessThanOrEqual(bounds.viewportWidth + 1);
      if (width > 650) expect(bounds.workspace.bottom).toBeLessThanOrEqual(bounds.timeline.top + 1);
      else expect(bounds.timeline.bottom).toBeLessThanOrEqual(bounds.workspace.top + 1);
      if (width === 1920) {
        await page.screenshot({
          path: testInfo.outputPath('atlas-wide.png'),
          fullPage: true,
          animations: 'disabled',
        });
      }
      if (width === 3440) {
        const path = testInfo.outputPath('ultrawide-layout.png');
        await page.screenshot({ path, fullPage: true, animations: 'disabled' });
        await testInfo.attach('ultrawide-layout', { path, contentType: 'image/png' });
      }
    });
  }
});
