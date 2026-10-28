(function () {
  "use strict";

  var root = document.getElementById("suiteRoot");
  if (!root) return;

  var tags = [
    { id: "level-company", name: "公司级", family: "层级标签", mode: "单选", count: 286, owner: "系统管理员", status: "启用", updated: "2026-10-18 16:20", description: "公司可共享知识，由综合管理部统一维护。" },
    { id: "level-department", name: "部门级", family: "层级标签", mode: "单选", count: 143, owner: "系统管理员", status: "启用", updated: "2026-10-18 16:20", description: "部门专业知识，由业务部门维护。" },
    { id: "level-personal", name: "个人级", family: "层级标签", mode: "单选", count: 42, owner: "系统管理员", status: "启用", updated: "2026-10-18 16:20", description: "个人工作资料，仅创建人默认可见。" },
    { id: "professional-supply", name: "供应链业务类", family: "专业标签", mode: "多选", count: 168, owner: "综合管理部", status: "启用", updated: "2026-10-17 10:08", description: "覆盖计划、需求、采购、库存和供应商管理等业务。" },
    { id: "professional-plan", name: "计划管理", family: "专业标签", mode: "多选", count: 74, owner: "供应链运营中心", status: "启用", updated: "2026-10-16 15:41", description: "年度计划、采购计划和重点任务计划相关知识。" },
    { id: "professional-data", name: "数据标准管理", family: "专业标签", mode: "多选", count: 51, owner: "数字化管理部", status: "启用", updated: "2026-10-14 09:32", description: "数据标准、数据质量和数据治理相关知识。" },
    { id: "type-policy", name: "制度规范类", family: "知识类型标签", mode: "多选", count: 216, owner: "系统管理员", status: "启用", updated: "2026-10-12 11:26", description: "管理办法、实施细则、工作规则和制度规范。" },
    { id: "type-template", name: "模板范本类", family: "知识类型标签", mode: "多选", count: 102, owner: "系统管理员", status: "启用", updated: "2026-10-12 11:26", description: "业务模板、合同范本、表单和标准化工具。" },
    { id: "type-case", name: "方案案例类", family: "知识类型标签", mode: "多选", count: 89, owner: "系统管理员", status: "启用", updated: "2026-10-12 11:26", description: "建设方案、实施案例、优秀实践和复盘材料。" },
    { id: "type-report", name: "报告汇报类", family: "知识类型标签", mode: "多选", count: 126, owner: "系统管理员", status: "启用", updated: "2026-10-12 11:26", description: "分析报告、阶段总结、专题汇报和工作简报。" },
    { id: "type-training", name: "培训宣贯类", family: "知识类型标签", mode: "多选", count: 48, owner: "人力资源部", status: "启用", updated: "2026-10-11 14:10", description: "培训课件、宣贯材料、课程录像和学习手册。" },
    { id: "type-risk", name: "风险合规类", family: "知识类型标签", mode: "多选", count: 67, owner: "法律事务部", status: "启用", updated: "2026-10-10 17:25", description: "法律合规、保密审查、风险识别和控制措施。" },
    { id: "version-current", name: "当前版本", family: "版本标签", mode: "单选", count: 312, owner: "系统管理员", status: "启用", updated: "2026-10-08 10:00", description: "标志知识当前有效版本。" },
    { id: "version-history", name: "历史版本", family: "版本标签", mode: "单选", count: 38, owner: "系统管理员", status: "停用", updated: "2026-09-28 16:42", description: "保存历史版本并支持版本追溯与查询。" }
  ];

  var state = { family: "", status: "", query: "", page: 1, pageSize: 8, editId: null, pendingId: null, confirmAction: "" };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function icon(name, size) {
    return window.BompIcons.create(name, { size: size || 18 });
  }

  function toast(message) {
    var element = document.getElementById("tagToast");
    if (!element) {
      element = document.createElement("div");
      element.id = "tagToast";
      element.className = "toast-success";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.hidden = false;
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(function () { element.hidden = true; }, 2000);
  }

  function familyIcon(family) {
    if (family === "层级标签") return "network";
    if (family === "专业标签") return "briefcaseBusiness";
    if (family === "知识类型标签") return "fileText";
    return "gitBranch";
  }

  function statusMarkup(status) {
    var className = status === "启用" ? "tag-status--enabled" : status === "停用" ? "tag-status--disabled" : "tag-status--pending";
    return '<span class="tag-status ' + className + '">' + esc(status) + "</span>";
  }

  function tableRows(items) {
    if (!items.length) return '<tr><td colspan="6"><div class="tag-empty">未找到符合条件的标签，请调整筛选或搜索关键词。</div></td></tr>';
    return items.map(function (item) {
      var canDelete = item.count === 0;
      var toggleText = item.status === "启用" ? "停用" : "启用";
      return '<tr data-tag-id="' + esc(item.id) + '">' +
        '<td><div class="tag-name-cell"><span class="tag-name-cell__mark" aria-hidden="true">' + icon(familyIcon(item.family), 16) + '</span><strong title="' + esc(item.name) + '">' + esc(item.name) + '</strong></div></td>' +
        '<td>' + esc(item.family) + '</td>' +
        '<td><span class="tag-mode ' + (item.mode === "单选" ? "tag-mode--single" : "tag-mode--multiple") + '">' + esc(item.mode) + '</span></td>' +
        '<td><span class="tag-count" title="' + esc(item.count + " 个知识文件") + '">' + esc(item.count) + " 个</span></td>" +
        '<td>' + statusMarkup(item.status) + '</td>' +
        '<td><div class="tag-actions"><button class="tag-action" type="button" data-tag-edit="' + esc(item.id) + '">编辑</button><button class="tag-action" type="button" data-tag-toggle="' + esc(item.id) + '">' + toggleText + '</button><button class="tag-action tag-action--danger" type="button" data-tag-delete="' + esc(item.id) + '"' + (canDelete ? "" : ' disabled title="该标签仍关联知识文件，解除关联后才可删除"') + '>删除</button></div></td>' +
        '</tr>';
    }).join("");
  }

  function filteredTags() {
    var query = state.query.toLowerCase();
    return tags.filter(function (item) {
      return (!state.family || item.family === state.family) && (!state.status || item.status === state.status) && (!query || [item.name, item.family, item.owner, item.description].join(" ").toLowerCase().indexOf(query) >= 0);
    });
  }

  function render() {
    var filtered = filteredTags();
    var totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    var visible = filtered.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    root.innerHTML = '<section class="tag-page">' +
      '<header class="tag-page-header"><div class="tag-page-heading"><h1>标签管理</h1><p>统一维护层级、专业、知识类型和版本标签，保障知识标引口径一致。</p></div><button class="btn btn-primary" type="button" data-tag-add>' + icon("plus", 16) + '新增标签</button></header>' +
      '<div class="tag-content">' +
      '<section class="tag-overview" aria-label="标签类别概览">' + overviewCard("level", "层级标签", "单选", tags.filter(function (item) { return item.family === "层级标签"; }).length) + overviewCard("professional", "专业标签", "多选", tags.filter(function (item) { return item.family === "专业标签"; }).length) + overviewCard("type", "知识类型标签", "多选", tags.filter(function (item) { return item.family === "知识类型标签"; }).length) + overviewCard("version", "版本标签", "单选", tags.filter(function (item) { return item.family === "版本标签"; }).length) + '</section>' +
      '<section aria-labelledby="tagListHeading"><div class="tag-filter-bar"><div class="tag-filter-group"><span id="tagListHeading" class="visually-hidden">标签列表</span>' + filterSelect("标签类别", "family", ["层级标签", "专业标签", "知识类型标签", "版本标签"]) + filterSelect("状态", "status", ["启用", "停用", "待管理员审批"]) + '<span class="help-text">共 ' + filtered.length + ' 个标签</span></div><div class="tag-filter-actions"><label class="tag-search"><span class="visually-hidden">搜索标签</span><input type="search" value="' + esc(state.query) + '" data-tag-search placeholder="搜索标签名称、说明或维护人"><button type="button" data-tag-search-button aria-label="搜索标签">' + icon("search", 17) + '</button></label></div></div>' +
      '<div class="tag-table-wrap"><table class="tag-table"><colgroup><col class="col-name"><col class="col-family"><col class="col-mode"><col class="col-count"><col class="col-status"><col class="col-actions"></colgroup><thead><tr><th>标签名称</th><th>标签类别</th><th>选择方式</th><th>关联知识</th><th>状态</th><th>操作</th></tr></thead><tbody>' + tableRows(visible) + '</tbody></table><div class="tag-pager"><span>第 ' + state.page + ' / ' + totalPages + ' 页</span><button type="button" data-tag-page="prev" aria-label="上一页"' + (state.page <= 1 ? " disabled" : "") + '>' + icon("chevronLeft", 15) + '</button>' + Array.from({ length: totalPages }, function (_, index) { return '<button type="button" class="' + (state.page === index + 1 ? "is-current" : "") + '" data-tag-page="' + (index + 1) + '" aria-label="第 ' + (index + 1) + ' 页">' + (index + 1) + '</button>'; }).join("") + '<button type="button" data-tag-page="next" aria-label="下一页"' + (state.page >= totalPages ? " disabled" : "") + '>' + icon("chevronRight", 15) + '</button></div></div></section></div></section>' + modals();
  }

  function overviewCard(type, title, mode, count) {
    var iconName = type === "level" ? "network" : type === "professional" ? "briefcaseBusiness" : type === "type" ? "fileText" : "gitBranch";
    return '<article class="tag-overview-card tag-overview-card--' + type + '"><span class="tag-overview-card__icon">' + icon(iconName, 22) + '</span><div><span>' + title + ' · ' + mode + '</span><strong>' + count + ' 个</strong></div></article>';
  }

  function filterSelect(label, key, options) {
    var value = state[key];
    return '<label class="tag-filter-select' + (value ? " is-active" : "") + '"><span class="tag-filter-select__display">' + esc(value ? label + "：" + value : label) + '</span>' + icon("chevronDown", 14) + '<select data-tag-filter="' + key + '" aria-label="' + esc(label) + '"><option value="">' + esc(label) + '</option>' + options.map(function (option) { return '<option value="' + esc(option) + '"' + (value === option ? " selected" : "") + '>' + esc(option) + '</option>'; }).join("") + '</select></label>';
  }

  function modals() {
    return '<div class="modal-mask tag-modal" id="tagEditModal" hidden><section class="modal modal-medium" role="dialog" aria-modal="true" aria-labelledby="tagEditTitle"><header class="modal-header modal-title-row"><div><h2 class="modal-heading" id="tagEditTitle">新增标签</h2><p id="tagEditSubtitle">新标签需提交系统管理员审批后生效</p></div><button class="page-icon-button" type="button" data-tag-close aria-label="关闭弹窗">' + icon("x", 18) + '</button></header><form class="modal-body tag-form" id="tagForm"><div class="tag-form-row"><label class="is-required" for="tagName">标签名称</label><input class="tag-form-control" id="tagName" name="name" maxlength="30" required placeholder="请输入标签名称"></div><div class="tag-form-row"><label class="is-required" for="tagFamily">标签类别</label><select class="tag-form-control" id="tagFamily" name="family" required><option value="专业标签">专业标签</option><option value="层级标签">层级标签</option><option value="知识类型标签">知识类型标签</option><option value="版本标签">版本标签</option></select></div><div class="tag-form-row"><span class="tag-form-label">选择方式</span><div class="tag-choice-list"><label><input type="radio" name="mode" value="单选" checked> 单选</label><label><input type="radio" name="mode" value="多选"> 多选</label></div></div><div class="tag-form-row"><label for="tagParent">上级标签</label><select class="tag-form-control" id="tagParent" name="parent"><option value="">不设置上级标签</option><option>供应链业务类</option><option>职能管理类</option><option>制度规范类</option><option>方案案例类</option></select></div><div class="tag-form-row"><label for="tagDescription">标签说明</label><textarea class="tag-form-control" id="tagDescription" name="description" maxlength="120" placeholder="说明标签适用范围和维护边界"></textarea></div><p class="tag-form-help">标签名称在同一标签类别内不能重复；选择方式将影响知识上传时的标引规则。</p><div class="tag-approval-note">' + icon("clipboardCheck", 16) + '<span><strong>提交对象：系统管理员</strong><br>新增标签不会立即生效，管理员审核通过后才会进入可选标签。</span></div><p class="tag-form-error" id="tagFormError" role="alert" hidden></p><footer class="modal-footer"><button class="btn" type="button" data-tag-close>取消</button><button class="btn btn-primary" type="submit" id="tagSaveButton">提交管理员审批</button></footer></form></section></div>' +
      '<div class="modal-mask tag-confirm" id="tagConfirmModal" hidden><section class="modal modal-small" role="dialog" aria-modal="true" aria-labelledby="tagConfirmTitle"><header class="modal-header modal-title-row"><h2 class="modal-heading" id="tagConfirmTitle">确认操作</h2><button class="page-icon-button" type="button" data-tag-confirm-close aria-label="关闭弹窗">' + icon("x", 18) + '</button></header><div class="modal-body"><p class="tag-confirm-message" id="tagConfirmMessage"></p><div class="tag-confirm-warning" id="tagConfirmWarning" hidden>' + icon("circleAlert", 16) + '<span>停用后已有知识仍保留该标签，但新知识不能再选择它；如需恢复可执行启用。</span></div></div><footer class="modal-footer"><button class="btn" type="button" data-tag-confirm-close>取消</button><button class="btn btn-danger-outline" type="button" id="tagConfirmAction">确认操作</button></footer></section></div>' +
      '<aside class="tag-drawer" id="tagDetailDrawer" hidden><section class="tag-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="tagDetailTitle"><header class="tag-drawer-header"><div><h2 id="tagDetailTitle">标签详情</h2><p id="tagDetailSubtitle">查看标签定义与关联范围</p></div><button class="page-icon-button" type="button" data-tag-detail-close aria-label="关闭详情">' + icon("x", 18) + '</button></header><section class="tag-drawer-section"><h3>标签定义</h3><dl class="tag-drawer-meta"><dt>标签名称</dt><dd id="tagDetailName"></dd><dt>标签类别</dt><dd id="tagDetailFamily"></dd><dt>选择方式</dt><dd id="tagDetailMode"></dd><dt>标签说明</dt><dd id="tagDetailDescription"></dd></dl></section><section class="tag-drawer-section"><h3>使用情况</h3><dl class="tag-drawer-meta"><dt>关联知识文件</dt><dd id="tagDetailCount"></dd><dt>维护对象</dt><dd id="tagDetailOwner"></dd><dt>最近更新</dt><dd id="tagDetailUpdated"></dd><dt>当前状态</dt><dd id="tagDetailStatus"></dd></dl></section><footer class="tag-drawer-footer"><button class="btn" type="button" data-tag-detail-close>关闭</button><button class="btn btn-primary" type="button" data-tag-detail-edit>编辑标签</button></footer></section></aside>';
  }

  function openEdit(id) {
    var item = id ? tags.find(function (tag) { return tag.id === id; }) : null;
    state.editId = id || null;
    var modal = document.getElementById("tagEditModal");
    var form = document.getElementById("tagForm");
    form.reset();
    document.getElementById("tagEditTitle").textContent = item ? "编辑标签" : "新增标签";
    document.getElementById("tagEditSubtitle").textContent = item ? "修改标签信息前请确认其关联知识范围" : "新标签需提交系统管理员审批后生效";
    document.getElementById("tagSaveButton").textContent = item ? "保存修改" : "提交管理员审批";
    if (item) {
      form.elements.name.value = item.name;
      form.elements.family.value = item.family;
      form.elements.mode.value = item.mode;
      form.elements.description.value = item.description;
      document.getElementById("tagParent").value = item.family === "专业标签" ? "供应链业务类" : "";
    }
    document.getElementById("tagFormError").hidden = true;
    modal.hidden = false;
    document.getElementById("tagName").focus();
  }

  function closeEdit() {
    document.getElementById("tagEditModal").hidden = true;
    state.editId = null;
  }

  function openConfirm(id, action) {
    var item = tags.find(function (tag) { return tag.id === id; });
    if (!item) return;
    state.pendingId = id;
    state.confirmAction = action;
    var message = document.getElementById("tagConfirmMessage");
    var warning = document.getElementById("tagConfirmWarning");
    var button = document.getElementById("tagConfirmAction");
    document.getElementById("tagConfirmTitle").textContent = action === "delete" ? "删除标签" : (item.status === "启用" ? "停用标签" : "启用标签");
    if (action === "delete") {
      message.innerHTML = '确定删除标签“<strong>' + esc(item.name) + '</strong>”吗？<br>该标签当前关联知识：<strong>0 个</strong>。删除后不可恢复。';
      warning.hidden = true;
      button.textContent = "确认删除";
      button.className = "btn btn-danger-outline";
    } else if (item.status === "启用") {
      message.innerHTML = '确定停用标签“<strong>' + esc(item.name) + '</strong>”吗？<br>当前关联知识：<strong>' + esc(item.count) + ' 个</strong>。';
      warning.hidden = false;
      button.textContent = "确认停用";
      button.className = "btn btn-danger-outline";
    } else {
      message.innerHTML = '确定重新启用标签“<strong>' + esc(item.name) + '</strong>”吗？';
      warning.hidden = true;
      button.textContent = "确认启用";
      button.className = "btn btn-primary";
    }
    document.getElementById("tagConfirmModal").hidden = false;
    button.focus();
  }

  function closeConfirm() {
    document.getElementById("tagConfirmModal").hidden = true;
    state.pendingId = null;
    state.confirmAction = "";
  }

  function openDetail(id) {
    var item = tags.find(function (tag) { return tag.id === id; });
    if (!item) return;
    state.pendingId = id;
    document.getElementById("tagDetailName").textContent = item.name;
    document.getElementById("tagDetailFamily").textContent = item.family;
    document.getElementById("tagDetailMode").textContent = item.mode;
    document.getElementById("tagDetailDescription").textContent = item.description;
    document.getElementById("tagDetailCount").textContent = item.count + " 个知识文件";
    document.getElementById("tagDetailOwner").textContent = item.owner;
    document.getElementById("tagDetailUpdated").textContent = item.updated;
    document.getElementById("tagDetailStatus").innerHTML = statusMarkup(item.status);
    document.getElementById("tagDetailDrawer").hidden = false;
    document.querySelector("[data-tag-detail-edit]").focus();
  }

  function closeDetail() {
    document.getElementById("tagDetailDrawer").hidden = true;
    state.pendingId = null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var name = form.elements.name.value.trim();
    var family = form.elements.family.value;
    var duplicate = tags.some(function (tag) { return tag.name === name && tag.family === family && tag.id !== state.editId; });
    var error = document.getElementById("tagFormError");
    if (!name) { error.textContent = "请输入标签名称"; error.hidden = false; form.elements.name.focus(); return; }
    if (duplicate) { error.textContent = "同一标签类别下已存在同名标签，请修改名称"; error.hidden = false; form.elements.name.focus(); return; }
    if (state.editId) {
      var target = tags.find(function (tag) { return tag.id === state.editId; });
      target.name = name;
      target.family = family;
      target.mode = form.elements.mode.value;
      target.description = form.elements.description.value.trim() || "暂无说明";
      target.updated = "2026-10-22 10:30";
      closeEdit();
      render();
      toast("标签修改已保存");
    } else {
      tags.unshift({ id: "pending-" + Date.now(), name: name, family: family, mode: form.elements.mode.value, count: 0, owner: "待系统管理员审批", status: "待管理员审批", updated: "2026-10-22 10:30", description: form.elements.description.value.trim() || "新增标签，待管理员补充说明。" });
      closeEdit();
      state.family = "";
      state.status = "";
      state.query = "";
      state.page = 1;
      render();
      toast("已提交系统管理员审批");
    }
  }

  function bind() {
    root.addEventListener("click", function (event) {
      var add = event.target.closest("[data-tag-add]");
      if (add) { openEdit(); return; }
      var edit = event.target.closest("[data-tag-edit]");
      if (edit) { openEdit(edit.dataset.tagEdit); return; }
      var toggle = event.target.closest("[data-tag-toggle]");
      if (toggle) { openConfirm(toggle.dataset.tagToggle, "toggle"); return; }
      var remove = event.target.closest("[data-tag-delete]");
      if (remove && !remove.disabled) { openConfirm(remove.dataset.tagDelete, "delete"); return; }
      var row = event.target.closest("tbody tr[data-tag-id]");
      if (row && !event.target.closest("button")) { openDetail(row.dataset.tagId); return; }
      var pageButton = event.target.closest("[data-tag-page]");
      if (pageButton && !pageButton.disabled) { var next = pageButton.dataset.tagPage; state.page = next === "prev" ? state.page - 1 : next === "next" ? state.page + 1 : Number(next); render(); return; }
    });

    root.addEventListener("change", function (event) {
      var select = event.target.closest("[data-tag-filter]");
      if (select) { state[select.dataset.tagFilter] = select.value; state.page = 1; render(); }
    });

    root.addEventListener("input", function (event) {
      if (event.target.matches("[data-tag-search]")) { state.query = event.target.value.trim(); state.page = 1; render(); var input = root.querySelector("[data-tag-search]"); if (input) { input.focus(); input.setSelectionRange(state.query.length, state.query.length); } }
    });

    root.addEventListener("submit", function (event) { if (event.target.id === "tagForm") handleSubmit(event); });

    root.addEventListener("click", function (event) {
      var closeEditButton = event.target.closest("[data-tag-close]");
      if (closeEditButton || event.target.id === "tagEditModal") closeEdit();
      var closeConfirmButton = event.target.closest("[data-tag-confirm-close]");
      if (closeConfirmButton || event.target.id === "tagConfirmModal") closeConfirm();
      var closeDetailButton = event.target.closest("[data-tag-detail-close]");
      if (closeDetailButton || event.target.id === "tagDetailDrawer") closeDetail();
      var detailEdit = event.target.closest("[data-tag-detail-edit]");
      if (detailEdit) { var id = state.pendingId; closeDetail(); openEdit(id); }
      if (event.target.id === "tagConfirmAction") {
        var item = tags.find(function (tag) { return tag.id === state.pendingId; });
        if (!item) return;
        if (state.confirmAction === "delete") { tags = tags.filter(function (tag) { return tag.id !== item.id; }); closeConfirm(); render(); toast("标签已删除"); }
        else { item.status = item.status === "启用" ? "停用" : "启用"; closeConfirm(); render(); toast(item.status === "启用" ? "标签已启用" : "标签已停用"); }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!document.getElementById("tagEditModal").hidden) closeEdit();
      if (!document.getElementById("tagConfirmModal").hidden) closeConfirm();
      if (!document.getElementById("tagDetailDrawer").hidden) closeDetail();
    });

    var sidebar = document.getElementById("appSidebar");
    if (sidebar) sidebar.addEventListener("navigation-change", function (event) {
      var routes = { "tag-management": "tag-management.html", home: "home.html", "department-library-management": "library-management.html", "professional-directory-management": "directory-management.html", "company-library-management": "company-library-management.html", "my-info": "my-info.html", "my-approvals": "my-approvals.html", "my-sharing": "my-sharing.html", "my-uploads": "my-uploads.html", "my-recycle": "my-recycle-bin.html", "review-workbench": "review-workbench.html", "my-library": "my-library.html" };
      if (routes[event.detail.key]) window.location.href = routes[event.detail.key];
    });
  }

  render();
  bind();
})();
