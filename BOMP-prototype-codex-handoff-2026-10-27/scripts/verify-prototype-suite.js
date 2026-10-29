const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const suiteSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "suite.js"), "utf8");
const suiteStyles = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "suite.css"), "utf8");
const homePageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "home.html"), "utf8");
const homeTwoPageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "home-2.html"), "utf8");
const homeQaPageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "qa-result-home.html"), "utf8");
const homeDocumentPageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "document-search-home.html"), "utf8");
const baseStyles = fs.readFileSync(path.join(projectRoot, "components", "base.css"), "utf8");
const headerSource = fs.readFileSync(path.join(projectRoot, "components", "app-header", "component.js"), "utf8");
const headerStyles = fs.readFileSync(path.join(projectRoot, "components", "app-header", "component.css"), "utf8");
const sidebarSource = fs.readFileSync(path.join(projectRoot, "components", "app-sidebar", "component.js"), "utf8");
const sidebarStyles = fs.readFileSync(path.join(projectRoot, "components", "app-sidebar", "component.css"), "utf8");
const historyPanelSource = fs.readFileSync(path.join(projectRoot, "components", "search-history-panel", "component.js"), "utf8");
const historyPanelStyles = fs.readFileSync(path.join(projectRoot, "components", "search-history-panel", "component.css"), "utf8");
const uploadWorkflowStyles = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "department-knowledge-upload.css"), "utf8");
const tagManagementStyles = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "tag-management.css"), "utf8");
const tagManagementSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "tag-management.js"), "utf8");
const tagManagementPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "tag-management.html"), "utf8");
const knowledgeTableSource = fs.readFileSync(path.join(projectRoot, "components", "knowledge-table", "component.js"), "utf8");
const knowledgeTableStyles = fs.readFileSync(path.join(projectRoot, "components", "knowledge-table", "component.css"), "utf8");
const fileActionDialogsSource = fs.readFileSync(path.join(projectRoot, "components", "file-action-dialogs", "component.js"), "utf8");
const departmentUploadSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "department-knowledge-upload.js"), "utf8");
const legacyRecentStyles = fs.readFileSync(path.join(projectRoot, "pages", "recent-use.css"), "utf8");

const sidebarWindow = {};
vm.runInNewContext(sidebarSource, {
  window: sidebarWindow,
  document: {
    currentScript: { src: "https://example.test/components/app-sidebar/component.js" },
    createElement() { return { textContent: "", innerHTML: "" }; }
  },
  URL,
  HTMLElement: class {},
  customElements: { get() { return true; }, define() {} },
  console
}, { filename: "app-sidebar/component.js" });
const departmentDirectoryData = sidebarWindow.BompDepartmentDirectoryData;
const companyDirectoryData = sidebarWindow.BompCompanyDirectoryData;

function render(page, storedAdvancedCriteria, pageDataset) {
  const root = {
    innerHTML: "",
    insertAdjacentHTML(position, html) {
      this.innerHTML += html;
    }
  };
  const body = {
    dataset: Object.assign({ page }, pageDataset || {}),
    appendChild() {},
    insertAdjacentHTML() {}
  };
  const document = {
    body,
    addEventListener() {},
    createElement() {
      return { className: "", dataset: {}, innerHTML: "", style: {}, setAttribute() {} };
    },
    getElementById(id) {
      return id === "suiteRoot" ? root : null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  const window = {
    BompIcons: { create: (name) => `<svg data-icon-name="${name}"></svg>` },
    BompDepartmentDirectoryData: departmentDirectoryData,
    BompCompanyDirectoryData: companyDirectoryData,
    sessionStorage: {
      getItem(key) {
        return key === "bomp-advanced-search" && storedAdvancedCriteria ? JSON.stringify(storedAdvancedCriteria) : null;
      },
      removeItem() {},
      setItem() {}
    },
    addEventListener() {}
  };
  const context = vm.createContext({
    clearTimeout() {},
    console,
    document,
    location: { href: "" },
    setTimeout() {},
    window
  });
  vm.runInContext(suiteSource, context, { filename: "suite.js" });
  return root.innerHTML;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertBusinessTableOrder(html, page) {
  const tables = html.match(/<table class="[^"]*suite-table[^"]*"[\s\S]*?<\/table>/g) || [];
  tables.forEach((table, index) => {
    const colgroup = (table.match(/<colgroup>([\s\S]*?)<\/colgroup>/) || [])[1] || "";
    const columns = Array.from(colgroup.matchAll(/class="col-([^"]+)"/g), (match) => match[1]);
    if (!columns.includes("name") || !columns.includes("actions")) return;
    const expectedNameIndex = columns[0] === "check" ? 1 : 0;
    assert(columns.indexOf("name") === expectedNameIndex, `${page} 第 ${index + 1} 个业务列表未按复选框、名称顺序起始`);
    assert(columns.at(-1) === "actions", `${page} 第 ${index + 1} 个业务列表操作列不是最后一列`);
  });
}

const home = render("home");
const homeTwo = render("home", null, { homeVariant: "two" });
const homeQa = render("qa", null, { qaVariant: "home" });
const homeDocuments = render("documents", null, { documentVariant: "home" });
assert(!home.includes("data-advanced-search-open") && !home.includes('id="advancedSearchModal"') && !home.includes("高级搜索"), "知识共享中心首页仍显示高级搜索入口或弹窗");
assert(home.includes('aria-label="知识库范围"') && home.includes("全范围知识库") && home.includes("添加附件") && home.includes("添加图片"), "首页移除高级搜索后核心输入工具不完整");
assert(home.includes('class="home-mode-switch"') && home.includes('data-home-mode="qa" aria-pressed="true">AI问答') && home.includes('data-home-mode="documents" aria-pressed="false">搜知识'), "首页缺少可访问的 AI问答/搜知识模式切换");
assert(home.includes('class="home-document-search"') && home.includes('data-home-search-scope-slot') && home.includes('id="homeDocumentSearch" type="search"') && home.includes('placeholder="搜索文件名称、关键词或正文内容"') && home.includes('home-document-search-submit'), "首页搜知识模式缺少独立文件搜索栏或范围插槽");
assert(!home.includes('class="home-document-search-icon"'), "首页搜知识提示语前仍显示搜索图标");
assert(suiteSource.includes("function setHomeMode(mode)") && suiteSource.includes("question.hidden=isSearch") && suiteSource.includes("documentSearch.hidden=!isSearch") && suiteSource.includes("scopeTarget=isSearch?scopeSlot:scopeHome") && suiteSource.includes("scopeTarget.prepend(scope)") && suiteSource.includes("event.key==='Enter'") && suiteSource.includes("setHomeMode(homeMode.dataset.homeMode)"), "首页模式切换未联动问答、范围下拉与文件搜索输入区或回车搜索");
assert(/\.home-composer\.is-search-mode\s*\{[^}]*min-height:\s*0[^}]*padding:\s*0[^}]*border:\s*0[^}]*background:\s*transparent[^}]*box-shadow:\s*none/.test(suiteStyles), "首页搜知识模式仍保留大容器外观");
assert(/\.home-composer\.is-search-mode \.home-tools\s*\{[^}]*display:\s*none/.test(suiteStyles), "首页搜知识模式仍显示容器底部工具栏");
assert(/\.home-document-search\s*\{[^}]*grid-template-columns:\s*180px minmax\(0, 1fr\) auto/.test(suiteStyles) && /\.home-search-scope-slot\s*\{[^}]*border-right:\s*1px solid #d6dfdd/.test(suiteStyles) && !suiteStyles.includes('.home-document-search-icon'), "首页搜知识范围下拉未嵌入搜索框左端或提示语前仍保留搜索图标");
assert(suiteStyles.includes('body[data-page="home"] .home-mode-switch') && suiteStyles.includes("width: 256px") && suiteStyles.includes("height: 40px") && suiteStyles.includes("button.is-active"), "首页模式切换缺少稳定尺寸或激活态样式");
assert(home.includes('href="home-2.html">切换到首页二</a>') && !homeTwo.includes('class="home-mode-switch"') && homeTwo.includes('href="home.html">切换到首页一</a>'), "首页一、首页二的模式切换或互跳入口不正确");
assert(homeTwo.includes('aria-label="知识库范围"') && homeTwo.includes("智能起草材料") && homeTwo.includes("上传知识") && homeTwo.includes("新建文档"), "首页二未完整保留首页核心内容");
assert(home.includes("<strong>上传知识</strong>") && homeTwo.includes("<strong>上传知识</strong>") && !home.includes("<strong>传知识</strong>") && !homeTwo.includes("<strong>传知识</strong>"), "首页一或首页二的第二项能力未统一改为上传知识");
assert(home.includes("<strong>新建文档</strong>") && homeTwo.includes("<strong>新建文档</strong>") && !home.includes("<strong>在线协作</strong>") && !homeTwo.includes("<strong>在线协作</strong>"), "首页一或首页二的第三项能力未统一改为新建文档");
assert(suiteStyles.includes('body[data-page="home"] .home-version-switch') && suiteStyles.includes("right: 24px") && suiteStyles.includes("bottom: 16px") && suiteStyles.includes("font-size: 12px"), "首页互跳入口未按右下角低强调样式实现");
assert(suiteStyles.includes('.home-composer textarea::placeholder') && suiteStyles.includes('color: #9ba7a5') && suiteStyles.includes('font-size: 14px'), "首页输入提示语未使用 14px 浅色样式");
assert(suiteSource.includes("var homeMode=e.target.closest('[data-home-mode]')") && suiteSource.includes("?'document-search-home.html':isHomeTwo?'qa-result.html':'qa-result-home.html'") && !suiteSource.includes("toast('请先描述你的需求')"), "首页模式切换或空输入发送跳转逻辑不正确");
assert(!homeQa.includes('href="qa-result.html">AI问答</a>') && !homeQa.includes('href="document-search.html">搜知识</a>') && !homeQa.includes('href="image-search.html">搜图片</a>'), "首页一专用 AI 问答结果页仍显示模式切换");
assert(homeQa.includes('href="home.html">‹ 返回</a>') && homeQa.includes('data-history-open') && homeQa.includes('新建会话') && homeQa.includes('class="qa-main"') && homeQa.includes('相关引用'), "首页一专用 AI 问答结果页误删了其他内容或操作");
assert(homeDocuments.includes('href="home.html">‹ 返回</a>') && !homeDocuments.includes('href="qa-result.html">AI问答</a>') && !homeDocuments.includes('href="document-search.html">搜知识</a>') && !homeDocuments.includes('href="image-search.html">搜图片</a>') && !homeDocuments.includes('class="search-mode-actions"'), "首页一专用搜知识结果页顶部未只保留返回按钮");
assert(homeDocuments.includes('data-advanced-search-open') && homeDocuments.includes('class="modal-mask advanced-search-modal"') && homeDocuments.includes('role="dialog"') && homeDocuments.includes('class="suite-table table-search-results'), "首页一专用搜知识结果页缺少高级搜索弹窗或结果列表");
assert(homeDocuments.includes('<span>上传人</span>') && homeDocuments.includes('name="uploader"') && homeDocuments.includes('>全部上传人</option>') && !homeDocuments.includes('name="fileDept"'), "高级搜索未以上传人筛选替换文件归属部门筛选");
assert(suiteSource.includes("function documentSearchHref()") && (suiteSource.match(/location\.href=documentSearchHref\(\)/g) || []).length === 2, "高级搜索提交或清空未保留当前搜知识页面变体");
assert(/\.table-search-results:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child\s*\{[^}]*padding-right:\s*calc\(var\(--table-action-edge-gap\) \+ 62px\)[^}]*text-align:\s*right/.test(suiteStyles), "搜知识操作表头未与行内按钮组保持视觉居中");
assert(homePageSource.includes('suite.css?v=2.97.0') && homePageSource.includes('suite.js?v=2.97.0') && homeTwoPageSource.includes('data-home-variant="two"') && homeTwoPageSource.includes('suite.css?v=2.97.0') && homeTwoPageSource.includes('suite.js?v=2.97.0') && homeQaPageSource.includes('data-qa-variant="home"') && homeQaPageSource.includes('suite.css?v=2.97.0') && homeQaPageSource.includes('suite.js?v=2.97.0') && homeDocumentPageSource.includes('data-document-variant="home"') && homeDocumentPageSource.includes('suite.css?v=2.97.0') && homeDocumentPageSource.includes('suite.js?v=2.97.0'), "首页或首页一专用结果页的静态资源版本不完整");
assert(suiteSource.includes("item.uploadDept===criteria.uploadDept") && suiteSource.includes("item.owner===criteria.uploader") && suiteSource.includes("uploadDate>=criteria.uploadStart") && suiteSource.includes("uploadDate<=criteria.uploadEnd"), "高级搜索未实现上传日期、上传部门和上传人的组合匹配");
assert(suiteSource.includes("请至少设置一个搜索条件") && suiteSource.includes("上传开始日期不能晚于结束日期"), "高级搜索缺少空条件或日期范围校验");
assert(suiteSource.includes("Array.from(advancedForm.elements).forEach") && suiteSource.includes("if(field.name)field.value=''"), "高级搜索重置未清空已保存的回填条件");
const advancedDocuments = render("documents", {
  uploadStart: "2026-07-24",
  uploadEnd: "2026-07-27",
  uploadDept: "供应链运营中心",
  uploader: "张三",
  type: "文档",
  scope: "部门可见",
  keyword: ""
});
assert(advancedDocuments.includes("高级搜索结果") && advancedDocuments.includes("共 1 条") && advancedDocuments.includes("上传人：张三"), "高级搜索结果缺少上传人条件或命中数量摘要");
assert(advancedDocuments.includes("供应链运营中心年度重点工作任务清单.docx") && !advancedDocuments.includes("供应链运营季度运行分析报告.docx"), "高级搜索结果未按全部条件精确匹配");
assert(advancedDocuments.includes("<th>上传部门</th>") && advancedDocuments.includes("<th>文件归属部门</th>") && advancedDocuments.includes("<th>上传时间</th>"), "高级搜索结果列表缺少条件核对字段");
assert(advancedDocuments.includes("修改条件") && advancedDocuments.includes("清空条件"), "高级搜索结果缺少修改或清空条件入口");

const documentSearch = render("documents");
assert(documentSearch.includes('id="aiReadPanel" hidden'), "搜知识的AI速读面板未默认隐藏");
assert((documentSearch.match(/data-ai-read/g) || []).length >= 8, "搜知识文件行缺少AI速读操作");
assert(documentSearch.includes('data-ai-index="0"') && suiteSource.includes("openAiReadPanel(aiRead)"), "AI速读未绑定具体文件或缺少打开交互");
assert(documentSearch.includes("data-ai-close") && suiteSource.includes("closeAiReadPanel()"), "AI速读面板缺少收起交互");
assert(/\.search-layout\s*,[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "搜知识初始布局未恢复为全宽单列");

["documents", "qa", "images"].forEach((page) => {
  const html = render(page);
  assert(html.includes("data-history-open") && html.includes('id="searchHistoryPanel" hidden'), `${page}缺少可打开的历史记录面板`);
});
assert(historyPanelSource.includes('CustomEvent("history-close"') && historyPanelSource.includes('CustomEvent("history-select"'), "搜索历史组件缺少收起或选择事件");
assert(historyPanelSource.includes("focusClose()") && suiteSource.includes("historyLastTrigger.focus()"), "搜索历史面板缺少焦点进入或恢复");
assert(historyPanelStyles.includes(":host([hidden])") && historyPanelStyles.includes("text-overflow: ellipsis"), "搜索历史组件隐藏或溢出样式不完整");
assert(suiteSource.includes("closeHistoryPanel(false)") && suiteSource.includes("closeAiReadPanel(false)"), "AI速读与历史记录未实现互斥显示");
assert(/\.suite-table td:not\(\.check-col\)\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/.test(suiteStyles), "列表非名称字段未统一单行省略");
assert(/\.suite-table \.doc-name button\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/.test(suiteStyles), "列表名称列未统一为单行省略");
assert(!suiteSource.includes("<br>知识类型"), "列表非名称字段仍存在主动换行");
assert(/\.workflow-table td\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/.test(uploadWorkflowStyles), "上传流程列表非名称字段未统一单行省略");

const qa = render("qa");
assert(qa.includes("差旅费报销单.png") && qa.includes('class="receipt-thumbnail"') && qa.includes("请帮我检查这张报销单"), "AI问答未体现用户携图提问");
assert(qa.includes("data-qa-pick-file") && qa.includes("data-qa-pick-image") && qa.includes("data-qa-file-input") && qa.includes("data-qa-image-input"), "AI问答提问框缺少文件或图片附件入口");
assert(qa.includes('class="composer-tool composer-tool-icon" type="button" title="添加文件" aria-label="添加文件" data-qa-pick-file') && qa.includes('class="composer-tool composer-tool-icon" type="button" title="添加图片" aria-label="添加图片" data-qa-pick-image') && !qa.includes('>'+"添加文件"+'</button>') && !qa.includes('>'+"添加图片"+'</button>'), "AI问答附件按钮未按图标按钮呈现");
assert((qa.match(/class="citation-marker"/g) || []).length >= 10 && qa.includes('data-citation-ref="qa-ref-1"') && qa.includes('data-citation-ref="qa-ref-6"'), "AI回答引用角标不完整");
assert((qa.match(/class="reference-item/g) || []).length === 6, "AI问答右侧相关引用数量或编号不完整");
assert((qa.match(/restricted-reference/g) || []).length === 2 && (qa.match(/data-qa-permission/g) || []).length === 2, "AI问答缺少无权限相关文件或申请入口");
const restrictedReferences = Array.from(qa.matchAll(/<article class="reference-item restricted-reference"[\s\S]*?<\/article>/g), (match) => match[0]);
assert(restrictedReferences.every((item) => item.includes("申请权限") && !item.includes("引用文件下载完成") && !item.includes("share-action") && !item.includes("已收藏引用文件")), "无权限相关文件仍提供了权限申请之外的操作");
assert(qa.includes("当前问答所需部分文档您暂无查看权限，可发起对应文档的访问权限申请"), "AI回答末尾缺少权限提示");
assert(/\.qa-main\s*,[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s*340px/.test(suiteStyles), "AI问答右侧栏未与AI速读和历史记录保持同宽");
assert(/\.qa-conversation\s*\{[^}]*overflow-y:\s*auto/.test(suiteStyles), "AI问答长内容未提供独立滚动");
assert(suiteSource.includes("appendQaAttachments(e.target.files,'file')") && suiteSource.includes("appendQaAttachments(e.target.files,'image')"), "AI问答附件选择未绑定到提问框");
assert(suiteSource.includes("reference.scrollIntoView") && suiteSource.includes("qaPermission.textContent='申请已提交'"), "引用角标定位或权限申请交互未实现");

const recent = render("recent");
assert(recent.includes("data-select-all"), "最近使用缺少全选框");
assert(recent.includes('data-recent-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>'), "最近使用工具栏缺少可访问的已选中数量");
assert(!recent.includes('class="view-switch"') && !recent.includes('title="列表视图"') && !recent.includes('title="宫格视图"'), "最近使用仍显示列表或宫格视图选择");
assert(!recent.includes('class="knowledge-summary"') && !recent.includes('aria-label="我的知识数据展示"'), "最近使用仍显示已迁移到我的知识的数据摘要卡");
assert(!recent.includes('placeholder="搜索我的知识"'), "最近使用仍保留顶栏搜索");
assert(recent.includes('data-create-content-open') && recent.includes('data-toast="已打开上传任务"') && recent.includes('data-icon-name="plus"') && recent.includes('data-icon-name="uploadCloud"') && recent.includes('data-icon-name="download"') && recent.includes('data-icon-name="share"') && recent.includes('data-icon-name="trash2"'), "最近使用工具栏按钮缺少统一图标");
assert(suiteStyles.includes(".knowledge-summary") && suiteStyles.includes(".knowledge-summary-search") && suiteStyles.includes(".knowledge-summary-submit") && !suiteStyles.includes(".recent-ai-button"), "我的知识数据展示区域样式不完整或仍保留AI问答按钮样式");
assert((recent.match(/data-recent-bulk/g) || []).length === 3 && recent.includes("data-recent-bulk disabled data-toast=\"已下载所选文件\"") && recent.includes("data-recent-bulk data-recent-share-submit disabled") && recent.includes("data-recent-bulk disabled data-toast=\"所选记录已删除\""), "最近使用下载、共享提报或删除缺少默认禁用态");
assert(recent.indexOf("data-create-content-open") < recent.indexOf('data-toast="已下载所选文件"') && recent.indexOf('data-toast="已下载所选文件"') < recent.indexOf("data-recent-share-submit") && recent.indexOf("data-recent-share-submit") < recent.indexOf('data-toast="所选记录已删除"'), "最近使用工具栏按钮顺序不正确");
assert(recent.includes("data-recent-table") && suiteSource.includes("recentSelected.textContent='已选中 '+checked.length+' 条'") && suiteSource.includes("document.querySelectorAll('[data-recent-bulk]').forEach"), "最近使用已选数量或批量按钮未接入勾选状态");
assert(suiteSource.includes('id="shareSubmissionModal"') && suiteSource.includes('id="shareSubmissionDescription"') && suiteSource.includes('type="hidden" name="shareDirectory"') && suiteSource.includes('data-share-directory-add') && suiteSource.includes("openShareSubmission(recentShareSubmit,selectedActionItems"), "最近使用共享提报缺少共用弹窗、逐项增加目录、共享说明或批量入口绑定");
assert(suiteSource.includes("window.BompDepartmentDirectoryData||[]") && suiteSource.includes("window.BompCompanyDirectoryData||[]") && suiteSource.includes("data-share-directory-search"), "共享提报目录未复用公共部门、公司目录数据或缺少目录搜索");
assert(suiteSource.includes("submissionDirectories=Array.from") && suiteSource.includes("showShareSubmissionSuccess()") && suiteSource.includes('href="my-sharing.html"'), "最近使用共享提报缺少多目录校验、提交成功反馈或共享进度入口");
assert(suiteSource.includes('id="shareModal"') && suiteSource.includes('data-share-person') && suiteSource.includes('data-share-error') && suiteSource.includes('openShareModal(share,actionItemFromTrigger(share))'), "分享操作缺少人员、权限或表单校验弹窗");
const sharePeopleData = suiteSource.match(/var shareDepartments=\[([\s\S]*?)\n  \];/);
assert(sharePeopleData && (sharePeopleData[1].match(/name:'/g) || []).length === 3 && (sharePeopleData[1].match(/,'\d{5}'\]/g) || []).length === 30, "分享弹窗未提供 3 个部门、每部门 10 人的演示数据");
assert(suiteSource.includes('id="shareDepartmentSelect"') && suiteSource.includes('id="sharePersonSelect"') && suiteSource.includes('data-share-person-add') && suiteSource.includes('function updateSharePersonOptions()') && suiteSource.includes('function addSharePersonFromSelect()'), "分享弹窗缺少部门到人员的级联选择或添加交互");
assert(suiteSource.includes("data-person-search=\"'+escapeHtml([person.name,person.department,person.team,person.employeeId].join(' '))") && suiteSource.includes("e.target.matches('#sharePeopleSearch')"), "分享接收人搜索未覆盖姓名、部门、专业和工号");
assert(suiteSource.includes("var meaningfulSize=item.size&&item.size!=='-'&&item.size!=='--'") && suiteSource.includes("size.hidden=!meaningfulSize"), "分享文件夹仍显示无意义的大小占位");
assert(suiteStyles.includes('.share-people-cascade') && suiteStyles.includes('grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr) auto'), "分享弹窗级联选择缺少稳定布局");
assert(suiteSource.includes('id="copyModal"') && suiteSource.includes('id="copyForm"') && suiteSource.includes('data-copy-open') && suiteSource.includes("toast('副本“'+copyName+'”已创建"), "创建副本操作缺少名称、保存位置或成功反馈弹窗");
assert(!suiteSource.includes('data-toast="已提交共享审核"') && !suiteSource.includes('data-toast="文件副本已创建"') && !suiteSource.includes('data-toast="副本已创建"'), "分享提报或创建副本仍存在仅显示提示的占位入口");
assert(/\[data-recent-bulk\]:disabled,\s*\.suite-toolbar \[data-knowledge-bulk\]:disabled,\s*\.suite-toolbar \[data-collaboration-bulk\]:disabled,\s*\.suite-toolbar \[data-recycle-bulk\]:disabled\s*\{[^}]*cursor:\s*not-allowed/.test(suiteStyles), "最近使用、我的知识、我的协作或回收站批量按钮缺少明确禁用样式");
assert(/\.recent-selected-count\s*\{[^}]*min-width:\s*78px[^}]*font-variant-numeric:\s*tabular-nums[^}]*white-space:\s*nowrap/.test(suiteStyles), "最近使用已选数量缺少稳定宽度或数字样式");
const overflowMenu = suiteSource.match(/function openMenu\(trigger\)\{[\s\S]*?\n  function closeMenu/);
assert(overflowMenu && overflowMenu[0].includes("data-share-submit-single") && overflowMenu[0].includes("icon('uploadCloud',16)+'共享提报"), "最近使用更多菜单缺少共享提报弹窗入口");
assert(suiteSource.includes('data-create-content-open') && suiteSource.includes('id="createContentModal"'), "我的知识库新建按钮未接入新建内容弹窗");
assert(suiteSource.includes('name="createType" value="文档"') && suiteSource.includes('name="createType" value="表格"') && suiteSource.includes('name="createType" value="PPT"'), "新建内容弹窗缺少文档、表格或PPT类型");
assert(suiteSource.includes('不选择目录（保存至我的知识库）') && suiteSource.includes('data-create-folder-confirm'), "新建内容弹窗缺少可选目录或新建文件夹能力");
assert(suiteStyles.includes('.create-type-grid') && suiteStyles.includes('.create-folder-editor'), "新建内容弹窗样式缺失");
assert(overflowMenu[0].includes("copyAction=page==='knowledge'?'':'<button data-copy-open") && overflowMenu[0].includes("'+copyAction+shareSubmitAction+((isCollaboration?canManage:canEdit)?'<button data-toast=\"权限管理已打开\""), "我的知识未移除创建副本，或其他页面的共享提报与权限管理分支不正确");
assert(!recent.includes("<th>类型</th>") && recent.includes("<th>来源</th>") && recent.includes("<th>文件大小</th>") && recent.includes("<th>文件位置</th>") && recent.includes("<th>最近访问时间</th>"), "最近使用字段不正确");
assert(["他人分享", "我的知识", "部门知识库", "公司知识库"].every((source) => recent.includes(`>${source}<`)), "最近使用来源字段不完整");
assert(recent.indexOf("<th>名称</th>") < recent.indexOf("<th>文件大小</th>") && recent.indexOf("<th>文件大小</th>") < recent.indexOf("<th>最近访问时间</th>") && recent.indexOf("<th>最近访问时间</th>") < recent.indexOf("<th>来源</th>") && recent.indexOf("<th>来源</th>") < recent.indexOf("<th>文件位置</th>") && recent.indexOf("<th>文件位置</th>") < recent.indexOf("<th>操作</th>"), "最近使用字段顺序不正确");
assert(recent.includes('title="部门知识库 /') && !recent.includes('>部门知识库 /'), "最近使用文件位置未使用末级目录显示和完整路径提示");
assert(!recent.includes("权限类型") && !recent.includes("创建文件夹"), "最近使用仍包含已移除的筛选或操作");
assert(recent.includes("data-filter-display>类型</span>") && recent.includes("data-filter-display>来源</span>"), "最近使用类型或来源筛选默认状态不正确");
assert(suiteSource.includes('data-source="\'+source+\'"') && suiteSource.includes('filterSelect("来源","source",["他人分享","我的知识","部门知识库","公司知识库"])'), "最近使用来源筛选未接入四类来源数据");
assert(/\.suite-table th\s*\{[^}]*white-space:\s*nowrap/.test(suiteStyles), "表格短标题未保持单行");
assert(/\.table-recent \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles), "最近使用名称列未吸收剩余空间");
assert(/\.table-recent \.col-size,\s*\.table-recent \.col-time,\s*\.table-recent \.col-source,\s*\.table-recent \.col-location,\s*\.table-recent \.col-actions\s*\{[^}]*width:\s*14%/.test(suiteStyles), "最近使用次要字段列宽未统一");
assert(/\.table-recent th\s*\{[^}]*background:\s*#f8fafc/.test(suiteStyles), "最近使用表头填充色不正确");
assert(/\.table-recent:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child,[\s\S]*?\.table-recent:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) td:last-child\s*\{[^}]*padding-right:\s*var\(--table-cell-padding-inline\)[^}]*text-align:\s*center/.test(suiteStyles), "最近使用操作列表头或行内容未居中");
assert(/\.table-recent:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) td:last-child \.row-actions\s*\{[^}]*width:\s*100%[^}]*justify-content:\s*center[^}]*gap:\s*8px[^}]*margin-right:\s*auto[^}]*margin-left:\s*auto/.test(suiteStyles), "最近使用操作按钮未使用标准间距并居中");
assert(/\.suite-table-wrap\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(suiteStyles), "原型套件文件列表仍保留左右垂直边框");
assert(/\.table-shell\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(knowledgeTableStyles), "公共知识表格仍保留左右垂直边框");
assert(/\.recent-panel\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(legacyRecentStyles), "旧版最近使用列表仍保留左右垂直边框");
assert(/\.workflow-table-wrap\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(uploadWorkflowStyles), "部门知识上传文件列表仍保留左右垂直边框");
assert(/\.toolbar-select\.is-active\s*\{[^}]*border-color:\s*var\(--color-primary\)/.test(suiteStyles), "筛选下拉框缺少主题色激活态");
assert(suiteSource.includes("label+'：'"), "筛选下拉框缺少类别与选中值组合显示");

const knowledge = render("knowledge");
const knowledgeTopbar = knowledge.match(/<header class="suite-topbar personal-library-topbar">[\s\S]*?<\/header>/)?.[0] || "";
const knowledgeListStart = knowledge.indexOf('<section class="personal-library-list-panel" aria-label="我的知识列表">');
const knowledgeToolbarEnd = knowledge.indexOf('<div class="suite-table-wrap">', knowledgeListStart);
const knowledgeToolbar = knowledge.slice(knowledgeListStart, knowledgeToolbarEnd);
assert(knowledge.includes('class="knowledge-summary"') && knowledge.includes('aria-label="我的知识数据展示"') && knowledge.includes('placeholder="搜索我的知识"') && knowledge.includes('data-knowledge-summary-submit') && knowledge.includes('> 搜索</button>'), "我的知识缺少迁移后的数据展示或搜索按钮");
assert(!knowledgeTopbar.includes('personal-library-page-actions') && !knowledgeTopbar.includes('data-create-content-open') && !knowledgeTopbar.includes('data-toast="已打开上传任务"'), "我的知识顶部横条仍保留新建或上传");
assert(knowledgeToolbar.includes('data-knowledge-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>') && knowledgeToolbar.indexOf('data-knowledge-selected') < knowledgeToolbar.indexOf('> 新建</button>'), "我的知识列表工具栏缺少左侧已选数量");
assert(knowledgeToolbar.includes('data-create-content-open') && knowledgeToolbar.includes('> 新建</button>') && knowledgeToolbar.includes('data-toast="已打开上传任务"') && knowledgeToolbar.includes('> 上传</button>'), "我的知识列表工具栏缺少新建或上传");
assert(knowledgeToolbar.indexOf('> 新建</button>') < knowledgeToolbar.indexOf('> 上传</button>') && knowledgeToolbar.indexOf('> 上传</button>') < knowledgeToolbar.indexOf('> 创建文件夹</button>'), "我的知识列表工具栏的新建、上传或创建文件夹顺序不正确");
assert(!knowledge.includes('data-nav="qa-result.html">AI问答') && !knowledge.includes('class="recent-ai-button"'), "我的知识数据展示仍保留AI问答入口");
assert(knowledge.indexOf('class="knowledge-summary"') < knowledge.indexOf('aria-label="我的知识列表"'), "我的知识数据展示未位于列表工作区上方");
assert(knowledge.includes("文件夹") && knowledge.includes("共享范围") && knowledge.includes("创建时间") && !knowledge.includes("<th>类型</th>") && !knowledge.includes("<th>大小</th>"), "我的知识字段不正确");
assert(!knowledge.includes('class="view-switch"') && !knowledge.includes('aria-label="视图切换"'), "我的知识仍显示列表或宫格视图切换");
assert(knowledge.indexOf("<th>名称</th>") < knowledge.indexOf("<th>创建时间</th>") && knowledge.indexOf("<th>创建时间</th>") < knowledge.indexOf("<th>共享范围</th>"), "我的知识创建时间未紧邻名称列");
assert(!/<table class="suite-table table-knowledge"[\s\S]*?<col class="col-size">[\s\S]*?<\/table>/.test(knowledge), "我的知识仍包含大小列定义");
assert(/<td class="time-cell" title="2026-07-18 14:20">2026-07-18 14:20<\/td>/.test(knowledge), "我的知识创建时间未完整展示");
assert(/\.table-knowledge \.col-time\s*\{[^}]*width:\s*18%/.test(suiteStyles) && /\.table-knowledge \.time-cell\s*\{[^}]*white-space:\s*nowrap[^}]*font-variant-numeric:\s*tabular-nums/.test(suiteStyles), "我的知识创建时间列宽或单行样式不正确");
const knowledgeFolderRows = [...knowledge.matchAll(/<tr[^>]*data-folder="true"[^>]*>[\s\S]*?<\/tr>/g)].map((match) => match[0]);
assert(knowledgeFolderRows.length === 2 && knowledgeFolderRows.every((row) => !row.includes(">下载<") && row.includes(">分享<") && row.includes(">删除<")), "我的知识文件夹行仍显示下载或缺少保留操作");
assert(/<tr[^>]*data-folder="false"[^>]*>[\s\S]*?>下载<[\s\S]*?<\/tr>/.test(knowledge), "我的知识普通文件行缺少下载操作");
assert(knowledge.includes('data-filter-table data-knowledge-table') && suiteSource.includes("if(table.matches('[data-knowledge-table]'))") && suiteSource.includes("knowledgeSelected.textContent='已选中 '+checked.length+' 条'"), "我的知识已选数量未接入列表选择状态");
assert(/\.table-knowledge:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child\s*\{[^}]*padding-right:\s*var\(--table-cell-padding-inline\)[^}]*text-align:\s*center/.test(suiteStyles), "我的知识操作列表头未在列内居中");
assert(/\.table-knowledge td:last-child\s*\{[^}]*text-align:\s*right/.test(suiteStyles) && /\.table-knowledge td:last-child \.row-actions\s*\{[^}]*justify-content:\s*flex-end/.test(suiteStyles), "我的知识行内操作未固定在列表右端");
assert(knowledge.includes("待审核") && knowledge.includes("已发布") && knowledge.includes("协作分享") && knowledge.includes("私有") && !knowledge.includes("私有草稿"), "我的知识状态文案不完整或仍显示私有草稿");
assert(knowledge.includes('data-status="私有"') && knowledgeToolbar.includes('<option value="私有">私有</option>'), "我的知识私有状态与筛选值未统一");
assert(suiteSource.includes('function folderAssetIcon') && suiteSource.includes('if(item.type==="folder")return folderAssetIcon(22)') && suiteSource.includes('src="assets/folder-1.png"'), "我的知识文件夹图标未使用素材图片1");
assert(/\.folder-list-asset\s*\{[^}]*width:\s*22px[^}]*height:\s*22px[^}]*object-fit:\s*contain/.test(suiteStyles), "我的知识文件夹素材图标尺寸样式缺失");
[
  ["status-published", "已发布"],
  ["status-review", "待审核"],
  ["status-draft", "私有"],
  ["status-collaboration", "协作分享"]
].forEach(([className, label]) => {
  assert(knowledge.includes(`knowledge-status ${className}\">${label}`), `我的知识${label}状态缺少语义样式`);
});
[
  ["status-published", "#216b57", "#e8f5ef"],
  ["status-review", "#945a0a", "#fff3d9"],
  ["status-draft", "#596260", "#f0f2f2"],
  ["status-collaboration", "#315f99", "#eaf2fc"]
].forEach(([className, color, background]) => {
  const rule = new RegExp(`\\.knowledge-status\\.${className}\\s*\\{[^}]*color:\\s*${color}[^}]*background:\\s*${background}`, "i");
  assert(rule.test(suiteStyles), `我的知识${className}状态配色不正确`);
});
assert(knowledge.includes("部门知识库 / 供应链运营中心"), "我的知识缺少完整部门目录");
assert(knowledge.includes('title="部门知识库 /') && !knowledge.includes('>部门知识库 /'), "我的知识文件位置未使用末级目录显示和完整路径提示");
assert(knowledge.includes("data-filter-display>共享范围</span>") && knowledge.includes("data-filter-display>状态</span>"), "我的知识筛选默认文案不正确");

const collaboration = render("collaboration");
const collaborationTopbar = collaboration.match(/<header class="suite-topbar personal-library-topbar">[\s\S]*?<\/header>/)?.[0] || "";
const collaborationToolbarStart = collaboration.indexOf('<div class="suite-toolbar">');
const collaborationTableStart = collaboration.indexOf('<div class="suite-table-wrap">', collaborationToolbarStart);
const collaborationToolbar = collaboration.slice(collaborationToolbarStart, collaborationTableStart);
assert(collaboration.includes("全部（") && collaboration.includes("分享给我（") && collaboration.includes("我分享的（"), "我的协作缺少视图页签");
assert(collaboration.includes('class="collaboration-tabs status-tabs" role="group" aria-label="协作范围"') && collaboration.includes('class="is-active" type="button" aria-pressed="true"') && (collaboration.match(/aria-pressed="false"/g) || []).length === 2, "我的协作范围页签缺少可访问的选中状态");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs,\s*body\[data-page="uploads"\] \.status-tabs,\s*body\[data-page="sharing"\] \.status-tabs\s*\{[^}]*height:\s*56px[^}]*gap:\s*32px[^}]*border-bottom:\s*1px solid #dfe6e4[^}]*border-radius:\s*0[^}]*background:\s*#fff/.test(suiteStyles), "我的协作范围页签未使用白底与底部分隔线样式");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active\s*\{[^}]*color:\s*var\(--color-primary\)[^}]*font-weight:\s*600/.test(suiteStyles) && /body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active::after,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active::after,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active::after\s*\{[^}]*height:\s*3px[^}]*background:\s*var\(--color-primary\)/.test(suiteStyles), "我的协作当前页签未使用项目主色文字与短下划线");
assert(suiteSource.includes("button.setAttribute('aria-pressed',String(isSelected))"), "我的协作页签切换未同步可访问选中状态");
assert(!collaboration.includes('class="view-switch"') && !collaboration.includes('title="列表视图"') && !collaboration.includes('title="宫格视图"'), "我的协作仍显示列表或宫格视图选择");
assert(!collaboration.includes("data-reset-filter") && !collaboration.includes(">重置<"), "我的协作仍显示重置按钮");
assert(collaboration.includes("data-collaboration-table") && collaboration.includes("data-select-all") && collaboration.includes("data-row-select"), "我的协作缺少表头全选或行复选框");
assert(collaborationToolbar.includes('data-collaboration-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>') && collaborationToolbar.includes('data-create-content-open') && (collaborationToolbar.match(/data-collaboration-bulk disabled/g) || []).length === 2, "我的协作缺少已选数量、新建、下载或删除批量操作");
assert(collaborationToolbar.indexOf('data-collaboration-selected') < collaborationToolbar.indexOf('> 新建</button>') && collaborationToolbar.indexOf('> 新建</button>') < collaborationToolbar.indexOf('> 下载</button>') && collaborationToolbar.indexOf('> 下载</button>') < collaborationToolbar.indexOf('> 删除</button>'), "我的协作左侧工具栏顺序不正确");
assert(/<div class="toolbar-right">[\s\S]*?data-filter-key="permission"[\s\S]*?data-filter-key="type"/.test(collaborationToolbar), "我的协作筛选未放在工具栏右侧");
assert(!collaborationTopbar.includes('personal-library-page-actions') && !collaborationTopbar.includes('data-create-content-open') && !collaborationTopbar.includes('data-toast="已打开上传任务"') && !collaborationTopbar.includes('> 上传</button>'), "我的协作顶部横条仍显示新建或上传");
assert(suiteSource.includes("if(table.matches('[data-collaboration-table]'))") && suiteSource.includes("collaborationSelected.textContent='已选中 '+checked.length+' 条'") && suiteSource.includes("document.querySelectorAll('[data-collaboration-bulk]')"), "我的协作选择计数或批量按钮未接入选择状态");
assert(collaboration.indexOf('class="col-check"') < collaboration.indexOf('class="col-name"') && collaboration.indexOf('data-select-all') < collaboration.indexOf("<th>名称</th>"), "我的协作复选框列未放在名称列前");
assert(/\.table-collaboration \.col-check,[\s\S]*?width:\s*4%/.test(suiteStyles) && /\.table-collaboration \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles), "我的协作复选框或名称列宽不正确");
assert(/\.table-collaboration:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child\s*\{[^}]*padding-right:\s*var\(--table-cell-padding-inline\)[^}]*text-align:\s*center/.test(suiteStyles), "我的协作操作列表头未在列内居中");
assert(collaboration.includes("<th>文件大小</th>") && collaboration.includes("<th>类型</th>"), "我的协作新增字段不完整");
const readOnlyRow = collaboration.match(/<tr[^>]*data-permission="仅查看"[\s\S]*?<\/tr>/);
assert(readOnlyRow && !readOnlyRow[0].includes(">编辑<"), "仅查看协作文件仍提供编辑操作");
assert(collaboration.includes('data-permission="仅查看"') && collaboration.includes('data-permission="可管理"') && collaboration.includes('data-permission="可编辑"') && collaboration.includes('data-permission="创建人"') && collaboration.includes('data-permission="可查看"'), "我的协作更多菜单缺少权限上下文");
assert(suiteSource.includes('canManage=isCollaboration&&permission==="可管理"') && suiteSource.includes("shareSubmitAction=(page==='recent'||canManage)?'<button data-share-submit-single") && suiteSource.includes("(isCollaboration?canManage:canEdit)?'<button data-toast=\"权限管理已打开\""), "我的协作共享提报或权限管理未限制为可管理权限");
assert(!collaboration.includes("相关度排序") && !collaboration.includes("文件格式"), "我的协作仍包含已移除筛选");

const favorites = render("favorites");
assert(!favorites.includes('class="view-switch"') && !favorites.includes('aria-label="视图切换"') && !favorites.includes('title="列表视图"') && !favorites.includes('title="宫格视图"'), "我的收藏仍显示列表或宫格视图切换");
const favoriteActions = favorites.match(/<div class="row-actions favorite-actions">[\s\S]*?<\/div>/);
assert(favoriteActions && ["下载", "分享", "删除"].every((action) => favoriteActions[0].includes(`>${action}<`)) && favoriteActions[0].includes("data-more"), "我的收藏行内操作未保留下载、分享、删除和更多入口");
assert(!favoriteActions[0].includes(">取消收藏<") && !favoriteActions[0].includes(">创建副本<") && !favoriteActions[0].includes(">反馈<"), "我的收藏次要操作仍平铺在列表中");
assert(suiteSource.includes("isFavorites=page==='favorites'") && suiteSource.includes("icon('star',16)+'取消收藏") && suiteSource.includes("icon('copy',16)+'创建副本") && suiteSource.includes("icon('messageSquare',16)+'反馈"), "我的收藏更多菜单缺少取消收藏、创建副本或反馈");
assert(favorites.includes("favorites-bulk-actions") && favorites.includes('data-toast="已下载所选收藏"') && favorites.includes('data-toast="已取消所选收藏"') && favorites.includes('data-toast="所选收藏已删除"'), "我的收藏工具栏缺少下载、取消收藏或删除按钮");
assert(favorites.indexOf("favorites-bulk-actions") < favorites.indexOf("<div class=\"toolbar-right\">"), "我的收藏筛选栏未放在右侧");
assert(favorites.includes('data-favorites-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>') && favorites.includes("data-favorites-table") && favorites.includes("data-select-all") && favorites.includes("data-row-select"), "我的收藏缺少已选数量或列表选择控件");
assert(suiteSource.includes("table.matches('[data-favorites-table]')") && suiteSource.includes("data-favorites-bulk"), "我的收藏选择状态未联动工具栏按钮");
assert(!favorites.includes("<th>类型</th>") && !favorites.includes('class="col-type"') && favorites.includes('data-type="'), "我的收藏类型列未移除或类型筛选数据缺失");
assert(favorites.includes("<th>文件位置</th>") && favorites.includes("公司知识库 /") && favorites.includes("部门知识库 /"), "我的收藏文件位置不符合公开范围");
const favoritesPageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "my-favorites.html"), "utf8");
assert(favoritesPageSource.includes('suite.css?v=2.102.0') && favoritesPageSource.includes('suite.js?v=2.102.0'), "我的收藏未刷新顶部与内容间距资源版本");

const sharing = render("sharing");
assert(sharing.includes("最近7天") && sharing.includes("最近15天") && sharing.includes("最近30天"), "共享统计缺少提报时间选项");
assert(sharing.includes("公司知识库 /") && sharing.includes("部门知识库 /"), "共享统计目标目录缺少完整层级");
assert(sharing.includes('class="status-tabs" role="group" aria-label="共享审核状态"') && sharing.includes('class="is-active" type="button" aria-pressed="true" data-status-filter=""') && (sharing.match(/aria-pressed="false"/g) || []).length === 3, "我的共享状态页签缺少可访问的选中状态");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs,\s*body\[data-page="uploads"\] \.status-tabs,\s*body\[data-page="sharing"\] \.status-tabs\s*\{[^}]*height:\s*56px[^}]*justify-content:\s*flex-start[^}]*gap:\s*32px[^}]*border-bottom:\s*1px solid #dfe6e4[^}]*border-radius:\s*0[^}]*background:\s*#fff/.test(suiteStyles), "我的共享状态页签未复用白底轻量页签容器样式");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs button,\s*body\[data-page="uploads"\] \.status-tabs button,\s*body\[data-page="sharing"\] \.status-tabs button\s*\{[^}]*flex:\s*0 0 auto[^}]*font-size:\s*16px/.test(suiteStyles), "我的共享状态页签未使用内容宽度或 16px 字号");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active\s*\{[^}]*color:\s*var\(--color-primary\)[^}]*font-weight:\s*600/.test(suiteStyles) && /body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active::after,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active::after,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active::after\s*\{[^}]*height:\s*3px[^}]*background:\s*var\(--color-primary\)/.test(suiteStyles), "我的共享当前页签未使用项目主色文字与 3px 短下划线");
assert(!/body\[data-page="sharing"\] \.status-tabs button \+ button\s*\{[^}]*border-left/.test(suiteStyles) && !/body\[data-page="sharing"\] \.status-tabs button\s*\{[^}]*flex:\s*0 0 148px/.test(suiteStyles), "我的共享状态页签仍保留竖向分隔线或等宽分段");
assert(suiteSource.includes("if(button.hasAttribute('aria-pressed'))button.setAttribute('aria-pressed',String(isSelected))"), "我的共享页签切换未同步可访问选中状态");

const uploads = render("uploads");
assert(uploads.includes("<th>上传时间</th>"), "我的上传缺少上传时间字段");
assert(!uploads.includes("<th>智能处理结果</th>") && !uploads.includes('class="col-result"') && !uploads.includes('class="result-text"'), "我的上传仍显示智能处理结果字段");
assert(uploads.includes("> 上传</button>") && uploads.includes(">批量确认<") && uploads.includes(">批量修改<"), "我的上传全部视图缺少上传或批量操作");
assert(uploads.includes('data-upload-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>') && uploads.includes('data-filter-table data-upload-table data-upload-filter='), "我的上传缺少已选数量或选择状态表格标识");
assert(uploads.indexOf('data-upload-selected') < uploads.indexOf('> 上传</button>') && uploads.indexOf('> 上传</button>') < uploads.indexOf('>批量确认<') && uploads.indexOf('>批量确认<') < uploads.indexOf('>批量修改<') && uploads.indexOf('>批量修改<') < uploads.indexOf('>删除<'), "我的上传已选数量、上传或批量按钮顺序不正确");
const uploadsTopbar = uploads.slice(0, uploads.indexOf('<div class="suite-content">'));
assert(!uploadsTopbar.includes('personal-library-page-actions') && !uploadsTopbar.includes('> 新建</button>') && !uploadsTopbar.includes('> 上传</button>'), "我的上传顶部横条仍显示新建或上传");
assert(suiteSource.includes("if(table.matches('[data-upload-table]'))") && suiteSource.includes("uploadSelected.textContent='已选中 '+checked.length+' 条'"), "我的上传已选数量未接入选择状态");
assert(uploads.includes("最近7天") && uploads.includes("最近15天") && uploads.includes("最近30天"), "我的上传缺少时间选项");
assert(uploads.includes("data-filter-display>上传时间</span>"), "我的上传时间筛选默认文案不正确");
assert(/\.table-uploads \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-uploads \.col-size\s*\{[^}]*width:\s*10%/.test(suiteStyles) && /\.table-uploads \.col-time\s*\{[^}]*width:\s*15%/.test(suiteStyles) && /\.table-uploads \.col-status\s*\{[^}]*width:\s*13%/.test(suiteStyles) && /\.table-uploads \.col-actions\s*\{[^}]*width:\s*22%/.test(suiteStyles), "我的上传列宽未按信息优先级向左收紧");
assert(/body\[data-page="uploads"\] \.suite-toolbar \.suite-search input\s*\{[^}]*border-radius:\s*3px/.test(suiteStyles), "我的上传列表搜索框未使用 3px 圆角");

const department = render("department");
assert(department.includes('class="library-breadcrumb"') && department.includes('aria-label="当前目录路径"') && department.includes('>部门知识库</button>') && department.includes('aria-current="page" title="架构管理">架构管理</span>'), "部门知识库缺少可回退的当前层级面包屑");
assert(!department.includes('<th>所属专业</th>') && !department.includes('<col class="col-major">') && !department.includes('<th>版本</th>') && !department.includes('<col class="col-version">'), "部门知识库仍显示所属专业或版本字段");
assert(/\.table-library-department:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child\s*\{[^}]*padding-right:\s*var\(--table-cell-padding-inline\)[^}]*padding-left:\s*calc\(var\(--table-cell-padding-inline\) \+ clamp\(0px, calc\(\(100vw - 1280px\) \* 0\.075\), 48px\)\)[^}]*text-align:\s*center/.test(suiteStyles), "部门知识库操作列表头未按桌面宽度与行内按钮组视觉居中");
assert(department.includes('<header class="suite-topbar library-topbar"><div class="library-directory-context"') && !department.includes('class="suite-crumb"'), "部门知识库未移除面包屑或未将目录信息移入顶部栏");
assert(!department.includes('<div class="suite-content"><div class="library-directory-context"'), "部门知识库内容区仍保留重复目录信息");
assert(department.includes('data-library-kind="folder"') && department.includes("供应链业务架构管理") && !department.includes('data-library-kind="file"'), "部门知识库一级目录未仅展示直接二级目录");
assert(!department.includes('> 新建文件夹</button>') && !department.includes('> 批量下载</button>') && !department.includes('> 上传</button>'), "部门知识库目录层仍显示普通用户无权的操作");
assert(suiteSource.includes("function libraryToolbar(scope,directory,files)") && suiteSource.includes("viewSwitch=scope==='company'?listViewSwitch():''") && suiteSource.includes("libraryToolbar(scope,directory,files)"), "部门知识库未固定列表视图或工具栏未按知识库类型分支");
assert(!suiteSource.includes("data-toast=\"新建文件夹窗口已打开\"") && suiteSource.includes("companySearch=scope==='company'?searchBox('搜索公司知识库')") && suiteSource.includes("uploadAction=scope==='company'?'<button class=\"btn btn-primary\"") && suiteSource.includes("left=companySearch+(hasChildren?'':uploadAction+'<button class=\"btn\" type=\"button\" data-toast=\"所选文件已批量下载\""), "公共部门或公司知识库仍生成新建文件夹，或公司搜索与叶子层操作分支不正确");
assert(suiteSource.includes('function libraryUploadTimeSelect()') && suiteSource.includes('<option value="today">今天</option>') && suiteSource.includes('<option value="7">近7天</option>') && suiteSource.includes('<option value="30">近30天</option>') && suiteSource.includes('<option value="quarter">本季度</option>') && suiteSource.includes('<option value="year">今年</option>') && suiteSource.includes('<option value="lastYear">去年</option>'), "部门知识库上传时间下拉选项不完整");
assert(suiteSource.includes("uploadTimeFilter=scope==='department'?libraryUploadTimeSelect()") && suiteSource.includes('data-upload-date=') && suiteSource.includes('function libraryUploadTimeMatches(dateValue,filterValue)') && suiteSource.includes("row.dataset.libraryKind==='folder'||libraryUploadTimeMatches"), "部门知识库上传时间筛选未接入列表或未保留目录行");
assert(!suiteSource.includes("topActions=scope==='company'") && suiteSource.includes("departmentSearch=scope==='department'?searchBox('搜索部门知识库')") && suiteSource.includes("right=filters||departmentSearch?'<div class=\"toolbar-right\">'+filters+departmentSearch"), "部门或公司知识库搜索框仍位于顶部栏，或部门筛选区布局被误改");
assert(suiteSource.includes("folderRows+fileRows") && suiteSource.includes("directory.children.length?2:8") && suiteSource.includes("directory.isRoot||directory.pathNodes.length<2"), "部门和公司知识库缺少文件夹优先、混合列表或叶子文件规则");
assert(suiteSource.includes("hasChildren=directory.children.length>0") && suiteSource.includes("新建文件夹") && suiteSource.includes("上传窗口已打开") && suiteSource.includes("所选文件已批量下载"), "知识库工具栏未按目录或叶子层级切换操作");
assert(suiteSource.includes("bindKnowledgeLibraryParentSelection") && suiteSource.includes("event.stopImmediatePropagation()") && suiteSource.includes("sidebar.activateItem(item.dataset.key)"), "侧栏深层父目录仍可能自动跳入首个子节点");
assert(suiteSource.includes("var libraryTarget=e.target.closest('[data-library-target]')") && suiteSource.includes("navigateLibrary(libraryScope,libraryKey)"), "知识库文件夹行或面包屑未驱动目录、侧栏与右侧内容联动");
const company = render("company");
assert(company.includes('<th>所属专业</th>') && company.includes('<col class="col-major">') && company.includes('<th>版本</th>') && company.includes('<col class="col-version">'), "公司知识库的所属专业或版本字段被误删");
assert(company.includes('class="library-breadcrumb"') && company.includes('>公司知识库</button>') && company.includes('aria-current="page" title="核心业务">核心业务</span>'), "公司知识库缺少可回退的当前层级面包屑");
assert(company.includes('data-library-kind="folder"') && company.includes("数字化专业") && !company.includes('data-library-kind="file"'), "公司知识库一级目录未仅展示直接二级目录");
assert(!company.includes('> 新建文件夹</button>') && !company.includes('> 批量下载</button>') && company.includes('class="suite-toolbar library-toolbar"') && company.indexOf('class="suite-toolbar library-toolbar"') < company.indexOf('class="suite-table-wrap library-table-wrap"') && company.includes('placeholder="搜索公司知识库"'), "公司知识库目录层仍显示无权操作，或搜索未移至列表左上角");
assert(/body\[data-page="company"\] \.library-toolbar \.suite-search input\s*\{[^}]*border-radius:\s*3px/.test(suiteStyles), "公司知识库列表搜索框未使用 3px 圆角");
assert(suiteSource.includes("if(page==='company')navigateLibrary('company',e.detail.key)"), "公司知识库目录切换仍需整页刷新");

const review = render("review");
assert(review.includes("全部 <b>136</b>") && review.includes("待审核 <b>36</b>") && review.includes("已通过 <b>78</b>") && review.includes("已退回 <b>16</b>"), "审核工作台状态视图不完整");
assert((review.match(/data-review-status=/g) || []).length >= 8, "审核工作台示例数据不足 8 条");
assert(review.includes("批量审核通过") && review.includes("批量退回修改") && review.includes("data-review-selected"), "审核工作台缺少批量处理能力");
assert(!review.includes("data-review-date-start") && !review.includes("data-review-date-end") && review.includes("输入关键词或提交人搜索"), "审核工作台仍显示提交日期筛选");
assert(review.includes("<th>共享目标</th>") && review.includes("公司知识库"), "审核工作台缺少共享目标列");
assert(review.includes("<th>所属部门</th>") && review.includes("供应链运营中心"), "审核工作台缺少提交人所属部门列");
assert(review.indexOf("<th>提交人</th>") < review.indexOf("<th>所属部门</th>") && review.indexOf("<th>所属部门</th>") < review.indexOf("<th>共享目标</th>") && review.indexOf("<th>共享目标</th>") < review.indexOf("<th>提交时间</th>"), "审核工作台所属部门与共享目标列顺序不正确");
assert(!review.includes("<th>类型</th>"), `审核工作台列表仍显示类型表头：${review.includes("<th>类型</th>")}`);
assert(!review.includes('class="col-type"'), `审核工作台列表仍显示类型列定义：${review.includes('class="col-type"')}`);
assert(!review.includes("<td>文档</td>"), `审核工作台列表仍显示类型单元格：${review.includes("<td>文档</td>")}`);
assert(review.includes('<td>张三</td><td>供应链运营中心</td><td class="review-shared-target-cell">公司知识库</td>'), "审核工作台提交人、所属部门和共享目标数据未按表头顺序对齐");
assert(review.includes('<col class="col-owner"><col class="col-department"><col class="col-shared-target"><col class="col-time">'), "审核工作台列宽定义未按所属部门、共享目标顺序排列");
assert(!review.includes('class="suite-topbar"'), "审核工作台仍显示重复顶栏面包屑");
assert(review.includes('class="col-shared-target"') && review.includes('class="col-department"') && /\.table-review \.col-actions\s*\{[^}]*width:\s*17\.5%/.test(suiteStyles), "审核工作台中间字段未整体右移或操作列空间不正确");
assert(/\.review-tabs\s*\{[^}]*padding-left:\s*0/.test(suiteStyles), "审核工作台状态页签未与下方内容容器左边界对齐");
assert(/\.table-review td:last-child\s*\{[^}]*text-align:\s*right/.test(suiteStyles) && /\.table-review td:last-child \.review-row-actions\s*\{[^}]*justify-content:\s*flex-end/.test(suiteStyles), "审核工作台操作内容未靠右对齐");
const pendingReviewRow = review.match(/<tr[^>]*data-review-status="待审核"[\s\S]*?<\/tr>/);
const passedReviewRow = review.match(/<tr[^>]*data-review-status="已通过"[\s\S]*?<\/tr>/);
assert(pendingReviewRow && pendingReviewRow[0].includes("查看申请") && pendingReviewRow[0].includes("审核通过") && pendingReviewRow[0].includes("退回修改"), "待审核记录操作不完整");
assert(pendingReviewRow && (pendingReviewRow[0].match(/class="text-action/g) || []).length === 3 && !pendingReviewRow[0].includes('class="btn'), "审核工作台行内操作仍显示按钮边框或背景");
assert(/\.review-row-actions \.text-action:focus-visible\s*\{[^}]*outline:\s*2px solid/.test(suiteStyles), "审核工作台无边框行内操作缺少键盘焦点反馈");
assert(passedReviewRow && !passedReviewRow[0].includes("审核通过") && !passedReviewRow[0].includes("退回修改"), "已处理记录仍提供重复审核操作");
assert(review.includes('id="reviewReturnModal"') && review.includes('id="reviewReturnForm"') && review.includes('id="reviewReturnReason"') && review.includes('退回理由 <em>选填</em>') && review.includes('maxlength="300"'), "退回修改缺少选填理由弹窗或字数限制");
assert(suiteSource.includes("reviewDecision.dataset.reviewDecision==='退回'") && suiteSource.includes("openReviewReturnModal(reviewDecision,[reviewIndex])") && suiteSource.includes("openReviewReturnModal(reviewBulk,reviewIndices)") && suiteSource.includes("submitReviewReturn()"), "单条、详情或批量退回未统一进入理由弹窗");
assert(suiteSource.includes("reviewItems[index].returnReason=reason") && suiteSource.includes("if(reviewReturnModal&&!reviewReturnModal.hidden){closeReviewReturnModal();return}"), "退回理由未保存，或 Esc 未优先关闭退回弹窗");
assert(/\.review-return-modal\s*\{[^}]*z-index:\s*140/.test(suiteStyles) && /\.review-return-field textarea\s*\{[^}]*min-height:\s*120px/.test(suiteStyles) && /\.review-return-submit\s*\{[^}]*color:\s*#fff[^}]*background:\s*#c93640/.test(suiteStyles), "退回理由弹窗层级、文本域或危险主操作样式不完整");
assert(review.includes('id="reviewDrawer"') && review.includes("知识基本信息") && review.includes("知识速读") && review.includes("入库位置"), "审核申请详情抽屉内容不完整");
assert(review.indexOf("入库位置") < review.indexOf("知识基本信息") && (review.match(/class="review-target-path/g) || []).length >= 2, "审核申请详情未在基本信息前展示两条入库目录");
assert(/\.review-drawer\s*\{[^}]*position:\s*fixed[^}]*width:\s*min\(480px/i.test(suiteStyles), "审核申请详情未使用 480px 右侧抽屉");

const management = render("management");
["知识统计", "知识管理", "上传任务", "共享管理", "回收站", "管理日志"].forEach((tab) => {
  assert(management.includes(`>${tab}<`), `部门知识库管理缺少${tab}页签`);
});
assert(!management.includes('href="department-directory-management.html"') && !management.includes('>目录管理</a>'), "部门知识库管理仍展示目录管理页签");
assert(management.includes("部门知识总量") && management.includes("本月新增") && management.includes("AI 引用次数"), "部门知识统计三项指标不完整");
assert(management.includes("<strong>32 <small>篇</small></strong>") && !management.includes("<strong>+32 <small>篇</small></strong>"), "部门知识统计本月新增仍显示加号");
assert(!management.includes("本月访问量"), "部门知识统计仍包含已移除的本月访问量卡片");
assert((management.match(/class="metric-card"/g) || []).length === 3, "部门知识统计顶部未保持三个统计卡片");
assert(management.includes("distribution-chart") && management.includes("trend-chart"), "部门知识统计缺少分布或趋势图");
assert(management.includes("department-bar-chart") && management.includes('class="department-bar"') && management.includes('class="bar-value"'), "部门知识分布未改为柱顶带数值的条形图");
assert(management.includes('viewBox="0 0 1080 290"'), "部门知识使用折线图未适配全宽布局");
assert(/\.department-stats-page \.management-charts\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "部门知识分布与使用情况未改为上下全宽布局");
assert(/\.department-stats-page \.management-stats,\s*\.company-stats-page \.management-stats\s*\{[^}]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(suiteStyles), "部门统计卡片未使用三列等宽布局");
assert(/\.department-stats-page \.metric-card > div,\s*\.company-stats-page \.metric-card > div\s*\{[^}]*grid-template-columns:\s*max-content max-content[^}]*column-gap:\s*40px/.test(suiteStyles), "部门统计卡片文字与数字未使用左右布局或40px间距");
assert(/\.department-stats-page \.metric-card strong,\s*\.company-stats-page \.metric-card strong\s*\{[^}]*grid-column:\s*2[^}]*grid-row:\s*1/.test(suiteStyles), "部门统计卡片数字未放置在右侧");
assert(management.includes("知识排行榜") && management.includes("成员排行榜"), "部门知识统计缺少排行榜");
assert(management.includes("供应链运营中心 · 按一级目录统计"), "知识分布未明确供应链运营中心一级目录口径");
assert((management.match(/class="department-bar"/g) || []).length === 14, "知识分布未在一屏展示全部十四个一级目录");
assert(!management.includes('data-distribution-page="prev"'), "部门知识分布仍显示不必要的分页控件");
assert(management.includes("架构管理") && management.includes("综合工作"), "知识分布未使用完整真实一级目录");
assert(suiteSource.includes("return managementDirectoryData().map") && suiteSource.includes("window.BompDepartmentDirectoryData"), "知识分布数据未复用公共部门目录");
assert(management.includes('data-ranking-metric="AI引用次数"') && management.includes(">AI引用次数<"), "知识排行榜缺少AI引用次数视图");
assert(suiteSource.includes("knowledgeRankingRows(rankingMetric.dataset.rankingMetric)"), "知识排行榜指标切换未实际重排数据");
assert(management.includes("data-trend-date-start") && management.includes("data-trend-date-end"), "知识使用情况缺少完整日期范围");
assert(management.includes('data-icon-name="calendar"') && management.includes("management-date-range"), "日期范围控件缺少日历图标或组合样式");
assert(!management.includes('aria-label="统计开始日期"'), "知识使用情况仍包含旧单日期控件");

const departmentKnowledgeManagement = render("manage-knowledge");
assert(departmentKnowledgeManagement.includes("scoped-knowledge-layout") && departmentKnowledgeManagement.includes("scoped-knowledge-tree") && departmentKnowledgeManagement.includes("部门知识目录"), "部门知识管理未复用公司知识管理的左右布局");
const departmentKnowledgePath = (departmentKnowledgeManagement.match(/<nav class="company-knowledge-path"[\s\S]*?<\/nav>/) || [""])[0];
assert(departmentKnowledgePath.includes('data-icon-name="mapPin"') && !departmentKnowledgePath.includes("部门知识目录"), "部门知识管理路径未移除根文字或未使用位置图标");
assert(departmentKnowledgePath.indexOf("架构管理") < departmentKnowledgePath.indexOf("供应链业务架构管理") && departmentKnowledgePath.includes('data-scoped-knowledge-prefix="架构管理"'), "部门知识管理路径未从一级目录开始或一级目录不可返回");
assert(departmentKnowledgeManagement.includes('class="scoped-knowledge-dir scoped-knowledge-all"') && departmentKnowledgeManagement.includes('title="全部">全部'), "部门知识管理目录树缺少全部入口");
assert(departmentKnowledgeManagement.includes("data-management-table") && departmentKnowledgeManagement.includes("data-select-all") && (departmentKnowledgeManagement.includes("scoped-folder-table") || departmentKnowledgeManagement.includes("scoped-file-table")), "部门知识管理缺少标准列表或列表全选");
assert(departmentKnowledgeManagement.includes("调整所属目录") && departmentKnowledgeManagement.includes("下架") && departmentKnowledgeManagement.includes("删除") && departmentKnowledgeManagement.includes("新建文件夹"), "部门知识管理批量操作未与公司知识管理对齐");
assert(departmentKnowledgeManagement.includes("data-filter-display>类型</span>") && departmentKnowledgeManagement.includes("data-filter-display>状态</span>"), "部门知识管理筛选默认文案不正确");
assert(departmentKnowledgeManagement.includes('data-library-time-filter') && departmentKnowledgeManagement.includes('data-filter-display>上传时间</span>'), "部门知识管理缺少上传时间下拉筛选");
assert(!departmentKnowledgeManagement.includes('publish-date-range') && !departmentKnowledgeManagement.includes('data-publish-date-start') && !departmentKnowledgeManagement.includes('data-publish-date-end'), "部门知识管理仍显示发布时间范围筛选");
assert([">全部</option>", ">今天</option>", ">近7天</option>", ">近30天</option>", ">本季度</option>", ">今年</option>", ">去年</option>"].every((option) => departmentKnowledgeManagement.includes(option)), "部门知识管理上传时间选项不完整");
assert(suiteSource.includes('data-upload-date="') && suiteSource.includes("applyTableFilters()}else"), "部门知识管理上传日期数据或目录切换后的筛选联动缺失");
assert(suiteSource.includes("function scopedKnowledgeFileActions(scope,item)") && suiteSource.includes("data-management-file-more") && suiteSource.includes("data-management-menu-delete"), "部门知识管理未采用三个常用操作加更多菜单的结构");
assert(suiteSource.includes("scope==='department'?'<button class=\"more-action\"") && suiteSource.includes("overflowMenuTargetRow=isManagementFile?trigger.closest('tr'):null"), "部门知识管理更多菜单未绑定当前知识行");
assert(suiteStyles.includes(".overflow-menu button.danger") && suiteStyles.includes("background: #fff1f2"), "部门知识管理更多菜单缺少删除危险态样式");
assert(departmentKnowledgeManagement.includes('id="managementConfirm"'), "部门知识管理删除操作缺少确认弹窗");
assert(departmentKnowledgeManagement.includes('class="company-knowledge-path"') && departmentKnowledgeManagement.includes('data-knowledge-scope="department"'), "部门知识管理缺少部门语义的当前目录路径");
assert(!departmentKnowledgeManagement.includes('data-filter-key="directory"') && !departmentKnowledgeManagement.includes("<th>所属目录</th>") && !departmentKnowledgeManagement.includes("<th>类型</th>"), "部门知识管理仍保留旧目录下拉或旧列表字段");
assert(!departmentKnowledgeManagement.includes("scoped-full-tree-children") && departmentKnowledgeManagement.includes('id="departmentKnowledgeChildren0"'), "部门知识管理左侧目录树未限制为两级");
assert(suiteSource.includes("window.BompDepartmentDirectoryData") && suiteSource.includes("departmentKnowledgeFilePaths") && suiteSource.includes("renderScopedKnowledgeManagement('department')"), "部门知识管理未复用公共部门目录与共享渲染器");
assert((departmentKnowledgeManagement.match(/data-row-select/g) || []).length >= 8, "部门知识管理末级目录未提供至少 8 条知识样例");

const departmentDirectory = render("department-directory");
assert(departmentDirectory.includes("data-directory-toggle") && departmentDirectory.includes("data-directory-node"), "部门目录缺少独立展开和选择交互");
assert(departmentDirectory.includes("完整路径") && departmentDirectory.includes("知识数量"), "部门目录详情信息不完整");
assert(!departmentDirectory.includes("搜索目录") && !departmentDirectory.includes("使用中"), "部门目录仍包含已移除的搜索框或使用中标签");
const professionalDirectory = render("professional-directory");
assert(professionalDirectory.includes("公司知识库-专业目录") && professionalDirectory.includes("供应链运营中心"), "专业目录树缺少业务根节点");
assert(professionalDirectory.includes("完整路径") && professionalDirectory.includes("data-path="), "专业目录详情或选择数据不完整");
assert(!professionalDirectory.includes("搜索目录") && !professionalDirectory.includes("使用中"), "专业目录仍包含已移除的搜索框或使用中标签");
["架构管理", "数字化需求管理", "综合计划-数字化建设专业归口管理", "数字化项目建设管理", "非数字化项目管理（如管理研究项目、科技项目等）", "网络安全管理", "运维管理", "运营体系建设", "供应链平台运营管理", "人工智能运营管理", "数据管理", "数字化专项工作", "数字化工作领导小组", "综合工作"].forEach((directory) => {
  assert(professionalDirectory.includes(`data-name="${directory}"`), `专业目录树缺少一级目录：${directory}`);
});
assert(professionalDirectory.includes('data-path="公司知识库-专业目录 / 供应链运营中心 / 架构管理 / 供应链业务架构管理"'), "专业目录默认选中路径不正确");
assert(professionalDirectory.includes('data-name="架构管理"') && professionalDirectory.includes('data-count="1"'), "专业目录一级目录知识数量不正确");
assert(suiteSource.includes("departmentKnowledgeDirectoryData") && suiteSource.includes("scopedDirectoryNodeMarkup(child,currentPath,selectedPath,level+1,scope)"), "专业目录未使用部门级知识目录递归渲染");
assert(!professionalDirectory.includes("data-directory-children hidden") && !professionalDirectory.includes('aria-expanded="false"'), "专业目录未默认展示全部知识目录层级");
assert(suiteSource.includes("renderDepartmentManagementList('uploads')") && suiteSource.includes("renderDepartmentManagementList('sharing')") && suiteSource.includes("renderDepartmentManagementList('recycle')") && suiteSource.includes("renderDepartmentManagementList('logs')"), "部门管理辅助页签缺少渲染入口");

const professionalManagement = render("professional-management");
["知识统计", "知识管理", "目录管理", "回收站", "管理日志"].forEach((tab) => {
  assert(professionalManagement.includes(`>${tab}<`), `专业目录管理缺少${tab}页签`);
});
assert(!professionalManagement.includes(">上传任务<") && !professionalManagement.includes(">共享管理<"), "专业目录管理页签范围不正确");
assert(professionalManagement.includes("专业知识总量") && professionalManagement.includes(">745 <") && professionalManagement.includes(">45 <") && !professionalManagement.includes(">+45 <") && professionalManagement.includes(">945 <"), "专业目录统计指标不正确");
assert(professionalManagement.includes("按公司专业一级目录统计") && professionalManagement.includes("1 / 2"), "专业目录知识分布口径或分页不正确");
assert(professionalManagement.includes('data-ranking-metric="AI引用次数"'), "专业知识排行榜缺少AI引用次数视图");
assert(professionalManagement.includes('viewBox="0 0 1080 290"'), "公司知识库专业目录使用趋势未适配全宽布局");

const professionalKnowledge = render("professional-knowledge");
assert(professionalKnowledge.includes("data-select-all") && professionalKnowledge.includes("调整所属目录") && professionalKnowledge.includes("下架") && professionalKnowledge.includes("删除"), "专业知识管理批量操作不完整");
assert(professionalKnowledge.includes("data-publish-date-start") && professionalKnowledge.includes("data-publish-date-end"), "专业知识管理缺少发布时间范围筛选");
assert(professionalKnowledge.includes("以图搜图") && professionalKnowledge.includes("data-filter-display>类型</span>") && professionalKnowledge.includes("data-filter-display>状态</span>"), "专业知识管理搜索或筛选不完整");

const companyManagement = render("company-management");
["知识统计", "知识管理", "目录管理", "上传任务", "共享管理", "回收站", "管理日志"].forEach((tab) => {
  assert(companyManagement.includes(`>${tab}<`), `公司知识库管理缺少${tab}页签`);
});
assert(companyManagement.includes("上传知识") && companyManagement.includes('id="companyUploadModal"'), "公司知识库管理缺少上传入口或上传弹窗");
assert(companyManagement.includes("公司知识总量") && companyManagement.includes(">5679 <") && companyManagement.includes(">79 <") && !companyManagement.includes(">+79 <") && companyManagement.includes(">1345 <"), "公司知识统计指标不正确");
assert(companyManagement.includes("company-stats-page"), "公司知识统计缺少部门卡片样式作用域");
assert(/\.department-stats-page \.management-stats \.metric-card,\s*\.company-stats-page \.management-stats \.metric-card\s*\{[^}]*display:\s*flex[^}]*gap:\s*14px[^}]*padding:\s*16px 18px/.test(suiteStyles), "公司知识统计卡片未复用部门卡片布局");
assert(/\.department-stats-page \.metric-icon,\s*\.company-stats-page \.metric-icon\s*\{[^}]*width:\s*52px[^}]*height:\s*52px/.test(suiteStyles), "公司知识统计图标尺寸未与部门卡片一致");
assert(companyManagement.includes("按公司部门一级目录统计") && companyManagement.includes("供应链运营中心") && companyManagement.includes("1 / 2"), "公司知识分布口径或分页不正确");
assert(companyManagement.includes('viewBox="0 0 1080 290"'), "公司知识使用趋势未适配全宽布局");
assert(/\.scoped-dashboard-page \.management-charts\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "专业和公司统计图表未改为上下全宽布局");
const companyDirectory = render("company-directory-management");
assert(companyDirectory.includes('data-name="核心业务"') && companyDirectory.includes('data-name="数字化专业"'), "公司目录管理缺少一级或二级目录");
assert(!companyDirectory.includes('style="--tree-level:2"') && !companyDirectory.includes('data-name="架构管理"'), "公司目录管理仍展示二级以下目录");
assert(companyDirectory.includes('data-path="公司知识库目录 / 核心业务 / 数字化专业"') && companyDirectory.includes('<dd id="directoryName">数字化专业</dd>'), "公司目录管理默认选中项或详情路径不正确");
assert(!companyDirectory.includes('id="directoryPath"') && !companyDirectory.includes('<dt>完整路径</dt>'), "公司目录管理详情仍展示完整路径字段");
assert(!companyDirectory.includes('class="tree-root-label"') && !companyDirectory.includes('公司级目录'), "公司目录管理左侧仍展示公司级目录根标签");
assert(suiteSource.includes("limitDirectoryTreeDepth(companyKnowledgeDirectoryData(),1)"), "公司目录管理未基于公共公司目录数据限制为两级展示");
const companyKnowledge = render("company-knowledge");
assert(companyKnowledge.includes("scoped-knowledge-layout") && companyKnowledge.includes("scoped-knowledge-tree") && companyKnowledge.includes("公司知识目录"), "公司知识管理缺少左侧两级目录树");
assert(companyKnowledge.includes('class="scoped-knowledge-dir scoped-knowledge-all"') && companyKnowledge.includes('data-scoped-knowledge-prefix=""><span class="scoped-tree-spacer"') && companyKnowledge.indexOf('title="全部">全部') < companyKnowledge.indexOf('title="核心业务">核心业务'), "公司知识管理目录树缺少位于核心业务之前的全部入口");
assert(suiteSource.includes("var files=scopedManagementDocs(scope);if(path.length)files=files.slice(0,6)"), "公司知识管理全部入口未展示完整文件范围");
assert(companyKnowledge.includes('data-scoped-knowledge-toggle') && companyKnowledge.includes('aria-expanded="true"') && companyKnowledge.includes('aria-controls="companyKnowledgeChildren0"'), "公司知识管理一级目录缺少展开收起状态");
assert(suiteSource.includes("scopedKnowledgeDir.hasAttribute('data-scoped-knowledge-toggle')") && suiteSource.includes("scopedChildren.hidden=!willExpand"), "公司知识管理一级目录缺少展开收起交互");
assert(/\.scoped-knowledge-dir\[data-scoped-knowledge-toggle\]\[aria-expanded="false"\]\s*>\s*svg\s*\{[^}]*transform:\s*rotate\(-90deg\)/.test(suiteStyles), "公司知识管理一级目录收起箭头缺少状态反馈");
assert(companyKnowledge.includes("scoped-knowledge-results") && companyKnowledge.includes("scoped-knowledge-content") && companyKnowledge.includes("核心业务") && companyKnowledge.includes("数字化专业") && companyKnowledge.includes("scoped-folder-table") && companyKnowledge.includes("文件夹名称") && companyKnowledge.includes("创建时间") && companyKnowledge.includes("调整所属目录") && !companyKnowledge.includes("<th>大小</th>"), "公司知识管理右侧目录内容不完整");
assert(!companyKnowledge.includes("scoped-full-tree-children") && (companyKnowledge.match(/class="scoped-knowledge-tree-children"/g) || []).length >= 1, "公司知识管理目录树未限制为两级");
assert(!companyKnowledge.includes('data-filter-key="directory"') && companyKnowledge.includes("输入知识名称或上传人"), "公司知识管理仍显示选择目录下拉框或缺少搜索框");
assert(!companyKnowledge.includes("<th>所属目录</th>") && !companyKnowledge.includes('class="col-location"'), "公司知识管理仍显示所属目录列");
assert(!companyKnowledge.includes("<th>类型</th>") && !companyKnowledge.includes('class="col-type"'), "公司知识管理仍显示类型列");
assert(!companyKnowledge.includes("调整权限范围"), "公司知识管理仍显示调整权限范围");
assert(suiteSource.includes('<table class="suite-table scoped-file-table" data-filter-table data-management-table>') && suiteSource.includes("'+selectAllHead()+'<th>名称</th>") && suiteSource.includes("'+rowCheck(item)+'<td>'+docName(item)"), "公司知识管理文件列表缺少全选或行选择框");
assert(suiteSource.includes('<table class="suite-table scoped-folder-table" data-management-table>') && suiteSource.includes("'+selectAllHead()+'<th>文件夹名称</th>") && suiteSource.includes("return'<tr>'+rowCheck(child)+'<td><button class=\"text-action scoped-folder-link\""), "公司知识管理文件夹列表缺少全选或行选择框");
assert(suiteSource.includes("companyFileTable=scopedContent.querySelector('[data-management-table]')") && suiteSource.includes("managementSelected.textContent='已选 0 条'"), "公司知识管理目录切换未同步重置批量选择状态");
assert(/\.scoped-file-table \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.suite-table \.doc-name button\s*\{[^}]*white-space:\s*nowrap/.test(suiteStyles), "公司知识管理文件名称未使用单行弹性列");
assert(/\.scoped-file-table \.col-status\s*\{[^}]*width:\s*10%/.test(suiteStyles) && /\.scoped-file-table \.col-time\s*\{[^}]*width:\s*18%/.test(suiteStyles), "公司知识管理短字段列宽未按内容长度分配");
assert(suiteSource.includes("data-management-status>'+managementStatus(item.status)") && suiteSource.includes('data-toast="知识重命名窗口已打开">重命名') && suiteSource.includes('data-toast="调整所属目录窗口已打开">调整所属目录') && suiteSource.includes('data-confirm-action="删除该知识" data-target-row>删除'), "公司知识管理文件行操作缺少下架、重命名、调整所属目录或删除");
assert(/\.scoped-file-table \.col-actions\s*\{[^}]*width:\s*218px/.test(suiteStyles), "部门和公司知识管理文件操作列未按按钮组内容宽度收紧");
assert(companyKnowledge.includes("company-knowledge-results"), "公司知识管理搜索区缺少专用布局标识");
assert(/\.scoped-folder-table \.col-actions\s*\{[^}]*width:\s*28%/.test(suiteStyles), "公司知识管理文件夹操作列未收窄并右移");
assert(/\.company-knowledge-results > \.management-search-row \.management-search button[\s\S]*?position:\s*absolute[\s\S]*?right:\s*0/.test(suiteStyles), "公司知识管理搜索图标未嵌入搜索框右端");
assert(companyKnowledge.includes('class="company-knowledge-path"') && companyKnowledge.includes('aria-label="当前文件夹路径"') && companyKnowledge.includes('aria-current="page"'), "公司知识管理顶部缺少当前文件夹路径");
assert(companyKnowledge.includes('class="company-knowledge-path-label company-knowledge-path-link"') && companyKnowledge.includes('data-scoped-knowledge-prefix="核心业务"') && companyKnowledge.includes('aria-label="跳转到核心业务"'), "公司知识管理路径上级目录缺少跳转入口");
assert(suiteSource.includes("document.querySelectorAll('.scoped-knowledge-tree [data-scoped-knowledge-dir]')") && suiteSource.includes("===scopedPrefix"), "公司知识管理路径跳转未同步左侧目录高亮");
assert(/\.company-knowledge-path-link:hover,[\s\S]*?text-decoration:\s*underline/.test(suiteStyles), "公司知识管理可跳转路径缺少交互反馈");
assert(suiteSource.includes("updateScopedKnowledgeContext(knowledgeScope,scopedPrefix)") && suiteSource.includes("searchInput.placeholder='在 '+currentName+' 中搜索'"), "公司知识管理目录切换未同步更新路径或搜索文案");
assert(/\.company-knowledge-results > \.management-search-row \.management-search\s*\{[^}]*min-width:\s*220px[^}]*max-width:\s*228px[^}]*flex:\s*0 1 228px/.test(suiteStyles) && /\.company-knowledge-path\s*\{[^}]*flex:\s*1 1 auto/.test(suiteStyles), "公司知识管理路径与缩短后的右侧搜索栏布局不正确");
assert(companyKnowledge.includes('data-company-folder-open') && companyKnowledge.includes('id="companyFolderModal"'), "公司知识管理工具栏缺少新建文件夹按钮或弹窗");
assert((companyKnowledge.match(/class="company-folder-asset"/g) || []).length >= 4 && companyKnowledge.includes('src="assets/folder-1.png"'), "公司知识管理文件夹图标未统一使用素材1");
assert(companyKnowledge.indexOf('data-management-selected') < companyKnowledge.indexOf('data-open-company-upload') && companyKnowledge.indexOf('data-open-company-upload') < companyKnowledge.indexOf('data-management-bulk="调整所属目录"') && companyKnowledge.indexOf('data-management-bulk="删除"') < companyKnowledge.indexOf('data-company-folder-open'), "公司知识管理工具栏未按已选数量、上传知识、批量操作、新建文件夹排列");
assert(!/<nav class="suite-tabs management-tabs scoped-management-tabs"[\s\S]*?data-open-company-upload[\s\S]*?<\/nav>/.test(companyKnowledge), "公司知识管理页签栏仍显示上传知识入口");
assert(suiteSource.includes('folderStore[folderPrefix].push') && suiteSource.includes("folderContent.innerHTML=scopedKnowledgeContentMarkup(folderScope,folderPrefix)") && suiteSource.includes('当前目录下已存在同名文件夹'), "公司知识管理新建文件夹缺少创建、刷新或重名校验");
assert(suiteStyles.includes('.company-folder-location') && suiteStyles.includes('.company-folder-error'), "公司知识管理新建文件夹弹窗样式缺失");
assert(/\.company-knowledge-path\[data-knowledge-scope="company"\] > \.company-knowledge-path-label:first-of-type\s*\{[^}]*color:\s*#a3adaa[^}]*font-weight:\s*400/.test(suiteStyles), "公司知识管理路径根标签未使用不可点击弱化样式");
assert(/\.company-knowledge-location-icon\s*\{[^}]*display:\s*inline-flex[^}]*color:\s*var\(--color-primary\)/.test(suiteStyles), "部门知识管理位置图标样式缺失");

const companyUploads = render("company-upload-tasks");
["全部（32）", "处理中（5）", "异常（3）", "已共享提报（17）"].forEach((tab) => {
  assert(companyUploads.includes(tab), `公司上传任务缺少${tab}状态视图`);
});
assert(companyUploads.includes("确认入库") && companyUploads.includes("修改信息") && companyUploads.includes("删除"), "公司上传任务批量操作不完整");
assert(companyUploads.includes("文件大小") && companyUploads.includes("当前状态") && companyUploads.includes("智能处理结果"), "公司上传任务字段不完整");
assert(companyUploads.includes("data-filter-display>类型</span>") && companyUploads.includes("data-filter-display>上传时间</span>"), "公司上传任务筛选默认文案不正确");
const myUploadsVisual = render("uploads");
assert(myUploadsVisual.includes("全部（32）") && myUploadsVisual.includes("处理中（4）") && myUploadsVisual.includes("待确认（8）") && myUploadsVisual.includes("已完成（17）") && myUploadsVisual.includes("异常（3）"), "我的上传状态切换栏结构不完整");
assert(myUploadsVisual.includes('class="status-tabs" role="group" aria-label="上传状态"') && myUploadsVisual.includes('aria-pressed="true" data-upload-tab="all"') && (myUploadsVisual.match(/aria-pressed="false"/g) || []).length === 4, "我的上传状态页签缺少可访问的选中状态");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs,\s*body\[data-page="uploads"\] \.status-tabs,\s*body\[data-page="sharing"\] \.status-tabs\s*\{[^}]*height:\s*56px[^}]*justify-content:\s*flex-start[^}]*gap:\s*32px[^}]*border-bottom:\s*1px solid #dfe6e4[^}]*border-radius:\s*0[^}]*background:\s*#fff/.test(suiteStyles), "我的上传状态页签未复用白底轻量页签容器样式");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs button,\s*body\[data-page="uploads"\] \.status-tabs button,\s*body\[data-page="sharing"\] \.status-tabs button\s*\{[^}]*flex:\s*0 0 auto[^}]*font-size:\s*16px/.test(suiteStyles), "我的上传状态页签未使用内容宽度或 16px 字号");
assert(/body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active\s*\{[^}]*color:\s*var\(--color-primary\)[^}]*font-weight:\s*600/.test(suiteStyles) && /body\[data-page="collaboration"\] \.collaboration-tabs button\.is-active::after,\s*body\[data-page="uploads"\] \.status-tabs button\.is-active::after,\s*body\[data-page="sharing"\] \.status-tabs button\.is-active::after\s*\{[^}]*height:\s*3px[^}]*background:\s*var\(--color-primary\)/.test(suiteStyles), "我的上传当前页签未使用项目主色文字与 3px 短下划线");
assert(!/body\[data-page="uploads"\] \.status-tabs button \+ button\s*\{[^}]*border-left/.test(suiteStyles) && !/body\[data-page="uploads"\] \.status-tabs button\s*\{[^}]*flex:\s*0 0 148px/.test(suiteStyles), "我的上传状态页签仍保留竖向分隔线或等宽分段");
assert(suiteSource.includes("button.setAttribute('aria-pressed',String(isSelected))") && suiteSource.includes("uploadTable.dataset.uploadFilter=uploadTab.dataset.uploadTab"), "我的上传页签切换未同步可访问状态或列表筛选");
assert(suiteSource.includes("scopedRankingRows(rankingBody.dataset.rankingScope,rankingMetric.dataset.rankingMetric)"), "专业或公司排行榜指标切换未实际重排数据");
assert(suiteSource.includes("scopedDistributionMarkup(distributionScope"), "专业或公司知识分布分页未实际更新内容");
assert(suiteSource.includes("data-confirm-company-upload") && suiteSource.includes("data-remove-upload-file"), "公司上传弹窗缺少确认或移除文件交互");
assert(companyManagement.includes("data-company-upload-input") && companyManagement.includes("data-company-upload-pick"), "公司上传弹窗缺少文件选择或拖放入口");
assert(suiteSource.includes("appendCompanyUploadFiles(e.target.files)") && suiteSource.includes("e.dataTransfer&&e.dataTransfer.files"), "公司上传弹窗未处理文件选择或拖放结果");

assert(/button\s*\{[^}]*border-radius:\s*var\(--button-radius\)\s*!important/.test(baseStyles), "普通页面按钮未统一为全局按钮圆角");
assert(/\.suite-table \.doc-name button\s*\{[^}]*display:\s*block[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/.test(suiteStyles) && !/\.suite-table \.doc-name button\s*\{[^}]*-webkit-line-clamp:\s*2/.test(suiteStyles), "全系统表格名称未统一为单行省略");
assert(headerSource.indexOf('class="header-action user-button"') < headerSource.indexOf('class="header-action logout-button"'), "顶部栏退出图标未放在用户问候语右侧");
assert(headerSource.includes('<span>你好，<strong class="user-name">${userName}</strong></span>') && !headerSource.includes('<span>退出登录</span>'), "顶部栏问候语或退出登录可见文字不正确");
assert(headerSource.includes('title="退出登录" aria-label="退出登录"') && /\.logout-button\s*\{[^}]*width:\s*32px/.test(headerStyles), "顶部栏退出图标缺少提示、无障碍名称或稳定尺寸");
["app-header", "app-sidebar", "knowledge-table"].forEach((component) => {
  const styles = fs.readFileSync(path.join(projectRoot, "components", component, "component.css"), "utf8");
  assert(/button\s*\{[^}]*border-radius:\s*2px\s*!important/.test(styles), `${component} 的 Shadow DOM 按钮未统一为 2px 圆角`);
});

[recent, knowledge, collaboration, favorites, render("department"), render("company")].forEach((html) => {
  if (!html.includes("view-switch")) return;
  assert(/view-switch[\s\S]*?<button class="is-active"[^>]*title="列表视图"/.test(html), "存在未默认选中列表视图的页面");
});

assert(sidebarSource.includes("firstChild(item)"), "侧栏缺少父节点默认子项逻辑");
assert(sidebarSource.includes("is-ancestor-active"), "侧栏缺少父级路径高亮逻辑");
assert(sidebarSource.includes('["department-library", "company-library"].includes(item.dataset.parentKey)'), "侧栏缺少公司与部门一级目录聚合选择逻辑");
assert(sidebarSource.includes('event.target.closest(".nav-chevron")'), "侧栏箭头未与目录选择交互分离");
assert(sidebarSource.includes('["department-library", "company-library"].includes(item.dataset.key)') && sidebarSource.includes(":scope > .tree-node > .nav-item[data-has-children='true']"), "部门和公司知识库父入口未限制为只展开直接子级");
assert(sidebarSource.includes('bomp-sidebar-shallow-library') && suiteSource.includes("sessionStorage.setItem('bomp-sidebar-shallow-library'"), "跨页进入部门或公司知识库时未保持单层展开状态");
assert(Array.isArray(departmentDirectoryData) && departmentDirectoryData.length === 14, "公共侧栏部门知识库未使用工作簿中的 14 个一级目录");
assert(!JSON.stringify(departmentDirectoryData).includes('"label":"..."'), "公共侧栏部门知识库仍包含省略号占位目录节点");
assert(JSON.stringify(departmentDirectoryData.map((item) => item.label)) === JSON.stringify(["架构管理", "数字化需求管理", "综合计划-数字化建设专业归口管理", "数字化项目建设管理", "非数字化项目管理（如管理研究项目、科技项目等）", "网络安全管理", "运维管理", "运营体系建设", "供应链平台运营管理", "人工智能运营管理", "数据管理", "数字化专项工作", "数字化工作领导小组", "综合工作"]), "公共侧栏部门知识库一级目录名称或顺序不正确");
assert(sidebarSource.includes("dept-bomp-2025-project") && sidebarSource.includes("国家网络安全攻防演习、全国“两会”、国家节假日等期间网络及信息系统保障"), "公共侧栏部门知识库未保留完整下级目录");
assert(Array.isArray(companyDirectoryData) && companyDirectoryData.length === 11, "公共侧栏公司知识库未使用工作簿中的 11 个一级目录");
assert(JSON.stringify(companyDirectoryData.map((item) => item.label)) === JSON.stringify(["核心业务", "法律法规", "管理制度", "工作规则", "会议文件", "培训学习", "党的建设", "新闻宣传", "创新成果", "经验案例", "模板表格"]), "公共侧栏公司知识库一级目录名称或顺序不正确");
const companyDirectorySource = JSON.stringify(companyDirectoryData);
assert(companyDirectorySource.includes("供应链业务架构管理") && companyDirectorySource.includes("工程前期文件") && companyDirectorySource.includes("物资公司公司牵头/参与标准"), "公共侧栏公司知识库未保留工作簿中的深层目录");
assert(sidebarStyles.includes(".nav-item--level-3") && sidebarStyles.includes(".nav-item--level-6"), "公共侧栏缺少深层目录缩进样式");
assert(sidebarSource.includes('["department-library", "company-library"].includes(currentBranchKey) && level > 0') && sidebarSource.includes('level <= 2') && sidebarSource.includes('knowledge-directory-icon'), "部门与公司知识库一级、二级目录缺少目录图标语义");
assert(sidebarSource.includes('knowledge-folder-icon') && sidebarSource.includes('../../pages/prototype-suite/assets/folder-1.png') && sidebarSource.indexOf('knowledge-node-icon') < sidebarSource.indexOf('<span class="nav-label">'), "部门与公司知识库三级及以下文件夹未使用统一素材或图标未放在文字前");
assert(/\.knowledge-folder-icon img\s*\{[^}]*width:\s*14px[^}]*height:\s*14px[^}]*object-fit:\s*contain/.test(sidebarStyles) && sidebarStyles.includes(".knowledge-directory-icon"), "部门与公司知识库目录及文件夹图标样式缺失");
assert(sidebarSource.includes("SIDEBAR_MAX_WIDTH = 420") && sidebarSource.includes("bomp-sidebar-width") && sidebarStyles.includes(".sidebar-resize-handle"), "公共侧栏缺少 220px 至 420px 拉宽交互");
assert(suiteSource.includes("scopedDirectoryNodeMarkup") && suiteSource.includes("companyKnowledgeDirectoryData") && suiteSource.includes("limitDirectoryTreeDepth"), "公司目录管理页未复用公共公司目录数据或缺少两级展示限制");
const managementMenu = sidebarSource.match(/\{ key: "library-management", label: "知识库管理"[\s\S]*?children: \[([\s\S]*?)\]\s*\}/);
assert(managementMenu, "知识库管理父入口不存在");
const managementChildren = Array.from(managementMenu[1].matchAll(/\{ key: "([^"]+)", label: "([^"]+)" \}/g), (match) => [match[1], match[2]]);
assert(JSON.stringify(managementChildren) === JSON.stringify([
  ["department-library-management", "部门知识库管理"],
  ["company-library-management", "公司知识库管理"]
]), "知识库管理子栏目名称或顺序不正确");
assert(!sidebarSource.includes('key: "professional-directory-management", label: "专业目录管理"'), "侧边导航仍保留专业目录管理入口");
assert(!sidebarSource.includes('label: "管理知识库"') && !sidebarSource.includes('公司专业目录管理'), "侧栏仍包含旧名称");
assert(sidebarSource.includes("children.hidden = !expanded") && !/toggleNode\(item\)\s*\{[^}]*this\.render\(\)/.test(sidebarSource), "侧栏展开收起仍会重绘整棵目录树");
assert(sidebarSource.includes("level === 0 ? 18 : 14") && sidebarSource.includes('"chevronRight", { size: 13 }'), "侧栏图标尺寸未按新规范缩小");
const departmentPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "department-library.html"), "utf8");
const departmentKnowledgePage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "knowledge-management.html"), "utf8");
assert(departmentKnowledgePage.includes("suite.css?v=2.101.0") && departmentKnowledgePage.includes("suite.js?v=2.101.0"), "部门知识管理静态资源版本未升级至 2.101.0");
const companyPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "company-library.html"), "utf8");
const reviewPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "review-workbench.html"), "utf8");
const compatibleReviewPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "my-approvals.html"), "utf8");
const directoryPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "directory-management.html"), "utf8");
const companyManagementPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "company-library-management.html"), "utf8");
const departmentManagementPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "library-management.html"), "utf8");
const departmentManagementPages = [
  "department-directory-management.html",
  "department-upload-tasks.html",
  "department-sharing-management.html",
  "department-recycle-bin.html",
  "department-management-log.html"
];
const departmentManagementTabPages = [
  ["management", "知识统计"],
  ["manage-knowledge", "知识管理"],
  ["department-upload-tasks", "上传任务"],
  ["department-sharing-management", "共享管理"],
  ["department-recycle", "回收站"],
  ["department-management-log", "管理日志"],
  ["department-directory", null]
];
const departmentAdminPages = [
  "library-management.html",
  "knowledge-management.html",
  "department-knowledge-upload.html",
  ...departmentManagementPages
];
const companyAdminPages = [
  "company-library-management.html",
  "company-knowledge-management.html",
  "company-directory-management.html",
  "company-upload-tasks.html",
  "company-sharing-management.html",
  "company-recycle-bin.html",
  "company-management-log.html"
];
const scopedManagementPages = [
  "professional-knowledge-management.html",
  "professional-directory-tree.html",
  "professional-recycle-bin.html",
  "professional-management-log.html",
  "company-knowledge-management.html",
  "company-directory-management.html",
  "company-upload-tasks.html",
  "company-sharing-management.html",
  "company-recycle-bin.html",
  "company-management-log.html"
];
const suiteScript = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "suite.js"), "utf8");
[
  "国网物资有限公司系统运维和数字化支撑成本性项目管理细则（试行）.docx",
  "国网物资有限公司电网数字化项目管理办法（试行）.docx",
  "国家电网有限公司供应链数据管理实施细则.docx",
  "国家电网有限公司数字化架构管理办法.docx",
  "国家电网有限公司供应链运营管理办法.docx",
  "国家电网有限公司电网数字化建设管理办法.docx",
  "国家电网有限公司数据管理办法.docx",
  "国家电网公司信息系统运行管理办法.docx"
].forEach((fileName) => assert(suiteScript.includes(fileName), `公司知识库缺少参考图文件：${fileName}`));
assert(suiteScript.includes("var source=scope==='company'?companyDocs:docs") && suiteScript.includes("function libraryDirectFiles"), "部门和公司知识库未使用各自文件数据或目录驱动文件范围");
assert(departmentManagementPage.includes('active="department-library-management"'), "部门管理入口未正确高亮");
departmentManagementTabPages.forEach(([pageName, activeLabel]) => {
  const html = render(pageName);
  const tabs = html.match(/<nav class="suite-tabs management-tabs" aria-label="部门知识库管理">[\s\S]*?<\/nav>/);
  assert(tabs, `${pageName} 缺少部门知识库管理页签`);
  assert(!tabs[0].includes('department-directory-management.html') && !tabs[0].includes('>目录管理</a>'), `${pageName} 仍展示部门目录管理页签`);
  ["知识统计", "知识管理", "上传任务", "共享管理", "回收站", "管理日志"].forEach((label) => assert(tabs[0].includes(`>${label}</a>`), `${pageName} 缺少${label}页签`));
  if (activeLabel) assert(tabs[0].includes(`>${activeLabel}</a>`), `${pageName} 当前页签状态不正确`);
});
assert(directoryPage.includes('active="professional-directory-management"'), "专业目录入口未正确高亮");
[...departmentAdminPages, ...companyAdminPages].forEach((pageName) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", pageName), "utf8");
  assert(/<bomp-header[^>]*user-name="管理员"/.test(pageSource), `${pageName} 顶部栏未显示管理员身份`);
});
assert(directoryPage.includes('data-page="professional-management"'), "专业目录入口未默认进入知识统计");
assert(companyManagementPage.includes('active="company-library-management"') && companyManagementPage.includes('data-page="company-management"'), "公司管理入口未正确高亮或缺少页面");
managementChildren.forEach(([key, label]) => {
  assert(suiteScript.includes(`"${key}":"${key === "department-library-management" ? "library-management" : key === "professional-directory-management" ? "directory-management" : "company-library-management"}.html"`), `${label} 缺少跳转映射`);
});
assert(suiteScript.includes('"professional-directory-management":"directory-management.html"'), "专业目录管理兼容地址映射已丢失");
assert(departmentPage.includes('active="dept-architecture-management"'), "部门知识库未保留当前架构管理目录选中状态");
assert(departmentPage.includes('suite.css?v=2.97.0') && departmentPage.includes('suite.js?v=2.97.0'), "部门知识库未刷新普通用户操作权限资源版本");
assert(companyPage.includes('suite.css?v=2.97.0') && companyPage.includes('suite.js?v=2.97.0'), "公司知识库未刷新 3px 搜索框圆角资源版本");
assert(departmentKnowledgePage.includes('suite.css?v=2.101.0') && departmentKnowledgePage.includes('suite.js?v=2.101.0') && departmentKnowledgePage.includes('icons.js?v=1.1.0'), "部门知识管理未刷新紧凑行操作资源版本");
[
  "library-management.html",
  "department-directory-management.html",
  "department-upload-tasks.html",
  "department-sharing-management.html",
  "department-recycle-bin.html",
  "department-management-log.html"
].forEach((pageName) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", pageName), "utf8");
  assert(pageSource.includes('suite.js?v=2.97.0'), `${pageName} 未刷新部门管理页签资源版本`);
});
assert(companyPage.includes('active="company-core-business"'), "公司知识库未默认选中工作簿的首个一级目录");
assert(reviewPage.includes('data-page="review"') && reviewPage.includes('active="review-workbench"'), "审核工作台兼容页未正确高亮");
[reviewPage, compatibleReviewPage].forEach((pageSource) => {
  assert(/<bomp-header[^>]*user-name="审核员"/.test(pageSource), "审核工作台顶部栏未显示审核员身份");
  assert(pageSource.includes('suite.css?v=2.99.0') && pageSource.includes('suite.js?v=2.99.0'), "审核工作台未刷新页签对齐所需静态资源版本");
});
const reviewExtensionLabels = render("review");
assert(reviewExtensionLabels.includes(">MP4</span>") && reviewExtensionLabels.includes(">PNG</span>"), "审核工作台未显示视频 MP4 或图片 PNG 真实扩展名");
assert(reviewExtensionLabels.includes(">DOCX</span>") && reviewExtensionLabels.includes(">XLSX</span>"), "审核工作台的文档或表格图标仍未显示真实扩展名");
assert(!/>(?:VID|IMG|AUD|W|X|P)</.test(reviewExtensionLabels), "审核工作台仍包含泛化文件类型缩写");
assert(suiteSource.includes('match=name.match(/\\.([A-Za-z0-9]{1,5})$/)') && suiteSource.includes('video:"MP4",audio:"MP3",image:"PNG"'), "原型套件未按文件名解析扩展名或缺少类型兜底");
assert(!suiteSource.includes('?"VID"') && !suiteSource.includes('?"IMG"') && !suiteSource.includes('?"AUD"'), "原型套件共享脚本仍生成泛化媒体类型缩写");
assert(fileActionDialogsSource.includes('replace(/^\\./, "").toUpperCase()') && !fileActionDialogsSource.includes('return "IMG"'), "文件操作弹窗未显示真实扩展名");
assert(knowledgeTableSource.includes('word: "DOCX"') && knowledgeTableSource.includes('video: "MP4"') && !knowledgeTableSource.includes('word: "W"'), "公共知识表格仍使用泛化文件类型缩写");
assert(!departmentUploadSource.includes('.replace("XLSX", "X")') && departmentUploadSource.includes("escapeHtml(file.label)"), "部门知识上传流程仍压缩真实扩展名");

const registry = JSON.parse(fs.readFileSync(path.join(projectRoot, "components", "registry.json"), "utf8"));
const sidebarComponent = registry.components.find((item) => item.id === "app-sidebar");
assert(sidebarComponent && sidebarComponent.version === "4.5.1", "侧栏组件未登记为 4.5.1");
assert(sidebarSource.includes('component.css?v=4.5.1') && sidebarSource.includes('setPointerCapture') && sidebarSource.includes('pointercancel'), "侧栏拖拽逻辑或样式版本未升级");
assert(/\.sidebar-resize-handle\s*\{[^}]*width:\s*10px/.test(sidebarStyles) && /\.sidebar-resize-handle::before\s*\{[^}]*height:\s*44px/.test(sidebarStyles), "侧栏拖拽热区或视觉提示不符合全系统规范");
sidebarComponent.usedBy.forEach((pagePath) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, pagePath), "utf8");
  assert(pageSource.includes("app-sidebar/component.js?v=4.5.1"), `${pagePath} 未引用最新版公共侧栏`);
});
const baseStylesComponent = registry.components.find((item) => item.id === "base-styles");
assert(baseStylesComponent && baseStylesComponent.version === "2.4.0", "基础样式未登记为 2.4.0");
assert(baseStyles.includes("--main-content-gutter: 10px"), "基础样式未登记 10px 主内容区外间距变量");
assert(baseStyles.includes("body main.prototype-main") && baseStyles.includes("body main.prototype-main.suite-main"), "基础样式未统一覆盖普通页与原型套件主内容区外间距");
baseStylesComponent.usedBy.forEach((pagePath) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, pagePath), "utf8");
  assert(pageSource.includes("base.css?v=2.4.0"), `${pagePath} 未引用最新版基础样式`);
});
const historyPanelComponent = registry.components.find((item) => item.id === "search-history-panel");
assert(historyPanelComponent && historyPanelComponent.version === "1.0.0", "搜索历史面板未登记或版本不正确");
const headerComponent = registry.components.find((item) => item.id === "app-header");
assert(headerComponent && headerComponent.version === "4.2.0", "顶部栏组件版本未更新");
["document-search.html", "qa-result.html", "image-search.html"].forEach((pageName) => {
  assert(historyPanelComponent.usedBy.includes(`pages/prototype-suite/${pageName}`), `搜索历史面板未登记${pageName}使用关系`);
});
["base-styles", "app-sidebar", "app-header"].forEach((id) => {
  const component = registry.components.find((item) => item.id === id);
  assert(component && component.usedBy.includes("pages/prototype-suite/review-workbench.html"), `${id} 未登记审核工作台使用关系`);
  assert(component.usedBy.includes("pages/prototype-suite/my-sharing.html"), `${id} 未登记我的共享使用关系`);
  assert(component.usedBy.includes("pages/prototype-suite/company-library-management.html"), `${id} 未登记公司知识库管理使用关系`);
  departmentManagementPages.forEach((pageName) => {
    assert(component.usedBy.includes(`pages/prototype-suite/${pageName}`), `${id} 未登记${pageName}使用关系`);
  });
  scopedManagementPages.forEach((pageName) => {
    assert(component.usedBy.includes(`pages/prototype-suite/${pageName}`), `${id} 未登记${pageName}使用关系`);
  });
});
const personalCenterSource = fs.readFileSync(path.join(projectRoot, "components", "app-sidebar", "component.js"), "utf8");
assert(!personalCenterSource.includes('key: "personal-center", label: "个人中心"'), "公共侧边导航仍保留个人中心入口");
[
  ["我的上传", "my-uploads"],
  ["我的共享", "my-sharing"],
  ["回收站", "my-recycle"]
].forEach(([label, key]) => {
  assert(personalCenterSource.includes(`key: "${key}", label: "${label}"`), `我的知识库缺少${label}`);
});
assert(!personalCenterSource.includes('key: "my-info", label: "我的信息"') && !personalCenterSource.includes('key: "my-browsing", label: "我的浏览"') && !personalCenterSource.includes('key: "my-downloads", label: "我的下载"'), "侧边导航仍保留已移除的个人子项");
assert(personalCenterSource.includes('key: "review-workbench", label: "审核工作台"') && personalCenterSource.indexOf('label: "审核工作台"') > personalCenterSource.indexOf('label: "公司知识库"') && personalCenterSource.indexOf('label: "审核工作台"') < personalCenterSource.indexOf('label: "知识库管理"'), "审核工作台未作为独立一级入口");
const personalInfo = render("info");
assert(personalInfo.includes("我的信息") && personalInfo.includes("孙鹏飞") && personalInfo.includes("知识运营专员") && personalInfo.includes("入职时间") && personalInfo.includes("绑定手机号"), "我的信息内容不完整");
assert(personalInfo.includes('data-icon-name="user"') && !personalInfo.includes("reference-avatar.png") && !personalInfo.includes("<img"), "我的信息头像未替换为清晰图标");
assert(!personalInfo.includes('class="suite-search"') && personalInfo.includes("编辑信息"), "我的信息顶部搜索未移除或编辑入口缺失");
assert(/\.personal-profile-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "我的信息未改为上下布局");
const personalBrowsing = render("browsing");
assert(personalBrowsing.includes("我的浏览") && personalBrowsing.includes("搜索浏览记录") && personalBrowsing.includes("浏览时间") && personalBrowsing.includes("data-filter-display>类型</span>"), "我的浏览缺少搜索或筛选");
assert(!personalBrowsing.includes("page-intro") && !personalBrowsing.includes("view-switch"), "我的浏览仍包含大标题说明或视图切换");
assert(personalBrowsing.includes("data-personal-bulk-delete") && personalBrowsing.includes("data-select-all") && personalBrowsing.includes("data-personal-delete"), "我的浏览缺少批量或单条删除");
assert(personalBrowsing.includes("<th>公开范围</th>") && personalBrowsing.includes("部门可见") && personalBrowsing.includes("公司可见"), "我的浏览缺少公开范围字段或示例数据");
assert(/\.table-browsing \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-browsing \.col-time\s*\{[^}]*width:\s*16%/.test(suiteStyles), "我的浏览未使用标题自适应或时间比例列宽");
const personalDownloads = render("downloads");
assert(personalDownloads.includes("我的下载") && personalDownloads.includes("搜索下载记录") && personalDownloads.includes("下载时间") && personalDownloads.includes("<th>文件位置</th>"), "我的下载内容不完整");
assert(!personalDownloads.includes("page-intro") && !personalDownloads.includes("view-switch"), "我的下载仍包含大标题说明或视图切换");
assert(personalDownloads.includes("data-personal-bulk-delete") && personalDownloads.includes("data-select-all"), "我的下载缺少批量删除与全选");
assert(personalDownloads.includes('class="directory-link"') && personalDownloads.includes('title="公司知识库 /') && personalDownloads.includes('>项目资料</a>'), "我的下载文件位置未使用末级目录和完整路径提示");
["下载", "删除"].forEach((action) => assert(personalDownloads.includes(`>${action}<`), `我的下载缺少${action}操作`));
assert(!personalDownloads.includes(">分享<") && !personalDownloads.includes("share-action"), "我的下载仍包含已移除的分享操作");
assert(/\.table-downloads \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-downloads \.col-time\s*\{[^}]*width:\s*16%/.test(suiteStyles), "我的下载未使用标题自适应或时间比例列宽");
assert(/\.table-browsing \.time-cell,[\s\S]*?\.table-downloads \.time-cell\s*\{[^}]*overflow:\s*visible[^}]*white-space:\s*nowrap/.test(suiteStyles), "个人浏览或下载时间仍可能被截断");
assert(suiteSource.includes("personalChecked.forEach") && suiteSource.includes("personalRow.remove()"), "个人浏览或下载删除未实现实际列表更新");
const personalSharing = render("sharing");
assert(personalSharing.includes("我的知识库") && personalSharing.includes(">我的共享<") && personalSharing.includes("搜索共享记录"), "我的共享未展示本人发起的共享进度");
assert((personalSharing.match(/class="suite-search"/g) || []).length === 1, "我的共享顶部搜索栏未移除");
const personalSharingTopbar = personalSharing.slice(0, personalSharing.indexOf('<div class="suite-content">'));
assert(!personalSharingTopbar.includes('personal-library-page-actions') && !personalSharingTopbar.includes('> 新建</button>') && !personalSharingTopbar.includes('> 上传</button>'), "我的共享顶部横条仍显示新建或上传");
assert(personalSharing.includes('class="action-cell"') && /\.table-sharing \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-sharing \.col-location\s*\{[^}]*width:\s*20%/.test(suiteStyles) && /\.table-sharing \.col-time\s*\{[^}]*width:\s*16%/.test(suiteStyles) && /\.table-sharing \.col-actions\s*\{[^}]*width:\s*9%/.test(suiteStyles), "我的共享列宽未按信息优先级弹性分配");
const personalFavorites = render("favorites");
const personalFavoritesTopbar = personalFavorites.slice(0, personalFavorites.indexOf('<div class="suite-content">'));
assert(!personalFavoritesTopbar.includes('personal-library-page-actions') && !personalFavoritesTopbar.includes('> 新建</button>') && !personalFavoritesTopbar.includes('> 上传</button>'), "我的收藏顶部横条仍显示新建或上传");
const personalApprovals = render("approvals");
assert(!personalApprovals.includes('class="suite-topbar"'), "审核工作台兼容页仍显示重复顶栏面包屑");
assert(personalApprovals.includes("批量审核通过") && personalApprovals.includes("批量退回修改") && personalApprovals.includes("查看申请") && personalApprovals.includes('id="reviewDrawer"'), "我的审批未完整承接审核工作台内容");
const personalUploads = render("uploads");
assert((personalUploads.match(/class="suite-search"/g) || []).length === 1, "我的上传顶部搜索栏未移除");
const personalLibraryTopbarPages = [
  ["recent", "最近使用"],
  ["knowledge", "我的知识"],
  ["collaboration", "我的协作"],
  ["favorites", "我的收藏"],
  ["uploads", "我的上传"],
  ["sharing", "我的共享"],
  ["recycle", "回收站"]
];
personalLibraryTopbarPages.forEach(([page, label]) => {
  const html = render(page);
  assert(html.includes('class="suite-topbar personal-library-topbar"'), `${label}缺少我的知识库统一顶部横条`);
  assert(html.includes(`<span>我的知识库</span><b>&gt;</b><strong>${label}</strong>`), `${label}顶部面包屑不正确`);
  assert(html.includes('data-nav="document-search.html"') && html.includes("全局搜索"), `${label}缺少全局搜索入口`);
  assert(html.includes('data-nav="qa-result.html"') && html.includes("AI问答"), `${label}缺少AI问答入口`);
});
assert(/\.personal-library-topbar\s*\{[^}]*position:\s*relative[^}]*z-index:\s*1/.test(suiteStyles) && !/\.personal-library-topbar\s*\{[^}]*position:\s*sticky/.test(suiteStyles), "我的知识库统一顶部横条仍使用悬浮或吸顶定位");
assert(/body:is\([\s\S]*?\[data-page="recent"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-main\s*\{[^}]*padding-top:\s*var\(--header-height\)[^}]*padding-right:\s*0[^}]*padding-left:\s*0/.test(suiteStyles), "我的知识库页面主内容未与系统顶栏、侧栏及视口右边缘无缝贴合");
assert(/body:is\([\s\S]*?\[data-page="recent"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-page\s*\{[^}]*border-top:\s*0[^}]*border-right:\s*0[^}]*border-left:\s*0/.test(suiteStyles), "我的知识库页面外壳仍可能在顶部横条周围形成边框缝隙");
assert(/\[data-page="recent"\][\s\S]*?\[data-page="knowledge"\][\s\S]*?\) \.suite-content\s*\{[^}]*padding-left:\s*15px/.test(suiteStyles), "最近使用与我的知识未保留15px内容间距");
assert(/\[data-page="collaboration"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-content\s*\{[^}]*padding:\s*32px 36px 28px 30px/.test(suiteStyles), "我的知识库白色工作区内容未同步左移");
assert(/\[data-page="collaboration"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-content::before\s*\{[^}]*inset:\s*16px 20px 16px 15px/.test(suiteStyles), "我的知识库白色工作区未将左侧内容边界调整为15px");
assert(/body:is\([\s\S]*?\[data-page="recent"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) main\.prototype-main\.suite-main\s*\{[^}]*padding-left:\s*0/.test(suiteStyles), "我的知识库顶部横条未贴齐左侧导航");
[
  "my-library.html",
  "my-knowledge.html",
  "my-collaboration.html",
  "my-favorites.html",
  "my-uploads.html",
  "my-sharing.html",
  "my-recycle-bin.html",
  "sharing-statistics.html"
].forEach((file) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", file), "utf8");
  const resourceVersion = file === "my-uploads.html" ? "2.104.0" : "2.102.0";
  assert(pageSource.includes(`suite.css?v=${resourceVersion}`) && pageSource.includes(`suite.js?v=${resourceVersion}`), `${file}未刷新我的知识库顶部与内容间距资源版本`);
});
assert(/body:is\([\s\S]*?\[data-page="recent"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-page,[\s\S]*?body:is\([\s\S]*?\[data-page="recent"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-content\s*\{[^}]*background:\s*#f7f8f8/.test(suiteStyles), "我的知识库页面未统一使用最近使用的浅灰画布背景");
assert(/body:is\([\s\S]*?\[data-page="collaboration"\][\s\S]*?\[data-page="recycle"\][\s\S]*?\) \.suite-content::before\s*\{[^}]*inset:\s*16px 20px[^}]*border:\s*1px solid #e6ecea[^}]*border-radius:\s*6px[^}]*background:\s*#fff/.test(suiteStyles), "我的知识库常规页面缺少统一白色工作区底板");
assert(/\.personal-library-topbar \.suite-crumb\s*\{[^}]*font-size:\s*13px/.test(suiteStyles), "我的知识库顶部面包屑未统一使用 13px 字号");
assert(/<section class="recent-list-workspace" aria-label="最近使用列表">[\s\S]*?class="suite-toolbar"[\s\S]*?<div class="recent-table-panel">[\s\S]*?class="suite-table table-recent"[\s\S]*?class="pager"/.test(render("recent")), "最近使用的透明工具区或白色列表面板结构不正确");
assert(/<section class="knowledge-summary"[\s\S]*?<section class="personal-library-list-panel" aria-label="我的知识列表">/.test(render("knowledge")), "我的知识摘要卡与列表卡顺序不正确");
const renderedKnowledge = render("knowledge");
const renderedKnowledgeNames = Array.from(renderedKnowledge.matchAll(/data-doc-name="([^"]+)"/g), match => match[1]);
assert(renderedKnowledgeNames.slice(0, 2).join("|") === "项目资料|年度报告", "我的知识列表未将文件夹按创建时间倒序置顶");
assert(renderedKnowledgeNames.slice(2).join("|") === ["供应链运营中心年度重点工作任务清单.docx","供应链运营季度运行分析报告.docx","供应商管理优秀实践案例集.pdf","供应链重点项目复盘报告.docx","数智供应链建设阶段性工作总结.pptx","数字化项目建设任务进度表.xlsx","物资采购业务培训课程录像.mp4","供应商履约评价专题会议录音.mp3","供应链运营指标驾驶舱截图.png"].join("|"), "我的知识文件未按创建时间从新到旧排列");
assert(/\.knowledge-summary\s*\{[^}]*margin-bottom:\s*15px/.test(suiteStyles) && /\.personal-library-list-panel\s*\{[^}]*padding:\s*0 16px 12px[^}]*border:\s*1px solid #e6ecea[^}]*border-radius:\s*6px[^}]*background:\s*#fff/.test(suiteStyles), "我的知识摘要卡间距或统一列表容器样式不正确");
assert(/\.recent-list-workspace\s*\{[^}]*background:\s*transparent/.test(suiteStyles) && /\.recent-list-workspace > \.suite-toolbar\s*\{[^}]*margin-bottom:\s*12px[^}]*background:\s*transparent/.test(suiteStyles) && /\.recent-table-panel\s*\{[^}]*padding:\s*0 0 12px[^}]*border:\s*1px solid #e6ecea[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*6px[^}]*background:\s*#fff/.test(suiteStyles), "最近使用未采用透明工具区或全宽表格的无左右竖线列表面板");
assert(/\.recent-table-panel > \.pager\s*\{[^}]*padding-right:\s*16px[^}]*padding-left:\s*16px/.test(suiteStyles), "最近使用全宽表格调整后分页未保留左右留白");
assert(/\.table-recent td\s*\{[^}]*border-top-color:\s*#eef2f1/.test(suiteStyles), "最近使用列表内部横向分隔线未减淡");
assert(/\.suite-table th:last-child,[\s\S]*?\.suite-table \.action-cell\s*\{[^}]*overflow:\s*visible[^}]*white-space:\s*nowrap/.test(suiteStyles), "全局列表操作列未设置完整单行展示");
assert(/\.suite-table th,[\s\S]*?padding-right:\s*12px[^}]*padding-left:\s*12px/.test(suiteStyles), "全局表格列间距未统一");
assert(/--table-cell-padding-inline:\s*12px/.test(baseStyles) && /--table-action-edge-gap:\s*28px/.test(baseStyles), "全局表格间距变量未统一登记");
assert(/\.suite-table:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th:last-child,[\s\S]*?padding-right:\s*var\(--table-action-edge-gap\)[\s\S]*?text-align:\s*right/.test(suiteStyles), "业务列表操作列未统一使用 28px 右侧间距并右对齐");
assert(/\.suite-table:has\(> colgroup > \.col-name\):has\(> colgroup > \.col-actions\) th,[\s\S]*?padding-right:\s*var\(--table-cell-padding-inline\)[\s\S]*?padding-left:\s*var\(--table-cell-padding-inline\)/.test(suiteStyles), "业务列表中间字段未统一使用等距内边距");
assert(/\.suite-table:has\(> colgroup > \.col-check\):has\(> colgroup > \.col-name\) th:nth-child\(2\),[\s\S]*?text-overflow:\s*ellipsis[\s\S]*?white-space:\s*nowrap/.test(suiteStyles), "带复选框业务列表的名称列未保持单行省略");
assert(/\.tag-table th:last-child,[\s\S]*?padding-right:\s*var\(--table-action-edge-gap\)[\s\S]*?text-align:\s*right/.test(tagManagementStyles), "标签管理操作列未遵循全局右端间距");
assert(!tagManagementSource.includes('<th>维护对象</th>') && !tagManagementSource.includes('class="col-owner"') && !tagManagementStyles.includes(".tag-table .col-owner"), "标签管理列表仍展示维护对象字段");
assert(tagManagementSource.includes('<td colspan="6">') && tagManagementSource.includes('<dt>维护对象</dt><dd id="tagDetailOwner">'), "标签管理列表列数未同步或详情抽屉误删维护对象");
assert(!tagManagementSource.includes('<small>') && !tagManagementStyles.includes(".tag-name-cell small") && tagManagementSource.includes('id="tagDetailDescription"'), "标签名称列表仍显示简介小字或详情说明被误删");
assert(!tagManagementSource.includes("标签体系") && tagManagementSource.includes("标签类别概览") && tagManagementSource.includes('<th>标签类别</th>') && tagManagementSource.includes('for="tagFamily">标签类别</label>') && tagManagementSource.includes('<dt>标签类别</dt>'), "标签管理页面未统一使用标签类别术语");
assert(!tagManagementSource.includes('<th>最近更新</th>') && !tagManagementSource.includes('class="col-time"') && !tagManagementStyles.includes(".tag-table .col-time"), "标签管理列表仍展示最近更新字段");
assert(tagManagementSource.includes('<td colspan="6">') && tagManagementSource.includes('<dt>最近更新</dt><dd id="tagDetailUpdated">'), "标签管理列表列数未同步或详情更新时间被误删");
assert(/\.tag-filter-bar\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(tagManagementStyles) && /\.tag-table-wrap\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/.test(tagManagementStyles), "标签管理列表仍保留左右垂直边框");
assert(tagManagementPage.includes('id="suiteRoot"') && tagManagementSource.includes('getElementById("suiteRoot")') && !tagManagementPage.includes('id="tagManagementRoot"'), "标签管理页未使用原型套件标准内容根节点，浏览器标注可能失效");
assert(/\.file-selection-table th:last-child,[\s\S]*?padding-right:\s*var\(--table-action-edge-gap\)[\s\S]*?text-align:\s*right/.test(uploadWorkflowStyles), "上传文件选择列表操作列未遵循全局右端间距");
[
  "recent", "knowledge", "collaboration", "favorites", "browsing", "downloads", "sharing", "uploads", "recycle",
  "documents", "department", "company", "review", "manage-knowledge", "department-upload-tasks", "department-sharing-management",
  "department-recycle", "company-knowledge", "company-upload-tasks", "company-sharing", "company-recycle"
].forEach((page) => assertBusinessTableOrder(render(page), page));
const personalRecycle = render("recycle");
assert(!personalRecycle.includes('class="page-intro"') && !personalRecycle.includes("保留期限：30天") && personalRecycle.includes("恢复") && personalRecycle.includes("彻底删除"), "个人中心回收站仍包含多余介绍区或缺少批量操作");
assert(personalRecycle.includes('data-recycle-selected role="status" aria-live="polite" aria-atomic="true">已选中 0 条</span>'), "回收站工具栏缺少可访问的已选数量");
assert((personalRecycle.match(/data-recycle-bulk/g) || []).length === 2 && personalRecycle.includes('data-recycle-bulk disabled data-toast="所选文件已恢复到原位置"') && personalRecycle.includes('data-recycle-bulk disabled data-toast="所选文件已彻底删除"'), "回收站恢复或彻底删除缺少默认禁用态");
assert(personalRecycle.indexOf("data-recycle-selected") < personalRecycle.indexOf('data-toast="所选文件已恢复到原位置"') && personalRecycle.indexOf('data-toast="所选文件已恢复到原位置"') < personalRecycle.indexOf('data-toast="所选文件已彻底删除"'), "回收站左侧选择状态或批量按钮顺序不正确");
assert(/class="toolbar-right">[\s\S]*?data-filter-key="type"[\s\S]*?data-time-filter[\s\S]*?placeholder="搜索回收站文件"[\s\S]*?<\/div><\/div>/.test(personalRecycle), "回收站类型、删除时间或搜索未放在工具栏右侧");
assert(!personalRecycle.includes('class="view-switch"') && !personalRecycle.includes('title="列表视图"') && !personalRecycle.includes('title="宫格视图"'), "回收站仍显示列表或宫格视图选择");
assert(personalRecycle.includes("data-recycle-table") && personalRecycle.includes("data-select-all") && (personalRecycle.match(/data-row-select/g) || []).length >= 6, "回收站缺少全选框、行复选框或选择状态标识");
assert(suiteSource.includes("recycleSelected.textContent='已选中 '+checked.length+' 条'") && suiteSource.includes("document.querySelectorAll('[data-recycle-bulk]').forEach"), "回收站已选数量或批量按钮未接入勾选状态");
assert(!/personalLibraryTopbar\("回收站"\s*,/.test(suiteSource), "回收站顶部横条仍重复提供页面级批量操作");
assert(registry.components.find((item) => item.id === "app-sidebar").version === "4.5.1", "侧栏组件版本未更新");

assert(suiteSource.includes("function tableColgroup(columns)") && suiteSource.includes("table-library") && suiteSource.includes("management-generic-table"), "原型文件列表缺少语义列定义");
assert(/\.table-library \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-management \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles), "知识库或管理列表名称列未自动吸收剩余空间");
assert(!/<col[^>]+style=["'][^"']*width/i.test(knowledgeTableSource), "公共知识表格仍包含内联固定列宽");
assert(knowledgeTableSource.includes('class="col-name"') && /\.col-name\s*\{[^}]*width:\s*auto/.test(knowledgeTableStyles), "公共知识表格名称列未使用自适应宽度");
assert(!knowledgeTableSource.includes('class="col-more"') && /<th>操作<\/th>/.test(knowledgeTableSource), "公共知识表格仍将更多操作拆为独立空白列");
assert(/\.file-title\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/.test(knowledgeTableStyles), "公共知识表格名称未保持单行省略");
assert(/th:last-child,[\s\S]*?td:last-child\s*\{[^}]*padding-right:\s*var\(--table-action-edge-gap, 28px\)[^}]*text-align:\s*right/.test(knowledgeTableStyles), "公共知识表格操作列未遵循右端间距");
assert(registry.components.find((item) => item.id === "knowledge-table").version === "1.5.0", "公共知识表格组件版本未更新");
assert(registry.components.find((item) => item.id === "file-action-dialogs").version === "1.1.0", "文件操作弹窗组件版本未更新");

console.log("Prototype suite verification passed.");
