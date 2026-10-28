(function () {
  const componentStyles = new URL("component.css?v=1.0.0", document.currentScript.src).href;
  const defaultEntries = [
    { title: "报销单问题咨询", meta: "AI问答 · 今天 10:24" },
    { title: "物资招标流程有哪些", meta: "AI问答 · 今天 09:16" },
    { title: "供应商管理办法", meta: "搜知识 · 昨天 16:42" },
    { title: "采购合同审核流程", meta: "搜知识 · 09月13日" },
    { title: "库存管理要求", meta: "AI问答 · 09月12日" },
    { title: "安全生产管理制度", meta: "搜知识 · 09月10日" },
    { title: "差旅费报销标准", meta: "搜知识 · 09月08日" }
  ];

  function escapeHtml(value) {
    const node = document.createElement("div");
    node.textContent = value == null ? "" : String(value);
    return node.innerHTML;
  }

  class BompSearchHistoryPanel extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const entries = defaultEntries.map((entry, index) => `
        <button class="history-item${index === 0 ? " is-active" : ""}" type="button" data-history-index="${index}" title="${escapeHtml(entry.title)}">
          <span class="history-icon" aria-hidden="true">${window.BompIcons.create("clock3", { size: 16 })}</span>
          <span class="history-copy">
            <strong>${escapeHtml(entry.title)}</strong>
            <small>${escapeHtml(entry.meta)}</small>
          </span>
        </button>
      `).join("");

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <aside class="history-panel" aria-labelledby="historyPanelTitle">
          <header>
            <h2 id="historyPanelTitle">历史记录</h2>
            <button class="collapse-button" type="button" aria-label="收起历史记录">
              ${window.BompIcons.create("chevronRight", { size: 16 })}
              <span>收起</span>
            </button>
          </header>
          <div class="history-list">${entries}</div>
        </aside>
      `;

      this.shadowRoot.querySelector(".collapse-button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("history-close", { bubbles: true, composed: true }));
      });
      this.shadowRoot.querySelectorAll(".history-item").forEach((button) => {
        button.addEventListener("click", () => {
          this.shadowRoot.querySelectorAll(".history-item").forEach((item) => item.classList.toggle("is-active", item === button));
          const entry = defaultEntries[Number(button.dataset.historyIndex)];
          this.dispatchEvent(new CustomEvent("history-select", {
            bubbles: true,
            composed: true,
            detail: entry
          }));
        });
      });
    }

    focusClose() {
      const button = this.shadowRoot.querySelector(".collapse-button");
      if (button) button.focus();
    }
  }

  if (!customElements.get("bomp-search-history-panel")) {
    customElements.define("bomp-search-history-panel", BompSearchHistoryPanel);
  }
})();
