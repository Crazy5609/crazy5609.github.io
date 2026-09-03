# 顶部栏

组件 ID：`app-header`

展示公司标识、产品名称、消息入口和用户入口。可通过属性配置文案、未读数、头像及正式 Logo 图片。

```html
<bomp-header user-name="孙鹏飞" notification-count="8"></bomp-header>
```

侧边栏收起时，为顶部栏增加 `sidebar-collapsed` 属性。组件触发 `notifications-click` 和 `user-menu-click` 事件。
