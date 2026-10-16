---
id: toolchain/databricks
lang: en
version: 1
source-lang: en
status: active
digest: 97ecace8
---

# Databricks

## Apps vs Jobs

Databricks is the preferred platform for data and AI workloads: use Databricks Apps to host applications, and Databricks Jobs for scheduled or automated runs.

## Default Working Window

For projects where the application should only operate during working hours, the default working window is:

```text
09:00 - 22:00 GMT+9
```

unless the project has another explicit requirement.

## Deployment Files

Keep Databricks deployment YAML and related deployment configuration under:

```text
/deploy
```

Keep deployment configuration aligned with the current Databricks Apps deployment model and the project's environment requirements.

## Permissions

Grant edit access to project or team members where appropriate, without widening permissions beyond the project boundary.

Python services that back a Databricks workload follow the [Python API Stack](../libraries/python-api-stack.md).
