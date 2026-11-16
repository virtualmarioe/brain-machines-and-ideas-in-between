import { expect, it } from 'vitest';
import { timelineTicks } from '../lib/timeline-ticks';
it('uses fewer readable calendar labels on narrow tracks without changing the range', () => {
  const phone = timelineTicks(1760, 2026, 300);
  const desktop = timelineTicks(1760, 2026, 1000);
  expect(phone.length).toBeLessThan(desktop.length);
  for (const [index, year] of phone.entries()) {
    expect(year).toBeGreaterThanOrEqual(1760);
    expect(year).toBeLessThanOrEqual(2026);
    if (index) expect(((year - phone[index - 1]) / 266) * 300).toBeGreaterThanOrEqual(64);
  }
});
it('omits a nonexistent calendar year zero and tolerates invalid geometry', () => {
  expect(timelineTicks(-400, 2026, 320)).not.toContain(0);
  expect(timelineTicks(2000, 2004, 1000)).toEqual([2000, 2001, 2002, 2003, 2004]);
  expect(timelineTicks(1, 0, 300)).toEqual([]);
  expect(timelineTicks(1, Number.NaN, 300)).toEqual([]);
  expect(timelineTicks(1760, 2026, Number.NaN).length).toBeLessThanOrEqual(5);
});
