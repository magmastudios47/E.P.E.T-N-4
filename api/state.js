const fs = require('fs');
const path = require('path');

const TMP_DB_PATH = path.join('/tmp', 'epet4_db_v4.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    try {
      if (fs.existsSync(TMP_DB_PATH)) {
        const raw = fs.readFileSync(TMP_DB_PATH, 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).send(raw);
      }
    } catch (e) {
      // Ignore read errors
    }
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    try {
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (bodyData && typeof bodyData === 'object') {
        fs.writeFileSync(TMP_DB_PATH, JSON.stringify(bodyData), 'utf8');
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(200).json({ ok: false });
    }
  }

  return res.status(405).end();
};
