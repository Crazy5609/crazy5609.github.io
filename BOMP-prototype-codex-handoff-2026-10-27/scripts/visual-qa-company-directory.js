const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "company-directory-2.11.3");
const url = "http://127.0.0.1:4173/pages/prototype-suite/company-library.html?refresh=2.11.3#company-directory-r107-l2";
const managementUrl = "http://127.0.0.1:4173/pages/prototype-suite/company-directory-management.html?refresh=2.9.0";
const homeUrl = "http://127.0.0.1:4173/pages/prototype-suite/home.html?refresh=2.9.0";
const expectedRoots = ["核心业务", "法律法规", "管理制度", "工作规则", "会议文件", "培训学习", "党的建设", "新闻宣传", "创新成果", "经验案例", "模板表格"];
const expectedCoreChildren = ["数字化专业", "招标采购专业", "物资供应专业", "合同管理专业", "质量监督专业"];
const expectedFiles = [
  "国网物资有限公司系统运维和数字化支撑成本性项目管理细则（试行）.docx",
  "国网物资有限公司电网数字化项目管理办法（试行）.docx",
  "国家电网有限公司供应链数据管理实施细则.docx",
  "国家电网有限公司数字化架构管理办法.docx",
  "国家电网有限公司供应链运营管理办法.docx",
  "国家电网有限公司电网数字化建设管理办法.docx",
  "国家电网有限公司数据管理办法.docx",
  "国家电网公司信息系统运行管理办法.docx"
];

async function inspect(page, width) {
  await page.setViewportSize({ width, height: 730 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("bomp-sidebar");
  await page.waitForFunction(() => document.querySelector("bomp-sidebar")?.shadowRoot?.querySelector(".nav-scroll"));

  const handle = page.locator("bomp-sidebar .sidebar-resize-handle");
  const handleBox = await handle.boundingBox();
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + 120);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 140, handleBox.y + 120, { steps: 8 });
  await page.mouse.up();

  const result = await page.evaluate(({ expectedRoots, expectedCoreChildren, expectedFiles }) => {
    const host = document.querySelector("bomp-sidebar");
    const root = host.shadowRoot;
    const getItem = (key) => root.querySelector(`.nav-item[data-key="${key}"]`);
    const company = getItem("company-library");
    const companyGroup = company.parentElement.querySelector(":scope > .tree-children");
    const roots = Array.from(companyGroup.querySelectorAll(":scope > .tree-node > .nav-item > .nav-label"), (node) => node.textContent.trim());
    const core = getItem("company-core-business");
    const coreGroup = core.parentElement.querySelector(":scope > .tree-children");
    const coreChildren = Array.from(coreGroup.querySelectorAll(":scope > .tree-node > .nav-item > .nav-label"), (node) => node.textContent.trim());
    ["company-core-business", "company-directory-r3-l2", "company-directory-r3-l3"].forEach((key) => {
      const item = getItem(key);
      if (item?.getAttribute("aria-expanded") === "false") item.querySelector(".nav-chevron")?.click();
    });
    const nav = root.querySelector(".nav-scroll");
    const sidebar = root.querySelector(".sidebar");
    const main = document.querySelector(".prototype-main");
    const fileNames = Array.from(document.querySelectorAll(".table-library-company .doc-name button"), (node) => node.textContent.trim());
    return {
      roots,
      coreChildren,
      rootMatch: JSON.stringify(roots) === JSON.stringify(expectedRoots),
      childMatch: JSON.stringify(coreChildren) === JSON.stringify(expectedCoreChildren),
      fileNames,
      fileMatch: JSON.stringify(fileNames) === JSON.stringify(expectedFiles),
      deepNodeVisible: getItem("company-directory-r3-l4")?.offsetParent !== null,
      companyExpanded: company.getAttribute("aria-expanded"),
      coreExpanded: core.getAttribute("aria-expanded"),
      activeKey: root.querySelector(".nav-item.is-active")?.dataset.key || "",
      sidebarWidth: Math.round(host.getBoundingClientRect().width),
      mainMarginLeft: Math.round(parseFloat(getComputedStyle(main).marginLeft)),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sidebarOverflow: sidebar.scrollWidth - sidebar.clientWidth,
      navOverflow: nav.scrollWidth - nav.clientWidth
    };
  }, { expectedRoots, expectedCoreChildren, expectedFiles });

  await page.screenshot({ path: path.join(outputDir, `company-library-${width}x730.png`), fullPage: true });
  return { width, ...result };
}

async function inspectManagement(page) {
  await page.setViewportSize({ width: 1440, height: 730 });
  await page.goto(managementUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".management-directory-layout");
  const result = await page.evaluate(({ expectedRoots }) => {
    const groups = Array.from(document.querySelectorAll(".tree-list > .management-tree-group"));
    const roots = groups.map((group) => group.querySelector(":scope > .management-tree-row .management-directory-node")?.textContent.trim());
    return {
      roots,
      rootMatch: JSON.stringify(roots) === JSON.stringify(expectedRoots),
      hasDeepNodes: document.querySelectorAll(".tree-list .management-tree-group[style*='--tree-level:4']").length > 0,
      selectedName: document.querySelector("#directoryName")?.textContent.trim() || "",
      selectedCount: document.querySelector("#directoryCount")?.textContent.trim() || "",
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  }, { expectedRoots });
  await page.screenshot({ path: path.join(outputDir, "company-directory-management-1440x730.png"), fullPage: true });
  return result;
}

async function inspectHome(page) {
  await page.setViewportSize({ width: 1440, height: 730 });
  await page.goto(homeUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("bomp-sidebar")?.shadowRoot?.querySelector(".sidebar-resize-handle"));
  const handle = page.locator("bomp-sidebar .sidebar-resize-handle");
  await handle.dblclick();
  const handleBox = await handle.boundingBox();
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + 120);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 120, handleBox.y + 120, { steps: 8 });
  await page.mouse.up();
  const result = await page.evaluate(() => {
    const host = document.querySelector("bomp-sidebar");
    const root = host.shadowRoot;
    ["company-library", "company-core-business", "company-directory-r3-l2"].forEach((key) => {
      const item = root.querySelector(`.nav-item[data-key="${key}"]`);
      if (item?.getAttribute("aria-expanded") === "false") item.querySelector(".nav-chevron")?.click();
    });
    const main = document.querySelector(".prototype-main");
    return {
      sidebarWidth: Math.round(host.getBoundingClientRect().width),
      mainMarginLeft: Math.round(parseFloat(getComputedStyle(main).marginLeft)),
      deepNodeVisible: root.querySelector('.nav-item[data-key="company-directory-r3-l3"]')?.offsetParent !== null,
      documentOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      documentOverflowY: document.documentElement.scrollHeight - document.documentElement.clientHeight
    };
  });
  await page.screenshot({ path: path.join(outputDir, "home-resizable-sidebar-1440x730.png"), fullPage: true });
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
    for (const width of [1920, 1440, 1280]) results.push(await inspect(page, width));
    const management = await inspectManagement(page);
    const home = await inspectHome(page);
    const failed = results.some((item) => !item.rootMatch || !item.childMatch || !item.fileMatch || !item.deepNodeVisible || item.activeKey !== "company-directory-r107-l2" || item.sidebarWidth < 340 || item.sidebarWidth !== item.mainMarginLeft || item.documentOverflow > 0 || item.sidebarOverflow > 0 || item.navOverflow > 0) || !management.rootMatch || !management.hasDeepNodes || management.selectedName !== "供应链业务架构管理" || management.selectedCount !== "8" || management.documentOverflow > 0 || !home.deepNodeVisible || home.sidebarWidth !== home.mainMarginLeft || home.documentOverflowX > 0 || home.documentOverflowY > 0;
    console.log(JSON.stringify({ library: results, management, home }, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
