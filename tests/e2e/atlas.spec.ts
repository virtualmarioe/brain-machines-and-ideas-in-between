import { settleMotion } from './motion';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openAtlas(page: Page, path = '/en') {
  await page.goto(path);
  await expect(page.locator('.entity-panel')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Intelligence, connected.', exact: true }),
  ).toBeVisible();
}

async function openVisualizations(page: Page) {
  const frames = page.locator('.visualization-frame');
  for (const frame of await frames.all()) {
    if ((await frame.getAttribute('open')) === null) await frame.locator('summary').click();
  }
}

async function screenshot(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  await testInfo.attach(name, { path, contentType: 'image/png' });
}

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
}

async function expectDialogAccessibility(page: Page, testInfo: TestInfo) {
  await settleMotion(page);
  const scan = await new AxeBuilder({ page })
    .include('dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await testInfo.attach('dialog-accessibility', {
    body: JSON.stringify(scan.violations, null, 2),
    contentType: 'application/json',
  });
  expect(scan.violations).toEqual([]);
}

async function moveRange(slider: Locator, value: number) {
  const minimum = Number(await slider.getAttribute('min'));
  const maximum = Number(await slider.getAttribute('max'));
  const fromMinimum = value - minimum <= maximum - value;
  await slider.focus();
  await slider.press(fromMinimum ? 'Home' : 'End');
  for (let i = 0; i < (fromMinimum ? value - minimum : maximum - value); i += 1)
    await slider.press(fromMinimum ? 'ArrowRight' : 'ArrowLeft');
  await expect(slider).toHaveValue(String(value));
}

async function expectSynchronizedSelection(page: Page, id: string, title: RegExp) {
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', id);
  await expect(page.locator('.entity-panel').getByRole('heading', { name: title })).toBeVisible();
  await expect(page.locator('.map-section')).toHaveAttribute('data-selected', id);
  await expect(page.locator('.graph-node[aria-pressed="true"]')).toHaveAttribute(
    'aria-label',
    title,
  );
  await expect(page.locator('.time-event[aria-pressed="true"]')).toHaveAttribute(
    'aria-label',
    title,
  );
}

test('graph keyboard selection synchronizes the map, timeline, details and route', async ({
  page,
}, testInfo) => {
  await openAtlas(page);
  await openVisualizations(page);
  await expectSynchronizedSelection(page, 'hubel-wiesel', /Hubel|visual cortex/i);
  const target = page.locator('.graph-node').filter({ hasText: 'Neocognitron' });
  await target.focus();
  await target.press('Enter');
  await expectSynchronizedSelection(page, 'neocognitron', /Neocognitron/i);
  await expect(page).toHaveURL(/\/en\/architecture\/neocognitron$/);
  await expect(page.locator('.map-section')).toContainText(/Tokyo|NHK/);
  await page.getByRole('tab', { name: 'Understand the idea', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Fukushima');
  await page.getByRole('tab', { name: 'Go deeper', exact: true }).click();
  await expect(page.locator('.entity-panel .reference-list a').first()).toHaveAttribute(
    'href',
    /^https?:\/\//,
  );
  await expectNoOverflow(page);
  await screenshot(page, testInfo, 'selected-neocognitron');
});

test('timeline markers expose clustered discoveries for individual selection', async ({ page }) => {
  await openAtlas(page);
  await page.locator('.time-event[aria-label*="Ramón y Cajal"]').click();
  const dialog = page.getByRole('dialog');
  if (await dialog.count()) await dialog.getByRole('button', { name: /Ramón y Cajal/ }).click();
  await expectSynchronizedSelection(page, 'cajal', /Ramón y Cajal/);
  await expect(dialog).toHaveCount(0);
});

test('language changes retain selection and exploration state through reload', async ({ page }) => {
  await openAtlas(
    page,
    '/en/architecture/alexnet?from=1900&to=2020&scope=ancestry&nobel=1&context=1',
  );
  await page.getByLabel('Language', { exact: true }).selectOption('de');
  await expect(
    page.getByRole('heading', { name: 'Intelligenz, verbunden.', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/de\/architecture\/alexnet\?/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'alexnet');
  await expect(page.getByLabel('Ab Jahr', { exact: true })).toHaveValue('1900');
  await expect(page.getByLabel('Bis Jahr', { exact: true })).toHaveValue('2020');
  await expect(page.getByRole('checkbox', { name: /Nobel-Meilensteine/ })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: /Historischer Kontext/ })).toBeChecked();
  expect(new URL(page.url()).searchParams.get('scope')).toBe('ancestry');
  await page.getByLabel('Sprache', { exact: true }).selectOption('es');
  await expect(
    page.getByRole('heading', { name: 'Inteligencia, conectada.', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'alexnet');
  await expect(page.getByLabel('Desde el año', { exact: true })).toHaveValue('1900');
});

test('appearance preferences persist and system theme follows the OS with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await openAtlas(page);
  await page.getByLabel('Appearance', { exact: true }).selectOption('system');
  const darkBackground = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByLabel('Appearance', { exact: true }).selectOption('light');
  await page.reload();
  await expect(page.getByLabel('Appearance', { exact: true })).toHaveValue('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const lightBackground = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(lightBackground).not.toBe(darkBackground);
  await page.getByLabel('Appearance', { exact: true }).selectOption('dark');
  await page.reload();
  await expect(page.getByLabel('Appearance', { exact: true })).toHaveValue('dark');
  await expect(page.locator('body')).toHaveCSS('background-color', darkBackground);
  await page.getByLabel('Appearance', { exact: true }).selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('body')).toHaveCSS('background-color', lightBackground);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('body')).toHaveCSS('background-color', darkBackground);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  expect(await page.evaluate(() => localStorage.getItem('atlas-theme'))).toBe('system');
});

test('search, disciplines and time range filter the shared visualizations', async ({ page }) => {
  await openAtlas(page);
  const search = page.getByRole('searchbox', { name: 'Search the atlas' });
  await search.fill('ramon cajal');
  await expect(page.locator('.graph-node[aria-label*="Ramón y Cajal"]')).toHaveCount(1);
  await expect(page.locator('.entity-panel')).toContainText(/Cajal/);
  await search.fill('this-query-has-no-results-825');
  await expect(
    page.getByRole('heading', { name: 'No discoveries match these filters.' }),
  ).toBeVisible();
  await expect(page.locator('.map-section')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await page
    .locator('.domain-filters')
    .getByRole('button', { name: /^Neuroscience/ })
    .click();
  await expect(page.locator('.graph-node:not(.domain-neuroscience)')).toHaveCount(0);
  expect(await page.locator('.graph-node').count()).toBeGreaterThan(0);
  await page
    .locator('.domain-filters')
    .getByRole('button', { name: /All disciplines/ })
    .click();
  await moveRange(page.getByRole('slider', { name: 'From year', exact: true }), 1950);
  await moveRange(page.getByRole('slider', { name: 'To year', exact: true }), 1980);
  const graphYears = await page
    .locator('.graph-node')
    .evaluateAll((nodes) =>
      nodes.map((node) => Number(node.getAttribute('aria-label')?.match(/, (\d{4}),/)?.[1])),
    );
  expect(graphYears.length).toBeGreaterThan(0);
  expect(graphYears.every((year) => year >= 1950 && year <= 1980)).toBe(true);
  await expect(page.locator('.map-pin[aria-label*="Cajal"]')).toHaveCount(0);
  await expect(page.locator('.map-pin[aria-label*="AlexNet"]')).toHaveCount(0);
  const selectedId = await page.locator('.entity-panel').getAttribute('data-entity-id');
  expect(selectedId).toBeTruthy();
  await expect(page.locator('.map-section')).toHaveAttribute('data-selected', selectedId!);
  await expect(page.locator('.time-event[aria-pressed="true"]')).toHaveCount(1);
  expect(new URL(page.url()).searchParams.get('from')).toBe('1950');
  expect(new URL(page.url()).searchParams.get('to')).toBe('1980');
  await page
    .getByRole('button', { name: 'Navigate through time: Reset view', exact: true })
    .click();
  await expect(page.getByRole('slider', { name: 'From year', exact: true })).toHaveValue('1870');
  await expect(page.getByRole('slider', { name: 'To year', exact: true })).toHaveValue('2026');
});

test('story chapters and trace ancestry work with historical layers', async ({ page }) => {
  await openAtlas(page);
  await page.getByRole('button', { name: 'Begin the story', exact: true }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'golgi');
  await expect(page.locator('.story-banner')).toContainText('CHAPTER 01');
  await page.getByRole('button', { name: 'Next chapter', exact: false }).click();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'cajal');
  await page.getByRole('button', { name: 'Trace an idea', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Trace back from', exact: true })
    .selectOption('alexnet');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'alexnet');
  await expect(page.locator('.graph-node[aria-label*="Neocognitron"]')).toHaveCount(1);
  await expect(page.locator('.graph-node[aria-label*="LeNet"]')).toHaveCount(1);
  await expect(page.locator('.graph-node[aria-label*="visual cortex"]')).toHaveCount(1);
  await page.getByRole('checkbox', { name: /Historical context/ }).check();
  await page.getByRole('checkbox', { name: /Nobel landmarks/ }).check();
  expect(await page.locator('.nobel-event').count()).toBeGreaterThan(0);
  expect(new URL(page.url()).searchParams.get('mode')).toBe('trace');
  expect(new URL(page.url()).searchParams.get('context')).toBe('1');
  expect(new URL(page.url()).searchParams.get('nobel')).toBe('1');
});

test('trace alias routes retain their target through browser history', async ({ page }) => {
  await openAtlas(page, '/en/trace/convolution');
  await openVisualizations(page);
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'lenet');
  await expect(page.locator('.trace-banner')).toBeVisible();
  const ancestor = page.locator('.graph-node[aria-label*="Neocognitron"]');
  await ancestor.focus();
  await ancestor.press('Enter');
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'neocognitron');
  await page.goBack();
  await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'lenet');
  await expect(page.locator('.trace-banner')).toBeVisible();
});

test('the brand returns filtered trace state to full exploration in one update', async ({
  page,
}) => {
  await openAtlas(
    page,
    '/en/architecture/alexnet?mode=trace&q=AlexNet&from=2000&to=2020&scope=ancestry',
  );
  await expect(page.locator('.graph-node')).toHaveCount(1);
  await page.getByRole('link', { name: /^The Intelligence Atlas/ }).click();
  await expect(page.getByRole('searchbox', { name: 'Search the atlas' })).toHaveValue('');
  await expect(page.getByRole('slider', { name: 'From year', exact: true })).toHaveValue('1870');
  await expect(page.getByRole('slider', { name: 'To year', exact: true })).toHaveValue('2026');
  await expect(page.locator('.trace-banner')).toHaveCount(0);
  expect(Number.parseInt(await page.locator('.result-count').innerText(), 10)).toBeGreaterThan(5);
  const params = new URL(page.url()).searchParams;
  for (const key of ['mode', 'q', 'from', 'to', 'scope']) expect(params.has(key)).toBe(false);
});

test('perceptron controls calculate a new decision and Escape restores focus', async ({
  page,
}, testInfo) => {
  await openAtlas(page, '/en/algorithm/perceptron');
  const trigger = page.getByRole('button', { name: 'ƒ Try the idea' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'Where does the decision change?' }),
  ).toBeVisible();
  const weight = dialog.getByRole('slider', { name: 'Weight w₁', exact: true });
  const before = await dialog.locator('.scidemo-result').innerText();
  await weight.focus();
  await weight.press('Home');
  await expect(weight).toHaveValue('-2');
  expect(await dialog.locator('.scidemo-result').innerText()).not.toBe(before);
  await expectNoOverflow(page);
  await screenshot(page, testInfo, 'perceptron-demo');
  await expectDialogAccessibility(page, testInfo);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('convolution responds to stimulus, filter and patch changes', async ({ page }, testInfo) => {
  await openAtlas(page, '/en/experiment/hubel-wiesel');
  await page.getByRole('button', { name: 'ƒ Try the idea' }).click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'What makes a pattern stand out?' }),
  ).toBeVisible();
  const initial = await dialog.locator('.scidemo-result').innerText();
  const angle = dialog.getByRole('slider', { name: 'Stimulus angle' });
  await angle.focus();
  await angle.press('Home');
  expect(await dialog.locator('.scidemo-result').innerText()).not.toBe(initial);
  await dialog.getByRole('combobox', { name: 'Filter', exact: true }).selectOption('horizontal');
  await dialog.getByRole('button', { name: /^Row 1, Column 1:/ }).click();
  await expect(dialog.locator('.scidemo-result')).toContainText('Row 1, Column 1');
  await dialog.getByText('Inspect numerical values', { exact: true }).click();
  await expect(dialog.getByRole('table')).toHaveCount(2);
  await expectNoOverflow(page);
  await screenshot(page, testInfo, 'convolution-demo');
  await expectDialogAccessibility(page, testInfo);
  await expect(dialog).toBeVisible();
});

test('backpropagation training lowers loss and reset restores the initial network', async ({
  page,
}, testInfo) => {
  await openAtlas(page, '/en/algorithm/backpropagation');
  await page.getByRole('button', { name: 'ƒ Try the idea' }).click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'Let the error change the weights.' }),
  ).toBeVisible();
  const loss = dialog
    .locator('.scidemo-result > div')
    .filter({ has: page.getByText('Loss', { exact: true }) })
    .locator('strong');
  const initial = Number(await loss.innerText());
  await dialog.getByRole('button', { name: 'Train 10 steps', exact: true }).click();
  expect(Number(await loss.innerText())).toBeLessThan(initial);
  await expect(dialog.locator('.scidemo-loss-figure')).toBeVisible();
  await expectNoOverflow(page);
  await screenshot(page, testInfo, 'backpropagation-demo');
  await expectDialogAccessibility(page, testInfo);
  await dialog.getByRole('button', { name: '↺ Reset', exact: true }).click();
  expect(Number(await loss.innerText())).toBe(initial);
  await expect(dialog.locator('.scidemo-loss-figure')).toHaveCount(0);
});

for (const theme of ['light', 'dark'] as const) {
  test(`WCAG 2.2 AA automated checks and layout in ${theme} theme`, async ({ page }, testInfo) => {
    await openAtlas(page);
    await page.getByLabel('Appearance', { exact: true }).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expectNoOverflow(page);
    await screenshot(page, testInfo, `atlas-${theme}`);
    await settleMotion(page);
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await testInfo.attach(`accessibility-${theme}`, {
      body: JSON.stringify(scan.violations, null, 2),
      contentType: 'application/json',
    });
    expect(scan.violations).toEqual([]);
  });
}

test('unsupported locale, type and missing entity routes return 404 pages', async ({ page }) => {
  for (const path of ['/fr', '/en/algorithm/no-such-entity', '/en/person/alexnet']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /Page not found/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'English', exact: true })).toHaveAttribute(
      'href',
      '/en',
    );
  }
});

test('English and German routes hydrate cleanly after direct loads and reloads', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  const hydrationErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|server.rendered|did not match/i.test(message.text()))
      hydrationErrors.push(message.text());
  });
  for (const route of [
    { path: '/en', heading: 'Intelligence, connected.', tab: 'Go deeper' },
    { path: '/de/architecture/alexnet', heading: 'Intelligenz, verbunden.', tab: 'Vertiefen' },
  ]) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading, exact: true })).toBeVisible();
    await page.getByRole('tab', { name: route.tab, exact: true }).click();
    await expect(page.locator('.entity-panel .reference-list').first()).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: route.heading, exact: true })).toBeVisible();
    await page.getByRole('tab', { name: route.tab, exact: true }).click();
    await expect(page.locator('.entity-panel .reference-list').first()).toBeVisible();
  }
  expect(pageErrors).toEqual([]);
  expect(hydrationErrors).toEqual([]);
});

test('server-rendered locale and trace metadata are localized before hydration', async ({
  request,
}) => {
  for (const locale of ['de', 'es']) {
    const response = await request.get(`/${locale}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toMatch(new RegExp(`<html[^>]*lang="${locale}"`));
  }
  for (const route of [
    { locale: 'de', title: 'Idee verfolgen: LeNet lernt Ziffern zu lesen | Atlas der Intelligenz' },
    {
      locale: 'es',
      title: 'Seguir una idea: LeNet aprende a leer dígitos | Atlas de la inteligencia',
    },
  ]) {
    const response = await request.get(`/${route.locale}/trace/convolution`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(new RegExp(`<html[^>]*lang="${route.locale}"`));
    expect(html).toContain(`<title>${route.title}</title>`);
    expect(html).toContain(`/${route.locale}/trace/convolution`);
  }
});

test('selection and language changes synchronize title, metadata and structured data without reload', async ({
  page,
}) => {
  await openAtlas(page, '/en/architecture/alexnet');
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.locator('.time-event[aria-label*="The perceptron learns"]').click();
  const picker = page.getByRole('dialog');
  if (await picker.count())
    await picker.getByRole('button', { name: /The perceptron learns/ }).click();
  for (const locale of ['en', 'es']) {
    if (locale === 'es')
      await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('es');
    await expect(page.locator('.entity-panel')).toHaveAttribute('data-entity-id', 'perceptron');
    const title = await page.locator('.entity-heading h2').innerText();
    const description = await page.locator('.entity-reading > p').first().innerText();
    const documentTitle = `${title} | ${locale === 'en' ? 'The Intelligence Atlas' : 'Atlas de la inteligencia'}`;
    await expect(page).toHaveTitle(documentTitle);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      documentTitle,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      description,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}/algorithm/perceptron$`),
    );
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
      'href',
      /\/de\/algorithm\/perceptron$/,
    );
    const structured = page.locator('script[type="application/ld+json"]');
    await expect(structured).toHaveCount(1);
    expect(JSON.parse((await structured.textContent()) ?? '{}')).toMatchObject({
      '@type': 'Article',
      headline: title,
      description,
      inLanguage: locale,
    });
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
  }
});

test('phone layout prioritizes the timeline and offers focused expandable visualizations', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-chromium');
  await openAtlas(page);
  const frames = page.locator('.visualization-frame');
  await expect(frames).toHaveCount(2);
  for (const frame of await frames.all()) await expect(frame).not.toHaveAttribute('open');
  const timeline = await page.locator('.timeline-section').boundingBox();
  const reading = await page.locator('.entity-panel').boundingBox();
  expect(timeline!.y).toBeLessThan(reading!.y);
  await openVisualizations(page);
  expect(await page.locator('.graph-node').count()).toBeLessThan(7);
  await expect(page.locator('.graph-section')).toBeVisible();
  await expect(page.locator('.map-section')).toBeVisible();
  await expectNoOverflow(page);
});
