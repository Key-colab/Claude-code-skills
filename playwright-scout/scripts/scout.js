/** Playwright Scout — 页面侦察模块 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scoutLinks(page) {
  const items = await page.$$('a[href]');
  const results = [];
  for (const item of items) {
    const text = (await item.textContent() || '').trim();
    const href = await item.getAttribute('href');
    results.push({ text, href });
  }
  return results;
}

async function scoutText(page) {
  return await page.evaluate(() => document.body?.innerText || '');
}

async function scoutMeta(page) {
  const meta = {};
  meta.title = await page.title();
  const tags = await page.$$('meta[name], meta[property]');
  for (const tag of tags) {
    const key = (await tag.getAttribute('name')) || (await tag.getAttribute('property'));
    const val = await tag.getAttribute('content');
    if (key && val) meta[key] = val;
  }
  return meta;
}

async function scoutImages(page) {
  const items = await page.$$('img[src]');
  const results = [];
  for (const item of items) {
    const src = await item.getAttribute('src');
    const alt = ((await item.getAttribute('alt')) || '').trim();
    results.push({ src, alt });
  }
  return results;
}

async function scoutTables(page) {
  const tables = await page.$$('table');
  const result = [];
  for (let i = 0; i < tables.length; i++) {
    const rows = [];
    const trs = await tables[i].$$('tr');
    for (const tr of trs) {
      const cells = await tr.$$('td, th');
      const row = [];
      for (const cell of cells) {
        row.push((await cell.textContent()).trim());
      }
      if (row.length) rows.push(row);
    }
    result.push({ index: i, rows });
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : def;
  };

  const url = getArg('url');
  if (!url) {
    console.error('Usage: node scout.js --url <URL> [--mode links|text|meta|images|tables|full] [--output <path>]');
    process.exit(1);
  }

  const mode = getArg('mode', 'full');
  const output = getArg('output', 'D:\\deepseek\\scout_result.json');
  const waitMs = parseInt(getArg('wait', '2000'));

  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(waitMs);

  let data;
  if (mode === 'links') {
    data = { links: await scoutLinks(page) };
  } else if (mode === 'text') {
    data = { text: await scoutText(page) };
  } else if (mode === 'meta') {
    data = { meta: await scoutMeta(page) };
  } else if (mode === 'images') {
    data = { images: await scoutImages(page) };
  } else if (mode === 'tables') {
    data = { tables: await scoutTables(page) };
  } else {
    data = {
      url,
      meta: await scoutMeta(page),
      links: await scoutLinks(page),
      images: await scoutImages(page),
      tables: await scoutTables(page),
      text: await scoutText(page),
    };
  }

  await browser.close();

  fs.writeFileSync(output, JSON.stringify(data, null, 2), 'utf-8');

  const summary = `links=${(data.links || []).length} images=${(data.images || []).length} tables=${(data.tables || []).length}`;
  console.log(`[OK] 侦察结果已保存: ${output}`);
  console.log(`     摘要: ${summary}`);
}

main().catch(e => { console.error(e); process.exit(1); });
