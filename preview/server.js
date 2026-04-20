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
        const dest = path.join(PROJECT_ROOT, filename);
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
  let filePath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
  filePath = path.join(PREVIEW_DIR, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
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
