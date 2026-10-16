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
    {
      encoding: "utf8",
    },
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

  for (const lang of ["en", "zh", "ja"] as const) {
    const coreBody = [
      "First paragraph of the corpus.",
      "",
      "## Details",
      "",
      "Cross-directory: [protocol](../practices/agent-protocol.md).",
      "Out-of-tree: [tpl](../../../templates/README.template.md).",
      "External: [ext](https://example.com/x).",
      "",
    ].join("\n");
    writeDoc(root, lang, "principles/core-principles", TITLES[lang].core, coreBody);
    writeDoc(root, lang, "practices/agent-protocol", TITLES[lang].protocol, "Draft body.", "draft");
  }
  return root;
}

void test("builds a trilingual site with rewritten links and language switching", () => {
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
      ".nojekyll",
    ]) {
      assert.ok(existsSync(join(root, "dist", name)), `missing dist/${name}`);
    }

    const core = readFileSync(
      join(root, "dist", "en", "principles", "core-principles.html"),
      "utf8",
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
    // Heading anchors are injected with the anchor link.
    assert.ok(core.includes('id="details"'), "heading id missing");
    assert.ok(core.includes('class="anchor"'), "anchor link missing");
    // Stylesheet is referenced relative to the page depth.
    assert.ok(core.includes('href="../../style.css"'), "asset prefix wrong");

    const zhCore = readFileSync(
      join(root, "dist", "zh", "principles", "core-principles.html"),
      "utf8",
    );
    assert.ok(zhCore.includes("核心原则"), "zh sidebar/title missing");
    assert.ok(
      zhCore.includes('href="../../en/principles/core-principles.html"'),
      "en switch link wrong on zh page",
    );

    const protocol = readFileSync(
      join(root, "dist", "ja", "practices", "agent-protocol.html"),
      "utf8",
    );
    assert.ok(protocol.includes("badge-draft"), "draft badge missing");

    const sitemap = readFileSync(join(root, "dist", "sitemap.xml"), "utf8");
    assert.ok(
      sitemap.includes(`${BASE}/en/principles/core-principles.html`),
      "sitemap missing page",
    );
    // Root + 3 languages + 2 docs per language.
    assert.equal((sitemap.match(/<url>/g) ?? []).length, 10, "sitemap url count wrong");
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
