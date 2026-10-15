---
id: practices/corner-radius
lang: ja
version: 1
source-lang: en
status: active
digest: a8d78371
---

# 角丸

## 原則

- 角丸は要素ごとの値ではなくシステムである。プロジェクトごとに少数のトークンスケールを一度だけ定義し、すべての角丸をそこから取り出す。
- 2 つのルールですべての場面をカバーする。単一のサーフェスには連続角丸、ネストされたサーフェスには同心の曲率である。
- 両方のルールを機械的に適用する。個々の角丸は単体ではほとんど間違って見えない。安っぽく、あるいは断絶して見えるのは誤った組み合わせである。

## トークンスケール

```css
:root {
  --radius-s: 6px;       /* dense rows, chips */
  --radius-m: 8px;       /* buttons, inputs — the default control radius */
  --radius-l: 12px;      /* popovers, menus */
  --radius-xl: 20px;     /* cards, sheets, dialogs */
  --radius-full: 9999px; /* circles, pills */
}
```

- プロジェクト内のすべての角丸はこのスケールから取る。場当たり的な値（`13px`）はネストの計算に参加できず、すぐに崩れる。
- 隣接する段階は区別できる差を保つ（このサイズでは 2px 以上）。

## 単一のサーフェス：連続角丸

- `border-radius` だけでは、直線の縁と円弧が接合する。この曲率の急変こそ、普通のウェブの角丸が Apple の連続角丸より硬く見える原因である。
- 既存の `border-radius` に `corner-shape` を組み合わせる。`border-radius` は引き続き角の大きさを決め、`corner-shape` は曲線の形だけを変える。背景、ボーダー、アウトライン、シャドウ、`overflow: hidden`、`backdrop-filter` はすべて結果の形状に追従する。`clip-path` も SVG マスクも不要である。
- プロジェクト全体で `squircle`（= `superellipse(2)`）の 1 値に統一する。角の形状はトークン体系の一部であり、要素ごとに変えない。
- 角丸自体がデザイン上の判断になる場所に適用する。カード、シート、ダイアログ、タイル、メディア、アプリレベルのサーフェス（≥ `--radius-l`）。約 6px 未満では `round` との差が見えないため、そこには設定しない。
- プログレッシブエンハンスメントのみに使う。2026 年後半時点では Chromium 系ブラウザ（139+）だけが `corner-shape` を描画し、Safari と Firefox は無視して通常の角丸にフォールバックする。このフォールバックは許容できる。JS や SVG のポリフィルを決して導入しない。
- `border-radius` が `0` に解決される場合、`corner-shape` は効果を持たない。

```css
.card {
  border-radius: var(--radius-xl);
  corner-shape: squircle;
}
```

## ボタンとコントロール：中程度の角丸

- ボタン、入力、セレクトはデフォルトで中程度のトークン（`--radius-m`、36〜40px のコントロールで約 8px）を使う。密なレイアウトでは浅い段階（`--radius-s`）を下限として使える。
- 中程度の角丸は、テキストと隣接コントロールの整列に使える直線の縁を残し、コントロール内側の hover と押下状態が同心を保つ余地を作る。
- 完全な円（`--radius-full`）のボタンはチップ、タグ、アイデンティティ要素（アバター、トグル）に限る。アクションボタンには使わない。

## ネストされたサーフェス：同心ルール

- 外側の半径 `R` のサーフェスの内側に `p` px 入り込んだ層の半径は `r = R − p`（下限 0）でなければならない。こうすると両方の角が同じ曲率中心を共有し、内側の層は「上に貼られたシール」ではなく「同じ表面が持ち上がったもの」として見える。
- このルールは hover と押下のオーバーレイ（`::before` / `::after`）、フォーカスリング、カード上のバッジ、パディングを持つサーフェスの内側にあるメディアとコントロール、セグメントコントロール、ツールチップに適用する。
- 不一致なネスト——内側と外側の半径が等しい、内側が任意の値——こそ、hover 状態やバッジが断絶した異物の層に見える原因である。

### 標準的な実装パターン

- `inset: 0` のオーバーレイ：`border-radius: inherit` を使う。
- 表面のパディング分だけ内側に入る層：同じトークンから `calc()` で計算する。
- コントロールの外側のフォーカスリング：`outline` か `box-shadow` を使う。どちらも外側の半径に自動的に追従する。
- 幅 `w` のボーダーを角丸のボックスに引く場合：内側の縁はすでに `R − w` で描かれる。追加の角丸を設定しない。

```css
.button {
  border-radius: var(--radius-m);
}
.button::before {
  /* hover fill */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit; /* concentric by construction */
}

.card {
  border-radius: var(--radius-xl);
  padding: 12px;
}
.card .media {
  /* 20 - 12 = 8: same center of curvature as the card */
  border-radius: calc(var(--radius-xl) - 12px);
}
```

- （任意のアートワークやラスター縁などで）厳密な一致が不可能な場合は、きつく寄せる。`r ≤ R − p` を保つ。ややきつい内側の角は意図的に見え、緩い角は壊れて見える。

## 確認項目

- diff 内のすべての角丸がトークンスケールから取られている。
- コントロールは中程度のトークンを使い、完全な円はチップ、タグ、アイデンティティ要素にしか現れない。
- すべてのネストされた層は `r = R − p` を満たすか、半径を継承するか、`outline` / `box-shadow` を使っている。
- ≥ `--radius-l` のサーフェスに `corner-shape: squircle` が設定されている。ポリフィルは導入していない。

## 連携

- [コーディング標準](coding-standards.md)——文脈：トークンスケールはマジックナンバー禁止ルールの一例である。
- [Tailwind CSS](../libraries/tailwindcss.md)——併用（条件付き）：Tailwind を使うプロジェクトではスケールをテーマトークンとして表現する。同心ルールは変わらない。
- [Liquid Glass デザイン](../platforms/liquid-glass-design.md)——文脈：Apple プラットフォームではウェブの近似ではなく、システムの連続角丸 API を使う。
