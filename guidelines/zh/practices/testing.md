---
id: practices/testing
lang: zh
version: 2
source-lang: en
status: active
digest: decd4793
---

# 测试策略

编写测试是为了验证有实际意义的行为，而不是凑覆盖率数字。

添加测试前，先明确它要捕获哪种故障。

优先覆盖：

- 核心业务逻辑
- 重要用户行为
- 已知容易出错的路径
- 边界条件
- 错误处理
- 异常情况
- 集成边界

覆盖率数字只作参考，本身不是目标；目标是确信关键行为正常工作。

## 前端 E2E 测试

只要条件允许，前端项目应包含 E2E 测试。

E2E 测试应重点覆盖：

- 主要用户流程
- 产品的关键行为
- 重要集成行为

优先使用接近真实场景的测试数据。需要类似生产环境的数据时，先做匿名化或脱敏处理，严禁在测试夹具中放入真实的生产环境敏感信息。

控制 E2E 测试的运行时间。不要让测试套件不断膨胀，拖慢[质量门禁](../toolchain/quality-gates.md)，却无法更充分地验证关键行为。

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

只要条件允许，前端项目应为关键组件和逻辑编写单元测试。如果接近真实场景的数据有助于提高测试质量，应先脱敏再使用。

优先覆盖：

- 重要组件行为
- 业务逻辑
- 状态转换
- 数据变换
- 边缘情况
- 错误情况

单元测试应保持快速。

避免编写仅重复实现细节的测试。
