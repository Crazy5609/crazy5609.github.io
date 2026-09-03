# 知识文件表格

组件 ID：`knowledge-table`

用于公司知识库、部门知识库、个人知识库等文件列表。默认包含 8 条知识库风格数据，也可以通过元素的 `rows` 属性传入页面数据。

```html
<bomp-knowledge-table id="knowledgeTable"></bomp-knowledge-table>
```

调用 `filter(query)` 可执行前端过滤。预览、下载、AI 速读和更多按钮统一触发 `table-action` 事件；双击行触发 `row-open` 事件。
