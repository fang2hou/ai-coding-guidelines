---
id: practices/change-discipline
lang: zh
version: 2
source-lang: en
status: active
digest: a8c56487
---

# 变更纪律

对每项实质性变更，在交付评审前都要检查这份清单；同时参照[操作协议](agent-protocol.md)。

## 完成清单

在认定一项变更完成之前：

- 确认要求的行为确实已经实现。
- 运行相关的格式检查。
- 运行 Lint 检查。
- 在适用时运行类型检查。
- 运行相关测试。
- 运行相应的 [prek 检查](../toolchain/quality-gates.md)。
- 提交时，校验 [Conventional Commits](../toolchain/git.md)。
- 检查 diff。
- 检查是否有非预期变更。
- 检查是否有不必要的新依赖。
- 检查是否有不必要的新文件。
- 检查架构兼容性。
- 检查代码语言合规性（[语言政策](language-policy.md)）。
- 检查产品语言合规性（[语言政策](language-policy.md)）。
- 检查敏感信息（[安全](security.md)）。

## 示例：修复偶发失败的登录测试

待评审的变更：`tests/e2e/login.spec.ts` 在 CI 中间歇性失败；修复方案是将固定等待 3 秒改为等待 session cookie。

先确认行为。偶发失败的测试必须连续多次通过，不能只通过一次：

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

运行静态门禁，查看检查报告：

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

删除残留的 import 后再运行一次。通过时应如下所示：

```text
$ mise run check
oxfmt   ok
oxlint  ok
tsc     ok
```

然后审阅 diff：

```text
$ git diff --stat
 tests/e2e/login.spec.ts | 8 +++++---
 1 file changed
```

只改动了一个文件：没有新增依赖、没有新增文件，也不影响架构。测试中新增的注释遵循[语言政策](language-policy.md)，使用英文；用户可见字符串没有变化，因此不影响产品语言合规性；凭据保留在测试夹具中，不会出现在 diff 里（[安全](security.md)）。

提交。prek 会对暂存区再次运行同样的检查，提交信息遵循 [Conventional Commits](../toolchain/git.md)：

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

这就是通过的标准：所有检查均通过，逐行审阅 diff，且变更中没有无法解释的内容。

## CI 通过不是正确性的证明

CI 通过是必要条件，但它本身不能证明实现正确。

不要把流水线通过当作审阅 diff、判断变更是否正确的替代品。
