const express = require('express');
const { db, getAbsoluteMediaUrl, saveBase64Image } = require('../db');

const router = express.Router();

function formatPartner(req, row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    type: row.type || 'Corporate',
    contact: row.contact || '',
    logoUrl: getAbsoluteMediaUrl(req, row.logo),
    status: row.status || 'active',
    createdAt: row.created_at,
  };
}

// GET /api/partners/ and /api/clients/
router.get('/', (req, res) => {
  const { status, type } = req.query;
  let query = 'SELECT * FROM api_partner';
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);
  res.json(rows.map(r => formatPartner(req, r)));
});

// GET /api/partners/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_partner WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatPartner(req, row));
});

// POST /api/partners/
router.post('/', (req, res) => {
  const { name, type = 'Corporate', contact = '', logo, status = 'active' } = req.body;
  if (!name) return res.status(400).json({ name: ['This field is required.'] });

  let logoPath = null;
  if (logo) {
    logoPath = saveBase64Image(logo, 'partners');
  }

  const createdAt = new Date().toISOString();
  const info = db.prepare(
    'INSERT INTO api_partner (name, type, contact, logo, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, type, contact, logoPath, status, createdAt);

  const row = db.prepare('SELECT * FROM api_partner WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(formatPartner(req, row));
});

// PUT / PATCH /api/partners/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_partner WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_partner WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const b = req.body;
  const name = b.name !== undefined ? b.name : existing.name;
  const type = b.type !== undefined ? b.type : existing.type;
  const contact = b.contact !== undefined ? b.contact : existing.contact;
  const status = b.status !== undefined ? b.status : existing.status;

  let logoPath = existing.logo;
  if (b.logo !== undefined) {
    if (b.logo && b.logo.startsWith('data:image')) {
      logoPath = saveBase64Image(b.logo, 'partners');
    } else if (b.logo === null || b.logo === '') {
      logoPath = null;
    }
  }

  db.prepare(
    'UPDATE api_partner SET name = ?, type = ?, contact = ?, logo = ?, status = ? WHERE id = ?'
  ).run(name, type, contact, logoPath, status, req.params.id);

  const updated = db.prepare('SELECT * FROM api_partner WHERE id = ?').get(req.params.id);
  res.json(formatPartner(req, updated));
});

module.exports = router;
