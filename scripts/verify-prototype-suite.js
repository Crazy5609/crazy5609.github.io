const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const suiteSource = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "suite.js"), "utf8");
const suiteStyles = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "suite.css"), "utf8");
const baseStyles = fs.readFileSync(path.join(projectRoot, "components", "base.css"), "utf8");
const sidebarSource = fs.readFileSync(path.join(projectRoot, "components", "app-sidebar", "component.js"), "utf8");
const sidebarStyles = fs.readFileSync(path.join(projectRoot, "components", "app-sidebar", "component.css"), "utf8");
const historyPanelSource = fs.readFileSync(path.join(projectRoot, "components", "search-history-panel", "component.js"), "utf8");
const historyPanelStyles = fs.readFileSync(path.join(projectRoot, "components", "search-history-panel", "component.css"), "utf8");
const uploadWorkflowStyles = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "department-knowledge-upload.css"), "utf8");
const knowledgeTableSource = fs.readFileSync(path.join(projectRoot, "components", "knowledge-table", "component.js"), "utf8");
const knowledgeTableStyles = fs.readFileSync(path.join(projectRoot, "components", "knowledge-table", "component.css"), "utf8");

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

function render(page, storedAdvancedCriteria) {
  const root = {
    innerHTML: "",
    insertAdjacentHTML(position, html) {
      this.innerHTML += html;
    }
  };
  const body = {
    dataset: { page },
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

const home = render("home");
assert(!home.includes("data-advanced-search-open") && !home.includes('id="advancedSearchModal"') && !home.includes("高级搜索"), "知识共享中心首页仍显示高级搜索入口或弹窗");
assert(home.includes('aria-label="知识库范围"') && home.includes("全范围知识库") && home.includes("添加附件") && home.includes("添加图片"), "首页移除高级搜索后核心输入工具不完整");
assert(suiteSource.includes("item.uploadDept===criteria.uploadDept") && suiteSource.includes("item.dept===criteria.fileDept") && suiteSource.includes("uploadDate>=criteria.uploadStart") && suiteSource.includes("uploadDate<=criteria.uploadEnd"), "高级搜索未实现上传日期、上传部门和归属部门的组合匹配");
assert(suiteSource.includes("请至少设置一个搜索条件") && suiteSource.includes("上传开始日期不能晚于结束日期"), "高级搜索缺少空条件或日期范围校验");
assert(suiteSource.includes("Array.from(advancedForm.elements).forEach") && suiteSource.includes("if(field.name)field.value=''"), "高级搜索重置未清空已保存的回填条件");
const advancedDocuments = render("documents", {
  uploadStart: "2026-07-24",
  uploadEnd: "2026-07-27",
  uploadDept: "供应链运营中心",
  fileDept: "供应链运营中心",
  type: "文档",
  scope: "部门可见",
  keyword: ""
});
assert(advancedDocuments.includes("高级搜索结果") && advancedDocuments.includes("共 1 条"), "高级搜索结果缺少命中数量摘要");
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
assert(/\.suite-table \.doc-name button\s*\{[^}]*white-space:\s*normal[^}]*-webkit-line-clamp:\s*2/.test(suiteStyles), "列表名称列未限制为最多两行");
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
assert(recent.includes('class="recent-summary"') && recent.includes('placeholder="搜索知识"') && recent.includes('data-recent-summary-submit') && recent.includes('data-nav="qa-result.html"'), "最近使用缺少数据展示、搜索或AI问答入口");
assert(!recent.includes('placeholder="搜索我的知识"'), "最近使用仍保留顶栏搜索");
assert(recent.includes('data-create-content-open') && recent.includes('data-toast="已打开上传任务"') && recent.includes('data-icon-name="plus"') && recent.includes('data-icon-name="uploadCloud"') && recent.includes('data-icon-name="download"') && recent.includes('data-icon-name="share"') && recent.includes('data-icon-name="trash2"'), "最近使用工具栏按钮缺少统一图标");
assert(suiteStyles.includes(".recent-summary") && suiteStyles.includes(".recent-summary-search") && suiteStyles.includes(".recent-ai-button"), "最近使用数据展示区域样式缺失");
assert(recent.includes("data-recent-share-submit disabled") && recent.indexOf("data-create-content-open") < recent.indexOf("data-recent-share-submit") && recent.indexOf('data-toast="已下载所选文件"') < recent.indexOf("data-recent-share-submit") && recent.indexOf("data-recent-share-submit") < recent.indexOf('data-toast="所选记录已删除"'), "最近使用工具栏按钮顺序或默认禁用态不正确");
assert(recent.includes("data-recent-table") && suiteSource.includes("recentShare.disabled=checked.length===0"), "最近使用共享提报未接入勾选状态");
assert(suiteSource.includes('id="shareSubmissionModal"') && suiteSource.includes('id="shareSubmissionDescription"') && suiteSource.includes('type="hidden" name="shareDirectory"') && suiteSource.includes('data-share-directory-add') && suiteSource.includes("openShareSubmission(recentShareSubmit,recentItems)"), "最近使用共享提报缺少共用弹窗、逐项增加目录、共享说明或批量入口绑定");
assert(suiteSource.includes("window.BompDepartmentDirectoryData||[]") && suiteSource.includes("window.BompCompanyDirectoryData||[]") && suiteSource.includes("data-share-directory-search"), "共享提报目录未复用公共部门、公司目录数据或缺少目录搜索");
assert(suiteSource.includes("submissionDirectories=Array.from") && suiteSource.includes("showShareSubmissionSuccess()") && suiteSource.includes('href="my-sharing.html"'), "最近使用共享提报缺少多目录校验、提交成功反馈或共享进度入口");
assert(/\[data-recent-share-submit\]:disabled\s*\{[^}]*cursor:\s*not-allowed/.test(suiteStyles), "最近使用共享提报缺少明确禁用样式");
const overflowMenu = suiteSource.match(/function openMenu\(trigger\)\{[\s\S]*?\n  function closeMenu/);
assert(overflowMenu && overflowMenu[0].includes("data-share-submit-single") && overflowMenu[0].includes("icon('uploadCloud',16)+'共享提报"), "最近使用更多菜单缺少共享提报弹窗入口");
assert(suiteSource.includes('data-create-content-open') && suiteSource.includes('id="createContentModal"'), "我的知识库新建按钮未接入新建内容弹窗");
assert(suiteSource.includes('name="createType" value="文档"') && suiteSource.includes('name="createType" value="表格"') && suiteSource.includes('name="createType" value="PPT"'), "新建内容弹窗缺少文档、表格或PPT类型");
assert(suiteSource.includes('不选择目录（保存至我的知识库）') && suiteSource.includes('data-create-folder-confirm'), "新建内容弹窗缺少可选目录或新建文件夹能力");
assert(suiteStyles.includes('.create-type-grid') && suiteStyles.includes('.create-folder-editor'), "新建内容弹窗样式缺失");
assert(overflowMenu[0].includes("创建副本</button>'+shareSubmitAction+(canEdit?'<button data-toast=\"权限管理已打开\""), "最近使用更多菜单的共享提报位置不正确");
assert(!recent.includes("<th>类型</th>") && recent.includes("<th>来源</th>") && recent.includes("<th>文件大小</th>") && recent.includes("<th>文件位置</th>") && recent.includes("<th>最近访问时间</th>"), "最近使用字段不正确");
assert(["他人分享", "我的知识", "部门知识库", "公司知识库"].every((source) => recent.includes(`>${source}<`)) && /\.table-recent \.col-source\s*\{[^}]*width:\s*13%/.test(suiteStyles), "最近使用来源字段不完整或列宽未配置");
assert(recent.indexOf("<th>名称</th>") < recent.indexOf("<th>文件大小</th>") && recent.indexOf("<th>文件大小</th>") < recent.indexOf("<th>最近访问时间</th>") && recent.indexOf("<th>最近访问时间</th>") < recent.indexOf("<th>来源</th>") && recent.indexOf("<th>来源</th>") < recent.indexOf("<th>文件位置</th>") && recent.indexOf("<th>文件位置</th>") < recent.indexOf("<th>操作</th>"), "最近使用字段顺序不正确");
assert(recent.includes('title="部门知识库 /') && !recent.includes('>部门知识库 /'), "最近使用文件位置未使用末级目录显示和完整路径提示");
assert(!recent.includes("权限类型") && !recent.includes("创建文件夹"), "最近使用仍包含已移除的筛选或操作");
assert(recent.includes("data-filter-display>类型</span>"), "最近使用筛选默认状态未仅显示类别名称");
assert(/\.suite-table th\s*\{[^}]*white-space:\s*nowrap/.test(suiteStyles), "表格短标题未保持单行");
assert(/\.table-recent \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles), "最近使用名称列未吸收剩余空间");
assert(/\.table-recent \.col-size,[\s\S]*?width:\s*8%/.test(suiteStyles), "最近使用文件大小列未使用弹性比例");
assert(/\.table-recent th:last-child\s*\{[^}]*text-align:\s*center/.test(suiteStyles) && /\.table-recent td:last-child\s*\{[^}]*text-align:\s*right/.test(suiteStyles), "最近使用操作列表头或行内容对齐不正确");
assert(/\.toolbar-select\.is-active\s*\{[^}]*border-color:\s*var\(--color-primary\)/.test(suiteStyles), "筛选下拉框缺少主题色激活态");
assert(suiteSource.includes("label+'：'"), "筛选下拉框缺少类别与选中值组合显示");

const knowledge = render("knowledge");
assert(knowledge.includes("文件夹") && knowledge.includes("共享范围") && knowledge.includes("创建时间") && !knowledge.includes("<th>类型</th>"), "我的知识字段不正确");
assert(/\.table-knowledge th:last-child\s*\{[^}]*text-align:\s*center/.test(suiteStyles) && /\.table-knowledge td:last-child\s*\{[^}]*text-align:\s*right/.test(suiteStyles) && /\.table-knowledge td:last-child \.row-actions\s*\{[^}]*justify-content:\s*flex-end/.test(suiteStyles), "我的知识操作列未固定在列表右端");
assert(knowledge.includes("待审核") && knowledge.includes("已发布") && knowledge.includes("协作分享") && knowledge.includes("私有草稿"), "我的知识状态不完整");
[
  ["status-published", "已发布"],
  ["status-review", "待审核"],
  ["status-draft", "私有草稿"],
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
assert(collaboration.includes("全部（") && collaboration.includes("分享给我（") && collaboration.includes("我分享的（"), "我的协作缺少视图页签");
assert(collaboration.includes("<th>文件大小</th>") && collaboration.includes("<th>类型</th>"), "我的协作新增字段不完整");
const readOnlyRow = collaboration.match(/<tr[^>]*data-permission="仅查看"[\s\S]*?<\/tr>/);
assert(readOnlyRow && !readOnlyRow[0].includes(">编辑<"), "仅查看协作文件仍提供编辑操作");
assert(!collaboration.includes("相关度排序") && !collaboration.includes("文件格式"), "我的协作仍包含已移除筛选");

const favorites = render("favorites");
["下载", "分享", "取消收藏", "创建副本", "反馈"].forEach((action) => assert(favorites.includes(`>${action}<`), `我的收藏缺少${action}操作`));
assert(favorites.includes("<th>文件位置</th>") && favorites.includes("公司知识库 /") && favorites.includes("部门知识库 /"), "我的收藏文件位置不符合公开范围");

const sharing = render("sharing");
assert(sharing.includes("最近7天") && sharing.includes("最近15天") && sharing.includes("最近30天"), "共享统计缺少提报时间选项");
assert(sharing.includes("公司知识库 /") && sharing.includes("部门知识库 /"), "共享统计目标目录缺少完整层级");

const uploads = render("uploads");
assert(uploads.includes("<th>上传时间</th>"), "我的上传缺少上传时间字段");
assert(!uploads.includes("<th>智能处理结果</th>") && !uploads.includes('class="col-result"') && !uploads.includes('class="result-text"'), "我的上传仍显示智能处理结果字段");
assert(uploads.includes(">批量确认<") && uploads.includes(">批量修改<"), "我的上传全部视图缺少批量操作");
assert(uploads.includes("最近7天") && uploads.includes("最近15天") && uploads.includes("最近30天"), "我的上传缺少时间选项");
assert(uploads.includes("data-filter-display>上传时间</span>"), "我的上传时间筛选默认文案不正确");
assert(/\.table-uploads \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-uploads \.col-size\s*\{[^}]*width:\s*10%/.test(suiteStyles) && /\.table-uploads \.col-time\s*\{[^}]*width:\s*15%/.test(suiteStyles) && /\.table-uploads \.col-status\s*\{[^}]*width:\s*13%/.test(suiteStyles) && /\.table-uploads \.col-actions\s*\{[^}]*width:\s*22%/.test(suiteStyles), "我的上传列宽未按信息优先级向左收紧");

const department = render("department");
assert(department.includes("当前目录") && department.includes("架构管理") && department.includes("包含全部下级目录文件"), "部门知识库缺少当前一级目录聚合信息");
assert(department.includes('<header class="suite-topbar library-topbar"><div class="library-directory-context"') && !department.includes('class="suite-crumb"'), "部门知识库未移除面包屑或未将目录信息移入顶部栏");
assert(!department.includes('<div class="suite-content"><div class="library-directory-context"'), "部门知识库内容区仍保留重复目录信息");
assert(department.includes("供应链业务架构管理") && department.includes("业务架构资产"), "部门知识库一级目录未聚合下级目录文件");
assert(suiteSource.includes("directory.children.length") && suiteSource.includes("仅展示当前目录文件"), "部门知识库缺少一级聚合与二级目录范围逻辑");
assert(suiteSource.includes("location.hash=e.detail.key") && suiteSource.includes("renderLibrary('department',e.detail.key)"), "部门目录选择未驱动右侧文件列表更新");
assert(department.includes('title="部门知识库 / 供应链运营中心 /') && !department.includes('>部门知识库 / 供应链运营中心 /'), "部门知识库文件位置未使用末级目录显示和完整路径提示");
const company = render("company");
assert(company.includes("当前目录") && company.includes("供应链运营中心") && company.includes("公司知识库 /"), "公司知识库目录未驱动右侧内容");
assert(suiteSource.includes("renderLibrary('company',e.detail.key)"), "公司知识库目录切换仍需整页刷新");
assert(company.includes('title="公司知识库 /') && !company.includes('>公司知识库 /'), "公司知识库文件位置未使用末级目录显示和完整路径提示");

const review = render("review");
assert(review.includes("全部 <b>136</b>") && review.includes("待审核 <b>36</b>") && review.includes("已通过 <b>78</b>") && review.includes("已退回 <b>16</b>"), "审核工作台状态视图不完整");
assert((review.match(/data-review-status=/g) || []).length >= 8, "审核工作台示例数据不足 8 条");
assert(review.includes("批量审核通过") && review.includes("批量退回修改") && review.includes("data-review-selected"), "审核工作台缺少批量处理能力");
assert(!review.includes("data-review-date-start") && !review.includes("data-review-date-end") && review.includes("输入关键词或提交人搜索"), "审核工作台仍显示提交日期筛选");
assert(review.includes("<th>共享目标</th>") && review.includes("公司知识库"), "审核工作台缺少共享目标列");
assert(review.includes("<th>所属部门</th>") && review.includes("供应链运营中心"), "审核工作台缺少提交人所属部门列");
assert(review.indexOf("<th>提交人</th>") < review.indexOf("<th>共享目标</th>") && review.indexOf("<th>共享目标</th>") < review.indexOf("<th>所属部门</th>"), "审核工作台共享目标列顺序不正确");
assert(!review.includes('class="suite-topbar"'), "审核工作台仍显示重复顶栏面包屑");
assert(review.includes('class="col-shared-target"') && review.includes('class="col-department"') && /\.table-review \.col-actions\s*\{[^}]*width:\s*19%/.test(suiteStyles), "审核工作台操作列未保留最右侧空间");
assert(/\.table-review td:last-child\s*\{[^}]*text-align:\s*right/.test(suiteStyles) && /\.table-review td:last-child \.review-row-actions\s*\{[^}]*justify-content:\s*flex-end/.test(suiteStyles), "审核工作台操作内容未靠右对齐");
const pendingReviewRow = review.match(/<tr[^>]*data-review-status="待审核"[\s\S]*?<\/tr>/);
const passedReviewRow = review.match(/<tr[^>]*data-review-status="已通过"[\s\S]*?<\/tr>/);
assert(pendingReviewRow && pendingReviewRow[0].includes("查看申请") && pendingReviewRow[0].includes("审核通过") && pendingReviewRow[0].includes("退回修改"), "待审核记录操作不完整");
assert(passedReviewRow && !passedReviewRow[0].includes("审核通过") && !passedReviewRow[0].includes("退回修改"), "已处理记录仍提供重复审核操作");
assert(review.includes('id="reviewDrawer"') && review.includes("知识基本信息") && review.includes("知识速读") && review.includes("入库位置"), "审核申请详情抽屉内容不完整");
assert(review.indexOf("入库位置") < review.indexOf("知识基本信息") && (review.match(/class="review-target-path/g) || []).length >= 2, "审核申请详情未在基本信息前展示两条入库目录");
assert(/\.review-drawer\s*\{[^}]*position:\s*fixed[^}]*width:\s*min\(480px/i.test(suiteStyles), "审核申请详情未使用 480px 右侧抽屉");

const management = render("management");
["知识统计", "知识管理", "目录管理", "上传任务", "共享管理", "回收站", "管理日志"].forEach((tab) => {
  assert(management.includes(`>${tab}<`), `部门知识库管理缺少${tab}页签`);
});
assert(management.includes("部门知识总量") && management.includes("本月新增") && management.includes("AI 引用次数"), "部门知识统计三项指标不完整");
assert(!management.includes("本月访问量"), "部门知识统计仍包含已移除的本月访问量卡片");
assert((management.match(/class="metric-card"/g) || []).length === 3, "部门知识统计顶部未保持三个统计卡片");
assert(management.includes("distribution-chart") && management.includes("trend-chart"), "部门知识统计缺少分布或趋势图");
assert(management.includes("department-bar-chart") && management.includes('class="department-bar"') && management.includes('class="bar-value"'), "部门知识分布未改为柱顶带数值的条形图");
assert(management.includes('viewBox="0 0 1080 290"'), "部门知识使用折线图未适配全宽布局");
assert(/\.department-stats-page \.management-charts\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "部门知识分布与使用情况未改为上下全宽布局");
assert(/\.department-stats-page \.management-stats\s*\{[^}]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(suiteStyles), "部门统计卡片未使用三列等宽布局");
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
assert(departmentKnowledgeManagement.includes("data-management-table") && departmentKnowledgeManagement.includes("data-select-all"), "部门知识管理缺少列表全选");
assert(departmentKnowledgeManagement.includes("调整所属目录") && departmentKnowledgeManagement.includes("共享提报"), "部门知识管理缺少批量操作");
assert(departmentKnowledgeManagement.includes("data-filter-display>类型</span>") && departmentKnowledgeManagement.includes("data-filter-display>状态</span>"), "部门知识管理筛选默认文案不正确");
assert(departmentKnowledgeManagement.includes('id="managementConfirm"'), "部门知识管理删除操作缺少确认弹窗");

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
assert(professionalManagement.includes("专业知识总量") && professionalManagement.includes(">745 <") && professionalManagement.includes(">+45 <") && professionalManagement.includes(">945 <"), "专业目录统计指标不正确");
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
assert(companyManagement.includes("公司知识总量") && companyManagement.includes(">5679 <") && companyManagement.includes(">+79 <") && companyManagement.includes(">1345 <"), "公司知识统计指标不正确");
assert(companyManagement.includes("按公司部门一级目录统计") && companyManagement.includes("供应链运营中心") && companyManagement.includes("1 / 2"), "公司知识分布口径或分页不正确");
assert(companyManagement.includes('viewBox="0 0 1080 290"'), "公司知识使用趋势未适配全宽布局");
assert(/\.scoped-dashboard-page \.management-charts\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(suiteStyles), "专业和公司统计图表未改为上下全宽布局");
const companyKnowledge = render("company-knowledge");
assert(companyKnowledge.includes("scoped-knowledge-layout") && companyKnowledge.includes("scoped-knowledge-tree") && companyKnowledge.includes("公司知识目录"), "公司知识管理缺少左侧两级目录树");
assert(companyKnowledge.includes("scoped-knowledge-results") && companyKnowledge.includes("scoped-knowledge-content") && companyKnowledge.includes("核心业务") && companyKnowledge.includes("数字化专业") && companyKnowledge.includes("scoped-folder-table") && companyKnowledge.includes("文件夹名称") && companyKnowledge.includes("创建时间") && companyKnowledge.includes("调整所属目录") && !companyKnowledge.includes("<th>大小</th>"), "公司知识管理右侧目录内容不完整");
assert(!companyKnowledge.includes("scoped-full-tree-children") && (companyKnowledge.match(/class="scoped-knowledge-tree-children"/g) || []).length >= 1, "公司知识管理目录树未限制为两级");
assert(!companyKnowledge.includes('data-filter-key="directory"') && companyKnowledge.includes("输入知识名称或上传人"), "公司知识管理仍显示选择目录下拉框或缺少搜索框");
assert(!companyKnowledge.includes("<th>所属目录</th>") && !companyKnowledge.includes('class="col-location"'), "公司知识管理仍显示所属目录列");
assert(!companyKnowledge.includes("<th>类型</th>") && !companyKnowledge.includes('class="col-type"'), "公司知识管理仍显示类型列");
assert(!companyKnowledge.includes("调整权限范围"), "公司知识管理仍显示调整权限范围");
assert(companyKnowledge.includes("company-knowledge-results"), "公司知识管理搜索区缺少专用布局标识");
assert(/\.scoped-folder-table th:last-child,[\s\S]*?\.scoped-folder-table td:last-child[\s\S]*?text-align:\s*right/.test(suiteStyles), "公司知识管理文件夹操作列未右对齐");
assert(/\.company-knowledge-results > \.management-search-row \.management-search button[\s\S]*?position:\s*absolute[\s\S]*?right:\s*0/.test(suiteStyles), "公司知识管理搜索图标未嵌入搜索框右端");

const companyUploads = render("company-upload-tasks");
["全部（32）", "处理中（5）", "异常（3）", "已共享提报（17）"].forEach((tab) => {
  assert(companyUploads.includes(tab), `公司上传任务缺少${tab}状态视图`);
});
assert(companyUploads.includes("确认入库") && companyUploads.includes("修改信息") && companyUploads.includes("删除"), "公司上传任务批量操作不完整");
assert(companyUploads.includes("文件大小") && companyUploads.includes("当前状态") && companyUploads.includes("智能处理结果"), "公司上传任务字段不完整");
assert(companyUploads.includes("data-filter-display>类型</span>") && companyUploads.includes("data-filter-display>上传时间</span>"), "公司上传任务筛选默认文案不正确");
const myUploadsVisual = render("uploads");
assert(myUploadsVisual.includes("全部（32）") && myUploadsVisual.includes("处理中（4）") && myUploadsVisual.includes("待确认（8）") && myUploadsVisual.includes("已完成（17）") && myUploadsVisual.includes("异常（3）"), "我的上传状态切换栏结构不完整");
assert(/body\[data-page="uploads"\] \.status-tabs\s*\{[\s\S]*?border-bottom:\s*1px solid/.test(suiteStyles) && /body\[data-page="uploads"\] \.status-tabs button\.is-active\s*\{[\s\S]*?color:\s*var\(--color-primary\)/.test(suiteStyles), "我的上传状态切换栏未使用主题色标签样式");
assert(/body\[data-page="uploads"\] \.status-tabs button \+ button\s*\{[\s\S]*?border-left:\s*1px solid/.test(suiteStyles), "我的上传状态切换栏缺少标签分隔线");
assert(/body\[data-page="uploads"\] \.status-tabs\s*\{[\s\S]*?justify-content:\s*flex-start/.test(suiteStyles) && /body\[data-page="uploads"\] \.status-tabs button\s*\{[\s\S]*?flex:\s*0 0 148px/.test(suiteStyles), "我的上传状态切换栏未向左集中排列");
assert(suiteSource.includes("scopedRankingRows(rankingBody.dataset.rankingScope,rankingMetric.dataset.rankingMetric)"), "专业或公司排行榜指标切换未实际重排数据");
assert(suiteSource.includes("scopedDistributionMarkup(distributionScope"), "专业或公司知识分布分页未实际更新内容");
assert(suiteSource.includes("data-confirm-company-upload") && suiteSource.includes("data-remove-upload-file"), "公司上传弹窗缺少确认或移除文件交互");
assert(companyManagement.includes("data-company-upload-input") && companyManagement.includes("data-company-upload-pick"), "公司上传弹窗缺少文件选择或拖放入口");
assert(suiteSource.includes("appendCompanyUploadFiles(e.target.files)") && suiteSource.includes("e.dataTransfer&&e.dataTransfer.files"), "公司上传弹窗未处理文件选择或拖放结果");

assert(/button\s*\{[^}]*border-radius:\s*var\(--button-radius\)\s*!important/.test(baseStyles), "普通页面按钮未统一为全局按钮圆角");
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
assert(JSON.stringify(departmentDirectoryData.map((item) => item.label)) === JSON.stringify(["架构管理", "数字化需求管理", "综合计划-数字化建设专业归口管理", "数字化项目建设管理", "非数字化项目管理（如管理研究项目、科技项目等）", "网络安全管理", "运维管理", "运营体系建设", "供应链平台运营管理", "人工智能运营管理", "数据管理", "数字化专项工作", "数字化工作领导小组", "综合工作"]), "公共侧栏部门知识库一级目录名称或顺序不正确");
assert(sidebarSource.includes("dept-bomp-2025-project") && sidebarSource.includes("国家网络安全攻防演习、全国“两会”、国家节假日等期间网络及信息系统保障"), "公共侧栏部门知识库未保留完整下级目录");
assert(Array.isArray(companyDirectoryData) && companyDirectoryData.length === 11, "公共侧栏公司知识库未使用工作簿中的 11 个一级目录");
assert(JSON.stringify(companyDirectoryData.map((item) => item.label)) === JSON.stringify(["核心业务", "法律法规", "管理制度", "工作规则", "会议文件", "培训学习", "党的建设", "新闻宣传", "创新成果", "经验案例", "模板表格"]), "公共侧栏公司知识库一级目录名称或顺序不正确");
const companyDirectorySource = JSON.stringify(companyDirectoryData);
assert(companyDirectorySource.includes("供应链业务架构管理") && companyDirectorySource.includes("工程前期文件") && companyDirectorySource.includes("物资公司公司牵头/参与标准"), "公共侧栏公司知识库未保留工作簿中的深层目录");
assert(sidebarStyles.includes(".nav-item--level-3") && sidebarStyles.includes(".nav-item--level-6"), "公共侧栏缺少深层目录缩进样式");
assert(sidebarSource.includes("SIDEBAR_MAX_WIDTH = 420") && sidebarSource.includes("bomp-sidebar-width") && sidebarStyles.includes(".sidebar-resize-handle"), "公共侧栏缺少 220px 至 420px 拉宽交互");
assert(suiteSource.includes("scopedDirectoryNodeMarkup") && suiteSource.includes("companyKnowledgeDirectoryData"), "公司目录管理页未递归使用公共公司目录数据");
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
const companyPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "company-library.html"), "utf8");
const reviewPage = fs.readFileSync(path.join(projectRoot, "pages", "prototype-suite", "review-workbench.html"), "utf8");
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
assert(suiteScript.includes("files=isCompany?companyDocs:departmentDocuments(directory)"), "公司知识库未使用独立参考图文件数据");
assert(departmentManagementPage.includes('active="department-library-management"'), "部门管理入口未正确高亮");
assert(directoryPage.includes('active="professional-directory-management"'), "专业目录入口未正确高亮");
assert(directoryPage.includes('data-page="professional-management"'), "专业目录入口未默认进入知识统计");
assert(companyManagementPage.includes('active="company-library-management"') && companyManagementPage.includes('data-page="company-management"'), "公司管理入口未正确高亮或缺少页面");
managementChildren.forEach(([key, label]) => {
  assert(suiteScript.includes(`"${key}":"${key === "department-library-management" ? "library-management" : key === "professional-directory-management" ? "directory-management" : "company-library-management"}.html"`), `${label} 缺少跳转映射`);
});
assert(suiteScript.includes('"professional-directory-management":"directory-management.html"'), "专业目录管理兼容地址映射已丢失");
assert(departmentPage.includes('active="dept-architecture-management"'), "部门知识库未保留当前架构管理目录选中状态");
assert(companyPage.includes('active="company-core-business"'), "公司知识库未默认选中工作簿的首个一级目录");
assert(reviewPage.includes('data-page="review"') && reviewPage.includes('active="review-workbench"'), "审核工作台兼容页未正确高亮");

const registry = JSON.parse(fs.readFileSync(path.join(projectRoot, "components", "registry.json"), "utf8"));
const sidebarComponent = registry.components.find((item) => item.id === "app-sidebar");
assert(sidebarComponent && sidebarComponent.version === "4.3.0", "侧栏组件未登记为 4.3.0");
assert(sidebarSource.includes('component.css?v=4.3.0') && sidebarSource.includes('setPointerCapture') && sidebarSource.includes('pointercancel'), "侧栏拖拽逻辑或样式版本未升级");
assert(/\.sidebar-resize-handle\s*\{[^}]*width:\s*10px/.test(sidebarStyles) && /\.sidebar-resize-handle::before\s*\{[^}]*height:\s*44px/.test(sidebarStyles), "侧栏拖拽热区或视觉提示不符合全系统规范");
sidebarComponent.usedBy.forEach((pagePath) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, pagePath), "utf8");
  assert(pageSource.includes("app-sidebar/component.js?v=4.3.0"), `${pagePath} 未引用最新版公共侧栏`);
});
const baseStylesComponent = registry.components.find((item) => item.id === "base-styles");
assert(baseStylesComponent && baseStylesComponent.version === "2.2.0", "基础样式未登记为 2.2.0");
baseStylesComponent.usedBy.forEach((pagePath) => {
  const pageSource = fs.readFileSync(path.join(projectRoot, pagePath), "utf8");
  assert(pageSource.includes("base.css?v=2.2.0"), `${pagePath} 未引用最新版基础样式`);
});
const historyPanelComponent = registry.components.find((item) => item.id === "search-history-panel");
assert(historyPanelComponent && historyPanelComponent.version === "1.0.0", "搜索历史面板未登记或版本不正确");
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
assert(personalSharing.includes("个人中心") && personalSharing.includes(">我的共享<") && personalSharing.includes("搜索共享记录"), "我的共享未展示本人发起的共享进度");
assert((personalSharing.match(/class="suite-search"/g) || []).length === 1, "我的共享顶部搜索栏未移除");
assert(personalSharing.includes('class="action-cell"') && /\.table-sharing \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-sharing \.col-location\s*\{[^}]*width:\s*20%/.test(suiteStyles) && /\.table-sharing \.col-time\s*\{[^}]*width:\s*16%/.test(suiteStyles) && /\.table-sharing \.col-actions\s*\{[^}]*width:\s*9%/.test(suiteStyles), "我的共享列宽未按信息优先级弹性分配");
const personalApprovals = render("approvals");
assert(!personalApprovals.includes('class="suite-topbar"'), "审核工作台兼容页仍显示重复顶栏面包屑");
assert(personalApprovals.includes("批量审核通过") && personalApprovals.includes("批量退回修改") && personalApprovals.includes("查看申请") && personalApprovals.includes('id="reviewDrawer"'), "我的审批未完整承接审核工作台内容");
const personalUploads = render("uploads");
assert((personalUploads.match(/class="suite-search"/g) || []).length === 1, "我的上传顶部搜索栏未移除");
assert(/\.suite-table th:last-child,[\s\S]*?\.suite-table \.action-cell\s*\{[^}]*overflow:\s*visible[^}]*white-space:\s*nowrap/.test(suiteStyles), "全局列表操作列未设置完整单行展示");
assert(/\.suite-table th,[\s\S]*?padding-right:\s*12px[^}]*padding-left:\s*12px/.test(suiteStyles), "全局表格列间距未统一");
const personalRecycle = render("recycle");
assert(personalRecycle.includes(">回收站<") && personalRecycle.includes("恢复") && personalRecycle.includes("彻底删除") && personalRecycle.includes("保留期限：30天"), "个人中心回收站内容不完整");
assert(registry.components.find((item) => item.id === "app-sidebar").version === "4.3.0", "侧栏组件版本未更新");

assert(suiteSource.includes("function tableColgroup(columns)") && suiteSource.includes("table-library") && suiteSource.includes("management-generic-table"), "原型文件列表缺少语义列定义");
assert(/\.table-library \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles) && /\.table-management \.col-name\s*\{[^}]*width:\s*auto/.test(suiteStyles), "知识库或管理列表名称列未自动吸收剩余空间");
assert(!/<col[^>]+style=["'][^"']*width/i.test(knowledgeTableSource), "公共知识表格仍包含内联固定列宽");
assert(knowledgeTableSource.includes('class="col-name"') && /\.col-name\s*\{[^}]*width:\s*auto/.test(knowledgeTableStyles), "公共知识表格名称列未使用自适应宽度");
assert(registry.components.find((item) => item.id === "knowledge-table").version === "1.2.0", "公共知识表格组件版本未更新");

console.log("Prototype suite verification passed.");
