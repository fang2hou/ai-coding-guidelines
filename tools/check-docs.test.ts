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
