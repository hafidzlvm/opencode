# Global Workflow (berlaku di SEMUA mode/agent)

Precedence: Security (INSTRUCTIONS.md) > file ini > rules lain. File User1/User2
("patuh mutlak") hanya soal eksekusi kode, tidak mengalahkan security.

## 1. Prinsip skill: cocok → WAJIB pakai

Kalau ada skill di bawah yang cocok dengan tugas, invoke via `skill` tool
SEBELUM aksi/respons — termasuk sebelum tanya klarifikasi atau baca codebase.
Bingung skill apa yang cocok → invoke `find-skills` dulu.

## 2. Brainstorming — global, bukan cuma /plan

Sebelum kerja kreatif APAPUN (fitur baru, komponen, refactor perilaku,
perbaikan bug non-trivial) di mode/agent manapun:

1. Invoke skill `brainstorming` dulu — gali intent, requirement, batasan.
2. Satu pertanyaan klarifikasi paling relevan saja, sisanya default yang lazy.
3. Tulis rencana 3-7 langkah di `todowrite`, baru eksekusi.

DILARANG brainstorming untuk: baca file, jawab konsep, edit 1-2 baris yang
sudah jelas, run command tunggal.

## 3. Skill matrix — trigger → skill (nama persis)

### Proses & kualitas (superpowers)

| Trigger                                        | Skill                                              |
| ---------------------------------------------- | -------------------------------------------------- |
| Bug / gagal tes / perilaku aneh                | `systematic-debugging` SEBELUM usulkan fix         |
| Fitur / bugfix apapun                          | `test-driven-development` (tes dulu, RED→GREEN)    |
| Mau klaim "selesai / done / fixed"             | `verification-before-completion` (run bukti dulu)  |
| Fitur >1 hari / kerja paralel                  | `using-git-worktrees`                              |
| Review feedback datang / mau minta review      | `receiving-code-review` / `requesting-code-review` |
| Selesai branch, mau merge/rebase/PR            | `finishing-a-development-branch` (atau `/ship`)    |
| Generate kode (komponen, modul, script)        | `full-output-enforcement` (no placeholder)         |
| Rencana masih mentah / perlu diuji             | `grill-me`                                         |
| Spec/requirement multi-langkah siap dieksekusi | `writing-plans` → `executing-plans`                |
| Tugas independen 2+ bisa jalan paralel         | `dispatching-parallel-agents` (via `task` tool)    |
| Eksekusi plan via subagent di sesi ini         | `subagent-driven-development`                      |

### iikit (spec-driven, `~/.config/opencode/skills`)

| Trigger                                   | Skill                                               |
| ----------------------------------------- | --------------------------------------------------- |
| Mulai / cek progres fitur iikit           | `iikit-core`                                        |
| Aturan main proyek, standar, quality gate | `iikit-00-constitution`                             |
| Fitur baru, PRD, user story, FR-XXX       | `iikit-01-specify`                                  |
| Spec/plan ambigu, ada trade-off           | `iikit-clarify`                                     |
| Desain teknis, pilih lib, skema DB, API   | `iikit-02-plan`                                     |
| Review kelengkapan requirement            | `iikit-03-checklist`                                |
| Tulis Gherkin `.feature` dulu (TDD/BDD)   | `iikit-04-testify`                                  |
| Pecah jadi task terurut                   | `iikit-05-tasks`                                    |
| Cek konsistensi antar-artifak             | `iikit-06-analyze`                                  |
| Eksekusi `tasks.md` jadi kode             | `iikit-07-implement`                                |
| Export task → GitHub Issues               | `iikit-08-taskstoissues` (butuh MCP `github` aktif) |
| Bug pada fitur yang sudah ada             | `iikit-bugfix`                                      |

### Kerja panjang otonom

| Trigger                                               | Skill                                                                                                                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tugas >10 langkah tanpa henti                         | `ralph-loop` (hentikan via `cancel-ralph`). Anti-idle: dilarang berhenti menunggu user — putuskan sendiri, tulis asumsi, lanjut. Berhenti sah hanya untuk secret/akses/biaya/irreversible                                   |
| Mau tinggal tidur (jalan tanpa pengawasan)            | `/night-shift` scaffold task → `tools/night-shift.sh` (default full-auto; `--semi-auto` untuk approve manual). Agent `night-shift`: commit lokal, tidak pernah push, berhenti via `.opencode/NIGHT-DONE` / budget / blocked |
| Minta AI improvisasi mandiri di sesi ini (ala Jarvis) | Agent `night-shift-session` / `/night-shift-session` (default 10 iterasi; habis bahan → tulis analisa pengembangan + berhenti)                                                                                              |

### Frontend & visual (`~/.agents/skills`)

| Trigger                                 | Skill                                                                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sentuh UI apapun                        | `web-design-guidelines` (aksesibilitas dulu) + SATU arah visual: `high-end-visual-design` (default) / `minimalist-ui` (dashboard) / `industrial-brutalist-ui` (data-heavy) / `swiss-design` (editorial). Satu saja. |
| User minta "beberapa versi" / varian UI | `prototype`                                                                                                                                                                                                         |
| Mockup → kode                           | `image-to-code` / `image-to-code-skill`                                                                                                                                                                             |
| Butuh referensi desain per-section      | `imagegen-frontend-web` / `imagegen-frontend-mobile`                                                                                                                                                                |
| Rasa generik, butuh arah selera         | SALAH SATU: `design-taste-frontend`, `gpt-taste`, atau `stitch-design-taste` (jangan ketiganya)                                                                                                                     |
| UI gesture / spring / sheet / iOS-feel  | `apple-design`                                                                                                                                                                                                      |
| User deskripsikan animasi tanpa nama    | `animation-vocabulary`                                                                                                                                                                                              |
| Upgrade situs/app yang sudah ada        | `redesign-existing-projects`                                                                                                                                                                                        |
| Logo / hero / brand system custom       | `brandkit`, `impeccable-asset-producer`                                                                                                                                                                             |
| Polish akhir / audit / dokumentasi UI   | `impeccable`, `impeccable-finish-reviewer`, `impeccable-documenter`                                                                                                                                                 |
| Terapkan edit manual dari user          | `impeccable-manual-edit-applier`                                                                                                                                                                                    |
| Poster / karya statis / cetak           | `canvas-design`                                                                                                                                                                                                     |
| Verifikasi tampilan                     | skill `playwright-cli` + MCP `playwright` (screenshot desktop+mobile)                                                                                                                                               |

### Riset & browsing

| Trigger                                    | Skill               |
| ------------------------------------------ | ------------------- |
| JS-rendered page, login, form, WAF-block   | `ultimate-browsing` |
| Syntax / migrasi versi lib, framework, SDK | MCP `context7`      |

DILARANG: taste-stack sekaligus (`brandkit` + `swiss` + `minimalist` +
`brutalist` + `gpt-taste` + `stitch` + `design-taste-*`) — tabrakan selera +
jebol token. Butuh yang tidak ada di daftar → `find-skills`.

### Skill lokal (`skills/`) — trigger → skill (nama persis)

| Trigger                                | Skill                          |
| -------------------------------------- | ------------------------------ |
| Debug / error / test gagal             | `debugging-and-error-recovery` |
| Pecah spec jadi task terurut           | `planning-and-task-breakdown`  |
| Tulis/jalankan tes                     | `test-driven-development`      |
| Review kualitas kode                   | `code-review-and-quality`      |
| Sesi baru / output ngaco / pindah area | `context-engineering`          |
| Kode harus ikut docs resmi versi aktif | `source-driven-development`    |
| Perubahan multi-file                   | `incremental-implementation`   |
| Bingung skill apa yang cocok           | `using-agent-skills`           |

### Graphify-first — standar hemat token (30.6x)

Pertanyaan arsitektur / "how does X work" / "what calls Y" / trace alur:
`graphify query` DULU (scoped subgraph ~21k token), baru `grep`/`glob`/`read`
untuk verifikasi. Jangan baca file buta (~644k token naive). Detail di
`rules/02-graphify.md`. Batas: edit 1-2 baris yang sudah jelas → langsung edit,
tanpa query.

## 4. MCP

- `context7` — wajib untuk API/framework/SDK syntax & migrasi versi.
- `playwright` — wajib untuk verifikasi visual (screenshot desktop+mobile).
- `github` — aktifkan (`enabled: true` + `GITHUB_TOKEN`) kalau pakai
  `iikit-08-taskstoissues` / butuh baca issues & PR.

## 5. After-code checklist (semua mode coding)

Hook `ecc-hooks` sudah auto-format + warning `console.log`. Sisanya manual:
`npx tsc --noEmit` → hapus `console.log` → `security-reviewer` kalau sentuh
auth/input/query → update todos.
