// exporters/css.js

export function buildCSS(state) {
  const cl = state.color.light;
  const cd = state.color.dark;
  const ty = state.typography;
  const sp = state.spacing;
  const ra = state.radius;
  const sh = state.shadow;
  return `/* Design System — ${state.meta.appName} */
@import url('${ty.fontCDN}');
:root {
  --color-bg:             ${cl.bg};
  --color-surface:        ${cl.surface};
  --color-surface-2:      ${cl.surface2};
  --color-surface-offset: ${cl.surfaceOffset};
  --color-text:           ${cl.text};
  --color-text-muted:     ${cl.textMuted};
  --color-text-faint:     ${cl.textFaint};
  --color-primary:        ${cl.primary};
  --color-primary-hover:  ${cl.primaryHover};
  --color-error:          ${cl.error};
  --color-warning:        ${cl.warning};
  --color-success:        ${cl.success};
  --color-border:         oklch(from var(--color-text) l c h / 0.12);
  --color-divider:        oklch(from var(--color-text) l c h / 0.07);
  --font-display: '${ty.fontDisplay}', sans-serif;
  --font-body:    '${ty.fontBody}', sans-serif;
  --text-xs:   ${ty.scale.xs};
  --text-sm:   ${ty.scale.sm};
  --text-base: ${ty.scale.base};
  --text-lg:   ${ty.scale.lg};
  --text-xl:   ${ty.scale.xl};
  --text-2xl:  ${ty.scale["2xl"]};
  --space-1:  ${sp.s1}; --space-2:  ${sp.s2}; --space-3:  ${sp.s3};
  --space-4:  ${sp.s4}; --space-6:  ${sp.s6}; --space-8:  ${sp.s8};
  --space-12: ${sp.s12}; --space-16: ${sp.s16};
  --space-20: ${sp.s20}; --space-24: ${sp.s24};
  --radius-sm: ${ra.sm}; --radius-md: ${ra.md};
  --radius-lg: ${ra.lg}; --radius-xl: ${ra.xl}; --radius-full: 9999px;
  --shadow-sm: ${sh.sm}; --shadow-md: ${sh.md}; --shadow-lg: ${sh.lg};
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:             ${cd.bg};
    --color-surface:        ${cd.surface};
    --color-surface-2:      ${cd.surface2};
    --color-surface-offset: ${cd.surfaceOffset};
    --color-text:           ${cd.text};
    --color-text-muted:     ${cd.textMuted};
    --color-text-faint:     ${cd.textFaint};
    --color-primary:        ${cd.primary};
    --color-primary-hover:  ${cd.primaryHover};
    --color-error:          ${cd.error};
    --color-warning:        ${cd.warning};
    --color-success:        ${cd.success};
  }
}`;
}

export function exportCSS(state) {
  import('./tokens-json.js').then(m =>
    m.downloadFile(`${state.meta.appName}-tokens.css`, buildCSS(state), 'text/css'));
}
