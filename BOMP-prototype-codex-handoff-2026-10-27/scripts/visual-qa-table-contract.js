const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "table-contract-2.19.0");
const baseUrl = process.env.BOMP_QA_BASE_URL || "http://127.0.0.1:4174";
const viewports = [1280, 1440];
const targets = [
  ["recent", "/pages/prototype-suite/my-library.html?qa=table-contract"],
  ["knowledge", "/pages/prototype-suite/my-knowledge.html?qa=table-contract"],
  ["collaboration", "/pages/prototype-suite/my-collaboration.html?qa=table-contract"],
  ["favorites", "/pages/prototype-suite/my-favorites.html?qa=table-contract"],
  ["uploads", "/pages/prototype-suite/my-uploads.html?qa=table-contract"],
  ["sharing", "/pages/prototype-suite/my-sharing.html?qa=table-contract"],
  ["browsing", "/pages/prototype-suite/my-browsing.html?qa=table-contract"],
  ["downloads", "/pages/prototype-suite/my-downloads.html?qa=table-contract"],
  ["recycle", "/pages/prototype-suite/my-recycle-bin.html?qa=table-contract"],
  ["search", "/pages/prototype-suite/document-search.html?qa=table-contract"],
  ["department-library", "/pages/prototype-suite/department-library.html?qa=table-contract#dept-architecture-management"],
  ["company-library", "/pages/prototype-suite/company-library.html?qa=table-contract#company-core-business"],
  ["review", "/pages/prototype-suite/review-workbench.html?qa=table-contract"],
  ["department-management", "/pages/prototype-suite/knowledge-management.html?qa=table-contract"],
  ["department-uploads", "/pages/prototype-suite/department-upload-tasks.html?qa=table-contract"],
  ["department-sharing", "/pages/prototype-suite/department-sharing-management.html?qa=table-contract"],
  ["department-recycle", "/pages/prototype-suite/department-recycle-bin.html?qa=table-contract"],
  ["company-knowledge", "/pages/prototype-suite/company-knowledge-management.html?qa=table-contract"],
  ["company-uploads", "/pages/prototype-suite/company-upload-tasks.html?qa=table-contract"],
  ["company-sharing", "/pages/prototype-suite/company-sharing-management.html?qa=table-contract"],
  ["company-recycle", "/pages/prototype-suite/company-recycle-bin.html?qa=table-contract"],
  ["tag-management", "/pages/prototype-suite/tag-management.html?qa=table-contract"],
  ["department-upload-flow", "/pages/prototype-suite/department-knowledge-upload.html?qa=table-contract"],
  ["public-knowledge-table", "/pages/search-results.html?qa=table-contract", true]
];

const screenshotTargets = new Set([
  "recent",
  "review",
  "company-knowledge",
  "tag-management",
  "department-upload-flow",
  "public-knowledge-table"
]);

async function inspect(page, name, url, shadowTable, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(baseUrl + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(150);

  const metrics = await page.evaluate((useShadowTable) => {
    const roots = [document];
    if (useShadowTable) {
      document.querySelectorAll("bomp-knowledge-table").forEach((host) => {
        if (host.shadowRoot) roots.push(host.shadowRoot);
      });
    }
    const tables = roots.flatMap((root) => Array.from(root.querySelectorAll("table"))).filter((table) => {
      const columns = Array.from(table.querySelectorAll(":scope > colgroup > col"));
      return columns.some((column) => column.classList.contains("col-name")) && columns.some((column) => column.classList.contains("col-actions"));
    });

    const tableMetrics = tables.map((table, tableIndex) => {
      const columns = Array.from(table.querySelectorAll(":scope > colgroup > col")).map((column) =>
        Array.from(column.classList).find((className) => className.startsWith("col-"))?.slice(4) || ""
      );
      const nameIndex = columns.indexOf("name");
      const actionIndex = columns.indexOf("actions");
      const rows = Array.from(table.querySelectorAll("tbody tr")).filter((row) => row.children.length === columns.length);
      const nameCells = rows.map((row) => row.children[nameIndex]).filter(Boolean);
      const actionCells = rows.map((row) => row.children[actionIndex]).filter(Boolean);
      const headerCells = Array.from(table.querySelectorAll("thead th"));
      const middleIndexes = columns.map((_, index) => index).filter((index) => index !== 0 && index !== nameIndex && index !== actionIndex);
      const middlePaddings = middleIndexes.map((index) => {
        const cell = rows[0]?.children[index] || headerCells[index];
        if (!cell) return null;
        const style = getComputedStyle(cell);
        return [Number.parseFloat(style.paddingLeft), Number.parseFloat(style.paddingRight)];
      }).filter(Boolean);
      const actionPaddings = actionCells.concat(headerCells[actionIndex] || []).map((cell) => Number.parseFloat(getComputedStyle(cell).paddingRight));
      const nameLines = nameCells.map((cell) => {
        const target = cell.querySelector(".doc-name button, .scoped-folder-link span, .tag-name-cell strong, .file-cell strong, .file-title") || cell;
        const style = getComputedStyle(target);
        const range = document.createRange();
        range.selectNodeContents(target);
        const lineTops = Array.from(range.getClientRects()).map((rect) => Math.round(rect.top));
        return {
          whiteSpace: style.whiteSpace,
          lineCount: new Set(lineTops).size,
          scrollWidth: target.scrollWidth,
          clientWidth: target.clientWidth
        };
      });
      return {
        tableIndex,
        columns,
        nameIndex,
        actionIndex,
        expectedNameIndex: columns[0] === "check" ? 1 : 0,
        actionPaddings,
        middlePaddings,
        nameLines,
        tableOverflow: table.scrollWidth - table.clientWidth
      };
    });

    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tables: tableMetrics
    };
  }, shadowTable);

  if (screenshotTargets.has(name)) {
    await page.screenshot({ path: path.join(outputDir, `${name}-${width}.png`), fullPage: true });
  }

  return { name, width, ...metrics };
}

function failuresFor(result) {
  const failures = [];
  if (result.documentOverflow > 0) failures.push(`page overflow ${result.documentOverflow}px`);
  if (!result.tables.length) failures.push("no semantic business table found");
  result.tables.forEach((table) => {
    const prefix = `table ${table.tableIndex + 1}`;
    if (table.nameIndex !== table.expectedNameIndex) failures.push(`${prefix}: name column order`);
    if (table.actionIndex !== table.columns.length - 1) failures.push(`${prefix}: action column is not last`);
    if (table.tableOverflow > 1) failures.push(`${prefix}: overflow ${table.tableOverflow}px`);
    if (table.actionPaddings.some((value) => value < 20 || value > 40)) failures.push(`${prefix}: action right padding outside 20-40px`);
    if (table.middlePaddings.some(([left, right]) => Math.abs(left - right) > 0.5 || Math.abs(left - 12) > 0.5)) failures.push(`${prefix}: inconsistent middle padding`);
    if (table.nameLines.some((line) => line.whiteSpace !== "nowrap" || line.lineCount > 1)) failures.push(`${prefix}: name wraps`);
  });
  return failures;
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
    for (const [name, url, shadowTable] of targets) {
      for (const width of viewports) results.push(await inspect(page, name, url, Boolean(shadowTable), width));
    }
    const failures = results.flatMap((result) => failuresFor(result).map((failure) => `${result.name}@${result.width}: ${failure}`));
    fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify(results, null, 2));
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
