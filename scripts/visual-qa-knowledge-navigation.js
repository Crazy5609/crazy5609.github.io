const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "qa", "knowledge-navigation-4.0.0");
const departmentUrl = "http://127.0.0.1:4173/pages/prototype-suite/department-library.html?refresh=4.0.0#dept-supply-chain-architecture";
const companyUrl = "http://127.0.0.1:4173/pages/prototype-suite/company-library.html?refresh=4.0.0#company-core-business";
const departmentRoots = [
  "架构管理", "数字化需求管理", "综合计划-数字化建设专业归口管理", "数字化项目建设管理",
  "非数字化项目管理（如管理研究项目、科技项目等）", "网络安全管理", "运维管理", "运营体系建设", "供应链平台运营管理",
  "人工智能运营管理", "数据管理", "数字化专项工作", "数字化工作领导小组", "综合工作"
];
const companyRoots = ["核心业务", "法律法规", "管理制度", "工作规则", "会议文件", "培训学习", "党的建设", "新闻宣传", "创新成果", "经验案例", "模板表格"];

async function resizeSidebar(page) {
  const handle = page.locator("bomp-sidebar .sidebar-resize-handle");
  await handle.dblclick();
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 120);
  await page.mouse.down();
  await page.mouse.move(box.x + 200, box.y + 120, { steps: 10 });
  await page.mouse.up();
}

async function inspect(page, url, libraryKey, expectedRoots, width) {
  await page.setViewportSize({ width, height: width === 1920 ? 910 : 720 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("bomp-sidebar")?.shadowRoot?.querySelector(".nav-scroll"));
  await resizeSidebar(page);
  const result = await page.evaluate(({ libraryKey, expectedRoots }) => {
    const host = document.querySelector("bomp-sidebar");
    const root = host.shadowRoot;
    const library = root.querySelector(`.nav-item[data-key="${libraryKey}"]`);
    const group = library.parentElement.querySelector(":scope > .tree-children");
    const roots = Array.from(group.querySelectorAll(":scope > .tree-node > .nav-item > .nav-label"), (node) => node.textContent.trim());
    const sidebar = root.querySelector(".sidebar");
    const nav = root.querySelector(".nav-scroll");
    return {
      roots,
      rootsMatch: JSON.stringify(roots) === JSON.stringify(expectedRoots),
      activeKey: root.querySelector(".nav-item.is-active")?.dataset.key || "",
      ancestorKeys: Array.from(root.querySelectorAll(".nav-item.is-ancestor-active"), (node) => node.dataset.key),
      sidebarWidth: Math.round(host.getBoundingClientRect().width),
      mainMarginLeft: Math.round(parseFloat(getComputedStyle(document.querySelector(".prototype-main")).marginLeft)),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sidebarOverflow: sidebar.scrollWidth - sidebar.clientWidth,
      navOverflow: nav.scrollWidth - nav.clientWidth
    };
  }, { libraryKey, expectedRoots });
  return result;
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
    for (const width of [1920, 1280]) {
      const department = await inspect(page, departmentUrl, "department-library", departmentRoots, width);
      await page.screenshot({ path: path.join(outputDir, `department-${width}.png`), fullPage: true });
      const company = await inspect(page, companyUrl, "company-library", companyRoots, width);
      results.push({ width, department, company });
    }
    const failed = results.some(({ department, company }) =>
      !department.rootsMatch || department.activeKey !== "dept-supply-chain-architecture" ||
      !department.ancestorKeys.includes("dept-architecture-management") ||
      !company.rootsMatch || company.activeKey !== "company-core-business" ||
      [department, company].some((item) => item.sidebarWidth < 400 || item.sidebarWidth > 420 || item.mainMarginLeft !== item.sidebarWidth || item.documentOverflow > 0 || item.sidebarOverflow > 0 || item.navOverflow > 0)
    );
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
