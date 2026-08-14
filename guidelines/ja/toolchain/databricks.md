---
id: toolchain/databricks
lang: ja
version: 1
source-lang: en
status: active
digest: 1b7acd54
---

# Databricks

## Apps と Jobs

Databricks は、関連するデータおよび AI ワークロードにおける推奨プラットフォームである。

アプリケーションでは、ホスティングとアプリケーション管理に適している場合は Databricks Apps を優先する。

スケジュール実行や自動実行が必要な場合は、Databricks Jobs を使う。

## デフォルトの稼働時間帯

アプリケーションを稼働時間内に限定すべきプロジェクトでは、デフォルトの稼働時間帯を次とする。

```text
09:00 - 22:00 GMT+9
```

プロジェクト側に別の明示的な要件がある場合はこの限りではない。

## デプロイメントファイル

Databricks のデプロイメント YAML と関連するデプロイ設定は、次の配下に置く。

```text
/deploy
```

デプロイ設定は、現在サポートされている Databricks Apps 環境とデプロイモデルに即した内容でなければならない。

デプロイ設定を編集するときは、環境関連の設定が現在のプロジェクト要件と引き続き互換性を保っているかを確認する。

## 権限

デプロイ設定には、適切なアクセス権限を定義してよい。

適切な場合は、同じプロジェクトまたはチームのメンバーに、必要な編集権限を与える。

意図したプロジェクト境界の外側へ、意図せず権限を広げない。

Databricks のワークロードを支える Python サービスは、[Python API Stack](../libraries/python-api-stack.md) に従う。
