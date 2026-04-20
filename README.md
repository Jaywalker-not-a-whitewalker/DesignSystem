# design-system

**An AI coding assistant skill.** Say `new project`, `create design system`, or `/design` in Claude Code, Codex, OpenCode, Cursor, Gemini CLI, GitHub Copilot CLI, Aider, Hermes, Trae, or Google Antigravity — it runs a guided onboarding flow, builds a complete `Design.md` for your project, and makes every agent auto-load your design system before writing any UI code.

One `skill.md`. One source of truth. All agents stay in sync.

```
Design.md                    ← generated per project
├── Color tokens             (light + dark mode, OKLCH-based)
├── Typography               (fluid clamp scale, display + body fonts)
├── Spacing                  (4px base, 8pt rhythm — strictly enforced)
├── Isolation rules          (surface shift, whitespace, divider, border, color fill)
├── Visual hierarchy rules   (one primary action, text levels, accent restraint)
├── Component vocabulary     (derived from app type — landing, SaaS, mobile, etc.)
└── Audit log                (violations appended automatically)
```

---

## How it works

On first use in a project, the skill runs a 6-step onboarding flow:

1. **Form factor** — Website / Mobile App / Wearable / Desktop
2. **App type** — Landing page, SaaS, e-commerce, social, productivity, etc. (drives all design decisions)
3. **Framework** — React/Next.js, Flutter, SwiftUI, Vanilla HTML, etc. (affects code output only)
4. **App identity** — Name, target user, and three vibe words (e.g. calm, minimal, focused)
5. **Visual reference** — URL, screenshot, or describe a vibe (optional but high value)
6. **Color direction** — Extracted from logo, chosen from AI-generated options, or provided manually

The skill then writes:
- `Design.md` — your complete design system
- `AGENTS.md` — always-on hook for Claude, Codex, OpenCode, Aider, Trae, Hermes
- `.agent/rules/design-system.md` — Google Antigravity always-on rules
- `.agent/workflows/design-system.md` — Google Antigravity `/design` slash command
- `.cursor/rules/design-system.mdc` — Cursor `alwaysApply: true`

Every future session in that project — regardless of which agent you use — automatically loads `Design.md` before writing any UI code.

---

## Install

**Requires:** One of: [Claude Code](https://claude.ai/code), [Codex](https://openai.com/codex), [OpenCode](https://opencode.ai/), [Cursor](https://cursor.com/), [Gemini CLI](https://github.com/google-gemini/gemini-cli), [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli), [Aider](https://aider.chat/), [Hermes](https://hermes.dev/), [Trae](https://trae.ai/), or [Google Antigravity](https://antigravity.google/)

### Option A — curl (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/Jaywalker-not-a-whitewalker/DesignSystem/main/install.sh | bash
```

### Option B — clone

```bash
git clone https://github.com/Jaywalker-not-a-whitewalker/DesignSystem.git
cd DesignSystem
chmod +x install.sh
./install.sh
```

### Platform support

| Platform | Skill location after install |
|---|---|
| Claude Code | `~/.claude/skills/design-system/skill.md` |
| Codex | `~/.codex/skills/design-system/skill.md` |
| OpenCode | `~/.opencode/skills/design-system/skill.md` |
| Gemini CLI | `~/.gemini/skills/design-system/SKILL.md` |
| GitHub Copilot CLI | `~/.copilot/skills/design-system/skill.md` |
| Hermes | `~/.hermes/skills/design-system/skill.md` |
| Google Antigravity | `~/.config/antigravity/rules/design-system.md` (global) + `.agent/` per project |
| Aider, Trae, OpenClaw, Droid | `AGENTS.md` per project (written on first use) |
| Cursor | `.cursor/rules/design-system.mdc` per project (written on first use) |

All global installs are **symlinks** — update `skill.md` once and every agent picks it up automatically.

---

## Usage

```bash
cd your-project

# Trigger the onboarding flow
new project
# or
create design system
# or
/design
```

The skill checks if `Design.md` already exists. If it does, it loads silently and proceeds. If not, it runs the 6-step flow.

```bash
# After Design.md exists — just build
build the homepage
build the dashboard
show me the component library

# Audit existing code
audit my UI
check src/components/Card.tsx
```

---

## What the audit looks like

```
DESIGN AUDIT — Card.tsx
----------------------------------------
PASSES     (9)
  Spacing: all values on 8pt grid
  Typography: heading matches Level 2 spec
  Contrast: 7.1:1 on --color-surface

WARNINGS   (2)
  line 47:  padding: 12px — use 8px or 16px
  line 89:  font-size: 15px — use 14px or 16px

VIOLATIONS (2)
  line 23:  #e5e5e5 on #f0f0f0 — contrast 1.3:1 (FAIL WCAG AA)
  line 67:  margin-top: 37px — not on 8pt grid

AUTO-FIX? [y/n]
```

---

## Design rules enforced

**Spacing** — Every margin, padding, and gap must land on the 8pt grid (8, 16, 24, 32...). No arbitrary pixel values.

**Section isolation** — Every section is isolated using exactly one of: surface shift, whitespace, divider, border, or color fill. Never stack two same-surface sections without separation.

**Visual hierarchy** — One primary action per view. Text flows through three levels: primary → muted → faint. Accent color used only for CTAs, active states, and links — never decoration.

**Contrast** — WCAG AA mandatory everywhere. Body text 4.5:1 minimum. Large text 3:1 minimum.

**Anti-patterns blocked** — Gradient backgrounds, colored card borders, 3-column identical feature grids, center-aligned body text, arbitrary spacing, generic AI hero copy.

---

## Per-project agent hook files

After `Design.md` is generated, the skill writes these automatically:

```
your-project/
├── Design.md                        ← your design system
├── AGENTS.md                        ← Claude, Codex, OpenCode, Aider, Trae, Hermes
├── .agent/
│   ├── rules/design-system.md       ← Antigravity always-on
│   └── workflows/design-system.md   ← Antigravity /design command
└── .cursor/
    └── rules/design-system.mdc      ← Cursor alwaysApply: true
```

Commit `Design.md` and the hook files to git — every teammate's agent loads the design system automatically.

---

## Uninstall

```bash
# Remove global symlinks
rm -f ~/.claude/skills/design-system/skill.md
rm -f ~/.codex/skills/design-system/skill.md
rm -f ~/.opencode/skills/design-system/skill.md
rm -f ~/.gemini/skills/design-system/SKILL.md
rm -f ~/.copilot/skills/design-system/skill.md
rm -f ~/.hermes/skills/design-system/skill.md
rm -f ~/.config/antigravity/rules/design-system.md

# Remove per-project hooks (run inside each project)
rm -f AGENTS.md
rm -f .agent/rules/design-system.md
rm -f .agent/workflows/design-system.md
rm -f .cursor/rules/design-system.mdc
```

---

## Repo structure

```
DesignSystem/
├── skill.md      ← the skill (one file, symlinked to all agents)
├── install.sh    ← installer
├── README.md     ← this file
├── CHANGELOG.md  ← version history
└── .gitignore
```

---

## License

MIT
