---
id: practices/coding-standards
lang: zh
version: 4
source-lang: en
status: active
digest: a94e1102
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

不要用布尔参数在两种行为之间切换。拆成两个函数，让调用处的函数名直接说明要执行哪种行为。

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

代码可读性首先靠清晰的函数名和变量名保证：用命名传达意图，而不是写解释性注释。

使用有意义的英文名称，准确描述用途和行为。

避免：

- 语义模糊的缩写
- 有更准确的名称时，仍使用 `data`、`thing`、`value` 等通用名
- 音译
- 已有标准英文术语时，使用项目内部俚语

```ts
// bad
const usr = findUsrById(uid);
let flag = false;
// good
const user = findUserById(userId);
let hasUnsavedChanges = false;
```

遵循[语言政策](language-policy.md)中的代码语言规则。

## 函数拆分

配合清晰的命名做好函数拆分，让读者只看函数名和调用结构就能理解流程。

- 一段代码需要分段注释或行内说明时，改为提取命名清晰的辅助函数或重命名变量。
- 每个函数保持在同一抽象层级：顶层流程应由若干命名清晰的步骤串联而成，不要混入底层实现细节。
- 按真实的行为边界拆分函数；不要为简单的一行逻辑套一层多余的封装，以免让控制流更难追踪。

```ts
// bad
function checkout(cart: Cart, user: User) {
  // verify inventory before charging
  for (const item of cart.items) {
    if (item.quantity > item.stock) throw new OutOfStockError(item.id);
  }
  // apply member discount
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = user.isMember ? subtotal * 0.9 : subtotal;
  return chargeCustomer(user.id, total);
}

// good
function checkout(cart: Cart, user: User) {
  assertItemsInStock(cart.items);
  const total = calculateDiscountedTotal(cart.items, user.isMember);
  return chargeCustomer(user.id, total);
}
```

## 注释

注释密度直接反映代码质量。无论常规 pull request 还是后续修复，注释一多往往意味着结构混乱或表达不清：凡是必须靠注释解释“代码在做什么”的地方，都应重构代码，而非补写说明。

好的代码，尤其是对既有代码库的改动，应与周边逻辑和惯例保持一致，通篇自然易读，不必靠注释弥合逻辑断层、为临时补丁找理由，或逐行复述步骤。

- 用清晰的命名和合理的函数拆分交代代码行为；注释务必克制，只说明代码本身看不出的原因（如不变量、外部约束、微妙的执行顺序或设计权衡）。
- 不要逐行解说逻辑，也不要在长函数中用分段注释切分代码块；先提取辅助函数或重命名变量。
- 完成 pull request 或修复前，逐条检查新增注释：凡是只用来解释混乱流程、临时拼凑的补丁或代码本身行为的，一律删掉注释，直接修正或重构代码。
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

- 避免不必要的内存分配、复制和重复计算。
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
