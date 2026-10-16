---
id: toolchain/databricks
lang: zh
version: 1
source-lang: en
status: active
digest: b6692548
---

# Databricks

## Apps 与 Jobs 的选择

对于数据和 AI 工作负载，优先选用 Databricks：用 Databricks Apps 托管和管理应用，用 Databricks Jobs 执行定时或自动任务。

## 默认工作时段

若项目要求应用只在工作时间运行，默认工作时段为：

```text
09:00 - 22:00 GMT+9
```

项目另有明确要求的除外。

## 部署文件

Databricks 部署 YAML 和相关部署配置统一放在：

```text
/deploy
```

部署配置应匹配当前支持的 Databricks Apps 部署模型，并与项目的环境要求保持一致。

## 权限

在部署配置中可按需为同项目或同团队成员授予编辑权限，但不要把权限扩大到项目边界之外。

支撑 Databricks 工作负载的 Python 服务遵循 [Python API 技术栈](../libraries/python-api-stack.md)。
