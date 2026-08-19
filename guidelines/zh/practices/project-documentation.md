---
id: practices/project-documentation
lang: zh
version: 6
source-lang: en
status: active
digest: 69cfcc70
---

# 必备项目文档

每个项目必须维护 `AGENTS.md`、`README.md`、`DEVELOPMENT.md` 与 `CONTRIBUTING.md`。项目一旦形成有实际意义的架构边界，`ARCHITECTURE.md` 也成为必备文档。以 `templates/` 下的模板为起点。

文档分工遵循 [Diátaxis](https://diataxis.fr/)：README 负责指引与分流；`DEVELOPMENT.md` 与 `CONTRIBUTING.md` 兼具操作指南与参考；`ARCHITECTURE.md` 负责解释；`AGENTS.md` 是面向 Agent 的参考。一个文档只承担一种模式——需要其他模式的内容时，链接到承担它的文档，不要混写在一起。

## AGENTS.md

每个项目必须在仓库根目录包含 `AGENTS.md`。

它是面向 Agent 的入口文档：命令、工程标准、仓库结构、边界、已确认的语言政策与项目约定。

编写规则——载体选择、章节顺序、篇幅、嵌套文件——见[编写 AGENTS.md](agents-file.md)。

模板：[project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

每个项目必须包含 `README.md`。

README 是项目的门面，读者多半只是扫读：首屏之内要说清项目是什么、解决什么需求、怎么跑起来。它把读者引向合适的详细文档，本身不教学、不罗列机制、不解释背景——这些是详细文档各自的模式。面向 Agent 的规则——工程标准、已确认的语言政策、项目约定——写在 `AGENTS.md` 中（参见 `templates/project-agents.template.md`）；README 通过一条可复制的指令把仓库交给 Agent。

正文应围绕读者任务组织，而不是围绕仓库目录结构展开。不要单设 Why 章节；按以下顺序组织：

- 身份块：项目名称、一句话标语（说明项目是什么、面向谁），以及状态徽章；紧随其后用一到三句平实的话说明项目解决的需求。仅在能为读者省时间时，才提项目明确不做什么及其状态。
- 项目有可视的输出——UI、CLI 输出、生成产物——时，在开篇之后紧接着放截图或短 GIF。
- 只设一个上手章节：需要开发者参与的项目用 `Quick Start`，面向普通用户的产品用 `Usage`，两者兼备时用 `Usage / Quick Start`。章节内先给 AI 路径——通过 `AGENTS.md` 把仓库交给 AI 编码 Agent 的可复制指令——再给人工步骤：前置条件（工具链、支持的平台、锁定版本）、可复制的命令，以及预期结果。面向普通用户的产品，用两三个最常见用法作示例，并给出预期输出。
- 上手章节与 Learn More 之间是一块可自由拼搭的展示区，只用项目需要的板块：`Concepts`——读者需要掌握的少数几个概念；`Features`——项目做什么、为何重要、与替代品有何差异；`Performance`——一句话性能主张，配上证明它的图表或表格、测量环境和方法论链接，没有数字就不要下结论；`Experience`——实际使用的体验，以演示或录屏呈现。板块顺序取决于项目最想证明什么；每个板块配一个标准标题和一个 emoji。
- 一张“目标 → 阅读”表，链接到下文的详细文档。
- 明确声明的许可证。

章节标题用标准、简短、一眼能认出的名字——`Quick Start`、`Usage`、`Concepts`、`Features`、`Performance`、`Experience`、`Learn More`、`License`——并在每个标题前加一个含义固定的 emoji：上手章节用 🚀，概念用 💡，特性用 ✨，性能用 ⚡，体验用 🎬，延伸阅读用 📚，许可证用 📄。emoji 保持少而统一；项目标题与正文不使用 emoji。

过长的辅助内容——平台相关的搭建、环境变量表、扩展示例、故障排查——折叠进 `<details>` 块，`<summary>` 用几个词点明内容。`<summary>` 之后留一个空行，保证 Markdown 正常渲染；核心内容绝不折叠：开篇、上手命令和许可证始终保持展开。

正文要便于扫读：段落一到三句，每个要点只讲一件事，可复制的命令放进代码块。并列的内容用列表或表格呈现，不要连成大段文字。链接到详细文档而不是重复其内容——教学、参考、解释是它们的模式，不是 README 的——但也绝不要把 README 缩成一句“参见文档”：它必须能独立充当入口。篇幅超过几屏后，加上目录。

过时的 README 比没有更糟，它会把读者引向错误的做法。凡是改变搭建、用法或范围的变更，都要在同一变更中更新 README；开发放缓或停止时，在开头写明。

已确认的产品/UI 语言政策（参见[语言政策](language-policy.md)）面向 Agent：应记录在 `AGENTS.md` 中，不要写入 README。

模板：[README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

每个项目必须包含 `DEVELOPMENT.md`。

它兼具操作指南与参考两种角色：先按步骤讲清工作流，再列命令与配置。

它应描述：

- 开发工作流
- 工具链
- 常用 mise 任务
- 编码标准
- 测试工作流
- 本地环境搭建
- 校验工作流
- 部署工作流（如适用）

它应让人类和 AI Agent 都能据此了解应如何进行开发。

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

对于 AI 生成或 AI 辅助的 pull request，其描述应明确包含：

- 变更目的
- 变更影响
- 相关背景或上下文
- 潜在风险或顾虑
- 已执行的测试或校验

GitHub 的 pull request 模板必须与这些要求保持同步。

模板：[CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

项目一旦形成有实际意义的架构边界，就应维护 `ARCHITECTURE.md`。

保持简短，便于执行。

它的定位是解释——讲清边界背后的原因——而不是面面俱到的参考。

它应包含简要概览、粗粒度的代码地图（列出模块名称，不要链接文件）以及架构不变量。

不要把它写成面面俱到的理论架构文档。

它的首要目的是防止架构在无意中发生漂移。

不变量与 ADR 实践见[架构治理](architecture-governance.md)。

模板：[ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
