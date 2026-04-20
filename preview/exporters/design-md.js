// exporters/design-md.js

export function buildDesignMD(state) {
  const s = state;
  const cl = s.color.light;
  const cd = s.color.dark;
  const ty = s.typography;
  const sp = s.spacing;
  const ra = s.radius;
  const sh = s.shadow;
  return `# Design System — ${s.meta.appName}

## Project
Form Factor : ${s.meta.formFactor}
App Type    : ${s.meta.appType}
Framework   : ${s.meta.framework}
Target User : ${s.meta.targetUser}
Vibe        : ${s.meta.vibeWords}
Generated   : ${new Date().toISOString().split("T")[0]}

## Tone and Personality
Tone          : ${s.meta.tone}
Density       : ${s.meta.density}
Motion        : ${s.meta.motion}
Art Direction : ${s.meta.artDirection}

## Color Tokens

### Light Mode
--color-bg             : ${cl.bg}
--color-surface        : ${cl.surface}
--color-surface-2      : ${cl.surface2}
--color-surface-offset : ${cl.surfaceOffset}
--color-text           : ${cl.text}
--color-text-muted     : ${cl.textMuted}
--color-text-faint     : ${cl.textFaint}
--color-primary        : ${cl.primary}
--color-primary-hover  : ${cl.primaryHover}
--color-error          : ${cl.error}
--color-warning        : ${cl.warning}
--color-success        : ${cl.success}
--color-border         : oklch(from var(--color-text) l c h / 0.12)
--color-divider        : oklch(from var(--color-text) l c h / 0.07)

### Dark Mode
--color-bg             : ${cd.bg}
--color-surface        : ${cd.surface}
--color-surface-2      : ${cd.surface2}
--color-surface-offset : ${cd.surfaceOffset}
--color-text           : ${cd.text}
--color-text-muted     : ${cd.textMuted}
--color-text-faint     : ${cd.textFaint}
--color-primary        : ${cd.primary}
--color-primary-hover  : ${cd.primaryHover}
--color-error          : ${cd.error}
--color-warning        : ${cd.warning}
--color-success        : ${cd.success}

## Typography
--font-display : '${ty.fontDisplay}', sans-serif
--font-body    : '${ty.fontBody}', sans-serif
CDN            : ${ty.fontCDN}

### Type Scale
--text-xs   : ${ty.scale.xs}
--text-sm   : ${ty.scale.sm}
--text-base : ${ty.scale.base}
--text-lg   : ${ty.scale.lg}
--text-xl   : ${ty.scale.xl}
--text-2xl  : ${ty.scale["2xl"]}

## Spacing (4px base — 8pt rhythm)
--space-1  : ${sp.s1}
--space-2  : ${sp.s2}
--space-3  : ${sp.s3}
--space-4  : ${sp.s4}
--space-6  : ${sp.s6}
--space-8  : ${sp.s8}
--space-12 : ${sp.s12}
--space-16 : ${sp.s16}
--space-20 : ${sp.s20}
--space-24 : ${sp.s24}

## Border and Radius
--radius-sm   : ${ra.sm}
--radius-md   : ${ra.md}
--radius-lg   : ${ra.lg}
--radius-xl   : ${ra.xl}
--radius-full : 9999px

## Shadows
--shadow-sm : ${sh.sm}
--shadow-md : ${sh.md}
--shadow-lg : ${sh.lg}

## Pages and Screens Inventory
[ ] (add pages as you build)

## Audit Log
(violations appended automatically)
`;
}

export function exportDesignMD(state) {
  const content = buildDesignMD(state);
  import('./tokens-json.js').then(m => m.downloadFile('Design.md', content, 'text/markdown'));
}
