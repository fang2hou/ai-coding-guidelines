import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { test } from "node:test";

const CHECKER = join(import.meta.dirname, "check-docs.ts");
const IDS = ["foo", "sub/bar"];

interface Outcome {
  status: number;
  stdout: string;
}

function runChecker(root: string, ...args: string[]): Outcome {
  const res = spawnSync(process.execPath, [CHECKER, "--root", root, ...args], { encoding: "utf8" });
  return { status: res.status ?? -1, stdout: (res.stdout ?? "") + (res.stderr ?? "") };
}

function docContent(id: string, lang: string): string {
  return [
    "---",
    `id: ${id}`,
    `lang: ${lang}`,
    "version: 1",
    "source-lang: en",
    "status: active",
    "digest: 00000000",
    "---",
    "",
    `# ${id}`,
    "",
    "Body.",
    "",
    "## A",
    "",
    "Text.",
    "",
  ].join("\n");
}

function writeDoc(root: string, lang: string, id: string): void {
  const file = join(root, "guidelines", lang, `${id}.md`);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, docContent(id, lang));
}

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "doccheck-"));
  for (const lang of ["en", "zh", "ja"]) for (const id of IDS) writeDoc(root, lang, id);
  writeFileSync(
    join(root, "PORTAL.md"),
    "# Portal\n\n- [foo](guidelines/en/foo.md)\n- [bar](guidelines/en/sub/bar.md)\n",
  );
  const fixed = runChecker(root, "--fix");
  assert.equal(fixed.status, 0, `bootstrap --fix failed: ${fixed.stdout}`);
  return root;
}

function withRepo(fn: (root: string) => void): void {
  const root = makeRepo();
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("valid repo passes", () => {
  withRepo((root) => {
    const out = runChecker(root);
    assert.equal(out.status, 0, out.stdout);
    assert.match(out.stdout, /OK: 6 documents, 2 ids x 3 languages/);
  });
});

test("missing file in one language tree fails isomorphism", () => {
  withRepo((root) => {
    unlinkSync(join(root, "guidelines/zh/foo.md"));
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /ERROR guidelines\/zh\/foo\.md: missing \(present in en, ja\)/);
  });
});

test("trio version mismatch fails", () => {
  withRepo((root) => {
    const file = join(root, "guidelines/en/foo.md");
    writeFileSync(file, readFileSync(file, "utf8").replace("version: 1", "version: 2"));
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /trio 'version' mismatch/);
  });
});

test("body edit without digest update fails, --fix repairs only the digest line", () => {
  withRepo((root) => {
    const file = join(root, "guidelines/en/foo.md");
    const before = readFileSync(file, "utf8");
    writeFileSync(file, `${before}Added line.\n`);
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /digest mismatch/);

    const fixed = runChecker(root, "--fix");
    assert.equal(fixed.status, 0, fixed.stdout);
    const after = readFileSync(file, "utf8");
    const strip = (s: string) => s.split("\n").filter((l) => !l.startsWith("digest:"));
    assert.deepEqual(strip(after), strip(`${before}Added line.\n`));

    const recheck = runChecker(root);
    assert.equal(recheck.status, 0, recheck.stdout);
  });
});

test("removed heading in one language fails heading parity", () => {
  withRepo((root) => {
    const file = join(root, "guidelines/ja/foo.md");
    writeFileSync(file, readFileSync(file, "utf8").replace("## A", ""));
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /heading level sequences differ/);
  });
});

test("body over 300 lines fails size cap", () => {
  withRepo((root) => {
    const filler = `${Array.from({ length: 301 }, (_, i) => `line ${i}`).join("\n")}\n`;
    for (const lang of ["en", "zh", "ja"]) {
      writeDoc(root, lang, "foo");
      const file = join(root, "guidelines", lang, "foo.md");
      writeFileSync(file, readFileSync(file, "utf8") + filler);
    }
    runChecker(root, "--fix"); // repairs digests; size errors intentionally persist
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /body has \d+ lines \(max 300\)/);
  });
});

test("portal link removal fails coverage", () => {
  withRepo((root) => {
    const file = join(root, "PORTAL.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace("- [bar](guidelines/en/sub/bar.md)\n", ""),
    );
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /guidelines\/en\/sub\/bar\.md not linked in portal/);
  });
});

test("portal broken link fails link resolution", () => {
  withRepo((root) => {
    const file = join(root, "PORTAL.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace("guidelines/en/foo.md", "guidelines/en/nope.md"),
    );
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /broken link 'guidelines\/en\/nope\.md'/);
  });
});

const GLOSSARY_WITH_RULE = [
  "# Glossary",
  "",
  "## Forbidden renderings",
  "",
  "| English term | Lang | Forbidden | Use instead |",
  "| --- | --- | --- | --- |",
  "| workflow | zh | 工作流程 | 工作流 |",
  "",
].join("\n");

test("forbidden rendering in a language tree fails term lint", () => {
  withRepo((root) => {
    writeFileSync(join(root, "GLOSSARY.md"), GLOSSARY_WITH_RULE);
    const file = join(root, "guidelines/zh/foo.md");
    writeFileSync(file, `${readFileSync(file, "utf8")}遵循既定工作流程。\n`);
    runChecker(root, "--fix"); // repairs the digest; the term error persists
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(
      out.stdout,
      /guidelines\/zh\/foo\.md:\d+: forbidden rendering '工作流程' for 'workflow'; use '工作流'/,
    );
  });
});

test("term rules with no occurrences pass", () => {
  withRepo((root) => {
    writeFileSync(join(root, "GLOSSARY.md"), GLOSSARY_WITH_RULE);
    const out = runChecker(root);
    assert.equal(out.status, 0, out.stdout);
  });
});

test("half-width punctuation adjacent to CJK fails", () => {
  withRepo((root) => {
    const file = join(root, "guidelines/zh/foo.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace("Body.", "工具链,保持一致:")
        .replace("Text.", "参考： 模板"),
    );
    const out = runChecker(root);
    assert.equal(out.status, 1);
    assert.match(out.stdout, /foo\.md:12: half-width ',' adjacent to CJK text; use '，'/);
    assert.match(out.stdout, /half-width ':' adjacent to CJK text; use '：'/);
    assert.match(out.stdout, /full-width '：' followed by redundant space/);
  });
});

test("punctuation fix rewrites to full-width", () => {
  withRepo((root) => {
    const zhFile = join(root, "guidelines/zh/foo.md");
    const jaFile = join(root, "guidelines/ja/foo.md");
    writeFileSync(
      zhFile,
      readFileSync(zhFile, "utf8")
        .replace("Body.", "工具链,保持一致; 例如:")
        .replace("Text.", "参考： 模板"),
    );
    writeFileSync(
      jaFile,
      readFileSync(jaFile, "utf8").replace("Body.", "たとえば:次のようにする,"),
    );
    const fixed = runChecker(root, "--fix");
    assert.equal(fixed.status, 0, fixed.stdout);
    assert.match(readFileSync(zhFile, "utf8"), /工具链，保持一致；例如：/);
    assert.match(readFileSync(zhFile, "utf8"), /参考：模板/);
    assert.match(readFileSync(jaFile, "utf8"), /たとえば：次のようにする、/);
    const out = runChecker(root);
    assert.equal(out.status, 0, out.stdout);
  });
});

test("latin clusters and code spans keep half-width", () => {
  withRepo((root) => {
    const file = join(root, "guidelines/zh/foo.md");
    writeFileSync(file, readFileSync(file, "utf8").replace("Body.", "启用 `E,F` 与规则 E, F, I。"));
    const fixed = runChecker(root, "--fix");
    assert.equal(fixed.status, 0, fixed.stdout);
    assert.match(readFileSync(file, "utf8"), /启用 `E,F` 与规则 E, F, I。/);
    const out = runChecker(root);
    assert.equal(out.status, 0, out.stdout);
  });
});
