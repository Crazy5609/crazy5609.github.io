const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const url = "http://127.0.0.1:4174/pages/prototype-suite/company-library.html?refresh=2.95.0#company-core-business";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/company-library-search-radius-2.95.0");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function verifyViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "networkidle" });
  const search = page.locator('.library-toolbar .suite-search input');
  await search.focus();
  const result = await search.evaluate((input) => ({
    borderRadius: getComputedStyle(input).borderRadius,
    focused: document.activeElement === input,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  }));
  assert(result.borderRadius === "3px", width + "px 视口搜索框圆角不是 3px");
  assert(result.focused, width + "px 视口搜索框无法获得焦点");
  assert(!result.horizontalOverflow, width + "px 视口出现横向溢出");

  await search.fill("数字化专业");
  assert(await page.locator(".table-library tbody tr:visible").count() === 1, "公司知识库搜索过滤未保持可用");
  await search.fill("");
  await page.screenshot({
    path: path.join(outputDir, "company-library-search-" + width + "x" + height + ".png"),
    fullPage: false
  });
  await page.close();
  return result;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  try {
    const desktop = await verifyViewport(browser, 1440, 722);
    const compact = await verifyViewport(browser, 1280, 722);
    console.log(JSON.stringify({ desktop, compact }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
