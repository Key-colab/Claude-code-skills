# Playwright 实用技巧 (Node.js)

## 反反爬

有些网站检测 headless 浏览器。以下技巧绕过常见检测：

```js
// 1. 改 UA
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...'
});
const page = await context.newPage();

// 2. 隐藏 webdriver 标记
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh', 'en'] });
});

// 3. 非 headless 模式（用户可见时）
const browser = await chromium.launch({ headless: false });
```

## 等待策略

| 场景 | 方法 |
|------|------|
| 等待元素可见 | `await page.waitForSelector('.el', { state: 'visible' })` |
| 等待网络请求完毕 | `await page.waitForLoadState('networkidle')` |
| 等待特定文本出现 | `await page.waitForSelector('text=加载完成')` |
| 等待 JS 条件 | `await page.waitForFunction("() => document.readyState === 'complete'")` |
| 硬等待 | `await page.waitForTimeout(3000)` |

## 多页/标签处理

```js
// 获取新打开的标签
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.click("a[target='_blank']"),
]);
await newPage.waitForLoadState();

// 遍历所有页面
for (const p of context.pages()) {
  console.log(p.url());
}
```

## 下载文件

```js
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('a.download-link'),
]);
await download.saveAs('D:\\deepseek\\downloaded_file.pdf');
```

## 模拟地理位置/权限

```js
const context = await browser.newContext({
  geolocation: { longitude: 116.4074, latitude: 39.9042 },  // 北京
  permissions: ['geolocation'],
});

// 授予通知权限
await context.grantPermissions(['notifications']);
```

## 认证相关

```js
// Cookie 注入
await context.addCookies([
  { name: 'session', value: 'xxx', domain: '.example.com', path: '/' }
]);

// HTTP Basic Auth
const page = await browser.newPage({
  httpCredentials: { username: 'admin', password: 'pass' }
});

// Token 标头
await page.setExtraHTTPHeaders({ Authorization: 'Bearer xxx' });
```
