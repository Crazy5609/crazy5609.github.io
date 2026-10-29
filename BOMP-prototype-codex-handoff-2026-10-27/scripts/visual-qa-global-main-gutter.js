const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const baseUrl = "http://127.0.0.1:4174";
const outputDir = path.join(__dirname, "..", "outputs", "visual-qa", "global-main-gutter-2.4.0");
const pages = [
  "pages/prototype-suite/knowledge-management.html",
  "pages/prototype-suite/home.html",
  "pages/prototype-suite/my-library.html",
  "pages/prototype-suite/review-workbench.html",
  "pages/prototype-suite/department-knowledge-upload.html",
  "pages/home.html",
  "pages/recent-use.html",
  "pages/search-results.html"
];
const viewports = [
  { width: 1440, height: 722 },
  { width: 1280, height: 722 }
];

async function run() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  const results = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => sessionStorage.removeItem("bomp-sidebar-width"));

      for (const pagePath of pages) {
        const page = await context.newPage();
        await page.goto(`${baseUrl}/${pagePath}?gutterQa=2.4.0`, { waitUntil: "networkidle" });
        await page.locator("bomp-sidebar").waitFor({ state: "attached" });
        await page.locator("main.prototype-main").waitFor({ state: "visible" });

        const measurement = await page.evaluate(() => {
          const sidebarHost = document.querySelector("bomp-sidebar");
          const main = document.querySelector("main.prototype-main");
          if (!sidebarHost || !main) throw new Error("Missing sidebar or main content element");
          const sidebarRight = sidebarHost.getBoundingClientRect().right;
          const mainRect = main.getBoundingClientRect();
          const mainPaddingLeft = Number.parseFloat(getComputedStyle(main).paddingLeft);
          return {
            sidebarRight,
            mainContentLeft: mainRect.left + mainPaddingLeft,
            mainPaddingLeft,
            gap: mainRect.left + mainPaddingLeft - sidebarRight,
            overflow: document.documentElement.scrollWidth - window.innerWidth
          };
        });

        const slug = pagePath.replace(/^pages\//, "").replace(/[/.]/g, "-");
        await page.screenshot({
          path: path.join(outputDir, `${slug}-${viewport.width}x${viewport.height}.png`),
          fullPage: false
        });
        results.push({ pagePath, viewport: `${viewport.width}x${viewport.height}`, ...measurement });
        await page.close();
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outputDir, "measurements.json"), `${JSON.stringify(results, null, 2)}\n`);
  const failures = results.filter((item) => Math.abs(item.gap - 10) > 1 || item.overflow > 1);
  console.table(results);
  if (failures.length) {
    throw new Error(`Global gutter QA failed for ${failures.length} page/viewport combinations`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
