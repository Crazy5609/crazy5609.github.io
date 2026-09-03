(function () {
  const componentStyles = new URL("component.css", document.currentScript.src).href;
  const defaultSections = [
    {
      label: "",
      items: [
        { key: "home", label: "首页", icon: "home", href: "#home" },
        { key: "ai-workbench", label: "AI工作台", icon: "sparkles", href: "#ai-workbench" },
        { key: "personal-library", label: "我的知识库", icon: "library", href: "#personal-library" }
      ]
    },
    {
      label: "共享知识库",
      items: [
        { key: "department-library", label: "部门知识库", icon: "network", href: "#department-library" },
        { key: "company-library", label: "公司知识库", icon: "building", href: "#company-library" }
      ]
    },
    {
      label: "管理",
      items: [
        { key: "library-management", label: "管理知识库", icon: "fileCog", href: "#library-management" },
        { key: "review-workbench", label: "审核工作台", icon: "clipboardCheck", href: "#review-workbench" },
        { key: "tag-management", label: "标签管理", icon: "tags", href: "#tag-management" },
        { key: "system-management", label: "系统管理", icon: "settings", href: "#system-management" }
      ]
    }
  ];

  class BompSidebar extends HTMLElement {
    static get observedAttributes() {
      return ["active", "collapsed"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._sections = defaultSections;
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    set sections(value) {
      if (Array.isArray(value)) {
        this._sections = value;
        this.render();
      }
    }

    get sections() {
      return this._sections;
    }

    bindEvents() {
      this.shadowRoot.querySelector(".collapse-button").addEventListener("click", () => {
        this.toggleAttribute("collapsed");
        this.dispatchEvent(new CustomEvent("sidebar-toggle", {
          bubbles: true,
          detail: { collapsed: this.hasAttribute("collapsed") }
        }));
      });

      this.shadowRoot.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", (event) => {
          event.preventDefault();
          this.setAttribute("active", item.dataset.key);
          this.dispatchEvent(new CustomEvent("navigation-change", {
            bubbles: true,
            detail: {
              key: item.dataset.key,
              label: item.dataset.label,
              href: item.getAttribute("href")
            }
          }));
        });
      });
    }

    render() {
      const active = this.getAttribute("active") || "home";
      const collapsed = this.hasAttribute("collapsed");
      const groups = this._sections.map((section) => `
        <section class="nav-group" aria-label="${section.label || "常用功能"}">
          ${section.label ? `<div class="group-label">${section.label}</div>` : ""}
          ${section.items.map((item) => `
            <a class="nav-item${item.key === active ? " is-active" : ""}"
               href="${item.href || `#${item.key}`}"
               data-key="${item.key}"
               data-label="${item.label}"
               title="${collapsed ? item.label : ""}"
               ${item.key === active ? 'aria-current="page"' : ""}>
              <span class="nav-icon">${window.BompIcons.create(item.icon, { size: 22 })}</span>
              <span class="nav-label">${item.label}</span>
            </a>
          `).join("")}
        </section>
      `).join("");

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <aside class="sidebar" aria-label="知识共享中心主导航">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
            <span class="brand-name">知识共享中心</span>
          </div>
          <nav class="nav-scroll">${groups}</nav>
          <div class="sidebar-footer">
            <button class="collapse-button" type="button" title="${collapsed ? "展开导航栏" : "收起导航栏"}" aria-label="${collapsed ? "展开导航栏" : "收起导航栏"}">
              ${window.BompIcons.create(collapsed ? "panelLeftOpen" : "panelLeftClose", { size: 20 })}
            </button>
          </div>
        </aside>
      `;
      this.bindEvents();
    }
  }

  if (!customElements.get("bomp-sidebar")) {
    customElements.define("bomp-sidebar", BompSidebar);
  }
})();
