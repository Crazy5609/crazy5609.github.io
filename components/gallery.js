(function () {
  const sidebar = document.getElementById("appSidebar");
  const header = document.getElementById("appHeader");
  const title = document.getElementById("pageTitle");
  const search = document.getElementById("knowledgeSearch");
  const table = document.getElementById("knowledgeTable");
  const toast = document.getElementById("feedbackToast");
  let toastTimer;

  document.getElementById("searchIcon").innerHTML = window.BompIcons.create("search", { size: 17 });

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2000);
  }

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
  header.addEventListener("module-navigation-change", (event) => {
    showToast(event.detail.key === "knowledge-sharing" ? "当前位于知识共享" : `${event.detail.label}模块将在后续原型中补充`);
  });
  header.addEventListener("user-menu-click", () => showToast("已打开个人账号菜单"));
  header.addEventListener("logout-click", () => showToast("已退出登录（原型演示）"));
  document.getElementById("uploadButton").addEventListener("click", () => showToast("已打开知识上传"));
})();
