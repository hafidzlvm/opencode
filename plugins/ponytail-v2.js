// ponytail — local V2-compatible wrapper.
//
// Upstream @dietrichgebert/ponytail (v4.10.0) still ships V1-only format
// (default-exported async function), which OpenCode v2 rejects with
// "Plugin must export a default definition with an id and an effect or
// setup function". So the npm entry is NOT listed in opencode.json;
// this file re-exports it as server() (V1-compat path, same pattern as
// superpowers) and registers its 6 skills natively via setup().
import ponytailV1 from "@dietrichgebert/ponytail";
import { createRequire } from "module";
import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";

export const PonytailPlugin = ponytailV1;

const require = createRequire(import.meta.url);
// exports map only exposes "." — resolve the entry, then go up
// <pkg>/.opencode/plugins/ponytail.mjs → <pkg>/ (same layout the
// upstream plugin itself uses for its skills dir).
const entryFile = require.resolve("@dietrichgebert/ponytail");
const skillsDir = join(dirname(dirname(dirname(entryFile))), "skills");

function readSkill(dir, id) {
  const skillPath = join(dir, id, "SKILL.md");
  if (!existsSync(skillPath)) return null;
  const raw = readFileSync(skillPath, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { id, name: id, path: skillPath, content: raw };
  const fm = {};
  let lastKey = null;
  for (const line of m[1].split("\n")) {
    const ci = line.indexOf(":");
    if (ci > 0 && !/^\s/.test(line)) {
      lastKey = line.slice(0, ci).trim();
      fm[lastKey] = line.slice(ci + 1).trim();
    } else if (lastKey && line.trim()) {
      fm[lastKey] += " " + line.trim();
    }
  }
  return {
    id,
    name: (fm.name || id).replace(/^(["'])([\s\S]*)\1$/, "$2"),
    ...(fm.description
      ? { description: fm.description.replace(/^(["'])([\s\S]*)\1$/, "$2") }
      : {}),
    path: skillPath,
    content: m[2],
  };
}

async function setup(ctx) {
  // V1-shaped ctx (no skill domain) → server() path serves V1, stay quiet.
  if (!ctx?.skill || typeof ctx.skill.transform !== "function") return;
  try {
    const skills = [];
    if (existsSync(skillsDir)) {
      for (const e of readdirSync(skillsDir, { withFileTypes: true })) {
        if (!e.isDirectory() || e.name.startsWith(".")) continue;
        const s = readSkill(skillsDir, e.name);
        if (s) skills.push(s);
      }
    }
    await ctx.skill.transform((draft) => {
      for (const s of skills) {
        try {
          draft.add(s);
        } catch (err) {
          console.error(`[ponytail] skill "${s.id}" rejected, skipping:`, err);
        }
      }
    });
  } catch (err) {
    console.error("[ponytail] skill registration failed:", err);
  }
}

export default {
  id: "ponytail",
  server: PonytailPlugin,
  setup,
};
