(function () {
  var componentStyles = new URL("component.css?v=1.1.0", document.currentScript.src).href;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function fileMark(file) {
    var name = String(file && file.name || "");
    var match = name.match(/\.([A-Za-z0-9]{1,5})$/);
    var ext = String(file && file.ext || (match && match[1]) || "FILE").replace(/^\./, "").toUpperCase();
    return /^[A-Z0-9]{1,5}$/.test(ext) ? ext : "FILE";
  }

  class BompFileActionDialogs extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = "true";
      this.members = [];
      this.render();
      this.bindEvents();
    }

    render() {
      this.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <div class="modal-mask file-action-dialogs__mask" data-dialog="share" hidden>
          <section class="modal modal-medium file-action-dialogs__modal" role="dialog" aria-modal="true" aria-labelledby="fileShareTitle">
            <header class="modal-header modal-title-row">
              <h2 class="modal-heading" id="fileShareTitle">分享文件</h2>
              <button class="page-icon-button modal-close" type="button" data-dialog-close aria-label="关闭分享弹窗"></button>
            </header>
            <div class="modal-body field-stack">
              <p class="file-action-dialogs__file"><span class="file-action-dialogs__file-icon" data-share-mark>DOCX</span><span class="file-action-dialogs__file-name" data-share-name></span></p>
              <div class="field-block"><label for="fileShareScope">访问权限</label><select class="form-control" id="fileShareScope"><option>获得链接的人可查看</option><option>指定人员可查看</option><option>指定人员可编辑</option></select></div>
              <div class="field-block"><label for="fileShareValidity">链接有效期</label><select class="form-control" id="fileShareValidity"><option>7天</option><option>30天</option><option>长期有效</option></select></div>
              <div class="field-block"><label for="fileShareLink">分享链接</label><div class="file-action-dialogs__link-row"><input class="form-control" id="fileShareLink" type="text" readonly><button class="btn" type="button" data-copy-link>复制链接</button></div></div>
            </div>
            <footer class="modal-footer"><button class="btn" type="button" data-dialog-close>取消</button><button class="btn btn-primary" type="button" data-create-share>生成分享链接</button></footer>
          </section>
        </div>
        <div class="modal-mask file-action-dialogs__mask" data-dialog="permission" hidden>
          <section class="modal modal-large file-action-dialogs__modal" role="dialog" aria-modal="true" aria-labelledby="filePermissionTitle">
            <header class="modal-header modal-title-row">
              <div><h2 class="modal-heading" id="filePermissionTitle">权限管理</h2><p class="file-action-dialogs__hint" data-permission-name></p></div>
              <button class="page-icon-button modal-close" type="button" data-dialog-close aria-label="关闭权限管理弹窗"></button>
            </header>
            <div class="modal-body field-stack">
              <div class="file-action-dialogs__member-form"><input class="form-control" type="text" data-member-name placeholder="输入姓名或工号" aria-label="成员姓名或工号"><select class="form-control" data-member-role aria-label="成员权限"><option>管理员</option><option>编辑人</option><option>仅查看</option></select><button class="btn" type="button" data-add-member>添加</button></div>
              <div class="file-action-dialogs__permission-list" data-permission-list></div>
              <p class="file-action-dialogs__hint">权限变更仅用于原型演示，不会持久化保存。</p>
            </div>
            <footer class="modal-footer"><button class="btn" type="button" data-dialog-close>取消</button><button class="btn btn-primary" type="button" data-save-permission>保存设置</button></footer>
          </section>
        </div>`;
      this.querySelectorAll(".modal-close").forEach(function (button) {
        button.innerHTML = window.BompIcons.create("x", { size: 18 });
      });
    }

    bindEvents() {
      var self = this;
      this.querySelectorAll("[data-dialog-close]").forEach(function (button) {
        button.addEventListener("click", function () { self.close(button.closest(".file-action-dialogs__mask")); });
      });
      this.querySelectorAll(".file-action-dialogs__mask").forEach(function (mask) {
        mask.addEventListener("click", function (event) { if (event.target === mask) self.close(mask); });
      });
      this.querySelector("[data-create-share]").addEventListener("click", function () {
        self.dispatchEvent(new CustomEvent("share-success", { bubbles: true, detail: { file: self.currentFile } }));
        self.close(self.querySelector('[data-dialog="share"]'));
      });
      this.querySelector("[data-copy-link]").addEventListener("click", function () {
        var input = self.querySelector("#fileShareLink");
        input.select();
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(input.value).catch(function () {});
        self.dispatchEvent(new CustomEvent("share-link-copied", { bubbles: true }));
      });
      this.querySelector("[data-add-member]").addEventListener("click", function () {
        var input = self.querySelector("[data-member-name]");
        var name = input.value.trim();
        if (!name) { input.focus(); return; }
        self.members.push({ name: name, role: self.querySelector("[data-member-role]").value, note: "新增成员" });
        input.value = "";
        self.renderMembers();
      });
      this.querySelector("[data-permission-list]").addEventListener("click", function (event) {
        var button = event.target.closest("[data-remove-member]");
        if (!button) return;
        self.members.splice(Number(button.dataset.removeMember), 1);
        self.renderMembers();
      });
      this.querySelector("[data-permission-list]").addEventListener("change", function (event) {
        if (!event.target.matches("[data-role-index]")) return;
        self.members[Number(event.target.dataset.roleIndex)].role = event.target.value;
      });
      this.querySelector("[data-save-permission]").addEventListener("click", function () {
        self.dispatchEvent(new CustomEvent("permission-saved", { bubbles: true, detail: { file: self.currentFile, members: self.members.slice() } }));
        self.close(self.querySelector('[data-dialog="permission"]'));
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        var open = self.querySelector(".file-action-dialogs__mask:not([hidden])");
        if (open) self.close(open);
      });
    }

    open(mask) {
      mask.hidden = false;
      var target = mask.querySelector("input, select, button");
      if (target) window.setTimeout(function () { target.focus(); }, 0);
    }

    close(mask) {
      if (mask) mask.hidden = true;
    }

    openShare(file) {
      this.currentFile = file;
      this.querySelector("[data-share-name]").textContent = file.name;
      this.querySelector("[data-share-name]").title = file.name;
      this.querySelector("[data-share-mark]").textContent = fileMark(file);
      this.querySelector("#fileShareLink").value = "https://bomp.sgcc.local/share/" + encodeURIComponent(file.id);
      this.open(this.querySelector('[data-dialog="share"]'));
    }

    openPermission(file) {
      this.currentFile = file;
      this.querySelector("[data-permission-name]").textContent = file.name;
      this.members = [
        { name: "孙鹏飞", role: "创建人", note: "数字化运营中心", fixed: true },
        { name: "李娜", role: "管理员", note: "供应链运营中心" },
        { name: "王建国", role: "编辑人", note: "采购管理部" },
        { name: "赵敏", role: "仅查看", note: "综合管理部" }
      ];
      this.renderMembers();
      this.open(this.querySelector('[data-dialog="permission"]'));
    }

    renderMembers() {
      this.querySelector("[data-permission-list]").innerHTML = this.members.map(function (member, index) {
        var options = ["管理员", "编辑人", "仅查看"].map(function (role) {
          return `<option${role === member.role ? " selected" : ""}>${role}</option>`;
        }).join("");
        return `<div class="file-action-dialogs__permission-row"><span class="file-action-dialogs__avatar">${escapeHtml(member.name.slice(-1))}</span><span class="file-action-dialogs__member-copy"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.note)}</span></span>${member.fixed ? `<span class="tag">创建人</span>` : `<select class="form-control" data-role-index="${index}" aria-label="${escapeHtml(member.name)}的权限">${options}</select>`}<button class="btn btn-danger file-action-dialogs__remove" type="button" data-remove-member="${index}" aria-label="移除${escapeHtml(member.name)}" aria-disabled="${member.fixed ? "true" : "false"}">${window.BompIcons.create("trash2", { size: 16 })}</button></div>`;
      }).join("");
    }
  }

  if (!customElements.get("bomp-file-action-dialogs")) customElements.define("bomp-file-action-dialogs", BompFileActionDialogs);
})();
