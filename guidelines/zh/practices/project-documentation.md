---
id: practices/project-documentation
lang: zh
version: 6
source-lang: en
status: active
digest: 9b013c32
---

# 必备项目文档

每个项目必须维护 `AGENTS.md`、`README.md`、`DEVELOPMENT.md` 与 `CONTRIBUTING.md`。项目一旦形成有实际意义的架构边界，`ARCHITECTURE.md` 也成为必备文档。以 `templates/` 下的模板为起点。

## AGENTS.md

每个项目必须在仓库根目录包含 `AGENTS.md`。

它是面向 Agent 的入口文档：命令、工程标准、仓库结构、边界、已确认的语言政策与项目约定。

编写规则——载体选择、章节顺序、篇幅、嵌套文件——见[编写 AGENTS.md](agents-file.md)。

模板：[project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

每个项目必须包含 `README.md`。

README 是项目的门面，面向人类读者：首屏之内必须回答项目是什么、为何存在、如何开始使用。面向 Agent 的规则——工程标准、已确认的语言政策、项目约定——写在 `AGENTS.md` 中（参见 `templates/project-agents.template.md`）；README 通过一条可复制的指令把仓库交给 Agent。

README 必须以身份块开头：项目名称、一句话标语（说明项目是什么、面向谁），以及状态徽章。当项目具有视觉呈现——UI、CLI 输出、生成产物——时，在身份块之后紧接着放置截图或简短的 GIF。

正文应围绕读者任务组织，而不是围绕仓库目录结构展开。它应包含：

- 项目为何存在、明确不做什么以及项目状态；当替代方案显而易见时，用一句话说明差异
- 快速开始：前置条件（工具链、支持的平台、锁定版本）、可直接复制粘贴的首次运行命令，以及预期结果
- 基本用法与主要工作流，以带预期输出的示例呈现
- 一条可复制的指令，通过 `AGENTS.md` 把仓库交给 AI 编码 Agent
- 一张“目标 → 阅读”表，链接到下文的详细文档
- 去哪里寻求帮助：issue 跟踪器、团队群组或联系方式
- 明确声明的许可证

保持便于扫读：每个段落一至三句，每个要点只讲一件事，可复制的命令放在代码块中。枚举内容应使用列表或表格呈现，不要写成连续的散文。应链接到详细文档，而不是重复其中内容——但也绝不要把 README 缩成一句“参见文档”：它必须能独立充当入口。篇幅超过数屏后，添加目录。

过时的 README 比没有更糟，因为它会主动误导读者。凡是改变搭建方式、用法或范围的变更，都必须在同一变更中更新 README；开发放缓或停止时，在开头明确说明。

已确认的产品/UI 语言政策（参见[语言政策](language-policy.md)）面向 Agent：应记录在 `AGENTS.md` 中，不要写入 README。

模板：[README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

每个项目必须包含 `DEVELOPMENT.md`。

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

它应包含简要概览、粗粒度的代码地图（列出模块名称，不要链接文件）以及架构不变量。

不要把它写成面面俱到的理论架构文档。

它的首要目的是防止架构在无意中发生漂移。

不变量与 ADR 实践见[架构治理](architecture-governance.md)。

模板：[ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
