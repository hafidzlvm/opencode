# AGENTS.md

(kode & istilah teknis tetap English). Jawaban ringkas, langsung ke isi — tanpa pemanis pembuka.

## Aturan main

- Workflow global: baca `~/.config/opencode/rules/00-workflow.md`
  dulu (brainstorming dulu untuk kerja kreatif, skill matrix minimal,
  after-code checklist). Kalau file tidak bisa dibaca, lanjut tanpa itu.
- Security & gaya kode: ikuti `instructions/INSTRUCTIONS.md`. Tidak ada secret
  hardcoded — selalu env variable.
- Prinsip kode: KISS, DRY, SOLID seperlunya. Hapus kode mati daripada nambah
  abstraksi. Diff terkecil yang benar menang.
- Jangan klaim selesai tanpa bukti: lint + tes + build hijau dulu.
- Jangan commit/push kecuali diminta eksplisit.

