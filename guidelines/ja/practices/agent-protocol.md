---
id: practices/agent-protocol
lang: ja
version: 2
source-lang: en
status: active
digest: 091ade5a
---

# エージェント運用プロトコル

## 運用プロトコル

自明でない変更を行う前に、AI エージェントは次の手順を踏むべきである。

1. ユーザーの真の意図を理解する。
2. 既存の実装を調査する。
3. 関連するプロジェクトドキュメントを読む。
4. アーキテクチャの不変条件と関連する ADR を確認する([アーキテクチャガバナンス](../practices/architecture-governance.md))。
5. 既存のツールチェーンとプロジェクトの規約を確認する。
6. 既存の依存関係とパターンを優先する。
7. 要件を満たす、最小かつ一貫した変更を行う。
8. 無関係なクリーンアップを避ける。
9. 関連する検証を実行する。
10. 結果の diff をレビューする。
11. 意図せず紛れ込んだファイルや無関係な変更がないことを確認する。
12. アーキテクチャ・依存関係・セキュリティ・動作に関する重要な変更を説明する。

エージェント自身が別のスタイルを好むという理由だけで、動作しているコードを書き直さないこと。

似たコードが 2 回現れるという理由だけで、抽象を導入しないこと。

抽象の導入は、実際の保守性・正しさ・アーキテクチャ上の問題を解決するときに限る。

## メモリの扱い

永続メモリを持つ AI エージェントは、このプロジェクトが本エンジニアリングガイドラインを使用していることを記憶すべきである。

メモリはリマインダーであり、信頼できる唯一の情報源ではない。

リポジトリ上のガイドラインとプロジェクトドキュメントは、記憶している情報より常に優先される。

永続的なエージェントは、大きな作業に取り組んでいる間も、現在のプロジェクトガイドラインに定期的に立ち返るべきである。

特に、次のタイミングで関連する節を読み直すこと。

- 本格的なプロジェクト作業の開始時
- アーキテクチャを変更する前
- 依存関係を追加・置換する前
- CI/CD を変更する前
- ツールチェーン設定を変更する前
- UI 言語の挙動を変更する前
- 既存のプロジェクト規約が不明確なとき
- 記憶とリポジトリの内容が矛盾するとき

リポジトリに現在の規則があるのに、記憶にある要約に頼らないこと。

## ハードルール早見表

以下の行為は禁止である。各項目は、規則を定義するドキュメントにリンクしている。規則を変更したときは、必ずこのリストも更新すること。

1. ユーザーの明示的な承諾なしに、必須の標準化ツールを置き換える。([エンジニアリング基本原則](../principles/core-principles.md))
2. pnpm の代わりに npm や yarn を使用する。([TypeScript ツールチェーン](../toolchain/typescript.md))
3. 通常のプロジェクトリンターとして、oxlint の代わりに ESLint を使用する。([TypeScript ツールチェーン](../toolchain/typescript.md))
4. oxfmt の代わりに Prettier を使用する。([TypeScript ツールチェーン](../toolchain/typescript.md))
5. uv の代わりに Pipenv や Poetry を使用する。([Python ツールチェーン](../toolchain/python.md))
6. ruff の代わりに flake8 や black を使用する。([Python ツールチェーン](../toolchain/python.md))
7. prek の代わりに pre-commit や Lefthook を使用する。([品質ゲート](../toolchain/quality-gates.md))
8. 理由と承諾なしに、Cocogitto を無関係の Conventional Commits バリデーターに置き換える。([Git ワークフロー](../toolchain/git.md))
9. 内容を理解しないまま、lint や検証の問題を無視する。([エンジニアリング基本原則](../principles/core-principles.md))
10. チェックを通すためだけに、有用なルールを無効化する。([エンジニアリング基本原則](../principles/core-principles.md))
11. 迅速な検証が求められるプロジェクトを、過剰に設計する。([エンジニアリング基本原則](../principles/core-principles.md))
12. 不要な依存関係を導入する。([依存関係の規律](../practices/dependencies.md))
13. 冗長なファイルやモジュールを作成する。([コーディング規約](../practices/coding-standards.md))
14. ADR を黙って違反する。([アーキテクチャガバナンス](../practices/architecture-governance.md))
15. 誤ってアーキテクチャの不変条件を変更する。([アーキテクチャガバナンス](../practices/architecture-governance.md))
16. ソースコードに、英語以外の識別子やコメントを使用する。([言語ポリシー](../practices/language-policy.md))
17. ローマ字(romaji)やピンイン(pinyin)をコード識別子として使用する。([言語ポリシー](../practices/language-policy.md))
18. 会話言語から UI 言語を推測する。([言語ポリシー](../practices/language-policy.md))
19. 複数言語が絡む UI 作業で、低品質な直訳を作り出す。([言語ポリシー](../practices/language-policy.md))
20. 不必要に、shadcn/ui コンポーネントの内部を改変する。([shadcn/ui](../libraries/shadcn-ui.md))
21. 必要が生じた shadcn/ui コンポーネントの変更を、文書化しないまま放置する。([shadcn/ui](../libraries/shadcn-ui.md))
22. インストール済みの coss ui コンポーネントファイルを、合成・ラッパー・テーマ設定ではなく直接編集する。([coss](../libraries/coss.md))
23. 互換性を確認せずに、GitHub Actions を無闇にアップグレードする。([GitHub Actions](../toolchain/github-actions.md))
24. シークレットや機密情報をコミットする。([セキュリティ](../practices/security.md))
25. 適切な承諾なしに、共有ヒストリーへ force push する。([Git ワークフロー](../toolchain/git.md))
26. 実装の正しさを理解する代わりに、CI が通っているだけで済ませる。([変更の規律](../practices/change-discipline.md))
