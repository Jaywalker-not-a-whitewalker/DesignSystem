# Changelog

## v2.0.0 — 2026-04-20

### Changed
- Rebuilt `skill.md` from scratch as v2.0 — complete structural overhaul
- Onboarding flow reordered: App Type (Step 2a) now comes before Framework (Step 2b) so design rules are driven by what the app does, not how it's built
- Step 3 (App Identity) now structured into 3 explicit fields: target user, core action, and 3 vibe words — replaces vague free-text description

### Added
- Tokens-first architecture: `design-tokens.json` is now the canonical source of truth — all components and docs derive from it
- Atomic component hierarchy: atoms → molecules → organisms with strict composition rules (no hardcoding, no cross-level contamination)
- Reasoning transparency: every design decision must include a rationale; HTML previews include `<!-- WHY -->` annotations
- Step 4 (Visual References): URL, logo, screenshot, or "feels like [App X]" — highest-leverage design input
- Step 6 (Output Format): developer can now choose which artifacts to generate (design-tokens.json, Design.md, HTML Preview, Tailwind config, Flutter ThemeData, component scaffold)
- Desktop App added as a form factor option
- Wearable sub-categories: Health Monitoring, Notifications/Companion, Standalone App
- Full token schema: color, typography, spacing, border-radius, shadow, motion, breakpoints
- Phase 5 (Audit & Update): cascading update flow — tokens first, then docs, then preview, then diff summary
- Skill Behavior Rules section: 6 explicit rules governing how the skill must behave
- Example session using matrimony app as reference walkthrough

## v1.0.0 — 2026-04-20

### Added
- 6-step onboarding flow: form factor, app type, framework, identity, visual reference, color direction
- `Design.md` generation with full design token set (colors, typography, spacing, radius, shadows)
- 8pt spacing grid enforcement with audit output
- Section isolation rules: surface shift, whitespace, divider, border, color fill
- Visual hierarchy and WCAG AA contrast enforcement
- HTML preview format with decision annotations and developer toggles
- Audit mode with auto-fix
- Per-project agent hooks: `AGENTS.md`, `.agent/rules/`, `.agent/workflows/`, `.cursor/rules/`
- Global symlink installer targeting Claude Code, Codex, OpenCode, Gemini CLI, Copilot CLI, Hermes, Antigravity
