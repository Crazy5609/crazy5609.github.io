# BOMP 原型项目 Codex 接手说明

更新时间：2026-10-27

## 1. 接手目标

本项目是 BOMP 知识共享中心桌面端 HTML 原型。后续工作应在现有页面、公共组件、目录数据和视觉规范上继续迭代，不要另起一套框架或复制公共组件。

技术栈固定为纯 HTML、CSS 和原生 JavaScript，不需要安装前端框架。

## 2. 开始前必读

按以下顺序阅读：

1. `AGENTS.md`
2. `docs/project-background.md`
3. `docs/prototype-guidelines.md`
4. `components/README.md`
5. `components/registry.json`
6. `docs/decision-log.md`

用户后续明确批注高于历史规则；确认新口径后同步更新规则和决策记录。

## 3. 本地启动

在项目根目录执行：

```powershell
. .\scripts\use-local-env.ps1
python -m http.server 4173 --bind 127.0.0.1
```

首页：

```text
http://127.0.0.1:4173/pages/prototype-suite/home.html
```

如果 4173 端口已占用，可换用其他本地端口。不要将服务绑定到公网地址。

## 4. 核心目录

- `pages/prototype-suite/`：当前原型套件页面、页面样式和交互逻辑。
- `pages/prototype-suite/suite.js`：大部分页面渲染、演示数据和交互入口。
- `pages/prototype-suite/suite.css`：原型套件页面样式。
- `components/`：顶部栏、侧边栏、知识表格、文件操作弹窗、历史记录面板等公共组件。
- `components/registry.json`：组件版本和 `usedBy` 页面登记。
- `知识目录/`：部门级和公司级真实目录数据源。
- `scripts/verify-prototype-suite.js`：原型结构和关键规则回归校验。
- `scripts/visual-qa-*.js`：专项视觉检查脚本，部分脚本依赖本机 Playwright 运行时。

## 5. 公共数据源

- 部门目录：`知识目录/部门级、公司级文件共享层级示例_供应链运营中心 .xlsx`
- 公司目录：`知识目录/公司级.xlsx`
- 运行时公共对象：`window.BompDepartmentDirectoryData`、`window.BompCompanyDirectoryData`
- 公共侧边栏和目录管理页必须复用相同目录数据，不得维护页面私有副本。

## 6. 当前重点页面

- 首页：`pages/prototype-suite/home.html`
- 最近使用：`pages/prototype-suite/my-library.html`
- 我的知识：`pages/prototype-suite/my-knowledge.html`
- 我的上传：`pages/prototype-suite/my-uploads.html`
- 审核工作台：`pages/prototype-suite/review-workbench.html`
- 公司知识管理：`pages/prototype-suite/company-knowledge-management.html`
- 标签管理：`pages/prototype-suite/tag-management.html`

## 7. 最新已确认口径

- 首页不展示“高级搜索”；知识库范围、附件、图片和发送能力保留。“搜知识”页面仍保留高级搜索。
- 我的上传状态 Tab 左侧集中，五项固定 148px 等宽排列，使用主题绿激活文字和底部短线。
- 我的上传列表不展示“智能处理结果”；公司知识库管理的上传任务仍保留该字段。
- 我的上传列表列宽：名称自动吸收剩余空间，文件大小 10%、上传时间 15%、当前状态 13%、操作 22%。
- 公司知识管理左侧只展示两级目录；有子级目录时右侧使用标准表格展示文件夹。
- 公司知识管理文件夹列表字段为文件夹名称、创建时间、操作；操作包括下架、删除、重命名、调整所属目录。
- 公司知识管理搜索图标嵌入搜索框右端，文件夹操作内容靠右贴齐表格末端。
- 公共导航不展示个人中心；我的上传、我的共享、回收站归入我的知识库，审核工作台为独立一级入口。

完整口径以 `AGENTS.md` 和 `docs/decision-log.md` 为准。

## 8. 修改规则

- 通用 UI 优先修改 `components/`，并同步所有 `usedBy` 页面和组件登记。
- 页面专属样式必须使用页面或业务作用域，避免污染其他页面。
- 设计基准为 1440px，至少检查 1280px，不得产生横向滚动。
- 名称列优先自动吸收空间，其他列按内容长度分配比例；名称最多两行，其他字段保持单行。
- 删除、下架等危险操作使用确认交互；成功提示 2 秒自动消失。
- 所有项目缓存、临时文件、截图和产物保存在项目目录内，运行生成文件的命令前先加载 `scripts/use-local-env.ps1`。

## 9. 每轮校验

至少执行：

```powershell
node --check pages/prototype-suite/suite.js
node scripts/verify-prototype-suite.js
```

页面改动后还应在 1440px 和 1280px 视口检查：

- 页面无横向滚动。
- 文本和操作不重叠、不截断关键内容。
- 导航高亮、筛选、状态切换、弹窗和列表操作可点击。
- 修改范围之外的页面没有被公共样式误伤。

## 10. 打包说明

本接手包包含当前工作区的实际源码和未提交修改，不依赖 Git 历史即可继续开发。包内不包含 `.git`、缓存、临时目录、测试截图、旧输出产物或根目录的 `原型图片/` 参考图。
