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
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "action-modals-2.81.0");

async function openPage(page, file) {
  await page.goto(`${baseUrl}/pages/prototype-suite/${file}?refresh=2.81.0`, { waitUntil: "networkidle" });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const failures = [];
  const results = {};
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 722 } });

    await openPage(page, "my-library.html");
    const shareTrigger = page.locator(".table-recent tbody tr").first().locator(".share-action");
    await shareTrigger.click();
    results.share = await page.evaluate(() => ({
      visible: !document.getElementById("shareModal").hidden,
      title: document.getElementById("shareFileName").textContent.trim(),
      selected: document.querySelectorAll("#shareModal [data-share-person]:checked").length,
      width: Math.round(document.querySelector("#shareModal .modal").getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    if (!results.share.visible || results.share.selected !== 3 || results.share.width !== 480 || results.share.overflow > 0) failures.push(`share modal ${JSON.stringify(results.share)}`);
    await page.screenshot({ path: path.join(outputDir, "share-1440x722.png"), fullPage: false });
    await page.locator("[data-clear-people]").click();
    await page.locator("[data-confirm-share]").click();
    const shareError = await page.locator("[data-share-error]").textContent();
    if (!shareError.includes("至少选择")) failures.push(`share validation ${shareError}`);
    await page.locator("[data-share-person-row]").first().click();
    await page.locator("[data-confirm-share]").click();
    if (!(await page.locator("#shareModal").evaluate((modal) => modal.hidden))) failures.push("share modal did not close");

    await openPage(page, "my-knowledge.html");
    await page.locator("[data-knowledge-table] tbody tr").nth(1).locator("[data-row-select]").check();
    const submitButton = page.locator("[data-share-submit]");
    if (await submitButton.isDisabled()) failures.push("knowledge share submission stayed disabled");
    await submitButton.click();
    results.submission = await page.evaluate(() => ({
      visible: !document.getElementById("shareSubmissionModal").hidden,
      fileCount: document.querySelectorAll("[data-share-submission-files] li").length,
      targetCount: document.querySelectorAll('[name="shareTarget"]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    if (!results.submission.visible || results.submission.fileCount !== 1 || results.submission.targetCount !== 2 || results.submission.overflow > 0) failures.push(`submission modal ${JSON.stringify(results.submission)}`);
    await page.screenshot({ path: path.join(outputDir, "share-submission-1440x722.png"), fullPage: false });
    await page.locator("[data-share-directory-toggle]").click();
    await page.locator("[data-share-directory-option]").first().click();
    await page.locator("#shareSubmissionForm button[type=submit]").click();
    const submissionToast = await page.locator("#suiteToast").textContent();
    if (!submissionToast.includes("共享提报申请已提交")) failures.push(`submission toast ${submissionToast}`);

    await openPage(page, "my-favorites.html");
    await page.locator("[data-more]").first().click();
    await page.locator("[data-copy-open]").click();
    results.copy = await page.evaluate(() => ({
      visible: !document.getElementById("copyModal").hidden,
      name: document.getElementById("copyName").value,
      width: Math.round(document.querySelector("#copyModal .modal").getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    if (!results.copy.visible || !results.copy.name.includes("副本") || results.copy.width !== 480 || results.copy.overflow > 0) failures.push(`copy modal ${JSON.stringify(results.copy)}`);
    await page.screenshot({ path: path.join(outputDir, "copy-1440x722.png"), fullPage: false });
    await page.locator("#copyName").fill("供应链运营中心年度重点工作任务清单 - 会议副本.docx");
    await page.locator("#copyForm button[type=submit]").click();
    const copyToast = await page.locator("#suiteToast").textContent();
    if (!copyToast.includes("会议副本")) failures.push(`copy toast ${copyToast}`);

    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ failures, results }, null, 2));
    console.log(JSON.stringify({ failures, results }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
