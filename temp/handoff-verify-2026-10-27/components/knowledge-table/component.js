(function () {
  const componentStyles = new URL("component.css?v=1.2.0", document.currentScript.src).href;
  const defaultRows = [
    { id: "WZ-2025-XM-0032", title: "《国网物资公司-2025年企业经营管理系统-设计开发实施项目业务需求说明书》", format: "word", type: "需求说明书", scope: "公司", knowledgeType: "项目文档", directory: "经营管理", uploader: "张伟", uploadedAt: "2026-07-28 09:32" },
    { id: "WZ-2025-XM-0033", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目软件需求说明书", format: "word", type: "需求说明书", scope: "公司", knowledgeType: "制度规范", directory: "规章制度", uploader: "李娜", uploadedAt: "2026-07-27 09:32" },
    { id: "WZ-2025-XM-0034", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目可行性研究报告", format: "pdf", type: "报告", scope: "公司", knowledgeType: "项目文档", directory: "项目立项", uploader: "王建国", uploadedAt: "2026-07-26 09:32" },
    { id: "WZ-2025-XM-0035", title: "国网物资公司-2025年企业经营管理系统-设计开发实施项目技术规范书", format: "word", type: "技术规范", scope: "公司", knowledgeType: "技术资料", directory: "技术规范", uploader: "赵敏", uploadedAt: "2026-07-25 11:32" },
    { id: "WZ-2024-ZD-0018", title: "《国网物资有限公司物资采购管理办法（2024版）》", format: "pdf", type: "管理制度", scope: "公司", knowledgeType: "制度规范", directory: "采购管理", uploader: "陈晨", uploadedAt: "2026-07-24 15:10" },
    { id: "WZ-2025-HT-0012", title: "《物资采购合同示范文本（2025年修订版）》", format: "word", type: "合同范本", scope: "指定部门", knowledgeType: "合同范本", directory: "合同管理", uploader: "刘洋", uploadedAt: "2026-07-23 10:18" },
    { id: "WZ-2025-SJ-0009", title: "《国网物资公司数据治理工作方案（2025-2027年）》", format: "ppt", type: "工作方案", scope: "公司", knowledgeType: "管理制度", directory: "数据治理", uploader: "周林", uploadedAt: "2026-07-22 16:45" },
    { id: "WZ-2025-CZ-0021", title: "国网物资公司供应商管理系统用户操作手册", format: "word", type: "操作手册", scope: "本部门", knowledgeType: "技术资料", directory: "系统运维", uploader: "孙悦", uploadedAt: "2026-07-21 14:06" }
  ];

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function highlightHtml(value, query) {
    const text = String(value == null ? "" : value);
    const terms = String(query || "").trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return escapeHtml(text);
    const pattern = terms
      .map((term) => term.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g, "\\$&"))
      .join("|");
    const matcher = new RegExp("(" + pattern + ")", "gi");
    const exactTerms = terms.map((term) => term.toLowerCase());
    return text.split(matcher).map((part) => (
      exactTerms.includes(part.toLowerCase())
        ? "<mark>" + escapeHtml(part) + "</mark>"
        : escapeHtml(part)
    )).join("");
  }

  function fileLabel(format) {
    return ({ word: "W", pdf: "P", excel: "X", ppt: "P", image: "I", video: "V" })[format] || "F";
  }

  class BompKnowledgeTable extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._rows = defaultRows;
      this._query = "";
    }

    connectedCallback() {
      this.render();
    }

    set rows(value) {
      if (Array.isArray(value)) {
        this._rows = value;
        this.render();
      }
    }

    get rows() {
      return this._rows;
    }

    filter(query) {
      this._query = String(query || "").trim().toLowerCase();
      this.render();
    }

    get visibleRows() {
      if (!this._query) return this._rows;
      return this._rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(this._query)));
    }

    bindEvents() {
      const selectAll = this.shadowRoot.querySelector("[data-select-all]");
      if (selectAll) {
        selectAll.addEventListener("change", () => {
          this.shadowRoot.querySelectorAll("[data-row-select]").forEach((checkbox) => {
            checkbox.checked = selectAll.checked;
          });
        });
      }

      this.shadowRoot.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          this.dispatchEvent(new CustomEvent("table-action", {
            bubbles: true,
            detail: { action: button.dataset.action, id: button.dataset.id }
          }));
        });
      });

      this.shadowRoot.querySelectorAll("[data-row-open]").forEach((button) => {
        button.addEventListener("click", () => {
          const row = this._rows.find((item) => item.id === button.dataset.id);
          if (row && row.restricted) {
            this.dispatchEvent(new CustomEvent("table-action", {
              bubbles: true,
              detail: { action: "apply-permission", id: row.id }
            }));
            return;
          }
          this.dispatchEvent(new CustomEvent("row-open", {
            bubbles: true,
            detail: { id: button.dataset.id }
          }));
        });
      });

      this.shadowRoot.querySelectorAll("tbody tr").forEach((row) => {
        row.addEventListener("dblclick", () => {
          const source = this._rows.find((item) => item.id === row.dataset.id);
          if (source && source.restricted) {
            this.dispatchEvent(new CustomEvent("table-action", {
              bubbles: true,
              detail: { action: "apply-permission", id: source.id }
            }));
            return;
          }
          this.dispatchEvent(new CustomEvent("row-open", {
            bubbles: true,
            detail: { id: row.dataset.id }
          }));
        });
      });
    }

    renderRow(row, index) {
      const format = escapeHtml(row.format || "word");
      const restricted = Boolean(row.restricted);
      return `
        <tr data-id="${escapeHtml(row.id)}" class="${index === 0 ? "is-featured" : ""}${restricted ? " is-restricted" : ""}">
          <td class="select-cell"><input data-row-select type="checkbox" aria-label="选择${escapeHtml(row.title)}"></td>
          <td title="${escapeHtml(row.title)}">
            <div class="file-cell">
              <span class="file-icon file-icon-${format}" aria-hidden="true">${fileLabel(row.format)}</span>
              <button class="file-title-button" type="button" data-row-open data-id="${escapeHtml(row.id)}" title="${restricted ? "申请访问权限" : "查看知识详情"}">
                <span class="file-title">${highlightHtml(row.title, this._query)}</span>
                ${restricted ? `<span class="restricted-mark">${window.BompIcons.create("lock", { size: 13 })} 权限受限</span>` : ""}
              </button>
            </div>
          </td>
          <td>${escapeHtml(row.type)}</td>
          <td>${escapeHtml(row.scope)}</td>
          <td><span class="table-tag">${escapeHtml(row.knowledgeType)}</span></td>
          <td title="${escapeHtml(restricted ? "需申请权限" : row.directory)}">${escapeHtml(restricted ? "需申请权限" : row.directory)}</td>
          <td class="muted">${escapeHtml(row.uploadedAt)}</td>
          <td>
            ${restricted ? `
              <button class="permission-action" type="button" data-action="apply-permission" data-id="${escapeHtml(row.id)}">申请权限</button>
            ` : `
              <div class="row-actions">
                <button class="action-button" type="button" data-action="preview" data-id="${escapeHtml(row.id)}" title="预览" aria-label="预览">${window.BompIcons.create("eye", { size: 17 })}</button>
                <button class="action-button" type="button" data-action="download" data-id="${escapeHtml(row.id)}" title="下载" aria-label="下载">${window.BompIcons.create("download", { size: 17 })}</button>
                <button class="action-button ai-action" type="button" data-action="ai-read" data-id="${escapeHtml(row.id)}" title="AI速读">${window.BompIcons.create("zap", { size: 14 })}<span>AI速读</span></button>
              </div>
            `}
          </td>
          <td>${restricted ? "" : `<button class="more-button" type="button" data-action="more" data-id="${escapeHtml(row.id)}" title="更多操作" aria-label="更多操作">${window.BompIcons.create("moreHorizontal", { size: 19 })}</button>`}</td>
        </tr>
      `;
    }

    render() {
      const rows = this.visibleRows;
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <div class="table-shell">
          ${rows.length ? `
            <table aria-label="知识文件列表">
              <colgroup>
                <col class="col-check"><col class="col-name"><col class="col-type"><col class="col-scope"><col class="col-knowledge-type"><col class="col-directory"><col class="col-time"><col class="col-actions"><col class="col-more">
              </colgroup>
              <thead>
                <tr>
                  <th class="select-cell"><input data-select-all type="checkbox" aria-label="选择全部文件"></th>
                  <th>名称</th><th>文件类型</th><th>公开范围</th><th>知识类型</th><th>所属目录</th><th>上传时间</th><th aria-label="操作"></th><th></th>
                </tr>
              </thead>
              <tbody>${rows.map((row, index) => this.renderRow(row, index)).join("")}</tbody>
            </table>
          ` : '<div class="empty-state">未找到符合条件的知识文件</div>'}
        </div>
      `;
      this.bindEvents();
    }
  }

  if (!customElements.get("bomp-knowledge-table")) {
    customElements.define("bomp-knowledge-table", BompKnowledgeTable);
  }
})();
