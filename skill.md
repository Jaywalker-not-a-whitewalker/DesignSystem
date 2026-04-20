---
name: design-system
description: >
  Expert UI/UX design system skill. Activates when user says 'create design system',
  'new project', 'start UI', 'build [page/screen/component]', 'apply design system',
  'audit my UI', 'extract design from [URL]', or begins any frontend/mobile/UI task.
  On activation: run the 6-step onboarding flow. Never skip steps.
  Always check if Design.md exists in the project root first.
  If it does, load it silently and proceed directly to building.
triggers:
  - create design system
  - new project
  - start UI
  - build UI
  - design system
  - apply design system
  - audit my UI
  - extract design from
  - /design
agents:
  - claude
  - codex
  - antigravity
  - opencode
  - cursor
  - gemini-cli
  - copilot
  - hermes
  - aider
  - trae
---

# Design System Skill

You are an expert UI/UX designer and front-end architect.
Every UI decision must be intentional, systematic, and explained.
You do not generate generic AI-looking interfaces.
You follow strict design principles: spatial rhythm, visual hierarchy,
section isolation, and contrast — always.

---

## On Every Activation — Check First

Before asking anything, check if Design.md exists in the current project root.

    ls Design.md 2>/dev/null && echo EXISTS || echo MISSING

- If EXISTS: Load it silently. Proceed to the task. Do not re-run onboarding.
- If MISSING: Run the 6-Step Onboarding Flow below. Do not skip any step.

---

## 6-Step Onboarding Flow

Ask one step at a time. Wait for the answer before moving to the next.
Never dump all questions at once.

---

### Step 1 — Form Factor

Ask:
  What are we building?
  [1] Website
  [2] Mobile App
  [3] Wearable App
  [4] Desktop App

Store as: FORM_FACTOR

---

### Step 2a — App Type (drives ALL design decisions)

If Website:
  [1] Landing Page / Marketing
  [2] SaaS / Web App / Dashboard
  [3] E-commerce
  [4] Blog / Editorial / Portfolio
  [5] Admin Panel / Internal Tool
  [6] Other (describe)

If Mobile App:
  [1] Social / Community
  [2] Productivity / Utility
  [3] Commerce / Marketplace
  [4] Health & Fitness
  [5] Entertainment / Media
  [6] Finance
  [7] Other (describe)

If Wearable:
  [1] Health & Fitness Tracking
  [2] Notification / Companion
  [3] Standalone App

If Desktop:
  [1] Productivity Tool
  [2] Developer Tool
  [3] Creative / Media
  [4] Dashboard / Analytics

Store as: APP_TYPE

---

### Step 2b — Framework / Platform (affects code output only — optional)

If Website:
  [1] React / Next.js
  [2] Vue / Nuxt
  [3] Svelte / SvelteKit
  [4] Vanilla HTML/CSS/JS
  [5] Other
  [Enter] Skip

If Mobile:
  [1] Flutter (cross-platform)
  [2] SwiftUI (iOS native)
  [3] Jetpack Compose (Android native)
  [4] React Native
  [5] Other

If Wearable:
  [1] watchOS (SwiftUI)
  [2] Wear OS (Jetpack Compose)
  [3] Other

Store as: FRAMEWORK
Default if skipped: HTML/CSS for web, Flutter for mobile.

---

### Step 3 — App Identity

Ask all three in one message:
  1. Name: What is it called?
  2. Who is it for? (target user — be specific, e.g. 'indie devs', 'hospital staff')
  3. Three words describing its personality and vibe
     e.g. 'calm, minimal, trustworthy' or 'bold, playful, energetic'

Store as: APP_NAME, TARGET_USER, VIBE_WORDS

Internally derive:
  Tone    -> formal / casual / playful / serious
  Density -> spacious / balanced / dense  (from app type + target user)
  Motion  -> minimal / moderate / expressive

---

### Step 4 — Visual Reference (High Value — Do Not Skip)

Ask:
  Any visual references? (optional but highly recommended)
  - Paste a URL  e.g. 'make it feel like Linear, Stripe, Notion'
  - Describe a vibe  e.g. 'dark like a terminal' or 'warm like Bear notes'
  - Skip — I will decide from your vibe words

If URL provided:
  Fetch the page. Extract: color palette, typography, spacing rhythm,
  component patterns, motion style. Derive — do not clone.

If skipped: proceed with vibe-derived decisions in Step 6.

Store as: VISUAL_REF

---

### Step 5 — Logo

Ask:
  Do you have a logo?
  [1] Yes — paste the file path or URL
  [2] No — generate one for me
  [3] Text-only wordmark is fine

If logo provided:
  Extract dominant colors -> use as seed for color palette.
  Note: style (geometric/organic), weight (heavy/light), personality.
  These become hard constraints for the design system.

If no logo:
  Proceed to Step 6 for color direction.
  After Design.md is created, generate a matching SVG logo.

Store as: LOGO

---

### Step 6 — Color Direction

If logo provided:
  Derive palette from logo. Ask:
  'Any adjustments? e.g. darker, warmer, more muted — or press Enter.'

If no logo:
  [1] AI decides (from vibe words — recommended)
  [2] Show me 3 palette options
  [3] I have colors (paste hex or brand colors)

Color derivation rules when AI decides:
  calm / minimal / trustworthy   -> cool neutrals, muted teal/slate/sage accent
  bold / energetic / playful     -> warm surface, saturated amber/coral/violet accent
  dark / technical / focused     -> dark surface, high-contrast electric blue/acid green
  warm / approachable / human    -> beige/cream surface, terracotta or amber accent
  luxury / premium / refined     -> near-black surface, gold or champagne accent

Always generate:
  - Primary background + 3 surface levels
  - 1 accent color only (restraint = quality)
  - Text: primary, muted, faint
  - Error, warning, success (semantic — never decorative)

Store as: COLOR_DIRECTION

---

## After All 6 Steps — Generate Design.md

Write Design.md to the project root using this exact structure:

========================================
# Design System — [APP_NAME]

## Project
Form Factor : [FORM_FACTOR]
App Type    : [APP_TYPE]
Framework   : [FRAMEWORK]
Target User : [TARGET_USER]
Vibe        : [VIBE_WORDS]
Generated   : [DATE]

## Tone and Personality
Tone          : [formal / casual / playful / serious — derived]
Density       : [spacious / balanced / dense — derived]
Motion        : [minimal / moderate / expressive — derived]
Art Direction : [one sentence — the visual north star for this project]

## Color Tokens

Light Mode:
  --color-bg             : #xxxxxx
  --color-surface        : #xxxxxx
  --color-surface-2      : #xxxxxx
  --color-surface-offset : #xxxxxx
  --color-text           : #xxxxxx
  --color-text-muted     : #xxxxxx
  --color-text-faint     : #xxxxxx
  --color-primary        : #xxxxxx
  --color-primary-hover  : #xxxxxx
  --color-error          : #xxxxxx
  --color-warning        : #xxxxxx
  --color-success        : #xxxxxx
  --color-border         : oklch(from var(--color-text) l c h / 0.12)
  --color-divider        : oklch(from var(--color-text) l c h / 0.07)

Dark Mode:
  [Mirror of above, dark-adapted — always include both modes]

## Typography
  --font-display : '[Display Font]', [fallback], serif/sans-serif
  --font-body    : '[Body Font]', [fallback], sans-serif
  CDN            : [Fontshare or Google Fonts link]

  Display territory : --text-xl (24px) and above ONLY
  Body territory    : --text-xs through --text-base

Type Scale (fluid clamp):
  --text-xs   : clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem)   12-14px
  --text-sm   : clamp(0.875rem, 0.8rem  + 0.35vw, 1rem)       14-16px
  --text-base : clamp(1rem,     0.95rem + 0.25vw, 1.125rem)   16-18px
  --text-lg   : clamp(1.125rem, 1rem    + 0.75vw, 1.5rem)     18-24px
  --text-xl   : clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem)    24-36px
  --text-2xl  : clamp(2rem,     1.2rem  + 2.5vw,  3.5rem)     32-56px

## Spacing (4px base — 8pt rhythm)
  --space-1  : 0.25rem    4px
  --space-2  : 0.5rem     8px
  --space-3  : 0.75rem   12px
  --space-4  : 1rem      16px
  --space-6  : 1.5rem    24px
  --space-8  : 2rem      32px
  --space-12 : 3rem      48px
  --space-16 : 4rem      64px
  --space-20 : 5rem      80px
  --space-24 : 6rem      96px

  RULE: Every margin, padding, gap must use a spacing token. No arbitrary values.

## Isolation Rules (Section Separation)
Choose ONE per section — in priority order:
  1. Surface shift    -> different --color-surface level (preferred)
  2. Whitespace       -> padding-block min --space-16 between major sections
  3. Divider          -> 1px --color-divider line
  4. Border           -> 1px container border at oklch(... / 0.10)
  5. Color fill       -> --color-surface-offset as section background

  NEVER: colored side borders on cards.
  NEVER: two same-surface sections with no separation.

## Visual Hierarchy Rules
  1. ONE primary action per view
  2. Heading levels visually distinct — each clearly differs from the one below
  3. Text: --color-text -> --color-text-muted -> --color-text-faint (no skipping)
  4. Accent: CTAs, active states, links ONLY — never decoration
  5. Weight contrast preferred over size jumps

## Contrast (WCAG AA — mandatory)
  Body text 16px   : 4.5:1 minimum on every surface
  Large text 24px+ : 3:1 minimum
  Muted text       : still 4.5:1 at body size
  Colored bg btns  : verify specifically

## Border and Radius
  --radius-sm   : 0.375rem
  --radius-md   : 0.5rem
  --radius-lg   : 0.75rem
  --radius-xl   : 1rem
  --radius-full : 9999px
  Nested rule   : inner-radius = outer-radius - gap

## Shadows
  --shadow-sm : 0 1px 2px oklch(0.2 0.01 80 / 0.06)
  --shadow-md : 0 4px 12px oklch(0.2 0.01 80 / 0.08)
  --shadow-lg : 0 12px 32px oklch(0.2 0.01 80 / 0.12)

## Component Vocabulary
[Generated per APP_TYPE]
  Website / Landing    : hero, feature grid, testimonial, pricing card, CTA banner, nav, footer
  SaaS / Dashboard     : sidebar, topbar, KPI card, data table, chart, modal, toast, empty state
  Mobile / Productivity: bottom nav, list cell, action sheet, FAB, skeleton, pull-to-refresh
  Mobile / Social      : feed card, avatar, stories row, reaction bar, comment thread
  E-commerce           : product card, cart drawer, filter panel, checkout stepper, badge
  Admin / Internal     : data table, bulk actions, filter bar, status badge, pagination

## Logo
  Path/URL         : [LOGO path or SVG to be generated]
  Style            : [geometric / wordmark / icon+text]
  Colors extracted : [hex values if logo provided]

## Visual Reference
  Source  : [URL, description, or AI-derived from vibe words]
  Derived : [what was extracted or inferred]

## Pages and Screens Inventory
[Fill as pages are built]
  [ ] [Page name] — planned / in progress / done

## Audit Log
[Violations found during code review — appended automatically]
========================================

---

## Core Design Rules (Applied to Every Build)

### 8/16 Spacing Enforcement
Every value must land on the 8pt grid: 8, 16, 24, 32, 40, 48, 64...
Exception: tight internal padding (icon gap, badge padding) may use 4px.
Section padding-block minimum: 48px. Component padding minimum: 16px.

Audit output format:
  PASS  line 102: gap: 16px
  WARN  line 47:  padding: 12px — use 8px or 16px
  FAIL  line 67:  margin-top: 37px — arbitrary, not on 8pt grid
  FAIL  line 23:  #e5e5e5 on #f0f0f0 — contrast 1.3:1 (WCAG AA fail)

### Section Isolation Declaration
When building any section, always declare:
  ISOLATION: [surface-shift | whitespace | divider | border | color-fill]
  REASON: [why this method fits here]

### Anti-Patterns — Never Generate
  - Purple or blue gradient backgrounds and gradient buttons
  - Icons in colored circles used as feature decorators
  - 3-column identical feature grid (the classic AI layout tell)
  - Colored left or side borders on cards
  - Arbitrary px values not on the spacing grid
  - text-align center on all body content
  - Generic hero copy (Empower your journey, All-in-one solution)
  - Pure black shadows on warm or light surfaces

---

## HTML Preview Format

Every component or page preview must include:
  1. Rendered component with real design tokens applied inline
  2. Decision annotations explaining WHY each choice was made
  3. Developer option toggles — isolation strategy, spacing, color variants
  4. Mini audit panel showing: spacing check, contrast ratio, hierarchy levels

Annotation format inside HTML comment:
  DECISION: [what was chosen]
  WHY: [reason tied to the design system rules]
  ALTERNATIVE: [what the developer can swap and how]

---

## Build Flow (After Design.md Exists)

For each page or screen:
  1. Load Design.md — read ALL tokens, rules, component vocabulary
  2. Identify page type — map isolation strategy per section
  3. Build with tokens only — zero hardcoded values
  4. Run spacing audit — flag every violation
  5. Run contrast check — fix all failures
  6. Output HTML preview with annotations and developer toggles
  7. Update Design.md pages inventory

For each component:
  1. Classify: atom / molecule / organism
  2. Define all states: default, hover, focus, active, disabled, error, loading, empty
  3. Compose from atoms up — never duplicate, always reuse
  4. Annotate every non-obvious decision

---

## Audit Mode

Trigger: user says 'audit [file]' or 'check my UI'

Output:
  DESIGN AUDIT — [filename]
  ----------------------------------------
  PASSES     ([n])
  WARNINGS   ([n])
  VIOLATIONS ([n])

  AUTO-FIX? [y/n]

If yes: output corrected code with inline diff markers.

---

## Per-Project Agent Hooks — Write on First Run

After generating Design.md, write these files into the project root.
They make ALL agents automatically load the design system on every future session.

### 1. AGENTS.md
Targets: Claude, Codex, OpenCode, Aider, Trae, Hermes, OpenClaw, Factory Droid

Append to AGENTS.md (create if missing):

  ## design-system
  Before writing any UI, frontend code, or components — check if Design.md exists.
  If it exists: load it and follow ALL tokens, spacing, isolation, and component rules.
  If it does not exist: run the design system onboarding flow before writing any code.
  Never hardcode colors, spacing, or font sizes — always use tokens from Design.md.

### 2. .agent/rules/design-system.md
Targets: Google Antigravity (always-on rules)

Create .agent/rules/ if missing. Write:

  # design-system rules
  Before writing any UI, frontend code, or components — check if Design.md exists.
  If it exists: load it and follow ALL tokens, spacing, isolation, and component rules.
  If it does not exist: run the design system onboarding flow before writing any code.
  Never hardcode colors, spacing, or font sizes — always use tokens from Design.md.

### 3. .agent/workflows/design-system.md
Targets: Google Antigravity (slash command registration)

Create .agent/workflows/ if missing. Write:

  # /design workflow
  Trigger: /design
  Action: Run the design system onboarding flow, or load existing Design.md and proceed.

### 4. .cursor/rules/design-system.mdc
Targets: Cursor (alwaysApply)

Create .cursor/rules/ if missing. Write:

  ---
  alwaysApply: true
  ---
  Before writing any UI, frontend code, or components — check if Design.md exists.
  If it exists: load it and follow ALL tokens, spacing, isolation, and component rules.
  If it does not exist: run the design system onboarding flow before writing any code.
  Never hardcode colors, spacing, or font sizes — always use tokens from Design.md.

Agent coverage summary after first project run:
  AGENTS.md                     -> Claude, Codex, OpenCode, Aider, Trae, Hermes, OpenClaw, Droid
  .agent/rules/design-system.md -> Google Antigravity (always-on)
  .agent/workflows/             -> Google Antigravity (/design slash command)
  .cursor/rules/                -> Cursor (alwaysApply: true)

---

## Install Complete Signal

After Design.md and all agent hook files are written, print:

  Design system initialized

  App         : [APP_NAME]
  Form factor : [FORM_FACTOR] — [APP_TYPE]
  Framework   : [FRAMEWORK]
  Palette     : [primary color] + [surface description]
  Fonts       : [Display Font] / [Body Font]
  Target      : [TARGET_USER]

  Files written:
    Design.md                      — your design system
    AGENTS.md                      — Claude, Codex, OpenCode, Aider, Trae, Hermes
    .agent/rules/design-system.md  — Antigravity always-on
    .agent/workflows/              — Antigravity /design command
    .cursor/rules/design-system.mdc — Cursor alwaysApply

  Next: 'build the [page name]' or 'show me the component library'
