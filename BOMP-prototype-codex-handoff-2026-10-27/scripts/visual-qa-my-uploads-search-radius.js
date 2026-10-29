const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const url = "http://127.0.0.1:4174/pages/prototype-suite/my-uploads.html?refresh=2.104.0";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/my-uploads-search-radius-2.104.0");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function verifyViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "networkidle" });

  const search = page.locator(".suite-toolbar .toolbar-right .suite-search input");
  const before = await search.boundingBox();
  await search.focus();
  const after = await search.boundingBox();
  const result = await search.evaluate((input) => {
    const style = getComputedStyle(input);
    return {
      borderRadius: style.borderRadius,
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      focused: document.activeElement === input,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  assert(result.borderRadius === "3px", `${width}px 视口搜索框圆角不是 3px`);
  assert(result.focused, `${width}px 视口搜索框无法获得焦点`);
  assert(
    result.borderColor === "rgb(31, 130, 122)" || result.boxShadow !== "none" || result.outlineStyle !== "none",
    `${width}px 视口搜索框缺少可见焦点反馈`
  );
  assert(before && after && before.width === after.width && before.height === after.height, `${width}px 视口聚焦后搜索框尺寸发生变化`);
  assert(!result.horizontalOverflow, `${width}px 视口出现横向溢出`);

  await page.screenshot({
    path: path.join(outputDir, `my-uploads-search-${width}x${height}.png`),
    fullPage: false
  });
  await page.close();
  return { ...result, width: after.width, height: after.height };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  try {
    const desktop = await verifyViewport(browser, 1440, 902);
    const compact = await verifyViewport(browser, 1280, 902);
    console.log(JSON.stringify({ desktop, compact }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
