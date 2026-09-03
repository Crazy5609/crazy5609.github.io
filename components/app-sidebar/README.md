# 侧边导航

组件 ID：`app-sidebar`

使用 `<bomp-sidebar>` 渲染知识共享中心主导航。`active` 指定当前菜单，`collapsed` 控制收起状态。

```html
<bomp-sidebar active="company-library"></bomp-sidebar>
```

组件触发 `navigation-change` 和 `sidebar-toggle` 事件。菜单可通过元素的 `sections` 属性传入；默认菜单将“管理知识库”和“审核工作台”作为独立入口。
