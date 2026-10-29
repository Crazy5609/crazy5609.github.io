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
const outputDir = path.join(projectRoot, "outputs", "visual-qa", "personal-library-backgrounds-2.79.0");
const pages = [
  ["my-library.html", "recent"],
  ["my-knowledge.html", "knowledge"],
  ["my-collaboration.html", "collaboration"],
  ["my-favorites.html", "favorites"],
  ["my-uploads.html", "uploads"],
  ["my-sharing.html", "sharing"],
  ["my-recycle-bin.html", "recycle"]
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
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 722 });
      for (const [file, pageName] of pages) {
        await page.goto(`${baseUrl}/pages/prototype-suite/${file}?refresh=2.79.0`, { waitUntil: "networkidle" });
        const state = await page.evaluate(() => {
          const shell = document.querySelector(".suite-page");
          const content = document.querySelector(".suite-content");
          const topbar = document.querySelector(".personal-library-topbar");
          const table = document.querySelector(".suite-table");
          const summary = document.querySelector(".knowledge-summary");
          const listPanel = document.querySelector(".personal-library-list-panel");
          const recentWorkspace = document.querySelector(".recent-list-workspace");
          const recentToolbar = recentWorkspace?.querySelector(":scope > .suite-toolbar");
          const recentTablePanel = document.querySelector(".recent-table-panel");
          const recentHeaderRow = document.querySelector(".table-recent thead tr");
          const collaborationTabs = document.querySelector(".collaboration-tabs");
          const collaborationActiveTab = collaborationTabs?.querySelector("button.is-active");
          const uploadsTabs = document.querySelector('body[data-page="uploads"] .status-tabs');
          const uploadsActiveTab = uploadsTabs?.querySelector("button.is-active");
          const uploadsSecondTab = uploadsTabs?.querySelector("button:nth-child(2)");
          const sharingTabs = document.querySelector('body[data-page="sharing"] .status-tabs');
          const sharingActiveTab = sharingTabs?.querySelector("button.is-active");
          const sharingSecondTab = sharingTabs?.querySelector("button:nth-child(2)");
          const summaryRect = summary?.getBoundingClientRect();
          const listPanelRect = listPanel?.getBoundingClientRect();
          const topbarRect = topbar.getBoundingClientRect();
          const recentTablePanelRect = recentTablePanel?.getBoundingClientRect();
          const recentHeaderRowRect = recentHeaderRow?.getBoundingClientRect();
          const pseudo = getComputedStyle(content, "::before");
          return {
            bodyPage: document.body.dataset.page,
            shellBackground: getComputedStyle(shell).backgroundColor,
            contentBackground: getComputedStyle(content).backgroundColor,
            topbarBackground: getComputedStyle(topbar).backgroundColor,
            topbarPosition: getComputedStyle(topbar).position,
            workspaceBackground: pseudo.backgroundColor,
            workspaceBorder: pseudo.borderTopWidth,
            workspaceRadius: pseudo.borderTopLeftRadius,
            summaryVisible: Boolean(summary && summary.getClientRects().length),
            summaryBackground: summary ? getComputedStyle(summary).backgroundColor : null,
            summaryButtonText: summary?.querySelector("[data-knowledge-summary-submit]")?.textContent.trim() || null,
            summaryHasAi: Boolean(summary?.querySelector('[data-nav="qa-result.html"]')),
            summaryBelowTopbar: summaryRect ? summaryRect.top >= topbarRect.bottom : null,
            summaryListGap: summaryRect && listPanelRect ? Math.round(listPanelRect.top - summaryRect.bottom) : null,
            listPanelBackground: listPanel ? getComputedStyle(listPanel).backgroundColor : null,
            recentWorkspaceBackground: recentWorkspace ? getComputedStyle(recentWorkspace).backgroundColor : null,
            recentToolbarBackground: recentToolbar ? getComputedStyle(recentToolbar).backgroundColor : null,
            recentTablePanelBackground: recentTablePanel ? getComputedStyle(recentTablePanel).backgroundColor : null,
            recentTablePanelBorderLeft: recentTablePanel ? getComputedStyle(recentTablePanel).borderLeftWidth : null,
            recentTablePanelBorderRight: recentTablePanel ? getComputedStyle(recentTablePanel).borderRightWidth : null,
            recentRowDivider: document.querySelector('.table-recent tbody td') ? getComputedStyle(document.querySelector('.table-recent tbody td')).borderTopColor : null,
            recentHeaderPanelWidthDelta: recentTablePanelRect && recentHeaderRowRect ? Math.round(Math.abs(recentTablePanelRect.width - recentHeaderRowRect.width)) : null,
            recentHeaderPanelLeftDelta: recentTablePanelRect && recentHeaderRowRect ? Math.round(Math.abs(recentTablePanelRect.left - recentHeaderRowRect.left)) : null,
            folderDownloadButtons: document.querySelectorAll('.table-knowledge tbody tr[data-folder="true"] .row-actions button[data-toast="文件下载完成"]').length,
            fileDownloadButtons: document.querySelectorAll('.table-knowledge tbody tr[data-folder="false"] .row-actions button[data-toast="文件下载完成"]').length,
            knowledgeTopbarPageActions: document.querySelectorAll('.personal-library-topbar .personal-library-page-actions').length,
            knowledgeToolbarNewActions: document.querySelectorAll('.personal-library-list-panel > .suite-toolbar [data-create-content-open]').length,
            knowledgeToolbarUploadActions: document.querySelectorAll('.personal-library-list-panel > .suite-toolbar [data-toast="已打开上传任务"]').length,
            knowledgeSelectedText: document.querySelector('[data-knowledge-selected]')?.textContent.trim() || null,
            privateStatusLabels: Array.from(document.querySelectorAll('.table-knowledge .knowledge-status.status-draft')).map((node) => node.textContent.trim()),
            collaborationSelectedText: document.querySelector('[data-collaboration-selected]')?.textContent.trim() || null,
            collaborationBulkDisabled: document.querySelectorAll('[data-collaboration-bulk]:disabled').length,
            collaborationFiltersRight: Boolean(document.querySelector('.table-collaboration') && document.querySelector('.suite-toolbar > .toolbar-right [data-filter-key="permission"]') && document.querySelector('.suite-toolbar > .toolbar-right [data-filter-key="type"]')),
            collaborationTopbarPageActions: document.querySelectorAll('body[data-page="collaboration"] .personal-library-topbar .personal-library-page-actions').length,
            collaborationTabsBackground: collaborationTabs ? getComputedStyle(collaborationTabs).backgroundColor : null,
            collaborationTabsRadius: collaborationTabs ? getComputedStyle(collaborationTabs).borderTopLeftRadius : null,
            collaborationTabsBottomBorder: collaborationTabs ? getComputedStyle(collaborationTabs).borderBottomWidth : null,
            collaborationActiveColor: collaborationActiveTab ? getComputedStyle(collaborationActiveTab).color : null,
            collaborationActiveFontSize: collaborationActiveTab ? getComputedStyle(collaborationActiveTab).fontSize : null,
            collaborationUnderlineColor: collaborationActiveTab ? getComputedStyle(collaborationActiveTab, "::after").backgroundColor : null,
            collaborationUnderlineHeight: collaborationActiveTab ? getComputedStyle(collaborationActiveTab, "::after").height : null,
            uploadsTabsBackground: uploadsTabs ? getComputedStyle(uploadsTabs).backgroundColor : null,
            uploadsTabsRadius: uploadsTabs ? getComputedStyle(uploadsTabs).borderTopLeftRadius : null,
            uploadsTabsBottomBorder: uploadsTabs ? getComputedStyle(uploadsTabs).borderBottomWidth : null,
            uploadsActiveColor: uploadsActiveTab ? getComputedStyle(uploadsActiveTab).color : null,
            uploadsActiveFontSize: uploadsActiveTab ? getComputedStyle(uploadsActiveTab).fontSize : null,
            uploadsUnderlineColor: uploadsActiveTab ? getComputedStyle(uploadsActiveTab, "::after").backgroundColor : null,
            uploadsUnderlineHeight: uploadsActiveTab ? getComputedStyle(uploadsActiveTab, "::after").height : null,
            uploadsSecondTabBorderLeft: uploadsSecondTab ? getComputedStyle(uploadsSecondTab).borderLeftWidth : null,
            sharingTabsBackground: sharingTabs ? getComputedStyle(sharingTabs).backgroundColor : null,
            sharingTabsRadius: sharingTabs ? getComputedStyle(sharingTabs).borderTopLeftRadius : null,
            sharingTabsBottomBorder: sharingTabs ? getComputedStyle(sharingTabs).borderBottomWidth : null,
            sharingActiveColor: sharingActiveTab ? getComputedStyle(sharingActiveTab).color : null,
            sharingActiveFontSize: sharingActiveTab ? getComputedStyle(sharingActiveTab).fontSize : null,
            sharingUnderlineColor: sharingActiveTab ? getComputedStyle(sharingActiveTab, "::after").backgroundColor : null,
            sharingUnderlineHeight: sharingActiveTab ? getComputedStyle(sharingActiveTab, "::after").height : null,
            sharingSecondTabBorderLeft: sharingSecondTab ? getComputedStyle(sharingSecondTab).borderLeftWidth : null,
            favoritesViewSwitches: document.querySelectorAll('body[data-page="favorites"] .view-switch').length,
            favoritesTopbarPageActions: document.querySelectorAll('body[data-page="favorites"] .personal-library-topbar .personal-library-page-actions').length,
            uploadsSelectedText: document.querySelector('[data-upload-selected]')?.textContent.trim() || null,
            uploadsTopbarPageActions: document.querySelectorAll('body[data-page="uploads"] .personal-library-topbar .personal-library-page-actions').length,
            sharingTopbarPageActions: document.querySelectorAll('body[data-page="sharing"] .personal-library-topbar .personal-library-page-actions').length,
            recycleSelectedText: document.querySelector('[data-recycle-selected]')?.textContent.trim() || null,
            recycleBulkDisabled: document.querySelectorAll('[data-recycle-bulk]:disabled').length,
            recycleViewSwitches: document.querySelectorAll('body[data-page="recycle"] .view-switch').length,
            recycleFiltersRight: Boolean(document.querySelector('.table-recycle') && document.querySelector('.suite-toolbar > .toolbar-right [data-filter-key="type"]') && document.querySelector('.suite-toolbar > .toolbar-right [data-time-filter]') && document.querySelector('.suite-toolbar > .toolbar-right .suite-search')),
            recycleSelectAll: document.querySelectorAll('.table-recycle thead [data-select-all]').length,
            recycleRowChecks: document.querySelectorAll('.table-recycle tbody [data-row-select]').length,
            recycleTopbarBulkActions: document.querySelectorAll('body[data-page="recycle"] .personal-library-topbar [data-recycle-bulk]').length,
            tableVisible: Boolean(table && table.getClientRects().length),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        });
        await page.evaluate(() => window.scrollTo(0, Math.min(320, document.documentElement.scrollHeight - innerHeight)));
        const scrollState = await page.evaluate(() => {
          const topbarRect = document.querySelector(".personal-library-topbar").getBoundingClientRect();
          return {
            scrollY: Math.round(window.scrollY),
            topbarBottom: Math.round(topbarRect.bottom)
          };
        });
        if (width === 1440) {
          await page.screenshot({ path: path.join(outputDir, `${pageName}-1440x722-scrolled.png`), fullPage: false });
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        const failures = [];
        if (state.bodyPage !== pageName) failures.push(`page id ${state.bodyPage}`);
        if (state.shellBackground !== "rgb(247, 248, 248)" || state.contentBackground !== "rgb(247, 248, 248)") failures.push(`canvas ${state.shellBackground}/${state.contentBackground}`);
        if (state.topbarBackground !== "rgb(255, 255, 255)") failures.push(`topbar ${state.topbarBackground}`);
        if (state.topbarPosition === "sticky" || state.topbarPosition === "fixed" || scrollState.scrollY === 0 || scrollState.topbarBottom > 56) failures.push(`topbar scroll ${state.topbarPosition}/${scrollState.scrollY}/${scrollState.topbarBottom}`);
        if (!state.tableVisible) failures.push("table hidden");
        if (pageName !== "recent" && pageName !== "knowledge" && (state.workspaceBackground !== "rgb(255, 255, 255)" || state.workspaceBorder !== "1px" || state.workspaceRadius !== "6px")) failures.push(`workspace ${state.workspaceBackground}/${state.workspaceBorder}/${state.workspaceRadius}`);
        if (pageName === "recent" && state.summaryVisible) failures.push("summary still shown on recent");
        if (pageName === "recent" && (state.recentWorkspaceBackground !== "rgba(0, 0, 0, 0)" || state.recentToolbarBackground !== "rgba(0, 0, 0, 0)" || state.recentTablePanelBackground !== "rgb(255, 255, 255)" || state.recentTablePanelBorderLeft !== "0px" || state.recentTablePanelBorderRight !== "0px" || state.recentRowDivider !== "rgb(238, 242, 241)" || state.recentHeaderPanelWidthDelta !== 0 || state.recentHeaderPanelLeftDelta !== 0)) failures.push(`recent surfaces ${state.recentWorkspaceBackground}/${state.recentToolbarBackground}/${state.recentTablePanelBackground}/${state.recentTablePanelBorderLeft}/${state.recentTablePanelBorderRight}/${state.recentRowDivider}/${state.recentHeaderPanelWidthDelta}/${state.recentHeaderPanelLeftDelta}`);
        if (pageName === "knowledge" && (!state.summaryVisible || state.summaryBackground !== "rgb(255, 255, 255)" || state.summaryButtonText !== "搜索" || state.summaryHasAi || !state.summaryBelowTopbar || state.summaryListGap !== 15 || state.listPanelBackground !== "rgb(255, 255, 255)")) failures.push(`knowledge summary ${JSON.stringify(state)}`);
        if (pageName === "knowledge" && (state.folderDownloadButtons !== 0 || state.fileDownloadButtons === 0)) failures.push(`knowledge download actions ${state.folderDownloadButtons}/${state.fileDownloadButtons}`);
        if (pageName === "knowledge" && (state.knowledgeTopbarPageActions !== 0 || state.knowledgeToolbarNewActions !== 1 || state.knowledgeToolbarUploadActions !== 1)) failures.push(`knowledge action placement ${state.knowledgeTopbarPageActions}/${state.knowledgeToolbarNewActions}/${state.knowledgeToolbarUploadActions}`);
        if (pageName === "knowledge" && state.knowledgeSelectedText !== "已选中 0 条") failures.push(`knowledge selected initial ${state.knowledgeSelectedText}`);
        if (pageName === "knowledge" && (state.privateStatusLabels.length === 0 || state.privateStatusLabels.some((label) => label !== "私有"))) failures.push(`knowledge private labels ${state.privateStatusLabels.join(',')}`);
        if (pageName === "collaboration" && (state.collaborationSelectedText !== "已选中 0 条" || state.collaborationBulkDisabled !== 2 || !state.collaborationFiltersRight || state.collaborationTopbarPageActions !== 0)) failures.push(`collaboration toolbar ${state.collaborationSelectedText}/${state.collaborationBulkDisabled}/${state.collaborationFiltersRight}/${state.collaborationTopbarPageActions}`);
        if (pageName === "collaboration" && (state.collaborationTabsBackground !== "rgb(255, 255, 255)" || state.collaborationTabsRadius !== "0px" || state.collaborationTabsBottomBorder !== "1px" || state.collaborationActiveColor !== "rgb(31, 130, 122)" || state.collaborationActiveFontSize !== "16px" || state.collaborationUnderlineColor !== "rgb(31, 130, 122)" || state.collaborationUnderlineHeight !== "3px")) failures.push(`collaboration tabs ${state.collaborationTabsBackground}/${state.collaborationTabsRadius}/${state.collaborationTabsBottomBorder}/${state.collaborationActiveColor}/${state.collaborationActiveFontSize}/${state.collaborationUnderlineColor}/${state.collaborationUnderlineHeight}`);
        if (pageName === "favorites" && (state.favoritesViewSwitches !== 0 || state.favoritesTopbarPageActions !== 0)) failures.push(`favorites topbar/view ${state.favoritesTopbarPageActions}/${state.favoritesViewSwitches}`);
        if (pageName === "uploads" && (state.uploadsSelectedText !== "已选中 0 条" || state.uploadsTopbarPageActions !== 0)) failures.push(`uploads toolbar ${state.uploadsSelectedText}/${state.uploadsTopbarPageActions}`);
        if (pageName === "uploads" && (state.uploadsTabsBackground !== "rgb(255, 255, 255)" || state.uploadsTabsRadius !== "0px" || state.uploadsTabsBottomBorder !== "1px" || state.uploadsActiveColor !== "rgb(31, 130, 122)" || state.uploadsActiveFontSize !== "16px" || state.uploadsUnderlineColor !== "rgb(31, 130, 122)" || state.uploadsUnderlineHeight !== "3px" || state.uploadsSecondTabBorderLeft !== "0px")) failures.push(`uploads tabs ${state.uploadsTabsBackground}/${state.uploadsTabsRadius}/${state.uploadsTabsBottomBorder}/${state.uploadsActiveColor}/${state.uploadsActiveFontSize}/${state.uploadsUnderlineColor}/${state.uploadsUnderlineHeight}/${state.uploadsSecondTabBorderLeft}`);
        if (pageName === "sharing" && state.sharingTopbarPageActions !== 0) failures.push(`sharing topbar page actions ${state.sharingTopbarPageActions}`);
        if (pageName === "sharing" && (state.sharingTabsBackground !== "rgb(255, 255, 255)" || state.sharingTabsRadius !== "0px" || state.sharingTabsBottomBorder !== "1px" || state.sharingActiveColor !== "rgb(31, 130, 122)" || state.sharingActiveFontSize !== "16px" || state.sharingUnderlineColor !== "rgb(31, 130, 122)" || state.sharingUnderlineHeight !== "3px" || state.sharingSecondTabBorderLeft !== "0px")) failures.push(`sharing tabs ${state.sharingTabsBackground}/${state.sharingTabsRadius}/${state.sharingTabsBottomBorder}/${state.sharingActiveColor}/${state.sharingActiveFontSize}/${state.sharingUnderlineColor}/${state.sharingUnderlineHeight}/${state.sharingSecondTabBorderLeft}`);
        if (pageName === "recycle" && (state.recycleSelectedText !== "已选中 0 条" || state.recycleBulkDisabled !== 2 || state.recycleViewSwitches !== 0 || !state.recycleFiltersRight || state.recycleSelectAll !== 1 || state.recycleRowChecks === 0 || state.recycleTopbarBulkActions !== 0)) failures.push(`recycle toolbar ${state.recycleSelectedText}/${state.recycleBulkDisabled}/${state.recycleViewSwitches}/${state.recycleFiltersRight}/${state.recycleSelectAll}/${state.recycleRowChecks}/${state.recycleTopbarBulkActions}`);
        if (state.overflow > 0) failures.push(`horizontal overflow ${state.overflow}px`);
        results.push({ width, file, state, scrollState, failures });
        if (width === 1440) {
          await page.screenshot({ path: path.join(outputDir, `${pageName}-1440x722.png`), fullPage: false });
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 902 });
    await page.goto(`${baseUrl}/pages/prototype-suite/my-knowledge.html?refresh=2.76.0`, { waitUntil: "networkidle" });
    await page.locator('.table-knowledge tbody [data-row-select]').first().check();
    const selectedOneText = await page.locator('[data-knowledge-selected]').textContent();
    await page.locator('.table-knowledge thead [data-select-all]').check();
    const selectedAllText = await page.locator('[data-knowledge-selected]').textContent();
    await page.locator('.table-knowledge thead [data-select-all]').uncheck();
    const selectedNoneText = await page.locator('[data-knowledge-selected]').textContent();
    const selectedAllCount = Number((selectedAllText || '').match(/\d+/)?.[0] || 0);
    const selectionFailures = selectedOneText?.trim() === '已选中 1 条' && selectedAllCount > 1 && selectedNoneText?.trim() === '已选中 0 条' ? [] : [`knowledge selection count ${selectedOneText}/${selectedAllText}/${selectedNoneText}`];
    await page.locator('select[data-filter-key="status"]').selectOption('私有');
    const visiblePrivateRows = await page.locator('.table-knowledge tbody tr:visible').count();
    await page.locator('select[data-filter-key="status"]').selectOption('');
    const privateFilterFailures = visiblePrivateRows === 2 ? [] : [`knowledge private filter returned ${visiblePrivateRows} rows`];
    await page.locator("[data-knowledge-summary-search]").fill("供应链运营季度运行分析报告.docx");
    await page.locator("[data-knowledge-summary-submit]").click();
    const visibleKnowledgeRows = await page.locator(".table-knowledge tbody tr:visible").count();
    const searchFailures = visibleKnowledgeRows === 1 ? [] : [`knowledge search returned ${visibleKnowledgeRows} rows`];
    await page.goto(`${baseUrl}/pages/prototype-suite/my-collaboration.html?refresh=2.77.0`, { waitUntil: "networkidle" });
    await page.locator('[data-collaboration-filter="sharedToMe"]').click();
    const collaborationSharedToMeRows = await page.locator('.table-collaboration tbody tr:visible').count();
    const collaborationSharedToMePressed = await page.locator('[data-collaboration-filter="sharedToMe"]').getAttribute('aria-pressed');
    const collaborationAllPressedAfterSwitch = await page.locator('[data-collaboration-filter=""]').getAttribute('aria-pressed');
    await page.locator('[data-collaboration-filter=""]').click();
    const collaborationTabFailures = collaborationSharedToMeRows === 5 && collaborationSharedToMePressed === 'true' && collaborationAllPressedAfterSwitch === 'false' ? [] : [`collaboration tabs ${collaborationSharedToMeRows}/${collaborationSharedToMePressed}/${collaborationAllPressedAfterSwitch}`];
    await page.locator('.table-collaboration tbody [data-row-select]').first().check();
    const collaborationSelectedOne = await page.locator('[data-collaboration-selected]').textContent();
    const collaborationEnabledAfterSelect = await page.locator('[data-collaboration-bulk]:not(:disabled)').count();
    await page.locator('.table-collaboration tbody [data-row-select]').first().uncheck();
    const collaborationSelectedNone = await page.locator('[data-collaboration-selected]').textContent();
    const collaborationDisabledAfterClear = await page.locator('[data-collaboration-bulk]:disabled').count();
    const collaborationInteractionFailures = collaborationSelectedOne?.trim() === '已选中 1 条' && collaborationEnabledAfterSelect === 2 && collaborationSelectedNone?.trim() === '已选中 0 条' && collaborationDisabledAfterClear === 2 ? [] : [`collaboration selection ${collaborationSelectedOne}/${collaborationEnabledAfterSelect}/${collaborationSelectedNone}/${collaborationDisabledAfterClear}`];
    await page.goto(`${baseUrl}/pages/prototype-suite/my-uploads.html?refresh=2.78.0`, { waitUntil: "networkidle" });
    await page.locator('[data-upload-tab="processing"]').click();
    const uploadsProcessingRows = await page.locator('.table-uploads tbody tr:visible').count();
    const uploadsProcessingPressed = await page.locator('[data-upload-tab="processing"]').getAttribute('aria-pressed');
    const uploadsInactivePressed = await page.locator('[data-upload-tab]:not([data-upload-tab="processing"])').evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-pressed')));
    await page.locator('[data-upload-tab="all"]').click();
    const uploadsTabFailures = uploadsProcessingRows === 2 && uploadsProcessingPressed === 'true' && uploadsInactivePressed.every((value) => value === 'false') ? [] : [`uploads tabs ${uploadsProcessingRows}/${uploadsProcessingPressed}/${uploadsInactivePressed.join(',')}`];
    await page.locator('.table-uploads tbody [data-row-select]').first().check();
    const uploadsSelectedOne = await page.locator('[data-upload-selected]').textContent();
    await page.locator('.table-uploads thead [data-select-all]').check();
    const uploadsSelectedAll = await page.locator('[data-upload-selected]').textContent();
    await page.locator('.table-uploads thead [data-select-all]').uncheck();
    const uploadsSelectedNone = await page.locator('[data-upload-selected]').textContent();
    const uploadsSelectedAllCount = Number((uploadsSelectedAll || '').match(/\d+/)?.[0] || 0);
    const uploadsInteractionFailures = uploadsSelectedOne?.trim() === '已选中 1 条' && uploadsSelectedAllCount > 1 && uploadsSelectedNone?.trim() === '已选中 0 条' ? [] : [`uploads selection ${uploadsSelectedOne}/${uploadsSelectedAll}/${uploadsSelectedNone}`];
    await page.goto(`${baseUrl}/pages/prototype-suite/my-sharing.html?refresh=2.79.0`, { waitUntil: "networkidle" });
    await page.locator('[data-status-filter="审核中"]').click();
    const sharingReviewRows = await page.locator('.table-sharing tbody tr:visible').count();
    const sharingReviewPressed = await page.locator('[data-status-filter="审核中"]').getAttribute('aria-pressed');
    const sharingInactivePressed = await page.locator('[data-status-filter]:not([data-status-filter="审核中"])').evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-pressed')));
    await page.locator('[data-status-filter=""]').click();
    const sharingTabFailures = sharingReviewRows === 4 && sharingReviewPressed === 'true' && sharingInactivePressed.every((value) => value === 'false') ? [] : [`sharing tabs ${sharingReviewRows}/${sharingReviewPressed}/${sharingInactivePressed.join(',')}`];
    await page.goto(`${baseUrl}/pages/prototype-suite/my-recycle-bin.html?refresh=2.76.0`, { waitUntil: "networkidle" });
    await page.locator('.table-recycle tbody [data-row-select]').first().check();
    const recycleSelectedOne = await page.locator('[data-recycle-selected]').textContent();
    const recycleEnabledAfterSelect = await page.locator('[data-recycle-bulk]:not(:disabled)').count();
    await page.locator('.table-recycle thead [data-select-all]').check();
    const recycleSelectedAll = await page.locator('[data-recycle-selected]').textContent();
    await page.locator('.table-recycle thead [data-select-all]').uncheck();
    const recycleSelectedNone = await page.locator('[data-recycle-selected]').textContent();
    const recycleDisabledAfterClear = await page.locator('[data-recycle-bulk]:disabled').count();
    const recycleSelectedAllCount = Number((recycleSelectedAll || '').match(/\d+/)?.[0] || 0);
    const recycleInteractionFailures = recycleSelectedOne?.trim() === '已选中 1 条' && recycleEnabledAfterSelect === 2 && recycleSelectedAllCount > 1 && recycleSelectedNone?.trim() === '已选中 0 条' && recycleDisabledAfterClear === 2 ? [] : [`recycle selection ${recycleSelectedOne}/${recycleEnabledAfterSelect}/${recycleSelectedAll}/${recycleSelectedNone}/${recycleDisabledAfterClear}`];
    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}/${result.file}: ${failure}`)).concat(selectionFailures, privateFilterFailures, searchFailures, collaborationTabFailures, collaborationInteractionFailures, uploadsTabFailures, uploadsInteractionFailures, sharingTabFailures, recycleInteractionFailures);
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify({ checked: results.length, failures, visibleKnowledgeRows, visiblePrivateRows, selection: { selectedOneText, selectedAllText, selectedNoneText }, collaborationTabs: { collaborationSharedToMeRows, collaborationSharedToMePressed, collaborationAllPressedAfterSwitch }, collaborationSelection: { collaborationSelectedOne, collaborationEnabledAfterSelect, collaborationSelectedNone, collaborationDisabledAfterClear }, uploadsTabs: { uploadsProcessingRows, uploadsProcessingPressed, uploadsInactivePressed }, uploadsSelection: { uploadsSelectedOne, uploadsSelectedAll, uploadsSelectedNone }, sharingTabs: { sharingReviewRows, sharingReviewPressed, sharingInactivePressed }, recycleSelection: { recycleSelectedOne, recycleEnabledAfterSelect, recycleSelectedAll, recycleSelectedNone, recycleDisabledAfterClear }, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures, visibleKnowledgeRows, visiblePrivateRows, selection: { selectedOneText, selectedAllText, selectedNoneText }, collaborationTabs: { collaborationSharedToMeRows, collaborationSharedToMePressed, collaborationAllPressedAfterSwitch }, collaborationSelection: { collaborationSelectedOne, collaborationEnabledAfterSelect, collaborationSelectedNone, collaborationDisabledAfterClear }, uploadsTabs: { uploadsProcessingRows, uploadsProcessingPressed, uploadsInactivePressed }, uploadsSelection: { uploadsSelectedOne, uploadsSelectedAll, uploadsSelectedNone }, sharingTabs: { sharingReviewRows, sharingReviewPressed, sharingInactivePressed }, recycleSelection: { recycleSelectedOne, recycleEnabledAfterSelect, recycleSelectedAll, recycleSelectedNone, recycleDisabledAfterClear } }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
