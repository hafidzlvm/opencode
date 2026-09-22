#!/usr/bin/env bash
# night-shift — jalanin opencode tanpa pengawasan.
#   tools/night-shift.sh [--full-auto|--semi-auto] [task-file] [max-runs]
# Default full-auto. Bungkus dengan tmux biar tahan tutup terminal:
#   tmux new -s night -- tools/night-shift.sh
set -u

MODE="--full-auto"
TASK=".opencode/night-task.md"
MAX=30
for a in "$@"; do
  case "$a" in
    --full-auto|--semi-auto) MODE="$a" ;;
    [0-9]*) MAX="$a" ;;
    *) TASK="$a" ;;
  esac
done

[ -f "$TASK" ] || { echo "task file tidak ada: $TASK — buat dulu via /night-shift"; exit 1; }
command -v opencode >/dev/null || { echo "opencode tidak di PATH"; exit 1; }

if [ "$MODE" = "--semi-auto" ]; then
  echo "semi-auto: buka TUI, kamu yang approve. Task: $TASK"
  exec opencode
fi

# full-auto: sprint berulang, tiap sprint lanjutkan sesi sebelumnya.
DONE_MARKER=".opencode/NIGHT-DONE"
STATE=".opencode/night-state.md"
rm -f "$DONE_MARKER"
write_state() { # $1=iteration $2=status $3=reason
  cat > "$STATE" << EOF
---
iteration: $1
maxIterations: $MAX
status: $2
lastUpdate: $(date '+%F %T')
reason: $3
---

Lihat $TASK untuk GOAL dan DONE criteria.
EOF
}
write_state 0 "starting" "-"
FAIL=0
i=1
while [ "$i" -le "$MAX" ]; do
  [ -f "$DONE_MARKER" ] && break
  write_state "$i" "running" "-"
  if [ "$i" -eq 1 ]; then
    PROMPT="$(cat "$TASK")"
  else
    PROMPT="[Iterasi $i/$MAX] Lanjutkan sesuai $TASK. Tulis $DONE_MARKER (isi reason) kalau DONE / budget habis / blocked. Jangan push."
  fi
  if [ "$i" -eq 1 ]; then
    opencode run --agent night-shift --title "night-shift [$i/$MAX]" "$PROMPT"
  else
    opencode run -c --agent night-shift --title "night-shift [$i/$MAX]" "$PROMPT"
  fi
  if [ $? -ne 0 ]; then
    FAIL=$((FAIL + 1))
    [ "$FAIL" -ge 3 ] && { echo "blocked: 3 run gagal beruntun" > "$DONE_MARKER"; break; }
  else
    FAIL=0
  fi
  i=$((i + 1))
done

REASON="$(cat "$DONE_MARKER" 2>/dev/null || echo "budget habis ($MAX run)")"
STATUS="done"; case "$REASON" in budget*) STATUS="budget";; blocked*) STATUS="blocked";; esac
write_state "$((i - 1))" "$STATUS" "$REASON"
command -v notify-send >/dev/null && notify-send "night-shift selesai" "$REASON" --app-name=opencode
echo "night-shift selesai setelah $((i - 1)) run: $REASON"
