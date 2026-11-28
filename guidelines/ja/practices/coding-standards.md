---
id: practices/coding-standards
lang: ja
version: 4
source-lang: en
status: active
digest: 5dec3eeb
---

# コーディング規約

## エコシステムのベストプラクティス

選択した言語とフレームワークの確立された規約に従うこと。独自の流儀に置き換えないこと。

具体的には次のとおりである。

- 明確な構造
- 適切なデータ構造
- フレームワークの標準的な規約
- 適切なデザインパターン
- 必要に応じた型安全性
- 慣用に沿った API

エッジケースは早期リターンで処理し、主要な処理経路をフラットに保つこと。

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

デザインパターンは、コード内に実際にある問題を解決する場合にだけ使うこと。パターン集に載っているという理由で導入しない。

## 過剰設計の回避

具体的な必要がないのにコードベースを複雑にしないこと。

次のようなコードを優先すること。

- 単純であること
- 読みやすいこと
- 明示的であること
- 保守しやすいこと
- 変更しやすいこと

早すぎる汎用化を避けること。2 つ目のユースケースが現れるまで、抽象化を導入しないこと。

```ts
// bad
const users = UserRepositoryFactory.create();
const cache = CacheFactory.createCache();
// good
const users = new UserRepository();
const cache = new Cache();
```

ブール引数で 2 つの振る舞いを切り替えないこと。関数を分割し、呼び出し箇所の関数名から実行内容を読み取れるようにすること。

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

明確な関数名と変数名は、コードの可読性を確保する第一の手段である。説明用のコメントを書く代わりに、名前で意図を伝えること。

目的と振る舞いを正確に表す、意味のある英語の名前を使用すること。

次のような名前を避けること。

- 曖昧な省略形
- より適切な名前がある場合の `data`・`thing`・`value` のような汎用名
- 音訳
- 標準的な英語の用語がある場合のプロジェクト固有のスラング

```ts
// bad
const usr = findUsrById(uid);
let flag = false;
// good
const user = findUserById(userId);
let hasUnsavedChanges = false;
```

コードの言語の規則については、[言語ポリシー](language-policy.md)に従うこと。

## 関数の分割

明確な命名と適切な関数の分割を組み合わせ、関数名と呼び出し構造だけから処理内容を読み取れるようにすること。

- コードのかたまりに見出しコメントや補足説明が必要だと感じたら、コメントを書く代わりに、意図の伝わるヘルパー関数へ切り出すか、変数名を見直すこと。
- 各関数は 1 つの抽象度にそろえること。上位の処理は、細かな実装手続きを混在させず、名前の付いた手順の連なりとして読める形にする。
- 実際の振る舞いの境界で分割すること。制御の流れを追いにくくするだけの自明な 1 行ラッパーは作らない。

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

## コメント

コメントの多さは、コード品質を測る直接の指標として扱うこと。通常のプルリクエストでも後続の修正でも、コメントが多い状態はコード品質が低い強いサインである。何が起きているかを多数のコメントで説明しないと分からないなら、コード自体の構造や明確さに問題がある。

良いコード、とりわけ既存のコードベースへの変更は、周囲のロジックや規約に自然になじみ、隙間を埋める説明や場当たり的な回避策の言い訳、手順の逐一解説がなくても最初から最後まで通して読める。

- 処理の内容は明確な名前と適切な関数の分割で伝え、コメントはコードだけでは読み取れない理由（不変条件、外部制約、微妙な順序やトレードオフ）に限り、最小限にとどめること。
- ロジックを逐一説明したり、長い関数の途中を見出しコメントで区切ったりしないこと。まずヘルパー関数を切り出すか、変数名を見直すこと。
- プルリクエストや修正を完了する前に、追加したコメントを 1 つずつ確認すること。分かりにくい流れ、後付けのパッチ処理、あるいは処理内容の言い換えを説明しているだけなら、コメントを削除してコード自体を修正・リファクタリングすること。
- 削除済みの振る舞いや過去の意図を説明するコメントを残さないこと。
- 設定ファイルにはコメントを残さず、根拠はプルリクエストまたはプロジェクトドキュメントに記録すること。

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

## モジュール性

次の点を改善できる場合に限り、コードをモジュールに分けること。

- テスト
- 可読性
- オーナーシップ
- 再利用
- 変更の分離

モジュール性という抽象的な理念だけを満たすために、無理にモジュールを作らないこと。

判断基準：1 つの画面だけで使うヘルパーは、その画面のファイルに置くこと。2 か所目から import するときに、共有モジュールへ移すこと。
後から読む人を意識して書くこと。関数は関心事ごとにまとめ、ロジックのレベルを分け、ファイルの並び順から処理の流れが分かるようにすること。主要な処理を先に置き、ヘルパーを後に置くこと。

## 新しいファイルとモジュール

新しいファイルやモジュールを作成する前に、その責務を一文で説明すること。その文を正確にするために「および」が必要なら、そのファイルは 2 つの仕事を担っている。分割するか、作成を再検討すること。

次のものを作成しないこと。

- 冗長なモジュール
- 重複するヘルパー
- 中身のない抽象
- 既存機能の並行実装

`src/utils/date.ts` には責務がある。`src/utils/misc.ts` にはない。

新しいコードは、既存のアーキテクチャとの整合性を保つこと。

## パフォーマンス

正しさと可読性を優先し、計測で確かめていない性能のために構造を犠牲にしないこと。

- 不要な割り当て・コピー・再計算を行わないこと。
- O(n) 回実行されるループ内で、O(n) の処理を行わないこと。
- 個別のマイクロ最適化を重ねる前に、アルゴリズムまたはデータ構造を修正すること。
- 計測によって特定したホットパスだけを、根拠に基づいて最適化すること。

## レスポンシブ対応のフロントエンド

フロントエンドアプリケーションは完全にレスポンシブであること。デスクトップ・タブレット・モバイルのどの画面サイズでも使え、現代的なレスポンシブレイアウト手法を用いること。

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

最初の画面を実装するときにブレークポイントを決めること。固定ビューポート向けの実装を終えた後、最後の見た目の調整としてレスポンシブ対応を追加してはならない。
