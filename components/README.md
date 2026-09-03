# 原型组件库

本目录是 HTML 原型公共结构、样式和行为的唯一来源。所有页面使用纯 HTML、CSS 和原生 JavaScript，不引入前端框架。

## 基础样式

所有页面必须引用 `components/base.css`。该文件集中维护：

- 国网绿色板、中性色和语义色
- 字体与字号层级
- 1440px 设计基准、1280px 最小适配和桌面端经典布局
- 按钮、表单、弹窗、标签、提示等基础组件样式

页面不得复制这些公共样式。页面专属样式必须限制在页面作用域内。

## 组件目录约定

复杂组件使用独立目录：

```text
components/
  base.css
  component-id/
    component.html
    component.css
    component.js
    README.md
```

没有行为的组件可以省略 `component.js`。

## 基础规格

- 按钮：高 32px、圆角 6px，相邻间距 8px
- 输入框：高 32px、圆角 6px，focus 使用国网绿
- 表单标签：左对齐、宽 100px，必填项显示红色星号
- 弹窗：480px / 640px / 800px，圆角 8px，最大高度 85vh
- 标签：高 24px、圆角 4px、字号 12px，同页不超过 4 种标签颜色
- 成功提示：显示 2 秒后自动消失

完整视觉、交互和数据规则见 `docs/prototype-guidelines.md`。

## 当前组件

| 组件 ID | 名称 | 自定义元素 | 状态 |
|---|---|---|---|
| `base-styles` | 全局基础样式 | - | 可用 |
| `app-sidebar` | 侧边导航 | `<bomp-sidebar>` | 可用 |
| `app-header` | 顶部栏 | `<bomp-header>` | 可用 |
| `knowledge-table` | 知识文件表格 | `<bomp-knowledge-table>` | 可用 |

组合预览入口为 `components/index.html`。

## 登记要求

所有组件都登记在 `registry.json`，字段含义如下：

- `id`：稳定且唯一的英文短横线 ID
- `name`：组件中文名称
- `status`：`draft`、`active` 或 `deprecated`
- `version`：组件版本
- `path`：组件目录或文件
- `usedBy`：使用该组件的页面路径
- `notes`：变更或使用说明

## 修改流程

1. 在 `registry.json` 中找到组件及全部 `usedBy` 页面。
2. 修改组件源码和组件说明。
3. 检索项目中的组件 ID，补足未登记的引用页面。
4. 更新所有引用页面并在 1440px、1280px 视口下逐页检查。
5. 更新组件版本、示例和变更说明。
6. 删除组件前，先完成所有引用页面的替换或移除。
