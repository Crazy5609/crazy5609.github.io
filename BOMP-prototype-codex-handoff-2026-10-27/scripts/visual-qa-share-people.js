const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const baseUrl = "http://127.0.0.1:4174/pages/prototype-suite/my-knowledge.html?refresh=2.94.0";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/share-people-2.94.0");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openFolderShare(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const folderRow = page.locator("tbody tr").filter({ hasText: "项目资料" }).first();
  await folderRow.locator(".share-action").click();
  await page.locator("#shareModal").waitFor({ state: "visible" });
}

async function runViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await openFolderShare(page);

  const fileSize = page.locator("[data-share-file-size]");
  assert(await fileSize.isHidden(), "文件夹分享摘要仍显示大小占位");
  assert((await fileSize.textContent()) === "", "文件夹分享摘要仍保留大小文本");
  assert(await page.locator("#shareDepartmentSelect option").count() === 4, "部门下拉不是 3 个部门");
  assert(await page.locator("[data-share-person-row]").count() === 30, "人员列表不是 30 人");

  await page.locator("#shareDepartmentSelect").selectOption("财务资产部");
  assert(await page.locator("#sharePersonSelect option").count() === 11, "财务资产部不是 10 人");
  await page.locator("#sharePersonSelect").selectOption("10634");
  await page.locator("[data-share-person-add]").click();
  assert((await page.locator("[data-share-selected-count]").textContent()).includes("4"), "级联添加后人数未更新");
  assert(await page.locator('[data-remove-share-person="郭欣"]').count() === 1, "级联添加未生成郭欣标签");
  assert(await page.locator('[data-person-id="10634"] [data-share-person]').isChecked(), "级联添加未同步人员复选状态");

  const search = page.locator("#sharePeopleSearch");
  await search.fill("郭欣");
  assert(await page.locator("[data-share-person-row]:visible").count() === 1, "姓名搜索结果不正确");
  await search.fill("综合管理部");
  assert(await page.locator("[data-share-person-row]:visible").count() === 10, "部门搜索结果不正确");
  await search.fill("10142");
  assert(await page.locator("[data-share-person-row]:visible").count() === 1, "工号搜索结果不正确");
  await search.fill("");

  const geometry = await page.evaluate(() => {
    const modal = document.querySelector("#shareModal .modal").getBoundingClientRect();
    return {
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      modalWithinViewport: modal.left >= 0 && modal.right <= window.innerWidth && modal.top >= 0 && modal.bottom <= window.innerHeight,
      modalHeight: Math.round(modal.height)
    };
  });
  assert(!geometry.horizontalOverflow, width + "px 视口出现横向溢出");
  assert(geometry.modalWithinViewport, width + "px 视口下弹窗超出可视区域");

  await page.screenshot({
    path: path.join(outputDir, "my-knowledge-share-" + width + "x" + height + ".png"),
    fullPage: false
  });

  await page.locator("[data-share-close]").first().click();
  const fileRow = page.locator("tbody tr").filter({ hasText: "供应链运营中心年度重点工作任务清单.docx" }).first();
  await fileRow.locator(".share-action").click();
  await page.locator("#shareModal").waitFor({ state: "visible" });
  assert(await fileSize.isVisible(), "普通文件的真实大小被错误隐藏");
  assert((await fileSize.textContent()) === "8.9 MB", "普通文件的真实大小显示不正确");

  await page.close();
  return geometry;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  try {
    const desktop = await runViewport(browser, 1440, 722);
    const compact = await runViewport(browser, 1280, 722);
    console.log(JSON.stringify({ desktop, compact }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
