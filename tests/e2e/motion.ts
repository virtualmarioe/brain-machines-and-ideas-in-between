import type { Page } from '@playwright/test';
/** Measure resting contrast, including animations suspended inside collapsed views. */
export async function settleMotion(page: Page) {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (
        animation.playbackRate !== 0 &&
        Number.isFinite(animation.effect?.getComputedTiming().endTime)
      ) {
        animation.finish();
      }
    }
  });
}
