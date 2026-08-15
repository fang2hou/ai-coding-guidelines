---
id: practices/change-discipline
lang: zh
version: 2
source-lang: en
status: active
digest: c15e87c7
---

# 变更纪律

任何非平凡变更在交付评审前都要过一遍这份清单；它与[操作协议](agent-protocol.md)配合使用。

## 完成清单

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
- 检查代码语言合规性（[语言政策](language-policy.md)）。
- 检查产品语言合规性（[语言政策](language-policy.md)）。
- 检查敏感信息（[安全](security.md)）。

## 实例：修复不稳定的登录测试

评审对象：`tests/e2e/login.spec.ts` 在 CI 里偶发失败；修复方式是把固定的 3 秒等待换成等待 session cookie。

先确认行为。不稳定的测试要反复跑，通过一次不算数：

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

跑静态门禁，让检查有机会报警：

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

删掉残留的 import 再跑一次，通过时长这样：

```text
$ mise run check
oxfmt   ok
oxlint  ok
tsc     ok
```

然后看 diff：

```text
$ git diff --stat
 tests/e2e/login.spec.ts | 8 +++++---
 1 file changed
```

只改了一个文件：没有新依赖、没有新文件、不影响架构。测试里新增的注释按[语言政策](language-policy.md)用英文；用户可见的字符串没有变化，产品语言合规性不受影响；凭据只留在测试夹具里，不进 diff（[安全](security.md)）。

提交。prek 会在暂存区上再跑一遍同样的检查，提交信息遵循 [Conventional Commits](../toolchain/git.md)：

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

这就是通过的样子：所有检查绿灯，diff 逐行读过，变更里没有任何解释不了的内容。

## 绿色 CI 不是证明

CI 通过是必要条件，但它本身并不能证明实现正确。

不要把流水线的绿色通过当作检查 diff、判断变更是否正确的替代品。
