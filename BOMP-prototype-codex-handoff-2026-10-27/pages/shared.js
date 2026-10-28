(function () {
  function iconify(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (element) {
      element.innerHTML = window.BompIcons.create(element.dataset.icon, {
        size: Number(element.dataset.iconSize) || 18
      });
    });
  }

  function showToast(message) {
    var toast = document.getElementById("feedbackToast");
    if (!toast) return;
    toast.textContent = message || "操作成功";
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.hidden = true;
    }, 2000);
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    var focusTarget = modal.querySelector("input, textarea, select, button");
    if (focusTarget) window.setTimeout(function () { focusTarget.focus(); }, 0);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
  }

  function initModals() {
    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        closeModal(button.closest(".modal-mask"));
      });
    });
    document.querySelectorAll(".modal-mask").forEach(function (mask) {
      mask.addEventListener("click", function (event) {
        if (event.target === mask) closeModal(mask);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".modal-mask:not([hidden])").forEach(closeModal);
    });
  }

  function initShell(options) {
    var sidebar = document.getElementById("appSidebar");
    var header = document.getElementById("appHeader");
    if (sidebar) {
      sidebar.setAttribute("active", options.active || "home");
    }

    if (sidebar) {
      sidebar.addEventListener("navigation-change", function (event) {
        var key = event.detail.key;
        var routes = Object.assign({
          home: "home.html",
          "ai-workbench": "home.html?mode=ai",
          "personal-library": "search-results.html?scope=personal",
          "recent-use": "recent-use.html",
          "my-knowledge": "personal-center.html#my-knowledge",
          "my-collaboration": "personal-center.html#my-collaboration",
          "my-favorites": "personal-center.html#my-favorites",
          "personal-center": "prototype-suite/my-info.html",
          "my-info": "prototype-suite/my-info.html",
          "my-browsing": "prototype-suite/my-browsing.html",
          "my-downloads": "prototype-suite/my-downloads.html",
          "my-uploads": "prototype-suite/my-uploads.html",
          "my-approvals": "prototype-suite/my-approvals.html",
          "my-recycle": "prototype-suite/my-recycle-bin.html",
          "sharing-statistics": "prototype-suite/my-approvals.html",
          "recycle-bin": "prototype-suite/my-recycle-bin.html",
          "department-library": "search-results.html?scope=department",
          "dept-architecture-management": "search-results.html?scope=department",
          "dept-supply-chain-architecture": "search-results.html?scope=department",
          "company-library": "search-results.html?scope=company",
          "company-core-business": "search-results.html?scope=company",
          "tag-management": "prototype-suite/tag-management.html"
        }, options && options.routes ? options.routes : {});
        if (key.indexOf("company-") === 0 && event.detail.parentKey !== "library-management") {
          window.location.href = "search-results.html?scope=company";
          return;
        }
        if (routes[key]) {
          window.location.href = routes[key];
          return;
        }
        showToast(event.detail.label + "页面将在后续原型中补充");
      });
    }

    if (header) {
      header.addEventListener("module-navigation-change", function (event) {
        showToast(event.detail.key === "knowledge-sharing"
          ? "当前位于知识共享"
          : event.detail.label + "模块将在后续原型中补充");
      });
      header.addEventListener("user-menu-click", function () {
        if (window.location.pathname.endsWith("/personal-center.html")) {
          showToast("当前账号：孙鹏飞");
          return;
        }
        window.location.href = "personal-center.html";
      });
      header.addEventListener("logout-click", function () {
        showToast("已退出登录（原型演示）");
      });
    }

    iconify();
    initModals();
  }

  window.BompPrototype = {
    closeModal: closeModal,
    iconify: iconify,
    initShell: initShell,
    openModal: openModal,
    showToast: showToast
  };
})();
