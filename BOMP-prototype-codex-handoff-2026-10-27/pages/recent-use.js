(function () {
  var referenceNow = new Date("2026-09-07T10:20:00+08:00");
  var files = [
    { id: "recent-01", name: "2026年度供应链重点工作安排.docx", ext: "docx", type: "word", recentAt: "2026-09-07T10:10:00+08:00", timeText: "10分钟前", permission: "可管理", library: "我的知识库", path: "我的知识库 / 工作材料 / 项目汇报", favorite: true, pinned: true, canDownload: true, canShare: true, editable: true },
    { id: "recent-02", name: "BOMP知识共享中心建设方案.pptx", ext: "pptx", type: "ppt", recentAt: "2026-09-07T09:32:00+08:00", timeText: "今天 09:32", permission: "可编辑", library: "我的知识库", path: "我的知识库 / 工作材料 / 系统建设 / 阶段成果", favorite: false, pinned: false, canDownload: true, canShare: true, editable: true },
    { id: "recent-03", name: "公司采购管理办法（2026版）.pdf", ext: "pdf", type: "pdf", recentAt: "2026-09-06T16:45:00+08:00", timeText: "昨天 16:45", permission: "可管理", library: "公司知识库", path: "公司知识库 / 综合管理 / 采购制度 / 管理制度", favorite: true, pinned: false, canDownload: true, canShare: false, editable: false },
    { id: "recent-04", name: "部门月度工作统计表.xlsx", ext: "xlsx", type: "excel", recentAt: "2026-09-06T11:18:00+08:00", timeText: "昨天 11:18", permission: "可编辑", library: "部门知识库", path: "部门知识库 / 供应链运营中心 / 运营分析 / 月度统计", favorite: false, pinned: true, canDownload: true, canShare: true, editable: true },
    { id: "recent-05", name: "知识目录梳理培训材料.pptx", ext: "pptx", type: "ppt", recentAt: "2026-09-05T15:26:00+08:00", timeText: "2026-09-05 15:26", permission: "可查看", library: "部门知识库", path: "部门知识库 / 数字化运营中心 / 培训资料 / 知识治理", favorite: true, pinned: false, canDownload: false, canShare: true, editable: true },
    { id: "recent-06", name: "合规风险检查清单.xlsx", ext: "xlsx", type: "excel", recentAt: "2026-09-04T10:05:00+08:00", timeText: "2026-09-04 10:05", permission: "可管理", library: "我的知识库", path: "我的知识库 / 制度规范 / 合规管理", favorite: false, pinned: false, canDownload: true, canShare: true, editable: true },
    { id: "recent-07", name: "项目阶段汇报初稿.docx", ext: "docx", type: "word", recentAt: "2026-09-03T14:20:00+08:00", timeText: "2026-09-03 14:20", permission: "可管理", library: "我的知识库", path: "我的知识库 / 工作材料 / 项目汇报", favorite: false, pinned: false, canDownload: true, canShare: true, editable: true },
    { id: "recent-08", name: "物资采购业务流程图.png", ext: "png", type: "image", recentAt: "2026-09-02T17:42:00+08:00", timeText: "2026-09-02 17:42", permission: "可查看", library: "公司知识库", path: "公司知识库 / 采购管理 / 标准流程 / 业务流程图", favorite: false, pinned: false, canDownload: true, canShare: false, editable: false },
    { id: "recent-09", name: "新员工业务培训视频.mp4", ext: "mp4", type: "video", recentAt: "2026-08-29T09:16:00+08:00", timeText: "2026-08-29 09:16", permission: "可查看", library: "部门知识库", path: "部门知识库 / 人力资源 / 新员工培训 / 业务课程", favorite: true, pinned: false, canDownload: false, canShare: true, editable: false },
    { id: "recent-10", name: "知识共享中心需求规格说明书V2.0.docx", ext: "docx", type: "word", recentAt: "2026-08-12T16:08:00+08:00", timeText: "2026-08-12 16:08", permission: "可编辑", library: "公司知识库", path: "公司知识库 / 数字化管理 / 项目文档 / 需求规格", favorite: false, pinned: false, canDownload: true, canShare: true, editable: true }
  ];
  var state = { loading: true, menuFileId: null, deleteFileId: null, copyFileId: null, feedbackFileId: null, detailFileId: null, downloading: new Set() };

  function byId(id) { return document.getElementById(id); }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }
  function rowById(id) { return files.find(function (file) { return file.id === id; }); }
  function absoluteTime(file) { return file.recentAt.replace("T", " ").slice(0, 19); }
  function typeMark(file) {
    return String(file.ext || "FILE").replace(/^\./, "").toUpperCase();
  }
  function shortPath(path) {
    var parts = path.split(" / ");
    return parts.length > 3 ? parts[0] + " / … / " + parts[parts.length - 1] : path;
  }
  function permissionClass(permission) {
    return permission === "可管理" ? "is-manage" : permission === "可编辑" ? "is-edit" : "is-view";
  }
  function fullExtension(file) { return file.ext.toUpperCase() + " 文件"; }

  function actionAvailability(file, action) {
    if (action === "download") return file.canDownload ? { allowed: true } : { allowed: false, reason: "该文件已被设置为禁止下载。" };
    if (action === "share") return file.canShare ? { allowed: true } : { allowed: false, reason: "该文件已被设置为禁止分享。" };
    if (action === "delete") {
      if (file.permission !== "可管理") return { allowed: false, reason: "当前权限不支持此操作。" };
      if (file.library !== "我的知识库") return { allowed: false, reason: "公共知识库文件不能在此处删除。" };
      return { allowed: true };
    }
    if (action === "edit") return file.permission === "可查看" ? { allowed: false, reason: "当前权限不支持此操作。" } : { allowed: true };
    if (action === "permission") return file.permission === "可管理" ? { allowed: true } : { allowed: false, reason: "当前权限不支持此操作。" };
    return { allowed: true };
  }

  function actionButton(file, action, label, danger) {
    var availability = actionAvailability(file, action);
    var loading = action === "download" && state.downloading.has(file.id);
    var disabled = !availability.allowed || loading;
    var text = loading ? '<span class="download-spinner" aria-hidden="true"></span>下载中' : escapeHtml(label);
    return '<button class="row-action' + (danger ? ' is-danger' : '') + '" type="button" data-row-action="' + action + '" data-id="' + file.id + '" aria-disabled="' + disabled + '"' + (disabled ? ' data-tooltip="' + escapeHtml(loading ? "文件正在下载，请稍候。" : availability.reason) + '"' : '') + '>' + text + '</button>';
  }

  function filteredFiles() {
    var query = byId("nameSearch").value.trim().toLocaleLowerCase("zh-CN");
    var permission = byId("permissionFilter").value;
    var location = byId("locationFilter").value;
    var time = byId("timeFilter").value;
    var cutoff = time ? new Date(referenceNow) : null;
    if (time === "today") cutoff.setHours(0, 0, 0, 0);
    if (time === "7" || time === "30") cutoff.setDate(cutoff.getDate() - Number(time));
    var result = files.filter(function (file) {
      return (!query || file.name.toLocaleLowerCase("zh-CN").includes(query)) && (!permission || file.permission === permission) && (!location || file.library === location) && (!cutoff || new Date(file.recentAt) >= cutoff);
    });
    var sort = byId("sortSelect").value;
    result.sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.pinned && b.pinned) return new Date(b.recentAt) - new Date(a.recentAt);
      if (sort === "oldest") return new Date(a.recentAt) - new Date(b.recentAt);
      if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
      return new Date(b.recentAt) - new Date(a.recentAt);
    });
    return result;
  }

  function renderTable() {
    if (state.loading) return;
    closeMoreMenu();
    var visible = filteredFiles();
    var hasFilters = Boolean(byId("nameSearch").value.trim() || byId("permissionFilter").value || byId("locationFilter").value || byId("timeFilter").value || byId("sortSelect").value !== "newest");
    byId("clearFiltersTop").hidden = !hasFilters;
    byId("resultSummary").textContent = "共 " + visible.length + " 个文件" + (files.some(function (file) { return file.pinned; }) ? "，置顶文件优先显示" : "");
    byId("tableRegion").hidden = visible.length === 0;
    byId("emptyState").hidden = visible.length !== 0;
    if (!visible.length) {
      var noRecords = files.length === 0;
      byId("emptyTitle").textContent = noRecords ? "暂无最近使用的文件" : "没有找到符合条件的文件";
      byId("emptyDescription").textContent = noRecords ? "你近期查看、编辑或下载过的文件将在这里展示。" : "请尝试修改搜索内容或筛选条件。";
      byId("clearFiltersButton").hidden = noRecords || !hasFilters;
      return;
    }
    byId("fileTableBody").innerHTML = visible.map(function (file) {
      return '<tr data-file-row="' + file.id + '"><td><div class="file-name-cell"><span class="file-type-icon is-' + file.type + '">' + typeMark(file) + '</span><span class="file-title-wrap"><button class="file-name-button" type="button" data-open-file="' + file.id + '" title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</button>' + (file.pinned ? '<span class="pinned-mark">置顶</span>' : '') + '</span></div></td><td><span class="time-text" title="' + escapeHtml(absoluteTime(file)) + '">' + escapeHtml(file.timeText) + '</span></td><td><span class="permission-tag ' + permissionClass(file.permission) + '">' + file.permission + '</span></td><td><button class="location-button" type="button" data-open-location="' + file.id + '" title="' + escapeHtml(file.path) + '">' + escapeHtml(shortPath(file.path)) + '</button></td><td><div class="row-actions">' + actionButton(file, "download", "下载") + actionButton(file, "share", "分享") + actionButton(file, "delete", "删除", true) + '<button class="more-trigger" type="button" data-more="' + file.id + '" aria-haspopup="menu" aria-expanded="false" title="更多操作" aria-label="' + escapeHtml(file.name) + '的更多操作">' + window.BompIcons.create("moreHorizontal", { size: 18 }) + '</button></div></td></tr>';
    }).join("");
  }

  function moreItem(file, action, label, icon) {
    var availability = actionAvailability(file, action);
    return '<button type="button" role="menuitem" data-menu-action="' + action + '" data-id="' + file.id + '" aria-disabled="' + (!availability.allowed) + '"' + (!availability.allowed ? ' data-tooltip="' + escapeHtml(availability.reason) + '"' : '') + '>' + window.BompIcons.create(icon, { size: 16 }) + '<span>' + escapeHtml(label) + '</span></button>';
  }

  function openMoreMenu(button, file) {
    closeMoreMenu();
    state.menuFileId = file.id;
    var menu = byId("moreMenu");
    menu.innerHTML = moreItem(file, "edit", "编辑", "filePenLine") + moreItem(file, "favorite", file.favorite ? "取消收藏" : "收藏", "star") + moreItem(file, "pin", file.pinned ? "取消置顶" : "置顶", "pin") + moreItem(file, "copy", "创建副本", "copy") + moreItem(file, "permission", "权限管理", "lock") + moreItem(file, "feedback", "反馈", "messageSquare");
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    var rect = button.getBoundingClientRect();
    var menuRect = menu.getBoundingClientRect();
    var top = rect.bottom + 5;
    if (top + menuRect.height > window.innerHeight - 8) top = rect.top - menuRect.height - 5;
    menu.style.top = Math.max(8, top) + "px";
    menu.style.left = Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, rect.right - menuRect.width)) + "px";
    var first = menu.querySelector("button");
    if (first) first.focus();
  }

  function closeMoreMenu() {
    var menu = byId("moreMenu");
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    document.querySelectorAll(".more-trigger[aria-expanded=\"true\"]").forEach(function (button) { button.setAttribute("aria-expanded", "false"); });
    state.menuFileId = null;
  }

  function clearFilters() {
    byId("filterForm").reset();
    renderTable();
  }

  function startDownload(file) {
    state.downloading.add(file.id);
    renderTable();
    window.setTimeout(function () {
      state.downloading.delete(file.id);
      renderTable();
      window.BompPrototype.showToast("文件下载完成。");
    }, 850);
  }

  function openDetail(file, editing) {
    state.detailFileId = file.id;
    byId("listView").hidden = true;
    byId("detailView").hidden = false;
    byId("detailTitle").textContent = file.name;
    byId("previewTitle").textContent = file.name.replace(/\.[^.]+$/, "");
    byId("detailPath").textContent = file.path;
    byId("detailPath").title = file.path;
    byId("detailMeta").textContent = "最近使用：" + file.timeText;
    byId("detailPermission").textContent = file.permission;
    byId("detailTime").textContent = absoluteTime(file);
    byId("detailLocation").textContent = file.path;
    byId("detailExtension").textContent = fullExtension(file);
    byId("detailTypeIcon").className = "file-type-icon is-" + file.type;
    byId("detailTypeIcon").textContent = typeMark(file);
    byId("detailModeTag").textContent = editing ? "在线编辑" : "文件预览";
    byId("documentPreview").classList.toggle("is-editing", Boolean(editing));
    var editAvailability = actionAvailability(file, "edit");
    byId("detailEdit").hidden = !editAvailability.allowed;
    window.scrollTo(0, 0);
  }

  function openLocation(file) {
    var lastFolder = file.path.split(" / ").pop();
    window.location.href = "search-results.html?mode=knowledge&scope=" + encodeURIComponent(file.library) + "&q=" + encodeURIComponent(lastFolder);
  }

  function executeAction(file, action) {
    if (action === "download" && state.downloading.has(file.id)) return;
    var availability = actionAvailability(file, action);
    if (!availability.allowed) { window.BompPrototype.showToast(availability.reason); return; }
    if (action === "download") { startDownload(file); return; }
    if (action === "share") { byId("fileActionDialogs").openShare(file); return; }
    if (action === "delete") {
      state.deleteFileId = file.id;
      byId("deleteFileName").textContent = file.name;
      window.BompPrototype.openModal("deleteModal");
      return;
    }
    if (action === "edit") {
      if (!file.editable) { window.BompPrototype.showToast("该文件格式暂不支持在线编辑，可下载后修改。"); return; }
      openDetail(file, true);
      return;
    }
    if (action === "favorite") {
      file.favorite = !file.favorite;
      renderTable();
      window.BompPrototype.showToast(file.favorite ? "已添加到我的收藏。" : "已取消收藏。");
      return;
    }
    if (action === "pin") {
      file.pinned = !file.pinned;
      renderTable();
      window.BompPrototype.showToast(file.pinned ? "文件已置顶" : "已取消置顶");
      return;
    }
    if (action === "copy") {
      state.copyFileId = file.id;
      var index = file.name.lastIndexOf(".");
      byId("copyName").value = (index > 0 ? file.name.slice(0, index) : file.name) + "-副本" + (index > 0 ? file.name.slice(index) : "");
      byId("copyLocation").value = "我的知识库";
      window.BompPrototype.openModal("copyModal");
      return;
    }
    if (action === "permission") { byId("fileActionDialogs").openPermission(file); return; }
    if (action === "feedback") {
      state.feedbackFileId = file.id;
      byId("feedbackFileName").textContent = file.name;
      byId("feedbackDescription").value = "";
      byId("remainingCount").textContent = "500";
      byId("feedbackError").textContent = "";
      window.BompPrototype.openModal("feedbackModal");
    }
  }

  function refreshList() {
    state.loading = true;
    closeMoreMenu();
    byId("refreshButton").classList.add("is-loading");
    byId("refreshButton").setAttribute("aria-disabled", "true");
    byId("resultSummary").textContent = "正在加载最近使用文件";
    byId("loadingState").hidden = false;
    byId("tableRegion").hidden = true;
    byId("emptyState").hidden = true;
    window.setTimeout(function () {
      state.loading = false;
      byId("loadingState").hidden = true;
      byId("refreshButton").classList.remove("is-loading");
      byId("refreshButton").setAttribute("aria-disabled", "false");
      renderTable();
    }, 560);
  }

  window.BompPrototype.initShell({ active: "recent-use", routes: { "recent-use": "recent-use.html" } });

  byId("filterForm").addEventListener("submit", function (event) { event.preventDefault(); renderTable(); });
  byId("nameSearch").addEventListener("input", renderTable);
  ["permissionFilter", "locationFilter", "timeFilter", "sortSelect"].forEach(function (id) { byId(id).addEventListener("change", renderTable); });
  byId("clearFiltersButton").addEventListener("click", clearFilters);
  byId("clearFiltersTop").addEventListener("click", clearFilters);
  byId("refreshButton").addEventListener("click", function () { if (!state.loading) refreshList(); });

  byId("fileTableBody").addEventListener("click", function (event) {
    var openButton = event.target.closest("[data-open-file]");
    if (openButton) { openDetail(rowById(openButton.dataset.openFile), false); return; }
    var locationButton = event.target.closest("[data-open-location]");
    if (locationButton) { openLocation(rowById(locationButton.dataset.openLocation)); return; }
    var moreButton = event.target.closest("[data-more]");
    if (moreButton) {
      var file = rowById(moreButton.dataset.more);
      if (state.menuFileId === file.id) closeMoreMenu(); else openMoreMenu(moreButton, file);
      return;
    }
    var actionButtonElement = event.target.closest("[data-row-action]");
    if (actionButtonElement) executeAction(rowById(actionButtonElement.dataset.id), actionButtonElement.dataset.rowAction);
  });

  byId("moreMenu").addEventListener("click", function (event) {
    var button = event.target.closest("[data-menu-action]");
    if (!button) return;
    var file = rowById(button.dataset.id);
    var action = button.dataset.menuAction;
    closeMoreMenu();
    executeAction(file, action);
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("#moreMenu") && !event.target.closest("[data-more]")) closeMoreMenu();
  });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMoreMenu(); });
  window.addEventListener("resize", closeMoreMenu);
  window.addEventListener("scroll", closeMoreMenu, true);

  byId("confirmDeleteButton").addEventListener("click", function () {
    var index = files.findIndex(function (file) { return file.id === state.deleteFileId; });
    if (index >= 0) files.splice(index, 1);
    window.BompPrototype.closeModal(byId("deleteModal"));
    state.deleteFileId = null;
    renderTable();
    window.BompPrototype.showToast("文件已移入回收站。");
  });

  byId("confirmCopyButton").addEventListener("click", function () {
    var source = rowById(state.copyFileId);
    var name = byId("copyName").value.trim();
    if (!name) { byId("copyName").focus(); return; }
    var location = byId("copyLocation").value;
    files.push({ id: "recent-copy-" + Date.now(), name: name, ext: name.includes(".") ? name.split(".").pop().toLowerCase() : source.ext, type: source.type, recentAt: "2026-09-07T10:20:30+08:00", timeText: "刚刚", permission: "可管理", library: "我的知识库", path: location, favorite: false, pinned: false, canDownload: true, canShare: true, editable: source.editable });
    window.BompPrototype.closeModal(byId("copyModal"));
    state.copyFileId = null;
    byId("sortSelect").value = "newest";
    renderTable();
    window.BompPrototype.showToast("副本已创建并保存至我的知识库。");
  });

  byId("feedbackDescription").addEventListener("input", function (event) {
    byId("remainingCount").textContent = String(500 - event.target.value.length);
    if (event.target.value.trim()) byId("feedbackError").textContent = "";
  });
  byId("submitFeedbackButton").addEventListener("click", function () {
    if (!byId("feedbackDescription").value.trim()) {
      byId("feedbackError").textContent = "请填写问题描述。";
      byId("feedbackDescription").focus();
      return;
    }
    window.BompPrototype.closeModal(byId("feedbackModal"));
    state.feedbackFileId = null;
    window.BompPrototype.showToast("反馈已提交，我们会尽快处理。");
  });

  byId("fileActionDialogs").addEventListener("share-success", function () { window.BompPrototype.showToast("分享链接已生成。"); });
  byId("fileActionDialogs").addEventListener("share-link-copied", function () { window.BompPrototype.showToast("分享链接已复制。"); });
  byId("fileActionDialogs").addEventListener("permission-saved", function () { window.BompPrototype.showToast("权限设置已保存。"); });

  byId("backButton").addEventListener("click", function () {
    byId("detailView").hidden = true;
    byId("listView").hidden = false;
    state.detailFileId = null;
    window.scrollTo(0, 0);
  });
  byId("detailDownload").addEventListener("click", function () {
    var file = rowById(state.detailFileId);
    var availability = actionAvailability(file, "download");
    if (!availability.allowed) window.BompPrototype.showToast(availability.reason); else startDownload(file);
  });
  byId("detailEdit").addEventListener("click", function () {
    var file = rowById(state.detailFileId);
    if (!file.editable) { window.BompPrototype.showToast("该文件格式暂不支持在线编辑，可下载后修改。"); return; }
    byId("detailModeTag").textContent = "在线编辑";
    byId("documentPreview").classList.add("is-editing");
    window.BompPrototype.showToast("已进入在线编辑页面。");
  });

  refreshList();
})();
