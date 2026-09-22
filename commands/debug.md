---
description: Debug sistematis — root cause dulu, baru fix
agent: code
subtask: true
---

# Debug Command

Untuk: $ARGUMENTS

## Workflow (wajib berurutan)

1. Invoke skill `systematic-debugging` — reproduksi dulu, jangan tebak.
2. Tulis reproduksi minimal (1 script / 1 test yang FAIL).
3. `grep` semua caller dari fungsi yang mau disentuh — fix di root cause
   (satu guard di fungsi shared), bukan di tiap caller.
4. Fix minimal, run ulang reproduksi → harus PASS.
5. Checklist: `prettier --write`, `npx tsc --noEmit`, hapus `console.log`.

DILARANG: tebak fix tanpa reproduksi, patch gejala di satu caller saja.
