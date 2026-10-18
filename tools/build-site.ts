import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import process from "node:process";
import hljs from "highlight.js/lib/common";
import MarkdownIt from "markdown-it";
import { transform } from "lightningcss";

// Static site builder: renders guidelines/{en,zh,ja} and GLOSSARY.md into dist/
// as largely static HTML with task reading paths, in-page table of contents,
// bidirectional related-guideline links, per-language typography, and a small
// progressive-enhancement script for theme switching, scroll affordances, and
// same-origin partial navigation.

const LANGS = ["en", "zh", "ja"] as const;
type Lang = (typeof LANGS)[number];

const CATEGORY_ORDER = ["principles", "practices", "toolchain", "libraries", "platforms"] as const;

const REPO_URL = "https://github.com/fang2hou/ai-coding-guidelines";
const SOURCE_BRANCH = "main";
const DEFAULT_BASE = "https://fang2hou.github.io/ai-coding-guidelines";

let assetVersion = "";

const INSTALL_COMMAND = "pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines";

const LANG_NAMES: Record<Lang, string> = { en: "English", zh: "中文", ja: "日本語" };
const OG_LOCALE: Record<Lang, string> = { en: "en_US", zh: "zh_CN", ja: "ja_JP" };

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path fill-rule='evenodd' fill='#3a8b8f' d='M14 7h36v50L32 44 14 57V7Zm10 13h16v4H24v-4Zm0 10h10v4H24v-4Z'/></svg>",
  );

const LOGO_SVG =
  '<svg class="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="M7 3.5h18v25l-9-6.5-9 6.5v-25Zm5 6.5h8v2h-8v-2Zm0 5h5v2h-5v-2Z"/></svg>';

// Lucide SVG geometry; license retained in tools/lucide-LICENSE and site output.
const ICON_PATHS = {
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />   <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />',
  terminal: '<path d="M12 19h8" />   <path d="m4 17 6-6-6-6" />',
  "chevron-down": '<path d="m6 9 6 6 6-6" />',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />   <path d="M9 18c-4.51 2-5-2-7-2" />',
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2" />   <line x1="8" x2="16" y1="21" y2="21" />   <line x1="12" x2="12" y1="17" y2="21" />',
  sun: '<circle cx="12" cy="12" r="4" />   <path d="M12 2v2" />   <path d="M12 20v2" />   <path d="m4.93 4.93 1.41 1.41" />   <path d="m17.66 17.66 1.41 1.41" />   <path d="M2 12h2" />   <path d="M20 12h2" />   <path d="m6.34 17.66-1.41 1.41" />   <path d="m19.07 4.93-1.41 1.41" />',
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
  menu: '<path d="M4 5h16" />   <path d="M4 12h16" />   <path d="M4 19h16" />',
  x: '<path d="M18 6 6 18" />   <path d="m6 6 12 12" />',
  "arrow-up-right": '<path d="M7 7h10v10" />   <path d="M7 17 17 7" />',
  "arrow-right": '<path d="M5 12h14" />   <path d="m12 5 7 7-7 7" />',
  house:
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />   <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />',
  "book-open":
    '<path d="M12 5v16" />   <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />',
  list: '<path d="M3 5h.01" />   <path d="M3 12h.01" />   <path d="M3 19h.01" />   <path d="M8 5h13" />   <path d="M8 12h13" />   <path d="M8 19h13" />',
  compass:
    '<circle cx="12" cy="12" r="10" />   <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />',
  "sliders-horizontal":
    '<path d="M10 5H3" />   <path d="M12 19H3" />   <path d="M14 3v4" />   <path d="M16 17v4" />   <path d="M21 12h-9" />   <path d="M21 19h-5" />   <path d="M21 5h-7" />   <path d="M8 10v4" />   <path d="M8 12H3" />',
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />',
  blocks:
    '<path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />   <rect x="14" y="2" width="8" height="8" rx="1" />',
  "panels-top-left":
    '<rect width="18" height="18" x="3" y="3" rx="2" />   <path d="M3 9h18" />   <path d="M9 21V9" />',
} as const;
function icon(name: keyof typeof ICON_PATHS, className = "icon", size = 16): string {
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}
const THEME_ICONS = {
  auto: icon("monitor", "theme-icon theme-icon-auto"),
  light: icon("sun", "theme-icon theme-icon-light"),
  dark: icon("moon", "theme-icon theme-icon-dark"),
};
const BURGER_SVG = icon("menu", "icon", 20);
const CLOSE_SVG = icon("x", "icon", 18);
const EXTERNAL_SVG = icon("arrow-up-right", "icon", 12);
const ARROW_SVG = icon("arrow-right", "icon arrow-step", 12);

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
  usage: {
    title: string;
    install: string;
    installDescription: string;
    prompt: string;
    promptDescription: string;
    promptText: string;
    copy: string;
    copied: string;
    copyError: string;
  };
  startHere: string;
  startSub: string;
  startDesc: { core: string; protocol: string };
  recipesTitle: string;
  recipesSub: string;
  recipeTitles: Record<RecipeKey, string>;
  categoriesTitle: string;
  catalogSub: string;
  categories: Record<string, string>;
  categoryIntro: Record<string, string>;
  home: string;
  navLabel: string;
  repoLabel: string;
  close: string;
  theme: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
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
  draft: string;
  deprecated: string;
  docCountUnit: (n: number) => string;
}

const UI: Record<Lang, Ui> = {
  en: {
    siteTitle: "AI Coding Guidelines",
    heroEyebrow: "Engineering reference",
    heroTitle: "AI Coding Guidelines",
    description:
      "Engineering standards for AI coding agents and code reviewers — covering toolchains, development practices, library stacks, and platform patterns.",
    indexIntro:
      "Engineering standards for AI coding agents and the people who review their work — covering toolchains, day-to-day practices, library stacks, and platform patterns, organized for fast task-based reading.",
    usage: {
      title: "Use in your project",
      install: "Install the skill",
      installDescription:
        "Run this in your project directory, then ask your agent to apply these guidelines to your task.",
      prompt: "Give your agent these instructions",
      promptDescription:
        "You can also paste these instructions into your AI coding agent without installing the skill.",
      promptText:
        "Apply the guidelines from https://github.com/fang2hou/ai-coding-guidelines for this task.\nStart at PORTAL.md and follow its reading recipes.",
      copy: "Copy",
      copied: "Copied",
      copyError: "Select and copy the text",
    },
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
    catalogSub: "Every guideline, grouped by the part of the stack it governs.",
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
    navLabel: "Guideline index",
    repoLabel: "GitHub repository",
    close: "Close menu",
    theme: "Theme",
    themeAuto: "Follow system",
    themeLight: "Light",
    themeDark: "Dark",
    glossaryTitle: "Shared Glossary",
    glossaryNav: "Glossary",
    glossaryIntro:
      "Canonical terminology used consistently in every edition. Product names and industry-standard terms stay in English.",
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
    draft: "Draft",
    deprecated: "Deprecated",
    docCountUnit: (n) => `${n} ${n === 1 ? "guide" : "guides"}`,
  },
  zh: {
    siteTitle: "AI 编码指南",
    heroEyebrow: "工程参考",
    heroTitle: "AI 编码指南",
    description:
      "面向 AI Agent 与代码评审者的工程指南：涵盖工具链、工程实践、库与框架选型及平台规范。",
    indexIntro:
      "给 AI Agent 和代码评审者看的工程指南，涵盖工具链、工程实践、技术选型与平台规范，并按任务场景组织阅读顺序。",
    usage: {
      title: "在项目中使用",
      install: "安装 skill",
      installDescription: "在项目目录运行这条命令，然后明确要求 Agent 按本指南执行当前任务。",
      prompt: "直接交给 AI Agent",
      promptDescription: "也可以不安装 skill，直接把下面的提示词发给 AI Agent。",
      promptText:
        "请按 https://github.com/fang2hou/ai-coding-guidelines 中的指南执行当前任务。\n从 PORTAL.md 开始，按任务对应的阅读顺序查阅并应用相关规范。",
      copy: "复制",
      copied: "已复制",
      copyError: "请选中文字并复制",
    },
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
    catalogSub: "全部指南按所属技术层分组，便于逐类浏览。",
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
    navLabel: "指南目录",
    repoLabel: "GitHub 仓库",
    close: "关闭菜单",
    theme: "主题",
    themeAuto: "跟随系统",
    themeLight: "浅色",
    themeDark: "深色",
    glossaryTitle: "术语表",
    glossaryNav: "术语表",
    glossaryIntro:
      "各语言版本统一使用的标准术语。工具与产品名称（如 mise、pnpm、Vite）及行业通用词（如 monorepo、pull request）保持英文原文。",
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
    draft: "草稿",
    deprecated: "已废弃",
    docCountUnit: (n) => `${n} 篇`,
  },
  ja: {
    siteTitle: "AI コーディングガイドライン",
    heroEyebrow: "エンジニアリングリファレンス",
    heroTitle: "AI コーディングガイドライン",
    description:
      "AI エージェントとコードレビュアーのためのエンジニアリングガイドライン。ツールチェーン、開発プラクティス、ライブラリ選定、プラットフォーム設計を扱います。",
    indexIntro:
      "AI エージェントとコードレビュアーのためのエンジニアリングガイドライン。ツールチェーン、日々の開発プラクティス、ライブラリ選定、プラットフォーム設計をタスク別に整理しています。",
    usage: {
      title: "プロジェクトで使う",
      install: "スキルをインストール",
      installDescription:
        "プロジェクトのディレクトリで実行し、現在のタスクにこのガイドラインを適用するようエージェントに指示してください。",
      prompt: "AI エージェントに直接指示する",
      promptDescription:
        "スキルをインストールせずに、次の指示を AI エージェントに送ることもできます。",
      promptText:
        "https://github.com/fang2hou/ai-coding-guidelines のガイドラインを現在のタスクに適用してください。\nPORTAL.md から始め、タスクに対応する文書を順番に読み、関連する規約に従ってください。",
      copy: "コピー",
      copied: "コピーしました",
      copyError: "テキストを選択してコピーしてください",
    },
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
    catalogSub: "すべてのガイドラインを領域ごとに整理しています。",
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
    navLabel: "ガイドライン一覧",
    repoLabel: "GitHub リポジトリ",
    close: "メニューを閉じる",
    theme: "テーマ",
    themeAuto: "システムに合わせる",
    themeLight: "ライト",
    themeDark: "ダーク",
    glossaryTitle: "用語集",
    glossaryNav: "用語集",
    glossaryIntro:
      "各言語版で統一している標準用語です。製品名（mise、pnpm、Vite など）や業界標準の用語（monorepo、pull request など）は英語のまま表記します。",
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
  const md = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
    breaks: false,
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        } catch {
          return "";
        }
      }
      return "";
    },
  });

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

  const defaultFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const rendered =
      defaultFence !== undefined
        ? defaultFence(tokens, idx, options, env, self)
        : self.renderToken(tokens, idx, options);
    const info = tokens[idx]?.info.trim().split(/\s+/)[0] ?? "";
    if (info === "") return rendered;
    return `<div class="code-block" data-lang="${escapeHtml(info)}">${rendered}</div>`;
  };

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
    return `<a lang="${l}" hreflang="${l}" href="${hrefFor(l)}"${attrs}>${LANG_NAMES[l]}</a>`;
  }).join("");
}

function themeToggleHtml(ui: Ui): string {
  const label = `${ui.theme}: ${ui.themeAuto}`;
  return `<button class="theme-toggle" type="button" data-mode="auto" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" data-label-theme="${escapeHtml(ui.theme)}" data-label-auto="${escapeHtml(ui.themeAuto)}" data-label-light="${escapeHtml(ui.themeLight)}" data-label-dark="${escapeHtml(ui.themeDark)}">${THEME_ICONS.auto}${THEME_ICONS.light}${THEME_ICONS.dark}</button>`;
}

const PAGE_SCROLL =
  '<div class="page-scroll" aria-hidden="true" hidden><div class="page-scroll-thumb"></div></div>';

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
  const parts: string[] = [`<nav class="side-nav" aria-label="${escapeHtml(ui.navLabel)}">`];
  const homeActive = currentOut === `${lang}/index.html` ? ` aria-current="page"` : "";
  parts.push(`<div class="side-top">`);
  parts.push(
    `<label class="side-close" for="nav-toggle" title="${escapeHtml(ui.close)}" aria-hidden="true">${CLOSE_SVG}</label>`,
  );
  parts.push(
    `<a class="side-home" href="${relOut(currentOut, `${lang}/index.html`)}"${homeActive}>${icon("house")}<span class="side-label">${escapeHtml(ui.home)}</span></a>`,
  );
  parts.push(
    `<a class="side-home" href="${relOut(currentOut, `${lang}/index.html`)}#usage-heading">${icon("terminal")}<span class="side-label">${escapeHtml(ui.usage.title)}</span></a>`,
  );
  if (hasGlossary) {
    const glossaryOut = `${lang}/glossary.html`;
    const glossaryActive = currentOut === glossaryOut ? ` aria-current="page"` : "";
    parts.push(
      `<a class="side-home" href="${relOut(currentOut, glossaryOut)}"${glossaryActive}>${icon("book-open")}<span class="side-label">${escapeHtml(ui.glossaryNav)}</span></a>`,
    );
  }
  parts.push(`</div>`);
  for (const category of CATEGORY_ORDER) {
    const inCat = docs.filter((d) => d.category === category);
    if (inCat.length === 0) continue;
    parts.push(`<div class="side-group">`);
    const categoryIcon = {
      principles: "compass",
      practices: "sliders-horizontal",
      toolchain: "wrench",
      libraries: "blocks",
      platforms: "panels-top-left",
    } as const;
    parts.push(
      `<h3>${icon(categoryIcon[category])}<span class="side-label">${escapeHtml(ui.categories[category] ?? category)}</span></h3><ul>`,
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
    .map((h) => `<li><a class="toc-link" href="#${h.slug}">${escapeHtml(h.text)}</a></li>`)
    .join("\n");
  return `<aside class="page-toc" aria-label="${escapeHtml(ui.onThisPage)}">
<div class="toc-inner">
<h2>${icon("list", "icon", 14)}${escapeHtml(ui.onThisPage)}</h2>
<ul>
${items}
</ul>
</div>
</aside>`;
}

function inlineTocHtml(headings: HeadingEntry[], ui: Ui): string {
  const h2s = headings.filter((h) => h.level === 2);
  if (h2s.length < 2) return "";
  const items = h2s
    .map((h) => `<li><a class="toc-link" href="#${h.slug}">${escapeHtml(h.text)}</a></li>`)
    .join("\n");
  return `<details class="page-toc-inline">
<summary>${icon("list", "icon", 14)}<span>${escapeHtml(ui.onThisPage)}</span>${icon("chevron-down", "icon toc-chevron", 14)}</summary>
<ul>
${items}
</ul>
</details>`;
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
        return `<li><a class="related-link" href="${href}"><span class="related-cat">${escapeHtml(catLabel)}</span><span class="related-title">${escapeHtml(target.title)}</span></a></li>`;
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
  const alternateHref = (l: Lang): string =>
    new URL(opts.langNavHref(l), `${opts.base}/${opts.outPath}`).href;
  const alternateLinks = [
    ...LANGS.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${escapeHtml(alternateHref(l))}">`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateHref("en"))}">`,
  ].join("\n");
  const alternateLocales = LANGS.filter((l) => l !== opts.lang)
    .map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`)
    .join("\n");
  return `<!doctype html>
<html lang="${opts.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fbf1c7">
<title>${escapeHtml(opts.title)}</title>
<meta name="description" content="${escapeHtml(opts.description)}">
<link rel="canonical" href="${canonical}">
${alternateLinks}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(ui.siteTitle)}">
<meta property="og:title" content="${escapeHtml(opts.title)}">
<meta property="og:description" content="${escapeHtml(opts.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${OG_LOCALE[opts.lang]}">
${alternateLocales}
<link rel="icon" href="${FAVICON}">
<script src="${prefix}site.js?v=${assetVersion}"></script>
<link rel="stylesheet" href="${prefix}style.css?v=${assetVersion}">
</head>
<body>
${PAGE_SCROLL}
<input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="${escapeHtml(ui.menu)}">
<a class="skip-link" href="#main">${escapeHtml(ui.skip)}</a>
<header class="site-header">
<label class="nav-toggle-label" for="nav-toggle" aria-label="${escapeHtml(ui.menu)}">${BURGER_SVG}</label>
<a class="site-title" href="${homeHref}" aria-label="${escapeHtml(ui.siteTitle)}">${LOGO_SVG}<span class="site-title-text">${escapeHtml(ui.siteTitle)}</span></a>
<div class="header-actions">
<nav class="lang-nav" aria-label="${escapeHtml(ui.language)}">${langNavLinks(opts.lang, opts.langNavHref)}</nav>
${themeToggleHtml(ui)}
<a class="repo-link" href="${REPO_URL}" rel="noopener" aria-label="${escapeHtml(ui.repoLabel)}" title="${escapeHtml(ui.repoLabel)}">${icon("github", "icon", 18)}</a>
</div>
</header>
<label class="nav-overlay" for="nav-toggle" aria-hidden="true"></label>
<div class="${layoutClass}">
<div class="sidebar-shell">
<aside class="sidebar">
${opts.sidebar}
</aside>
<div class="sidebar-fade sidebar-fade-top" aria-hidden="true"></div>
<div class="sidebar-fade sidebar-fade-bottom" aria-hidden="true"></div>
</div>
<main class="main" id="main">
${opts.content}
</main>
${opts.toc ?? ""}
</div>
</body>
</html>
`;
}

function usageHtml(ui: Ui): string {
  const example = (label: string, description: string, text: string): string =>
    `<div class="usage-example"><div class="usage-toolbar"><h3>${escapeHtml(label)}</h3><button class="copy-button" type="button" aria-label="${escapeHtml(`${ui.usage.copy}: ${label}`)}" data-copy-label="${escapeHtml(ui.usage.copy)}" data-copied-label="${escapeHtml(ui.usage.copied)}" data-error-label="${escapeHtml(ui.usage.copyError)}">${icon("copy", "icon", 14)}<span role="status">${escapeHtml(ui.usage.copy)}</span></button></div><p>${escapeHtml(description)}</p><pre><code>${escapeHtml(text)}</code></pre></div>`;
  return `<section class="usage-section" aria-labelledby="usage-heading"><div class="section-head"><h2 id="usage-heading">${escapeHtml(ui.usage.title)}</h2></div>${example(ui.usage.install, ui.usage.installDescription, INSTALL_COMMAND)}${example(ui.usage.prompt, ui.usage.promptDescription, ui.usage.promptText)}</section>`;
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
    `<p class="kicker">${escapeHtml(ui.heroEyebrow)} · ${escapeHtml(ui.docCountUnit(docs.length))}</p>`,
  );
  parts.push(`<h1>${escapeHtml(ui.heroTitle)}</h1>`);
  parts.push(`<p class="intro">${escapeHtml(ui.indexIntro)}</p>`);
  parts.push(`</header>`);

  parts.push(usageHtml(ui));

  parts.push(`<section class="start-section" aria-labelledby="start-heading">`);
  parts.push(
    `<div class="section-head"><h2 id="start-heading">${escapeHtml(ui.startHere)}</h2><p>${escapeHtml(ui.startSub)}</p></div>`,
  );
  parts.push(`<ul class="start-list">`);
  const startItems = [
    { doc: core, desc: ui.startDesc.core },
    { doc: protocol, desc: ui.startDesc.protocol },
  ];
  for (const item of startItems) {
    parts.push(
      `<li><a class="start-item" href="${relOut(currentOut, `${lang}/${item.doc.id}.html`)}"><span class="start-copy"><strong>${escapeHtml(item.doc.title)}</strong><span>${escapeHtml(item.desc)}</span></span><span class="start-arrow" aria-hidden="true">${ARROW_SVG}</span></a></li>`,
    );
  }
  parts.push(`</ul></section>`);

  parts.push(`<section class="paths-section" aria-labelledby="paths-heading">`);
  parts.push(
    `<div class="section-head"><h2 id="paths-heading">${escapeHtml(ui.recipesTitle)}</h2><p>${escapeHtml(ui.recipesSub)}</p></div>`,
  );
  parts.push(`<div class="path-list">`);
  for (const recipe of RECIPE_CHAINS) {
    const chain = recipe.ids
      .map((id) => byId.get(id))
      .filter((d): d is Doc => d !== undefined)
      .map(
        (d) =>
          `<li><a class="path-link" href="${relOut(currentOut, `${lang}/${d.id}.html`)}">${escapeHtml(d.title)}</a></li>`,
      )
      .join("\n");
    parts.push(
      `<div class="path-row"><h3>${escapeHtml(ui.recipeTitles[recipe.key])}</h3><ol class="path-steps">${chain}</ol></div>`,
    );
  }
  parts.push(`</div></section>`);

  parts.push(`<section class="catalog-section" aria-labelledby="catalog-heading">`);
  parts.push(
    `<div class="section-head"><h2 id="catalog-heading">${escapeHtml(ui.categoriesTitle)}</h2><p>${escapeHtml(ui.catalogSub)}</p></div>`,
  );
  parts.push(`<div class="catalog">`);
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
        `<li><a class="doc-row" href="${relOut(currentOut, `${lang}/${doc.id}.html`)}"><span class="doc-row-head"><strong>${escapeHtml(doc.title)}</strong>${badge}</span><span class="doc-summary">${escapeHtml(doc.summary)}</span></a></li>`,
      );
    }
    parts.push(`</ul></section>`);
  }
  parts.push(`</div></section>`);
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
  const rendered = md.render(doc.body, env);
  return `<article class="doc">
<div class="doc-meta">
<a class="meta-cat" href="${homeHref}#cat-${doc.category}">${escapeHtml(catLabel)}</a>
${badge}
</div>
${inlineTocHtml(env.headings, ui)}
${rendered}
</article>`;
}

function footerHtml(ui: Ui): string {
  return `<footer class="site-footer">
<a href="${REPO_URL}" rel="noopener" aria-label="${escapeHtml(ui.repoLabel)}">${escapeHtml(ui.repoLabel)}${EXTERNAL_SVG}</a>
</footer>`;
}

function landingShell(
  title: string,
  description: string,
  body: string,
  base: string,
  canonicalPath = "",
  noindex = false,
): string {
  const canonical = canonicalPath === "" ? `${base}/` : `${base}/${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fbf1c7">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">${noindex ? `\n<meta name="robots" content="noindex">` : ""}
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="${FAVICON}">
<script src="site.js?v=${assetVersion}"></script>
<link rel="stylesheet" href="style.css?v=${assetVersion}">
</head>
<body class="landing">
${PAGE_SCROLL}
${body}
</body>
</html>
`;
}

function rootIndexHtml(base: string, docCount: number): string {
  return landingShell(
    "AI Coding Guidelines",
    "Engineering standards for AI coding agents and code reviewers.",
    `<main class="picker">
<div class="picker-theme">${themeToggleHtml(UI.en)}</div>
<header class="picker-head">
<span class="picker-mark">${LOGO_SVG}</span>
<h1>AI Coding Guidelines</h1>
<p class="picker-sub">Engineering standards for AI coding agents and the people who review their work. ${docCount} documents for toolchains, practices, library stacks, and platform patterns.</p>
</header>
<nav class="lang-list" aria-label="Language editions">
<a class="lang-row" lang="en" hreflang="en" href="./en/">
<span class="lang-name">English</span>
<span class="lang-desc">Toolchains, engineering practices, library stacks, and platform patterns.</span>
<span class="lang-go">Read ${ARROW_SVG}</span>
</a>
<a class="lang-row" lang="zh" hreflang="zh" href="./zh/">
<span class="lang-name">简体中文</span>
<span class="lang-desc">工具链、工程实践、技术选型与平台规范。</span>
<span class="lang-go">阅读 ${ARROW_SVG}</span>
</a>
<a class="lang-row" lang="ja" hreflang="ja" href="./ja/">
<span class="lang-name">日本語</span>
<span class="lang-desc">ツールチェーン、開発プラクティス、ライブラリ選定、プラットフォーム設計。</span>
<span class="lang-go">読む ${ARROW_SVG}</span>
</a>
</nav>
<footer class="picker-foot">
<a class="picker-repo" href="${REPO_URL}" rel="noopener">GitHub repository ${EXTERNAL_SVG}</a>
</footer>
</main>`,
    base,
  );
}

function notFoundHtml(base: string): string {
  return landingShell(
    "404 · AI Coding Guidelines",
    "Page not found.",
    `<main class="picker notfound">
<div class="picker-theme">${themeToggleHtml(UI.en)}</div>
<p class="notfound-code">404</p>
<h1>Page not found</h1>
<p class="picker-sub">This page does not exist. Choose a language edition below.</p>
<ul class="notfound-links">
<li lang="en"><a href="${base}/en/">English Overview</a></li>
<li lang="zh"><a href="${base}/zh/">中文总览</a></li>
<li lang="ja"><a href="${base}/ja/">日本語概要</a></li>
</ul>
<footer class="picker-foot">
<a class="picker-repo" href="${REPO_URL}" rel="noopener">GitHub repository ${EXTERNAL_SVG}</a>
</footer>
</main>`,
    base,
    "404.html",
    true,
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

  const siteCss = transform({
    filename: "site.css",
    code: readFileSync(join(import.meta.dirname, "site.css")),
    minify: true,
  }).code;
  const siteJs = readFileSync(join(import.meta.dirname, "site.js"));
  assetVersion = createHash("sha256").update(siteCss).update(siteJs).digest("hex").slice(0, 8);

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
            pageNavHtml({ prev: nav(-1), next: nav(1) }, ui),
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
          content: glossaryBodyHtml(lang, glossary),
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
          footerHtml(ui),
      }),
    );
  }

  emit("index.html", rootIndexHtml(base, enDocs.length));
  emit("404.html", notFoundHtml(base));
  emit("sitemap.xml", sitemapXml(urls));
  emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
  emit(".nojekyll", "");
  writeFileSync(join(outDir, "style.css"), siteCss);
  writeFileSync(join(outDir, "site.js"), siteJs);
  writeFileSync(
    join(outDir, "lucide-LICENSE.txt"),
    readFileSync(join(import.meta.dirname, "lucide-LICENSE")),
  );
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
