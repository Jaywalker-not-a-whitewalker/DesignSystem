#!/usr/bin/env node
// preview/server.js
// Tiny local server — bridges browser token changes to disk writes
// Usage: node server.js --project /path/to/your/project
// Then open: http://localhost:7743

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

// ── Resolve project root from --project flag ──────────────────
const args = process.argv.slice(2);
const projIdx = args.indexOf('--project');
const PROJECT_ROOT = projIdx !== -1
  ? path.resolve(args[projIdx + 1])
  : process.cwd();

const PREVIEW_DIR = __dirname;
const PORT = 7743;

// ── Allowed write targets (whitelist for safety) ──────────────
const ALLOWED_FILES = [
  'Design.md',
  'design-tokens.json',
  'design_tokens.dart',
  'tokens.css',
  'tailwind.config.js',
];

// ── MIME types ────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.md':   'text/markdown',
};

// ── Request handler ───────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS — allow localhost only
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + PORT);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── POST /write — write file to project root ─────────────────
  if (req.method === 'POST' && parsed.pathname === '/write') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { filename, content } = JSON.parse(body);
        if (!ALLOWED_FILES.includes(filename)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File not in allowlist' }));
          return;
        }
        const outDir = path.join(PROJECT_ROOT, 'designSystem-Out');
        if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }
        const dest = path.join(outDir, filename);
        fs.writeFileSync(dest, content, 'utf8');
        console.log('  wrote  ' + dest);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, path: dest }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── GET /status — health check ────────────────────────────────
  if (parsed.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, project: PROJECT_ROOT }));
    return;
  }

  // ── Serve static preview files ────────────────────────────────
  let filePath;
  let isPreviewHtml = false;

  if (parsed.pathname === '/' || parsed.pathname === '/preview.html' || parsed.pathname === '/index.html') {
    const rootPreview = path.join(PROJECT_ROOT, 'designSystem-Out', 'preview.html');
    if (fs.existsSync(rootPreview)) {
      filePath = rootPreview;
      isPreviewHtml = true;
    } else {
      filePath = path.join(PREVIEW_DIR, 'index.html');
    }
  } else if (parsed.pathname === '/design-tokens.json') {
    const rootTokens = path.join(PROJECT_ROOT, 'designSystem-Out', 'design-tokens.json');
    if (fs.existsSync(rootTokens)) {
      filePath = rootTokens;
    } else {
      res.writeHead(404); res.end('Not found'); return;
    }
  } else {
    filePath = path.join(PREVIEW_DIR, parsed.pathname);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    
    let content = data;
    if (isPreviewHtml) {
      // Auto-heal 'file:///' URIs that models often mistakenly generate for preview assets
      let html = data.toString('utf8');
      html = html.replace(/(href|src)="file:\/\/[^"]*?\/preview\/([^"]+)"/g, '$1="$2"');
      content = Buffer.from(html, 'utf8');
    }

    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  design-system preview');
  console.log('');
  console.log('  Project  : ' + PROJECT_ROOT);
  console.log('  Preview  : http://localhost:' + PORT);
  console.log('');
  console.log('  Token changes will write directly to project files.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');

  // Auto-open browser
  const open = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start' : 'xdg-open';
  require('child_process').exec(open + ' http://localhost:' + PORT);
});
