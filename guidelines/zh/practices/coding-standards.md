---
id: practices/coding-standards
lang: zh
version: 3
source-lang: en
status: active
digest: 8d2aad23
---

# 编码标准

## 遵循生态系统最佳实践

遵循所选语言和框架已经形成的惯例，不要用私有变体替代它们。

具体包括：

- 结构清晰
- 数据结构恰当
- 遵循框架既有惯例
- 设计模式得当
- 在适用时保证类型安全
- 符合惯例的 API 用法

使用提前返回处理边界情况，保持主路径平坦：

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

仅当某个设计模式能准确描述代码库中确实存在的问题时才采用它，不要因为模式目录列出了它就采用。

## 避免过度设计

没有明确需求时，不要无谓增加代码库的复杂度。

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

不要用布尔参数把第二种行为隐藏在一个函数里；拆成两个函数，让调用处无需查看标志位就能读懂。

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

使用有意义的英文名称，准确描述用途和行为。

避免：

- 语义模糊的缩写
- 有更好名称时，不要使用 `data`、`thing`、`value` 之类的通用名称
- 音译
- 已有标准英文术语时，不要使用项目专属俚语

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

编写几乎不需要注释的代码。命名、结构和拆分应当传达含义；注释只补充它们无法表达的内容。

- 注释解释原因，不要复述代码做了什么。
- 不要逐步讲解逻辑；如果一段代码需要一条条注释才能说明逻辑，先重构它。
- 不要保留描述已删除行为或过去意图的注释。
- 配置文件中不要写注释；将理由写入 pull request 或项目文档。

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

只有在模块化有助于改进以下方面时，才编写模块化代码：

- 可测试性
- 可读性
- 职责归属
- 复用
- 变更隔离

不要为了满足抽象的模块化理念而人为拆出模块。

判断标准：只被一个页面使用的辅助函数留在该页面文件中；有第二个调用方导入它时，再移入共享模块。
写给后来读代码的人：按关注点分组函数，分离不同层级的逻辑，并让文件顺序呈现脉络——主流程在前，辅助函数在后。

## 新文件与新模块

创建新文件或新模块之前，先用一句话说明它的职责。如果必须用“和”才能说准确，说明它承担了两项职责——拆分它，或重新考虑。

禁止创建：

- 冗余模块
- 重复的辅助代码
- 空洞的抽象
- 对已有功能的并行实现

`src/utils/date.ts` 有明确职责；`src/utils/misc.ts` 没有。

新代码必须与既有架构保持一致。

## 性能

正确性和可读性优先，不要为了未经测量的性能牺牲代码结构。

- 不要做可以避免的分配、复制和重复计算。
- 不要在运行 O(n) 次的循环中执行 O(n) 的工作。
- 先修正算法或数据结构，再考虑零散的微优化。
- 只优化度量过的热点路径，且必须有证据支撑。

## 响应式前端

前端应用必须提供完整的响应式行为：在桌面、平板和移动设备的不同尺寸下均可用，并采用现代响应式布局技术。

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

实现第一个页面时就确定断点。不要等应用按单一固定视口构建完成后，才把响应式行为当作最后的外观调整。
