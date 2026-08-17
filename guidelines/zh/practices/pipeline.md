---
id: practices/pipeline
lang: zh
version: 1
source-lang: en
status: active
digest: 525b30e9
---

# 流水线

## 适用范围

这些规则适用于任何系统中的 CI/CD 流水线——GitHub Actions、GitLab CI、CircleCI、Jenkins 或其他系统。所选系统的专属规则见对应的工具链文档。

## 默认选择

用户未指定流水线系统时，默认使用 GitHub Actions。平台专属规则见 [GitHub Actions](../toolchain/github-actions.md)。

## 复杂度增加时的结构调整

由一串平铺命令组成的流水线一旦变大，就会失去可读性。应使用所选工具推荐的原语——stage、job、独立文件——来组织结构，而不是不断堆叠匿名 step。

- 每个流水线单元只承载一个关注点：一个流水线文件对应一个触发条件或受众，一个 job 对应一项职责，一个 step 对应一条命令。
- 优先使用多个较小的流水线文件，不要让单个文件不断膨胀。
- 调用项目自身的任务，而不是把项目逻辑复制进流水线 YAML（见 [mise](../toolchain/mise.md)）。

## 命名与可读性

流水线的每一层都必须能仅凭运行日志说明其作用。

- 给流水线、每个 job、每个 step 都命名。
- 名称表达职责，而不是工具调用：使用 `Validate`，而不是 `cog`。
- step 名称应使用简短的祈使短语，说明该 step 执行或校验的内容。在运行日志中显示为原始命令的 step，实际上等同于未命名 step；命令不是文档。

## 相关文档

- [GitHub Actions](../toolchain/github-actions.md)——默认平台；工作流命名与加固规则。
- [质量门禁](../toolchain/quality-gates.md)——本地与 CI 运行同一套检查。
