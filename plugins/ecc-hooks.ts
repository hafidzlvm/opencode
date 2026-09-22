import type { Plugin } from "@opencode-ai/plugin";
import { execFile } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const FORMATTABLE = /\.(jsx?|tsx?|json|md)$/;

function formatAsync(abs: string) {
  execFile(
    "npx",
    ["--yes", "prettier", "--write", abs],
    { timeout: 20000 },
    () => {},
  );
}

function countConsole(abs: string): number {
  try {
    if (statSync(abs).size > 500_000) return 0;
    const src = readFileSync(abs, "utf8");
    return (src.match(/console\.(log|debug|info|warn|error)\s*\(/g) ?? [])
      .length;
  } catch {
    return 0;
  }
}

function notify(title: string, body: string) {
  // ponytail: notify-send doang (no dep, no sound file). Gagal = diam.
  execFile(
    "notify-send",
    [title, body, "--app-name=opencode"],
    { timeout: 5000 },
    () => {},
  );
}

export default (async () => {
  return {
    // Gantikan @mohak34/opencode-notifier (dep npm + install tiap start).
    // 20 baris ini cukup: idle + permission = 2 momen yang bikin user nunggu.
    event: async ({ event }: any) => {
      try {
        if (event?.type === "session.idle")
          notify("opencode", "Sesi idle — butuh input kamu.");
        else if (event?.type === "permission.asked")
          notify("opencode", "Butuh approval — cek terminal.");
        else if (event?.type === "session.error")
          notify("opencode", "Session error.");
      } catch {
        // hook tidak boleh merusak sesi
      }
    },
    // Compaction suka buang todos + keputusan. Titip pesan ke ringkasan.
    "experimental.session.compacting": async (_input, output) => {
      try {
        output.context.push(
          "Pertahankan: status todowrite (yang pending/in_progress), keputusan user, " +
            "file yang sedang dikerjakan, dan pointer workflow " +
            "~/.config/opencode/rules/00-workflow.md.",
        );
      } catch {
        // hook tidak boleh merusak sesi
      }
    },
    // ponytail: jaminan lapis-3, ~40 token. Lapis 1-2 (instructions + AGENTS.md
    // pointer) sudah cukup di kebanyakan sesi; hook ini backstop kalau keduanya
    // tertimpa config project.
    "experimental.chat.system.transform": async (_input, output) => {
      try {
        output.system.push(
          "Global workflow: baca ~/.config/opencode/rules/00-workflow.md dan ikuti skill matrix-nya. " +
            "Kalau ada skill yang cocok, invoke dulu SEBELUM aksi. " +
            "Brainstorming dulu untuk kerja kreatif, verifikasi (lint+tes+build) sebelum klaim selesai.",
        );
      } catch {
        // hook tidak boleh merusak sesi
      }
    },
    "tool.execute.after": async (input, output) => {
      try {
        if (input.tool !== "edit" && input.tool !== "write") return;
        const fp = input.args?.filePath;
        if (typeof fp !== "string" || !FORMATTABLE.test(fp)) return;
        if (fp.includes("node_modules")) return;
        // ponytail: prettier auto-format, silent fail kalau prettier tidak ada
        formatAsync(fp);
        const n = countConsole(fp);
        if (n > 0 && typeof output.output === "string") {
          output.output += `\n[ecc-hooks] ${n} console.* di ${fp} — hapus sebelum ship.`;
        }
      } catch {
        // hook tidak boleh merusak sesi
      }
    },
  };
}) satisfies Plugin;
