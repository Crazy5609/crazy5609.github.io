# 搜索历史面板

组件 ID：`search-history-panel`

用于 AI 问答、搜知识和搜图片页面的检索历史侧栏。面板提供历史记录列表与“收起”操作，点击记录触发 `history-select` 事件，收起触发 `history-close` 事件。

```html
<bomp-search-history-panel id="searchHistoryPanel" hidden></bomp-search-history-panel>
```

页面负责控制面板的显示、与其他上下文侧栏互斥，以及关闭后的焦点恢复。组件公开 `focusClose()`，供面板打开后聚焦收起按钮。
