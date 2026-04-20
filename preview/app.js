// app.js — token state, live preview binding, contrast checker, disk writes

import { exportTokensJSON, downloadFile } from './exporters/tokens-json.js';
import { exportDesignMD }   from './exporters/design-md.js';
import { exportCSS }        from './exporters/css.js';
import { exportTailwind }   from './exporters/tailwind.js';
import { exportFlutter }    from './exporters/flutter.js';

// ── Default state (replaced by skill-injected DESIGN_TOKENS) ─
const DEFAULT_STATE = {
  meta: {
    appName: 'My App', formFactor: 'Mobile App', appType: 'Productivity',
    framework: 'Flutter', targetUser: 'General users',
    vibeWords: 'calm, minimal, focused', tone: 'casual',
    density: 'balanced', motion: 'minimal',
    artDirection: 'Clean and purposeful — every element earns its place.'
  },
  color: {
    light: {
      bg: '#F8F9FA', surface: '#FFFFFF', surface2: '#F1F3F5',
      surfaceOffset: '#E9ECEF', text: '#212529', textMuted: '#6C757D',
      textFaint: '#ADB5BD', primary: '#2F80ED', primaryHover: '#1A6FD6',
      error: '#E03131', warning: '#F08C00', success: '#2F9E44',
    },
    dark: {
      bg: '#0D1117', surface: '#161B22', surface2: '#1C2128',
      surfaceOffset: '#21262D', text: '#E6EDF3', textMuted: '#8B949E',
      textFaint: '#484F58', primary: '#4493F8', primaryHover: '#388BFD',
      error: '#F85149', warning: '#D29922', success: '#3FB950',
    }
  },
  typography: {
    fontDisplay: 'Satoshi', fontBody: 'Inter',
    fontCDN: 'https://api.fontshare.com/v2/css?f[]=satoshi@700,500&f[]=inter@400,500&display=swap',
    scale: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)',
      base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1rem + 0.75vw, 1.5rem)',
      xl: 'clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem)',
      '2xl': 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)'
    }
  },
  spacing: {
    s1:'0.25rem', s2:'0.5rem', s3:'0.75rem', s4:'1rem',
    s6:'1.5rem', s8:'2rem', s12:'3rem', s16:'4rem',
    s20:'5rem', s24:'6rem'
  },
  radius: { sm:'0.375rem', md:'0.5rem', lg:'0.75rem', xl:'1rem' },
  shadow: {
    sm:'0 1px 2px oklch(0.2 0.01 80 / 0.06)',
    md:'0 4px 12px oklch(0.2 0.01 80 / 0.08)',
    lg:'0 12px 32px oklch(0.2 0.01 80 / 0.12)'
  }
};

const state = (typeof DESIGN_TOKENS !== 'undefined') ? DESIGN_TOKENS : DEFAULT_STATE;
let isDark = false;

// ── Server mode detection ─────────────────────────────────────
// If running via server.js, write to disk. Otherwise download.
let SERVER_AVAILABLE = false;

async function checkServer() {
  try {
    const res = await fetch('/status', { signal: AbortSignal.timeout(500) });
    if (res.ok) { SERVER_AVAILABLE = true; updateServerBadge(true); }
  } catch { SERVER_AVAILABLE = false; updateServerBadge(false); }
}

function updateServerBadge(online) {
  const badge = document.getElementById('server-badge');
  if (!badge) return;
  badge.textContent = online ? '● Live sync on' : '○ Download mode';
  badge.style.color  = online ? 'var(--color-success)' : 'var(--color-text-faint)';
}

// ── Write to disk (via server) or download (fallback) ─────────
async function writeToDisk(filename, content, mime = 'text/plain') {
  if (SERVER_AVAILABLE) {
    try {
      const res = await fetch('/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content })
      });
      const json = await res.json();
      if (json.ok) {
        showToast(`Saved: ${filename}`);
        return;
      }
    } catch (e) { /* fall through to download */ }
  }
  downloadFile(filename, content, mime);
}

// ── Auto-sync all files on every token change ─────────────────
let syncTimer = null;
function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncAllFiles, 600); // debounce 600ms
}

async function syncAllFiles() {
  if (!SERVER_AVAILABLE) return;
  const { buildDesignMD }    = await import('./exporters/design-md.js');
  const { buildTokensJSON }  = await import('./exporters/tokens-json.js');
  const { buildCSS }         = await import('./exporters/css.js');

  await writeToDisk('design-tokens.json',
    JSON.stringify(buildTokensJSON(state), null, 2), 'application/json');
  await writeToDisk('Design.md',   buildDesignMD(state),   'text/markdown');
  await writeToDisk('tokens.css',  buildCSS(state),        'text/css');
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('ds-toast');
  if (!toast) {
    toast = Object.assign(document.createElement('div'), { id: 'ds-toast' });
    Object.assign(toast.style, {
      position:'fixed', bottom:'24px', right:'24px',
      background:'var(--color-surface)', border:'1px solid var(--color-border)',
      borderRadius:'var(--radius-md)', padding:'8px 16px',
      fontSize:'12px', color:'var(--color-text)',
      boxShadow:'var(--shadow-md)', zIndex:'9999',
      transition:'opacity 0.3s', opacity:'0'
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.style.opacity = '0', 2000);
}

// ── Apply tokens to CSS variables ────────────────────────────
function applyTokens() {
  const root = document.documentElement;
  const c = isDark ? state.color.dark : state.color.light;
  const entries = {
    '--color-bg': c.bg, '--color-surface': c.surface,
    '--color-surface-2': c.surface2, '--color-surface-offset': c.surfaceOffset,
    '--color-text': c.text, '--color-text-muted': c.textMuted,
    '--color-text-faint': c.textFaint, '--color-primary': c.primary,
    '--color-primary-hover': c.primaryHover, '--color-error': c.error,
    '--color-warning': c.warning, '--color-success': c.success,
    '--font-display': `'${state.typography.fontDisplay}', sans-serif`,
    '--font-body': `'${state.typography.fontBody}', sans-serif`,
    '--space-4': state.spacing.s4, '--space-8': state.spacing.s8,
    '--space-12': state.spacing.s12, '--space-16': state.spacing.s16,
    '--radius-sm': state.radius.sm, '--radius-md': state.radius.md,
    '--radius-lg': state.radius.lg, '--radius-xl': state.radius.xl,
    '--shadow-sm': state.shadow.sm, '--shadow-md': state.shadow.md,
    '--shadow-lg': state.shadow.lg,
  };
  for (const [k, v] of Object.entries(entries)) root.style.setProperty(k, v);
}

// ── Contrast checker (WCAG relative luminance) ────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function relativeLuminance([r,g,b]) {
  const s = [r,g,b].map(v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); });
  return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
}
function contrastRatio(hex1, hex2) {
  const [l1,l2] = [relativeLuminance(hexToRgb(hex1)), relativeLuminance(hexToRgb(hex2))];
  return +((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2);
}
function wcagGrade(ratio) {
  return ratio>=7 ? 'AAA' : ratio>=4.5 ? 'AA' : ratio>=3 ? 'AA Large' : 'FAIL';
}

function runContrastAudit() {
  const c = isDark ? state.color.dark : state.color.light;
  return [
    { label:'Text on BG',       fg:c.text,       bg:c.bg },
    { label:'Text on Surface',  fg:c.text,       bg:c.surface },
    { label:'Muted on BG',      fg:c.textMuted,  bg:c.bg },
    { label:'Faint on Surface', fg:c.textFaint,  bg:c.surface },
    { label:'Primary on BG',    fg:c.primary,    bg:c.bg },
    { label:'White on Primary', fg:'#ffffff',    bg:c.primary },
    { label:'Text on Surface2', fg:c.text,       bg:c.surface2 },
  ].map(p => {
    const ratio = contrastRatio(p.fg, p.bg);
    const grade = wcagGrade(ratio);
    return { ...p, ratio, grade, pass: grade !== 'FAIL' };
  });
}

function renderAudit() {
  const results = runContrastAudit();
  const container = document.getElementById('audit-results');
  if (!container) return;
  container.innerHTML = results.map(r => `
    <div class="audit-row ${r.pass ? 'pass' : 'fail'}">
      <span class="audit-swatch" style="background:${r.fg};border:1px solid var(--color-border)"></span>
      <span class="audit-swatch" style="background:${r.bg};border:1px solid var(--color-border)"></span>
      <span class="audit-label">${r.label}</span>
      <span class="audit-ratio">${r.ratio}:1</span>
      <span class="audit-grade grade-${r.grade.replace(' ','').toLowerCase()}">${r.grade}</span>
    </div>
  `).join('');
}

// ── Color picker binding ──────────────────────────────────────
function bindColorPickers() {
  document.querySelectorAll('[data-token]').forEach(el => {
    el.addEventListener('input', e => {
      const [mode, key] = e.target.dataset.token.split('.');
      state.color[mode][key] = e.target.value;
      applyTokens();
      renderAudit();
      updateSwatches();
      scheduleSync(); // write to disk
    });
  });
}

function updateSwatches() {
  document.querySelectorAll('[data-token]').forEach(el => {
    const [mode, key] = el.dataset.token.split('.');
    el.value = state.color[mode][key];
    const hex = el.nextElementSibling;
    if (hex) hex.textContent = state.color[mode][key];
  });
}

// ── Theme toggle ─────────────────────────────────────────────
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    btn.textContent = isDark ? '☀ Light' : '☾ Dark';
    applyTokens();
    renderAudit();
    updateSwatches();
    runSpacingAudit();
  });
}

// ── Form factor device frame ──────────────────────────────────
function initFormFactor() {
  const frame = document.getElementById('device-frame');
  if (!frame) return;
  const ff = state.meta.formFactor.toLowerCase();
  frame.className = 'device-frame';
  if (ff.includes('mobile'))   frame.classList.add('device-mobile');
  else if (ff.includes('wearable') || ff.includes('watch')) frame.classList.add('device-watch');
  else if (ff.includes('desktop')) frame.classList.add('device-desktop');
  else { frame.classList.add('device-web');
    document.getElementById('web-bar')?.style.setProperty('display','flex');
    document.getElementById('mobile-nav')?.style.setProperty('display','none');
  }
  ['appName','formFactor','appType','framework','targetUser','vibeWords'].forEach(k => {
    const el = document.getElementById('meta-' + k);
    if (el) el.textContent = state.meta[k];
  });
  const nameEl = document.getElementById('screen-appname');
  if (nameEl) nameEl.textContent = state.meta.appName;
  document.title = 'Design Preview — ' + state.meta.appName;
}

// ── Export buttons ────────────────────────────────────────────
function initExports() {
  // On-demand exports — always download (bypass server for explicit exports)
  document.getElementById('export-json')
    ?.addEventListener('click', () => exportTokensJSON(state));
  document.getElementById('export-md')
    ?.addEventListener('click', () => exportDesignMD(state));
  document.getElementById('export-css')
    ?.addEventListener('click', () => exportCSS(state));
  document.getElementById('export-tailwind')
    ?.addEventListener('click', () => exportTailwind(state));
  document.getElementById('export-flutter')
    ?.addEventListener('click', () => exportFlutter(state));

  // Sync all now button
  document.getElementById('sync-now')
    ?.addEventListener('click', async () => {
      await syncAllFiles();
      if (!SERVER_AVAILABLE) showToast('Server not running — use download buttons');
    });
}

// ── Spacing audit ─────────────────────────────────────────────
function runSpacingAudit() {
  const validGrid = [4,8,12,16,20,24,32,40,48,56,64,80,96];
  const tokens = Object.entries(state.spacing).map(([k,v]) => {
    const px = Math.round(parseFloat(v) * 16);
    return { key: k, value: v, px, pass: validGrid.includes(px) };
  });
  const container = document.getElementById('spacing-audit');
  if (!container) return;
  container.innerHTML = tokens.map(t => `
    <div class="audit-row ${t.pass?'pass':'fail'}">
      <span class="audit-label">--space-${t.key.replace('s','')}</span>
      <span class="audit-ratio">${t.value} (${t.px}px)</span>
      <span class="audit-grade ${t.pass?'grade-aa':'grade-fail'}">${t.pass?'✓':'✗'}</span>
    </div>
  `).join('');
}

// ── Font CDN swap ─────────────────────────────────────────────
function applyFontCDN() {
  const link = document.getElementById('font-cdn');
  if (link && state.typography.fontCDN) link.href = state.typography.fontCDN;
}

// ── Init ─────────────────────────────────────────────────────
async function init() {
  await checkServer();
  initFormFactor();
  applyFontCDN();
  applyTokens();
  updateSwatches();
  bindColorPickers();
  initThemeToggle();
  initExports();
  renderAudit();
  runSpacingAudit();
}

document.addEventListener('DOMContentLoaded', init);
