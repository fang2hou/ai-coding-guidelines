---
id: practices/change-discipline
lang: zh
version: 1
source-lang: en
status: active
digest: 159bf67c
---

# 变更纪律

在认定一项变更完成之前：

- 确认所要求的行为已真正实现。
- 运行相关的格式检查。
- 运行 Lint 检查。
- 在适用时运行类型检查。
- 运行相关测试。
- 运行相应的 [prek 检查](../toolchain/quality-gates.md)。
- 处理提交时，校验 [Conventional Commits](../toolchain/git.md)。
- 检查 diff。
- 检查有无非预期的变更。
- 检查有无不必要的新依赖。
- 检查有无不必要的新文件。
- 检查架构兼容性。
- 检查代码语言合规性([语言政策](language-policy.md))。
- 检查产品语言合规性([语言政策](language-policy.md))。
- 检查敏感信息([安全](security.md))。

CI 通过是必要条件，但它本身并不能证明实现正确。

不要把流水线的绿色通过当作检查 diff、判断变更是否正确的替代品。

除[操作协议](agent-protocol.md)外，任何非平凡变更在交付评审之前，都要执行这份清单。
