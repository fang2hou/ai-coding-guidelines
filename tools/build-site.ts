import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import process from "node:process";
import MarkdownIt from "markdown-it";

// Static site builder: renders guidelines/{en,zh,ja} and GLOSSARY.md into dist/
// as zero-JavaScript HTML with task reading paths, in-page table of contents,
// bidirectional related-guideline links, and per-language typography.

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
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='#0969da'/><text x='32' y='46' font-family='Georgia,serif' font-size='38' font-weight='700' text-anchor='middle' fill='#fff'>§</text></svg>",
  );

const BURGER_SVG =
  '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const EXTERNAL_SVG =
  '<svg class="icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const ARROW_SVG =
  '<svg class="icon arrow-step" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8h9m-3.5-3.5L12.5 8 9 11.5"/></svg>';

const RECIPE_CHAINS = [
  {
    key: "frontend",
    ids: [
      "toolchain/mise",
      "toolchain/typescript",
      "libraries/frontend-framework",
      "practices/coding-standards",
      "toolchain/quality-gates",
    ],
  },
  {
    key: "tsBackend",
    ids: [
      "toolchain/mise",
      "toolchain/typescript",
      "libraries/typescript-backend",
      "practices/coding-standards",
      "toolchain/quality-gates",
    ],
  },
  {
    key: "pythonApi",
    ids: [
      "toolchain/mise",
      "toolchain/python",
      "libraries/python-api-stack",
      "practices/coding-standards",
      "toolchain/quality-gates",
    ],
  },
  {
    key: "uiStyling",
    ids: [
      "practices/corner-radius",
      "practices/coding-standards",
      "practices/language-policy",
      "libraries/tailwindcss",
    ],
  },
  {
    key: "liquidGlass",
    ids: [
      "platforms/liquid-glass-design",
      "platforms/liquid-glass-patterns",
      "platforms/liquid-glass-api",
    ],
  },
  {
    key: "testingCi",
    ids: [
      "practices/testing",
      "toolchain/git",
      "practices/change-discipline",
      "practices/pipeline",
      "toolchain/github-actions",
    ],
  },
] as const;

type RecipeKey = (typeof RECIPE_CHAINS)[number]["key"];

interface Ui {
  siteTitle: string;
  heroEyebrow: string;
  heroTitle: string;
  description: string;
  indexIntro: string;
  startHere: string;
  startSub: string;
  startDesc: { core: string; protocol: string };
  recipesTitle: string;
  recipesSub: string;
  recipeTitles: Record<RecipeKey, string>;
  categoriesTitle: string;
  categories: Record<string, string>;
  categoryIntro: Record<string, string>;
  home: string;
  glossaryTitle: string;
  glossaryNav: string;
  glossaryIntro: string;
  glossaryForbiddenTitle: string;
  glossaryForbiddenIntro: string;
  glossaryCols: {
    en: string;
    zh: string;
    ja: string;
    term: string;
    lang: string;
    forbidden: string;
    preferred: string;
  };
  menu: string;
  language: string;
  skip: string;
  onThisPage: string;
  relatedTitle: string;
  referencesLabel: string;
  referencedByLabel: string;
  previous: string;
  next: string;
  viewOnGithub: string;
  footerNote: string;
  versionPrefix: string;
  active: string;
  draft: string;
  deprecated: string;
  docCountUnit: (n: number) => string;
}

const UI: Record<Lang, Ui> = {
  en: {
    siteTitle: "AI Coding Guidelines",
    heroEyebrow: "Trilingual Engineering Corpus",
    heroTitle: "AI Coding Guidelines",
    description:
      "Engineering standards for AI coding agents and code reviewers — covering toolchains, development practices, library stacks, and platform patterns in English, Chinese, and Japanese.",
    indexIntro:
      "Engineering standards for AI coding agents and the people who review their work — covering toolchains, day-to-day practices, library stacks, and platform patterns. Maintained in English, Chinese, and Japanese with identical structure across all three.",
    startHere: "Start here",
    startSub: "Read these two documents before any task.",
    startDesc: {
      core: "Why these guidelines exist, and the core maxims behind every rule.",
      protocol: "The 12-step operating workflow every agent follows before making a change.",
    },
    recipesTitle: "Reading paths by task",
    recipesSub: "Pick your task and read the linked guidelines in order.",
    recipeTitles: {
      frontend: "TypeScript / frontend project",
      tsBackend: "TypeScript backend service",
      pythonApi: "Python API service",
      uiStyling: "UI styling & components",
      liquidGlass: "iOS 27 / macOS 27 Liquid Glass app",
      testingCi: "Testing, Git & CI/CD",
    },
    categoriesTitle: "Browse by category",
    categories: {
      principles: "Principles",
      practices: "Practices",
      toolchain: "Toolchain",
      libraries: "Libraries",
      platforms: "Platforms",
    },
    categoryIntro: {
      principles:
        "Core maxims behind every rule: fast validation, fewer choices, fixing root causes.",
      practices:
        "Day-to-day engineering: code style, testing, documentation, dependencies, CI, and security.",
      toolchain: "Standard tools per language ecosystem — identical on your machine and in CI.",
      libraries: "Default frameworks and libraries for web frontends, HTTP APIs, and AI features.",
      platforms: "Design and implementation rules for iOS 27 and macOS 27 Liquid Glass.",
    },
    home: "Overview",
    glossaryTitle: "Shared Glossary",
    glossaryNav: "Glossary",
    glossaryIntro:
      "Canonical terminology across English, Chinese, and Japanese. Product names and industry-standard terms stay in English across all three editions.",
    glossaryForbiddenTitle: "Disallowed translations",
    glossaryForbiddenIntro:
      "Checked automatically by the validator so recurring mistranslations cannot return.",
    glossaryCols: {
      en: "English",
      zh: "Chinese (zh)",
      ja: "Japanese (ja)",
      term: "Term",
      lang: "Tree",
      forbidden: "Avoid",
      preferred: "Use instead",
    },
    menu: "Toggle navigation",
    language: "Language",
    skip: "Skip to content",
    onThisPage: "On this page",
    relatedTitle: "Related guidelines",
    referencesLabel: "Referenced in this document",
    referencedByLabel: "Documents that reference this",
    previous: "Previous",
    next: "Next",
    viewOnGithub: "View Markdown source",
    footerNote: "Rebuilt automatically on every merge to main.",
    versionPrefix: "v",
    active: "Active",
    draft: "Draft",
    deprecated: "Deprecated",
    docCountUnit: (n) => `${n} ${n === 1 ? "guide" : "guides"}`,
  },
  zh: {
    siteTitle: "AI 编码指南",
    heroEyebrow: "三语工程规范库",
    heroTitle: "AI 编码指南",
    description:
      "面向 AI Agent 与代码评审者的工程指南：涵盖工具链、工程实践、库与框架选型及平台规范，英、中、日三语同步维护。",
    indexIntro:
      "给 AI Agent 和代码评审者看的工程指南，涵盖工具链、工程实践、技术选型与平台规范。英、中、日三版结构一致，均按各自语言的母语习惯编写。",
    startHere: "必读基础",
    startSub: "开始任何任务前，先读这两篇。",
    startDesc: {
      core: "整套指南为什么存在，以及所有规则背后的五条基本原则。",
      protocol: "AI Agent 在动手修改代码前必须执行的 12 步操作协议。",
    },
    recipesTitle: "按任务选读",
    recipesSub: "根据手头的任务，按顺序阅读对应的指南链。",
    recipeTitles: {
      frontend: "新建 TypeScript / 前端项目",
      tsBackend: "构建 TypeScript 后端服务",
      pythonApi: "开发 Python API 服务",
      uiStyling: "UI 样式与圆角细节",
      liquidGlass: "iOS 27 / macOS 27 Liquid Glass 应用",
      testingCi: "测试、Git 提交与 CI/CD",
    },
    categoriesTitle: "按分类浏览",
    categories: {
      principles: "核心原则",
      practices: "工程实践",
      toolchain: "工具链",
      libraries: "库与框架",
      platforms: "平台规范",
    },
    categoryIntro: {
      principles: "整套指南立身的基本原则：快速校验、收敛选择、解决根本原因。",
      practices: "日常工程实践：编码规范、测试、项目文档、依赖管理、流水线与安全。",
      toolchain: "各语言生态的统一工具链，本地开发与 CI 环境保持完全一致。",
      libraries: "前后端、样式与 AI 应用的默认技术栈与选型边界。",
      platforms: "Apple 平台（iOS / macOS 27 Liquid Glass）的设计与实现规范。",
    },
    home: "总览",
    glossaryTitle: "三语术语表",
    glossaryNav: "术语表",
    glossaryIntro:
      "英、中、日三版统一使用的标准术语。工具与产品名称（如 mise、pnpm、Vite）及行业通用词（如 monorepo、pull request）在三种语言中均保持英文原文。",
    glossaryForbiddenTitle: "禁用译法对照",
    glossaryForbiddenIntro: "以下生硬直译由校验器自动拦截，确保不会混入文档：",
    glossaryCols: {
      en: "英文 (en)",
      zh: "中文 (zh)",
      ja: "日文 (ja)",
      term: "英文原词",
      lang: "语言",
      forbidden: "禁用译法",
      preferred: "规范译法",
    },
    menu: "展开导航菜单",
    language: "语言",
    skip: "跳至正文",
    onThisPage: "本页目录",
    relatedTitle: "关联指南",
    referencesLabel: "本文引用的指南",
    referencedByLabel: "引用本文的指南",
    previous: "上一篇",
    next: "下一篇",
    viewOnGithub: "查看 Markdown 源文件",
    footerNote: "合并至 main 分支时自动构建发布",
    versionPrefix: "v",
    active: "生效中",
    draft: "草稿",
    deprecated: "已废弃",
    docCountUnit: (n) => `${n} 篇`,
  },
  ja: {
    siteTitle: "AI コーディングガイドライン",
    heroEyebrow: "三言語エンジニアリング基準",
    heroTitle: "AI コーディングガイドライン",
    description:
      "AI エージェントとコードレビュアーのためのエンジニアリングガイドライン。ツールチェーン、開発プラクティス、ライブラリ選定、プラットフォーム設計を英・中・日の三言語で提供します。",
    indexIntro:
      "AI エージェントとコードレビュアーのためのエンジニアリングガイドライン。ツールチェーン、日々の開発プラクティス、ライブラリ選定、プラットフォーム設計を扱い、英語・中国語・日本語のすべてで同じ内容を自然な表現で提供しています。",
    startHere: "まず読むべき基本文書",
    startSub: "タスクに着手する前に、まずこの 2 本から読み始めてください。",
    startDesc: {
      core: "ガイドラインの目的と、すべての判断の土台となる基本原則。",
      protocol: "変更を加える前に AI エージェントが踏むべき 12 ステップの行動手順。",
    },
    recipesTitle: "タスク別の読み進め方",
    recipesSub: "目的に合わせて、リンクされたガイドラインを順番に読み進めます。",
    recipeTitles: {
      frontend: "TypeScript / フロントエンド開発",
      tsBackend: "TypeScript バックエンド構築",
      pythonApi: "Python API サービス開発",
      uiStyling: "UI スタイリングと角丸設計",
      liquidGlass: "iOS 27 / macOS 27 Liquid Glass 対応",
      testingCi: "テスト・Git・CI/CD パイプライン",
    },
    categoriesTitle: "カテゴリ別に探す",
    categories: {
      principles: "原則",
      practices: "プラクティス",
      toolchain: "ツールチェーン",
      libraries: "ライブラリ",
      platforms: "プラットフォーム",
    },
    categoryIntro: {
      principles: "判断の土台となる基本原則：速い検証、選択肢の絞り込み、根本原因の解決。",
      practices:
        "日々の開発プラクティス：コーディング規約、テスト、ドキュメント、依存関係、セキュリティ。",
      toolchain: "言語ごとの標準ツールチェーン。ローカルと CI で同じツールを動かす。",
      libraries: "フロントエンド・バックエンド・AI 機能で標準採用するライブラリとフレームワーク。",
      platforms: "Apple プラットフォーム（iOS / macOS 27 Liquid Glass）のデザインと実装パターン。",
    },
    home: "概要",
    glossaryTitle: "三言語用語集",
    glossaryNav: "用語集",
    glossaryIntro:
      "英語・中国語・日本語の三言語で統一している標準用語です。製品名（mise、pnpm、Vite など）や業界標準の用語（monorepo、pull request など）は三言語とも英語のまま表記します。",
    glossaryForbiddenTitle: "使用しない訳語",
    glossaryForbiddenIntro:
      "不自然な直訳が混入しないよう、検証ツールで機械的にブロックしています。",
    glossaryCols: {
      en: "英語 (en)",
      zh: "中国語 (zh)",
      ja: "日本語 (ja)",
      term: "英語",
      lang: "対象言語",
      forbidden: "避ける表現",
      preferred: "標準の表現",
    },
    menu: "ナビゲーションを開閉",
    language: "言語",
    skip: "本文へスキップ",
    onThisPage: "このページの目次",
    relatedTitle: "関連ガイドライン",
    referencesLabel: "この文書が参照しているガイドライン",
    referencedByLabel: "この文書を参照しているガイドライン",
    previous: "前へ",
    next: "次へ",
    viewOnGithub: "Markdown ソースを表示",
    footerNote: "main ブランチへのマージ時に自動ビルド",
    versionPrefix: "v",
    active: "有効",
    draft: "ドラフト",
    deprecated: "非推奨",
    docCountUnit: (n) => `${n} 件`,
  },
};

interface HeadingEntry {
  level: number;
  text: string;
  slug: string;
}

interface Doc {
  lang: Lang;
  id: string;
  category: string;
  file: string;
  title: string;
  summary: string;
  version: string;
  status: string;
  body: string;
  outboundIds: string[];
}

// ---------------------------------------------------------------------------
// Corpus loading & cross-reference graph
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

function extractSummary(body: string): string {
  const para: string[] = [];
  const bullets: string[] = [];
  let fence = false;
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (/^ {0,3}(```|~~~)/.test(rawLine)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (line === "") {
      if (para.length > 0) break;
      continue;
    }
    if (/^#{1,6}\s/.test(line) || line.startsWith("|") || line.startsWith("> ")) {
      if (para.length > 0) break;
      continue;
    }
    const bulletMatch = /^(?:[-*+]|\d+[.)])\s+(.+)$/.exec(line);
    if (bulletMatch?.[1] !== undefined) {
      if (para.length > 0) break;
      if (bullets.length < 2) bullets.push(stripInline(bulletMatch[1]));
      continue;
    }
    para.push(line);
  }
  if (para.length > 0) return stripInline(para.join(" ")).replace(/\s+/g, " ");
  return bullets.join(" ");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function collectOutboundDocIds(body: string, relPath: string, lang: Lang): string[] {
  const seen = new Set<string>();
  const guidPrefix = `guidelines/${lang}/`;
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    for (const match of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      const rawHref = match[1];
      if (
        rawHref === undefined ||
        /^(https?:|mailto:|#)/.test(rawHref) ||
        rawHref.startsWith("/")
      ) {
        continue;
      }
      const hashIdx = rawHref.indexOf("#");
      const target = hashIdx === -1 ? rawHref : rawHref.slice(0, hashIdx);
      if (target === "") continue;
      const resolved = posix.normalize(posix.join(posix.dirname(relPath), target));
      if (resolved.startsWith(guidPrefix) && resolved.endsWith(".md")) {
        seen.add(resolved.slice(guidPrefix.length, -".md".length));
      }
    }
  }
  return [...seen];
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
        summary: truncate(extractSummary(body), 120),
        version: fm.get("version") ?? "1",
        status: fm.get("status") ?? "active",
        body,
        outboundIds: collectOutboundDocIds(body, rel, lang),
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
// Glossary parsing
// ---------------------------------------------------------------------------

interface GlossaryData {
  terms: Array<{ en: string; zh: string; ja: string }>;
  forbidden: Array<{ term: string; lang: string; forbidden: string; preferred: string }>;
}

function loadGlossary(root: string): GlossaryData | null {
  const glossaryPath = join(root, "GLOSSARY.md");
  if (!existsSync(glossaryPath)) return null;
  const raw = readFileSync(glossaryPath, "utf8");
  const terms: Array<{ en: string; zh: string; ja: string }> = [];
  const forbidden: Array<{ term: string; lang: string; forbidden: string; preferred: string }> = [];
  let section: "terms" | "forbidden" = "terms";
  for (const rawLine of raw.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (/^##\s+Forbidden/i.test(line)) {
      section = "forbidden";
      continue;
    }
    if (!line.startsWith("|")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) continue;
    if (section === "terms" && cells.length >= 3) {
      const c0 = cells[0] ?? "";
      const c1 = cells[1] ?? "";
      const c2 = cells[2] ?? "";
      if (c0 === "en" && c1 === "zh") continue;
      terms.push({ en: c0, zh: c1, ja: c2 });
    } else if (section === "forbidden" && cells.length >= 4) {
      const c0 = cells[0] ?? "";
      const c1 = cells[1] ?? "";
      const c2 = cells[2] ?? "";
      const c3 = cells[3] ?? "";
      if (c0.toLowerCase().includes("english")) continue;
      forbidden.push({ term: c0, lang: c1, forbidden: c2, preferred: c3 });
    }
  }
  return { terms, forbidden };
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
  headings: HeadingEntry[];
  warnings: string[];
};

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
  if (resolved === "GLOSSARY.md" && existsSync(join(e.root, "GLOSSARY.md"))) {
    return relOut(e.outPath, `${e.lang}/glossary.html`) + frag;
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
    const env = state.env as RenderEnv | undefined;
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token === undefined || token.type !== "heading_open") continue;
      const inline = state.tokens[i + 1];
      if (inline === undefined || inline.type !== "inline") continue;
      const rawText = (inline.children ?? []).map((c) => c.content).join("");
      let slug = slugify(rawText);
      const n = seen.get(slug) ?? 0;
      seen.set(slug, n + 1);
      if (n > 0) slug = `${slug}-${n}`;
      token.attrSet("id", slug);
      const level = Number.parseInt(token.tag.slice(1), 10);
      if (env !== undefined && (level === 2 || level === 3)) {
        env.headings.push({ level, text: rawText.trim(), slug });
      }
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
  prev: { title: string; category?: string; href: string } | null;
  next: { title: string; category?: string; href: string } | null;
}

function pageNavHtml(nav: PageNav, ui: Ui): string {
  const card = (
    item: { title: string; category?: string; href: string } | null,
    cls: string,
    dirLabel: string,
  ): string => {
    if (item === null) return `<span class="page-nav-empty"></span>`;
    const meta =
      item.category !== undefined && item.category !== ""
        ? `${dirLabel} · ${item.category}`
        : dirLabel;
    return `<a class="${cls}" href="${item.href}"><span>${escapeHtml(meta)}</span><strong>${escapeHtml(item.title)}</strong></a>`;
  };
  return `<nav class="page-nav" aria-label="${escapeHtml(ui.previous)} / ${escapeHtml(ui.next)}">
${card(nav.prev, "page-nav-prev", ui.previous)}
${card(nav.next, "page-nav-next", ui.next)}
</nav>`;
}

function sidebarHtml(lang: Lang, docs: Doc[], currentOut: string, hasGlossary: boolean): string {
  const ui = UI[lang];
  const parts: string[] = [`<nav class="side-nav" aria-label="${escapeHtml(ui.home)}">`];
  const homeActive = currentOut === `${lang}/index.html` ? ` aria-current="page"` : "";
  parts.push(`<div class="side-top">`);
  parts.push(
    `<a class="side-home" href="${relOut(currentOut, `${lang}/index.html`)}"${homeActive}>${escapeHtml(ui.home)}</a>`,
  );
  if (hasGlossary) {
    const glossaryOut = `${lang}/glossary.html`;
    const glossaryActive = currentOut === glossaryOut ? ` aria-current="page"` : "";
    parts.push(
      `<a class="side-home" href="${relOut(currentOut, glossaryOut)}"${glossaryActive}>${escapeHtml(ui.glossaryNav)}</a>`,
    );
  }
  parts.push(`</div>`);
  for (const category of CATEGORY_ORDER) {
    const inCat = docs.filter((d) => d.category === category);
    if (inCat.length === 0) continue;
    parts.push(`<div class="side-group">`);
    parts.push(
      `<h3><span>${escapeHtml(ui.categories[category] ?? category)}</span><span class="side-count">${inCat.length}</span></h3><ul>`,
    );
    for (const doc of inCat) {
      const out = `${lang}/${doc.id}.html`;
      const active = out === currentOut ? ` aria-current="page"` : "";
      const draftDot =
        doc.status === "draft"
          ? `<span class="side-draft" title="${escapeHtml(ui.draft)}">${escapeHtml(ui.draft)}</span>`
          : "";
      parts.push(
        `<li><a href="${relOut(currentOut, out)}"${active}><span class="side-link-text">${escapeHtml(doc.title)}</span>${draftDot}</a></li>`,
      );
    }
    parts.push(`</ul></div>`);
  }
  parts.push(`</nav>`);
  return parts.join("\n");
}

function tocHtml(headings: HeadingEntry[], ui: Ui): string {
  const h2s = headings.filter((h) => h.level === 2);
  if (h2s.length < 2) return "";
  const items = h2s
    .map((h) => `<li><a href="#${h.slug}">${escapeHtml(h.text)}</a></li>`)
    .join("\n");
  return `<aside class="page-toc" aria-label="${escapeHtml(ui.onThisPage)}">
<div class="toc-inner">
<h2>${escapeHtml(ui.onThisPage)}</h2>
<ul>
${items}
</ul>
</div>
</aside>`;
}

function relatedHtml(
  doc: Doc,
  outboundDocs: Doc[],
  inboundDocs: Doc[],
  currentOut: string,
  ui: Ui,
): string {
  if (outboundDocs.length === 0 && inboundDocs.length === 0) return "";
  const renderList = (items: Doc[], heading: string): string => {
    if (items.length === 0) return "";
    const links = items
      .map((target) => {
        const href = relOut(currentOut, `${doc.lang}/${target.id}.html`);
        const catLabel = ui.categories[target.category] ?? target.category;
        return `<li><a class="related-chip" href="${href}"><span class="related-cat">${escapeHtml(catLabel)}</span><strong>${escapeHtml(target.title)}</strong></a></li>`;
      })
      .join("\n");
    return `<div class="related-group">
<h3>${escapeHtml(heading)}</h3>
<ul class="related-list">
${links}
</ul>
</div>`;
  };
  return `<section class="related-section" aria-label="${escapeHtml(ui.relatedTitle)}">
<h2>${escapeHtml(ui.relatedTitle)}</h2>
<div class="related-grid">
${renderList(outboundDocs, ui.referencesLabel)}
${renderList(inboundDocs, ui.referencedByLabel)}
</div>
</section>`;
}

function pageShell(opts: {
  lang: Lang;
  title: string;
  description: string;
  outPath: string;
  base: string;
  sidebar: string;
  toc?: string;
  langNavHref: (l: Lang) => string;
  content: string;
}): string {
  const ui = UI[opts.lang];
  const prefix = assetPrefix(opts.outPath);
  const canonical = `${opts.base}/${opts.outPath}`;
  const homeHref = relOut(opts.outPath, `${opts.lang}/index.html`);
  const hasToc = opts.toc !== undefined && opts.toc !== "";
  const layoutClass = hasToc ? "layout has-toc" : "layout";
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
<a class="site-title" href="${homeHref}"><span class="site-mark" aria-hidden="true">§</span><span>${escapeHtml(ui.siteTitle)}</span></a>
<div class="header-actions">
<nav class="lang-nav" aria-label="${escapeHtml(ui.language)}">${langNavLinks(opts.lang, opts.langNavHref)}</nav>
<a class="repo-link" href="${REPO_URL}" rel="noopener"><span>GitHub</span>${EXTERNAL_SVG}</a>
</div>
</header>
<label class="nav-overlay" for="nav-toggle" aria-hidden="true"></label>
<div class="${layoutClass}">
<aside class="sidebar">
${opts.sidebar}
</aside>
<main class="main" id="main">
${opts.content}
</main>
${opts.toc ?? ""}
</div>
</body>
</html>
`;
}

function indexBodyHtml(lang: Lang, docs: Doc[], currentOut: string): string {
  const ui = UI[lang];
  const byId = new Map(docs.map((d) => [d.id, d]));
  const find = (id: string): Doc => {
    const doc = byId.get(id);
    if (doc === undefined) throw new Error(`missing expected doc '${id}' in ${lang} tree`);
    return doc;
  };
  const core = find("principles/core-principles");
  const protocol = find("practices/agent-protocol");
  const parts: string[] = [];
  parts.push(`<article class="doc index-doc">`);
  parts.push(`<header class="index-hero">`);
  parts.push(
    `<p class="eyebrow">${escapeHtml(ui.heroEyebrow)} · ${escapeHtml(ui.docCountUnit(docs.length))}</p>`,
  );
  parts.push(`<h1>${escapeHtml(ui.heroTitle)}</h1>`);
  parts.push(`<p class="intro">${escapeHtml(ui.indexIntro)}</p>`);
  parts.push(`</header>`);

  parts.push(`<section class="start-here">`);
  parts.push(
    `<div class="section-head"><h2>${escapeHtml(ui.startHere)}</h2><p>${escapeHtml(ui.startSub)}</p></div>`,
  );
  parts.push(`<div class="cards">`);
  parts.push(
    `<a class="card card-featured" href="${relOut(currentOut, `${lang}/${core.id}.html`)}"><span class="card-step">01 · ${escapeHtml(ui.categories[core.category] ?? core.category)}</span><strong>${escapeHtml(core.title)}</strong><span>${escapeHtml(ui.startDesc.core)}</span></a>`,
  );
  parts.push(
    `<a class="card card-featured" href="${relOut(currentOut, `${lang}/${protocol.id}.html`)}"><span class="card-step">02 · ${escapeHtml(ui.categories[protocol.category] ?? protocol.category)}</span><strong>${escapeHtml(protocol.title)}</strong><span>${escapeHtml(ui.startDesc.protocol)}</span></a>`,
  );
  parts.push(`</div></section>`);

  parts.push(`<section class="recipes-section">`);
  parts.push(
    `<div class="section-head"><h2>${escapeHtml(ui.recipesTitle)}</h2><p>${escapeHtml(ui.recipesSub)}</p></div>`,
  );
  parts.push(`<div class="recipe-grid">`);
  for (const recipe of RECIPE_CHAINS) {
    const chain = recipe.ids
      .map((id) => byId.get(id))
      .filter((d): d is Doc => d !== undefined)
      .map(
        (d) =>
          `<a class="recipe-pill" href="${relOut(currentOut, `${lang}/${d.id}.html`)}">${escapeHtml(d.title)}</a>`,
      )
      .join(ARROW_SVG);
    parts.push(
      `<div class="recipe-card"><h3>${escapeHtml(ui.recipeTitles[recipe.key])}</h3><div class="recipe-chain">${chain}</div></div>`,
    );
  }
  parts.push(`</div></section>`);

  parts.push(
    `<div class="section-head categories-head"><h2>${escapeHtml(ui.categoriesTitle)}</h2></div>`,
  );
  for (const category of CATEGORY_ORDER) {
    const inCat = docs.filter((d) => d.category === category);
    if (inCat.length === 0) continue;
    const catId = `cat-${category}`;
    parts.push(`<section class="cat-section" id="${catId}">`);
    parts.push(
      `<div class="cat-header"><h3>${escapeHtml(ui.categories[category] ?? category)}</h3><span class="cat-count">${escapeHtml(ui.docCountUnit(inCat.length))}</span></div>`,
    );
    parts.push(`<p>${escapeHtml(ui.categoryIntro[category] ?? "")}</p>`);
    parts.push(`<ul class="doc-list">`);
    for (const doc of inCat) {
      const badge = badgeHtml(doc.status, ui);
      parts.push(
        `<li><a class="doc-card" href="${relOut(currentOut, `${lang}/${doc.id}.html`)}"><div class="doc-card-head"><strong>${escapeHtml(doc.title)}</strong>${badge}</div><p>${escapeHtml(doc.summary)}</p></a></li>`,
      );
    }
    parts.push(`</ul></section>`);
  }
  parts.push(`</article>`);
  return parts.join("\n");
}

function glossaryBodyHtml(lang: Lang, glossary: GlossaryData): string {
  const ui = UI[lang];
  const cols = ui.glossaryCols;
  const termRows = glossary.terms
    .map(
      (row) =>
        `<tr><td lang="en">${escapeHtml(row.en)}</td><td lang="zh">${escapeHtml(row.zh)}</td><td lang="ja">${escapeHtml(row.ja)}</td></tr>`,
    )
    .join("\n");
  const forbiddenRows = glossary.forbidden
    .map(
      (row) =>
        `<tr><td lang="en">${escapeHtml(row.term)}</td><td><code>${escapeHtml(row.lang)}</code></td><td lang="${escapeHtml(row.lang)}" class="term-forbidden">${escapeHtml(row.forbidden)}</td><td lang="${escapeHtml(row.lang)}" class="term-preferred">${escapeHtml(row.preferred)}</td></tr>`,
    )
    .join("\n");
  return `<article class="doc">
<div class="doc-meta"><a class="meta-cat" href="index.html">${escapeHtml(ui.home)}</a><span class="meta-sep" aria-hidden="true">/</span><span>${escapeHtml(ui.glossaryNav)}</span></div>
<h1>${escapeHtml(ui.glossaryTitle)}</h1>
<p class="intro">${escapeHtml(ui.glossaryIntro)}</p>
<div class="table-wrap">
<table>
<thead><tr><th>${escapeHtml(cols.en)}</th><th>${escapeHtml(cols.zh)}</th><th>${escapeHtml(cols.ja)}</th></tr></thead>
<tbody>
${termRows}
</tbody>
</table>
</div>
<h2>${escapeHtml(ui.glossaryForbiddenTitle)}</h2>
<p>${escapeHtml(ui.glossaryForbiddenIntro)}</p>
<div class="table-wrap">
<table>
<thead><tr><th>${escapeHtml(cols.term)}</th><th>${escapeHtml(cols.lang)}</th><th>${escapeHtml(cols.forbidden)}</th><th>${escapeHtml(cols.preferred)}</th></tr></thead>
<tbody>
${forbiddenRows}
</tbody>
</table>
</div>
</article>`;
}

function docBodyHtml(
  doc: Doc,
  md: InstanceType<typeof MarkdownIt>,
  env: RenderEnv,
  currentOut: string,
): string {
  const ui = UI[doc.lang];
  const catLabel = ui.categories[doc.category] ?? doc.category;
  const badge = badgeHtml(doc.status, ui);
  const homeHref = relOut(currentOut, `${doc.lang}/index.html`);
  return `<article class="doc">
<div class="doc-meta">
<a class="meta-cat" href="${homeHref}#cat-${doc.category}">${escapeHtml(catLabel)}</a>
<span class="meta-sep" aria-hidden="true">/</span>
<span class="meta-version">${escapeHtml(ui.versionPrefix)}${escapeHtml(doc.version)}</span>
${badge}
</div>
${md.render(doc.body, env)}
</article>`;
}

function footerHtml(sourceUrl: string, ui: Ui): string {
  return `<footer class="site-footer">
<a href="${sourceUrl}" rel="noopener">${escapeHtml(ui.viewOnGithub)}${EXTERNAL_SVG}</a>
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

function rootIndexHtml(base: string, docCount: number): string {
  return landingShell(
    "AI Coding Guidelines",
    "Engineering standards for AI coding agents and code reviewers, in English, Chinese, and Japanese.",
    `<main class="picker">
<div class="picker-head">
<span class="site-mark picker-mark" aria-hidden="true">§</span>
<h1>AI Coding Guidelines</h1>
<p class="picker-sub">Engineering standards for AI coding agents and the people who review their work — ${docCount} guidelines in English, Chinese, and Japanese.</p>
</div>
<div class="lang-cards">
<a class="lang-card" lang="en" href="./en/">
<span class="lang-tag">EN · ${docCount} guides</span>
<h2>English</h2>
<p>Toolchains, engineering practices, library stacks, and platform patterns for AI-assisted development.</p>
<span class="go">Read in English ${ARROW_SVG}</span>
</a>
<a class="lang-card" lang="zh" href="./zh/">
<span class="lang-tag">ZH · ${docCount} 篇指南</span>
<h2>简体中文</h2>
<p>面向 AI Agent 与代码评审者的工程指南：工具链、工程实践、技术选型与平台规范。</p>
<span class="go">阅读中文版 ${ARROW_SVG}</span>
</a>
<a class="lang-card" lang="ja" href="./ja/">
<span class="lang-tag">JA · ${docCount} 件のガイド</span>
<h2>日本語</h2>
<p>AI エージェントとコードレビュアーのためのエンジニアリング基準：ツールチェーン・開発実践・技術選定。</p>
<span class="go">日本語で読む ${ARROW_SVG}</span>
</a>
</div>
<p class="picker-repo"><a href="${REPO_URL}" rel="noopener"><span>GitHub Repository</span>${EXTERNAL_SVG}</a></p>
</main>`,
    base,
  );
}

function notFoundHtml(base: string): string {
  return landingShell(
    "404 · AI Coding Guidelines",
    "Page not found.",
    `<main class="picker">
<p class="notfound-code">404</p>
<h1>Page not found · 页面不存在 · ページが見つかりません</h1>
<ul class="notfound-links">
<li lang="en"><a href="${base}/en/">English Overview</a></li>
<li lang="zh"><a href="${base}/zh/">中文总览</a></li>
<li lang="ja"><a href="${base}/ja/">日本語概要</a></li>
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
  const glossary = loadGlossary(root);

  const warnings: string[] = [];
  const enDocs = byLang.get("en") ?? [];
  const enIds = new Set(enDocs.map((d) => d.id));
  for (const lang of LANGS) {
    const ids = new Set((byLang.get(lang) ?? []).map((d) => d.id));
    for (const id of enIds) {
      if (!ids.has(id)) warnings.push(`language tree mismatch: '${id}' missing in ${lang}`);
    }
  }
  if (existsSync(join(root, "PORTAL.md"))) {
    for (const recipe of RECIPE_CHAINS) {
      for (const id of recipe.ids) {
        if (!enIds.has(id)) warnings.push(`unknown recipe doc id '${id}' in '${recipe.key}'`);
      }
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
    const docById = new Map(docs.map((d) => [d.id, d]));
    const docIds = new Set(docs.map((d) => d.id));
    const indexOut = `${lang}/index.html`;
    urls.push(`${base}/${lang}/`);

    // Build reverse-reference map (inbound links) across the current language tree.
    const inboundById = new Map<string, Doc[]>();
    for (const src of docs) {
      for (const targetId of src.outboundIds) {
        if (targetId === src.id) continue;
        const list = inboundById.get(targetId) ?? [];
        list.push(src);
        inboundById.set(targetId, list);
      }
    }

    // Reading order: index first, then every doc in category order.
    const seq: Array<{ out: string; title: string; category?: string }> = [
      { out: indexOut, title: ui.home },
    ];
    for (const doc of docs) {
      seq.push({
        out: `${lang}/${doc.id}.html`,
        title: doc.title,
        category: ui.categories[doc.category] ?? doc.category,
      });
    }

    for (const doc of docs) {
      const out = `${lang}/${doc.id}.html`;
      const env: RenderEnv = {
        root,
        lang,
        relPath: doc.file,
        outPath: out,
        docIds,
        headings: [],
        warnings,
      };
      const nav = (k: number): { title: string; category?: string; href: string } | null => {
        const idx = seq.findIndex((s) => s.out === out);
        const entry = idx === -1 ? undefined : seq[idx + k];
        return entry === undefined
          ? null
          : { title: entry.title, category: entry.category, href: relOut(out, entry.out) };
      };
      const sidebar = sidebarHtml(lang, docs, out, glossary !== null);
      const switchHref = (l: Lang): string => {
        const target = `${l}/${doc.id}.html`;
        const lIds = new Set((byLang.get(l) ?? []).map((d) => d.id));
        return lIds.has(doc.id) ? relOut(out, target) : relOut(out, `${l}/index.html`);
      };
      const outboundDocs = doc.outboundIds
        .filter((id) => id !== doc.id)
        .map((id) => docById.get(id))
        .filter((d): d is Doc => d !== undefined);
      const inboundDocs = inboundById.get(doc.id) ?? [];
      const renderedDoc = docBodyHtml(doc, md, env, out);
      const toc = tocHtml(env.headings, ui);
      const related = relatedHtml(doc, outboundDocs, inboundDocs, out, ui);
      emit(
        out,
        pageShell({
          lang,
          title: `${doc.title} · ${ui.siteTitle}`,
          description: doc.summary || ui.description,
          outPath: out,
          base,
          sidebar,
          toc,
          langNavHref: switchHref,
          content:
            renderedDoc +
            (related === "" ? "" : "\n" + related) +
            "\n" +
            pageNavHtml({ prev: nav(-1), next: nav(1) }, ui) +
            "\n" +
            footerHtml(`${REPO_URL}/blob/${SOURCE_BRANCH}/${doc.file}`, ui),
        }),
      );
      urls.push(`${base}/${out}`);
    }

    if (glossary !== null) {
      const glossaryOut = `${lang}/glossary.html`;
      emit(
        glossaryOut,
        pageShell({
          lang,
          title: `${ui.glossaryTitle} · ${ui.siteTitle}`,
          description: ui.glossaryIntro,
          outPath: glossaryOut,
          base,
          sidebar: sidebarHtml(lang, docs, glossaryOut, true),
          langNavHref: (l: Lang) => relOut(glossaryOut, `${l}/glossary.html`),
          content:
            glossaryBodyHtml(lang, glossary) +
            "\n" +
            footerHtml(`${REPO_URL}/blob/${SOURCE_BRANCH}/GLOSSARY.md`, ui),
        }),
      );
      urls.push(`${base}/${glossaryOut}`);
    }

    const sidebar = sidebarHtml(lang, docs, indexOut, glossary !== null);
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
                {
                  prev: null,
                  next: {
                    title: first.title,
                    category: first.category,
                    href: relOut(indexOut, first.out),
                  },
                },
                ui,
              )) +
          "\n" +
          footerHtml(`${REPO_URL}/tree/${SOURCE_BRANCH}/guidelines/${lang}`, ui),
      }),
    );
  }

  emit("index.html", rootIndexHtml(base, enDocs.length));
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
