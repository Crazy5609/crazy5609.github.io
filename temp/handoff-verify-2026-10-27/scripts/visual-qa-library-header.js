const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "library-header-2.8.7");
const url = "http://127.0.0.1:4173/pages/prototype-suite/department-library.html?refresh=2.8.7#dept-bomp-2025-project";
const expectedName = "国网物资公司-2025年企业经营管理系统-设计开发实施项目";

async function inspect(page, width) {
  await page.setViewportSize({ width, height: width === 1920 ? 910 : 730 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".library-topbar .library-directory-context");

  const result = await page.evaluate((expectedName) => {
    const topbar = document.querySelector(".library-topbar");
    const context = topbar.querySelector(":scope > .library-directory-context");
    const name = context.querySelector("strong");
    const pathText = context.querySelector("small");
    const search = topbar.querySelector(".suite-search");
    const toolbar = document.querySelector(".suite-content > .suite-toolbar");
    const topbarRect = topbar.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();
    return {
      hasBreadcrumb: Boolean(document.querySelector(".library-page .suite-crumb")),
      duplicateContext: Boolean(document.querySelector(".suite-content > .library-directory-context")),
      contextInTopbar: context.parentElement === topbar,
      currentName: name.textContent.trim(),
      currentNameTitle: name.title,
      pathText: pathText.textContent.trim(),
      pathTitle: pathText.title,
      fileCount: context.querySelector(":scope > b")?.textContent.trim() || "",
      searchWidth: Math.round(search.getBoundingClientRect().width),
      toolbarBelowTopbar: toolbarRect.top >= topbarRect.bottom,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      topbarOverflow: topbar.scrollWidth - topbar.clientWidth,
      nameMatches: name.textContent.trim() === expectedName && name.title === expectedName
    };
  }, expectedName);

  await page.screenshot({
    path: path.join(outputDir, `department-library-${width}.png`),
    fullPage: true
  });
  return { width, ...result };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  try {
    const page = await browser.newPage();
    const results = [];
    for (const width of [1920, 1440, 1280]) results.push(await inspect(page, width));
    const failed = results.some((item) => item.hasBreadcrumb || item.duplicateContext || !item.contextInTopbar || !item.nameMatches || !item.pathText || item.pathTitle !== item.pathText || !item.fileCount || item.searchWidth < 280 || !item.toolbarBelowTopbar || item.documentOverflow > 0 || item.topbarOverflow > 0);
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
