#!/usr/bin/env bash
# install-antigravity-picks.sh — selective reinstall of ONLY the skills
# mapped in rules/03-antigravity-skills.md (not the full 1839-skill dump).
#
# Usage:
#   tools/install-antigravity-picks.sh [target-dir]
#   AX_TAG=v13.13.0 tools/install-antigravity-picks.sh   # pin upstream version
#
# How it works:
#   1. Extracts skill IDs from rules/03-antigravity-skills.md (backticked
#      kebab-case tokens, minus ax-* duplicates which must never be used).
#   2. Sparse-clones https://github.com/sickn33/antigravity-awesome-skills.git
#      (blobless) and checks out ONLY skills/<id> dirs.
#   3. Copies them into <target-dir> (default: skills-antigravity-awesome/).
#
# Reproducible: same picks in rules/03 → same set installed. Re-run after
# editing rules/03 to add/remove skills.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RULES_FILE="$REPO_ROOT/rules/03-antigravity-skills.md"
TARGET="${1:-$REPO_ROOT/skills-antigravity-awesome}"
UPSTREAM="https://github.com/sickn33/antigravity-awesome-skills.git"

[ -f "$RULES_FILE" ] || { echo "missing: $RULES_FILE" >&2; exit 1; }

# IDs = backticked kebab-case tokens, excluding ax-* duplicates.
mapfile -t PICKS < <(grep -o '`[a-z0-9][a-z0-9-]*`' "$RULES_FILE" | tr -d '`' \
  | grep -v '^ax-' | sort -u)
[ "${#PICKS[@]}" -gt 0 ] || { echo "no skill IDs found in $RULES_FILE" >&2; exit 1; }
echo "picks: ${#PICKS[@]} skills from rules/03-antigravity-skills.md"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CLONE_ARGS=(--filter=blob:none --sparse --depth 1)
[ -n "${AX_TAG:-}" ] && CLONE_ARGS+=(--branch "$AX_TAG")
git clone "${CLONE_ARGS[@]}" "$UPSTREAM" "$WORK/upstream" >&2 || exit 1

(
  cd "$WORK/upstream" || exit 1
  for id in "${PICKS[@]}"; do echo "skills/$id"; done | git sparse-checkout set --stdin
)

mkdir -p "$TARGET"
installed=0; missing=0
for id in "${PICKS[@]}"; do
  if [ -d "$WORK/upstream/skills/$id" ]; then
    rm -rf "$TARGET/$id"
    cp -r "$WORK/upstream/skills/$id" "$TARGET/$id"
    installed=$((installed + 1))
  else
    echo "upstream missing: $id" >&2
    missing=$((missing + 1))
  fi
done
echo "installed: $installed, missing upstream: $missing → $TARGET"
