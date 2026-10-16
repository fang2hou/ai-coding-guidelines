import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import process from "node:process";
import MarkdownIt from "markdown-it";

// Static site builder: renders guidelines/{en,zh,ja} into dist/ as plain HTML.
// Output has no JavaScript; navigation, language switching, and prev/next are
// baked in per page. Deployed to the `pages` branch by .github/workflows/pages.yml.

const LANGS = ["en", "zh", "ja"] as const;
type Lang = (typeof LANGS)[number];

const CATEGORY_ORDER = ["principles", "practices", "toolchain", "libraries", "platforms"] as const;

const REPO_URL = "https://github.com/fang2hou/ai-coding-guidelines";
const SOURCE_BRANCH = "main";
const DEFAULT_BASE = "https://fang2hou.github.io/ai-coding-guidelines";

const LANG_NAMES: Record<Lang, string> = { en: "English", zh: "中文", ja: "日本語" };
const OG_LOCALE: Record<Lang, string> = { en: "en_US", zh: "zh_CN", ja: "ja_JP" };

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#0969da'/><text x='32' y='46' font-family='Georgia,serif' font-size='38' font-weight='700' text-anchor='middle' fill='#fff'>§</text></svg>",
  );

const BURGER_SVG =
  '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
const EXTERNAL_SVG =
  '<svg class="icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

interface Ui {
  siteTitle: string;
  description: string;
  indexIntro: string;
  startHere: string;
  startDesc: { core: string; protocol: string };
  categories: Record<string, string>;
  categoryIntro: Record<string, string>;
  home: string;
  menu: string;
  language: string;
  skip: string;
  previous: string;
  next: string;
  viewOnGithub: string;
  footerNote: string;
  draft: string;
  deprecated: string;
}

const UI: Record<Lang, Ui> = {
  en: {
    siteTitle: "AI Coding Guidelines",
    description:
      "Engineering standards for AI coding agents and human reviewers: toolchains, practices, library choices, and platform patterns, in three mirrored languages.",
    indexIntro:
      "One corpus of engineering guidelines — toolchains, practices, library choices, and platform patterns — maintained as three mirrored trees in English, Chinese, and Japanese. Every document carries the same content; pick a language and read.",
    startHere: "Start here",
    startDesc: {
      core: "Why these guidelines exist, and the maxims behind them.",
      protocol: "The 12-step workflow every agent follows before a non-trivial change.",
    },
    categories: {
      principles: "Principles",
      practices: "Practices",
      toolchain: "Toolchain",
      libraries: "Libraries",
      platforms: "Platforms",
    },
    categoryIntro: {
      principles: "Purpose and the core maxims everything else builds on.",
      practices: "How to work: code, tests, docs, dependencies, security.",
      toolchain: "Mandatory tools per ecosystem, identical locally and in CI.",
      libraries: "Chosen stacks for common service and app types.",
      platforms: "Platform-specific design and implementation patterns.",
    },
    home: "All guidelines",
    menu: "Menu",
    language: "Language",
    skip: "Skip to content",
    previous: "Previous",
    next: "Next",
    viewOnGithub: "View on GitHub",
    footerNote: "Built automatically from the main branch.",
    draft: "Draft",
    deprecated: "Deprecated",
  },
  zh: {
    siteTitle: "AI 编码指南",
    description:
      "面向 AI 编码代理与人类评审者的工程准则：工具链、实践方法、库选型与平台规范，三种语言逐篇对应。",
    indexIntro:
      "一套工程指南，三棵语言树逐篇对应：工具链、实践方法、库选型与平台规范。英、中、日三种语言内容一致，各自由目标语言自然写就，选择一种语言即可开始阅读。",
    startHere: "从这里开始",
    startDesc: {
      core: "这些指南为何存在，以及背后的核心准则。",
      protocol: "Agent 在实质性变更前应遵循的 12 步工作流。",
    },
    categories: {
      principles: "原则",
      practices: "实践",
      toolchain: "工具链",
      libraries: "库",
      platforms: "平台",
    },
    categoryIntro: {
      principles: "目的，以及其余内容赖以构建的核心准则。",
      practices: "怎么做事：代码、测试、文档、依赖与安全。",
      toolchain: "各生态的强制工具，本地与 CI 完全一致。",
      libraries: "常见服务与应用类型的既定技术选型。",
      platforms: "特定平台的设计与实现规范。",
    },
    home: "全部指南",
    menu: "菜单",
    language: "语言",
    skip: "跳到正文",
    previous: "上一篇",
    next: "下一篇",
    viewOnGithub: "在 GitHub 上查看",
    footerNote: "由 main 分支自动构建。",
    draft: "草稿",
    deprecated: "已废弃",
  },
  ja: {
    siteTitle: "AI コーディングガイドライン",
    description:
      "AIコーディングエージェントとレビューアーのためのエンジニアリング基準：ツールチェーン、プラクティス、ライブラリ選定、プラットフォームのパターンを三言語で同一内容で提供します。",
    indexIntro:
      "ツールチェーン、プラクティス、ライブラリ選定、プラットフォームのパターンをまとめたエンジニアリングガイドラインです。英語・中国語・日本語の三つのツリーが同じ内容を保ち、それぞれの言語で自然に書かれています。",
    startHere: "まずここから",
    startDesc: {
      core: "このガイドラインが存在する理由と、その根幹になる原則。",
      protocol: "本質的な変更の前にエージェントが守る 12 ステップのワークフロー。",
    },
    categories: {
      principles: "原則",
      practices: "プラクティス",
      toolchain: "ツールチェーン",
      libraries: "ライブラリ",
      platforms: "プラットフォーム",
    },
    categoryIntro: {
      principles: "目的と、他のすべての土台となる核心原則。",
      practices: "作業の進め方：コード、テスト、ドキュメント、依存関係、セキュリティ。",
      toolchain: "エコシステムごとの必須ツール。ローカルと CI で同一。",
      libraries: "よくあるサービス・アプリ種別への技術スタック。",
      platforms: "プラットフォーム固有の設計と実装のパターン。",
    },
    home: "すべてのガイドライン",
    menu: "メニュー",
    language: "言語",
    skip: "本文へスキップ",
    previous: "前へ",
    next: "次へ",
    viewOnGithub: "GitHub で見る",
    footerNote: "main ブランチから自動ビルド。",
    draft: "ドラフト",
    deprecated: "非推奨",
  },
};

interface Doc {
  lang: Lang;
  id: string;
  category: string;
  file: string;
  title: string;
  status: string;
  body: string;
}

// ---------------------------------------------------------------------------
// Corpus loading
// ---------------------------------------------------------------------------

function listMarkdown(dir: string, root: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full, root));
    else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(relative(root, full).replaceAll("\\", "/"));
    }
  }
  return out.sort();
}

function parseFrontMatter(raw: string): { fm: Map<string, string>; body: string } {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const fm = new Map<string, string>();
  let body = raw;
  if (lines[0]?.trimEnd() === "---") {
    let close = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trimEnd() === "---") {
        close = i;
        break;
      }
    }
    if (close !== -1) {
      for (let i = 1; i < close; i++) {
        const m = /^([a-z-]+):\s*(.*)$/.exec(lines[i] ?? "");
        const key = m?.[1];
        const value = m?.[2];
        if (key !== undefined && value !== undefined) fm.set(key, value.trim());
      }
      body = lines.slice(close + 1).join("\n");
    }
  }
  return { fm, body };
}

function firstHeading(body: string): string | null {
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const m = /^#\s+(.+?)\s*$/.exec(line);
    if (m?.[1] !== undefined) return m[1];
  }
  return null;
}

function stripInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[*_~]+/g, "")
    .trim();
}

function firstParagraph(body: string): string {
  const para: string[] = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (line.trim() === "") {
      if (para.length > 0) break;
      continue;
    }
    if (para.length > 0 || !/^(#{1,6}\s|>\s|\||[-*+]\s|\d+[.)]\s)/.test(line))
      para.push(line.trim());
    else break;
  }
  return stripInline(para.join(" ")).replace(/\s+/g, " ");
}

function loadDocs(root: string): Map<Lang, Doc[]> {
  const byLang = new Map<Lang, Doc[]>();
  for (const lang of LANGS) {
    const docs: Doc[] = [];
    for (const rel of listMarkdown(join(root, "guidelines", lang), root)) {
      const raw = readFileSync(join(root, rel), "utf8");
      const { fm, body } = parseFrontMatter(raw);
      const id = rel.slice(`guidelines/${lang}/`.length, -".md".length);
      const heading = firstHeading(body);
      docs.push({
        lang,
        id,
        category: id.includes("/") ? id.slice(0, id.indexOf("/")) : "",
        file: rel,
        title: heading !== null ? stripInline(heading) : id.slice(id.lastIndexOf("/") + 1),
        status: fm.get("status") ?? "active",
        body,
      });
    }
    byLang.set(lang, docs);
  }
  return byLang;
}

function orderDocs(docs: Doc[]): Doc[] {
  const byCategory = new Map<string, Doc[]>();
  for (const doc of docs) {
    const list = byCategory.get(doc.category) ?? [];
    list.push(doc);
    byCategory.set(doc.category, list);
  }
  const ordered: Doc[] = [];
  for (const category of CATEGORY_ORDER) {
    ordered.push(...(byCategory.get(category) ?? []).sort((a, b) => (a.file < b.file ? -1 : 1)));
    byCategory.delete(category);
  }
  for (const category of [...byCategory.keys()].sort()) {
    ordered.push(...(byCategory.get(category) ?? []));
  }
  return ordered;
}

// ---------------------------------------------------------------------------
// Markdown rendering
// ---------------------------------------------------------------------------

type RenderEnv = {
  root: string;
  lang: Lang;
  relPath: string;
  outPath: string;
  docIds: Set<string>;
  warnings: string[];
};

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
  return slug === "" ? "section" : slug;
}

// Relative href between two site outputs, e.g. en/practices/a.html -> en/index.html
function relOut(fromOut: string, toOut: string): string {
  return posix.relative(posix.dirname(fromOut), toOut);
}

function resolveHref(href: string, env: unknown): string | null {
  const e = env as RenderEnv | undefined;
  if (e === undefined) return null;
  if (/^(https?:|mailto:|#)/.test(href) || href.startsWith("/")) return null;
  const hashIdx = href.indexOf("#");
  const target = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const frag = hashIdx === -1 ? "" : href.slice(hashIdx);
  if (target === "") return null;
  const resolved = posix.normalize(posix.join(posix.dirname(e.relPath), target));
  const guidPrefix = `guidelines/${e.lang}/`;
  if (resolved.startsWith(guidPrefix) && resolved.endsWith(".md")) {
    const id = resolved.slice(guidPrefix.length, -".md".length);
    if (e.docIds.has(id)) return relOut(e.outPath, `${e.lang}/${id}.html`) + frag;
  }
  if (existsSync(join(e.root, resolved))) {
    return `${REPO_URL}/blob/${SOURCE_BRANCH}/${resolved}${frag}`;
  }
  e.warnings.push(`unresolved link '${href}' in ${e.relPath}`);
  return null;
}

function createRenderer(): InstanceType<typeof MarkdownIt> {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false, breaks: false });

  md.core.ruler.push("heading_anchors", (state) => {
    const seen = new Map<string, number>();
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token === undefined || token.type !== "heading_open") continue;
      const inline = state.tokens[i + 1];
      if (inline === undefined || inline.type !== "inline") continue;
      let slug = slugify((inline.children ?? []).map((c) => c.content).join(""));
      const n = seen.get(slug) ?? 0;
      seen.set(slug, n + 1);
      if (n > 0) slug = `${slug}-${n}`;
      token.attrSet("id", slug);
      const open = new state.Token("link_open", "a", 1);
      open.attrSet("href", `#${slug}`);
      open.attrSet("class", "anchor");
      open.attrSet("aria-hidden", "true");
      open.attrSet("tabindex", "-1");
      const hash = new state.Token("text", "", 0);
      hash.content = "#";
      const close = new state.Token("link_close", "a", -1);
      inline.children?.push(open, hash, close);
    }
  });

  const defaultLinkOpen =
    md.renderer.rules.link_open ?? ((t, i, o, _e, s) => s.renderToken(t, i, o));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token !== undefined) {
      const href = token.attrGet("href");
      if (typeof href === "string") {
        const next = resolveHref(href, env);
        if (next !== null) token.attrSet("href", next);
      }
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  md.renderer.rules.table_open = (t, i, o, _e, s) =>
    `<div class="table-wrap">` + s.renderToken(t, i, o);
  md.renderer.rules.table_close = (t, i, o, _e, s) => s.renderToken(t, i, o) + `</div>`;

  return md;
}

// ---------------------------------------------------------------------------
// HTML assembly
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function assetPrefix(outPath: string): string {
  const up = posix.relative(posix.dirname(outPath), ".");
  return (up === "" || up === "." ? "." : up) + "/";
}

function langNavLinks(current: Lang, hrefFor: (l: Lang) => string): string {
  return LANGS.map((l) => {
    const attrs = l === current ? ` aria-current="true" class="current"` : "";
    return `<a lang="${l}" href="${hrefFor(l)}"${attrs}>${LANG_NAMES[l]}</a>`;
  }).join("");
}

function badgeHtml(status: string, ui: Ui): string {
  if (status === "draft") return `<span class="badge badge-draft">${escapeHtml(ui.draft)}</span>`;
  if (status === "deprecated") {
    return `<span class="badge badge-deprecated">${escapeHtml(ui.deprecated)}</span>`;
  }
  return "";
}

interface PageNav {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}

function pageNavHtml(nav: PageNav, ui: Ui): string {
  const card = (item: { title: string; href: string } | null, cls: string, label: string): string =>
    item === null
      ? `<span class="page-nav-empty"></span>`
      : `<a class="${cls}" href="${item.href}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(item.title)}</strong></a>`;
  return `<nav class="page-nav" aria-label="${escapeHtml(ui.previous)} / ${escapeHtml(ui.next)}">
${card(nav.prev, "page-nav-prev", ui.previous)}
${card(nav.next, "page-nav-next", ui.next)}
</nav>`;
}

function sidebarHtml(lang: Lang, docs: Doc[], currentOut: string): string {
  const ui = UI[lang];
  const parts: string[] = [`<nav class="side-nav" aria-label="${escapeHtml(ui.home)}">`];
  const homeActive = currentOut === `${lang}/index.html` ? ` aria-current="page"` : "";
  parts.push(
    `<a class="side-home" href="${relOut(currentOut, `${lang}/index.html`)}"${homeActive}>${escapeHtml(ui.home)}</a>`,
  );
  for (const category of CATEGORY_ORDER) {
    const inCat = docs.filter((d) => d.category === category);
    if (inCat.length === 0) continue;
    parts.push(`<div class="side-group">`);
    parts.push(`<h3>${escapeHtml(ui.categories[category] ?? category)}</h3><ul>`);
    for (const doc of inCat) {
      const out = `${lang}/${doc.id}.html`;
      const active = out === currentOut ? ` aria-current="page"` : "";
      parts.push(
        `<li><a href="${relOut(currentOut, out)}"${active}>${escapeHtml(doc.title)}</a></li>`,
      );
    }
    parts.push(`</ul></div>`);
  }
  parts.push(`</nav>`);
  return parts.join("\n");
}

function pageShell(opts: {
  lang: Lang;
  title: string;
  description: string;
  outPath: string;
  base: string;
  sidebar: string;
  langNavHref: (l: Lang) => string;
  content: string;
  sourceUrl: string;
}): string {
  const ui = UI[opts.lang];
  const prefix = assetPrefix(opts.outPath);
  const canonical = `${opts.base}/${opts.outPath}`;
  const homeHref = relOut(opts.outPath, `${opts.lang}/index.html`);
  return `<!doctype html>
<html lang="${opts.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(opts.title)}</title>
<meta name="description" content="${escapeHtml(opts.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(ui.siteTitle)}">
<meta property="og:title" content="${escapeHtml(opts.title)}">
<meta property="og:description" content="${escapeHtml(opts.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${OG_LOCALE[opts.lang]}">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${prefix}style.css">
</head>
<body>
<input type="checkbox" id="nav-toggle" class="nav-toggle">
<a class="skip-link" href="#main">${escapeHtml(ui.skip)}</a>
<header class="site-header">
<label class="nav-toggle-label" for="nav-toggle" aria-label="${escapeHtml(ui.menu)}">${BURGER_SVG}</label>
<a class="site-title" href="${homeHref}">${escapeHtml(ui.siteTitle)}</a>
<div class="header-actions">
<nav class="lang-nav" aria-label="${escapeHtml(ui.language)}">${langNavLinks(opts.lang, opts.langNavHref)}</nav>
<a class="repo-link" href="${REPO_URL}" rel="noopener">GitHub${EXTERNAL_SVG}</a>
</div>
</header>
<label class="nav-overlay" for="nav-toggle" aria-hidden="true"></label>
<div class="layout">
<aside class="sidebar">
${opts.sidebar}
</aside>
<main class="main" id="main">
${opts.content}
</main>
</div>
</body>
</html>
`;
}

function indexBodyHtml(lang: Lang, docs: Doc[], currentOut: string): string {
  const ui = UI[lang];
  const find = (id: string): Doc => {
    const doc = docs.find((d) => d.id === id);
    if (doc === undefined) throw new Error(`missing expected doc '${id}' in ${lang} tree`);
    return doc;
  };
  const core = find("principles/core-principles");
  const protocol = find("practices/agent-protocol");
  const parts: string[] = [];
  parts.push(`<article class="doc">`);
  parts.push(`<p class="intro">${escapeHtml(ui.indexIntro)}</p>`);
  parts.push(`<section class="start-here">`);
  parts.push(`<h2>${escapeHtml(ui.startHere)}</h2>`);
  parts.push(`<div class="cards">`);
  parts.push(
    `<a class="card" href="${relOut(currentOut, `${lang}/${core.id}.html`)}"><strong>${escapeHtml(core.title)}</strong><span>${escapeHtml(ui.startDesc.core)}</span></a>`,
  );
  parts.push(
    `<a class="card" href="${relOut(currentOut, `${lang}/${protocol.id}.html`)}"><strong>${escapeHtml(protocol.title)}</strong><span>${escapeHtml(ui.startDesc.protocol)}</span></a>`,
  );
  parts.push(`</div></section>`);
  for (const category of CATEGORY_ORDER) {
    const inCat = docs.filter((d) => d.category === category);
    if (inCat.length === 0) continue;
    parts.push(`<section class="cat-section">`);
    parts.push(`<h2>${escapeHtml(ui.categories[category] ?? category)}</h2>`);
    parts.push(`<p>${escapeHtml(ui.categoryIntro[category] ?? "")}</p>`);
    parts.push(`<ul class="doc-list">`);
    for (const doc of inCat) {
      const badge = badgeHtml(doc.status, ui);
      parts.push(
        `<li><a href="${relOut(currentOut, `${lang}/${doc.id}.html`)}">${escapeHtml(doc.title)}</a>${badge}</li>`,
      );
    }
    parts.push(`</ul></section>`);
  }
  parts.push(`</article>`);
  return parts.join("\n");
}

function docBodyHtml(doc: Doc, md: InstanceType<typeof MarkdownIt>, env: RenderEnv): string {
  const ui = UI[doc.lang];
  const badge = badgeHtml(doc.status, ui);
  const badgePara = badge === "" ? "" : `<p class="doc-badges">${badge}</p>`;
  return `<article class="doc">
${badgePara}${md.render(doc.body, env)}
</article>`;
}

function footerHtml(sourceUrl: string, ui: Ui): string {
  return `<footer class="site-footer">
<a href="${sourceUrl}">${escapeHtml(ui.viewOnGithub)}</a>
<span>${escapeHtml(ui.footerNote)}</span>
</footer>`;
}

function landingShell(title: string, description: string, body: string, base: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${base}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="style.css">
</head>
<body class="landing">
${body}
</body>
</html>
`;
}

function rootIndexHtml(base: string): string {
  return landingShell(
    "AI Coding Guidelines",
    "Engineering standards for AI coding agents and human reviewers, in English, Chinese, and Japanese.",
    `<main class="picker">
<h1>AI Coding Guidelines</h1>
<p class="picker-sub">Engineering standards for AI coding agents — and the humans who review them.</p>
<div class="lang-cards">
<a class="lang-card" lang="en" href="./en/"><h2>English</h2><p>Trilingual engineering standards for AI coding agents and human reviewers.</p><span class="go">Read in English</span></a>
<a class="lang-card" lang="zh" href="./zh/"><h2>中文</h2><p>面向 AI 编码代理与人类评审者的三语工程准则。</p><span class="go">阅读中文版</span></a>
<a class="lang-card" lang="ja" href="./ja/"><h2>日本語</h2><p>AIコーディングエージェントとレビューアーのための三言語のエンジニアリング基準。</p><span class="go">日本語で読む</span></a>
</div>
<p class="picker-repo"><a href="${REPO_URL}" rel="noopener">GitHub</a></p>
</main>`,
    base,
  );
}

function notFoundHtml(base: string): string {
  return landingShell(
    "Page not found · AI Coding Guidelines",
    "Page not found.",
    `<main class="picker">
<p class="notfound-code">404</p>
<h1>Page not found</h1>
<ul class="notfound-links">
<li lang="en"><a href="${base}/en/">Read the English guidelines</a></li>
<li lang="zh"><a href="${base}/zh/">阅读中文指南</a></li>
<li lang="ja"><a href="${base}/ja/">日本語のガイドラインを読む</a></li>
</ul>
</main>`,
    base,
  );
}

function sitemapXml(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function run(root: string, outDir: string, base: string): number {
  const guidelinesDir = join(root, "guidelines");
  if (!existsSync(guidelinesDir)) {
    process.stdout.write(`ERROR: no guidelines/ directory under ${root}\n`);
    return 1;
  }

  const loaded = loadDocs(root);
  const byLang = new Map<Lang, Doc[]>();
  for (const lang of LANGS) byLang.set(lang, orderDocs(loaded.get(lang) ?? []));

  const warnings: string[] = [];
  const enIds = new Set((byLang.get("en") ?? []).map((d) => d.id));
  for (const lang of LANGS) {
    const ids = new Set((byLang.get(lang) ?? []).map((d) => d.id));
    for (const id of enIds) {
      if (!ids.has(id)) warnings.push(`language tree mismatch: '${id}' missing in ${lang}`);
    }
  }

  const md = createRenderer();
  const urls: string[] = [`${base}/`];
  let pageCount = 0;
  const emit = (rel: string, content: string): void => {
    const full = join(outDir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    pageCount++;
  };

  for (const lang of LANGS) {
    const docs = byLang.get(lang) ?? [];
    const ui = UI[lang];
    const docIds = new Set(docs.map((d) => d.id));
    const indexOut = `${lang}/index.html`;
    urls.push(`${base}/${lang}/`);

    // Reading order: index first, then every doc in category order.
    const seq: Array<{ out: string; title: string }> = [{ out: indexOut, title: ui.home }];
    for (const doc of docs) seq.push({ out: `${lang}/${doc.id}.html`, title: doc.title });

    for (const doc of docs) {
      const out = `${lang}/${doc.id}.html`;
      const env: RenderEnv = {
        root,
        lang,
        relPath: doc.file,
        outPath: out,
        docIds,
        warnings,
      };
      const nav = (k: number): { title: string; href: string } | null => {
        const idx = seq.findIndex((s) => s.out === out);
        const entry = idx === -1 ? undefined : seq[idx + k];
        return entry === undefined ? null : { title: entry.title, href: relOut(out, entry.out) };
      };
      const sidebar = sidebarHtml(lang, docs, out);
      const switchHref = (l: Lang): string => {
        const target = `${l}/${doc.id}.html`;
        const lIds = new Set((byLang.get(l) ?? []).map((d) => d.id));
        return lIds.has(doc.id) ? relOut(out, target) : relOut(out, `${l}/index.html`);
      };
      emit(
        out,
        pageShell({
          lang,
          title: `${doc.title} · ${ui.siteTitle}`,
          description: truncate(firstParagraph(doc.body), 180),
          outPath: out,
          base,
          sidebar,
          langNavHref: switchHref,
          content:
            docBodyHtml(doc, md, env) +
            "\n" +
            pageNavHtml({ prev: nav(-1), next: nav(1) }, ui) +
            "\n" +
            footerHtml(`${REPO_URL}/blob/${SOURCE_BRANCH}/${doc.file}`, ui),
          sourceUrl: `${REPO_URL}/blob/${SOURCE_BRANCH}/${doc.file}`,
        }),
      );
      urls.push(`${base}/${out}`);
    }

    const sidebar = sidebarHtml(lang, docs, indexOut);
    const switchHref = (l: Lang): string => relOut(indexOut, `${l}/index.html`);
    const first = seq[1];
    emit(
      indexOut,
      pageShell({
        lang,
        title: ui.siteTitle,
        description: ui.description,
        outPath: indexOut,
        base,
        sidebar,
        langNavHref: switchHref,
        content:
          indexBodyHtml(lang, docs, indexOut) +
          (first === undefined
            ? ""
            : "\n" +
              pageNavHtml(
                { prev: null, next: { title: first.title, href: relOut(indexOut, first.out) } },
                ui,
              )) +
          "\n" +
          footerHtml(`${REPO_URL}/tree/${SOURCE_BRANCH}/guidelines/${lang}`, ui),
        sourceUrl: `${REPO_URL}/tree/${SOURCE_BRANCH}/guidelines/${lang}`,
      }),
    );
  }

  emit("index.html", rootIndexHtml(base));
  emit("404.html", notFoundHtml(base));
  emit("sitemap.xml", sitemapXml(urls));
  emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
  emit(".nojekyll", "");
  writeFileSync(join(outDir, "style.css"), readFileSync(join(import.meta.dirname, "site.css")));
  pageCount++;

  if (warnings.length > 0) {
    process.stdout.write(warnings.join("\n") + `\n${warnings.length} warning(s)\n`);
  }
  process.stdout.write(`OK: ${pageCount} pages -> ${relative(root, outDir) || outDir}\n`);
  return warnings.length > 0 ? 1 : 0;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

const args = process.argv.slice(2);
const valueOf = (flag: string, fallback: string): string => {
  const idx = args.indexOf(flag);
  const value = idx !== -1 ? args[idx + 1] : undefined;
  return value !== undefined ? value : fallback;
};
const root = resolve(valueOf("--root", process.cwd()));
const outDir = resolve(valueOf("--out", join(root, "dist")));
const base = valueOf("--base", DEFAULT_BASE).replace(/\/+$/, "");
process.exit(run(root, outDir, base));
