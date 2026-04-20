// exporters/tokens-json.js

export function buildTokensJSON(state) {
  return {
    meta: {
      app: state.meta.appName,
      formFactor: state.meta.formFactor,
      appType: state.meta.appType,
      framework: state.meta.framework,
      generatedAt: new Date().toISOString()
    },
    color: { light: { ...state.color.light }, dark: { ...state.color.dark } },
    typography: {
      fontDisplay: state.typography.fontDisplay,
      fontBody:    state.typography.fontBody,
      fontCDN:     state.typography.fontCDN,
      scale:       { ...state.typography.scale }
    },
    spacing: { ...state.spacing },
    radius:  { ...state.radius },
    shadow:  { ...state.shadow }
  };
}

export function exportTokensJSON(state) {
  downloadFile('design-tokens.json', JSON.stringify(buildTokensJSON(state), null, 2), 'application/json');
}

export function downloadFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
