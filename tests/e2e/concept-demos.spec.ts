import { expect, test, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { entities } from '../../content';
import { conceptDemoCopy } from '../../content/translations/concept-demos';
import type { ConceptDemoKind } from '../../types/history';

const result = (dialog: Locator, label: string) =>
  dialog
    .locator('.scidemo-result > div')
    .filter({ has: dialog.page().getByText(label, { exact: true }) })
    .locator('strong');
async function slide(dialog: Locator, label: string, key: 'Home' | 'End') {
  const slider = dialog.getByRole('slider', { name: label, exact: true });
  await slider.focus();
  await slider.press(key);
}
const scenarios: { kind: ConceptDemoKind; act: (dialog: Locator) => Promise<void> }[] = [
  {
    kind: 'staining',
    act: async (d) => {
      await slide(d, 'Cells stained', 'End');
      await expect(d.locator('.concept-stage g')).toHaveCount(24);
    },
  },
  {
    kind: 'logic',
    act: async (d) => {
      await d.getByRole('button', { name: 'Input B: 0', exact: true }).click();
      await expect(result(d, 'Result')).toHaveText('1');
    },
  },
  {
    kind: 'hebbian',
    act: async (d) => {
      await d.getByRole('button', { name: 'Pair once' }).click();
      await expect(result(d, 'Connection strength')).toHaveText('0.30');
    },
  },
  {
    kind: 'tape',
    act: async (d) => {
      await d.getByRole('button', { name: 'Next step' }).click();
      await expect(result(d, 'Result')).toHaveText('0 0 1 1 0 0');
      await expect(result(d, 'Reading position')).toHaveText('2');
    },
  },
  {
    kind: 'stored-program',
    act: async (d) => {
      await d.getByRole('button', { name: 'MULTIPLY 2', exact: true }).click();
      for (let i = 0; i < 3; i++) await d.getByRole('button', { name: 'Next step' }).click();
      await expect(result(d, 'Output')).toHaveText('6');
      await expect(d.getByRole('button', { name: 'Next step' })).toBeDisabled();
    },
  },
  {
    kind: 'entropy',
    act: async (d) => {
      await slide(d, 'Chance of 1', 'Home');
      await expect(result(d, 'Uncertainty')).toHaveText('0.00 bits / symbol');
    },
  },
  {
    kind: 'feedback',
    act: async (d) => {
      await slide(d, 'Correction strength', 'End');
      await expect(d.locator('svg.concept-stage')).toHaveAttribute(
        'aria-label',
        'Target: 1; Measured value: 0.00',
      );
      await d.getByText('Inspect numerical values', { exact: true }).click();
      await expect(d.getByRole('table').getByRole('row')).toHaveCount(14);
    },
  },
  {
    kind: 'symbolic',
    act: async (d) => {
      await d.getByRole('button', { name: 'Apply one rule round' }).click();
      await expect(result(d, 'Wet ground')).toHaveText('Known');
      await expect(result(d, 'Slippery path')).toHaveText('Unknown');
      await d.getByRole('button', { name: 'Apply one rule round' }).click();
      await expect(result(d, 'Slippery path')).toHaveText('Known');
    },
  },
  {
    kind: 'xor',
    act: async (d) => {
      await d.getByRole('button', { name: 'Input B: 0', exact: true }).click();
      await expect(result(d, 'XOR')).toHaveText('0');
      await expect(result(d, 'Both on')).toHaveText('1');
    },
  },
  {
    kind: 'memory',
    act: async (d) => {
      await expect(result(d, 'Changed pixels')).toHaveText('2');
      await d.getByRole('button', { name: 'Recall one sweep' }).click();
      await expect(result(d, 'Changed pixels')).toHaveText('0');
      await expect(result(d, 'Energy')).toHaveText('-7.50');
    },
  },
  {
    kind: 'sampling',
    act: async (d) => {
      await slide(d, 'Class A share', 'Home');
      await expect(result(d, 'Overall accuracy')).toHaveText('1 %');
      await expect(result(d, 'Class B recall')).toHaveText('0 %');
    },
  },
  {
    kind: 'planning',
    act: async (d) => {
      await slide(d, 'Future weight γ', 'Home');
      await expect(result(d, 'Best path')).toHaveText('Path A');
    },
  },
  {
    kind: 'reward',
    act: async (d) => {
      await d.getByRole('button', { name: 'Update estimate' }).click();
      await expect(result(d, 'Current estimate')).toHaveText('0.63');
      await expect(result(d, 'Prediction error')).toHaveText('0.38');
    },
  },
  {
    kind: 'prediction',
    act: async (d) => {
      await d.getByRole('button', { name: 'Revise prediction' }).click();
      await expect(result(d, 'Prediction error')).toHaveText('0.300');
    },
  },
  {
    kind: 'attention',
    act: async (d) => {
      await slide(d, 'Relevance score A', 'End');
      await expect(result(d, 'Weighted output')).toHaveText('0.670');
    },
  },
  {
    kind: 'masking',
    act: async (d) => {
      await d.getByRole('button', { name: 'Reveal target' }).click();
      await expect(result(d, 'Target')).toHaveText('brain');
      await d.getByRole('button', { name: 'Word 2: curious' }).click();
      await d.getByRole('button', { name: 'Reveal target' }).click();
      await expect(result(d, 'Target')).toHaveText('curious');
    },
  },
  {
    kind: 'geometry',
    act: async (d) => {
      await slide(d, 'Joint angle', 'End');
      await expect(result(d, 'End-to-end distance')).toHaveText('1.99');
    },
  },
  {
    kind: 'transfer',
    act: async (d) => {
      await d.getByRole('combobox', { name: 'Task' }).selectOption('brightness');
      await expect(d.locator('.concept-object-selected').locator('strong')).toHaveText(['C', 'D']);
    },
  },
  {
    kind: 'membrane',
    act: async (d) => {
      await slide(d, 'Sodium conductance', 'End');
      await expect(result(d, 'Equilibrium voltage')).toHaveText('13.18 mV');
    },
  },
];

for (const scenario of scenarios)
  test(`${scenario.kind}: interaction, explanation, reset and responsive dialog`, async ({
    page,
  }) => {
    const entity = entities.find((e) => e.demo === scenario.kind)!;
    await page.goto(`/en/${entity.type}/${entity.slug}`);
    await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', entity.id);
    await page.getByRole('button', { name: 'ƒ Try the idea' }).click();
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: conceptDemoCopy[scenario.kind].title.en, exact: true }),
    ).toBeVisible();
    await expect(dialog.locator('.scidemo-note')).toHaveText(
      conceptDemoCopy[scenario.kind].note.en,
    );
    const initialText = await dialog.locator('.scidemo').textContent();
    await scenario.act(dialog);
    expect(await dialog.locator('.scidemo').textContent()).not.toBe(initialText);
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    if (['memory', 'masking', 'attention'].includes(scenario.kind)) {
      const scan = await new AxeBuilder({ page })
        .include('dialog')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(scan.violations).toEqual([]);
    }
    await dialog.getByRole('button', { name: '↺ Reset', exact: true }).click();
    expect(await dialog.locator('.scidemo').textContent()).toBe(initialText);
  });

for (const locale of ['de', 'es'] as const)
  test(`${locale}: concept lab controls and explanatory text are localized`, async ({ page }) => {
    const entity = entities.find((e) => e.demo === 'attention')!;
    await page.goto(`/${locale}/${entity.type}/${entity.slug}`);
    await page.locator('.demo-button').click();
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: conceptDemoCopy.attention.title[locale], exact: true }),
    ).toBeVisible();
    await expect(dialog.locator('.scidemo-note')).toHaveText(
      conceptDemoCopy.attention.note[locale],
    );
    await expect(dialog.getByRole('slider')).toHaveCount(4);
  });
