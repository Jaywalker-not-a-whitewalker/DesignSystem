---
name: design-system
description: "Generates production-ready design systems with tokens-first architecture, atomic components, and HTML preview for websites, mobile apps, and wearables. Runs 6-step onboarding (form factor, app type, framework, identity, visual reference, color direction) and produces design-tokens.json, Design.md, and preview.html."
risk: safe
date_added: "2026-04-20"
---

# SKILL.md — Design System Generator

## Skill Identity
- **Name:** Design System Generator
- **Version:** 2.0
- **Purpose:** Guide a developer through structured onboarding to produce a production-ready design system — including design tokens, component hierarchy, and HTML preview — for any platform or form factor.
- **Core Philosophy:**
  - Tokens-first: `design-tokens.json` is the single source of truth
  - Atomic composition: atoms → molecules → organisms, no duplication
  - Reasoning transparency: every design decision is explained with alternatives shown

---

## Phase 0 — Onboarding Flow (Structured Intake)

The skill MUST complete all 6 steps before generating any output. Ask steps sequentially. Never skip or combine steps unless the user has already provided the answer.

**CRITICAL: The Example Session at the bottom is for illustration only. NEVER use those example values (Flutter, matrimony app, etc.) as defaults. ALWAYS collect real answers from the current user through Phase 0 before generating anything.**

---

### Step 1 — Form Factor

> "What are you building?"

Options:
- **Website**
- **Mobile App**
- **Wearable**
- **Desktop App**

→ Gate all downstream questions based on this answer.

---

### Step 2a — App Type (drives design rules)

Ask based on form factor selected:

**If Website:**
> "What type of website is it?"
- Landing Page
- SaaS Dashboard
- E-commerce
- Blog / Content
- Portfolio
- Admin Panel / Internal Tool
- Other (describe)

**If Mobile App:**
> "What category is the app?"
- Social / Community
- Productivity / Tools
- Commerce / Marketplace
- Utility / Service
- Health & Fitness
- Entertainment / Media
- Other (describe)

**If Wearable:**
> "What is the wearable's primary focus?"
- Health Monitoring
- Notifications / Companion
- Standalone App

**If Desktop:**
> "What type of desktop app?"
- Creative Tool
- Developer Tool
- Business / Enterprise
- Utility

→ This answer drives: spacing density, navigation patterns, component vocabulary, and content hierarchy rules.

---

### Step 2b — Framework / Platform *(optional, drives code output)*

Ask based on form factor:

**If Website:**
> "Which framework are you using? (skip if unsure)"
- React / Next.js
- Vue / Nuxt
- Svelte / SvelteKit
- Vanilla HTML + CSS
- Other

**If Mobile:**
> "What's your development stack?"
- Flutter (cross-platform)
- SwiftUI (iOS native)
- Jetpack Compose (Android native)
- React Native
- Other

**If Wearable:**
- WatchOS (SwiftUI)
- Wear OS (Jetpack Compose)
- Other

→ Framework affects: code output format only (Tailwind config vs. Flutter ThemeData vs. CSS variables). Design decisions remain framework-agnostic.

---

### Step 3 — App Identity (Structured, not free-text)

> "Tell me about your app — answer these three:"

1. **Who is it for?** *(target user — age, technical level, context of use)*
   > e.g., "Working professionals aged 25–40, using it on the go"

2. **What's the one core action?** *(the primary job the user comes to do)*
   > e.g., "Booking a matrimony consultation" or "Tracking daily shift attendance"

3. **3 words describing the vibe / personality**
   > e.g., "Warm, trustworthy, modern" or "Clean, fast, minimal"

→ These three answers drive: typography tone, color temperature, animation style, density, and accessibility requirements.

Also ask:
> "What is the app's name?"

---

### Step 4 — Visual References *(optional but high-value)*

> "Do you have any visual references? (any is fine)"

Options:
- **Logo file** — AI extracts primary/secondary colors and derives palette from it
- **Reference URL** — AI analyzes the site's visual language
- **"Feels like [App X]"** — AI maps known design language (e.g., "Like Linear" → sharp, dense, dark-mode-first)
- **Screenshot** — AI reads layout, colors, and typographic rhythm
- **None** — Skip to Step 5, AI generates from vibe words

→ This is the highest-leverage input. A reference URL or logo removes guesswork entirely.

---

### Step 5 — Color Direction

Determined by Step 4 output:

| Input Available | Action |
|---|---|
| Logo provided | Extract dominant + accent colors → derive 5-shade palette per color |
| Reference URL | Extract brand colors → propose adapted palette |
| Vibe words only | AI generates 3 palette options (light/dark/vibrant) for user to choose |
| User provides hex | Use directly → derive full token set from it |

For every palette proposed:
- Show 5 shades per color (50/100/300/500/700/900 naming)
- Show primary, secondary, neutral, semantic (success/warning/error/info)
- Explain the reasoning: why these colors match the vibe/audience

---

### Step 6 — Output Format

> "What do you need generated?"

- [ ] `design-tokens.json` (default — always included)
- [ ] `Design.md` — full design system documentation
- [ ] HTML Preview — interactive visual reference with developer options
- [ ] `tailwind.config.js` — Tailwind CSS token mapping
- [ ] Flutter `ThemeData` — Dart theme file
- [ ] Component scaffold — list of atoms/molecules/organisms with specs

Default if not answered: generate `design-tokens.json` + `Design.md` + HTML Preview.

---

## Phase 1 — Token Extraction & Generation

Once onboarding is complete, generate `design-tokens.json` as the **first output**. Everything else derives from this file.

### Token Categories (always include all):

```json
{
  "color": {
    "primary": { "50": "", "100": "", "300": "", "500": "", "700": "", "900": "" },
    "secondary": {},
    "neutral": {},
    "semantic": {
      "success": "", "warning": "", "error": "", "info": ""
    },
    "surface": { "background": "", "card": "", "overlay": "" }
  },
  "typography": {
    "fontFamily": { "display": "", "body": "", "mono": "" },
    "fontSize": { "xs": "", "sm": "", "base": "", "lg": "", "xl": "", "2xl": "", "3xl": "" },
    "fontWeight": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 },
    "lineHeight": { "tight": "", "normal": "", "relaxed": "" }
  },
  "spacing": {
    "base": "8px",
    "scale": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px" }
  },
  "borderRadius": {
    "none": "0", "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px"
  },
  "shadow": {
    "sm": "", "md": "", "lg": "", "xl": ""
  },
  "motion": {
    "duration": { "fast": "100ms", "normal": "200ms", "slow": "400ms" },
    "easing": { "ease-in": "", "ease-out": "", "spring": "" }
  },
  "breakpoint": {
    "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px"
  }
}
```

**Reasoning rule:** For every token value set, include a brief inline comment explaining the design rationale.

---

## Phase 2 — Atomic Component Hierarchy

After tokens are defined, map out the component system using atomic design:

### Atoms (single-purpose, no children)
- Button (primary / secondary / ghost / destructive)
- Input (text / password / search)
- Label
- Icon
- Badge
- Avatar
- Divider
- Spinner / Loader
- Tag / Chip

### Molecules (2–4 atoms combined)
- Input Group (label + input + helper text)
- Card Header (avatar + name + timestamp)
- Nav Item (icon + label + badge)
- Form Field (label + input + error)
- Alert (icon + message + dismiss)
- Stat Block (label + value + trend)

### Organisms (sections with business logic)
- Navigation Bar
- Hero Section
- Feature Grid
- Pricing Table
- Form (multi-field)
- Data Table
- Modal / Bottom Sheet
- Dashboard Panel

### Rules:
- Organisms may only contain molecules and atoms, never other organisms
- Molecules may only contain atoms
- Each component must reference token values only — no hardcoded values allowed

---

## Phase 3 — Design.md Generation

Structure of the generated `Design.md`:

```
# [App Name] Design System

## Overview
- Form factor, app type, target user, core action, personality

## Design Tokens
- Link to design-tokens.json
- Visual token reference table

## Color System
- Palette swatches with hex values
- Usage rules (when to use primary vs secondary vs neutral)
- Dark mode variants (if applicable)

## Typography
- Font choices + rationale
- Type scale with usage context
- Heading hierarchy rules

## Spacing System
- 8pt grid explanation
- Spacing scale reference
- When to use which spacing value

## Component Library
- Atoms: specs, states, token references
- Molecules: composition rules
- Organisms: layout and behavior

## Navigation Patterns
- Based on form factor + app type
- e.g., Bottom nav for mobile social vs. sidebar for SaaS dashboard

## Accessibility Notes
- Color contrast ratios (WCAG AA minimum)
- Touch target sizes (mobile: 44x44pt minimum)
- Focus states

## Platform-Specific Rules
- (Generated based on Step 2b framework choice)
```

---

## Phase 4 — HTML Preview Generation

**How to generate the HTML preview:**

The preview system uses a template-based approach. Follow these exact steps:

### Step 1: Read the template

Read the file from `~/.design-system/preview/index.html`. This template contains:
- `<!--TOKENS_SCRIPT-->` — placeholder for injecting the DESIGN_TOKENS JavaScript object
- `<!--APP_NAME-->` — placeholder for the app name
- Pre-wired UI with `app.js`, `style.css`, and all interactive components already built

### Step 2: Build the DESIGN_TOKENS object

Create a JavaScript object containing all the design tokens you generated in Phase 1:

```javascript
const DESIGN_TOKENS = {
  meta: {
    appName: "...",
    formFactor: "...",
    appType: "...",
    framework: "...",
    targetUser: "...",
    coreAction: "...",
    vibeWords: "..."
  },
  color: {
    light: {
bg: "#...",
        surface: "#...",
        surface2: "#...",
        surfaceOffset: "#...",
        text: "#...",
        textMuted: "#...",
        textFaint: "#...",
        primary: "#...",
        primaryHover: "#...",
        error: "#...",
        warning: "#...",
        success: "#..."
    dark: {
bg: "#...",
        surface: "#...",
        surface2: "#...",
        surfaceOffset: "#...",
        text: "#...",
        textMuted: "#...",
        textFaint: "#...",
        primary: "#...",
        primaryHover: "#...",
        error: "#...",
        warning: "#...",
        success: "#..."
      }
  },
  typography: {
    fontDisplay: "...",
      fontBody: "...",
      fontCDN: "...",
      scale: { xs: "...", sm: "...", base: "...", lg: "...", xl: "...", "2xl": "..." }
    },
    spacing: {
      s1: "0.25rem", s2: "0.5rem", s3: "0.75rem", s4: "1rem",
      s6: "1.5rem", s8: "2rem", s12: "3rem", s16: "4rem",
      s20: "5rem", s24: "6rem"
    },
    radius: {
      sm: "0.375rem", md: "0.5rem", lg: "0.75rem", xl: "1rem"
    },
    shadow: {
      sm: "...", md: "...", lg: "..."
    }
  }
};
```

### Step 3: Inject tokens into template

Replace the placeholders in the template:

1. Replace `<!--TOKENS_SCRIPT-->` with:
   ```html
   <script>
   const DESIGN_TOKENS = { /* full object from Step 2 */ };
   </script>
   ```

2. Replace `<!--APP_NAME-->` with the actual app name from `DESIGN_TOKENS.meta.appName`

### Step 4: Write the preview file

Write the modified HTML to `preview.html` in the **project root directory** (not in ~/.design-system/).

**IMPORTANT HTML GENERATION RULES:**
1. You may completely rewrite the content inside `<div class="device-screen">` to match the user's specific app domain (e.g., adding mock graphs, tables, or specialized UI that fits their vibe).
2. **DO NOT DELETE, SUMMARIZE, OR TRUNCATE** the `<aside id="panel-tokens">` (left side) and `<aside id="panel-audit">` (right side) elements. You must copy every single color picker row and button exactly as it appears in the original template. Do not omit `warning`, `error`, `surface2`, or any other color attributes.

### Step 5: Inform the user

Tell the user:
```
Preview generated: preview.html

To view the interactive design dashboard, run the local preview server:
  node ~/.design-system/preview/server.js --project .
  
Then open: http://localhost:7743
```

**IMPORTANT:** Do not try to generate the preview from scratch. The template already has all the UI, styling, contrast checking, and export logic built-in. Your only job is to inject the DESIGN_TOKENS object.

### Reasoning Transparency in HTML:
Every section must include an expandable `<!-- WHY -->` comment or on-page tooltip explaining:
- Why this spacing value was chosen
- Why this font pairing was selected
- Why this color contrast meets accessibility standards

---

## Phase 5 — Audit & Update

When the user provides updates (new brand color, changed app name, new component), the skill must:

1. Update `design-tokens.json` first
2. Cascade changes to `Design.md`
3. Regenerate affected HTML preview sections
4. Report what changed and why in a diff summary

---

## Skill Behavior Rules

1. **Never hardcode values** — always derive from tokens
2. **Always explain reasoning** — every design choice must have a stated rationale
3. **Ask, don't assume** — if a step's answer is ambiguous, ask a clarifying question before proceeding
4. **Fail gracefully** — if logo/URL cannot be parsed, fall back to vibe-word palette generation
5. **Token-first always** — if a user requests a component before tokens are defined, pause and complete token generation first
6. **Show options** — for subjective decisions (color palette, typography), always show 2–3 options with trade-offs explained

---

## Example Session

```
User: I want to build a matrimony app for the Indian community.

Skill:
Step 1 → Form Factor: Mobile App
Step 2a → App Type: Social / Community
Step 2b → Stack: Flutter (cross-platform)
Step 3 →
  - Who is it for? Indian families + individuals aged 22-40, browsing on mobile
  - Core action: Browse and connect with compatible matches
  - Vibe: Warm, trustworthy, celebratory
Step 4 → No logo yet — reference: "feels like Shaadi.com but more modern and minimal"
Step 5 → AI generating 3 palette options based on vibe...
Step 6 → Output: design-tokens.json + Design.md + Flutter ThemeData + HTML Preview

→ Generating design-tokens.json...
→ Primary color rationale: Deep rose-gold (#C0717A) — warm, celebratory, culturally
   resonant for Indian wedding context.
→ Neutral: warm off-white (#FAF6F1) — avoids clinical white, feels premium.
```

---

*Skill version 2.0 — rebuilt with tokens-first architecture, atomic composition hierarchy, and reasoning transparency.*
