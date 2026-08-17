---
id: libraries/svelte
lang: ja
version: 1
source-lang: en
status: active
digest: f941971d
---

# Svelte（Svelte 5 + SvelteKit）

## 判定

条件付き — Svelte 5 + SvelteKit は、開発の楽しさも目標のひとつである小規模な個人プロジェクトと実験プロジェクトでの採用を認める。デフォルトではない。本番のフロントエンドは[フロントエンドフレームワーク](frontend-framework.md)で選定した React スタックのままにする。

## 使用する場面

- 個人プロジェクト、プロトタイプ、玩具プロジェクト — 楽しむこと自体が正当な目標である場合。
- ユーザーが明示的に Svelte を要求した場合。

## 避けるべき場面

- AI の作業スループットとエコシステムの広さが重要になる、チーム向け・顧客向けの本番作業。
- React と shadcn/ui のエコシステムの広さが必要なプロジェクト。

## 長所

- 主要なコンポーネントフレームワークの中でボイラープレートが最も少ない。コンパイル結果は細粒度のリアクティビティを備え、バンドルも小さい。
- runes によりリアクティブな状態が明示的になり、静的解析できる。
- SvelteKit は Vite 上にアプリケーション層一式（ルーティング、SSR、フォームアクション）を提供する。
- 公式の AI ツール群（MCP サーバー、skills、`sv add ai-tools`）が、React より薄い LLM 学習カバレッジを補う。

## トレードオフ

- LLM の学習カバレッジは React より薄く、最大のリスクは Svelte 4 のパターンの幻覚である。緩和には公式 AI ツールを使い、決して記憶に頼らない。
- コンポーネントのエコシステムは小さい。UI 作業は DaisyUI か shadcn-svelte 経由になる。
- 動きが速い。SvelteKit 3.0 はプレリリース段階であり、新しいメジャーの探索自体がプロジェクトの目的でない限り、安定版ラインを維持する。

## バージョン方針

- Svelte 5 の最新安定版。コンポーネントレベルの `await` 式には `experimental.async` が必要（Svelte ≥ 5.36）— 実験的機能であり、デフォルトではない。
- SvelteKit は ≥ 2.70 の安定版ライン。3.0 のプレリリースはデフォルトでは採用しない。
- DaisyUI 5（Tailwind CSS v4 プラグインモデル）または shadcn-svelte の最新版（runes ネイティブ、Tailwind v4）。

## 利用ルール

- `npx sv create` でスキャフォールドし、続けて `npx sv add ai-tools` を実行する — Svelte MCP ツール向けの公式 AGENTS.md インストラクションをプロジェクトに書き込むコマンドである。
- 公式 MCP サーバー（`npx -y @sveltejs/mcp`）を登録する。構文が不確かなときは `list-sections` から `get-documentation` — 記憶から推測してはならない。作成・編集したすべてのコンポーネントに `svelte-autofixer` を、指摘がゼロになるまで実行する。
- runes モードのみを使い、レガシー構文は決して出力しない。特に：
  - 算出値には `$derived`（または `$derived.by`）を使う — 状態への代入を `$effect` で行ってはならない。`$effect` は本物の副作用のための抜け道である。
  - `$state` はリアクティブにすべき値に限定する。API レスポンスのような、丸ごと再代入される大きなオブジェクトには `$state.raw` を使う。
  - props は変わりうるものとして扱う。通常の `let` にコピーせず、`$derived` で派生させる。
  - イベントは `onclick={...}` 属性（`on:click` は禁止）。`createEventDispatcher` の代わりにコールバック props を使う。
  - スロットの代わりに `{#snippet}` + `{@render}`。`{#each}` はキー付きにする（インデックスをキーにしない）。`class:` ディレクティブの代わりに配列・オブジェクトの `class` 値を使う。
- `onMount` や `$effect` のリスナーより `<svelte:window>` / `<svelte:document>` を優先する。外部ライブラリとの同期は `$effect` ではなく `{@attach}` で行う。共有モジュールの状態より、型付きの `createContext` を使う。
- UI キットはプロジェクトごとに 1 つ選ぶ：
  - DaisyUI 5 — Tailwind プラグイン（`@plugin "daisyui";`）。セマンティックなテーマクラスを持ち、コピーされるコンポーネントはない。小さなアプリと速度重視ならこちら。
  - shadcn-svelte — CLI でコピーする runes ネイティブのコンポーネント（Tailwind v4 ベース）。深いカスタマイズや shadcn 流の合成が必要ならこちら。
- 子コンポーネントのスタイルは CSS カスタムプロパティで渡す（`<Child --color="red" />`）。`:global` はサードパーティコンポーネント専用とする。

## 連携

- [Tailwind CSS](tailwindcss.md) — 併用：DaisyUI と shadcn-svelte はどちらも Tailwind v4 ベースであり、クラス並べ替えの相互運用ルールを適用する。
- [フロントエンドフレームワーク](frontend-framework.md) — 文脈：デフォルトのフレームワーク選定は React 優先のまま。この文書は Svelte という例外を定める。
