import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(resolve('packages/react-components/package.json'));
const { chromium } = require('playwright');
const zip = resolve(process.argv[2] || '');
assert(process.argv[2], 'Usage: smoke-toolkit-zip.mjs <staged-toolkit-zip>');
const { version } = JSON.parse(readFileSync('packages/toolkit/package.json', 'utf8'));
const entries = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).trim().split('\n');
assert(entries.every(entry => !entry.startsWith('/') && !entry.split('/').includes('..')), 'Unsafe ZIP paths');
const extracted = mkdtempSync(join(tmpdir(), 'ofh-toolkit-zip-'));
let browser;
try {
  execFileSync('unzip', ['-q', zip, '-d', extracted]);
  const css = `css/ofh-design-system-toolkit-${version}.min.css`;
  const js = `js/ofh-design-system-toolkit-${version}.min.js`;
  for (const path of [css, js, 'assets/icons/icon-sprite.svg']) {
    assert(statSync(join(extracted, path)).size > 0, `Missing or empty ZIP asset: ${path}`);
  }
  // This bundle uses a font stack; it does not ship font files. Any local CSS
  // font or image URLs introduced later must resolve in the ZIP, checked below.
  assert(entries.some(entry => /\.(png|jpe?g|svg)$/.test(entry)), 'ZIP has no images');
  for (const path of entries.filter(entry => entry.endsWith('.css'))) {
    const content = readFileSync(join(extracted, path), 'utf8');
    for (const match of content.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
      const url = match[1];
      if (/^(data:|https?:|\/\/|#)/.test(url)) continue;
      assert(existsSync(resolve(extracted, dirname(path), url.split(/[?#]/)[0])), `Unresolved CSS asset ${url} in ${path}`);
    }
  }
  const html = `<!doctype html><html lang="en"><title>ZIP consumer</title>
    <link rel="stylesheet" href="./${css}"><script defer src="./${js}"></script>
    <div class="ofh-card ofh-card--clickable"><a class="ofh-card__link" href="#clicked">Card link</a><p id="card-body">Card body</p></div>
    <button class="ofh-button ofh-button--contained">Continue</button></html>`;
  const consumer = join(extracted, 'smoke-consumer.html');
  writeFileSync(consumer, html);
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto(pathToFileURL(consumer).href, { waitUntil: 'networkidle' });
  const display = await page.locator('.ofh-button').evaluate(element => getComputedStyle(element).display);
  assert.equal(display, 'inline-block', 'Compiled button styling did not load');
  const radius = await page.locator('.ofh-button').evaluate(element => getComputedStyle(element).borderRadius);
  assert.equal(radius, '8px', 'Compiled button token styling did not load');
  await page.locator('#card-body').click();
  assert(new URL(page.url()).hash === '#clicked', 'Compiled toolkit JavaScript did not initialise the clickable card');
  assert.deepEqual(errors, [], 'Compiled ZIP page has runtime or asset errors');
  process.stdout.write('Extracted toolkit ZIP passed asset, CSS, and JavaScript consumer checks\n');
} finally {
  if (browser) await browser.close();
  rmSync(extracted, { recursive: true, force: true });
}
