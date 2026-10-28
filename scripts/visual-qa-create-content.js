const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "create-content-2.10.1");
const url = "http://127.0.0.1:4173/pages/prototype-suite/my-library.html?refresh=2.10.1";

async function inspect(page, width) {
  const height = width === 1920 ? 910 : 730;
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "新建", exact: true }).click();
  await page.waitForSelector("#createContentModal:not([hidden])");
  const folderButton = page.getByRole("button", { name: "新建文件夹" });
  const borderBeforeHover = await folderButton.evaluate((button) => getComputedStyle(button).borderTopWidth);
  await folderButton.hover();
  const borderAfterHover = await folderButton.evaluate((button) => getComputedStyle(button).borderTopWidth);

  if (width === 1440) {
    await page.getByRole("radio", { name: /PPT/ }).check();
    await page.getByRole("button", { name: "新建文件夹" }).click();
    await page.getByLabel("文件夹名称").fill("季度复盘");
    await page.screenshot({ path: path.join(outputDir, "create-content-folder-editor-1440.png"), fullPage: true });
    await page.getByRole("button", { name: "创建并选中" }).click();
  }

  const result = await page.evaluate(() => {
    const modal = document.querySelector("#createContentModal .modal");
    const rect = modal.getBoundingClientRect();
    const selectedType = document.querySelector('[name="createType"]:checked');
    const location = document.querySelector("[data-create-location]");
    return {
      modalWidth: Math.round(rect.width),
      modalHeight: Math.round(rect.height),
      modalWithinViewport: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
      modalOverflow: modal.scrollWidth - modal.clientWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      typeCount: document.querySelectorAll('[name="createType"]').length,
      selectedType: selectedType && selectedType.value,
      locationValue: location && location.value,
      summary: document.querySelector("[data-create-location-summary]").textContent,
      footerFits: document.querySelector("#createContentModal .modal-footer").scrollWidth <= document.querySelector("#createContentModal .modal-footer").clientWidth + 1
    };
  });

  await page.screenshot({ path: path.join(outputDir, `create-content-${width}.png`), fullPage: true });
  await page.keyboard.press("Escape");
  const closedByEscape = await page.locator("#createContentModal").evaluate((element) => element.hidden);
  let submitFeedback = null;
  if (width === 1920) {
    await page.getByRole("button", { name: "新建", exact: true }).click();
    await page.getByRole("radio", { name: /表格/ }).check();
    await page.getByLabel("保存目录").selectOption("项目资料");
    await page.getByRole("button", { name: "新建表格" }).click();
    submitFeedback = await page.locator("#suiteToast").textContent();
  }
  return { width, height, closedByEscape, submitFeedback, borderBeforeHover, borderAfterHover, ...result };
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
    const failed = results.some((item) => item.modalWidth !== 640 || !item.modalWithinViewport || item.modalOverflow > 0 || item.documentOverflow > 0 || item.typeCount !== 3 || !item.selectedType || !item.footerFits || !item.closedByEscape || item.borderBeforeHover !== "0px" || item.borderAfterHover !== "0px") || results[0].submitFeedback !== "已在“我的知识库 / 项目资料”中新建表格";
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
