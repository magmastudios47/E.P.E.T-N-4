const http = require('http');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local si existe en desarrollo local
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  try {
    const lines = fs.readFileSync(envLocalPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (_) {}
}

let neonSql = null;
const dbConnectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (dbConnectionUrl) {
  try {
    const { neon } = require('@neondatabase/serverless');
    neonSql = neon(dbConnectionUrl);
  } catch (err) {
    console.error('Error inicializando cliente Neon Postgres:', err.message);
  }
}

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'epet4_db.json')
  : path.join(ROOT_DIR, 'data', 'db.json');

// Referencias explícitas para que el empaquetador de Vercel (@vercel/nft) incluya todos los archivos estáticos
const BUNDLED_ASSETS = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'logo_epet4.png'),
  path.join(__dirname, 'css', 'styles.css'),
  path.join(__dirname, 'js', 'app.js'),
  path.join(__dirname, 'js', 'logo-data.js')
];

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

let dbTableInitialized = false;

async function ensurePostgresTable() {
  if (!neonSql || dbTableInitialized) return;
  await neonSql`
    CREATE TABLE IF NOT EXISTS epet4_app_state (
      id TEXT PRIMARY KEY,
      state_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  dbTableInitialized = true;
}

async function readDb() {
  if (neonSql) {
    try {
      await ensurePostgresTable();
      const rows = await neonSql`
        SELECT state_json FROM epet4_app_state WHERE id = 'epet4_v5' LIMIT 1
      `;
      if (rows && rows.length > 0 && rows[0].state_json) {
        return typeof rows[0].state_json === 'string'
          ? JSON.parse(rows[0].state_json)
          : rows[0].state_json;
      }
      return null;
    } catch (err) {
      console.error('Error leyendo de Neon Postgres:', err.message);
    }
  }

  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error leyendo base de datos local:', err.message);
  }
  return null;
}

function mergeStates(existingState, incomingState) {
  if (!existingState || incomingState._forceReplace) {
    const clean = { ...incomingState };
    delete clean._forceReplace;
    return clean;
  }

  const merged = {
    config: { ...(existingState.config || {}), ...(incomingState.config || {}) },
    teachers: Array.isArray(incomingState.teachers) ? [...incomingState.teachers] : [],
    students: Array.isArray(incomingState.students) ? [...incomingState.students] : []
  };

  // Preservar profesores que se hayan registrado desde otro dispositivo y aún no estén en incomingState
  if (Array.isArray(existingState.teachers)) {
    for (const extT of existingState.teachers) {
      const found = merged.teachers.find(
        (t) =>
          t.id === extT.id ||
          (t.email && extT.email && t.email.toLowerCase() === extT.email.toLowerCase())
      );
      if (!found) {
        merged.teachers.push(extT);
      }
    }
  }

  // Preservar alumnos y sus cargas registradas desde otros dispositivos (ej: celulares)
  if (Array.isArray(existingState.students)) {
    for (const extS of existingState.students) {
      const found = merged.students.find(
        (s) =>
          s.id === extS.id ||
          (s.dni && extS.dni && String(s.dni) === String(extS.dni)) ||
          (s.email && extS.email && s.email.toLowerCase() === extS.email.toLowerCase())
      );
      if (!found) {
        merged.students.push(extS);
      } else if (Array.isArray(extS.logs)) {
        found.logs = Array.isArray(found.logs) ? found.logs : [];
        for (const extLog of extS.logs) {
          if (!found.logs.some((l) => l.id === extLog.id)) {
            found.logs.push(extLog);
          }
        }
      }
    }
  }

  return merged;
}

async function writeDb(data) {
  const existing = await readDb();
  const finalState = mergeStates(existing, data);

  if (neonSql) {
    try {
      await ensurePostgresTable();
      const jsonStr = JSON.stringify(finalState);
      await neonSql`
        INSERT INTO epet4_app_state (id, state_json, updated_at)
        VALUES ('epet4_v5', ${jsonStr}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET state_json = EXCLUDED.state_json, updated_at = NOW()
      `;
    } catch (err) {
      console.error('Error guardando en Neon Postgres:', err.message);
    }
  }

  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(finalState, null, 2), 'utf8');
  } catch (_) {}

  return finalState;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint API de persistencia en la nube (Neon PostgreSQL)
  if (pathname === '/api/state') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'GET') {
      const db = await readDb();
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
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const savedState = await writeDb(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: true, state: savedState }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'JSON inválido' }));
        }
      });
      return;
    }
  }

  // Servir archivos estáticos
  let cleanPathname = pathname === '/' ? '/index.html' : pathname;
  let safePath = path.normalize(cleanPathname).replace(/^(\.\.[\/\\])+/, '').replace(/^[\/\\]+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR) && !BUNDLED_ASSETS.includes(filePath)) {
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
  console.log(` Base de datos en la nube (Neon PostgreSQL): ${neonSql ? 'CONECTADA' : 'MODO LOCAL'}`);
  console.log(` -> http://localhost:${PORT}`);
  console.log(`======================================================================`);
});
