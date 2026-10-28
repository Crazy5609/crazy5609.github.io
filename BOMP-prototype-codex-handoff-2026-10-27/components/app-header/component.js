(function () {
  const componentStyles = new URL("component.css?v=4.2.0", document.currentScript.src).href;
  const fullCompanyIdentifier = new URL("assets/state-grid-materials-full-lockup.png", document.currentScript.src).href;
  const defaultModules = [
    { key: "portal-home", label: "首页", href: "#portal-home" },
    { key: "management-dashboard", label: "管理看板", href: "#management-dashboard" },
    { key: "operation-management", label: "经营管理", href: "#operation-management" },
    { key: "knowledge-sharing", label: "知识共享", href: "#knowledge-sharing" },
    { key: "artificial-intelligence", label: "人工智能", href: "#artificial-intelligence" },
    { key: "supply-chain-data", label: "供应链业务数据", href: "#supply-chain-data" },
    { key: "system-management", label: "系统管理", href: "#system-management" }
  ];

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  class BompHeader extends HTMLElement {
    static get observedAttributes() {
      return ["system-name", "system-code", "user-name", "company-identifier", "active-module"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() { this.render(); }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const systemName = escapeHtml(this.getAttribute("system-name") || "企业经营管理系统");
      const systemCode = escapeHtml(this.getAttribute("system-code") || "BOMP");
      const userName = escapeHtml(this.getAttribute("user-name") || "孙鹏飞");
      const activeModule = this.getAttribute("active-module") || "artificial-intelligence";
      const companyIdentifier = this.getAttribute("company-identifier");
      const companyIdentifierSource = companyIdentifier || fullCompanyIdentifier;
      const companyIdentifierContent = `<img src="${escapeHtml(companyIdentifierSource)}" alt="国家电网公司 State Grid 国网物资有限公司 State Grid Materials Co., Ltd">`;
      const moduleLinks = defaultModules.map((module) => `
        <a class="module-link${module.key === activeModule ? " is-active" : ""}"
           href="${module.href}"
           data-module-key="${module.key}"
           data-module-label="${module.label}"
           ${module.key === activeModule ? 'aria-current="page"' : ""}>
          ${module.label}
        </a>
      `).join("");

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <header class="header">
          <div class="brand-area">
            <span class="materials-identity">${companyIdentifierContent}</span>
            <span class="brand-divider" aria-hidden="true"></span>
            <span class="original-brand">
              <span class="system-identity">
                <strong>${systemName}</strong>
                <span>${systemCode}</span>
              </span>
            </span>
          </div>
          <nav class="module-nav" aria-label="BOMP系统主导航">${moduleLinks}</nav>
          <div class="user-area" aria-label="用户操作">
            <button class="header-action user-button" type="button" title="个人账号" aria-label="打开${userName}的个人账号">
              ${window.BompIcons.create("user", { size: 18 })}
              <span>你好，<strong class="user-name">${userName}</strong></span>
            </button>
            <button class="header-action logout-button" type="button" title="退出登录" aria-label="退出登录">
              ${window.BompIcons.create("logOut", { size: 18 })}
            </button>
          </div>
        </header>
      `;

      this.shadowRoot.querySelectorAll(".module-link").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const detail = {
            key: link.dataset.moduleKey,
            label: link.dataset.moduleLabel,
            href: link.getAttribute("href")
          };
          this.setAttribute("active-module", detail.key);
          this.dispatchEvent(new CustomEvent("module-navigation-change", {
            bubbles: true,
            detail
          }));
        });
      });
      this.shadowRoot.querySelector(".logout-button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("logout-click", { bubbles: true }));
      });
      this.shadowRoot.querySelector(".user-button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("user-menu-click", {
          bubbles: true,
          detail: { userName }
        }));
      });
    }
  }

  if (!customElements.get("bomp-header")) {
    customElements.define("bomp-header", BompHeader);
  }
})();
