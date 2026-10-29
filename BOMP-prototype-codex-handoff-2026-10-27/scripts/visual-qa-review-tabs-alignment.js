const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const outputDir = path.resolve(__dirname, "../outputs/visual-qa/review-tabs-alignment-2.99.0");
fs.mkdirSync(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 722 } });
  await page.goto("http://127.0.0.1:4174/pages/prototype-suite/review-workbench.html?refresh=2.99.0", { waitUntil: "networkidle" });
  await page.locator(".review-tabs").waitFor();
  const geometry = await page.evaluate(() => {
    const tabs = document.querySelector(".review-tabs");
    const buttons = Array.from(tabs.querySelectorAll("button"));
    const content = document.querySelector(".review-content");
    const firstRect = buttons[0].getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    return {
      contentLeft: contentRect.left,
      firstButtonLeft: firstRect.left,
      alignmentError: Math.abs(firstRect.left - contentRect.left),
      buttonWidths: buttons.map((button) => button.getBoundingClientRect().width),
      wrapped: buttons.some((button) => button.getBoundingClientRect().top !== buttons[0].getBoundingClientRect().top),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  });
  assert(geometry.alignmentError <= 1, `${width}px 页签与内容容器未左对齐: ${geometry.alignmentError}px`);
  assert(geometry.buttonWidths.every((value) => Math.abs(value - 150) <= 1), `${width}px 页签宽度发生变化`);
  assert(!geometry.wrapped, `${width}px 页签发生换行`);
  assert(!geometry.horizontalOverflow, `${width}px 页面发生横向溢出`);
  await page.screenshot({ path: path.join(outputDir, `review-workbench-${width}x722.png`), fullPage: true });
  await page.close();
  return geometry;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const report = { desktop: await inspect(browser, 1440), compact: await inspect(browser, 1280) };
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
