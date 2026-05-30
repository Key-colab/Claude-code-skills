/** Playwright Scout — 页面监控模块 */
const { chromium } = require('playwright');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getContentHash(page, selector) {
  let content;
  if (selector) {
    const el = await page.$(selector);
    content = el ? await el.textContent() : '';
  } else {
    content = await page.evaluate(() => document.body?.innerText || '');
  }
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : def;
  };
  const hasFlag = (name) => args.includes(`--${name}`);

  const url = getArg('url');
  if (!url) {
    console.error('Usage: node monitor.js --url <URL> [--selector <sel>] [--interval <sec>] [--times <n>] [--screenshot]');
    process.exit(1);
  }

  const selector = getArg('selector', null);
  const interval = parseInt(getArg('interval', '60')) * 1000;
  const times = parseInt(getArg('times', '5'));
  const doScreenshot = hasFlag('screenshot');
  const outputDir = getArg('output-dir', 'D:\\deepseek');

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(outputDir, `monitor_${ts}`);
  fs.mkdirSync(outDir, { recursive: true });

  const report = {
    url,
    selector,
    startedAt: new Date().toISOString(),
    checks: [],
    changesDetected: 0,
  };

  let prevHash = null;

  for (let i = 0; i < times; i++) {
    const timestamp = new Date().toISOString();
    console.log(`[${i + 1}/${times}] 检查 ${url} ...`);

    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const currentHash = await getContentHash(page, selector);
      const changed = prevHash !== null && currentHash !== prevHash;
      if (changed) report.changesDetected++;

      const check = { timestamp, hash: currentHash, changed };

      if (doScreenshot && (changed || i === 0 || i === times - 1)) {
        const ssPath = path.join(outDir, `check_${String(i + 1).padStart(3, '0')}.png`);
        await page.screenshot({ path: ssPath, fullPage: true });
        check.screenshot = ssPath;
      }

      report.checks.push(check);
      prevHash = currentHash;
      await browser.close();

      const status = changed ? '[CHANGED]' : '[unchanged]';
      console.log(`         ${status} hash=${currentHash.slice(0, 12)}...`);
    } catch (e) {
      report.checks.push({ timestamp, error: e.message });
      console.log(`         [ERROR] ${e.message}`);
    }

    if (i < times - 1) await sleep(interval);
  }

  const reportFile = path.join(outDir, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n[OK] 监控完成: ${report.changesDetected} 次变化`);
  console.log(`     报告: ${reportFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
