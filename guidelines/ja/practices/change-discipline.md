---
id: practices/change-discipline
lang: ja
version: 2
source-lang: en
status: active
digest: 570d985b
---

# 変更の規律

自明でない変更は、レビューに渡す前にこのチェックリストに通す。[運用プロトコル](agent-protocol.md)と併用する。

## 完了チェックリスト

変更を完了とみなす前に、次を確認すること。

- 要求された振る舞いが、実際に実装されていること。
- 関連するフォーマットチェックを実行すること。
- リンターを実行すること。
- 該当する場合は型チェックを実行すること。
- 関連するテストを実行すること。
- 適切な [prek チェック](../toolchain/quality-gates.md)を実行すること。
- コミットを扱うときは、[Conventional Commits](../toolchain/git.md)を検証すること。
- diff をレビューすること。
- 意図しない変更がないか確認すること。
- 不要な新しい依存関係がないか確認すること。
- 不要な新しいファイルがないか確認すること。
- アーキテクチャとの整合性を確認すること。
- コードの言語への準拠を確認すること（[言語ポリシー](language-policy.md)）。
- プロダクト言語への準拠を確認すること（[言語ポリシー](language-policy.md)）。
- 機密情報がないかを確認すること（[セキュリティ](security.md)）。

## 実例：不安定なログインテストの修正

対象の変更は次のとおりである。`tests/e2e/login.spec.ts` が CI でときどき失敗する。修正は、固定の 3 秒待ちを session cookie の待機に置き換える。

まず振る舞いを確認する。不安定なテストは繰り返し通過しなければならず、1 回の成功では足りない。

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

静的なゲートを実行し、チェックに引っかけてみる。

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

残っていた import を削除して再実行する。通過すると次のようになる。

```text
$ mise run check
oxfmt   ok
oxlint  ok
tsc     ok
```

次に diff を確認する。

```text
$ git diff --stat
 tests/e2e/login.spec.ts | 8 +++++---
 1 file changed
```

変更は 1 ファイルだけで、新しい依存関係も新しいファイルもなく、アーキテクチャへの影響はない。テストに追加したコメントは[言語ポリシー](language-policy.md)に従って英語にする。ユーザーに見える文字列は変わらないため、プロダクト言語への準拠にも影響しない。認証情報はテストフィクスチャにのみ置き、diff には入れない（[セキュリティ](security.md)）。

コミットする。prek がステージされたツリーに対して同じチェックを実行し、コミットメッセージは [Conventional Commits](../toolchain/git.md)に従う。

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

これが通過した状態である。すべてのチェックが緑で、diff を行ごとに読み、説明できない変更が何も残っていない。

## 緑の CI は証明ではない

CI の通過は必要条件だが、それだけでは実装が正しいことの証明にならない。

パイプラインが成功しているからといって、diff のレビューと変更の正否の確認を、おろそかにしてよい理由にはならない。
