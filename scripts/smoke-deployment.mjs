const origin = new URL(process.argv[2] || 'https://brain-machines-and-ideas-in-between.vercel.app');
if (origin.protocol !== 'https:' || origin.username || origin.password) {
  throw new Error('Provide a public HTTPS origin without credentials.');
}
const routes = ['/en', '/de', '/es', '/en/research', '/en/event/ai-winters?level=connections'];
for (const route of routes) {
  const url = new URL(route, origin.origin);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    const html = await response.text();
    if (!response.ok || !/atlas-shell|research-page/.test(html)) {
      throw new Error(`Unexpected response: HTTP ${response.status}`);
    }
    console.log(`PASS ${response.status} ${url}`);
  } catch (error) {
    console.error(`FAIL ${url}: ${error.message}`);
    process.exitCode = 1;
  }
}
