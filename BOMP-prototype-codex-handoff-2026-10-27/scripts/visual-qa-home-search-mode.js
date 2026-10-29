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

const baseUrl = process.env.BOMP_QA_BASE_URL || "http://127.0.0.1:4174";
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "home-search-mode-2.57.0");

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
      await page.goto(`${baseUrl}/pages/prototype-suite/home.html?refresh=2.57.0`, { waitUntil: "networkidle" });
      const aiState = await page.evaluate(() => {
        const composer = document.querySelector(".home-composer");
        return {
          height: Math.round(composer.getBoundingClientRect().height),
          questionVisible: !document.getElementById("homeQuestion").hidden,
          searchHidden: document.querySelector("[data-home-document-search]").hidden,
          visibleAttachments: Array.from(document.querySelectorAll('[aria-label="添加附件"], [aria-label="添加图片"]')).filter((button) => button.getClientRects().length).length,
          secondCapability: document.querySelector(".capability-card:nth-child(2) strong")?.textContent.trim(),
          thirdCapability: document.querySelector(".capability-card:nth-child(3) strong")?.textContent.trim(),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      await page.locator('[data-home-mode="documents"]').click();
      const searchState = await page.evaluate(() => {
        const composer = document.querySelector(".home-composer");
        const searchInput = document.getElementById("homeDocumentSearch");
        const searchButton = document.querySelector(".home-document-search-submit");
        const scopeSelect = document.querySelector(".home-scope select");
        const scopeSlot = document.querySelector("[data-home-search-scope-slot]");
        const composerStyle = getComputedStyle(composer);
        const scopeRect = scopeSelect.getBoundingClientRect();
        const inputRect = searchInput.getBoundingClientRect();
        return {
          height: Math.round(composer.getBoundingClientRect().height),
          composerMode: composer.classList.contains("is-search-mode"),
          questionHidden: document.getElementById("homeQuestion").hidden,
          searchVisible: !document.querySelector("[data-home-document-search]").hidden,
          placeholder: searchInput.placeholder,
          focused: document.activeElement === searchInput,
          buttonText: searchButton.textContent.trim(),
          visibleAttachments: Array.from(document.querySelectorAll('[aria-label="添加附件"], [aria-label="添加图片"]')).filter((button) => button.getClientRects().length).length,
          scopeVisible: Boolean(scopeSelect?.getClientRects().length),
          scopeInSearchRow: scopeSlot.contains(scopeSelect),
          scopeBeforeInput: scopeRect.right <= inputRect.left,
          leadingSearchIconCount: document.querySelectorAll(".home-document-search-icon").length,
          toolsVisible: Boolean(document.querySelector(".home-tools").getClientRects().length),
          composerBackground: composerStyle.backgroundColor,
          composerBorder: composerStyle.borderTopWidth,
          composerShadow: composerStyle.boxShadow,
          activeMode: document.querySelector('[data-home-mode].is-active')?.dataset.homeMode,
          searchPressed: document.querySelector('[data-home-mode="documents"]')?.getAttribute("aria-pressed"),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      if (width === 1440) await page.screenshot({ path: path.join(outputDir, "home-search-mode-1440x902.png"), fullPage: false });
      await page.locator('[data-home-mode="qa"]').click();
      const restored = await page.evaluate(() => ({
        questionVisible: !document.getElementById("homeQuestion").hidden,
        searchHidden: document.querySelector("[data-home-document-search]").hidden,
        visibleAttachments: Array.from(document.querySelectorAll('[aria-label="添加附件"], [aria-label="添加图片"]')).filter((button) => button.getClientRects().length).length,
        scopeInHomeTools: document.querySelector("[data-home-scope-home]").contains(document.querySelector("[data-home-scope]"))
      }));
      const failures = [];
      if (!aiState.questionVisible || !aiState.searchHidden || aiState.visibleAttachments !== 2) failures.push(`AI state: ${JSON.stringify(aiState)}`);
      if (aiState.secondCapability !== "上传知识") failures.push(`second capability: ${aiState.secondCapability}`);
      if (aiState.thirdCapability !== "新建文档") failures.push(`third capability: ${aiState.thirdCapability}`);
      if (!searchState.composerMode || !searchState.questionHidden || !searchState.searchVisible) failures.push(`search visibility: ${JSON.stringify(searchState)}`);
      if (searchState.placeholder !== "搜索文件名称、关键词或正文内容") failures.push(`placeholder: ${searchState.placeholder}`);
      if (!searchState.focused || searchState.buttonText !== "搜索" || !searchState.scopeVisible || !searchState.scopeInSearchRow || !searchState.scopeBeforeInput) failures.push(`search controls: ${JSON.stringify(searchState)}`);
      if (searchState.leadingSearchIconCount !== 0) failures.push(`leading search icon: ${JSON.stringify(searchState)}`);
      if (searchState.activeMode !== "documents" || searchState.searchPressed !== "true") failures.push(`mode state: ${JSON.stringify(searchState)}`);
      if (searchState.visibleAttachments !== 0 || searchState.toolsVisible) failures.push(`visible search tools: ${JSON.stringify(searchState)}`);
      if (searchState.height > 60 || searchState.composerBackground !== "rgba(0, 0, 0, 0)" || searchState.composerBorder !== "0px" || searchState.composerShadow !== "none") failures.push(`search container: ${JSON.stringify(searchState)}`);
      if (!restored.questionVisible || !restored.searchHidden || restored.visibleAttachments !== 2 || !restored.scopeInHomeTools) failures.push(`restored AI state: ${JSON.stringify(restored)}`);
      if (aiState.overflow > 0 || searchState.overflow > 0) failures.push(`horizontal overflow: AI ${aiState.overflow}px, search ${searchState.overflow}px`);
      results.push({ width, aiState, searchState, restored, failures });
    }

    await page.setViewportSize({ width: 1440, height: 902 });
    await page.goto(`${baseUrl}/pages/prototype-suite/home.html?refresh=2.57.0`, { waitUntil: "networkidle" });
    await page.locator('[data-home-mode="documents"]').click();
    await page.locator("#homeDocumentSearch").press("Enter");
    await page.waitForURL("**/document-search-home.html");
    const searchPath = new URL(page.url()).pathname;
    await page.goto(`${baseUrl}/pages/prototype-suite/home.html?refresh=2.57.0`, { waitUntil: "networkidle" });
    await page.locator('.home-tool-actions [data-home-send]').click();
    await page.waitForURL("**/qa-result-home.html");
    const qaPath = new URL(page.url()).pathname;

    await page.goto(`${baseUrl}/pages/prototype-suite/home-2.html?refresh=2.57.0`, { waitUntil: "networkidle" });
    const homeTwo = await page.evaluate(() => ({
      modeSwitches: document.querySelectorAll("[data-home-mode]").length,
      questionVisible: !document.getElementById("homeQuestion").hidden,
      searchHidden: document.querySelector("[data-home-document-search]").hidden,
      visibleAttachments: Array.from(document.querySelectorAll('[aria-label="添加附件"], [aria-label="添加图片"]')).filter((button) => button.getClientRects().length).length,
      secondCapability: document.querySelector(".capability-card:nth-child(2) strong")?.textContent.trim(),
      thirdCapability: document.querySelector(".capability-card:nth-child(3) strong")?.textContent.trim()
    }));
    const navigationFailures = [];
    if (!searchPath.endsWith("/document-search-home.html")) navigationFailures.push(`search path: ${searchPath}`);
    if (!qaPath.endsWith("/qa-result-home.html")) navigationFailures.push(`AI path: ${qaPath}`);
    if (homeTwo.modeSwitches !== 0 || !homeTwo.questionVisible || !homeTwo.searchHidden || homeTwo.visibleAttachments !== 2) navigationFailures.push(`home two state: ${JSON.stringify(homeTwo)}`);
    if (homeTwo.secondCapability !== "上传知识") navigationFailures.push(`home two second capability: ${homeTwo.secondCapability}`);
    if (homeTwo.thirdCapability !== "新建文档") navigationFailures.push(`home two third capability: ${homeTwo.thirdCapability}`);
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}: ${failure}`)).concat(navigationFailures);
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures, navigation: { searchPath, qaPath }, homeTwo, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures, navigation: { searchPath, qaPath }, homeTwo }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
