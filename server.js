const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_PATH = path.join(ROOT_DIR, 'data', 'db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error leyendo data/db.json:', err.message);
  }
  return null;
}

function writeDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error guardando data/db.json:', err.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Endpoint API de persistencia para la escuela
  if (pathname === '/api/state') {
    if (req.method === 'GET') {
      const db = readDb();
      if (!db) {
        res.writeHead(204);
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(db));
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 5e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          writeDb(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'JSON inválido' }));
        }
      });
      return;
    }
  }

  // Servir archivos estáticos
  let safePath = path.normalize(pathname === '/' ? '/index.html' : pathname);
  safePath = safePath.replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Archivo no encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`======================================================================`);
  console.log(` E.P.E.T. N° 4 "Gendarmería Nacional" - Junín de los Andes`);
  console.log(` Sistema de Prácticas Profesionalizantes activo en:`);
  console.log(` -> http://localhost:${PORT}`);
  console.log(`======================================================================`);
});
