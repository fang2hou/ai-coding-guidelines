---
id: practices/pipeline
lang: zh
version: 1
source-lang: en
status: active
digest: 42c4954c
---

# 流水线

## 适用范围

这些规则适用于任何系统的 CI/CD 流水线——GitHub Actions、GitLab CI、CircleCI、Jenkins 或其他。所选系统的专属规则见对应的 toolchain 文档。

## 默认选择

用户没有特别指定流水线系统时，默认使用 GitHub Actions。平台专属规则见 [GitHub Actions](../toolchain/github-actions.md)。

## 复杂度增长时的结构化

以一串平铺命令起步的流水线，一旦变大就不再可读。要用所选工具推荐的原语去规整它——stage、job、独立文件——而不是不断堆叠匿名 step。

- 每个流水线单元只承载一个关注点：一个流水线文件对应一个触发条件或受众，一个 job 对应一项职责，一个 step 对应一条命令。
- 宁可用多个小流水线文件，也不要养出一个不断膨胀的文件。
- 调用项目自身的任务，而不是把项目逻辑复制进流水线 YAML（见 [mise](../toolchain/mise.md)）。

## 命名与可读性

流水线的每一层都必须能仅凭运行记录说清自己在做什么。

- 给流水线、每个 job、每个 step 都命名。
- 名字表达职责，而不是工具调用：用 `Validate`，不用 `cog`。
- step 名用简短的祈使短语，说明它做什么或验证什么。在记录里显示为原始命令的 step 事实上就是无名 step，而命令不是文档。

## 相关文档

- [GitHub Actions](../toolchain/github-actions.md)——默认平台；工作流命名与加固规则。
- [质量门禁](../toolchain/quality-gates.md)——本地与 CI 运行同一套检查。
