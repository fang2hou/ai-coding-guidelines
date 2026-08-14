import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import process from "node:process";

// Trilingual docs validator. See docs/en/decisions/0001-guideline-repo-structure.md
// and AGENTS.md for the model this enforces.

const LANGS = ["en", "zh", "ja"] as const;
type Lang = (typeof LANGS)[number];

const REQUIRED_KEYS = ["id", "lang", "version", "source-lang", "status", "digest"] as const;
const STATUSES = ["draft", "active", "deprecated"];
const MAX_BODY_LINES = 300;

interface Doc {
  lang: Lang;
  id: string;
  relPath: string;
  absPath: string;
  raw: string;
  rawLines: string[];
  fm: Map<string, string>;
  digestLineIdx: number;
  body: string;
  headings: number[];
}

function listMarkdown(dir: string, root: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full, root));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(relative(root, full));
  }
  return out.sort();
}

function normalizeBody(rawAfterFm: string): string {
  let text = rawAfterFm.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  const trimmed = lines.map((l) => l.replace(/[ \t]+$/, ""));
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") trimmed.pop();
  return trimmed.length === 0 ? "" : trimmed.join("\n") + "\n";
}

function headingLevels(body: string): number[] {
  const levels: number[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,6})(\s|$)/.exec(line);
    if (m) levels.push(m[1].length);
  }
  return levels;
}

function parseDoc(absPath: string, relPath: string, lang: Lang, errors: string[]): Doc | null {
  const raw = readFileSync(absPath, "utf8");
  const rawLines = raw.split("\n");
  const err = (msg: string) => errors.push(`ERROR ${relPath}: ${msg}`);

  if (rawLines[0] === undefined || rawLines[0].trimEnd() !== "---") {
    err("missing front matter (must open with '---')");
    return null;
  }
  let close = -1;
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i].trimEnd() === "---") {
      close = i;
      break;
    }
  }
  if (close === -1) {
    err("unterminated front matter (missing closing '---')");
    return null;
  }

  const fm = new Map<string, string>();
  let digestLineIdx = -1;
  for (let i = 1; i < close; i++) {
    const line = rawLines[i];
    const m = /^([a-z-]+):\s*(\S.*)$/.exec(line);
    if (!m) {
      err(`front matter line ${i + 1} is not a flat 'key: value' pair: ${JSON.stringify(line)}`);
      continue;
    }
    const [, key, value] = m;
    if (!REQUIRED_KEYS.includes(key as (typeof REQUIRED_KEYS)[number])) {
      err(`unknown front matter key '${key}' (allowed: ${REQUIRED_KEYS.join(", ")})`);
      continue;
    }
    if (fm.has(key)) err(`duplicate front matter key '${key}'`);
    if (key === "digest") digestLineIdx = i;
    fm.set(key, value.trim());
  }
  for (const key of REQUIRED_KEYS) {
    if (!fm.has(key)) err(`missing front matter key '${key}'`);
  }

  const expectedId = relPath.slice(`docs/${lang}/`.length, -".md".length);
  if (fm.get("id") !== undefined && fm.get("id") !== expectedId) {
    err(`id '${fm.get("id")}' does not match path-derived id '${expectedId}'`);
  }
  if (fm.get("lang") !== undefined && fm.get("lang") !== lang) {
    err(`lang '${fm.get("lang")}' does not match tree '${lang}'`);
  }
  const version = fm.get("version");
  if (version !== undefined && !/^\d+$/.test(version)) {
    err(`version '${version}' is not a positive integer`);
  }
  if (fm.get("status") !== undefined && !STATUSES.includes(fm.get("status") as string)) {
    err(`status '${fm.get("status")}' not in {${STATUSES.join(", ")}}`);
  }
  const sourceLang = fm.get("source-lang");
  if (sourceLang !== undefined && !LANGS.includes(sourceLang as Lang)) {
    err(`source-lang '${sourceLang}' not in {${LANGS.join(", ")}}`);
  }

  const body = normalizeBody(rawLines.slice(close + 1).join("\n"));
  return {
    lang,
    id: expectedId,
    relPath,
    absPath,
    raw,
    rawLines,
    fm,
    digestLineIdx,
    body,
    headings: headingLevels(body),
  };
}

function linkTargets(text: string): string[] {
  const targets: string[] = [];
  let inFence = false;
  for (const line of text.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const m of line.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:#[^)\s]*)?\)/g)) {
      targets.push(m[1]);
    }
  }
  return targets;
}

function checkLinksOf(fileRel: string, text: string, root: string, errors: string[]): void {
  for (const target of linkTargets(text)) {
    if (/^(https?:|mailto:)/i.test(target)) continue;
    const base = target.startsWith("/") ? root : resolve(root, dirname(fileRel));
    const resolved = resolve(base, target.startsWith("/") ? `.${target}` : target);
    const rel = relative(root, resolved);
    if (!existsSync(resolved) || !statSync(resolved).isFile()) {
      errors.push(`ERROR ${fileRel}: broken link '${target}' (resolved: ${rel})`);
    }
  }
}

function run(root: string, fix: boolean): number {
  const errors: string[] = [];
  const docsByLang = new Map<Lang, Doc[]>();

  for (const lang of LANGS) {
    const dir = join(root, "docs", lang);
    const docs: Doc[] = [];
    for (const relPath of listMarkdown(dir, root)) {
      const doc = parseDoc(join(root, relPath), relPath, lang, errors);
      if (doc) docs.push(doc);
    }
    docsByLang.set(lang, docs);
  }

  // Tree isomorphism: identical id sets in all three language trees
  const idsByLang = new Map<Lang, Set<string>>(
    LANGS.map((lang) => [lang, new Set((docsByLang.get(lang) ?? []).map((d) => d.id))]),
  );
  const unionIds = new Set<string>();
  for (const ids of idsByLang.values()) for (const id of ids) unionIds.add(id);
  for (const lang of LANGS) {
    const own = idsByLang.get(lang) ?? new Set<string>();
    for (const id of unionIds) {
      if (own.has(id)) continue;
      const others = LANGS.filter((l) => idsByLang.get(l)?.has(id));
      errors.push(`ERROR docs/${lang}/${id}.md: missing (present in ${others.join(", ")})`);
    }
  }

  // Per-doc body checks
  for (const docs of docsByLang.values()) {
    for (const doc of docs) {
      const bodyLines = doc.body === "" ? 0 : doc.body.split("\n").length - 1;
      if (bodyLines > MAX_BODY_LINES) {
        errors.push(
          `ERROR ${doc.relPath}: body has ${bodyLines} lines (max ${MAX_BODY_LINES}); split the document`,
        );
      }
    }
  }

  // Trio consistency + heading parity
  const byId = new Map<string, Map<Lang, Doc>>();
  for (const lang of LANGS) {
    for (const doc of docsByLang.get(lang) ?? []) {
      let trio = byId.get(doc.id);
      if (!trio) {
        trio = new Map();
        byId.set(doc.id, trio);
      }
      trio.set(lang, doc);
    }
  }
  for (const [id, trio] of byId) {
    const langs = [...trio.keys()];
    if (langs.length === 3) {
      for (const key of ["version", "source-lang", "status"] as const) {
        const values = new Set([...trio.values()].map((d) => d.fm.get(key)));
        if (values.size > 1) {
          const detail = [...trio.values()].map((d) => `${d.lang}=${d.fm.get(key)}`).join(", ");
          errors.push(
            `ERROR docs/{${langs.join(",")}}/${id}.md: trio '${key}' mismatch (${detail})`,
          );
        }
      }
      const seqs = new Set([...trio.values()].map((d) => d.headings.join(",")));
      if (seqs.size > 1) {
        errors.push(
          `ERROR docs/{${langs.join(",")}}/${id}.md: heading level sequences differ across languages`,
        );
      }
    }
  }

  // Digest
  for (const lang of LANGS) {
    for (const doc of docsByLang.get(lang) ?? []) {
      // sha256 of the normalized body, first 8 hex chars
      const actual = createHash("sha256").update(doc.body, "utf8").digest("hex").slice(0, 8);
      const stored = doc.fm.get("digest");
      if (stored === actual) continue;
      if (fix) {
        if (doc.digestLineIdx >= 0) {
          doc.rawLines[doc.digestLineIdx] = `digest: ${actual}`;
          writeFileSync(doc.absPath, doc.rawLines.join("\n"));
        } else {
          errors.push(`ERROR ${doc.relPath}: cannot --fix digest without a digest line`);
        }
      } else {
        errors.push(
          `ERROR ${doc.relPath}: digest mismatch (stored ${stored}, actual ${actual}); run 'mise run fix'`,
        );
      }
    }
  }

  // Portal coverage + link resolution
  const portalRel = "PORTAL.md";
  const portalPath = join(root, portalRel);
  if (!existsSync(portalPath)) {
    errors.push(`ERROR PORTAL.md: missing portal file`);
  } else {
    const portalText = readFileSync(portalPath, "utf8");
    checkLinksOf(portalRel, portalText, root, errors);
    const enIds = new Set((docsByLang.get("en") ?? []).map((d) => d.id));
    const linked = new Set(linkTargets(portalText));
    for (const id of enIds) {
      if (!linked.has(`docs/en/${id}.md`)) {
        errors.push(`ERROR PORTAL.md: docs/en/${id}.md not linked in portal inventory`);
      }
    }
  }

  // Doc link resolution
  for (const lang of LANGS) {
    for (const doc of docsByLang.get(lang) ?? []) {
      checkLinksOf(doc.relPath, doc.raw, root, errors);
    }
  }

  if (errors.length > 0) {
    process.stdout.write(errors.join("\n") + "\n");
    process.stdout.write(`${errors.length} error(s)\n`);
    return 1;
  }

  const total = LANGS.reduce((n, l) => n + (docsByLang.get(l)?.length ?? 0), 0);
  process.stdout.write(`OK: ${total} documents, ${byId.size} ids x 3 languages\n`);
  return 0;
}

const args = process.argv.slice(2);
const fix = args.includes("--fix");
const rootIdx = args.indexOf("--root");
const root = rootIdx !== -1 ? resolve(args[rootIdx + 1] ?? ".") : process.cwd();
process.exit(run(root, fix));
