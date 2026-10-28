const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const baseUrl = "http://127.0.0.1:4174/pages/prototype-suite/company-knowledge-management.html?refresh=2.18.0";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/company-folder-button");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });

  try {
    for (const width of [1440, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForSelector(".company-knowledge-results .management-bulk");

      const result = await page.evaluate(() => ({
        labels: Array.from(document.querySelectorAll(".company-knowledge-results .management-bulk > button"), (button) => button.textContent.trim()),
        searchWidth: document.querySelector(".company-knowledge-results .management-search").getBoundingClientRect().width,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      assert(
        JSON.stringify(result.labels) === JSON.stringify(["上传知识", "调整所属目录", "下架", "删除", "新建文件夹"]),
        `${width}px 工具栏顺序不正确：${result.labels.join("、")}`
      );
      assert(result.searchWidth >= 220 && result.searchWidth <= 228, `${width}px 搜索栏宽度不正确：${result.searchWidth}px`);
      assert(result.scrollWidth <= result.clientWidth, `${width}px 页面出现横向滚动：${result.scrollWidth} > ${result.clientWidth}`);

      const folderImages = page.locator(".company-folder-asset");
      assert((await folderImages.count()) >= 4, `${width}px 文件夹素材图标数量不足`);
      const loaded = await folderImages.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth === 200 && image.naturalHeight === 200));
      assert(loaded, `${width}px 文件夹素材图标加载失败或尺寸不正确`);

      await page.screenshot({ path: path.join(outputDir, `company-search-width-${width}.png`), fullPage: true });

      const createButton = page.locator("[data-company-folder-open]");
      assert(!(await createButton.isDisabled()), `${width}px 默认具体目录下的新建文件夹按钮不应禁用`);
      await createButton.click();
      await page.locator("#companyFolderModal").waitFor({ state: "visible" });
      assert((await page.locator("[data-company-folder-location]").textContent()).trim().length > 0, `${width}px 新建文件夹弹窗缺少当前目录`);

      await page.screenshot({ path: path.join(outputDir, `company-folder-button-${width}.png`), fullPage: true });
      await page.locator("[data-company-folder-close]").last().click();
      await page.locator('[data-scoped-knowledge-prefix=""]').click();
      assert(await createButton.isDisabled(), `${width}px “全部”视图下新建文件夹按钮应禁用`);
      await page.close();
    }

    console.log("Company folder button visual QA passed at 1440px and 1280px.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
