const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const outputDir = path.resolve(__dirname, "../outputs/visual-qa/review-column-offset-2.98.0");
fs.mkdirSync(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 722 } });
  await page.goto("http://127.0.0.1:4174/pages/prototype-suite/review-workbench.html?refresh=2.98.0", { waitUntil: "networkidle" });
  await page.locator(".table-review").waitFor();

  const geometry = await page.evaluate(() => {
    const table = document.querySelector(".table-review");
    const headers = Array.from(table.querySelectorAll("thead th"));
    const actionHeader = headers[7];
    const tableRect = table.getBoundingClientRect();
    const actionRect = actionHeader.getBoundingClientRect();
    const middleHeaders = headers.slice(2, 7);
    const pendingActions = table.querySelector("tbody tr[data-review-status='待审核'] .review-row-actions");
    return {
      tableWidth: tableRect.width,
      actionWidth: actionRect.width,
      actionRatio: actionRect.width / tableRect.width,
      middleShiftFromOldLayout: actionRect.left - (tableRect.right - tableRect.width * 0.19),
      middleHeaders: middleHeaders.map((header) => ({ text: header.textContent.trim(), left: header.getBoundingClientRect().left, clipped: header.scrollWidth > header.clientWidth + 1 })),
      actionOverflow: pendingActions.scrollWidth > pendingActions.clientWidth + 1,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      extensionLabels: Array.from(table.querySelectorAll(".doc-icon")).map((icon) => icon.textContent.trim()).filter(Boolean)
    };
  });

  assert(geometry.middleShiftFromOldLayout >= 15 && geometry.middleShiftFromOldLayout <= 20, `${width}px 中间字段位移不是 15-20px: ${geometry.middleShiftFromOldLayout}`);
  assert(Math.abs(geometry.actionRatio - 0.175) < 0.004, `${width}px 操作列不是约 17.5%: ${geometry.actionRatio}`);
  assert(geometry.middleHeaders.every((header) => !header.clipped), `${width}px 中间字段表头被截断`);
  assert(!geometry.actionOverflow, `${width}px 审核操作发生溢出`);
  assert(!geometry.horizontalOverflow, `${width}px 页面发生横向溢出`);
  assert(geometry.extensionLabels.includes("MP4") && geometry.extensionLabels.includes("PNG"), `${width}px 未加载 2.98.0 最新文件类型标识`);

  await page.screenshot({ path: path.join(outputDir, `review-workbench-${width}x722.png`), fullPage: true });
  await page.close();
  return geometry;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const report = {
    desktop: await inspect(browser, 1440),
    compact: await inspect(browser, 1280)
  };
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
