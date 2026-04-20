#!/bin/bash
# ============================================================
# design-system skill — installer
# Downloads skill.md from GitHub to a stable local path,
# then symlinks that one file to all supported agents.
# Works correctly with: curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash
# ============================================================

set -e

REPO_RAW="https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main"
INSTALL_HOME="$HOME/.design-system"
SKILL_FILE="$INSTALL_HOME/skill.md"
INSTALLED=()
FAILED=()

# ── helper: create dir + symlink ────────────────────────────
symlink() {
  local dest_dir="$1"
  local dest_file="$2"
  mkdir -p "$dest_dir"
  [ -e "$dest_file" ] || [ -L "$dest_file" ] && rm -f "$dest_file"
  ln -s "$SKILL_FILE" "$dest_file"
}

echo ""
echo "design-system — installing..."
echo ""

# ── 1. Download skill.md to stable location ─────────────────
mkdir -p "$INSTALL_HOME"
curl -fsSL "$REPO_RAW/skill.md" -o "$SKILL_FILE"

if [ ! -f "$SKILL_FILE" ]; then
  echo "Error: failed to download skill.md"
  exit 1
fi

echo "Downloaded skill.md -> $SKILL_FILE"
echo ""

# ── 2. Symlink to all agents ─────────────────────────────────

# Claude Code
D="$HOME/.claude/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Claude       $D/skill.md") \
  || FAILED+=("Claude")

# Codex
D="$HOME/.codex/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Codex        $D/skill.md") \
  || FAILED+=("Codex")

# OpenCode
D="$HOME/.opencode/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("OpenCode     $D/skill.md") \
  || FAILED+=("OpenCode")

# Gemini CLI
D="$HOME/.gemini/skills/design-system"
symlink "$D" "$D/SKILL.md" \
  && INSTALLED+=("Gemini CLI   $D/SKILL.md") \
  || FAILED+=("Gemini CLI")

# GitHub Copilot CLI
D="$HOME/.copilot/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Copilot CLI  $D/skill.md") \
  || FAILED+=("Copilot CLI")

# Hermes
D="$HOME/.hermes/skills/design-system"
symlink "$D" "$D/skill.md" \
  && INSTALLED+=("Hermes       $D/skill.md") \
  || FAILED+=("Hermes")

# Google Antigravity (global rules)
D="$HOME/.config/antigravity/rules"
symlink "$D" "$D/design-system.md" \
  && INSTALLED+=("Antigravity  $D/design-system.md  (+ .agent/ per project)") \
  || FAILED+=("Antigravity")

# ── 3. Summary ───────────────────────────────────────────────
echo "Installed (all symlinked -> $SKILL_FILE):"
for item in "${INSTALLED[@]}"; do
  echo "  ✓  $item"
done

echo ""
echo "Per-project only (written by the skill on first use):"
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
echo "To update the skill later:"
echo "  curl -fsSL $REPO_RAW/skill.md -o $SKILL_FILE"
echo "  (all agent symlinks update automatically)"
echo ""
echo "How to use:"
echo "  cd your-project"
echo "  Say:  new project"
echo "  Or:   create design system"
echo "  Or:   /design"
echo ""
