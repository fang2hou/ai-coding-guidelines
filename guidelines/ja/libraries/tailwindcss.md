---
id: libraries/tailwindcss
lang: ja
version: 2
source-lang: en
status: active
digest: 6b519404
---

# Tailwind CSS

## 判定

推奨 — フロントエンドプロジェクトの CSS フレームワークとして Tailwind CSS を優先する。

## 使用する場面

- 原則として、すべてのフロントエンドプロジェクトのスタイリングに使う。
- Tailwind ベースのアプリケーションで、[shadcn/ui](shadcn-ui.md) をコンポーネントシステムとして使う場合。

## 避けるべき場面

- ユーザーが別の CSS フレームワークを明示的に要求した場合 — その要求に従う。
- ユーザーがプロジェクト固有のスタイル設計を明示的に要求した場合 — その要求に従う。

## 長所

- ユーティリティファーストのクラスにより、スタイルをマークアップと同じ場所で管理でき、専用スタイルシートの肥大化を防げる。
- React エコシステム全体で広く採用されており、shadcn/ui のスタイリング基盤でもある。
- テーマとデザイントークンを、各メジャーバージョンにつき 1 か所で設定できる。

## トレードオフ

- ユーティリティクラスを並べたマークアップは冗長になりやすく、コンポーネント内が雑然としやすい。
- メジャーバージョンごとに規約と設定モデルに互換性がない。混在させると不整合が生じる。

## バージョン方針

- 新規プロジェクトでは最新の安定版 Tailwind CSS を使う。
- 古いチュートリアル、テンプレート、コードスニペットが旧バージョンを使っているという理由だけで、Tailwind を自動的にダウングレードしてはならない。
- ユーザーが別の Tailwind バージョンを明示的に要求した場合は、その要求に従う。

## 利用ルール

- フロントエンドプロジェクトでは、Tailwind CSS をデフォルトの CSS フレームワークとして使う。
- ユーザーが別の Tailwind バージョン、別の CSS フレームワーク、またはプロジェクト固有のスタイル設計を明示的に要求した場合は、その要求に従う。
- 選択した Tailwind バージョンの規約と設定モデルに従う。
- 互換性のない Tailwind のメジャーバージョンのパターンを混在させてはならない。

### クラスのリントとソートの相互運用

- `oxlint-tailwindcss` を開発用依存関係としてインストールし、`.oxlintrc.json` の `jsPlugins` 配列から読み込む。
- `settings.tailwindcss.entryPoint` に、プロジェクトの Tailwind v4 の CSS エントリを指定する。これは、`tailwindcss` をインポートし、`@theme` ブロックでデザイントークンを宣言するファイルである。この設定は必須であり、明示的に指定する。プラグインはファイルシステムを自動検出しない。
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

- [shadcn/ui](shadcn-ui.md) — 併用：shadcn/ui は Tailwind ベースのアプリケーションで優先するコンポーネントシステムであり、Tailwind を必要とする。
