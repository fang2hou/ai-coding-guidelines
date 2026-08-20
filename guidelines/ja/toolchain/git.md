---
id: toolchain/git
lang: ja
version: 4
source-lang: en
status: active
digest: 8d63afaf
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

Cocogitto は標準の Conventional Commits 検証ツールである。

リポジトリごとに別のコミット検証ツールを選ぶのではなく、すべてのプロジェクトで一貫して Cocogitto を使う。

適切な場合は、プロジェクト標準のツールを通じて、Cocogitto をローカルのコミットワークフローに組み込む。

Cocogitto が必要な検証をすでに提供している場合は、独自の Conventional Commits パーサーを実装しない。

## GitHub Actions での検証

GitHub Actions には、Conventional Commits の検証ステップを含めなければならない。

この検証には Cocogitto を使う。

`cog verify` はコミットを作成しないにもかかわらず Git の作成者情報を解決するため、Git のユーザー情報が未設定だと `config value 'user.name' was not found` で失敗する。GitHub Actions のランナーには、デフォルトで Git のユーザー情報が設定されていない。ジョブ内で `user.name` と `user.email` を設定してから呼び出すこと。`cog check` は既存のコミットを読むだけなので、ユーザー情報は不要である。

不正なコミットメッセージを含むプルリクエストでは、該当する検証パイプラインが失敗するようにすること。

リポジトリで squash merge を使い、生成されるコミットメッセージがプルリクエストのタイトルに基づく場合は、そのタイトルも同じ Conventional Commits 規約に従わなければならない。

目標は、次の両方を一貫させることである。

- プルリクエストの検証
- 最終的なリポジトリの履歴

CI ワークフローの標準については [GitHub Actions](../toolchain/github-actions.md) を参照。

## リポジトリ属性

GitHub 上でホストされるプロジェクトは、`.gitattributes` ファイルをコミットすること。

GitHub の言語統計を正確に保つために使う。ツールチェーンファイル（ロックファイル、設定、CI 定義）やデータファイル（フィクスチャ、スナップショット）によって、プロジェクトの中核となる内容を埋もれさせてはならない。

ブラックリストではなくホワイトリストを優先する。デフォルトですべてを統計から除外し、プロジェクト本体だけを統計対象に戻す。

```gitattributes
* -linguist-detectable
src/** linguist-detectable
*.json -linguist-detectable
*.yaml -linguist-detectable
pnpm-lock.yaml linguist-generated
```

Markdown などの文書向け言語はデフォルトでは統計に含まれないため、明示的な `linguist-detectable` ルールを指定する必要がある。後から追加したファイルは、明示的に有効化するまで統計対象外のままである。

ディレクトリ単位で統計対象に戻すと、その配下のデータファイルやツールチェーンファイルも一緒に統計へ含まれてしまう。属性ルールは最後にマッチしたものが優先されるため、許可ルールの後に除外パターンを追加する。データファイルは拡張子で（`*.json`、`*.yaml`、`*.toml`）、ロックファイルなどの生成ファイルには `linguist-generated` を指定する。

ファイル自体にはコメントを入れず、その理由をプルリクエストまたはプロジェクトのドキュメントに記録する。

## Git の安全運用

適切なレビューと承認を経ずに、force push で共有リポジトリの履歴を書き換えてはならない。

確立されたレビューワークフローに従う。

利便性だけを理由に、共有リポジトリの履歴を書き換えない。

AI エージェントは、破壊的な Git 操作を軽々しく行ってはならない。
