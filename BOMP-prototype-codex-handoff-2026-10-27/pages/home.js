(function () {
  var mode = "ai";
  var input = document.getElementById("smartInput");
  var scopeMenu = document.getElementById("scopeMenu");

  BompPrototype.initShell({ active: "home" });

  function setMode(nextMode) {
    mode = nextMode;
    document.querySelectorAll(".entry-tab").forEach(function (tab) {
      var active = tab.dataset.mode === mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    input.placeholder = mode === "ai"
      ? "描述你的需求，AI帮你查知识、写材料、生成内容……"
      : "输入关键词，检索标题、摘要和正文内容";
    input.focus();
  }

  function submitSmartEntry() {
    var query = input.value.trim();
    if (!query) {
      BompPrototype.showToast(mode === "ai" ? "请输入业务问题" : "请输入检索关键词");
      input.focus();
      return;
    }
    if (mode === "search") {
      window.location.href = "search-results.html?q=" + encodeURIComponent(query) + "&scope=" + encodeURIComponent(document.getElementById("scopeText").textContent);
      return;
    }
    document.getElementById("answerQuestion").textContent = query;
    BompPrototype.openModal("answerModal");
  }

  document.querySelectorAll(".entry-tab").forEach(function (tab) {
    tab.addEventListener("click", function () { setMode(tab.dataset.mode); });
  });

  document.getElementById("sendButton").addEventListener("click", submitSmartEntry);
  input.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") submitSmartEntry();
  });

  document.getElementById("scopeButton").addEventListener("click", function () {
    scopeMenu.hidden = !scopeMenu.hidden;
    document.getElementById("scopeButton").setAttribute("aria-expanded", String(!scopeMenu.hidden));
  });

  scopeMenu.querySelectorAll("button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("scopeText").textContent = button.dataset.scope;
      scopeMenu.hidden = true;
      document.getElementById("scopeButton").setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-prompt]").forEach(function (button) {
    button.addEventListener("click", function () {
      input.value = button.dataset.prompt;
      setMode("ai");
    });
  });

  document.getElementById("promptMore").addEventListener("click", function () {
    var group = document.getElementById("morePromptGroup");
    group.hidden = !group.hidden;
    this.setAttribute("aria-expanded", String(!group.hidden));
    this.setAttribute("aria-label", group.hidden ? "展开更多模板" : "收起更多模板");
  });

  document.querySelectorAll('[data-quick-action="collaborate"]').forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopImmediatePropagation();
      BompPrototype.openModal("collaborationModal");
    });
  });

  document.querySelectorAll("[data-quick-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.quickAction === "upload") {
        BompPrototype.openModal("uploadModal");
      } else if (button.dataset.quickAction === "draft") {
        BompPrototype.openModal("draftModal");
      } else {
        BompPrototype.showToast("已进入在线协作空间");
      }
    });
  });

  document.querySelectorAll("[data-collaboration-file]").forEach(function (button) {
    button.addEventListener("click", function () {
      BompPrototype.closeModal(document.getElementById("collaborationModal"));
      BompPrototype.showToast("已进入协作：" + button.dataset.collaborationFile);
    });
  });

  document.getElementById("createCollaboration").addEventListener("click", function () {
    BompPrototype.closeModal(document.getElementById("collaborationModal"));
    BompPrototype.showToast("已创建协作文档");
  });

  document.getElementById("chooseFileButton").addEventListener("click", function () {
    BompPrototype.showToast("已选择：供应商履约评价工作指引.docx");
  });

  document.getElementById("uploadSubmit").addEventListener("click", function () {
    BompPrototype.closeModal(document.getElementById("uploadModal"));
    BompPrototype.showToast("上传成功，已进入智能标引");
  });

  document.getElementById("draftSubmit").addEventListener("click", function () {
    var need = document.getElementById("draftNeed");
    if (!need.value.trim()) {
      BompPrototype.showToast("请输入起草需求");
      need.focus();
      return;
    }
    BompPrototype.closeModal(document.getElementById("draftModal"));
    BompPrototype.showToast("材料初稿已生成");
  });

  document.getElementById("attachButton").addEventListener("click", function () {
    BompPrototype.showToast("已添加附件：采购需求说明.pdf");
  });

  document.getElementById("imageButton").addEventListener("click", function () {
    window.location.href = "search-results.html?mode=image";
  });

  document.getElementById("assistantFab").addEventListener("click", function () {
    setMode("ai");
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "ai") setMode("ai");
})();
