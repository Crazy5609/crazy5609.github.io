# 文件操作弹窗

组件 ID：`file-action-dialogs`

用于文件分享和权限管理的通用弹窗。页面引入组件脚本并放置元素：

```html
<bomp-file-action-dialogs id="fileActionDialogs"></bomp-file-action-dialogs>
```

调用 `openShare(file)` 打开分享弹窗，调用 `openPermission(file)` 打开权限管理弹窗。组件会分别触发 `share-success`、`share-link-copied` 和 `permission-saved` 事件，页面负责展示统一操作反馈。

组件复用 `components/base.css` 中的弹窗、按钮和表单基础样式；页面必须先引用基础样式，并加载 `components/icons.js`。
