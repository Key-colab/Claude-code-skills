---
name: playwright-scout
description: >
  Playwright 浏览器自动化侦察工具。用于网页截图、页面内容采集、
  交互录制回放、页面变化监控、SEO/可访问性检查、表单自动填写等任务。
  当用户需要"截图这个网页"、"抓取页面内容"、"监控这个网站"、
  "录制操作流程"、"检查页面信息"、"提取表格数据"、"自动填表"、
  或任何涉及浏览器自动化操作时，使用此 skill。
  Playwright 已预装 (npx playwright)，直接用 Bash 执行脚本即可。
---

# Playwright Scout — 浏览器侦察兵

用 Playwright 自动操控浏览器完成截图、采集、监控、录制等任务。

## 核心原则

- **脚本目录**：`C:\Users\王\.claude\skills\playwright-scout\scripts\`
- **输出统一放 `D:\deepseek`**：除非用户指定，截图、JSON、报告都放这个目录
- **优先用 headless 模式**：除非用户说"让我看浏览器"或调试需要，默认 headless
- **用 Node.js 执行**：`node <脚本路径> --url ...`（Node.js 和 Playwright 均已预装）
- **自定义脚本写临时 `.js` 文件**，用 `node` 执行后再清理

## 三大内置脚本

### 1. 截图快照 — `screenshot.js`

```bash
node "C:\Users\王\.claude\skills\playwright-scout\scripts\screenshot.js" --url "https://example.com" [--output path] [--fullpage] [--element ".selector"] [--viewport "1920x1080"] [--wait 3000] [--format jpeg]
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--url` | 目标 URL（必填） | - |
| `--output` | 输出路径 | `D:\deepseek\screenshot.png` |
| `--fullpage` | 全页截图（不加只截可视区域） | false |
| `--element` | CSS 选择器，只截该元素 | - |
| `--viewport` | 视口尺寸 WxH | `1920x1080` |
| `--wait` | 加载后等待毫秒数 | `2000` |
| `--format` | png 或 jpeg | `png` |

### 2. 页面侦察 — `scout.js`

```bash
node "C:\Users\王\.claude\skills\playwright-scout\scripts\scout.js" --url "https://example.com" --mode [links|text|meta|images|tables|full] [--output path]
```

| 模式 | 采集内容 |
|------|----------|
| `links` | 所有链接 href + 文本 |
| `text` | 页面可见文本 |
| `meta` | title、description、og 标签等 |
| `images` | 所有图片 src + alt |
| `tables` | 所有表格转 JSON 数组 |
| `full` | 以上全部，输出综合 JSON（默认） |

### 3. 页面监控 — `monitor.js`

```bash
node "C:\Users\王\.claude\skills\playwright-scout\scripts\monitor.js" --url "https://example.com" [--selector ".target"] [--interval 60] [--times 5] [--screenshot]
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--url` | 目标 URL（必填） | - |
| `--selector` | 监控的元素选择器 | 整页文本 |
| `--interval` | 检查间隔秒数 | `60` |
| `--times` | 检查次数 | `5` |
| `--screenshot` | 变化时截图 | false |

输出变化报告到 `D:\deepseek\monitor_{timestamp}\report.json`。

## 自定义脚本模板

当内置脚本不够用时，写自定义 Node.js 脚本：

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 自定义操作...

  await browser.close();
})();
```

## 交互录制

录制用户操作生成可回放脚本：

```bash
npx playwright codegen --target javascript --output "D:\deepseek\recorded_script.js" "https://example.com"
```

## 常用 Playwright 操作速查 (Node.js)

```js
// 等待
await page.waitForSelector('.element', { timeout: 10000 });
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);

// 交互
await page.click('button#submit');
await page.fill("input[name='email']", 'test@example.com');
await page.selectOption('select#country', 'CN');

// 读取
const text = await page.textContent('.title');
const href = await page.getAttribute('a.link', 'href');
const result = await page.evaluate('() => document.title');

// 截图
await page.screenshot({ path: 'out.png', fullPage: true });

// 批量获取
const items = await page.$$('.item');
for (const item of items) {
  console.log(await item.textContent());
}

// Cookie
await page.context().addCookies([{ name: 'token', value: 'xxx', url: 'https://example.com' }]);
const cookies = await page.context().cookies();

// 请求拦截
await page.route('**/*.{png,jpg}', route => route.abort());

// 模拟移动端
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ...'
});
const page2 = await ctx.newPage();
```

## 执行流程

1. **分析需求**：确定截图/侦察/监控/自定义
2. **选脚本**：内置脚本直接调用；否则写自定义 `.js` 到 `D:\deepseek\`
3. **Bash 执行**：`node 脚本路径 --url ...`
4. **返回结果**：告知输出文件位置 + 关键信息摘要
5. **清理**：自定义临时脚本执行后删除

## 注意事项

- 反爬页面：设置 `userAgent`、注入 `navigator.webdriver = undefined`（详见 `references/playwright-tips.md`）
- 截图文件大：用 `--format jpeg` 压缩
- 需登录的页面：询问用户是否有 cookie 或使用 codegen 手动登录
- 监控是阻塞的：用 `run_in_background` 执行
