---
id: toolchain/databricks
lang: zh
version: 1
source-lang: en
status: active
digest: 5e437c2e
---

# Databricks

## Apps 与 Jobs 的选择

对相关的数据与 AI 工作负载,Databricks 是首选平台。

对应用而言,当托管与应用管理合适时,优先使用 Databricks Apps。

需要调度或自动执行时,使用 Databricks Jobs。

## 默认工作时段

对应用只应在工作时间内运行的项目,默认工作时段为:

```text
09:00 - 22:00 GMT+9
```

除非项目另有明确要求。

## 部署文件

Databricks 部署 YAML 及相关部署配置统一存放于:

```text
/deploy
```

部署配置必须反映当前受支持的 Databricks Apps 环境与部署模型。

编辑部署配置时,核对环境相关设置是否仍与当前项目需求兼容。

## 权限

部署配置可以定义适当的访问权限。

在合适的场景,给予同项目或同团队成员必要的编辑权限。

不要无意间把权限扩大到预期项目边界之外。

为 Databricks 工作负载提供支撑的 Python 服务遵循 [Python API Stack](../libraries/python-api-stack.md)。
