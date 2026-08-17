---
id: practices/agent-protocol
lang: ja
version: 2
source-lang: en
status: active
digest: 4dbf61a7
---

# エージェント運用プロトコル

## 運用プロトコル

単純ではない変更を行う前に、AI エージェントは次の手順を踏むこと。

1. ユーザーの本来の意図を理解する。
2. 既存の実装を調査する。
3. 関連するプロジェクトドキュメントを読む。
4. アーキテクチャの不変条件と関連する ADR を確認する（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
5. 既存のツールチェーンとプロジェクトの規約を確認する。
6. 既存の依存関係とパターンを優先して使う。
7. 要件を満たす、最小限でまとまりのある変更を行う。
8. 無関係なクリーンアップは行わない。
9. 関連する検証を実行する。
10. 変更後の diff をレビューする。
11. 意図せず追加されたファイルや無関係な変更がないことを確認する。
12. アーキテクチャ、依存関係、セキュリティ、振る舞いに関わる重要な変更を説明する。

エージェントが別のスタイルを好むというだけの理由で、動作しているコードを書き直してはならない。

似たコードが 2 か所に現れただけで、抽象化を導入してはならない。

抽象化は、保守性、正しさ、アーキテクチャに関する実際の問題を解決する場合に限って導入すること。

## メモリの扱い

永続メモリを持つ AI エージェントは、このプロジェクトが本エンジニアリングガイドラインを採用していることを記憶しておくこと。

メモリはリマインダーにすぎず、信頼できる唯一の情報源ではない。

リポジトリにあるガイドラインとプロジェクトドキュメントは、記憶している情報より常に優先される。

永続メモリを持つエージェントは、重要な作業中にも、現在のプロジェクトガイドラインを定期的に読み返すこと。

特に次の場合は、関連する節を読み直すこと。

- 重要なプロジェクト作業を始めるとき
- アーキテクチャを変更する前
- 依存関係を追加または置き換える前
- CI/CD を変更する前
- ツールチェーンの設定を変更する前
- UI 言語の動作を変更する前
- 既存のプロジェクト規約が不明確なとき
- 記憶とリポジトリの内容が食い違うとき

リポジトリに現在の規則がある場合、記憶した要約に頼ってはならない。

## ハードルール早見表

次の行為は禁止である。各項目には、規則を定義するドキュメントへのリンクを付けている。規則を変更したときは、このリストも必ず更新すること。

1. ユーザーの明示的な承諾なしに、必須の標準ツールを置き換えてはならない（[エンジニアリング基本原則](../principles/core-principles.md)）。
2. pnpm の代わりに npm や yarn を使用してはならない（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
3. 標準のプロジェクトリンターとして、oxlint の代わりに ESLint を使用してはならない（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
4. oxfmt の代わりに Prettier を使用してはならない（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
5. uv の代わりに Pipenv や Poetry を使用してはならない（[Python ツールチェーン](../toolchain/python.md)）。
6. ruff の代わりに flake8 や black を使用してはならない（[Python ツールチェーン](../toolchain/python.md)）。
7. prek の代わりに pre-commit や Lefthook を使用してはならない（[品質ゲート](../toolchain/quality-gates.md)）。
8. 正当な理由と承諾なしに、Cocogitto を無関係な Conventional Commits バリデーターに置き換えてはならない（[Git ワークフロー](../toolchain/git.md)）。
9. 内容を理解しないまま、lint や検証の問題を無視してはならない（[エンジニアリング基本原則](../principles/core-principles.md)）。
10. チェックを通すためだけに、有用なルールを無効化してはならない（[エンジニアリング基本原則](../principles/core-principles.md)）。
11. 迅速な検証が求められるプロジェクトを、過剰に設計してはならない（[エンジニアリング基本原則](../principles/core-principles.md)）。
12. 不要な依存関係を導入してはならない（[依存関係の規律](../practices/dependencies.md)）。
13. 冗長なファイルやモジュールを作成してはならない（[コーディング規約](../practices/coding-standards.md)）。
14. ADR を黙って破ってはならない（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
15. アーキテクチャの不変条件を誤って変更してはならない（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
16. ソースコードに英語以外の識別子やコメントを使用してはならない（[言語ポリシー](../practices/language-policy.md)）。
17. 日本語のローマ字（romaji）や中国語のピンイン（pinyin）を、コード識別子として使用してはならない（[言語ポリシー](../practices/language-policy.md)）。
18. 会話言語から UI 言語を推測してはならない（[言語ポリシー](../practices/language-policy.md)）。
19. 複数の言語にまたがる UI 作業で、品質の低い直訳を作ってはならない（[言語ポリシー](../practices/language-policy.md)）。
20. shadcn/ui コンポーネントの内部を不必要に変更してはならない（[shadcn/ui](../libraries/shadcn-ui.md)）。
21. 必要な shadcn/ui コンポーネントの変更を文書化せずに放置してはならない（[shadcn/ui](../libraries/shadcn-ui.md)）。
22. インストール済みの coss ui コンポーネントファイルを直接編集せず、合成・ラッピング・テーマ設定で対応すること（[coss](../libraries/coss.md)）。
23. 互換性を確認せず、GitHub Actions を安易にアップグレードしてはならない（[GitHub Actions](../toolchain/github-actions.md)）。
24. シークレットや機密情報をコミットしてはならない（[セキュリティ](../practices/security.md)）。
25. 適切な承認を得ずに、共有履歴へ force push してはならない（[Git ワークフロー](../toolchain/git.md)）。
26. CI が通ったことだけを根拠に、実装が正しいかどうかを確認せずに済ませてはならない（[変更の規律](../practices/change-discipline.md)）。
