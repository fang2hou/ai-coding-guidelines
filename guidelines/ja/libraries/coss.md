---
id: libraries/coss
lang: ja
version: 2
source-lang: en
status: active
digest: 6072a6ea
---

# coss ui

## 判定

第二候補 — coss ui は [shadcn/ui](shadcn-ui.md) に次ぐ承認済みの選択肢である。新規プロジェクトでデフォルトとして選んではならない。

## 使用する場面

- ユーザーがプロジェクトのコンポーネントシステムとして coss ui を明示的に選んだ場合。
- プロジェクトがすでに coss ui を使っている場合。

## 避けるべき場面

- coss ui を明示的に要求していない新規プロジェクト。shadcn/ui を使う。
- プロジェクトがすでに shadcn/ui を使っており、ユーザーが移行を求めていない場合。

## 長所

- shadcn/ui と同じ配布モデルとツールチェーンを採用する。コンポーネントはソースとしてリポジトリにコピーされ、shadcn CLI（`@coss` レジストリ）でインストールされる。shadcn MCP ツールからも直接操作できる。
- Base UI を基盤としてネイティブに構築されている。Base UI は shadcn/ui が現在デフォルトとするプリミティブ層であり、coss ui は Tailwind CSS v4 でスタイルを適用する。
- 厳選された particle のカタログがあり、すべてのプリミティブに本番を想定した構成例を提供する。
- Radix/shadcn からの公式移行ガイドがあり、コンポーネントごとの API の違いを説明している。

## トレードオフ

- shadcn/ui と比べて、エコシステムも普及度も小さい。
- API は shadcn/Radix と 1:1 で対応しない（トリガーのコンポジション、Select の items、Slider の値など）。既存の shadcn コードは import の書き換えだけでは済まず、移行が必要である。
- 本ガイドラインでは、インストール済みコンポーネントの編集を一切禁止している。そのため、カスタマイズは最初からコンポジション、ラッパーコンポーネント、テーマ設定のいずれかとして計画する必要がある。

## バージョン方針

- Tailwind CSS v4 と Base UI が必須である。レジストリの最新状態に追従する。
- コンポーネントは npm パッケージのバージョンではなく、shadcn CLI（`pnpm dlx shadcn@latest add`）で更新する。

## 利用ルール

### インストールとツール連携

- コンポーネントは shadcn CLI でインストールする：`pnpm dlx shadcn@latest add @coss/<component>`。プロジェクトは `pnpm dlx shadcn@latest init @coss/style` で初期化する。
- coss ui の作業では、エージェントスキルをインストールする：`pnpm dlx skills add cosscom/coss`。既定はプロジェクトスコープであり、グローバルインストールはユーザーが要求した場合に限る。
- ファイルを手作業でコピーするより、shadcn MCP ツールまたは shadcn CLI を優先する。コンポーネントがローカルにすでに存在する可能性がある場合は、`--dry-run` または `--diff` でプレビューする。
- プロジェクトのセットアップでは、coss ui の公式ドキュメントに従う。

### インストール済みコンポーネントの改変禁止

- インストール済みの coss ui コンポーネントファイルを編集してはならない。shadcn/ui と異なり、文書化された例外はない。`components/ui` はレジストリがインストールした状態のままにする。
- カスタマイズは、コンポジション、ラッパーコンポーネント、テーマ変数、デザイントークン、またはカスタムコンポジション用の公式 `*Primitive` エクスポートで実装する。
- shadcn/Radix のパターンをそのまま移植してはならない。公式の移行ガイドに従う（`asChild` は `render` に、`onSelect` は `onClick` に置き換える。Select は items を先に指定する方式であり、ToggleGroup は `multiple` を使い、Slider はスカラー値を受け取る）。

### コンポーネントのパスと構成

- coss ui のコンポーネントは `components/ui` にインストールし、そのままそこに置く。このパスはアップストリームが所有する。
- アプリケーション独自のコンポーネントは、同じ `components/` 配下で Atomic Design Methodology に沿ってサブディレクトリに整理する：`atoms/`、`molecules/`、`organisms/`。アプリに必要なら `templates/` と `pages/` も加える。[shadcn/ui](shadcn-ui.md) と同じ構成である。
- shadcn/ui と同様に、`.oxlintrc.json` と `.oxfmtrc.json` の `ignorePatterns` に `components/ui/**` を追加し、`oxlint` と `oxfmt` の対象から除外する。

### コンポーネントの再利用

- カスタムマークアップを書く前に、コンポーネントカタログと particle のサンプルを確認する。
- 合理的な範囲で coss ui コンポーネントを使い、アプリ固有の UI はそれらのコンポジションとして構築する。

## 連携

- [Tailwind CSS](tailwindcss.md) — 必須条件：coss ui は Tailwind CSS v4 でスタイルを適用する。
- [shadcn/ui](shadcn-ui.md) — 代替：同じレジストリモデルとツールチェーンを使い、相互に切り替えられる。shadcn/ui をデフォルトとし、coss ui を第二候補とする。
- [フロントエンドフレームワーク：Vite vs Next.js](frontend-framework.md) — 連携：Vite と Next.js のどちらを使うプロジェクトにも coss ui を適用できる。
