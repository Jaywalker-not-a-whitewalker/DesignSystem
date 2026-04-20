#!/bin/bash
# ============================================================
# design-system skill — installer
# One skill.md, symlinked to all supported agents globally.
# Per-project hooks (AGENTS.md, .agent/, .cursor/) are written
# automatically by the skill on first use in each project.
#
# Targets: Claude, Codex, OpenCode, Gemini CLI, Copilot CLI,
#          Hermes, Google Antigravity, Aider, Trae, Cursor
# ============================================================

set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_FILE="$SKILL_DIR/skill.md"
INSTALLED=()
FAILED=()

# ── helper ──────────────────────────────────────────────────
symlink() {
  local dest_dir="$1"
  local dest_file="$2"
  mkdir -p "$dest_dir"
  # Remove existing link or file at destination
  [ -e "$dest_file" ] || [ -L "$dest_file" ] && rm -f "$dest_file"
  ln -s "$SKILL_FILE" "$dest_file"
}

echo ""
echo "design-system — installing..."
echo ""

# ── Claude Code ─────────────────────────────────────────────
# Reads from: ~/.claude/skills/<name>/skill.md
D="$HOME/.claude/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Claude      $D/skill.md") \
  || FAILED+=("Claude")

# ── Codex ────────────────────────────────────────────────────
# Reads from: ~/.codex/skills/<name>/skill.md
D="$HOME/.codex/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Codex       $D/skill.md") \
  || FAILED+=("Codex")

# ── OpenCode ─────────────────────────────────────────────────
# Reads from: ~/.opencode/skills/<name>/skill.md
D="$HOME/.opencode/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("OpenCode    $D/skill.md") \
  || FAILED+=("OpenCode")

# ── Gemini CLI ───────────────────────────────────────────────
# Reads from: ~/.gemini/skills/<name>/SKILL.md
D="$HOME/.gemini/skills/design-system"
symlink "$D" "$D/SKILL.md" \
  && INSTALLED+=("Gemini CLI  $D/SKILL.md") \
  || FAILED+=("Gemini CLI")

# ── GitHub Copilot CLI ───────────────────────────────────────
# Reads from: ~/.copilot/skills/<name>/skill.md
D="$HOME/.copilot/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Copilot CLI $D/skill.md") \
  || FAILED+=("Copilot CLI")

# ── Hermes ───────────────────────────────────────────────────
D="$HOME/.hermes/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Hermes      $D/skill.md") \
  || FAILED+=("Hermes")

# ── Google Antigravity ───────────────────────────────────────
# Global rules: ~/.config/antigravity/rules/<name>.md
# Per-project:  .agent/rules/ + .agent/workflows/  (written by skill on first use)
D="$HOME/.config/antigravity/rules"
symlink "$D" "$D/design-system.md" \
  && INSTALLED+=("Antigravity $D/design-system.md  (+ .agent/ per project)") \
  || FAILED+=("Antigravity")

# ── Aider / Trae / OpenClaw / Factory Droid ──────────────────
# These rely on AGENTS.md only — written per project by the skill.
# No global skill directory for these agents.

# ── Cursor ───────────────────────────────────────────────────
# Per-project .cursor/rules/design-system.mdc — written by skill on first use.
# No global skill directory for Cursor.

# ── Summary ─────────────────────────────────────────────────
echo "Installed (all symlinked -> $SKILL_FILE):"
for item in "${INSTALLED[@]}"; do
  echo "  ✓  $item"
done

echo ""
echo "Per-project only (written by the skill on first use in each project):"
echo "  ->  AGENTS.md                       Claude, Codex, OpenCode, Aider, Trae, Hermes"
echo "  ->  .agent/rules/design-system.md   Antigravity always-on rules"
echo "  ->  .agent/workflows/               Antigravity /design slash command"
echo "  ->  .cursor/rules/design-system.mdc Cursor alwaysApply"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "Failed:"
  for item in "${FAILED[@]}"; do
    echo "  x  $item"
  done
fi

echo ""
echo "Update the skill at any time — all agents pick it up automatically."
echo ""
echo "How to use:"
echo "  cd your-project"
echo "  Say:  new project"
echo "  Or:   create design system"
echo "  Or:   /design"
echo ""
echo "The skill will:"
echo "  1. Run the 6-step onboarding flow"
echo "  2. Write Design.md to your project root"
echo "  3. Write per-agent hook files so all agents auto-load the system"
echo ""
