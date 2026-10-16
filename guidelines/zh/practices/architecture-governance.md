---
id: practices/architecture-governance
lang: zh
version: 1
source-lang: en
status: active
digest: 7119d383
---

# 架构治理

## 架构不变量

在 `ARCHITECTURE.md` 中明确记录架构边界和不变量，防止 AI Agent 无意间打破它们。

常见内容包括：

- 领域逻辑属于哪一层
- 哪些模块可以调用外部 API
- 认证边界
- 状态管理边界
- Databricks 访问边界
- 前后端职责划分
- 依赖方向
- 集成边界

`ARCHITECTURE.md` 应保持简短，专注回答一个问题：

> **当前架构有哪些事实必须始终成立？**

何时必须编写该文档，见[必备项目文档](project-documentation.md)。

## 架构决策记录

每项重大架构决策都应使用共享的 [ADR 模板](../../../templates/adr.template.md) 单独记录。

一篇 ADR 应包含：

- 背景
- 决策
- 考虑过的替代方案
- 理由
- 后果

ADR 是架构护栏，而非不可更改的铁律；它的作用是防止贡献者和 AI Agent 在无意间改动架构。

当用户请求与某项 ADR 冲突时：

1. 理解用户的真实意图。
2. 弄清该 ADR 存在的原因。
3. 评估修改该决策的影响。
4. 在合理的情况下，优先选择与既有架构兼容的方案。
5. 如果架构确实需要变更，说明其影响。
6. 明确更新或废止该 ADR。

禁止悄悄违反 ADR。

当用户不确定架构是否应当改动时，先帮助用户分析后果，再实施变更。
