const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "qa", "system-sidebar-resize-4.1.1");
const baseUrl = "http://127.0.0.1:4173/";
const registry = JSON.parse(fs.readFileSync(path.join(projectRoot, "components", "registry.json"), "utf8"));
const sidebar = registry.components.find((component) => component.id === "app-sidebar");
const pagePaths = sidebar.usedBy.filter((item) => item.startsWith("pages/")).sort();
const screenshotPages = new Set([
  "pages/home.html",
  "pages/prototype-suite/company-library.html",
  "pages/prototype-suite/library-management.html",
  "pages/prototype-suite/my-approvals.html",
  "pages/prototype-suite/qa-result.html"
]);

async function waitForSidebar(page) {
  await page.waitForFunction(() => {
    const host = document.querySelector("bomp-sidebar");
    return Boolean(host?.shadowRoot?.querySelector(".sidebar-resize-handle"));
  }, null, { timeout: 10000 });
}

async function inspect(page, pagePath) {
  await page.goto(new URL(`${pagePath}?sidebar-qa=4.1.1`, baseUrl).href, { waitUntil: "domcontentloaded" });
  await waitForSidebar(page);
  await page.waitForFunction(() => {
    const host = document.querySelector("bomp-sidebar");
    const main = document.querySelector(".prototype-main");
    return host && main && Math.abs(host.getBoundingClientRect().width - parseFloat(getComputedStyle(main).marginLeft)) <= 1;
  }, null, { timeout: 3000 });
  const result = await page.evaluate(() => {
    const host = document.querySelector("bomp-sidebar");
    const handle = host.shadowRoot.querySelector(".sidebar-resize-handle");
    const main = document.querySelector(".prototype-main");
    const handleStyle = getComputedStyle(handle);
    const gripStyle = getComputedStyle(handle, "::before");
    return {
      sidebarWidth: Math.round(host.getBoundingClientRect().width),
      mainMarginLeft: main ? Math.round(parseFloat(getComputedStyle(main).marginLeft)) : null,
      handleWidth: Math.round(parseFloat(handleStyle.width)),
      gripHeight: Math.round(parseFloat(gripStyle.height)),
      ariaValue: Number(handle.getAttribute("aria-valuenow")),
      storedWidth: Number(sessionStorage.getItem("bomp-sidebar-width")),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  if (screenshotPages.has(pagePath)) {
    const fileName = pagePath.replace(/^pages\//, "").replaceAll("/", "-").replace(".html", "");
    await page.screenshot({ path: path.join(outputDir, `${fileName}-1280.png`), fullPage: true });
  }
  return { pagePath, ...result };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(new URL("pages/prototype-suite/home.html?sidebar-qa=4.1.1", baseUrl).href, { waitUntil: "domcontentloaded" });
    await waitForSidebar(page);
    await page.evaluate(() => sessionStorage.removeItem("bomp-sidebar-width"));
    const handle = page.locator("bomp-sidebar .sidebar-resize-handle");
    await handle.dblclick();
    const box = await handle.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + 160);
    await page.mouse.down();
    await page.mouse.move(box.x + 160, box.y + 160, { steps: 10 });
    await page.mouse.up();

    for (const pagePath of pagePaths) results.push(await inspect(page, pagePath));
  } finally {
    await browser.close();
  }

  const failures = results.filter((item) => (
    item.sidebarWidth < 375 || item.sidebarWidth > 385 ||
    item.mainMarginLeft !== item.sidebarWidth ||
    item.handleWidth < 10 || item.gripHeight !== 44 ||
    item.ariaValue !== item.sidebarWidth || item.storedWidth !== item.sidebarWidth ||
    item.documentOverflow > 0
  ));
  const report = { checked: results.length, failures, results };
  fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
  if (pagePaths.length !== 43 || failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
