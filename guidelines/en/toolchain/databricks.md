---
id: toolchain/databricks
lang: en
version: 1
source-lang: en
status: active
digest: 2caf9102
---

# Databricks

## Apps vs Jobs

Databricks is the preferred platform for relevant data and AI workloads.

For applications, prefer Databricks Apps when appropriate for hosting and application management.

Use Databricks Jobs when scheduling or automated execution is required.

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

Deployment configuration must reflect the current supported Databricks Apps environment and deployment model.

When editing deployment configuration, verify that environment-related settings remain compatible with the current project requirements.

## Permissions

Deployment configuration may define appropriate access permissions.

When appropriate, allow members of the same project or team the necessary edit access.

Do not unintentionally broaden permissions beyond the intended project boundary.

Python services that back a Databricks workload follow the [Python API Stack](../libraries/python-api-stack.md).
