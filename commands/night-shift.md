---
description: Siapkan night-task untuk jalan tanpa pengawasan (full-auto default)
agent: planner
subtask: true
---

# Night-shift scaffolding

Tugas user: $ARGUMENTS

## Workflow

1. Kalau request ambigu, invoke `brainstorming` + 1 pertanyaan klarifikasi saja.
2. Tulis `.opencode/night-task.md` dengan format ini (jangan mulai implementasi):

```markdown
# Night task

## GOAL

[satu paragraf: hasil akhir yang diinginkan]

## DONE criteria (semua harus terverifikasi)

- [ ] [kriteria 1 — ada bukti tes/build, bukan niat]
- [ ] [kriteria 2]

## Batas

- Max run: [default 30]
- Dilarang: push, .env/secret, perintah destruktif (sudah dikunci agent juga)

## Log

- (diisi agent tiap run: perubahan + hasil tes)
```

3. Balas HANYA dengan perintah jalaninnya (path absolut, jangan eksekusi sendiri):

```bash
tmux new -s night -- ~/.config/opencode/tools/night-shift.sh            # full-auto (default)
tmux new -s night -- ~/.config/opencode/tools/night-shift.sh --semi-auto # kamu approve manual
```
