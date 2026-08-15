---
id: practices/coding-standards
lang: zh
version: 3
source-lang: en
status: active
digest: 5df90234
---

# 编码标准

## 遵循生态最佳实践

遵循所选语言和框架的既有惯例，不要用一套私有变体取而代之。

具体包括：

- 结构清晰
- 数据结构恰当
- 遵循框架既有惯例
- 设计模式得当
- 在适用处保证类型安全
- API 用法地道

用提前返回处理边界情况，让主路径保持扁平：

```ts
// bad
if (order !== null) {
  if (order.isPaid) {
    ship(order);
  }
}
// good
if (order === null || !order.isPaid) return;
ship(order);
```

只有当设计模式能命名代码库中真实存在的问题时才采用它，而不是因为它出现在某个模式目录里。

## 避免过度设计

没有具体需求时，不要增加代码库的复杂度。

优先选择符合以下特征的代码：

- 简单
- 可读
- 显式
- 可维护
- 易于修改

避免过早泛化：出现第二个用例之前，不要引入抽象。

```ts
// bad
const users = UserRepositoryFactory.create();
const cache = CacheFactory.createCache();
// good
const users = new UserRepository();
const cache = new Cache();
```

不要用布尔参数把第二种行为藏在一个函数里；拆成两个函数，让调用处不查标志位也能读懂。

```ts
// bad
function saveReport(report: Report, silent: boolean) {
  /* ... */
}
saveReport(report, true);
// good
function saveReport(report: Report) {
  /* ... */
}
function saveReportSilently(report: Report) {
  /* ... */
}
```

## 命名

使用含义明确、能准确描述用途与行为的英文命名。

避免：

- 语义模糊的缩写
- 已有更好的名称时，仍使用 `data`、`thing`、`value` 之类的通用名称
- 音译
- 已有标准英文术语时，仍使用项目专属俚语

```ts
// bad
const usr = findUsrById(uid);
let flag = false;
// good
const user = findUserById(userId);
let hasUnsavedChanges = false;
```

遵循[语言政策](language-policy.md)中的代码语言规则。

## 注释

编写几乎不需要注释的代码。命名、结构与拆分承担语义，注释只覆盖它们表达不了的部分。

- 注释解释为什么，不复述做了什么。
- 不要逐步解说逻辑；如果一段代码需要连篇解说，先重构它。
- 不要保留描述已删除行为或旧时意图的注释。
- 配置文件保持零注释，理由写进 pull request 或项目文档。

```ts
// bad
// renew the subscription if it is still active
if (user.subscription && user.subscription.endsAt > now) {
  renew(user.subscription);
}
// good
if (user.hasActiveSubscription(now)) {
  renew(user.subscription);
}
```

## 模块化

在模块化能改进以下方面时，编写模块化代码：

- 可测试性
- 可读性
- 职责归属
- 复用
- 变更隔离

不要为了抽象的模块化理念，人为制造模块。

判断标准：只被一个页面使用的辅助函数就留在该页面的文件里；出现第二个使用方导入时，再移入共享模块。
为后来的读者而写：按关注点分组函数，分离不同层级的逻辑，并让文件顺序本身呈现脉络——主流程在前，辅助函数在后。

## 新文件与新模块

创建新文件或新模块之前，先用一句话说清它的职责。如果这句话必须用“和”才说得准，说明它承担了两件事——拆分，或者重新考虑。

禁止创建：

- 冗余模块
- 重复的辅助代码
- 空洞的抽象
- 与既有功能平行的重复实现

`src/utils/date.ts` 有明确职责；`src/utils/misc.ts` 没有。

新代码必须与既有架构保持一致。

## 性能

正确性与可读性优先，不要用未经度量的速度去交换代码结构。

- 不要做本可避免的分配、复制与重复计算。
- 不要在执行 O(n) 次的循环里做 O(n) 的工作。
- 先修正算法或数据结构，再考虑零散的微优化。
- 只优化度量过的热点路径，且必须有证据支撑。

## 响应式前端

前端应用必须实现完整的响应式行为：在桌面、平板、移动尺寸下都可用，并使用现代响应式布局技术。

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

在实现第一个页面时就确定断点。不要等应用已经按单一固定视口实现完毕，才把响应式行为当作最后的修饰步骤。
