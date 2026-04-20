#!/bin/bash
# ============================================================
# design-system skill — installer
# Downloads skill.md from GitHub directly into each agent dir.
# Works correctly with: curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash
# ============================================================

set -e

RAW="https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main"
INSTALLED=()
FAILED=()

# ── helper: download to agent dir ───────────────────────────
install_skill() {
  local label="$1"
  local dest_dir="$2"
  local dest_file="$3"
  mkdir -p "$dest_dir"
  if curl -fsSL "$RAW/skill.md" -o "$dest_file" 2>/dev/null; then
    INSTALLED+=("$label  $dest_file")
  else
    FAILED+=("$label")
  fi
}

echo ""
echo "design-system — installing..."
echo ""

# ── Claude Code ──────────────────────────────────────────────
install_skill "Claude       "   "$HOME/.claude/skills/design-system"   "$HOME/.claude/skills/design-system/skill.md"

# ── Codex ────────────────────────────────────────────────────
install_skill "Codex        "   "$HOME/.codex/skills/design-system"   "$HOME/.codex/skills/design-system/skill.md"

# ── OpenCode ─────────────────────────────────────────────────
install_skill "OpenCode     "   "$HOME/.opencode/skills/design-system"   "$HOME/.opencode/skills/design-system/skill.md"

# ── Gemini CLI ───────────────────────────────────────────────
install_skill "Gemini CLI   "   "$HOME/.gemini/skills/design-system"   "$HOME/.gemini/skills/design-system/SKILL.md"

# ── GitHub Copilot CLI ───────────────────────────────────────
install_skill "Copilot CLI  "   "$HOME/.copilot/skills/design-system"   "$HOME/.copilot/skills/design-system/skill.md"

# ── Hermes ───────────────────────────────────────────────────
install_skill "Hermes       "   "$HOME/.hermes/skills/design-system"   "$HOME/.hermes/skills/design-system/skill.md"

# ── Google Antigravity ───────────────────────────────────────
# Global workflows path confirmed: ~/.gemini/antigravity/global_workflows/
install_skill "Antigravity  "   "$HOME/.gemini/antigravity/global_workflows"   "$HOME/.gemini/antigravity/global_workflows/design-system.md"

# ── Summary ─────────────────────────────────────────────────
echo "Installed:"
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
echo "To update the skill later — just re-run:"
echo "  curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash"
echo ""
echo "How to use:"
echo "  cd your-project"
echo "  Say:  new project"
echo "  Or:   create design system"
echo "  Or:   /design"
echo ""
