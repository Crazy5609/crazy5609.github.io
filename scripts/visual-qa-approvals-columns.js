const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "my-sharing-columns-2.13.0");
const url = "http://127.0.0.1:4173/pages/prototype-suite/my-sharing.html?refresh=2.13.0";
const expectedRatios = [0.26, 0.10, 0.20, 0.10, 0.09, 0.16, 0.09];

async function inspect(page, width) {
  await page.setViewportSize({ width, height: width === 1920 ? 910 : 730 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".table-sharing tbody tr");

  const result = await page.evaluate((expectedRatios) => {
    const table = document.querySelector(".table-sharing");
    const headers = Array.from(table.querySelectorAll("thead th"));
    const tableWidth = table.getBoundingClientRect().width;
    const widths = headers.map((header) => Math.round(header.getBoundingClientRect().width));
    const ratios = widths.map((value) => Number((value / tableWidth).toFixed(3)));
    const ratioMatch = ratios.every((value, index) => Math.abs(value - expectedRatios[index]) <= 0.012);
    const actionsFit = Array.from(table.querySelectorAll("tbody .action-cell")).every((cell) => cell.scrollWidth <= cell.clientWidth + 1);
    const timesFit = Array.from(table.querySelectorAll("tbody tr td:nth-child(6)")).every((cell) => cell.scrollWidth <= cell.clientWidth + 1);
    const headersFit = headers.every((header) => header.scrollWidth <= header.clientWidth + 1 && header.scrollHeight <= header.clientHeight + 1);
    return {
      tableWidth: Math.round(tableWidth),
      widths,
      ratios,
      ratioMatch,
      actionsFit,
      timesFit,
      headersFit,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tableOverflow: table.scrollWidth - table.clientWidth
    };
  }, expectedRatios);

  await page.screenshot({ path: path.join(outputDir, `my-sharing-${width}.png`), fullPage: true });
  return { width, ...result };
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
    const failed = results.some((item) => !item.ratioMatch || !item.actionsFit || !item.timesFit || !item.headersFit || item.documentOverflow > 0 || item.tableOverflow > 0);
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
