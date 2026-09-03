(function () {
  const componentStyles = new URL("component.css", document.currentScript.src).href;
  const defaultLogo = new URL("assets/state-grid-logo.png", document.currentScript.src).href;

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  class BompHeader extends HTMLElement {
    static get observedAttributes() {
      return ["company-name", "product-name", "user-name", "avatar", "logo", "notification-count"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const companyName = escapeHtml(this.getAttribute("company-name") || "国网物资有限公司");
      const productName = escapeHtml(this.getAttribute("product-name") || "知识共享中心");
      const userName = escapeHtml(this.getAttribute("user-name") || "用户");
      const avatar = this.getAttribute("avatar");
      const logo = this.getAttribute("logo");
      const count = Math.max(0, Number(this.getAttribute("notification-count")) || 0);
      const avatarContent = avatar
        ? `<img src="${escapeHtml(avatar)}" alt="">`
        : userName.slice(0, 1);
      const logoContent = `<img src="${escapeHtml(logo || defaultLogo)}" alt="">`;

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <header class="header">
          <div class="identity">
            <div class="company">
              <span class="company-logo">${logoContent}</span>
              <span>${companyName}</span>
            </div>
            <span class="divider" aria-hidden="true"></span>
            <span class="product-name">${productName}</span>
          </div>
          <div class="tools">
            <button class="icon-button notification-button" type="button" title="消息通知" aria-label="消息通知，${count}条未读">
              ${window.BompIcons.create("bell", { size: 20 })}
              ${count ? `<span class="badge">${count > 99 ? "99+" : count}</span>` : ""}
            </button>
            <button class="user-button" type="button" title="个人账号">
              <span class="avatar">${avatarContent}</span>
              <span class="user-name">${userName}</span>
              ${window.BompIcons.create("chevronDown", { size: 15 })}
            </button>
          </div>
        </header>
      `;

      this.shadowRoot.querySelector(".notification-button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("notifications-click", { bubbles: true }));
      });
      this.shadowRoot.querySelector(".user-button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("user-menu-click", { bubbles: true }));
      });
    }
  }

  if (!customElements.get("bomp-header")) {
    customElements.define("bomp-header", BompHeader);
  }
})();
