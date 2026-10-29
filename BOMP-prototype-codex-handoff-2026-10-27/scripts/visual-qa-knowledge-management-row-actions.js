const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const outputDir = path.join(__dirname, "..", "outputs", "visual-qa", "knowledge-management-row-actions-2.101.0");
fs.mkdirSync(outputDir, { recursive: true });

async function verifyViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://127.0.0.1:4174/pages/prototype-suite/knowledge-management.html", { waitUntil: "networkidle" });
  await page.locator(".scoped-knowledge-all").click();

  const table = page.locator(".scoped-file-table");
  const firstRow = table.locator("tbody tr").first();
  const visibleActions = firstRow.locator("td:last-child .text-action");
  const labels = (await visibleActions.allTextContents()).map((label) => label.trim());
  if (JSON.stringify(labels) !== JSON.stringify(["下架", "重命名", "调整所属目录"])) {
    throw new Error(`行内常用操作不正确: ${JSON.stringify(labels)}`);
  }
  if (await firstRow.locator("td:last-child .text-action.danger").count()) {
    throw new Error("删除仍直接显示在操作列中");
  }

  const more = firstRow.locator("[data-management-file-more]");
  if (await more.getAttribute("aria-label") !== "更多操作") throw new Error("更多按钮缺少可访问名称");
  await more.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await more.click();

  const menu = page.locator("#suiteOverflow");
  await menu.waitFor({ state: "visible" });
  const menuButtons = menu.locator("button");
  if (await menuButtons.count() !== 1 || (await menuButtons.first().textContent()).trim() !== "删除") {
    throw new Error("更多菜单未只展示收拢后的删除操作");
  }
  if (!await menuButtons.first().evaluate((button) => button.classList.contains("danger"))) {
    throw new Error("更多菜单中的删除未使用危险态");
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`${width}px 视口出现 ${overflow}px 横向溢出`);
  await page.screenshot({ path: path.join(outputDir, `row-actions-menu-${width}x${height}.png`) });

  const originalRows = await table.locator("tbody tr").count();
  await menuButtons.first().click();
  const confirmModal = page.locator("#managementConfirm");
  if (await confirmModal.isHidden()) throw new Error("菜单删除未打开确认弹窗");
  if (await menu.count()) throw new Error("打开删除确认弹窗后更多菜单未关闭");
  if (await table.locator("tbody tr").count() !== originalRows) throw new Error("确认前文件行已被删除");
  await confirmModal.locator("[data-close-management-modal]").last().click();
  if (await table.locator("tbody tr").count() !== originalRows) throw new Error("取消删除后文件行未保留");

  await more.click();
  await page.keyboard.press("Escape");
  if (await page.locator("#suiteOverflow").count()) throw new Error("Esc 未关闭更多菜单");
  if (await more.getAttribute("aria-expanded") !== "false") throw new Error("更多按钮展开状态未复位");

  await page.close();
  return { width, labels, menuItem: "删除", confirmationOpened: true, overflow };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  try {
    const results = [];
    results.push(await verifyViewport(browser, 1440, 722));
    results.push(await verifyViewport(browser, 1280, 722));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
