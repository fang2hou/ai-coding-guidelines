---
id: practices/agent-protocol
lang: ja
version: 5
source-lang: en
status: active
digest: e5e49807
---

# エージェント運用プロトコル

## 運用プロトコル

自明でない変更を行う前に、AI エージェントは次の手順を踏むこと。

1. ユーザーの本来の意図を理解する。
2. 既存の実装を調査する。
3. 関連するプロジェクトドキュメントを読む。
4. アーキテクチャの不変条件と関連する ADR を確認する（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
5. 既存のツールチェーンとプロジェクトの規約を確認する。
6. 既存の依存関係とパターンを優先して使う。
7. 要件を満たす、最小限で完結した変更を行う。
8. 無関係なクリーンアップは行わない。
9. 関連する検証を実行する。
10. 変更後の diff をレビューする。
11. 意図せず追加されたファイルや無関係な変更がないことを確認する。
12. アーキテクチャ、依存関係、セキュリティ、振る舞いに関わる重要な変更を説明する。

自分の好みのスタイルというだけで、動作しているコードを書き直してはならない。

似たコードが 2 か所に現れただけで抽象化を導入してはならない。保守性、正しさ、アーキテクチャの実際の問題を解決するときに限って導入する。

## メモリの扱い

永続メモリを持つ AI エージェントは、このプロジェクトが本ガイドラインを採用していることを記憶しておくこと。

メモリは手がかりにすぎず、信頼できる唯一の情報源ではない。リポジトリ内のガイドラインとプロジェクトドキュメントが、常に記憶より優先される。

大きな作業の間は、現在のガイドラインを随時読み返すこと。特に次の場面では関連する節を確認する。

- 重要なプロジェクト作業を始めるとき
- アーキテクチャを変更する前
- 依存関係を追加または置き換える前
- CI/CD を変更する前
- ツールチェーンの設定を変更する前
- UI 言語の動作を変更する前
- 既存のプロジェクト規約が不明確なとき
- 記憶とリポジトリの内容が食い違うとき

リポジトリに現在の規則があるのに、記憶した要約に頼ってはならない。

## ハードルール早見表

次の行為は禁止である。各項目には、規則を定義するドキュメントへのリンクを付けている。規則を変更したときは、このリストも必ず更新すること。

1. ユーザーの明示的な承諾なしに、必須の標準ツールを置き換える（[エンジニアリング基本原則](../principles/core-principles.md)）。
2. pnpm の代わりに npm や yarn を使用する（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
3. 標準のプロジェクトリンターとして、oxlint の代わりに ESLint を使用する（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
4. oxfmt の代わりに Prettier を使用する（[TypeScript ツールチェーン](../toolchain/typescript.md)）。
5. uv の代わりに Pipenv や Poetry を使用する（[Python ツールチェーン](../toolchain/python.md)）。
6. ruff の代わりに flake8 や black を使用する（[Python ツールチェーン](../toolchain/python.md)）。
7. prek の代わりに pre-commit や Lefthook を使用する（[品質ゲート](../toolchain/quality-gates.md)）。
8. 正当な理由と承諾なしに、Cocogitto を別の Conventional Commits バリデーターに置き換える（[Git ワークフロー](../toolchain/git.md)）。
9. 内容を理解しないまま、lint や検証の問題を無視する（[エンジニアリング基本原則](../principles/core-principles.md)）。
10. チェックを通すためだけに、有用なルールを無効化する（[エンジニアリング基本原則](../principles/core-principles.md)）。
11. 迅速な検証が求められるプロジェクトを過剰に設計する（[エンジニアリング基本原則](../principles/core-principles.md)）。
12. 不要な依存関係を導入する（[依存関係の規律](../practices/dependencies.md)）。
13. 冗長なファイルやモジュールを作成する（[コーディング規約](../practices/coding-standards.md)）。
14. ADR を黙って破る（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
15. アーキテクチャの不変条件を誤って変更する（[アーキテクチャガバナンス](../practices/architecture-governance.md)）。
16. ソースコードに英語以外の識別子やコメントを使用する（[言語ポリシー](../practices/language-policy.md)）。
17. ローマ字（romaji）やピンイン（pinyin）をコード識別子として使用する（[言語ポリシー](../practices/language-policy.md)）。
18. 会話言語から UI 言語を推測する（[言語ポリシー](../practices/language-policy.md)）。
19. 複数言語にまたがる UI 作業で、品質の低い直訳を作る（[言語ポリシー](../practices/language-policy.md)）。
20. 互換性を確認せずに GitHub Actions を安易にアップグレードする（[GitHub Actions](../toolchain/github-actions.md)）。
21. シークレットや機密情報をコミットする（[セキュリティ](../practices/security.md)）。
22. 適切な承認を得ずに、共有履歴へ force push する（[Git ワークフロー](../toolchain/git.md)）。
23. CI が緑だからといって、実装の正しさの確認を怠る（[変更の規律](../practices/change-discipline.md)）。
24. 明示的なサプライチェーンポリシーがないのに、GitHub Actions を現在のメジャーバージョンタグではなくコミット SHA に固定する（[GitHub Actions](../toolchain/github-actions.md)）。
