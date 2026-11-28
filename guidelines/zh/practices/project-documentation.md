---
id: practices/project-documentation
lang: zh
version: 8
source-lang: en
status: active
digest: eb338d47
---

# 必备项目文档

每个项目必须维护 `AGENTS.md`、`README.md`、`DEVELOPMENT.md` 与 `CONTRIBUTING.md`。项目一旦形成有实际意义的架构边界，`ARCHITECTURE.md` 也成为必备文档。以 `templates/` 下的模板为起点。

文档分工遵循 [Diátaxis](https://diataxis.fr/)：`README.md` 向人类读者介绍项目并帮助上手；`DEVELOPMENT.md` 与 `CONTRIBUTING.md` 兼具操作指南与参考；`ARCHITECTURE.md` 负责解释；`AGENTS.md` 是面向 Agent 的参考。一个文档只承担一种模式。需要其他模式的内容时，链接到承担它的文档，不要混写在一起。

## AGENTS.md

每个项目必须在仓库根目录包含 `AGENTS.md`。

它是面向 Agent 的入口文档：命令、工程标准、仓库结构、边界、已确认的语言政策与项目约定。

编写规则（内容归属、章节顺序、篇幅限制和嵌套文件）见[编写 AGENTS.md](agents-file.md)。

模板：[project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

每个项目必须包含 `README.md`。

### 读者与定位

`README.md` 面向人类读者，用来讲清项目是什么、做什么以及如何上手运行。它应独立承担项目入口的职责，不要把教程、内部参考手册或长篇背景说明搬进来。

不要把 `README.md` 写成仓库文件导航页或“目标 → 阅读”索引表。主流 AI 编码 Agent 会自动发现 `AGENTS.md` 和 `docs/`，仓库结构与内部文档链接也已经记录在 `AGENTS.md` 中。

面向 Agent 的规则（工程标准、[语言政策](language-policy.md)中确认的产品/UI 语言政策，以及项目约定）应写在 `AGENTS.md` 中，不要写入 `README.md`。

### 结构与版式

正文围绕人类读者最先需要的信息组织，而不是照搬仓库目录结构。不要单设 Why 章节，按以下顺序组织：

- **顶部首屏块**：用 `<div align="center">` 居中排布，依次放置可选的 logo 或横幅图、单个 `# 项目名` 标题（若 logo 已含项目名则省略）、一句话标语（交代项目是什么、面向谁）、可选的导航链接栏，以及统一使用 `flat-square` 样式（`style=flat-square`）的精简状态徽章。
- **开篇概述**：用一到三句平实的话说明项目做什么以及解决什么问题。仅在能帮读者省时间时，才说明范围边界或项目状态。
- **视觉预览（可选）**：当项目有可视界面或输出（UI、CLI 输出、生成产物）时，紧接开篇概述放置截图或短 GIF。
- **用户安装与使用**：把最终用户的安装使用步骤与贡献者工具链清晰分开。对于可安装的程序、CLI、软件包或可下载资源（如字体），先设 `## 📦 Installation`（或 `## 📦 Download & Install`）章节，再设 `## 🚀 Usage` 展示两三个常见用法及预期输出。不向最终用户分发的纯开发仓库，省略 `Installation`，改用 `## 🚀 Quick Start`。
- **可选展示板块**：只保留项目真正需要的板块，按读者最关心的顺序排列：
  - `Features`：平实说明项目具备哪些能力。内容较丰富的项目，使用带编号的 ``### `1` `` / ``### `2` `` 子章节，每项一到两句；内容紧凑的项目，改用两列表格或自然完整的句子列表。
  - `Concepts`：仅当项目在设计思路或切入角度上明显不同于同类方案时才保留。
  - `Performance`：仅面向性能优化或性能敏感场景的项目保留。先用一句话给出性能结论，再附上支撑图表或表格、测量环境（硬件、运行时版本、日期）以及复现方法链接。每条性能结论都必须有数据支撑。
  - `Experiments`：仅当项目包含实验性能力时保留。
- **本地开发**：面向仓库开发者的本地环境步骤（`mise install`、`mise run dev`、必需的环境变量和外部服务）单独放在 `## 🛠️ Development` 章节，不要把贡献者命令混进面向用户的 `Installation` 或 `Usage`。
- **贡献说明**：仅非个人项目保留简短的 `## 🤝 Contributing` 章节，链接到 `DEVELOPMENT.md`、`CONTRIBUTING.md` 及已有的 `ARCHITECTURE.md`。如果不确定项目属于个人还是协作性质，先向用户确认再决定是否添加。
- **许可证**：在 `## 📄 License` 下直接写出 SPDX 标识符（例如 `MIT`，可将其直接链接到 `LICENSE` 文件），不要写 `MIT — see LICENSE` 这类冗余措辞。

较长的次要信息（平台相关配置、环境变量表、扩展示例、故障排查）折叠进 `<details>` 块，用简短的 `<summary>` 标明内容，并在 `<summary>` 后留一个空行，保证 Markdown 正确渲染。开篇、核心用户命令和许可证始终保持展开。

### AI Agent 使用说明

不要在 `README.md` 中放模板化的 AI 交接提示词（例如“把下面这段粘贴给 Agent，让它先读 `AGENTS.md`”）。

常规项目直接在 `README.md` 中省略 AI 使用说明，因为编码 Agent 会自行读取 `AGENTS.md`。只有当项目提供专门的 AI 入口或非默认 Agent 工作流（例如可安装的 Agent skill、MCP 服务或自定义路由文件）时，才写一小段简洁的 AI 配置说明。

### 标题、格式与语气

保持干净的 Markdown 标题层级：顶部最多只用一次 `#` 写项目名（logo 已含项目名时省略），主章节用 `##`，子章节用 `###`。不要使用多个一级标题、分享按钮行或营销口号。

每个 `##` 主章节标题开头都必须带一个语义贴合的 emoji。标准 `##` 章节使用固定搭配：安装下载用 📦（`Installation` / `Download & Install`），使用与上手用 🚀（`Usage` / `Quick Start`），特性用 ✨（`Features`），概念用 💡（`Concepts`），性能用 ⚡（`Performance`），实验用 🧪（`Experiments`），本地开发用 🛠️（`Development`），贡献用 🤝（`Contributing`），许可证用 📄（`License`）。当 ``### `1` `` / ``### `2` `` 编号标题或纯文本更清晰时，不要强行给 `###` 标题加 emoji。项目名 `#` 标题和正文都不加 emoji。

禁止以下格式写法：

- 严禁在链接栏中使用 `·`（间隔号/中点）作分隔符，统一改用 `|` 或独立徽章：

```markdown
<!-- 避免 -->
[Docs](...) · [Changelog](...)
[English](...) · [中文](...) · [日本語](...)

<!-- 改用 -->
[Docs](...) | [Changelog](...)
[English](...) | [中文](...) | [日本語](...)
```

- 严禁使用 `- **术语** — 说明` 这种加粗词配破折号的列表套路，整篇 README 也应尽量少用破折号（`—` / `——`），改用逗号、冒号、括号、完整句子、`###` 子章节或两列表格。

行文保持务实、直接、自然：

- 如实写清项目做什么，基础但核心的功能也要直接写出来。不要写“与替代品相比如何领先”的宣传话术，也不要堆砌夸饰词（如 `powerful`、`seamless`、`modern-design`、`revolutionary`、`easy`、`simple`、`轻松`、`极致`、`无缝`、`强大`）。
- 段落控制在一到三句，可复制命令放进代码块，并列项用列表或表格呈现，不要堆成长段文字。
- 只有当 README 超过几屏时，才补充目录。

### 维护

让 `README.md` 在日常更新中保持稳定。不要写入容易过时的动态计数或内部标识符（例如文档、规则或文件的精确数量，或命令预期输出中的具体数字），避免每新增一项内容或一种语言就要改动 `README.md`。只有在发生重大变更、安装或用法调整，或者阶段性重构时，才需要更新 `README.md`。

过时的 README 比没有更糟，它会把读者引向错误的做法。凡是改变安装、用法或适用范围的改动，都要同步更新 `README.md`；开发放缓或停止时，在开头写明。

模板：[README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

每个项目必须包含 `DEVELOPMENT.md`。

先按步骤说明开发工作流，再提供命令与配置参考。

它应描述：

- 开发工作流
- 工具链
- 常用 mise 任务
- 编码标准
- 测试工作流
- 本地环境搭建
- 校验工作流
- 部署工作流（如适用）

人和 AI Agent 都应能照着文档开展开发工作。

模板：[DEVELOPMENT.template.md](../../../templates/DEVELOPMENT.template.md)

## CONTRIBUTING.md

每个项目必须包含 `CONTRIBUTING.md`。

它是一份操作指南：按步骤说明如何提交并合入一个变更，不写背景长文。

它应记录：

- 贡献要求
- issue 工作流（如适用）
- pull request 工作流
- 评审要求
- 必须执行的校验
- 提交规范

每个 pull request 的描述都应明确包含：

- 变更目的
- 变更影响
- 相关背景或上下文
- 潜在风险或顾虑
- 已执行的测试或校验

GitHub 的 pull request 模板必须与这些要求保持同步。

模板：[CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

项目一旦形成有实际意义的架构边界，就必须维护 `ARCHITECTURE.md`。

保持简短实用：包含简要概览、代码库的整体结构（只列模块名，不链接具体文件）以及架构不变量。

它的职责是讲清边界背后的原因，防止架构在不知不觉中走样，而不是写成面面俱到的参考手册或空泛的理论长文。

不变量与 ADR 规则见[架构治理](architecture-governance.md)。

模板：[ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
