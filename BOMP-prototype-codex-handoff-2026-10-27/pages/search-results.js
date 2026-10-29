(function () {
  "use strict";

  var rows = [
    { id: "WZ-2025-XM-0032", title: "《国网物资公司-2025年企业经营管理系统-设计开发实施项目业务需求说明书》", format: "word", type: "需求说明书", scope: "公司", knowledgeType: "项目文档", directory: "经营管理", uploader: "张伟", uploadedAt: "2026-07-28 09:32", version: "V2.1", department: "数字化运营中心", summary: "本文档说明企业经营管理系统建设的业务背景、目标定位和功能需求，覆盖物资采购、合同管理、仓储配送、供应商协同及财务结算等核心业务。", conclusion: "项目以统一业务流程和数据标准为基础，推动经营管理数字化、精益化与智能化。" },
    { id: "WZ-2025-XM-0033", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目软件需求说明书", format: "word", type: "需求说明书", scope: "公司", knowledgeType: "制度规范", directory: "规章制度", uploader: "李娜", uploadedAt: "2026-07-27 09:32", version: "V1.4", department: "数字化运营中心", summary: "文档定义系统功能、数据、接口和非功能需求，明确采购协同、合同履约和经营分析模块的实现边界。", conclusion: "软件建设应遵循统一架构与权限模型，并满足业务连续性和审计追溯要求。" },
    { id: "WZ-2025-XM-0034", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目可行性研究报告", format: "pdf", type: "报告", scope: "公司", knowledgeType: "项目文档", directory: "项目立项", uploader: "王建国", uploadedAt: "2026-07-26 09:32", version: "V1.0", department: "发展策划部", summary: "报告从业务必要性、技术路线、投资估算和实施条件等方面论证项目建设可行性。", conclusion: "项目具备实施基础，建议按总体设计、分阶段建设和持续运营方式推进。" },
    { id: "WZ-2025-XM-0035", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目技术规范书", format: "word", type: "技术规范", scope: "公司", knowledgeType: "技术资料", directory: "技术规范", uploader: "赵敏", uploadedAt: "2026-07-25 11:32", version: "V1.2", department: "数字化运营中心", summary: "文档规定系统架构、数据交换、安全防护、部署资源和交付验收等技术要求。", conclusion: "技术方案需满足公司统一技术架构、安全基线和国产化适配要求。" },
    { id: "WZ-2024-ZD-0018", title: "《国网物资有限公司物资采购管理办法（2024版）》", format: "pdf", type: "管理制度", scope: "公司", knowledgeType: "制度规范", directory: "采购管理", uploader: "陈晨", uploadedAt: "2026-07-24 15:10", version: "V3.0", department: "采购管理部", summary: "办法规范物资采购计划、采购方式、实施组织、结果确认和合同衔接等管理活动。", conclusion: "各类采购活动应遵循分级审批、过程留痕和风险可控原则。" },
    { id: "WZ-2025-HT-0012", title: "《物资采购合同示范文本（2025年修订版）》", format: "word", type: "合同范本", scope: "指定部门", knowledgeType: "合同范本", directory: "合同管理", uploader: "刘洋", uploadedAt: "2026-07-23 10:18", version: "V2.0", department: "合同管理部", summary: "示范文本提供物资采购合同通用条款、专用条款和附件清单，统一履约、验收和争议处理约定。", conclusion: "签订合同时应结合采购结果补充专用条款，不得擅自删除风险控制条款。" },
    { id: "WZ-2025-SJ-0009", title: "《国网物资公司数据治理工作方案（2025-2027年）》", format: "ppt", type: "工作方案", scope: "公司", knowledgeType: "管理制度", directory: "数据治理", uploader: "周林", uploadedAt: "2026-07-22 16:45", version: "V1.0", department: "数字化运营中心", summary: "方案明确三年数据治理目标、重点任务、实施路径和组织保障，覆盖标准、质量、共享与安全。", conclusion: "通过分阶段治理形成权责清晰、标准统一、质量可控的数据管理体系。" },
    { id: "WZ-2025-CZ-0021", title: "国网物资公司供应商管理系统用户操作手册", format: "word", type: "操作手册", scope: "本部门", knowledgeType: "技术资料", directory: "系统运维", uploader: "孙悦", uploadedAt: "2026-07-21 14:06", version: "V1.6", department: "供应链管理部", summary: "手册介绍供应商注册、信息维护、履约评价、风险处置和查询统计等功能的操作步骤。", conclusion: "用户应按岗位权限办理供应商业务，重要操作需复核确认。" },
    { id: "WZ-2026-NK-0007", title: "《公司级供应商重大风险处置内部指引》", format: "pdf", type: "管理制度", scope: "指定部门", knowledgeType: "制度规范", directory: "受限知识", uploader: "", uploadedAt: "2026-07-20 09:10", version: "", department: "", restricted: true }
  ];

  var images = [
    { id: 1, name: "年度采购计划数据分析图.png", category: "数据图表", scope: "公司", library: "公司知识库 / 物资计划部", date: "2026-08-28", keywords: "供应链 数字化 采购 计划 数据 分析" },
    { id: 2, name: "智慧仓储库区作业现场.jpg", category: "现场照片", scope: "公司", library: "公司知识库 / 物资供应部", date: "2026-08-21", keywords: "供应链 数字化 仓储 库区 物资" },
    { id: 3, name: "供应商服务大会签到现场.jpg", category: "活动照片", scope: "本部门", library: "部门知识库 / 供应链运营中心", date: "2026-08-15", keywords: "供应链 数字化 供应商 会议 服务" },
    { id: 4, name: "应急物资储备检查清单.jpg", category: "扫描件", scope: "公司", library: "公司知识库 / 物资供应部", date: "2026-08-09", keywords: "供应链 数字化 应急 物资 清单" },
    { id: 5, name: "供应链运营驾驶舱总览.png", category: "系统截图", scope: "公司", library: "公司知识库 / 供应链运营中心", date: "2026-07-30", keywords: "供应链 数字化 运营 驾驶舱 看板" },
    { id: 6, name: "绿色供应链专题培训材料封面.png", category: "培训素材", scope: "本部门", library: "部门知识库 / 综合计划", date: "2026-07-18", keywords: "供应链 数字化 绿色 培训 材料" },
    { id: 7, name: "跨区配送履约监控看板.png", category: "系统截图", scope: "公司", library: "公司知识库 / 物资供应部", date: "2026-07-11", keywords: "供应链 数字化 配送 履约 监控" },
    { id: 8, name: "数字化运营专题会议纪要.png", category: "文档图片", scope: "本部门", library: "部门知识库 / 数字化运营", date: "2026-06-26", keywords: "供应链 数字化 运营 会议 纪要" }
  ];

  var params = new URLSearchParams(window.location.search);
  var mode = ["ai", "knowledge", "image"].includes(params.get("mode")) ? params.get("mode") : "knowledge";
  var scopeParam = params.get("scope") || "";
  var activeNav = scopeParam === "department" ? "department-library" : scopeParam === "personal" ? "personal-library" : "company-library";
  var table = document.getElementById("knowledgeTable");
  var currentRow = rows[0];
  var actionRow = rows[0];
  var currentImage = images[0];

  BompPrototype.initShell({ active: activeNav });

  function byId(id) { return document.getElementById(id); }
  function rowById(id) { return rows.find(function (row) { return row.id === id; }); }
  function imageById(id) { return images.find(function (item) { return item.id === Number(id); }); }

  function setMode(nextMode) {
    mode = nextMode;
    document.querySelectorAll("[data-mode-view]").forEach(function (view) {
      view.hidden = view.dataset.modeView !== mode;
    });
    document.querySelectorAll("[data-mode-tab]").forEach(function (tab) {
      var active = tab.dataset.modeTab === mode;
      tab.classList.toggle("is-active", active);
      if (active) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    byId("newChatButton").hidden = mode !== "ai";
    var titles = { ai: "AI问答", knowledge: "知识检索", image: "图片检索" };
    document.title = "知识共享中心 - " + titles[mode];
  }

  function updateAiPanel(row) {
    if (!row || row.restricted) return;
    currentRow = row;
    byId("aiPanelTitle").textContent = row.title.replace(/[《》]/g, "");
    byId("aiSummary").textContent = row.summary;
    byId("aiConclusion").textContent = row.conclusion;
    byId("aiVersion").textContent = row.version;
    byId("aiScope").textContent = row.scope === "公司" ? "国网物资有限公司" : row.scope;
    byId("aiDate").textContent = row.uploadedAt.slice(0, 7).replace("-", "年") + "月";
    byId("aiDepartment").textContent = row.department;
    byId("aiApplicable").textContent = "适用于" + (row.scope === "公司" ? "国网物资有限公司" : row.scope) + "相关业务人员及" + row.department + "。";
  }

  function applyFilters() {
    var query = byId("searchInput").value.trim().toLowerCase();
    var fileType = byId("fileTypeFilter").value;
    var publicScope = byId("publicScopeFilter").value;
    var knowledgeType = byId("knowledgeTypeFilter").value;
    var libraryScope = byId("libraryScope").value;
    var sort = byId("sortFilter").value;
    var terms = query.split(/\s+/).filter(Boolean);
    var filtered = rows.filter(function (row) {
      var searchable = [row.title, row.type, row.scope, row.knowledgeType, row.directory, row.summary || ""].join(" ").toLowerCase();
      return terms.every(function (term) { return searchable.indexOf(term) >= 0; }) &&
        (!fileType || row.type === fileType) && (!publicScope || row.scope === publicScope) &&
        (!knowledgeType || row.knowledgeType === knowledgeType) && (!libraryScope || row.scope === libraryScope);
    });
    if (sort !== "relevance") {
      filtered.sort(function (a, b) { return sort === "latest" ? b.uploadedAt.localeCompare(a.uploadedAt) : a.uploadedAt.localeCompare(b.uploadedAt); });
    }
    table.rows = filtered;
    table.filter(query);
    byId("resultSummary").textContent = "找到 " + filtered.length + " 条相关知识";
    var firstReadable = filtered.find(function (row) { return !row.restricted; });
    if (firstReadable) updateAiPanel(firstReadable);
  }

  function openPermission(rowOrTitle) {
    actionRow = typeof rowOrTitle === "string" ? null : rowOrTitle;
    byId("permissionFileName").textContent = typeof rowOrTitle === "string" ? rowOrTitle : rowOrTitle.title;
    byId("permissionReason").value = "";
    BompPrototype.openModal("permissionModal");
  }

  function openDetail(row) {
    if (!row || row.restricted) {
      if (row) openPermission(row);
      return;
    }
    currentRow = row;
    byId("detailNumber").textContent = row.id;
    byId("detailTitle").textContent = row.title;
    byId("documentPreviewTitle").textContent = row.title.replace(/[《》]/g, "");
    byId("detailFileIcon").textContent = ({ pdf: "PDF", ppt: "PPTX", excel: "XLSX", image: "PNG", video: "MP4", audio: "MP3" })[row.format] || "DOCX";
    byId("detailType").textContent = row.type;
    byId("detailScope").textContent = row.scope;
    byId("detailKnowledgeType").textContent = row.knowledgeType;
    byId("detailDirectory").textContent = row.directory;
    byId("detailUploader").textContent = row.uploader;
    byId("detailUploadedAt").textContent = row.uploadedAt;
    byId("resultsView").hidden = true;
    byId("detailView").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderHistory() {
    var history = {
      ai: [["这张报销单有什么问题？", "今天 10:26"], ["供应商履约评价有哪些指标？", "昨天 16:42"], ["总结采购计划编制要求", "9月5日 09:18"]],
      knowledge: [["企业经营管理系统", "今天 10:26"], ["物资采购管理办法", "昨天 16:42"], ["供应商履约评价", "9月5日 09:18"]],
      image: [["供应链 数字化", "今天 10:12"], ["智慧仓储", "昨天 15:08"], ["供应商大会", "9月4日 11:35"]]
    }[mode];
    var list = byId("historyList");
    list.innerHTML = "";
    history.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      var label = document.createElement("span");
      var time = document.createElement("time");
      label.textContent = entry[0];
      time.textContent = entry[1];
      button.append(label, time);
      button.addEventListener("click", function () {
        BompPrototype.closeModal(byId("historyModal"));
        if (mode === "ai") { byId("assistantInput").value = entry[0]; byId("assistantInput").focus(); }
        if (mode === "knowledge") { byId("searchInput").value = entry[0]; applyFilters(); }
        if (mode === "image") { byId("imageKeyword").value = entry[0]; renderImages(); }
      });
      list.appendChild(button);
    });
  }

  function renderImages() {
    var query = byId("imageKeyword").value.trim().toLowerCase();
    var scope = byId("imageScopeFilter").value;
    var sort = byId("imageSortFilter").value;
    var terms = query.split(/\s+/).filter(Boolean);
    var filtered = images.filter(function (item) {
      var searchable = [item.name, item.category, item.scope, item.library, item.keywords].join(" ").toLowerCase();
      return terms.every(function (term) { return searchable.indexOf(term) >= 0; }) && (!scope || item.scope === scope);
    });
    if (sort === "latest") filtered.sort(function (a, b) { return b.date.localeCompare(a.date); });
    var grid = byId("imageGrid");
    grid.innerHTML = "";
    filtered.forEach(function (item) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "image-card";
      card.dataset.imageId = item.id;
      card.setAttribute("aria-label", "预览" + item.name);
      card.innerHTML = '<span class="image-art image-art--' + item.id + '" role="img" aria-label="' + item.name + '缩略图"></span>' +
        '<span class="image-card-copy"><strong title="' + item.name + '">' + item.name + '</strong><span>' + item.library + '</span><span class="image-card-meta"><em>' + item.category + '</em><time>' + item.date + '</time></span></span>';
      card.addEventListener("click", function () { openImagePreview(item); });
      grid.appendChild(card);
    });
    if (!filtered.length) {
      var empty = document.createElement("div");
      empty.className = "empty-image-state";
      empty.textContent = "未找到符合条件的图片，请调整关键词或公开范围";
      grid.appendChild(empty);
    }
    byId("imageResultSummary").textContent = "找到 " + filtered.length + " 张相关图片";
  }

  function openImagePreview(item) {
    currentImage = item;
    byId("imagePreviewTitle").textContent = "图片预览 · " + item.category;
    byId("imagePreviewName").textContent = item.name;
    byId("imagePreviewLibrary").textContent = item.library;
    byId("imagePreviewDate").textContent = item.date;
    byId("imagePreviewArt").className = "image-preview-art image-art--" + item.id;
    byId("imagePreviewArt").setAttribute("aria-label", item.name + "预览");
    BompPrototype.openModal("imagePreviewModal");
  }

  byId("modeBack").addEventListener("click", function () { window.location.href = "home.html"; });
  byId("historyButton").addEventListener("click", function () { renderHistory(); BompPrototype.openModal("historyModal"); });
  byId("newChatButton").addEventListener("click", function () { byId("assistantInput").value = ""; byId("assistantInput").focus(); BompPrototype.showToast("已新建问答会话"); });

  byId("assistantComposer").addEventListener("submit", function (event) {
    event.preventDefault();
    var question = byId("assistantInput").value.trim();
    if (!question) { BompPrototype.showToast("请输入问题后再发送"); byId("assistantInput").focus(); return; }
    byId("aiQuestionTitle").textContent = question;
    document.querySelector(".answer-lead").textContent = "已结合当前会话、企业知识库和相关制度重新分析。以下结论可用于业务办理前的快速核对。";
    byId("assistantInput").value = "";
    document.querySelector(".answer-block").scrollIntoView({ behavior: "smooth", block: "start" });
    BompPrototype.showToast("回答已重新生成");
  });

  ["attachQuestion", "addQuestionImage"].forEach(function (id) {
    byId(id).addEventListener("click", function () { BompPrototype.showToast(id === "attachQuestion" ? "已添加报销制度附件" : "已添加报销单图片"); });
  });

  document.querySelectorAll("[data-citation]").forEach(function (button) {
    button.addEventListener("click", function () {
      var card = document.querySelector('[data-reference="' + button.dataset.citation + '"]');
      document.querySelectorAll(".reference-card").forEach(function (item) { item.classList.remove("is-highlighted"); });
      card.classList.add("is-highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll("[data-answer-action]").forEach(function (button) {
    button.addEventListener("click", function () { BompPrototype.showToast(button.dataset.answerAction === "copy" ? "回答已复制" : "回答已重新生成"); });
  });

  document.querySelectorAll("[data-reference-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      var action = button.dataset.referenceAction;
      if (action === "permission") openPermission("《差旅报销附件审核工作指引》");
      else BompPrototype.showToast(action === "download" ? "引用文件下载已开始" : "引用文件已收藏");
    });
  });

  byId("searchForm").addEventListener("submit", function (event) { event.preventDefault(); applyFilters(); });
  byId("searchInput").addEventListener("input", applyFilters);
  ["libraryScope", "fileTypeFilter", "publicScopeFilter", "knowledgeTypeFilter", "sortFilter"].forEach(function (id) { byId(id).addEventListener("change", applyFilters); });
  byId("resetFilters").addEventListener("click", function () {
    byId("fileTypeFilter").value = ""; byId("publicScopeFilter").value = ""; byId("knowledgeTypeFilter").value = ""; byId("sortFilter").value = "relevance"; byId("libraryScope").value = ""; byId("searchInput").value = ""; applyFilters();
  });

  table.addEventListener("row-open", function (event) { openDetail(rowById(event.detail.id)); });
  table.addEventListener("table-action", function (event) {
    var row = rowById(event.detail.id);
    actionRow = row;
    if (event.detail.action === "apply-permission") openPermission(row);
    else if (event.detail.action === "preview") openDetail(row);
    else if (event.detail.action === "ai-read") { updateAiPanel(row); byId("aiPanelTitle").scrollIntoView({ behavior: "smooth", block: "nearest" }); BompPrototype.showToast("AI速读已切换至所选文档"); }
    else if (event.detail.action === "more") byId("actionMenu").hidden = false;
    else if (event.detail.action === "download") BompPrototype.showToast("文件下载已开始");
  });

  document.querySelectorAll("[data-menu-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      byId("actionMenu").hidden = true;
      var labels = { share: "分享链接已生成", download: "文件下载已开始", favorite: "已收藏到我的知识库", copy: "副本创建成功" };
      BompPrototype.showToast(labels[button.dataset.menuAction]);
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("bomp-knowledge-table") && !event.target.closest("#actionMenu")) byId("actionMenu").hidden = true;
  });

  byId("backToResults").addEventListener("click", function () { byId("detailView").hidden = true; byId("resultsView").hidden = false; });
  document.querySelectorAll("[data-detail-action]").forEach(function (button) { button.addEventListener("click", function () { var labels = { share: "分享链接已生成", download: "文件下载已开始", favorite: "已收藏到我的知识库" }; BompPrototype.showToast(labels[button.dataset.detailAction]); }); });

  byId("permissionSubmit").addEventListener("click", function () {
    var reason = byId("permissionReason");
    if (!reason.value.trim()) { BompPrototype.showToast("请填写申请原因"); reason.focus(); return; }
    BompPrototype.closeModal(byId("permissionModal"));
    BompPrototype.showToast("权限申请已提交");
  });

  byId("advancedButton").addEventListener("click", function () { BompPrototype.openModal("advancedModal"); });
  byId("advancedApply").addEventListener("click", function () { var keyword = byId("exactKeyword").value.trim(); if (keyword) byId("searchInput").value = keyword; BompPrototype.closeModal(byId("advancedModal")); applyFilters(); BompPrototype.showToast("高级检索条件已应用"); });
  byId("advancedReset").addEventListener("click", function () { byId("uploadDepartment").selectedIndex = 0; byId("ownerDepartment").selectedIndex = 0; byId("exactKeyword").value = ""; });
  byId("refreshAiButton").addEventListener("click", function () { updateAiPanel(currentRow); BompPrototype.showToast("AI速读已重新生成"); });
  byId("openAiDocument").addEventListener("click", function () { openDetail(currentRow); });
  byId("askDocumentButton").addEventListener("click", function () { window.location.href = "search-results.html?mode=ai&q=" + encodeURIComponent("请总结" + currentRow.title); });

  byId("chooseImageButton").addEventListener("click", function () { byId("imageFileInput").click(); });
  byId("imageFileInput").addEventListener("change", function () { var file = this.files && this.files[0]; if (!file) return; byId("imageQueryText").textContent = file.name; BompPrototype.showToast("图片已添加，可开始检索"); });
  byId("imageSearchForm").addEventListener("submit", function (event) { event.preventDefault(); renderImages(); BompPrototype.showToast("图片检索已更新"); });
  byId("imageKeyword").addEventListener("input", renderImages);
  ["imageScopeFilter", "imageSortFilter"].forEach(function (id) { byId(id).addEventListener("change", renderImages); });
  document.querySelectorAll("[data-image-action]").forEach(function (button) { button.addEventListener("click", function () { BompPrototype.showToast(button.dataset.imageAction === "download" ? currentImage.name + " 下载已开始" : "图片已收藏"); }); });

  var initialQuery = params.get("q");
  if (initialQuery && mode === "knowledge") byId("searchInput").value = initialQuery;
  if (initialQuery && mode === "image") byId("imageKeyword").value = initialQuery;
  if (initialQuery && mode === "ai") byId("aiQuestionTitle").textContent = initialQuery;
  if (scopeParam === "company") byId("libraryScope").value = "公司";
  if (scopeParam === "department") byId("libraryScope").value = "本部门";
  if (scopeParam === "personal") byId("libraryScope").value = "个人";

  setMode(mode);
  applyFilters();
  updateAiPanel(rows[0]);
  renderImages();
})();
