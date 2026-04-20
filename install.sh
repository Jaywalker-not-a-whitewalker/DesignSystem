#!/bin/bash
# ============================================================
# design-system skill — installer
# Downloads skill.md + full preview/ from GitHub.
# Works correctly with: curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash
# ============================================================

set -e

RAW="https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main"
DS_HOME="$HOME/.design-system"
PREVIEW_DIR="$DS_HOME/preview"
EXPORTERS_DIR="$PREVIEW_DIR/exporters"
INSTALLED=()
FAILED=()

echo ""
echo "design-system — installing..."
echo ""

# ── 1. Create dirs ───────────────────────────────────────────
mkdir -p "$DS_HOME" "$PREVIEW_DIR" "$EXPORTERS_DIR"

# ── 2. Download skill.md ─────────────────────────────────────
echo "Downloading skill..."
curl -fsSL "$RAW/skill.md" -o "$DS_HOME/skill.md"
echo "  ✓  skill.md -> $DS_HOME/skill.md"

# ── 3. Download preview files ────────────────────────────────
echo ""
echo "Downloading preview..."

download_preview() {
  local src="$1" dest="$2"
  if curl -fsSL "$RAW/$src" -o "$dest" 2>/dev/null; then
    echo "  ✓  $(basename $dest)"
  else
    echo "  x  $(basename $dest) (failed)"
  fi
}

download_preview "preview/index.html"              "$PREVIEW_DIR/index.html"
download_preview "preview/app.js"                  "$PREVIEW_DIR/app.js"
download_preview "preview/style.css"               "$PREVIEW_DIR/style.css"
download_preview "preview/server.js"               "$PREVIEW_DIR/server.js"
download_preview "preview/exporters/design-md.js"  "$EXPORTERS_DIR/design-md.js"
download_preview "preview/exporters/tokens-json.js" "$EXPORTERS_DIR/tokens-json.js"
download_preview "preview/exporters/css.js"        "$EXPORTERS_DIR/css.js"
download_preview "preview/exporters/tailwind.js"   "$EXPORTERS_DIR/tailwind.js"
download_preview "preview/exporters/flutter.js"    "$EXPORTERS_DIR/flutter.js"

# ── 4. Install to all agents ─────────────────────────────────
install_agent() {
  local label="$1" dir="$2" file="$3"
  mkdir -p "$dir"
  if curl -fsSL "$RAW/skill.md" -o "$file" 2>/dev/null; then
    INSTALLED+=("$label  $file")
  else
    FAILED+=("$label")
  fi
}

echo ""
echo "Installing to agents..."
install_agent "Claude       " "$HOME/.claude/skills/design-system"           "$HOME/.claude/skills/design-system/skill.md"
install_agent "Codex        " "$HOME/.codex/skills/design-system"            "$HOME/.codex/skills/design-system/skill.md"
install_agent "OpenCode     " "$HOME/.opencode/skills/design-system"         "$HOME/.opencode/skills/design-system/skill.md"
install_agent "Gemini CLI   " "$HOME/.gemini/skills/design-system"           "$HOME/.gemini/skills/design-system/SKILL.md"
install_agent "Copilot CLI  " "$HOME/.copilot/skills/design-system"          "$HOME/.copilot/skills/design-system/skill.md"
install_agent "Hermes       " "$HOME/.hermes/skills/design-system"           "$HOME/.hermes/skills/design-system/skill.md"
install_agent "Antigravity  " "$HOME/.gemini/antigravity/global_workflows"   "$HOME/.gemini/antigravity/global_workflows/design-system.md"

# ── 5. Summary ───────────────────────────────────────────────
echo ""
echo "Agents installed:"
for item in "${INSTALLED[@]}"; do echo "  ✓  $item"; done

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "Failed:"
  for item in "${FAILED[@]}"; do echo "  x  $item"; done
fi

echo ""
echo "Per-project hooks (written by skill on first use):"
echo "  ->  AGENTS.md"
echo "  ->  .agent/rules/design-system.md"
echo "  ->  .agent/workflows/design-system.md"
echo "  ->  .cursor/rules/design-system.mdc"
echo ""
echo "Preview ready at: $PREVIEW_DIR"
echo ""
echo "To update everything later — just re-run:"
echo "  curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash"
echo ""
echo "How to use:"
echo "  cd your-project"
echo "  Say: new project  (or: create design system  or: /design)"
echo ""
echo "To open the live preview:"
echo "  node ~/.design-system/preview/server.js --project ."
echo "  → http://localhost:7743"
echo ""
