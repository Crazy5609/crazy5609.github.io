# 顶部栏

组件 ID：`app-header`

展示固定在页面顶部、横跨侧边导航与内容区的 BOMP 系统顶部栏。组件高 56px，使用统一的纯色深青绿 `#10A69A`。系统级导航相对整个视口水平居中，左右两侧分别承载品牌和用户操作。

左侧默认显示完整的国家电网公司及国网物资有限公司组合标识，组合标识使用透明底；白色竖线之后直接显示“企业经营管理系统 / BOMP”两行文字，不再重复显示独立的国家电网圆形标志。中间导航依次为：首页、管理看板、经营管理、知识共享、人工智能、供应链业务数据、系统管理，默认高亮“人工智能”。右侧依次显示“退出登录”和“您好，孙鹏飞”。

```html
<bomp-header
  system-name="企业经营管理系统"
  system-code="BOMP"
  active-module="artificial-intelligence"
  user-name="孙鹏飞">
</bomp-header>
```

可通过 `system-name`、`system-code`、`active-module`、`user-name` 和 `company-identifier` 属性配置。组件触发 `module-navigation-change`、`logout-click` 和 `user-menu-click` 事件。

组件内所有按钮统一使用 2px 圆角，与项目全局按钮规范一致。
