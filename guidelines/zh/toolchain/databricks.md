---
id: toolchain/databricks
lang: zh
version: 1
source-lang: en
status: active
digest: 30e2fb37
---

# Databricks

## Apps 与 Jobs 的选择

涉及数据与 AI 工作负载时,Databricks 是首选平台。

对应用而言,当 Databricks Apps 适合承担托管与应用管理时,优先使用它。

需要调度或自动执行时,使用 Databricks Jobs。

## 默认工作时段

若项目要求应用只在工作时间运行,默认工作时段为:

```text
09:00 - 22:00 GMT+9
```

项目另有明确要求的除外。

## 部署文件

Databricks 部署 YAML 及相关部署配置统一存放于:

```text
/deploy
```

部署配置必须反映当前受支持的 Databricks Apps 环境与部署模型。

编辑部署配置时,核对环境相关设置是否仍与当前项目需求兼容。

## 权限

部署配置可以定义适当的访问权限。

在合适的情况下,给同项目或同团队的成员必要的编辑权限。

不要无意间把权限扩大到预期项目边界之外。

支撑 Databricks 工作负载的 Python 服务遵循 [Python API Stack](../libraries/python-api-stack.md)。
