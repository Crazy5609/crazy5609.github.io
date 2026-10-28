const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const baseUrl = "http://127.0.0.1:4174/pages/prototype-suite/company-directory-management.html?refresh=2.17.9";
const outputDir = path.resolve(__dirname, "../outputs/visual-qa/company-directory-two-levels");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true,
  });

  try {
    for (const width of [1440, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForSelector(".management-directory-layout .directory-tree");

      const result = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll(".management-directory-layout [data-directory-node]"));
        return {
          levels: nodes.map((node) => Number(node.closest("[data-directory-group]").style.getPropertyValue("--tree-level"))),
          names: nodes.map((node) => node.dataset.name),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });

      assert(Math.max(...result.levels) === 1, `${width}px 公司目录树不止两级：${Math.max(...result.levels) + 1}级`);
      assert(result.names.includes("核心业务") && result.names.includes("数字化专业"), `${width}px 公司目录树缺少一级或二级目录`);
      assert(!result.names.includes("架构管理"), `${width}px 公司目录树仍显示第三级目录`);
      assert(result.scrollWidth <= result.clientWidth, `${width}px 页面出现横向滚动：${result.scrollWidth} > ${result.clientWidth}`);
      assert((await page.locator("#directoryPath").count()) === 0, `${width}px 公司目录详情仍展示完整路径`);
      assert((await page.locator(".management-directory-layout .tree-root-label").count()) === 0, `${width}px 公司目录树仍展示公司级目录根标签`);

      await page.getByRole("button", { name: "数字化专业", exact: true }).click();
      assert((await page.locator("#directoryName").textContent()).trim() === "数字化专业", `${width}px 二级目录未驱动右侧详情`);
      await page.screenshot({ path: path.join(outputDir, `company-directory-${width}.png`), fullPage: true });
      await page.close();
    }

    console.log("Company directory two-level visual QA passed at 1440px and 1280px.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
