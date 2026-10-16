---
id: practices/coding-standards
lang: zh
version: 3
source-lang: en
status: active
digest: 5edde3f4
---

# 编码标准

## 遵循生态系统最佳实践

遵循所用语言和框架的通行惯例，不要另搞一套私有写法。

具体包括：

- 结构清晰
- 数据结构恰当
- 遵循框架既有惯例
- 设计模式得当
- 在适用时保证类型安全
- 符合惯例的 API 用法

用提前返回处理边界情况，避免层层嵌套：

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

只有当设计模式能解决代码里实际存在的问题时才使用，不要为了套模式而用模式。

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
- 有更好名称可用时，`data`、`thing`、`value` 之类的通用名
- 音译
- 已有标准英文术语时的项目专属俚语

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

写出本身就容易读懂、几乎不需要注释的代码。靠清晰的命名和合理拆分表达代码做了什么；注释只用来补充代码本身无法表达的原因。

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

只有当模块化能改进以下方面时，才做模块化：

- 可测试性
- 可读性
- 职责归属
- 复用
- 变更隔离

不要为了满足抽象的模块化理念而人为拆出模块。

经验法则：只有一个页面用到的辅助函数就留在该页面文件里，等第二个地方也要导入时再抽到共享模块。
按阅读顺序组织文件：把相关函数归在一起，区分不同层级的逻辑，主流程放前面、辅助函数放后面。

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

前端应用必须做到完整的响应式适配：在桌面、平板、手机尺寸下均可用，并采用现代响应式布局技术。

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

实现第一个页面时就确定断点。不要等应用按单一固定视口构建完成后，才把响应式行为当作最后的外观调整。
