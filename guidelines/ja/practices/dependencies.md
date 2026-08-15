---
id: practices/dependencies
lang: ja
version: 2
source-lang: en
status: active
digest: fde00fff
---

# 依存関係の規律

## 5 つの質問

依存関係を追加する前に、次の 5 つの問いを順に立てること。

1. プロジェクトに、既に適切な機能が含まれていないか。
2. フレームワーク、プラットフォーム、または標準ツールチェーンが、既に解決策を提供していないか。
3. その依存関係で解決しようとしているのは、実際の要件か。
4. 保守コストは許容範囲か。
5. 標準化されたツールチェーンと互換性があるか。

適用例：TypeScript プロジェクトで、実行時検証のために `zod` を追加するケース。

1. プロジェクト：現状、実行時検証は存在しない。
2. プラットフォーム：TypeScript の型はコンパイル時にのみ存在し、リクエストボディや環境変数は実行時には型を持たない。
3. 要件：外部入力は実行時の境界を越えるため、使用前に検証が必要である。
4. 保守：単一用途のライブラリで API の表面は小さく、追跡すべき依存関係は 1 つである。
5. ツールチェーン：純粋なランタイムライブラリであり、pnpm でインストールし、oxlint や oxfmt と競合しない。

判断：`zod` を追加する。

同じ問いは、弱い候補を却下する。`truncate` のような文字列ユーティリティライブラリは問い 3 で失敗する。3 行の明確なコードで実装でき、依存関係は不要である。プラットフォームの `fetch` で要件が満たされるなら、`axios` は問い 2 で失敗する。

ライブラリなしで明確に実装できる些末な機能のために、ライブラリを追加しないこと。

ユーザーの明示的な承諾なしに、標準化されたツールを別の依存関係に置き換えないこと。

## 互換性の参照先

互換性は、必須ツールチェーンを基準に評価すること。

- [TypeScript ツールチェーン](../toolchain/typescript.md) — pnpm、oxlint、oxfmt
- [Python ツールチェーン](../toolchain/python.md) — uv、ruff
- [品質ゲート](../toolchain/quality-gates.md) — prek
- [Git ワークフロー](../toolchain/git.md) — Conventional Commits 用の Cocogitto

推奨ライブラリの選定については、[フロントエンドフレームワーク](../libraries/frontend-framework.md)と[Python API スタック](../libraries/python-api-stack.md)を参照のこと。

これらの規則を支える標準化の原則は、[エンジニアリング基本原則](../principles/core-principles.md)で定義される。
