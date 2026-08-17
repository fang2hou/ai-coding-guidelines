---
id: practices/testing
lang: zh
version: 2
source-lang: en
status: active
digest: d2833d94
---

# 测试策略

测试应当校验有实际意义的行为。

不要仅为提高覆盖率而编写测试。

添加测试前，先明确该测试要检测哪种失败模式。

优先覆盖：

- 核心业务逻辑
- 重要用户行为
- 已知容易出错的路径
- 边界条件
- 错误处理
- 异常情况
- 集成边界

覆盖率指标可提供参考，但覆盖率百分比本身不是目标。

目标是对重要行为能否正确运行有信心。

## 前端 E2E 测试

只要实际可行，前端项目就应包含 E2E 测试。

E2E 测试应重点覆盖：

- 主要用户流程
- 产品的关键行为
- 重要集成行为

优先使用接近真实情况的测试数据。

需要类似生产环境的数据时，使用经过妥善匿名化或脱敏处理的数据。

禁止在测试夹具中暴露生产环境的敏感信息。

控制 E2E 测试的执行时间。

不要构建庞大的 E2E 测试套件：如果它会显著拖慢快速校验流程，却不能带来相应的信心，就不应构建（参见[质量门禁](../toolchain/quality-gates.md)）。

使用 Playwright 的项目，应通过 `jsPlugins` 数组将 `eslint-plugin-playwright` 加载到 oxlint 中。该插件已通过 oxlint 的官方一致性测试；oxlint 的 JS 插件支持目前处于 alpha 阶段。

应通过一个 `overrides` 条目将这些规则限定在 Playwright 测试文件中，避免它们作用于应用代码。

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["eslint-plugin-playwright"],
  "overrides": [
    {
      "files": ["e2e/**/*.ts"],
      "rules": {
        "playwright/no-networkidle": "error",
        "playwright/no-wait-for-timeout": "warn",
      },
    },
  ],
}
```

## 前端单元测试

只要实际可行，前端项目就应为重要组件和逻辑编写单元测试。

在有助于提升测试质量时，使用经过脱敏处理、接近真实情况的数据。

优先覆盖：

- 重要组件行为
- 业务逻辑
- 状态转换
- 数据变换
- 边缘情况
- 错误情况

单元测试应保持快速。

避免编写仅重复实现细节的测试。
