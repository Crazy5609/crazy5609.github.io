const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const localTemp = path.join(projectRoot, ".tmp");
fs.mkdirSync(localTemp, { recursive: true });
process.env.TEMP = localTemp;
process.env.TMP = localTemp;
process.env.TMPDIR = localTemp;
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(projectRoot, ".cache", "playwright");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const outputDir = path.join(projectRoot, "outputs", "visual-qa", "personal-library-topbar-2.52.0");
const baseUrl = process.env.BOMP_QA_BASE_URL || "http://127.0.0.1:4174";
const pages = [
  ["my-library.html", "最近使用"],
  ["my-knowledge.html", "我的知识"],
  ["my-collaboration.html", "我的协作"],
  ["my-favorites.html", "我的收藏"],
  ["my-uploads.html", "我的上传"],
  ["my-sharing.html", "我的共享"],
  ["my-recycle-bin.html", "回收站"],
  ["sharing-statistics.html", "我的共享"]
];

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const results = [];
  try {
    const page = await browser.newPage();
    for (const width of [1920, 1440, 1280]) {
      await page.setViewportSize({ width, height: 902 });
      for (const [file, current] of pages) {
        await page.goto(`${baseUrl}/pages/prototype-suite/${file}?refresh=2.52.0`, { waitUntil: "networkidle" });
        await page.locator(".personal-library-topbar").waitFor();
        const before = await page.evaluate(() => {
          const bar = document.querySelector(".personal-library-topbar");
          const header = document.querySelector("bomp-header");
          const sidebar = document.querySelector("bomp-sidebar");
          const barRect = bar.getBoundingClientRect();
          const summary = document.querySelector(".recent-summary");
          const listPanel = document.querySelector(".recent-list-panel");
          return {
            breadcrumb: bar.querySelector(".suite-crumb").textContent.replace(/\s+/g, "").trim(),
            globalSearch: bar.querySelector('[data-nav="document-search.html"]')?.textContent.trim(),
            aiQa: bar.querySelector('[data-nav="qa-result.html"]')?.textContent.trim(),
            breadcrumbFontSize: getComputedStyle(bar.querySelector(".suite-crumb")).fontSize,
            top: Math.round(barRect.top),
            left: Math.round(barRect.left),
            right: Math.round(barRect.right),
            headerBottom: Math.round(header.getBoundingClientRect().bottom),
            sidebarRight: Math.round(sidebar.getBoundingClientRect().right),
            viewportWidth: document.documentElement.clientWidth,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            recentPanel: summary && listPanel ? {
              background: getComputedStyle(listPanel).backgroundColor,
              gap: Math.round(listPanel.getBoundingClientRect().top - summary.getBoundingClientRect().bottom),
              hasToolbar: Boolean(listPanel.querySelector(".suite-toolbar")),
              hasTable: Boolean(listPanel.querySelector(".table-recent")),
              hasPager: Boolean(listPanel.querySelector(".pager"))
            } : null
          };
        });
        if (width === 1440 && file === "my-library.html") {
          await page.screenshot({ path: path.join(outputDir, "my-library-list-panel-1440x902.png"), fullPage: false });
        }
        await page.evaluate(() => {
          document.querySelector(".suite-page").style.minHeight = "1800px";
          window.scrollTo(0, 600);
        });
        await page.waitForTimeout(50);
        const afterScroll = await page.locator(".personal-library-topbar").evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return { top: Math.round(rect.top), left: Math.round(rect.left), right: Math.round(rect.right) };
        });
        const failures = [];
        if (before.breadcrumb !== `我的知识库>${current}`) failures.push(`breadcrumb: ${before.breadcrumb}`);
        if (before.globalSearch !== "全局搜索") failures.push(`global search: ${before.globalSearch}`);
        if (before.aiQa !== "AI问答") failures.push(`AI Q&A: ${before.aiQa}`);
        if (before.breadcrumbFontSize !== "13px") failures.push(`breadcrumb font size: ${before.breadcrumbFontSize}`);
        if (before.top !== 56 || afterScroll.top !== 56 || before.headerBottom !== 56) failures.push(`sticky offsets: ${JSON.stringify({ before: before.top, after: afterScroll.top, headerBottom: before.headerBottom })}`);
        if (before.left !== before.sidebarRight || afterScroll.left !== before.sidebarRight) failures.push(`sidebar seam: ${JSON.stringify({ before: before.left, after: afterScroll.left, sidebarRight: before.sidebarRight })}`);
        if (before.right !== before.viewportWidth || afterScroll.right !== before.viewportWidth) failures.push(`viewport seam: ${JSON.stringify({ before: before.right, after: afterScroll.right, viewportWidth: before.viewportWidth })}`);
        if (before.overflow > 0) failures.push(`horizontal overflow: ${before.overflow}px`);
        if (file === "my-library.html" && (!before.recentPanel || before.recentPanel.background !== "rgb(255, 255, 255)" || before.recentPanel.gap !== 24 || !before.recentPanel.hasToolbar || !before.recentPanel.hasTable || !before.recentPanel.hasPager)) failures.push(`recent panel: ${JSON.stringify(before.recentPanel)}`);
        results.push({ width, file, current, ...before, afterScroll, failures });
        if (width === 1440 && file === "my-library.html") {
          await page.screenshot({ path: path.join(outputDir, "my-library-sticky-1440x902.png"), fullPage: false });
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 902 });
    await page.goto(`${baseUrl}/pages/prototype-suite/my-library.html?refresh=2.52.0`, { waitUntil: "networkidle" });
    await page.locator('.personal-library-topbar [data-nav="document-search.html"]').click();
    await page.waitForURL("**/document-search.html");
    const globalSearchPath = new URL(page.url()).pathname;
    await page.goto(`${baseUrl}/pages/prototype-suite/my-library.html?refresh=2.52.0`, { waitUntil: "networkidle" });
    await page.locator('.personal-library-topbar [data-nav="qa-result.html"]').click();
    await page.waitForURL("**/qa-result.html");
    const aiQaPath = new URL(page.url()).pathname;
    const navigationFailures = [];
    if (!globalSearchPath.endsWith("/document-search.html")) navigationFailures.push(`global search path: ${globalSearchPath}`);
    if (!aiQaPath.endsWith("/qa-result.html")) navigationFailures.push(`AI Q&A path: ${aiQaPath}`);
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}/${result.file}: ${failure}`)).concat(navigationFailures);
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures, navigation: { globalSearchPath, aiQaPath }, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures, navigation: { globalSearchPath, aiQaPath } }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
