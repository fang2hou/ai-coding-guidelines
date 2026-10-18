---
id: toolchain/git
lang: ja
version: 4
source-lang: en
status: active
digest: 984d81cf
---

# Git ワークフロー

## Conventional Commits

プロジェクトのすべてのコミットは、Conventional Commits 仕様に従わなければならない。

次のような意味のあるタイプを使う。

```text
feat
fix
refactor
test
docs
build
ci
chore
```

明確になる場合はスコープを使う。

例：

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
refactor(api): simplify request validation
test(search): cover empty-result behavior
ci(commit): validate conventional commits
```

共有リポジトリの履歴に残すコミットでは、次のような無意味なコミットメッセージを使ってはならない。

```text
update
changes
fix stuff
wip
```

破壊的変更は、Conventional Commits の規約に従って表現しなければならない。

## Cocogitto

Conventional Commits の検証にはすべてのプロジェクトで Cocogitto を使い、標準ツール経由でローカルのコミットフローにも組み込む。リポジトリごとに別の検証ツールを選んだり、独自のパーサーを書いたりしない。

## GitHub Actions での検証

GitHub Actions でも Cocogitto を使って Conventional Commits を検証する。

`cog verify` はコミットを作成しないにもかかわらず Git の作成者情報を解決するため、Git のユーザー情報が未設定だと `config value 'user.name' was not found` で失敗する。GitHub Actions のランナーには、デフォルトで Git のユーザー情報が設定されていない。ジョブ内で `user.name` と `user.email` を設定してから呼び出すこと。`cog check` は既存のコミットを読むだけなので、ユーザー情報は不要である。

不正なコミットメッセージを含むプルリクエストでは、検証パイプラインを失敗させる。

リポジトリが squash merge を使い、最終的なコミットメッセージにプルリクエストのタイトルを使う場合は、プルリクエストのタイトルにも同じ Conventional Commits 規約を適用し、PR の検証と最終履歴を一致させる。

CI ワークフローの標準については [GitHub Actions](../toolchain/github-actions.md) を参照。

## リポジトリ属性

GitHub でホストするプロジェクトでは `.gitattributes` をコミットし、ロックファイル、設定ファイル、テストデータによって GitHub の言語統計が歪まないようにする。

ブラックリストではなくホワイトリスト方式を採る。デフォルトですべてを統計から外し、プロジェクト本来のコードや文書だけを対象に戻す。

```gitattributes
* -linguist-detectable
src/** linguist-detectable
*.json -linguist-detectable
*.yaml -linguist-detectable
pnpm-lock.yaml linguist-generated
```

Markdown などの文書向け言語はデフォルトでは統計に含まれないため、明示的な `linguist-detectable` ルールを指定する必要がある。後から追加したファイルは、明示的に有効化するまで統計対象外のままである。

ディレクトリ単位で統計対象に含めると、配下のデータファイルやツールチェーンファイルも対象になる。属性ルールは最後にマッチしたものが優先されるため、許可ルールの後に除外パターンを追加する。データファイルは拡張子で（`*.json`、`*.yaml`、`*.toml`）、ロックファイルなどの生成ファイルには `linguist-generated` を指定する。

ファイル自体にはコメントを入れず、その理由をプルリクエストまたはプロジェクトのドキュメントに記録する。

## Git の安全運用

レビューと承認なしに共有ブランチへ force push したり履歴を書き換えたりしてはならない。AI エージェントは破壊的な Git 操作を勝手に行わないこと。
