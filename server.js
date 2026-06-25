// AI Adoption Dashboard — API + static server.
// Serves the built React app (dist/) and a tiny shared-state API backed by SQLite.
// The whole dashboard is one JSON document with a monotonic version for conflict detection.
import express from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const DB_PATH = process.env.DB_PATH || join(__dirname, 'data', 'dashboard.db');
const DIST = join(__dirname, 'dist');

// Ensure the SQLite directory exists (the Docker volume mounts at /data).
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS state (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  doc        TEXT    NOT NULL,
  version    INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
)`);

const readRow   = db.prepare('SELECT doc, version, updated_at FROM state WHERE id = 1');
const insertRow = db.prepare('INSERT INTO state (id, doc, version, updated_at) VALUES (1, ?, ?, ?)');
const updateRow = db.prepare('UPDATE state SET doc = ?, version = ?, updated_at = ? WHERE id = 1');

const getState = () => {
  const row = readRow.get();
  if (!row) return { state: null, version: 0 };
  return { state: JSON.parse(row.doc), version: row.version, updatedAt: row.updated_at };
};

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/state', (_req, res) => {
  try { res.json(getState()); }
  catch (e) { res.status(500).json({ error: String(e) }); }
});

// Optimistic concurrency: client sends the baseVersion it last saw.
// If it no longer matches, reject with 409 + the current state so the client can reconcile.
app.put('/api/state', (req, res) => {
  const { state, baseVersion } = req.body || {};
  if (state == null || typeof state !== 'object') {
    return res.status(400).json({ error: 'Body must be { state, baseVersion }.' });
  }
  try {
    const current = readRow.get();
    const curVersion = current ? current.version : 0;
    if (typeof baseVersion === 'number' && baseVersion !== curVersion) {
      return res.status(409).json({ error: 'version-conflict', ...getState() });
    }
    const nextVersion = curVersion + 1;
    const doc = JSON.stringify(state);
    const now = new Date().toISOString();
    if (current) updateRow.run(doc, nextVersion, now);
    else insertRow.run(doc, nextVersion, now);
    res.json({ ok: true, version: nextVersion, updatedAt: now });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Static frontend + SPA fallback (no client-side routes today, but harmless).
app.use(express.static(DIST));
app.get('*', (_req, res) => res.sendFile(join(DIST, 'index.html')));

app.listen(PORT, () => console.log(`Dashboard server listening on :${PORT} (db: ${DB_PATH})`));
