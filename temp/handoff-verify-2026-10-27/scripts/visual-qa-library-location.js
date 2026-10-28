const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "qa", "library-location-2.11.2");
const baseUrl = "http://127.0.0.1:4173";
const targets = [
  ["department", "/pages/prototype-suite/department-library.html?refresh=2.11.2#dept-supply-chain-architecture"],
  ["company", "/pages/prototype-suite/company-library.html?refresh=2.11.2#company-core-business"]
];
const viewports = [
  { width: 1280, height: 720 },
  { width: 1567, height: 910 }
];

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const results = [];
  try {
    const page = await browser.newPage();
    for (const [name, url] of targets) {
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(baseUrl + url, { waitUntil: "networkidle" });
        await page.waitForSelector(".table-library tbody tr");
        const result = await page.evaluate(() => {
          const table = document.querySelector(".table-library");
          const headers = Array.from(table.querySelectorAll("thead th"));
          const locationIndex = headers.findIndex((header) => header.textContent.trim() === "文件位置");
          const locations = Array.from(table.querySelectorAll("tbody tr")).map((row) => {
            const cell = row.children[locationIndex];
            const label = cell.querySelector(".cell-ellipsis");
            const text = label.textContent.trim();
            const title = label.getAttribute("title") || "";
            const terminal = title.split("/").map((part) => part.trim()).filter(Boolean).pop() || "";
            return { text, title, terminal };
          });
          return {
            locationIndex,
            locations,
            documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            tableOverflow: table.scrollWidth - table.clientWidth
          };
        });
        await page.locator(".table-library tbody tr:first-child .cell-ellipsis").hover();
        await page.screenshot({
          path: path.join(outputDir, `${name}-${viewport.width}.png`),
          fullPage: true
        });
        results.push({ name, viewport, ...result });
      }
    }
  } finally {
    await browser.close();
  }

  const failures = results.filter((result) => (
    result.locationIndex < 0 ||
    result.documentOverflow > 0 ||
    result.tableOverflow > 0 ||
    result.locations.length < 8 ||
    result.locations.some((item) => item.text.includes("/") || !item.title.includes("/") || item.text !== item.terminal)
  ));
  fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
