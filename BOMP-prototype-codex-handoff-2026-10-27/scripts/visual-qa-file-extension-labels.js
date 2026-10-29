const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "file-extension-labels-2.97.0");
fs.mkdirSync(outputDir, { recursive: true });

async function inspect(page, name, width, expectedLabels) {
  await page.setViewportSize({ width, height: 722 });
  await page.goto(`http://127.0.0.1:4174/pages/prototype-suite/${name}.html?refresh=2.97.0`, { waitUntil: "networkidle" });
  await page.locator(".suite-table").first().waitFor();
  const result = await page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll(".doc-icon")).filter((icon) => !icon.querySelector("img"));
    return {
      labels: icons.map((icon) => icon.textContent.trim()).filter(Boolean),
      overflowingIcons: icons.filter((icon) => icon.scrollWidth > icon.clientWidth + 1 || icon.scrollHeight > icon.clientHeight + 1).map((icon) => icon.textContent.trim()),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });
  expectedLabels.forEach((label) => {
    if (!result.labels.includes(label)) throw new Error(`${name} ${width}px missing ${label}: ${result.labels.join(", ")}`);
  });
  if (result.labels.some((label) => ["VID", "IMG", "AUD", "W", "X", "P"].includes(label))) {
    throw new Error(`${name} ${width}px still has generic labels: ${result.labels.join(", ")}`);
  }
  if (result.overflowingIcons.length) throw new Error(`${name} ${width}px icon overflow: ${result.overflowingIcons.join(", ")}`);
  if (result.horizontalOverflow) throw new Error(`${name} ${width}px page overflow: ${result.scrollWidth} > ${result.viewportWidth}`);
  await page.screenshot({ path: path.join(outputDir, `${name}-${width}x722.png`), fullPage: true });
  return result;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage();
  const report = [];
  report.push({ page: "review-workbench", width: 1440, result: await inspect(page, "review-workbench", 1440, ["MP4", "PNG", "DOCX", "XLSX"]) });
  report.push({ page: "review-workbench", width: 1280, result: await inspect(page, "review-workbench", 1280, ["MP4", "PNG", "DOCX", "XLSX"]) });
  report.push({ page: "my-knowledge", width: 1440, result: await inspect(page, "my-knowledge", 1440, ["DOCX", "PDF", "PPTX", "XLSX"]) });
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
