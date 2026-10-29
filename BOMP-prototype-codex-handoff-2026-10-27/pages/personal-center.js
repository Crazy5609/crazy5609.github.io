(function () {
  var recentFiles = [
    { id: "WZ-2026-CG-0012", title: "2026年度采购工作方案", format: "word", path: "我的知识 / 项目资料", action: "编辑", time: "10分钟前", type: "工作方案", category: "项目资料", version: "V1.3", size: "1.8 MB" },
    { id: "WZ-2026-HB-0008", title: "知识共享中心阶段汇报材料", format: "ppt", path: "我的知识 / 汇报材料", action: "浏览", time: "昨天", type: "汇报材料", category: "汇报材料", version: "V2.0", size: "6.2 MB" },
    { id: "WZ-2024-ZD-0018", title: "《部门采购管理规范（2024版）》", format: "word", path: "我的收藏 / 制度规范", action: "下载", time: "8月31日", type: "管理制度", category: "制度规范", version: "V3.0", size: "2.4 MB" },
    { id: "WZ-2026-XM-0035", title: "企业经营管理系统项目建设任务书", format: "word", path: "我的协作 / 项目资料", action: "编辑", time: "8月30日", type: "任务书", category: "项目资料", version: "V1.2", size: "980 KB" },
    { id: "WZ-2025-HT-0012", title: "《物资采购合同示范文本（2025年修订版）》", format: "word", path: "我的收藏 / 合同范本", action: "浏览", time: "8月29日", type: "合同范本", category: "合同范本", version: "V2.0", size: "1.6 MB" },
    { id: "WZ-2026-GY-0024", title: "供应商履约评价操作手册", format: "pdf", path: "我的知识 / 操作手册", action: "浏览", time: "8月28日", type: "操作手册", category: "技术资料", version: "V1.6", size: "3.1 MB" },
    { id: "WZ-2026-SJ-0009", title: "数据治理专项工作台账", format: "excel", path: "我的知识 / 数据治理", action: "编辑", time: "8月27日", type: "工作台账", category: "管理资料", version: "V1.1", size: "720 KB" },
    { id: "WZ-2026-YF-0016", title: "项目验收资料编制指引", format: "pdf", path: "我的协作 / 项目验收", action: "下载", time: "8月25日", type: "工作指引", category: "项目资料", version: "V1.0", size: "1.2 MB" }
  ];

  var currentTaskAction = "confirm";

  function formatLabel(format) {
    return { word: "DOCX", ppt: "PPTX", pdf: "PDF", excel: "XLSX" }[format] || "FILE";
  }

  function fileItem(file) {
    return '<button class="recent-item" type="button" data-file-id="' + file.id + '">' +
      '<span class="file-badge file-' + file.format + '">' + formatLabel(file.format) + '</span>' +
      '<span class="recent-copy"><strong>' + file.title + '</strong><span>' + file.path + '</span></span>' +
      '<span class="recent-action"><time>' + file.time + file.action + '</time><span class="open-label">打开</span></span>' +
      '</button>';
  }

  function renderRecentOverview() {
    document.getElementById("recentOverviewList").innerHTML = recentFiles.slice(0, 4).map(fileItem).join("");
    bindFileOpen(document.getElementById("recentOverviewList"));
  }

  function renderRecentModal(query) {
    var normalized = String(query || "").trim().toLowerCase();
    var filtered = recentFiles.filter(function (file) {
      return (file.title + " " + file.path + " " + file.type).toLowerCase().includes(normalized);
    });
    document.getElementById("recentModalList").innerHTML = filtered.length
      ? filtered.map(fileItem).join("")
      : '<div class="empty-list">未找到符合条件的最近使用记录</div>';
    bindFileOpen(document.getElementById("recentModalList"));
  }

  function bindFileOpen(root) {
    root.querySelectorAll("[data-file-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        openDetail(button.dataset.fileId);
      });
    });
  }

  function openDetail(id) {
    var file = recentFiles.find(function (item) { return item.id === id; });
    if (!file) return;
    BompPrototype.closeModal(document.getElementById("recentModal"));
    document.getElementById("detailIcon").textContent = formatLabel(file.format);
    document.getElementById("detailIcon").className = "detail-file-icon file-" + file.format;
    document.getElementById("detailPath").textContent = file.path;
    document.getElementById("detailTitle").textContent = file.title;
    document.getElementById("documentTitle").textContent = file.title.replace(/[《》]/g, "");
    document.getElementById("detailUpdated").textContent = file.time + file.action;
    document.getElementById("detailNumber").textContent = file.id;
    document.getElementById("detailType").textContent = file.type;
    document.getElementById("detailCategory").textContent = file.category;
    document.getElementById("detailVersion").textContent = file.version;
    document.getElementById("detailSize").textContent = file.size;
    document.getElementById("dashboardView").hidden = true;
    document.getElementById("detailView").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openRecentWithFilter(pathKeyword) {
    document.getElementById("recentSearch").value = pathKeyword || "";
    renderRecentModal(pathKeyword);
    BompPrototype.openModal("recentModal");
  }

  function handleHash() {
    var key = window.location.hash.slice(1);
    if (!key || key === "recent-use") {
      document.getElementById("recent-use").scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (key === "my-knowledge") {
      openRecentWithFilter("我的知识");
    } else if (key === "my-favorites") {
      openRecentWithFilter("我的收藏");
    } else if (key === "my-collaboration") {
      document.getElementById("my-collaboration").scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (key === "my-uploads") {
      document.getElementById("upload-tasks").scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (key === "sharing-statistics") {
      BompPrototype.showToast("已进入我的知识共享统计");
    } else if (key === "recycle-bin") {
      BompPrototype.showToast("回收站中有 2 个文件，可恢复或彻底删除");
    }
  }

  renderRecentOverview();
  renderRecentModal("");

  BompPrototype.initShell({
    active: window.location.hash.slice(1) || "recent-use",
    routes: {
      "recent-use": "#recent-use",
      "my-knowledge": "#my-knowledge",
      "my-collaboration": "#my-collaboration",
      "my-favorites": "#my-favorites",
      "sharing-statistics": "#sharing-statistics",
      "my-uploads": "#my-uploads",
      "recycle-bin": "#recycle-bin"
    }
  });

  window.addEventListener("hashchange", handleHash);

  document.getElementById("uploadButton").addEventListener("click", function () {
    BompPrototype.openModal("uploadModal");
  });
  document.getElementById("newDocumentButton").addEventListener("click", function () {
    BompPrototype.openModal("newDocumentModal");
  });
  document.getElementById("organizeButton").addEventListener("click", function () {
    BompPrototype.openModal("organizeModal");
  });

  document.getElementById("chooseFileButton").addEventListener("click", function () {
    document.getElementById("selectedFileText").textContent = "已选择 3 个采购业务文件";
  });
  document.getElementById("uploadSubmit").addEventListener("click", function () {
    BompPrototype.closeModal(document.getElementById("uploadModal"));
    BompPrototype.showToast("上传任务已创建");
  });
  document.getElementById("newDocumentSubmit").addEventListener("click", function () {
    var input = document.getElementById("documentName");
    if (!input.value.trim()) {
      BompPrototype.showToast("请输入文档名称");
      input.focus();
      return;
    }
    BompPrototype.closeModal(document.getElementById("newDocumentModal"));
    BompPrototype.showToast("在线文档创建成功");
  });
  document.getElementById("organizeSubmit").addEventListener("click", function () {
    BompPrototype.closeModal(document.getElementById("organizeModal"));
    BompPrototype.showToast("本地文档扫描已开始");
  });

  document.getElementById("recentAllButton").addEventListener("click", function () {
    window.location.href = "recent-use.html";
  });
  document.getElementById("recentSearch").addEventListener("input", function (event) {
    renderRecentModal(event.target.value);
  });

  ["messageAllButton", "messageFooterButton"].forEach(function (id) {
    document.getElementById(id).addEventListener("click", function () {
      BompPrototype.openModal("messageModal");
    });
  });

  document.querySelectorAll("[data-message]").forEach(function (button) {
    button.addEventListener("click", function () {
      button.classList.remove("is-unread");
      BompPrototype.showToast("消息已标为已读");
    });
  });

  document.getElementById("markAllReadButton").addEventListener("click", function () {
    document.querySelectorAll(".message-item").forEach(function (item) { item.classList.remove("is-unread"); });
    BompPrototype.closeModal(document.getElementById("messageModal"));
    BompPrototype.showToast("全部消息已标为已读");
  });

  document.querySelectorAll("[data-task-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentTaskAction = button.dataset.taskAction;
      var repair = currentTaskAction === "repair";
      document.getElementById("taskModalTitle").textContent = repair ? "处理上传异常" : "确认智能标引";
      document.getElementById("taskModalCopy").textContent = repair
        ? "《供应商履约评价记录.xlsx》解析失败，可重新上传或暂时移出本次任务。"
        : "3个文件已完成摘要、分类和标签提取，确认后将进入我的知识库。";
      document.getElementById("taskSubmit").textContent = repair ? "重新处理" : "确认完成";
      BompPrototype.openModal("taskModal");
    });
  });

  document.getElementById("taskSubmit").addEventListener("click", function () {
    BompPrototype.closeModal(document.getElementById("taskModal"));
    BompPrototype.showToast(currentTaskAction === "repair" ? "异常文件已重新处理" : "智能标引已确认");
  });

  document.getElementById("uploadAllButton").addEventListener("click", function () {
    document.getElementById("upload-tasks").scrollIntoView({ behavior: "smooth", block: "center" });
    BompPrototype.showToast("已展示全部进行中的上传任务");
  });

  document.getElementById("collaborationAllButton").addEventListener("click", function () {
    BompPrototype.showToast("已进入我的协作列表");
  });

  document.querySelectorAll("[data-collaboration-action]").forEach(function (button, index) {
    button.addEventListener("click", function () {
      if (index === 0) {
        openDetail("WZ-2026-CG-0012");
      } else {
        BompPrototype.showToast(button.dataset.collaborationAction === "detail" ? "已查看提报记录" : "已打开协作文档最新版本");
      }
    });
  });

  document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("detailView").hidden = true;
    document.getElementById("dashboardView").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll("[data-detail-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      BompPrototype.showToast(button.dataset.detailAction === "share" ? "分享链接已生成" : "已进入在线编辑");
    });
  });
})();
