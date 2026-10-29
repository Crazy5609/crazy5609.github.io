const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const url = "http://127.0.0.1:4174/pages/prototype-suite/review-workbench.html?refresh=2.96.0";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/review-return-modal-2.96.0");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openReturnFromRow(page, index) {
  const row = page.locator('[data-review-table] tbody tr[data-review-index="' + index + '"]');
  await row.locator('[data-review-decision="退回"]').click();
  await page.locator("#reviewReturnModal").waitFor({ state: "visible" });
  return row;
}

async function verifyDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 722 } });
  await page.goto(url, { waitUntil: "networkidle" });
  const row = await openReturnFromRow(page, 6);
  const modal = page.locator("#reviewReturnModal");
  const reason = page.locator("#reviewReturnReason");

  assert(await reason.evaluate((input) => document.activeElement === input), "退回弹窗打开后未聚焦理由输入");
  assert((await row.locator("[data-review-status-cell]").textContent()).includes("待审核"), "确认前审核状态已被修改");
  assert((await page.locator("[data-review-return-summary]").textContent()).includes("物资采购业务培训课程录像"), "单条退回未展示申请名称");

  await reason.fill("请补充培训适用范围说明");
  assert((await page.locator("[data-review-return-count]").textContent()) === "11", "退回理由字数未实时更新");
  await page.screenshot({
    path: path.join(outputDir, "review-return-modal-1440x722.png"),
    fullPage: false
  });
  await page.keyboard.press("Escape");
  assert(await modal.isHidden(), "Esc 未关闭退回弹窗");
  assert((await row.locator("[data-review-status-cell]").textContent()).includes("待审核"), "Esc 关闭后审核状态被修改");

  await openReturnFromRow(page, 6);
  await page.locator("#reviewReturnForm").evaluate((form) => form.requestSubmit());
  assert(await modal.isHidden(), "空理由确认后弹窗未关闭");
  assert((await row.locator("[data-review-status-cell]").textContent()).includes("已退回"), "空理由未能完成退回");
  assert(await row.locator('[data-review-decision="退回"]').count() === 0, "退回后仍保留重复审核操作");

  const drawerRow = page.locator('[data-review-table] tbody tr[data-review-index="8"]');
  await drawerRow.locator("[data-review-open]").click();
  await page.locator('#reviewDrawer [data-review-decision="退回"]').click();
  assert(await modal.isVisible(), "详情抽屉退回未打开弹窗");
  await page.keyboard.press("Escape");
  assert(await modal.isHidden(), "详情抽屉中的退回弹窗未被 Esc 关闭");
  assert(await page.locator("#reviewDrawer").isVisible(), "Esc 关闭退回弹窗时错误关闭了详情抽屉");
  await page.locator("[data-review-close]").click();

  await page.reload({ waitUntil: "networkidle" });
  await page.locator('[data-review-bulk="退回"]').click();
  assert((await page.locator("[data-review-return-summary]").textContent()) === "已选择 2 条待审核申请", "批量退回摘要数量不正确");
  await page.locator("#reviewReturnForm").evaluate((form) => form.requestSubmit());
  assert((await page.locator('[data-review-index="0"] [data-review-status-cell]').textContent()).includes("已退回"), "批量退回未更新第一条申请");
  assert((await page.locator('[data-review-index="3"] [data-review-status-cell]').textContent()).includes("已退回"), "批量退回未更新第二条申请");
  assert((await page.locator("[data-review-selected]").textContent()).includes("0"), "批量退回后已选数量未清零");

  const geometry = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  }));
  assert(!geometry.horizontalOverflow, "1440px 视口出现横向溢出");
  await page.close();
  return geometry;
}

async function verifyCompact(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 722 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await openReturnFromRow(page, 6);
  const geometry = await page.evaluate(() => {
    const box = document.querySelector("#reviewReturnModal .modal").getBoundingClientRect();
    return {
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      modalWithinViewport: box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight
    };
  });
  assert(!geometry.horizontalOverflow, "1280px 视口出现横向溢出");
  assert(geometry.modalWithinViewport, "1280px 视口下退回弹窗超出可视区域");
  await page.screenshot({
    path: path.join(outputDir, "review-return-modal-1280x722.png"),
    fullPage: false
  });
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
    const desktop = await verifyDesktop(browser);
    const compact = await verifyCompact(browser);
    console.log(JSON.stringify({ desktop, compact }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
