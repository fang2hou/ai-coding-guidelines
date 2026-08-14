---
id: practices/dependencies
lang: ja
version: 1
source-lang: en
status: active
digest: 45675de4
---

# 依存関係の規律

## 5 つの質問

依存関係を追加する前に、次の問いを立てること。

1. プロジェクトに、既に適切な機能が含まれていないか。
2. フレームワークまたは標準ツールチェーンが、既に解決策を提供していないか。
3. その依存関係で解決しようとしているのは、実際の要件か。
4. 保守コストはどうか。
5. 標準化されたツールチェーンとの互換性はどうか。

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
