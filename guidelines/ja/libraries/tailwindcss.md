---
id: libraries/tailwindcss
lang: ja
version: 4
source-lang: en
status: active
digest: 398ef82f
---

# Tailwind CSS

## 判定

条件付き — プロジェクトがすでに Tailwind を使っている、またはコンポーネントキットが Tailwind を必要とする場合に使う。新しいスタイリングのデフォルトはネイティブ CSS である。

## 使用する場面

- プロジェクトがすでに Tailwind CSS を使っている場合。
- 選択したコンポーネントキット（DaisyUI など）が Tailwind を必要とする場合、またはユーザーが明示的に要求した場合。

## 避けるべき場面

- Tailwind を必要としない新しい UI 作業 — ネイティブ CSS（カスタムプロパティ、ネスト、`:has()`、コンテナクエリ、`light-dark()`）でスタイリングする。
- ユーザーが別の CSS フレームワークやプロジェクト固有のスタイル設計を明示的に要求した場合 — その要求に従う。

## 長所

- ユーティリティファーストのクラスにより、スタイルをマークアップと同じ場所で管理でき、専用スタイルシートの肥大化を防げる。
- React エコシステム全体で広く採用されている。
- テーマとデザイントークンを、各メジャーバージョンにつき 1 か所で設定できる。

## トレードオフ

- ユーティリティクラスを並べたマークアップは冗長になりやすく、コンポーネント内が雑然としやすい。
- メジャーバージョンごとに規約と設定モデルに互換性がない。混在させると不整合が生じる。

## バージョン方針

- 新規プロジェクトでは最新の安定版 Tailwind CSS を使う。
- 古いチュートリアル、テンプレート、コードスニペットが旧バージョンを使っているという理由だけで、Tailwind を自動的にダウングレードしてはならない。
- ユーザーが別の Tailwind バージョンを明示的に要求した場合は、その要求に従う。

## 利用ルール

- デフォルトはネイティブ CSS とし、明示的な要件がない限り、Tailwind を使っていないプロジェクトに新しく導入しない。
- 使用する Tailwind メジャーバージョンの規約と設定モデルに従い、異なるメジャーバージョンの書き方を混在させない。

### クラスのリントとソートの相互運用

- `oxlint-tailwindcss` を開発用依存関係としてインストールし、`.oxlintrc.json` の `jsPlugins` 配列から読み込む。
- `settings.tailwindcss.entryPoint` に、プロジェクトの Tailwind v4 の CSS エントリを指定する。これは、`tailwindcss` をインポートし、`@theme` ブロックでデザイントークンを宣言するファイルである。このパスは必ず明示的に指定する。プラグインはファイルシステムからエントリファイルを自動で探さない。
- `oxlint-tailwindcss/enforce-sort-order` を有効にし、Tailwind 公式のクラス順を適用する。
- リンターと oxfmt が同じデザインシステムを使うようにする。`.oxfmtrc.json` の `sortTailwindcss.stylesheet` を同じ CSS ファイルに指定する。そうしないと、oxfmt は `tailwindcss` パッケージに同梱された `theme.css` を読み込み、カスタム `@theme` トークンの扱いについてリンターと判定が食い違う。

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["oxlint-tailwindcss"],
  "rules": {
    "tailwindcss/enforce-sort-order": "warn"
  },
  "settings": {
    "tailwindcss": {
      "entryPoint": "src/styles.css"
    }
  }
}

// .oxfmtrc.json
{
  "sortTailwindcss": {
    "stylesheet": "./src/styles.css"
  }
}
```

## 連携

- [角丸](../practices/corner-radius.md) — 共通：Tailwind を使うプロジェクトでは、角丸のトークンスケールを Tailwind のテーマトークンとして表現する。
