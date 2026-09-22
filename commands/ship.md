---
description: Ship — verifikasi, review, putuskan merge/rebase/PR
agent: code
subtask: true
---

# Ship Command

Untuk: $ARGUMENTS

## Workflow (wajib berurutan)

1. Invoke skill `verification-before-completion` — run BUKTI (lint, test,
   build, coverage). Dilarang klaim done tanpa output hijau.
2. Invoke skill `requesting-code-review` — review sendiri sebelum merge.
3. Kalau sentuh auth/input/query: panggil `security-reviewer` subagent.
4. Invoke skill `finishing-a-development-branch` — putuskan merge vs
   rebase vs PR, jangan asal push ke main.
5. Commit format: `<type>: <description>` (feat, fix, refactor, docs,
   test, chore, perf, ci). Tanpa diminta eksplisit: JANGAN push.
