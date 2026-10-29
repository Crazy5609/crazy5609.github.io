(function () {
  "use strict";

  var files = [
    {
      name: "国网物资公司数字化项目建设管理办法.docx",
      type: "word",
      label: "DOCX",
      size: "3.8 MB",
      code: "WZ-SL-2026-031",
      directory: "数字化需求管理 / 数字化项目建设资料",
      professional: "数字化管理",
      kind: "制度规范类",
      version: "V2.1",
      keywords: "数字化项目、建设管理、需求评审、项目验收",
      summary: "明确公司数字化项目从需求提出、立项评审、建设实施到验收归档的全过程管理要求。",
      validity: "长期有效",
      visibility: "本部门成员",
      issue: ""
    },
    {
      name: "供应链运营中心2026年度重点工作任务清单.xlsx",
      type: "excel",
      label: "XLSX",
      size: "1.6 MB",
      code: "WZ-SL-2026-032",
      directory: "供应链平台运营 / 运营体系建设",
      professional: "计划管理",
      kind: "模板范本类",
      version: "V1.0",
      keywords: "重点工作、任务清单、供应链运营、进度管理",
      summary: "汇总供应链运营中心年度重点任务、责任岗位、计划节点和完成情况，用于工作统筹与进度跟踪。",
      validity: "1 年",
      visibility: "本部门成员",
      issue: ""
    },
    {
      name: "供应链运营季度运行分析报告.pdf",
      type: "pdf",
      label: "PDF",
      size: "6.2 MB",
      code: "WZ-SL-2026-033",
      directory: "报告汇报文件 / 部门年度总结",
      professional: "供应链运营",
      kind: "报告汇报类",
      version: "V1.0",
      keywords: "供应链运营、季度分析、运行指标、业务趋势",
      summary: "分析季度供应链运营指标、重点业务运行态势及异常问题，并提出后续改进安排。",
      validity: "2 年",
      visibility: "本部门成员",
      issue: "duplicate"
    },
    {
      name: "项目建设方案最终版2.docx",
      recommendedName: "知识共享中心建设实施方案-V2.1.docx",
      type: "word",
      label: "DOCX",
      size: "4.7 MB",
      code: "WZ-SL-2026-034",
      directory: "数字化需求管理 / 数字化项目建设资料",
      professional: "项目管理",
      kind: "方案案例类",
      version: "V2.1",
      keywords: "知识共享中心、建设方案、项目实施、知识管理",
      summary: "说明知识共享中心的建设目标、职责分工、实施步骤、里程碑计划和智能应用场景。",
      validity: "长期有效",
      visibility: "本部门成员",
      issue: "naming"
    },
    {
      name: "数字化需求评审会议纪要-20260828.docx",
      type: "word",
      label: "DOCX",
      size: "980 KB",
      code: "WZ-SL-2026-035",
      directory: "数字化需求管理 / 数字化项目建设资料",
      professional: "数字化管理",
      kind: "报告汇报类",
      version: "V1.0",
      keywords: "数字化需求、评审会议、会议纪要、建设安排",
      summary: "记录数字化需求评审会议的参会人员、评审结论、修改意见与后续任务安排。",
      validity: "2 年",
      visibility: "本部门成员",
      issue: ""
    },
    {
      name: "供应链业务架构变更管理操作指引.pptx",
      type: "ppt",
      label: "PPTX",
      size: "8.5 MB",
      code: "WZ-SL-2026-036",
      directory: "架构管理 / 供应链业务架构管理",
      professional: "数字化管理",
      kind: "培训宣贯类",
      version: "V1.2",
      keywords: "业务架构、变更管理、操作指引、架构治理",
      summary: "介绍供应链业务架构变更的申请条件、评审步骤、成果维护与归档要求。",
      validity: "长期有效",
      visibility: "本部门成员",
      issue: ""
    },
    {
      name: "供应链平台运营培训现场照片.jpg",
      type: "image",
      label: "JPG",
      size: "2.4 MB",
      code: "WZ-SL-2026-037",
      directory: "供应链平台运营 / 运营体系建设",
      professional: "供应链运营",
      kind: "多媒体素材类",
      version: "V1.0",
      keywords: "供应链平台、运营培训、现场活动、培训素材",
      summary: "供应链平台运营培训现场照片，记录培训授课、交流讨论与实操演示情况。",
      validity: "长期有效",
      visibility: "本部门成员",
      issue: ""
    },
    {
      name: "数字化项目网络安全风险检查清单.xlsx",
      type: "excel",
      label: "XLSX",
      size: "1.1 MB",
      code: "WZ-SL-2026-038",
      directory: "数字化需求管理 / 数字化项目建设资料",
      professional: "风险合规",
      kind: "风险合规类",
      version: "V1.3",
      keywords: "数字化项目、网络安全、风险检查、合规清单",
      summary: "用于数字化项目建设过程中的网络安全风险识别、检查记录和整改闭环管理。",
      validity: "长期有效",
      visibility: "本部门成员",
      issue: ""
    }
  ];

  var currentStep = 1;
  var furthestStep = 1;
  var activeFileIndex = 0;
  var lastModalTrigger = null;
  var toastTimer = null;

  var routeMap = {
    home: "home.html",
    "recent-use": "my-library.html",
    "my-knowledge": "my-knowledge.html",
    "my-collaboration": "my-collaboration.html",
    "my-favorites": "my-favorites.html",
    "personal-center": "my-info.html",
    "my-info": "my-info.html",
    "my-browsing": "my-browsing.html",
    "my-downloads": "my-downloads.html",
    "my-approvals": "my-approvals.html",
    "my-recycle": "my-recycle-bin.html",
    "sharing-statistics": "my-approvals.html",
    "my-uploads": "my-uploads.html",
    "my-sharing": "my-sharing.html",
    "review-workbench": "review-workbench.html",
    "department-library": "department-library.html",
    "dept-architecture-management": "department-library.html",
    "dept-supply-chain-architecture": "department-library.html",
    "company-library": "company-library.html",
    "company-core-business": "company-library.html",
    "management-library": "library-management.html",
    "department-library-management": "library-management.html",
    "professional-directory-management": "directory-management.html",
    "company-library-management": "company-library-management.html"
  };

  function icon(name, size) {
    return window.BompIcons.create(name, { size: size || 18 });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function shortName(name) {
    return name.replace(/\.[^.]+$/, "");
  }

  function toast(message) {
    var element = document.getElementById("uploadToast");
    element.innerHTML = icon("circleCheck", 17) + "<span>" + escapeHtml(message) + "</span>";
    element.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      element.hidden = true;
    }, 2000);
  }

  function updateIcons() {
    document.querySelectorAll("[data-icon]").forEach(function (element) {
      element.innerHTML = icon(element.dataset.icon, 18);
    });
  }

  function renderSelectionRows() {
    var directory = document.getElementById("targetDirectory").value || "待选择";
    document.getElementById("selectedFileRows").innerHTML = files.map(function (file, index) {
      return '<tr data-selection-row="' + index + '">' +
        '<td class="checkbox-column"><input type="checkbox" data-file-select="' + index + '" checked aria-label="选择 ' + escapeHtml(file.name) + '"></td>' +
        '<td><div class="file-cell"><span class="file-type-mark ' + file.type + '">' + escapeHtml(file.label) + '</span><span><strong title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</strong><small>' + escapeHtml(file.code) + '</small></span></div></td>' +
        '<td>' + escapeHtml(file.label) + '</td>' +
        '<td>' + escapeHtml(file.size) + '</td>' +
        '<td>' + escapeHtml(directory) + '</td>' +
        '<td><button class="remove-file-button" type="button" data-remove-file="' + index + '">移除</button></td>' +
        '</tr>';
    }).join("");
    document.getElementById("selectedCount").textContent = "已选择 " + files.length + " 个文件";
    document.getElementById("selectAllFiles").checked = files.length > 0;
  }

  function processingStatus(file, part) {
    if (part === "duplicate" && file.issue === "duplicate") {
      return '<span class="status-pill warning">' + icon("circleAlert", 14) + '疑似重复</span>';
    }
    if (part === "naming" && file.issue === "naming") {
      return '<span class="status-pill warning">' + icon("circleAlert", 14) + '待规范</span>';
    }
    return '<span class="status-pill success">' + icon("circleCheck", 14) + '通过</span>';
  }

  function renderProcessingRows() {
    var issueCount = files.filter(function (file) { return Boolean(file.issue); }).length;
    document.getElementById("processingRows").innerHTML = files.map(function (file, index) {
      var action = '<span class="status-pill success">可进入确认</span>';
      if (file.issue === "duplicate") {
        action = '<button class="issue-action" type="button" data-resolve-issue="' + index + '">保留为新版本</button>';
      } else if (file.issue === "naming") {
        action = '<button class="issue-action" type="button" data-resolve-issue="' + index + '">采用推荐命名</button>';
      }
      return '<tr><td><div class="file-cell"><span class="file-type-mark ' + file.type + '">' + escapeHtml(file.label) + '</span><span><strong title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</strong><small>' + escapeHtml(file.size) + '</small></span></div></td>' +
        '<td>' + processingStatus(file, "format") + '</td>' +
        '<td>' + processingStatus(file, "duplicate") + '</td>' +
        '<td>' + processingStatus(file, "naming") + '</td>' +
        '<td><span class="status-pill success">' + icon("sparkles", 14) + '已完成</span></td>' +
        '<td>' + action + '</td></tr>';
    }).join("");
    document.getElementById("totalProcessingCount").textContent = files.length;
    document.getElementById("completedProcessingCount").textContent = files.length - issueCount;
    document.getElementById("issueProcessingCount").textContent = issueCount;
    document.getElementById("processingErrorSummary").hidden = true;
  }

  function renderMetadataList(query) {
    query = String(query || "").trim().toLowerCase();
    var visibleCount = 0;
    document.getElementById("metadataFileList").innerHTML = files.map(function (file, index) {
      var hidden = query && !file.name.toLowerCase().includes(query);
      if (!hidden) visibleCount += 1;
      return '<div class="metadata-file-row ' + (index === activeFileIndex ? "is-active" : "") + '" data-metadata-row="' + index + '"' + (hidden ? " hidden" : "") + '>' +
        '<input type="checkbox" data-metadata-check="' + index + '" checked aria-label="批量选择 ' + escapeHtml(file.name) + '">' +
        '<button class="metadata-file-item" type="button" data-select-metadata="' + index + '"><strong title="' + escapeHtml(file.name) + '">' + escapeHtml(shortName(file.name)) + '</strong><small>' + escapeHtml(file.kind) + ' · 已确认</small></button>' +
        '</div>';
    }).join("");
    if (visibleCount === 0) {
      document.getElementById("metadataFileList").innerHTML = '<p class="table-empty">未找到匹配文件</p>';
    }
    updateMetadataCheckedCount();
  }

  function renderMetadataForm() {
    var file = files[activeFileIndex];
    if (!file) return;
    var mark = document.getElementById("activeFileMark");
    mark.className = "file-type-mark " + file.type;
    mark.textContent = file.label;
    document.getElementById("activeFileName").textContent = file.name;
    document.getElementById("activeFileMeta").textContent = file.label + " · " + file.size + " · AI 标引完成";
    document.getElementById("documentTitle").value = shortName(file.name);
    document.getElementById("metadataDirectory").value = file.directory;
    document.getElementById("professionalTag").value = file.professional;
    document.getElementById("knowledgeType").value = file.kind;
    document.getElementById("versionTag").value = file.version;
    document.getElementById("keywords").value = file.keywords;
    document.getElementById("documentSummary").value = file.summary;
    document.getElementById("validityPeriod").value = file.validity;
    document.querySelectorAll('input[name="visibility"]').forEach(function (input) {
      input.checked = input.value === file.visibility;
    });
    updateSummaryLength();
  }

  function syncMetadataForm() {
    var file = files[activeFileIndex];
    if (!file) return;
    var extension = file.name.includes(".") ? "." + file.name.split(".").pop() : "";
    file.name = document.getElementById("documentTitle").value.trim() + extension;
    file.directory = document.getElementById("metadataDirectory").value;
    file.professional = document.getElementById("professionalTag").value;
    file.kind = document.getElementById("knowledgeType").value;
    file.version = document.getElementById("versionTag").value.trim();
    file.keywords = document.getElementById("keywords").value.trim();
    file.summary = document.getElementById("documentSummary").value.trim();
    file.validity = document.getElementById("validityPeriod").value;
    var visibility = document.querySelector('input[name="visibility"]:checked');
    file.visibility = visibility ? visibility.value : "本部门成员";
  }

  function renderResultRows() {
    document.getElementById("resultRows").innerHTML = files.map(function (file) {
      return '<tr><td><div class="file-cell"><span class="file-type-mark ' + file.type + '">' + escapeHtml(file.label) + '</span><span><strong title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</strong><small>' + escapeHtml(file.code) + '</small></span></div></td><td>' + escapeHtml(file.kind) + '</td><td>' + escapeHtml(file.directory) + '</td><td><span class="status-pill review">待部门审核</span></td></tr>';
    }).join("");
  }

  function updateSummaryLength() {
    document.getElementById("summaryLength").textContent = document.getElementById("documentSummary").value.length;
  }

  function updateMetadataCheckedCount() {
    var checkboxes = Array.from(document.querySelectorAll("[data-metadata-check]"));
    var checked = checkboxes.filter(function (checkbox) { return checkbox.checked; }).length;
    document.getElementById("metadataCheckedCount").textContent = checked + " / " + files.length;
  }

  function goToStep(step) {
    if (step > furthestStep) furthestStep = step;
    currentStep = step;
    document.querySelectorAll("[data-step-panel]").forEach(function (panel) {
      panel.hidden = Number(panel.dataset.stepPanel) !== step;
    });
    document.querySelectorAll("[data-step-target]").forEach(function (button) {
      var buttonStep = Number(button.dataset.stepTarget);
      button.disabled = buttonStep > furthestStep;
      button.classList.toggle("is-current", buttonStep === step);
      button.classList.toggle("is-complete", buttonStep < step || buttonStep < furthestStep);
      if (buttonStep === step) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (step === 2) renderProcessingRows();
    if (step === 3) {
      renderMetadataList(document.getElementById("metadataSearch").value);
      renderMetadataForm();
    }
    if (step === 4) renderResultRows();
    window.scrollTo({ top: 0, behavior: "smooth" });
    var heading = document.querySelector('[data-step-panel="' + step + '"] h2');
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function validateStepOne() {
    var error = document.getElementById("stepOneError");
    if (!files.length) {
      error.textContent = "请至少选择一个文件。";
      error.hidden = false;
      error.focus();
      return false;
    }
    if (!document.getElementById("targetDirectory").value) {
      error.textContent = "请选择目标目录。";
      error.hidden = false;
      document.getElementById("targetDirectory").focus();
      return false;
    }
    error.hidden = true;
    return true;
  }

  function validateMetadata() {
    syncMetadataForm();
    var form = document.getElementById("metadataForm");
    var invalid = Array.from(form.querySelectorAll("[required]")).find(function (field) {
      return !String(field.value || "").trim();
    });
    var summary = document.getElementById("metadataErrorSummary");
    if (invalid) {
      invalid.setAttribute("aria-invalid", "true");
      summary.hidden = false;
      summary.focus();
      return false;
    }
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
    summary.hidden = true;
    return true;
  }

  function openModal(modal, trigger) {
    lastModalTrigger = trigger || document.activeElement;
    modal.hidden = false;
    var focusable = modal.querySelector("button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    modal.hidden = true;
    if (lastModalTrigger && typeof lastModalTrigger.focus === "function") lastModalTrigger.focus();
  }

  function trapModalFocus(event, modal) {
    var focusable = Array.from(modal.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function addFiles(fileList) {
    Array.from(fileList).forEach(function (file, index) {
      var extension = (file.name.split(".").pop() || "FILE").toUpperCase();
      var type = /DOC/.test(extension) ? "word" : /XLS/.test(extension) ? "excel" : /PPT/.test(extension) ? "ppt" : /PDF/.test(extension) ? "pdf" : /JPG|JPEG|PNG/.test(extension) ? "image" : "video";
      files.push({
        name: file.name,
        type: type,
        label: extension,
        size: file.size ? (file.size / 1024 / 1024).toFixed(1) + " MB" : "1.0 MB",
        code: "WZ-SL-2026-" + String(39 + index).padStart(3, "0"),
        directory: document.getElementById("targetDirectory").value || "数字化需求管理 / 数字化项目建设资料",
        professional: "数字化管理",
        kind: "方案案例类",
        version: "V1.0",
        keywords: "待补充",
        summary: "系统已完成内容解析，请核对并补充文档摘要。",
        validity: "长期有效",
        visibility: "本部门成员",
        issue: ""
      });
    });
    renderSelectionRows();
    toast("已添加 " + fileList.length + " 个文件");
  }

  function bindNavigation() {
    var sidebar = document.getElementById("appSidebar");
    if (sidebar) {
      sidebar.addEventListener("navigation-change", function (event) {
        if (event.detail.key.indexOf("company-") === 0 && event.detail.parentKey !== "library-management") {
          window.location.href = "company-library.html#" + event.detail.key;
          return;
        }
        if (routeMap[event.detail.key]) window.location.href = routeMap[event.detail.key];
        else toast(event.detail.label + "页面将在后续原型中补充");
      });
    }
    var header = document.getElementById("appHeader");
    if (header) {
      header.addEventListener("module-navigation-change", function (event) {
        if (event.detail.key === "knowledge-sharing") toast("当前位于知识共享");
        else if (event.detail.key === "portal-home") window.location.href = "home.html";
        else toast(event.detail.label + "模块将在后续原型中补充");
      });
      header.addEventListener("logout-click", function () { toast("已退出登录（原型演示）"); });
      header.addEventListener("user-menu-click", function () { window.location.href = "my-library.html"; });
    }
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var stepButton = event.target.closest("[data-step-target]");
      if (stepButton && !stepButton.disabled) {
        if (currentStep === 3) syncMetadataForm();
        goToStep(Number(stepButton.dataset.stepTarget));
        return;
      }

      var next = event.target.closest("[data-next-step]");
      if (next) {
        var target = Number(next.dataset.nextStep);
        if (target === 2 && !validateStepOne()) return;
        if (target === 3 && files.some(function (file) { return Boolean(file.issue); })) {
          var summary = document.getElementById("processingErrorSummary");
          summary.hidden = false;
          summary.focus();
          toast("请先处理待处理提醒");
          return;
        }
        goToStep(target);
        return;
      }

      var previous = event.target.closest("[data-previous-step]");
      if (previous) {
        if (currentStep === 3) syncMetadataForm();
        goToStep(Number(previous.dataset.previousStep));
        return;
      }

      var remove = event.target.closest("[data-remove-file]");
      if (remove) {
        files.splice(Number(remove.dataset.removeFile), 1);
        renderSelectionRows();
        toast("文件已从上传任务移除");
        return;
      }

      var resolve = event.target.closest("[data-resolve-issue]");
      if (resolve) {
        var index = Number(resolve.dataset.resolveIssue);
        if (files[index].issue === "naming") files[index].name = files[index].recommendedName;
        files[index].issue = "";
        renderProcessingRows();
        toast(index === 2 ? "已保留为新版本" : "已采用推荐命名");
        return;
      }

      var metadataButton = event.target.closest("[data-select-metadata]");
      if (metadataButton) {
        syncMetadataForm();
        activeFileIndex = Number(metadataButton.dataset.selectMetadata);
        renderMetadataList(document.getElementById("metadataSearch").value);
        renderMetadataForm();
        return;
      }

      var openBatch = event.target.closest("[data-open-batch]");
      if (openBatch) {
        var selected = document.querySelectorAll("[data-metadata-check]:checked").length;
        if (!selected) {
          toast("请先勾选需要批量修改的文件");
          return;
        }
        openModal(document.getElementById("batchModal"), openBatch);
        return;
      }

      if (event.target.closest("[data-apply-batch]")) {
        syncMetadataForm();
        var checkedIndexes = Array.from(document.querySelectorAll("[data-metadata-check]:checked")).map(function (input) {
          return Number(input.dataset.metadataCheck);
        });
        var professional = document.getElementById("batchProfessional").value;
        var directory = document.getElementById("batchDirectory").value;
        var validity = document.getElementById("batchValidity").value;
        var visibility = document.querySelector('input[name="batchVisibility"]:checked').value;
        checkedIndexes.forEach(function (index) {
          if (professional) files[index].professional = professional;
          if (directory) files[index].directory = directory;
          if (validity) files[index].validity = validity;
          if (visibility) files[index].visibility = visibility;
        });
        closeModal(document.getElementById("batchModal"));
        renderMetadataForm();
        toast("已批量更新 " + checkedIndexes.length + " 个文件");
        return;
      }

      var submit = event.target.closest("[data-open-submit]");
      if (submit) {
        if (!validateMetadata()) return;
        document.getElementById("submitFileCount").textContent = files.length + " 个";
        openModal(document.getElementById("submitModal"), submit);
        return;
      }

      if (event.target.closest("[data-confirm-submit]")) {
        closeModal(document.getElementById("submitModal"));
        goToStep(4);
        toast("提交成功，已进入部门审核");
        return;
      }

      var closeButton = event.target.closest("[data-close-modal]");
      if (closeButton) {
        closeModal(closeButton.closest(".modal-mask"));
        return;
      }

      if (event.target.classList.contains("modal-mask")) {
        closeModal(event.target);
        return;
      }

      if (event.target.closest("[data-save-draft]")) {
        if (currentStep === 3) syncMetadataForm();
        toast("草稿已保存");
        return;
      }

      if (event.target.closest("[data-exit-upload]") || event.target.closest("[data-back-management]")) {
        window.location.href = "knowledge-management.html";
        return;
      }

      if (event.target.closest("[data-restart-upload]")) {
        furthestStep = 1;
        goToStep(1);
        toast("已开始新的上传任务");
      }
    });

    document.getElementById("filePicker").addEventListener("change", function (event) {
      if (event.target.files.length) addFiles(event.target.files);
      event.target.value = "";
    });

    document.getElementById("selectAllFiles").addEventListener("change", function (event) {
      document.querySelectorAll("[data-file-select]").forEach(function (checkbox) {
        checkbox.checked = event.target.checked;
      });
    });

    document.getElementById("targetDirectory").addEventListener("change", function () {
      var directory = this.value;
      files.forEach(function (file) { file.directory = directory; });
      renderSelectionRows();
    });

    document.getElementById("metadataSearch").addEventListener("input", function () {
      renderMetadataList(this.value);
    });

    document.getElementById("metadataForm").addEventListener("input", updateSummaryLength);
    document.getElementById("metadataFileList").addEventListener("change", updateMetadataCheckedCount);

    var dropzone = document.getElementById("uploadDropzone");
    ["dragenter", "dragover"].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropzone.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropzone.classList.remove("is-dragging");
      });
    });
    dropzone.addEventListener("drop", function (event) {
      if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
    });
    dropzone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        document.getElementById("filePicker").click();
      }
    });

    document.addEventListener("keydown", function (event) {
      var openModalElement = Array.from(document.querySelectorAll(".modal-mask")).find(function (modal) { return !modal.hidden; });
      if (!openModalElement) return;
      if (event.key === "Escape") {
        closeModal(openModalElement);
      } else if (event.key === "Tab") {
        trapModalFocus(event, openModalElement);
      }
    });
  }

  updateIcons();
  renderSelectionRows();
  bindNavigation();
  bindEvents();
})();
