---
id: practices/project-documentation
lang: zh
version: 4
source-lang: en
status: active
digest: 36df4d67
---

# 必备项目文档

每个项目必须维护以下四份文档。以 `templates/` 下的模板为起点。

## README.md

每个项目必须包含 `README.md`。

README 面向人类读者。面向 Agent 的规则——工程标准、已确认的语言政策、项目约定——写在 `AGENTS.md` 中(见 `templates/project-agents.template.md`)；README 通过一条可复制的指令把仓库交给 Agent。

README 必须以身份块开头：项目名称、一句话标语(说明项目是什么、面向谁)，以及状态徽章。

正文按读者任务组织，而不是按仓库目录结构组织。它应包含：

- 项目为何存在，以及明确不做什么
- 环境搭建说明与首次运行
- 基本用法与主要工作流
- 一条可复制的指令，通过 `AGENTS.md` 把仓库交给 AI 编码 Agent
- 一张"目标 → 阅读"表，链接到下文的详细文档
- 相关的环境要求

保持可扫读：段落一到三句、一个要点只讲一件事、可复制的命令放进代码块。枚举信息用列表或表格呈现，绝不写成连排散文。链接到详细文档，不要复制其内容。

随项目演进保持更新。

已确认的产品/UI 语言政策(参见[语言政策](language-policy.md))是面向 Agent 的：记录在 `AGENTS.md` 中，不要写进 README。

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
- 部署工作流(如适用)

它应让人类和 AI Agent 都能据此理解开发如何进行。

模板：[DEVELOPMENT.template.md](../../../templates/DEVELOPMENT.template.md)

## CONTRIBUTING.md

每个项目必须包含 `CONTRIBUTING.md`。

它应记录：

- 贡献要求
- issue 工作流(如适用)
- pull request 工作流
- 评审要求
- 必须执行的校验
- 提交规范

对于 AI 生成或 AI 辅助的 pull request，描述中应明确包含：

- 变更目的
- 变更影响
- 相关背景或上下文
- 潜在风险或顾虑
- 已执行的测试或校验

GitHub 的 pull request 模板必须与这些要求保持同步。

模板：[CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

具有实质架构边界的项目应维护 `ARCHITECTURE.md`。

保持简短、可操作。

它应包含简要概览、粗粒度的代码地图(命名模块，不链接文件)，以及架构不变量。

避免把它写成面面俱到的理论架构文档。

它的首要目的是防止架构无意间漂移。

不变量与 ADR 实践见[架构治理](architecture-governance.md)。

模板：[ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
