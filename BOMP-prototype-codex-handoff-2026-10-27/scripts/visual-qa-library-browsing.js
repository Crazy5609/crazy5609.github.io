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
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "library-browsing-2.80.0");

async function pageState(page) {
  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("[data-library-table] tbody tr:not([hidden])"));
    const kinds = rows.map((row) => row.dataset.libraryKind);
    const firstFile = kinds.indexOf("file");
    const lastFolder = kinds.lastIndexOf("folder");
    const sidebar = document.getElementById("appSidebar");
    return {
      hash: location.hash.slice(1),
      active: sidebar?.getAttribute("active") || "",
      folderCount: kinds.filter((kind) => kind === "folder").length,
      fileCount: kinds.filter((kind) => kind === "file").length,
      foldersBeforeFiles: firstFile < 0 || lastFolder < firstFile,
      breadcrumb: Array.from(document.querySelectorAll(".library-breadcrumb > *")).filter((node) => !node.classList.contains("library-breadcrumb-separator")).map((node) => node.textContent.trim()),
      current: document.querySelector(".library-breadcrumb-current")?.textContent.trim() || "",
      newFolderButtons: document.querySelectorAll('.library-toolbar [data-toast="新建文件夹窗口已打开"]').length,
      uploadButtons: document.querySelectorAll('.library-toolbar [data-toast="上传窗口已打开"]').length,
      batchDownloadButtons: document.querySelectorAll('.library-toolbar [data-toast="所选文件已批量下载"]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
}

async function checkLibrary(page, config) {
  const failures = [];
  const levels = [];
  await page.goto(`${baseUrl}/pages/prototype-suite/${config.file}?refresh=2.80.0`, { waitUntil: "networkidle" });

  let state = await pageState(page);
  if (state.folderCount < 1 || state.fileCount !== 0) failures.push(`first level folders/files ${state.folderCount}/${state.fileCount}`);
  if (state.newFolderButtons !== 1 || state.uploadButtons !== 0 || state.batchDownloadButtons !== 0) failures.push(`first level toolbar ${state.newFolderButtons}/${state.uploadButtons}/${state.batchDownloadButtons}`);
  if (!state.foldersBeforeFiles || state.overflow > 0) failures.push(`first level order/overflow ${state.foldersBeforeFiles}/${state.overflow}`);

  await page.locator("bomp-sidebar").locator(`.nav-item[data-key="${config.firstKey}"]`).click();
  state = await pageState(page);
  if (state.active !== config.firstKey || state.current !== config.firstLabel) failures.push(`sidebar parent selection ${state.active}/${state.current}`);

  for (let depth = 0; depth < 10; depth += 1) {
    state = await pageState(page);
    levels.push(state);
    if (!state.foldersBeforeFiles) failures.push(`folder order at ${state.current}`);
    if (state.overflow > 0) failures.push(`overflow ${state.overflow}px at ${state.current}`);
    if (state.folderCount > 0 && state.fileCount > 0) await page.screenshot({ path: path.join(outputDir, `${config.scope}-mixed-1440x722.png`), fullPage: false });
    if (state.folderCount === 0) break;
    if (state.newFolderButtons !== 1 || state.batchDownloadButtons !== 0) failures.push(`directory toolbar at ${state.current}`);
    await page.locator("[data-library-table] tbody [data-library-kind=folder] [data-library-target]").first().click();
    const activeAfterFolder = await page.locator("bomp-sidebar").getAttribute("active");
    const hashAfterFolder = await page.evaluate(() => location.hash.slice(1));
    if (activeAfterFolder !== hashAfterFolder) failures.push(`folder/sidebar sync ${activeAfterFolder}/${hashAfterFolder}`);
  }

  state = await pageState(page);
  if (config.expectMixed && !levels.some((level) => level.folderCount > 0 && level.fileCount > 0 && level.foldersBeforeFiles)) failures.push("missing verified mixed folder/file level");
  if (state.folderCount !== 0 || state.fileCount < 1) failures.push(`leaf folders/files ${state.folderCount}/${state.fileCount}`);
  if (state.newFolderButtons !== 0 || state.uploadButtons !== 1 || state.batchDownloadButtons !== 1) failures.push(`leaf toolbar ${state.newFolderButtons}/${state.uploadButtons}/${state.batchDownloadButtons}`);
  await page.screenshot({ path: path.join(outputDir, `${config.scope}-leaf-1440x722.png`), fullPage: false });

  const upperCrumbs = page.locator(".library-breadcrumb button[data-library-target]");
  const upperCount = await upperCrumbs.count();
  if (upperCount < 1) {
    failures.push("missing clickable upper breadcrumb");
  } else {
    const target = upperCount > 1 ? upperCrumbs.nth(1) : upperCrumbs.first();
    const targetKey = await target.getAttribute("data-library-target");
    await target.click();
    state = await pageState(page);
    if (state.active !== targetKey || state.hash !== targetKey || state.folderCount < 1) failures.push(`breadcrumb/sidebar sync ${targetKey}/${state.active}/${state.hash}/${state.folderCount}`);
  }

  await page.screenshot({ path: path.join(outputDir, `${config.scope}-upper-level-1440x722.png`), fullPage: false });
  return { scope: config.scope, levels, finalState: state, failures };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 722 } });
    const results = [];
    results.push(await checkLibrary(page, { scope: "department", file: "department-library.html", firstKey: "dept-architecture-management", firstLabel: "架构管理" }));
    results.push(await checkLibrary(page, { scope: "company", file: "company-library.html", firstKey: "company-core-business", firstLabel: "核心业务", expectMixed: true }));
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.scope}: ${failure}`));
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ failures, results }, null, 2));
    console.log(JSON.stringify({ failures, results: results.map((result) => ({ scope: result.scope, checkedLevels: result.levels.length, finalState: result.finalState })) }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
