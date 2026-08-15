---
id: libraries/coss
lang: ja
version: 1
source-lang: en
status: active
digest: 0c9ecdb0
---

# coss ui

## 判定

代替候補 — coss ui は [shadcn/ui](shadcn-ui.md) に次ぐ、認められた第二選択肢である。新規プロジェクトのデフォルトとして選んではならない。

## 使用する場面

- ユーザーがプロジェクトのコンポーネントシステムとして coss ui を明示的に選択した場合。
- プロジェクトがすでに coss ui を使っている場合。

## 避けるべき場面

- coss ui への明示的な要求がない新規プロジェクト。shadcn/ui を使う。
- プロジェクトがすでに shadcn/ui を使っており、ユーザーが移行を要求していない場合。

## 長所

- shadcn/ui と同じ配布モデルとツールチェーン。コンポーネントはソースとしてリポジトリにコピーされ、shadcn CLI（`@coss` レジストリ）でインストールされる。shadcn MCP ツールがそのまま使える。
- Base UI を基盤としてネイティブに構築されており（shadcn/ui が現在デフォルトとする層と同じ）、Tailwind CSS v4 でスタイリングされる。
- 精選された particle カタログ。すべてのプリミティブに本番に近い組み合わせ例がある。
- Radix/shadcn からの移行ガイドが公式に提供され、コンポーネントごとの API 差異が説明されている。

## トレードオフ

- shadcn/ui に比べ、エコシステムと普及度が小さい。
- API は shadcn/Radix と 1:1 ではない（トリガーの合成、Select の items、Slider の値など）。既存の shadcn コードは import の書き換えでは済まず、移行が必要である。
- 本ガイドラインではインストール済みコンポーネントの編集を全面的に禁止するため、カスタマイズは最初から合成・ラッパー・テーマとして計画する必要がある。

## バージョン方針

- Tailwind CSS v4 と Base UI が必須。レジストリの最新状態に追従する。
- コンポーネントの更新は npm パッケージのバージョンではなく、shadcn CLI（`npx shadcn@latest add`）で行う。

## 利用ルール

### インストールとツール連携

- コンポーネントのインストールは shadcn CLI で行う：`npx shadcn@latest add @coss/<component>`。プロジェクトの初期化は `npx shadcn@latest init @coss/style`。
- coss ui の作業では agent スキルをインストールする：`npx skills add cosscom/coss`。既定はプロジェクトスコープ。グローバルインストールはユーザーから要求された場合のみ。
- 手作業でのファイルコピーよりも、shadcn MCP ツールまたは shadcn CLI を優先する。ローカルに同名のコンポーネントが既にある可能性がある場合は、まず `--dry-run` か `--diff` で確認する。
- プロジェクトのセットアップでは coss ui の公式ドキュメントに従う。

### インストール済みコンポーネントは決して改変しない

- インストール済みの coss ui コンポーネントファイルを編集してはならない。shadcn/ui と違い、文書化された例外の経路はない。`components/ui` はレジストリがインストールした状態のまま保つ。
- カスタマイズは合成、ラッパーコンポーネント、テーマ変数とデザイントークン、またはカスタム合成用の公式 `*Primitive` エクスポートで実装する。
- shadcn/Radix のパターンをそのまま持ち込まない。公式の移行ガイドに従う（`asChild` は `render` へ、`onSelect` は `onClick` へ、Select は items ファースト、ToggleGroup は `multiple`、Slider はスカラー値）。

### コンポーネントのパスと構成

- coss ui コンポーネントは `components/ui` にインストールされ、そのままそこに置く。このパスの所有権はアップストリームにある。
- アプリケーション独自のコンポーネントは同じ `components/` 配下に Atomic Design Methodology に沿ったサブディレクトリとして整理する：`atoms/`、`molecules/`、`organisms/`。アプリが求めるなら `templates/` と `pages/` を加える。[shadcn/ui](shadcn-ui.md) と同じ構成である。
- shadcn/ui と同様に、`components/ui/**` を `.oxlintrc.json` と `.oxfmtrc.json` の `ignorePatterns` に追加し、`oxlint` と `oxfmt` の対象から除外する。

### コンポーネントの再利用

- カスタムマークアップを書く前に、コンポーネントカタログと particle サンプルを確認する。
- coss ui コンポーネントを合理的な範囲で可能な限り使う。アプリ固有の UI はそれらの合成として組み立てる。

## 連携

- [Tailwind CSS](tailwindcss.md) — requires: coss ui は Tailwind CSS v4 でスタイリングされる。
- [shadcn/ui](shadcn-ui.md) — alternative: 同じレジストリモデルとツールチェーンを共有し、乗り換え可能である。shadcn/ui がデフォルト、coss ui が第二選択肢。
- [フロントエンドフレームワーク：Vite vs Next.js](frontend-framework.md) — works-with: プロジェクトが Vite と Next.js のどちらであっても、coss ui は適用できる。
