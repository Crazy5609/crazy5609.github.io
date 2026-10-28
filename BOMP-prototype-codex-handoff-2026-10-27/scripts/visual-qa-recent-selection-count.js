const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "recent-toolbar-2.22.0");
const baseUrl = process.env.BOMP_QA_BASE_URL || "http://127.0.0.1:4174";

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const results = [];
  try {
    const page = await browser.newPage();
    for (const width of [1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseUrl}/pages/prototype-suite/my-library.html?refresh=2.22.0`, { waitUntil: "networkidle" });
      const count = page.locator("[data-recent-selected]");
      const share = page.locator("[data-recent-share-submit]");
      const selectAll = page.locator("[data-recent-table] [data-select-all]");
      const rows = page.locator("[data-recent-table] tbody [data-row-select]");
      const initial = await count.textContent();
      const initialShareDisabled = await share.isDisabled();
      await rows.first().check();
      const afterOne = await count.textContent();
      const afterOneShareEnabled = await share.isEnabled();
      await page.screenshot({ path: path.join(outputDir, `recent-selected-one-${width}.png`), fullPage: true });
      await selectAll.check();
      const rowCount = await rows.count();
      const afterAll = await count.textContent();
      await selectAll.uncheck();
      const afterClear = await count.textContent();
      const afterClearShareDisabled = await share.isDisabled();
      const sourceFilter = page.locator('[data-filter-key="source"]');
      await sourceFilter.selectOption("部门知识库");
      const visibleSourceRows = await page.locator('[data-recent-table] tbody tr:not([hidden])').count();
      const sourceFilterDisplay = await page.locator('[data-filter-key="source"]').locator('xpath=..').locator('[data-filter-display]').textContent();
      const sourceValues = await page.locator('[data-recent-table] tbody tr:not([hidden])').evaluateAll((rows) => rows.map((row) => row.dataset.source));
      const activeFilterOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: path.join(outputDir, `recent-source-department-${width}.png`), fullPage: true });
      await sourceFilter.selectOption("");
      const layout = await page.evaluate(() => {
        const status = document.querySelector("[data-recent-selected]");
        const firstButton = status?.nextElementSibling;
        return {
          role: status?.getAttribute("role"),
          ariaLive: status?.getAttribute("aria-live"),
          ariaAtomic: status?.getAttribute("aria-atomic"),
          statusBeforeFirstButton: Boolean(status && firstButton && status.getBoundingClientRect().left < firstButton.getBoundingClientRect().left),
          viewSwitchCount: document.querySelectorAll(".suite-toolbar .view-switch").length,
          hasTypeFilter: Boolean(Array.from(document.querySelectorAll(".suite-toolbar [data-filter-display]")).find((element) => element.textContent.trim() === "类型")),
          hasSourceFilter: Boolean(Array.from(document.querySelectorAll(".suite-toolbar [data-filter-display]")).find((element) => element.textContent.trim() === "来源")),
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      const failures = [];
      if (initial !== "已选中 0 条") failures.push(`initial count: ${initial}`);
      if (!initialShareDisabled) failures.push("share is enabled initially");
      if (afterOne !== "已选中 1 条") failures.push(`single count: ${afterOne}`);
      if (!afterOneShareEnabled) failures.push("share is disabled after selecting one row");
      if (afterAll !== `已选中 ${rowCount} 条`) failures.push(`select-all count: ${afterAll}`);
      if (afterClear !== "已选中 0 条" || !afterClearShareDisabled) failures.push("clear state is inconsistent");
      if (layout.role !== "status" || layout.ariaLive !== "polite" || layout.ariaAtomic !== "true") failures.push("live status semantics are incomplete");
      if (!layout.statusBeforeFirstButton) failures.push("selection count is not at the toolbar left edge");
      if (layout.viewSwitchCount !== 0) failures.push(`view switch remains: ${layout.viewSwitchCount}`);
      if (!layout.hasTypeFilter) failures.push("type filter is missing");
      if (!layout.hasSourceFilter) failures.push("source filter is missing");
      if (visibleSourceRows < 1 || sourceValues.some((value) => value !== "部门知识库")) failures.push(`source filter mismatch: ${JSON.stringify(sourceValues)}`);
      if (sourceFilterDisplay !== "来源：部门知识库") failures.push(`source filter display: ${sourceFilterDisplay}`);
      if (activeFilterOverflow > 0) failures.push(`active source filter overflow: ${activeFilterOverflow}px`);
      if (layout.documentOverflow > 0) failures.push(`document overflow: ${layout.documentOverflow}px`);
      results.push({ width, rowCount, initial, afterOne, afterAll, afterClear, ...layout, failures });
    }
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}: ${failure}`));
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
