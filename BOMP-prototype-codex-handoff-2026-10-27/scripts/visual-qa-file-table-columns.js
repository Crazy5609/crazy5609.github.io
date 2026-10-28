const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "qa", "file-table-columns-2.11.0");
const baseUrl = "http://127.0.0.1:4173";
const viewports = [1280, 1440, 1920];
const targets = [
  ["recent", "/pages/prototype-suite/my-library.html?refresh=2.11.0", ".table-recent"],
  ["knowledge", "/pages/prototype-suite/my-knowledge.html?refresh=2.11.0", ".table-knowledge"],
  ["collaboration", "/pages/prototype-suite/my-collaboration.html?refresh=2.11.0", ".table-collaboration"],
  ["favorites", "/pages/prototype-suite/my-favorites.html?refresh=2.11.0", ".table-favorites"],
  ["browsing", "/pages/prototype-suite/my-browsing.html?refresh=2.11.0", ".table-browsing"],
  ["downloads", "/pages/prototype-suite/my-downloads.html?refresh=2.11.0", ".table-downloads"],
  ["approvals", "/pages/prototype-suite/my-approvals.html?refresh=2.11.0", ".table-sharing"],
  ["uploads", "/pages/prototype-suite/my-uploads.html?refresh=2.11.0", ".table-uploads"],
  ["recycle", "/pages/prototype-suite/my-recycle-bin.html?refresh=2.11.0", ".table-recycle"],
  ["search", "/pages/prototype-suite/document-search.html?refresh=2.11.0", ".table-search-results"],
  ["department-library", "/pages/prototype-suite/department-library.html?refresh=2.11.0#dept-bomp-2025-project", ".table-library"],
  ["company-library", "/pages/prototype-suite/company-library.html?refresh=2.11.0#company-core-business", ".table-library"],
  ["review", "/pages/prototype-suite/review-workbench.html?refresh=2.11.0", ".table-review"],
  ["department-management", "/pages/prototype-suite/knowledge-management.html?refresh=2.11.0", ".table-management"],
  ["professional-management", "/pages/prototype-suite/professional-knowledge-management.html?refresh=2.11.0", ".scoped-management-table"],
  ["company-uploads", "/pages/prototype-suite/company-upload-tasks.html?refresh=2.11.0", ".company-task-table"],
  ["department-upload-flow", "/pages/prototype-suite/department-knowledge-upload.html?refresh=2.11.0", ".file-selection-table"],
  ["legacy-recent", "/pages/recent-use.html?refresh=1.1.0", ".recent-table"],
  ["public-search-results", "/pages/search-results.html?refresh=1.2.0", "bomp-knowledge-table", true]
];

async function inspect(page, name, url, selector, width, shadowTable) {
  const height = width === 1920 ? 910 : 730;
  await page.setViewportSize({ width, height });
  await page.goto(baseUrl + url, { waitUntil: "networkidle" });
  await page.waitForFunction(({ tableSelector, useShadow }) => {
    const host = document.querySelector(tableSelector);
    const table = useShadow ? host && host.shadowRoot && host.shadowRoot.querySelector("table") : host;
    return Boolean(table && table.querySelector("tbody tr"));
  }, { tableSelector: selector, useShadow: shadowTable });

  const metrics = await page.evaluate(({ tableSelector, useShadow }) => {
    const host = document.querySelector(tableSelector);
    const table = useShadow ? host.shadowRoot.querySelector("table") : host;
    const headers = Array.from(table.querySelectorAll("thead th"));
    const firstRow = table.querySelector("tbody tr");
    const cells = firstRow ? Array.from(firstRow.children) : [];
    const tableRect = table.getBoundingClientRect();
    const nameIndex = headers.findIndex((header) => /名称|标题/.test(header.textContent));
    const widths = headers.map((header) => Math.round(header.getBoundingClientRect().width));
    const nameWidth = nameIndex >= 0 ? widths[nameIndex] : 0;
    const nameRatio = tableRect.width ? Number((nameWidth / tableRect.width).toFixed(3)) : 0;
    const headerWraps = headers.filter((header) => header.scrollHeight > header.clientHeight + 1).map((header) => header.textContent.trim());
    const actionIndex = headers.findIndex((header) => header.textContent.trim() === "操作");
    const actionCell = actionIndex >= 0 ? cells[actionIndex] : null;
    const actionBounds = actionCell
      ? Array.from(actionCell.querySelectorAll("button")).map((button) => button.getBoundingClientRect())
      : [];
    const actionsInsideCell = !actionCell || actionBounds.every((rect) => {
      const cellRect = actionCell.getBoundingClientRect();
      return rect.left >= cellRect.left - 1 && rect.right <= tableRect.right + 1;
    });
    return {
      tableWidth: Math.round(tableRect.width),
      widths,
      nameIndex,
      nameWidth,
      nameRatio,
      headerWraps,
      actionsInsideCell,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tableOverflow: table.scrollWidth - table.clientWidth
    };
  }, { tableSelector: selector, useShadow: shadowTable });

  if (width === 1440) {
    await page.screenshot({ path: path.join(outputDir, `${name}-${width}.png`), fullPage: true });
  }
  return { name, width, ...metrics };
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
    for (const [name, url, selector, shadowTable] of targets) {
      for (const width of viewports) results.push(await inspect(page, name, url, selector, width, shadowTable));
    }
    const failures = results.filter((item) => (
      item.documentOverflow > 0 ||
      item.tableOverflow > 0 ||
      item.headerWraps.length > 0 ||
      !item.actionsInsideCell ||
      item.nameIndex < 0 ||
      item.nameRatio < 0.18 ||
      item.nameRatio > 0.52
    ));
    fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
