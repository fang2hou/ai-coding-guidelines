---
id: practices/project-documentation
lang: ja
version: 1
source-lang: en
status: active
digest: 648a7751
---

# 必須プロジェクトドキュメント

すべてのプロジェクトは、次の 4 つのドキュメントを維持しなければならない。出発点として、`templates/` 配下のテンプレートを使用すること。

## README.md

すべてのプロジェクトに `README.md` を含めること。

README は、人間の開発者と AI エージェントの双方に向けて書く。

プロジェクトを理解し、使用するために必要な情報を含むべきである。例えば次のものである。

* プロジェクトの概要
* 目的
* セットアップ手順
* 基本的な使い方
* 重要なアーキテクチャやワークフローへの参照
* 関連する環境要件

プロジェクトの進化に合わせて、最新の状態に保つこと。

プロジェクトで確定したプロダクト/UI の言語ポリシー([言語ポリシー](language-policy.md)を参照)も、明確に見える適切なプロジェクトドキュメント — できれば README または DEVELOPMENT ドキュメント — に記録すべきである。

テンプレート: [README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

すべてのプロジェクトに `DEVELOPMENT.md` を含めること。

次の内容を記述すること。

* 開発ワークフロー
* ツールチェーン
* よく使う mise タスク
* コーディング規約
* テストワークフロー
* ローカルセットアップ
* 検証ワークフロー
* 必要に応じたデプロイワークフロー

人間と AI エージェントの双方が、開発をどのように進めるべきかを理解できる内容にすること。

テンプレート: [DEVELOPMENT.template.md](../../../templates/DEVELOPMENT.template.md)

## CONTRIBUTING.md

すべてのプロジェクトに `CONTRIBUTING.md` を含めること。

次の内容を文書化すること。

* コントリビューションにあたっての要件
* 必要に応じた Issue ワークフロー
* プルリクエストのワークフロー
* レビュー要件
* 必須の検証
* コミット規約

AI が生成した、または AI が支援したプルリクエストでは、説明文に次の内容を明確に含めること。

* 変更の目的
* 変更の影響
* 関連する文脈や背景
* 潜在的なリスクや懸念
* 実施したテストまたは検証

GitHub のプルリクエストテンプレートは、これらの要件と同期を保たなければならない。

テンプレート: [CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

意味のあるアーキテクチャ上の境界を持つプロジェクトは、`ARCHITECTURE.md` を維持すべきである。

短く、運用に即した内容に保つこと。

網羅的な理論文書のようなアーキテクチャドキュメントにしないこと。

第一の目的は、意図しないアーキテクチャのドリフトを防ぐことである。

不変条件と ADR の運用は、[アーキテクチャガバナンス](architecture-governance.md)で定義される。

テンプレート: [ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
