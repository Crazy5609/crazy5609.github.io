const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const localTemp = path.join(projectRoot, ".tmp");
fs.mkdirSync(localTemp, { recursive: true });
process.env.TEMP = localTemp;
process.env.TMP = localTemp;
process.env.TMPDIR = localTemp;
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(projectRoot, ".cache", "playwright");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const baseUrl = process.env.BOMP_QA_BASE_URL || "http://127.0.0.1:4174";
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "department-management-tabs-2.46.0");
const pages = [
  "library-management.html",
  "knowledge-management.html",
  "department-upload-tasks.html",
  "department-sharing-management.html",
  "department-recycle-bin.html",
  "department-management-log.html",
  "department-directory-management.html"
];
const expected = ["知识统计", "知识管理", "上传任务", "共享管理", "回收站", "管理日志"];

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const results = [];
  try {
    const page = await browser.newPage();
    for (const width of [1920, 1280]) {
      await page.setViewportSize({ width, height: 902 });
      for (const file of pages) {
        await page.goto(`${baseUrl}/pages/prototype-suite/${file}?refresh=2.46.0`, { waitUntil: "networkidle" });
        const result = await page.evaluate(() => {
          const tabs = document.querySelector('.management-tabs[aria-label="部门知识库管理"]');
          return {
            labels: Array.from(tabs?.querySelectorAll("a") || [], (link) => link.textContent.trim()),
            hasDirectoryLink: Boolean(tabs?.querySelector('a[href="department-directory-management.html"]')),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        });
        const failures = [];
        if (JSON.stringify(result.labels) !== JSON.stringify(expected)) failures.push(`labels: ${JSON.stringify(result.labels)}`);
        if (result.hasDirectoryLink) failures.push("directory tab remains");
        if (result.overflow > 0) failures.push(`horizontal overflow: ${result.overflow}px`);
        results.push({ width, file, ...result, failures });
        if (width === 1920 && file === "department-directory-management.html") {
          await page.screenshot({ path: path.join(outputDir, "department-directory-without-tab-1920x902.png"), fullPage: false });
        }
      }
    }
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}/${result.file}: ${failure}`));
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
