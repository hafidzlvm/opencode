# opencode config

Personal OpenCode setup: workflow rules, curated skills, plugins, commands.

## Skills: curated vs bulk

| Folder | Isi | Git | Sumber |
| --- | --- | --- | --- |
| `skills/` | Kurasi sendiri, menang atas duplikat | tracked | manual |
| `skills-antigravity-awesome/` | Bulk pihak ketiga, hanya yang di `rules/03` | gitignored | npx / script di bawah |

## Selective reinstall (hanya picks di rules/03)

Full dump (±1839 skills, ±95MB) tidak perlu. Install ulang cukup 117 picks
(±6MB) yang dipetakan di `rules/03-antigravity-skills.md`:

```bash
# install hanya picks rules/03 → skills-antigravity-awesome/
tools/install-antigravity-picks.sh

# pin versi upstream (penting: main bergerak tiap hari)
AX_TAG=v13.13.0 tools/install-antigravity-picks.sh

# target direktori lain
tools/install-antigravity-picks.sh /path/ke/dir
```

Script membaca ID skill langsung dari `rules/03-antigravity-skills.md`,
sparse-clone `github.com/sickn33/antigravity-awesome-skills` (blobless),
lalu copy hanya `skills/<id>/`. Edit rules/03 → run ulang untuk tambah/hapus.

Tanpa `AX_TAG`, yang terinstall = upstream `main` terbaru (bisa beda isi
dengan snapshot lama — itu normal, bukan error).

## Full reinstall (semua skills, kalau perlu)

```bash
npx -y antigravity-awesome-skills --path /tmp/ax-full   # JANGAN ke skills/
mv /tmp/ax-full/<isi> skills-antigravity-awesome/       # installer kadang bikin path bersarang
```

Jangan install langsung ke `skills/` — folder kurasi tidak boleh kecampur.
Duplikat ID vs `skills/` di-rename prefix `ax-` (menang = kurasi sendiri).
