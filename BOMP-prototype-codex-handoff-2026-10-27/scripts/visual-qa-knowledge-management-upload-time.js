const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const outputDir = path.join(__dirname, "..", "outputs", "visual-qa", "knowledge-management-upload-time-2.100.0");
fs.mkdirSync(outputDir, { recursive: true });

async function verifyViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://127.0.0.1:4174/pages/prototype-suite/knowledge-management.html", { waitUntil: "networkidle" });

  const select = page.locator("[data-library-time-filter]");
  const options = await select.locator("option").allTextContents();
  if (JSON.stringify(options) !== JSON.stringify(["全部", "今天", "近7天", "近30天", "本季度", "今年", "去年"])) {
    throw new Error(`上传时间选项不正确: ${JSON.stringify(options)}`);
  }
  if (await page.locator(".publish-date-range, [data-publish-date-start], [data-publish-date-end]").count()) {
    throw new Error("部门知识管理仍显示发布时间范围控件");
  }

  await page.locator(".scoped-knowledge-all").click();
  const rows = page.locator("[data-filter-table] tbody tr");
  const totalRows = await rows.count();
  if (totalRows < 8) throw new Error(`文件样例不足: ${totalRows}`);

  await select.selectOption("7");
  const recentRows = await rows.evaluateAll((items) => items.filter((item) => !item.hidden).length);
  if (recentRows !== 0) throw new Error(`近7天筛选结果不正确: ${recentRows}`);

  await select.selectOption("year");
  const currentYearRows = await rows.evaluateAll((items) => items.filter((item) => !item.hidden).length);
  if (currentYearRows !== totalRows) throw new Error(`今年筛选结果不正确: ${currentYearRows}/${totalRows}`);

  const displayText = await page.locator("[data-library-time-filter]").locator("xpath=..").locator("[data-filter-display]").textContent();
  if (displayText !== "上传时间：今年") throw new Error(`激活文案不正确: ${displayText}`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`${width}px 视口出现 ${overflow}px 横向溢出`);

  await page.screenshot({ path: path.join(outputDir, `knowledge-management-${width}x${height}.png`), fullPage: true });
  await select.selectOption("");
  const resetRows = await rows.evaluateAll((items) => items.filter((item) => !item.hidden).length);
  if (resetRows !== totalRows) throw new Error(`选择全部后未恢复完整列表: ${resetRows}/${totalRows}`);
  await page.close();
  return { width, totalRows, recentRows, currentYearRows, resetRows, displayText, overflow };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    const results = [];
    results.push(await verifyViewport(browser, 1440, 722));
    results.push(await verifyViewport(browser, 1280, 722));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
