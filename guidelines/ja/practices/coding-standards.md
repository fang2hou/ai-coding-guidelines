---
id: practices/coding-standards
lang: ja
version: 2
source-lang: en
status: active
digest: 67fc3c1e
---

# コーディング規約

## エコシステムのベストプラクティスに従う

選択した言語とフレームワークの確立された規約に従うこと。私的な流儀に置き換えないこと。

具体的には、次のとおりである。

- 明確な構造
- 適切なデータ構造
- 確立されたフレームワークの規約
- 適切なデザインパターン
- 必要に応じた型安全性
- 慣用的な API

境界ケースは早期リターンで処理し、主経路をフラットに保つこと。

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

デザインパターンは、コードベースに実際に存在する問題に名前を付ける場合にのみ採用する。カタログに載っているからという理由で適用しないこと。

## 過剰な設計を避ける

具体的な必要性がないのに、コードベースをこれ以上複雑にしないこと。

次のようなコードを優先すること。

- 単純である
- 読みやすい
- 明示的である
- 保守しやすい
- 変更しやすい

早すぎる汎用化を避ける。2 つ目のユースケースが現れるまで、抽象を導入しないこと。

```ts
// bad
const users = UserRepositoryFactory.create();
const cache = CacheFactory.createCache();
// good
const users = new UserRepository();
const cache = new Cache();
```

ブール引数によって 1 つの関数に 2 つ目の振る舞いを持ち込まないこと。関数を分割し、フラグを見なくても呼び出し側が意味を読めるようにする。

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

目的と振る舞いを正確に表す、意味のある英語の名前を使用すること。

次を避ける。

- 曖昧な省略形
- より良い名前があるのに使う `data`・`thing`・`value` のような汎用名
- 音訳
- 標準的な英語の用語があるのに使うプロジェクト固有のスラング

```ts
// bad
const usr = findUsrById(uid);
let flag = false;
// good
const user = findUserById(userId);
let hasUnsavedChanges = false;
```

コードの言語の規則については、[言語ポリシー](language-policy.md)に従うこと。

## モジュール性

モジュール化によって次の点が改善されるなら、モジュール化されたコードを書くこと。

- テスト
- 可読性
- オーナーシップ
- 再利用
- 変更の分離

抽象的なモジュール性の理想を満たすためだけに、人為的なモジュールを作らないこと。

判断基準：1 つの画面からしか使われないヘルパーは、その画面のファイルに置く。2 つ目の利用者が import した時点で、共有モジュールへ移動する。

## 新しいファイルとモジュール

新しいファイルやモジュールを作成する前に、その責務を一文で述べること。「および」が必要になる文なら、2 つの仕事をさせているということである。分割するか、再検討すること。

次のものを作成しないこと。

- 冗長なモジュール
- 重複するヘルパー
- 中身のない抽象
- 既存機能の並行実装

`src/utils/date.ts` には責務がある。`src/utils/misc.ts` にはない。

新しいコードは、既存のアーキテクチャと整合していなければならない。

## レスポンシブなフロントエンド

フロントエンドアプリケーションは、完全なレスポンシブ動作を備えること。デスクトップ・タブレット・モバイルの各サイズで利用できる状態を保ち、現代的なレスポンシブレイアウトの手法を使用すること。

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

最初の画面を実装する時点でブレークポイントを決めること。ある固定ビューポート向けの実装が完成した後の最後の見た目の仕上げとして、レスポンシブ対応を扱わないこと。
