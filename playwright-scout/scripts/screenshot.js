/** Playwright Scout — 截图模块 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : def;
  };
  const hasFlag = (name) => args.includes(`--${name}`);

  const url = getArg('url');
  if (!url) {
    console.error('Usage: node screenshot.js --url <URL> [--output <path>] [--fullpage] [--element <selector>] [--viewport WxH] [--wait <ms>] [--format png|jpeg]');
    process.exit(1);
  }

  const output = getArg('output', 'D:\\deepseek\\screenshot.png');
  const viewportArg = getArg('viewport', '1920x1080');
  const [w, h] = viewportArg.split('x').map(Number);
  const waitMs = parseInt(getArg('wait', '2000'));
  const format = getArg('format', 'png');
  const fullPage = hasFlag('fullpage');
  const elementSelector = getArg('element');

  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(waitMs);

  if (elementSelector) {
    const el = await page.$(elementSelector);
    if (!el) {
      console.error(`[ERROR] 未找到元素: ${elementSelector}`);
      await browser.close();
      process.exit(1);
    }
    await el.screenshot({ path: output, type: format });
  } else {
    await page.screenshot({ path: output, fullPage, type: format });
  }

  await browser.close();

  const { size } = fs.statSync(output);
  console.log(`[OK] 截图已保存: ${output}`);
  console.log(`     文件大小: ${(size / 1024).toFixed(1)} KB`);
}

main().catch(e => { console.error(e); process.exit(1); });
