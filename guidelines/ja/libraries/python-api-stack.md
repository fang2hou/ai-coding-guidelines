---
id: libraries/python-api-stack
lang: ja
version: 1
source-lang: en
status: active
digest: 073cf484
---

# Python API スタック

## 判定

推奨 — FastAPI + Pydantic + Uvicorn を Python API の標準スタックとする。3 つを個別に選ぶのではなく、1 つのスタックとして採用する。

## 使用する場面

- [Python ツールチェーン](../toolchain/python.md)の基準に照らして、Python バックエンドの採用が正当化される場合。
- データ検証と構造化モデルを必要とする Python API を構築する場合。
- デプロイプラットフォームがマネージド ASGI サーバーを提供しない環境で、FastAPI アプリケーションを稼働させる場合。

## 避けるべき場面

- TypeScript だけのアーキテクチャで十分な場合は、Python バックエンドを自動的に導入してはならない（[Python ツールチェーン](../toolchain/python.md)を参照）。
- デプロイプラットフォームが、Uvicorn の代わりとなる適切なマネージドサービスを提供する場合。

## 長所

- FastAPI：OpenAPI ドキュメントを自動生成する高性能な ASGI フレームワーク。
- Pydantic：型付きデータ検証と構造化モデルを提供し、FastAPI のリクエストとレスポンスの処理に統合できる。
- Uvicorn：FastAPI アプリケーションを稼働させる軽量で標準的な ASGI サーバー。

## トレードオフ

- このスタックを導入すると、独自の依存関係とデプロイ対象を持つ Python サービスが増える。
- Pydantic モデルは、検証対象のデータとの同期を保たなければならない。

## バージョン方針

- 新規プロジェクトでは、FastAPI、Pydantic、Uvicorn の最新の安定版を優先する。
- 具体的な互換性の理由がない限り、スタックを古いバージョンに留めてはならない。

## 利用ルール

- Python API フレームワークには FastAPI を使う。
- Python のデータ検証と構造化モデルには、適切な箇所で Pydantic を使う。
- FastAPI アプリケーションの標準 ASGI サーバーには Uvicorn を使う。ただし、デプロイプラットフォームが Uvicorn に代わる適切なマネージドサービスを提供する場合を除く。

## 連携

### 内部の相互関係

- FastAPI + Pydantic — Pydantic モデルは FastAPI の検証レイヤーである。リクエストとレスポンスのスキーマは、独自実装の検証ではなく Pydantic モデルとして定義する。
- FastAPI + Uvicorn — Uvicorn は FastAPI アプリケーションの標準 ASGI サーバーである。ただし、プラットフォームが Uvicorn に代わる適切なマネージドサービスを提供する場合を除く。

### 関連ガイドライン

- [Python ツールチェーン](../toolchain/python.md) — このスタックの環境、依存関係、リンティングは uv と ruff で管理する。
