const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const url = "http://127.0.0.1:4173/pages/prototype-suite/tag-management.html?qa=1";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".tag-page");

  const initial = await page.evaluate(() => ({
    title: document.title,
    overview: document.querySelectorAll(".tag-overview-card").length,
    rows: document.querySelectorAll(".tag-table tbody tr[data-tag-id]").length,
    activeNav: document.querySelector("bomp-sidebar")?.shadowRoot?.querySelector(".nav-item.is-active")?.dataset.key,
    deleteDisabled: document.querySelector("[data-tag-delete]")?.disabled,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));

  await page.getByRole("button", { name: "新增标签" }).click();
  await page.getByLabel("标签名称").fill("知识运营");
  await page.getByLabel("标签体系").selectOption("专业标签");
  await page.getByRole("radio", { name: "多选" }).check();
  await page.getByLabel("标签说明").fill("知识运营和内容治理相关知识。");
  await page.getByRole("button", { name: "提交管理员审批" }).click();
  const approval = await page.locator("#tagToast").textContent();

  await page.getByPlaceholder("搜索标签名称、说明或维护人").fill("知识运营");
  const searchResult = await page.locator(".tag-table tbody tr[data-tag-id]").count();
  await page.locator(".tag-table tbody tr[data-tag-id]").click();
  const detailVisible = await page.locator("#tagDetailDrawer:not([hidden])").count();
  await page.getByRole("button", { name: "关闭详情" }).click();

  await page.getByPlaceholder("搜索标签名称、说明或维护人").fill("");
  await page.locator("[data-tag-toggle='level-company']").click();
  const disableModal = await page.locator("#tagConfirmModal:not([hidden])").count();
  await page.getByRole("button", { name: "确认停用" }).click();
  const disabledStatus = await page.locator("tr[data-tag-id='level-company'] .tag-status").textContent();

  const result = { initial, approval, searchResult, detailVisible, disableModal, disabledStatus, errors };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (errors.length || initial.title !== "BOMP-标签管理" || initial.overview !== 4 || initial.rows !== 8 || initial.activeNav !== "tag-management" || initial.overflow !== 0 || approval !== "已提交系统管理员审批" || searchResult !== 1 || detailVisible !== 1 || disableModal !== 1 || disabledStatus !== "停用") process.exitCode = 1;
})();
