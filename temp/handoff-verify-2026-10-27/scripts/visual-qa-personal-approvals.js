const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "personal-approvals-2.13.0");
const url = "http://127.0.0.1:4173/pages/prototype-suite/my-approvals.html?refresh=2.13.0";

async function inspect(page, width) {
  await page.setViewportSize({ width, height: width === 1920 ? 910 : 730 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".review-page .table-review tbody tr");

  const result = await page.evaluate(() => {
    const sidebar = document.querySelector("#appSidebar").shadowRoot;
    const labels = Array.from(sidebar.querySelectorAll(".nav-label"), (node) => node.textContent.trim());
    const active = sidebar.querySelector('.nav-item[aria-current="page"] .nav-label');
    const table = document.querySelector(".table-review");
    return {
      heading: document.querySelector(".suite-crumb")?.textContent.replace(/\s+/g, " ").trim(),
      activeLabel: active?.textContent.trim(),
      hasMySharing: labels.includes("我的共享"),
      hasMyApprovals: labels.includes("我的审批"),
      hasStandaloneWorkbench: labels.includes("审核工作台"),
      statusTabCount: document.querySelectorAll(".review-tabs button").length,
      hasBatchApprove: Boolean(document.querySelector('[data-review-bulk="通过"]')),
      hasBatchReturn: Boolean(document.querySelector('[data-review-bulk="退回"]')),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tableOverflow: table.scrollWidth - table.clientWidth
    };
  });

  await page.screenshot({ path: path.join(outputDir, `my-approvals-${width}.png`), fullPage: true });

  if (width === 1440) {
    await page.locator("[data-review-open]").first().click();
    await page.waitForSelector("#reviewDrawer:not([hidden])");
    const drawerVisible = await page.locator("#reviewDrawer").isVisible();
    await page.screenshot({ path: path.join(outputDir, "my-approvals-drawer-1440.png"), fullPage: true });
    return { width, drawerVisible, ...result };
  }

  return { width, drawerVisible: true, ...result };
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
    const failed = results.some((item) => item.heading !== "个人中心>我的审批" || item.activeLabel !== "我的审批" || !item.hasMySharing || !item.hasMyApprovals || item.hasStandaloneWorkbench || item.statusTabCount !== 4 || !item.hasBatchApprove || !item.hasBatchReturn || !item.drawerVisible || item.documentOverflow > 0 || item.tableOverflow > 0);
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
