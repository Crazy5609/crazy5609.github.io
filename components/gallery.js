(function () {
  const sidebar = document.getElementById("appSidebar");
  const header = document.getElementById("appHeader");
  const content = document.getElementById("previewContent");
  const title = document.getElementById("pageTitle");
  const search = document.getElementById("knowledgeSearch");
  const table = document.getElementById("knowledgeTable");
  const toast = document.getElementById("feedbackToast");
  let toastTimer;

  document.getElementById("searchIcon").innerHTML = window.BompIcons.create("search", { size: 17 });

  if (new URLSearchParams(window.location.search).get("collapsed") === "1") {
    sidebar.setAttribute("collapsed", "");
    header.setAttribute("sidebar-collapsed", "");
    content.classList.add("is-sidebar-collapsed");
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2000);
  }

  sidebar.addEventListener("sidebar-toggle", (event) => {
    header.toggleAttribute("sidebar-collapsed", event.detail.collapsed);
    content.classList.toggle("is-sidebar-collapsed", event.detail.collapsed);
  });

  sidebar.addEventListener("navigation-change", (event) => {
    title.textContent = event.detail.label;
    showToast(`已切换至${event.detail.label}`);
  });

  search.addEventListener("input", () => {
    table.filter(search.value);
  });

  table.addEventListener("table-action", (event) => {
    const labels = { preview: "正在打开预览", download: "已创建下载任务", "ai-read": "正在生成AI速读", more: "已打开更多操作" };
    showToast(labels[event.detail.action] || "操作成功");
  });

  table.addEventListener("row-open", () => showToast("正在打开知识详情"));
  header.addEventListener("notifications-click", () => showToast("已打开消息通知"));
  header.addEventListener("user-menu-click", () => showToast("已打开个人账号菜单"));
  document.getElementById("uploadButton").addEventListener("click", () => showToast("已打开知识上传"));
})();
