const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs", "qa", "share-submission-2.14.0");
const url = "http://127.0.0.1:4173/pages/prototype-suite/my-library.html?refresh=2.14.0";

async function inspect(page, width) {
  const height = width === 1920 ? 910 : 730;
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: "networkidle" });

  const batchButton = page.locator("[data-recent-share-submit]");
  const disabledInitially = await batchButton.isDisabled();
  await page.locator("[data-recent-table] tbody [data-row-select]").nth(0).check();
  if (width === 1440) await page.locator("[data-recent-table] tbody [data-row-select]").nth(1).check();
  const enabledAfterSelection = await batchButton.isEnabled();
  await batchButton.click();
  await page.waitForSelector("#shareSubmissionModal:not([hidden])");

  const expectedCount = width === 1440 ? 2 : 1;
  const initial = await page.evaluate(() => {
    const flatten = (nodes, rootLabel) => {
      const paths = [];
      const visit = (node, parentPath) => {
        const currentPath = [...parentPath, node.label];
        paths.push(currentPath.join(" / "));
        (node.children || []).forEach((child) => visit(child, currentPath));
      };
      nodes.forEach((node) => visit(node, [rootLabel]));
      return paths;
    };
    const modal = document.querySelector("#shareSubmissionModal .modal");
    const rect = modal.getBoundingClientRect();
    const body = document.querySelector("#shareSubmissionModal .modal-body");
    const directoryValues = Array.from(document.querySelectorAll('[data-share-directory-row]:first-child [data-share-directory-option]'), (option) => option.dataset.shareDirectoryOption);
    const companyPaths = flatten(window.BompCompanyDirectoryData || [], "公司知识库");
    return {
      modalWidth: Math.round(rect.width),
      modalHeight: Math.round(rect.height),
      modalWithinViewport: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
      modalOverflow: modal.scrollWidth - modal.clientWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyScrollable: body.scrollHeight > body.clientHeight,
      selectedTarget: document.querySelector('[name="shareTarget"]:checked').value,
      fileCount: document.querySelectorAll("[data-share-submission-files] li").length,
      directoryOptions: directoryValues.length,
      companyDirectoryDataMatch: JSON.stringify(directoryValues) === JSON.stringify(companyPaths),
      audienceHidden: document.querySelector("[data-share-audience]").hidden,
      initialDirectoryRows: document.querySelectorAll("[data-share-directory-row]").length,
      hasAddDirectory: Boolean(document.querySelector("[data-share-directory-add]"))
    };
  });

  await page.getByRole("button", { name: "提交审核" }).click();
  const directoryError = await page.locator("[data-share-submission-error]").textContent();
  await page.locator("#shareSubmissionDescription").fill("建议作为供应链项目协同的统一参考材料，供相关岗位复用。");
  const descriptionCount = await page.locator("[data-share-description-count]").textContent();
  await page.getByRole("radio", { name: /部门知识库/ }).check();
  const departmentDefault = await page.getByRole("radio", { name: "本部门可见" }).isChecked();
  const departmentDirectoryOptions = await page.locator('[data-share-directory-row]:first-child [data-share-directory-option]').count();
  const departmentDirectoryDataMatch = await page.evaluate(() => {
    const paths = [];
    const visit = (node, parentPath) => {
      const currentPath = [...parentPath, node.label];
      paths.push(currentPath.join(" / "));
      (node.children || []).forEach((child) => visit(child, currentPath));
    };
    (window.BompDepartmentDirectoryData || []).forEach((node) => visit(node, ["供应链运营中心"]));
    const values = Array.from(document.querySelectorAll('[data-share-directory-row]:first-child [data-share-directory-option]'), (option) => option.dataset.shareDirectoryOption);
    return JSON.stringify(values) === JSON.stringify(paths);
  });
  await page.locator("[data-share-directory-toggle]").click();
  await page.locator("[data-share-directory-search]").fill("架构管理");
  const filteredDirectoryCount = await page.locator("[data-share-directory-option]:visible").count();
  const filteredDirectoryLabel = await page.locator("[data-share-directory-results]").textContent();
  await page.locator("[data-share-directory-search]").fill("");
  await page.locator('[data-share-directory-option]').nth(0).click();
  await page.locator("[data-share-directory-add]").click();
  const secondDirectoryToggle = page.locator("[data-share-directory-toggle]").nth(1);
  await secondDirectoryToggle.click();
  await page.locator("[data-share-directory-search]").nth(1).fill("供应链业务架构管理");
  await page.locator('[data-share-directory-row]').nth(1).locator('[data-share-directory-option]:visible').first().click();
  const selectedDirectoryCount = await page.locator('[name="shareDirectory"]').evaluateAll((inputs) => inputs.filter((input) => input.value).length);
  const directoryRowCount = await page.locator("[data-share-directory-row]").count();
  const selectableHierarchy = await page.locator('[name="shareDirectory"]').evaluateAll((inputs) => {
    const paths = inputs.map((input) => input.value).filter(Boolean);
    return paths.length === 2 && paths[0].split("/").length < paths[1].split("/").length;
  });
  await page.getByRole("radio", { name: "指定可见" }).check();
  const audienceVisible = await page.locator("[data-share-audience]").isVisible();
  await page.getByRole("button", { name: "提交审核" }).click();
  const audienceError = await page.locator("[data-share-submission-error]").textContent();
  await page.getByPlaceholder("搜索人员、部门或岗位").fill("供应链运营中心");

  if (width === 1920) {
    await page.locator("[data-share-directory-toggle]").first().click();
    await page.screenshot({ path: path.join(outputDir, "share-directory-options-1920.png"), fullPage: true });
    await page.locator("[data-share-directory-toggle]").first().click();
  }

  await page.screenshot({ path: path.join(outputDir, `share-submission-${width}.png`), fullPage: true });
  await page.keyboard.press("Escape");
  const closedByEscape = await page.locator("#shareSubmissionModal").evaluate((element) => element.hidden);
  const focusReturned = await batchButton.evaluate((button) => document.activeElement === button);

  await page.locator("[data-recent-table] tbody [data-more]").nth(0).click();
  await page.locator("[data-share-submit-single]").click();
  await page.waitForSelector("#shareSubmissionModal:not([hidden])");
  const singleFileCount = await page.locator("[data-share-submission-files] li").count();
  const singleFileName = await page.locator("[data-share-submission-files] li > span:nth-child(2)").textContent();
  await page.locator("[data-share-directory-toggle]").click();
  await page.locator('[data-share-directory-option]').nth(0).click();
  await page.locator("#shareSubmissionDescription").fill("申请纳入公司知识库，便于跨部门检索与引用。");
  await page.getByRole("button", { name: "提交审核" }).click();
  const submitFeedback = await page.locator("#suiteToast").textContent();
  const progressHref = await page.locator("#suiteToast .toast-success-action").getAttribute("href");
  if (width === 1440) await page.screenshot({ path: path.join(outputDir, "share-submission-success-1440.png"), fullPage: true });

  return {
    width,
    height,
    disabledInitially,
    enabledAfterSelection,
    expectedCount,
    directoryError,
    audienceError,
    descriptionCount,
    departmentDefault,
    departmentDirectoryOptions,
    departmentDirectoryDataMatch,
    filteredDirectoryCount,
    filteredDirectoryLabel,
    selectedDirectoryCount,
    directoryRowCount,
    selectableHierarchy,
    audienceVisible,
    closedByEscape,
    focusReturned,
    singleFileCount,
    singleFileName,
    submitFeedback,
    progressHref,
    ...initial
  };
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
    const failed = results.some((item) => !item.disabledInitially || !item.enabledAfterSelection || item.modalWidth !== 640 || item.modalHeight > item.height * 0.85 + 1 || !item.modalWithinViewport || item.modalOverflow > 0 || item.documentOverflow > 0 || item.selectedTarget !== "company" || item.fileCount !== item.expectedCount || item.directoryOptions < 10 || item.departmentDirectoryOptions < 10 || !item.companyDirectoryDataMatch || !item.departmentDirectoryDataMatch || item.initialDirectoryRows !== 1 || !item.hasAddDirectory || item.filteredDirectoryCount < 1 || !item.filteredDirectoryLabel.startsWith("找到 ") || item.selectedDirectoryCount !== 2 || item.directoryRowCount !== 2 || !item.selectableHierarchy || item.directoryError !== "请至少选择一个共享知识的目标目录" || item.audienceError !== "请输入指定可见的人员、部门或岗位" || item.descriptionCount !== "27" || !item.departmentDefault || !item.audienceVisible || !item.closedByEscape || !item.focusReturned || item.singleFileCount !== 1 || item.singleFileName !== "供应链运营中心年度重点工作任务清单.docx" || !item.submitFeedback.includes("共享提报申请已提交") || !item.submitFeedback.includes("当前状态：待审核") || !item.submitFeedback.includes("个人中心 > 我的共享") || item.progressHref !== "my-sharing.html");
    console.log(JSON.stringify(results, null, 2));
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
