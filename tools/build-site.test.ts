import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { test } from "node:test";

const BUILDER = join(import.meta.dirname, "build-site.ts");
const BASE = "https://example.com/site";

interface Outcome {
  status: number;
  stdout: string;
}

function runBuilder(root: string): Outcome {
  const res = spawnSync(
    process.execPath,
    [BUILDER, "--root", root, "--out", join(root, "dist"), "--base", BASE],
    { encoding: "utf8" },
  );
  return { status: res.status ?? 1, stdout: res.stdout + res.stderr };
}

const TITLES = {
  en: { core: "Core Principles", protocol: "Agent Operating Protocol" },
  zh: { core: "核心原则", protocol: "Agent 操作协议" },
  ja: { core: "コア原則", protocol: "Agent 操作プロトコル" },
} as const;

function writeDoc(
  root: string,
  lang: string,
  id: string,
  title: string,
  body: string,
  status = "active",
): void {
  const parts = id.split("/");
  const dir = join(root, "guidelines", lang, ...parts.slice(0, -1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, `${parts[parts.length - 1]}.md`),
    `---\nid: ${id}\nlang: ${lang}\nversion: 1\nsource-lang: en\nstatus: ${status}\ndigest: 00000000\n---\n\n# ${title}\n\n${body}\n`,
  );
}

function makeFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "site-"));
  mkdirSync(join(root, "templates"), { recursive: true });
  writeFileSync(join(root, "templates", "README.template.md"), "# Template\n");
  writeFileSync(
    join(root, "GLOSSARY.md"),
    [
      "# Glossary",
      "",
      "| en | zh | ja |",
      "| --- | --- | --- |",
      "| guideline | 指南 | ガイドライン |",
      "",
      "## Forbidden renderings",
      "",
      "| English term | Lang | Forbidden | Use instead |",
      "| --- | --- | --- | --- |",
      "| workflow | zh | 工作流程 | 工作流 |",
      "",
    ].join("\n"),
  );

  for (const lang of ["en", "zh", "ja"] as const) {
    const coreBody = [
      "First paragraph of the corpus.",
      "",
      "```ts",
      "const answer = 42;",
      "```",
      "",
      "## Details",
      "",
      "Cross-directory: [protocol](../practices/agent-protocol.md).",
      "Out-of-tree: [tpl](../../../templates/README.template.md).",
      "External: [ext](https://example.com/x).",
      "",
      "## Verification",
      "",
      "Second section so the in-page table of contents renders.",
      "",
    ].join("\n");
    writeDoc(root, lang, "principles/core-principles", TITLES[lang].core, coreBody);
    writeDoc(root, lang, "practices/agent-protocol", TITLES[lang].protocol, "Draft body.", "draft");
  }
  return root;
}

void test("builds a trilingual site with rewritten links, TOC, backlinks, and glossary", () => {
  const root = makeFixture();
  try {
    const out = runBuilder(root);
    assert.equal(out.status, 0, out.stdout);

    for (const name of [
      "index.html",
      "404.html",
      "sitemap.xml",
      "robots.txt",
      "style.css",
      "site.js",
      ".nojekyll",
    ]) {
      assert.ok(existsSync(join(root, "dist", name)), `missing dist/${name}`);
    }

    // Visitors can adopt the guidelines from every language homepage without JavaScript.
    const readme = readFileSync(join(import.meta.dirname, "..", "README.md"), "utf8");
    const installCommand = "pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines";
    assert.ok(readme.includes(installCommand), "README installation command diverged");
    for (const lang of ["en", "zh", "ja"]) {
      const home = readFileSync(join(root, "dist", lang, "index.html"), "utf8");
      assert.ok(home.includes(`<code>${installCommand}</code>`), `${lang} install command missing`);
      assert.ok(
        home.includes("https://github.com/fang2hou/ai-coding-guidelines"),
        `${lang} agent instructions missing`,
      );
      assert.ok(home.includes("PORTAL.md"), `${lang} agent instructions omit routing`);
      assert.ok(
        home.indexOf('id="usage-heading"') < home.indexOf('id="start-heading"'),
        `${lang} setup must precede reading paths`,
      );
    }

    const core = readFileSync(
      join(root, "dist", "en", "principles", "core-principles.html"),
      "utf8",
    );
    assert.ok(
      core.includes('href="../index.html#usage-heading"'),
      "document sidebar must link to setup instructions",
    );
    // Corpus links become relative .html links.
    assert.ok(
      core.includes('href="../practices/agent-protocol.html"'),
      "cross-directory link not rewritten",
    );
    // Links leaving the language tree point at the GitHub blob.
    assert.ok(
      core.includes(
        "https://github.com/fang2hou/ai-coding-guidelines/blob/main/templates/README.template.md",
      ),
      "out-of-tree link not mapped to GitHub",
    );
    // External links are untouched.
    assert.ok(core.includes('href="https://example.com/x"'), "external link modified");
    // Language switcher preserves the current page.
    assert.ok(
      core.includes('href="../../zh/principles/core-principles.html"'),
      "zh switch link wrong",
    );
    assert.ok(
      core.includes('href="../../ja/principles/core-principles.html"'),
      "ja switch link wrong",
    );
    // Heading anchors and in-page TOC are generated when 2+ h2 sections exist.
    assert.ok(core.includes('id="details"'), "heading id missing");
    assert.ok(core.includes('class="page-toc"'), "in-page TOC missing");
    assert.ok(core.includes('class="page-toc-inline"'), "inline TOC missing");
    assert.ok(
      core.includes('class="code-block" data-lang="ts"'),
      "fenced code language label missing",
    );
    assert.ok(core.includes("hljs-keyword"), "fenced code syntax highlighting missing");
    // Machine-readable alternates point at the same page in every tree.
    assert.ok(core.includes('hreflang="zh"'), "zh hreflang alternate missing");
    assert.ok(core.includes('hreflang="x-default"'), "x-default hreflang missing");
    assert.ok(core.includes('class="related-section"'), "related guidelines section missing");
    // Stylesheet and behavior script are versioned and relative to the page depth.
    assert.match(core, /href="\.\.\/\.\.\/style\.css\?v=[a-f0-9]{8}"/);
    assert.match(core, /src="\.\.\/\.\.\/site\.js\?v=[a-f0-9]{8}"/);
    assert.ok(core.includes('class="sidebar-shell"'), "sidebar shell missing");
    assert.ok(core.includes('class="theme-toggle"'), "theme toggle missing");

    const zhCore = readFileSync(
      join(root, "dist", "zh", "principles", "core-principles.html"),
      "utf8",
    );
    assert.ok(zhCore.includes("核心原则"), "zh sidebar/title missing");
    assert.ok(
      zhCore.includes('href="../../en/principles/core-principles.html"'),
      "en switch link wrong on zh page",
    );

    // Reverse reference (backlink) appears on the referenced target document.
    const protocol = readFileSync(
      join(root, "dist", "ja", "practices", "agent-protocol.html"),
      "utf8",
    );
    assert.ok(protocol.includes("badge-draft"), "draft badge missing");
    assert.ok(
      protocol.includes('href="../principles/core-principles.html"'),
      "inbound backlink missing on target doc",
    );

    // Glossary page is rendered per language.
    const zhGlossary = readFileSync(join(root, "dist", "zh", "glossary.html"), "utf8");
    assert.ok(zhGlossary.includes("术语表"), "zh glossary title missing");
    assert.ok(zhGlossary.includes("工作流程"), "forbidden term table missing");

    const notFound = readFileSync(join(root, "dist", "404.html"), "utf8");
    assert.ok(notFound.includes('name="robots" content="noindex"'), "404 should be noindex");

    const sitemap = readFileSync(join(root, "dist", "sitemap.xml"), "utf8");
    assert.ok(
      sitemap.includes(`${BASE}/en/principles/core-principles.html`),
      "sitemap missing page",
    );
    assert.ok(sitemap.includes(`${BASE}/zh/glossary.html`), "sitemap missing glossary");
    // Root + 3 languages + (2 docs + 1 glossary) per language = 13.
    assert.equal((sitemap.match(/<url>/g) ?? []).length, 13, "sitemap url count wrong");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

void test("fails when there is no guidelines directory", () => {
  const root = mkdtempSync(join(tmpdir(), "site-empty-"));
  try {
    const out = runBuilder(root);
    assert.notEqual(out.status, 0);
    assert.ok(out.stdout.includes("guidelines"), "error should mention guidelines/");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
