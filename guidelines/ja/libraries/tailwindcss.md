---
id: libraries/tailwindcss
lang: ja
version: 2
source-lang: en
status: active
digest: 161ca8a5
---

# Tailwind CSS

## 判定

推奨 — フロントエンドプロジェクトの CSS フレームワークには Tailwind CSS を使う。

## 使用する場面

- すべてのフロントエンドプロジェクトのスタイリングで、デフォルトとして使う。
- Tailwind ベースのアプリケーションで、[shadcn/ui](shadcn-ui.md) をコンポーネントシステムとして使う場合。

## 避けるべき場面

- ユーザーが別の CSS フレームワークを明示的に要求した場合 — ユーザーの要求に従う。
- ユーザーがプロジェクト固有のスタイル設計を明示的に要求した場合 — ユーザーの要求に従う。

## 長所

- ユーティリティファーストのクラスにより、スタイルがマークアップと同じ場所に保たれ、個別に用意したスタイルシートが肥大化しない。
- React エコシステム全体で広く採用されており、shadcn/ui のスタイリング基盤でもある。
- テーマとデザイントークンを、メジャーバージョンごとに 1 か所で設定できる。

## トレードオフ

- ユーティリティクラスのマークアップは冗長になりやすく、コンポーネント内部が雑然となりがちである。
- メジャーバージョンごとに規約と設定モデルに互換性がなく、混在するとずれが生じる。

## バージョン方針

- 新規プロジェクトでは最新の安定版 Tailwind CSS を使う。
- 古いチュートリアル、テンプレート、コードスニペットが旧バージョンを使っているという理由で、Tailwind を自動的にダウングレードしてはならない。
- ユーザーが別の Tailwind バージョンを明示的に要求した場合は、ユーザーの要求に従う。

## 利用ルール

- フロントエンドプロジェクトのデフォルト CSS フレームワークとして Tailwind CSS を使う。
- ユーザーが別の Tailwind バージョン、別の CSS フレームワーク、またはプロジェクト固有のスタイル設計を明示的に要求した場合は、ユーザーの要求に従う。
- 選択した Tailwind バージョンの規約と設定モデルに従う。
- 互換性のない Tailwind メジャーバージョンのパターンを混在させてはならない。

### クラスのリントとソートの相互運用

- `oxlint-tailwindcss` を開発用依存関係としてインストールし、`.oxlintrc.json` の `jsPlugins` 配列から読み込む。
- `settings.tailwindcss.entryPoint` に、プロジェクトの Tailwind v4 の CSS エントリを指定する。`tailwindcss` をインポートし、`@theme` のデザイントークンを宣言するファイルのことである。この設定は必須で、明示的に指定する。プラグインによるファイルシステムの自動検出はない。
- `oxlint-tailwindcss/enforce-sort-order` を有効にする。このルールが生成する並び順は、Tailwind 公式のクラス並び順と一致する。
- リンターと oxfmt が同じデザインシステムを読み込むようにすること。`.oxfmtrc.json` の oxfmt 用設定 `sortTailwindcss.stylesheet` を同じ CSS ファイルに向ける。この指定がないと、oxfmt は `tailwindcss` パッケージに同梱された `theme.css` を読み込み、カスタム `@theme` トークンの扱いでリンターと食い違う。

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

- [shadcn/ui](shadcn-ui.md) — pairs-with: shadcn/ui は Tailwind ベースのアプリケーションで第一に選ぶコンポーネントシステムであり、Tailwind を必須とする。
