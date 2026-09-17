const express = require('express');
const { db } = require('../db');

const router = express.Router();

function formatCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    status: row.status || 'active',
    createdAt: row.created_at,
  };
}

// GET /api/categories/
router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM api_category';
  const params = [];
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);
  res.json(rows.map(formatCategory));
});

// GET /api/categories/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_category WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatCategory(row));
});

// POST /api/categories/
router.post('/', (req, res) => {
  const { name, description = '', status = 'active' } = req.body;
  if (!name) return res.status(400).json({ name: ['This field is required.'] });

  const createdAt = new Date().toISOString();
  try {
    const info = db.prepare(
      'INSERT INTO api_category (name, description, status, created_at) VALUES (?, ?, ?, ?)'
    ).run(name, description, status, createdAt);
    const row = db.prepare('SELECT * FROM api_category WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(formatCategory(row));
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ name: ['category with this name already exists.'] });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT / PATCH /api/categories/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_category WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_category WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const name = req.body.name !== undefined ? req.body.name : existing.name;
  const description = req.body.description !== undefined ? req.body.description : existing.description;
  const status = req.body.status !== undefined ? req.body.status : existing.status;

  db.prepare(
    'UPDATE api_category SET name = ?, description = ?, status = ? WHERE id = ?'
  ).run(name, description, status, req.params.id);

  const updated = db.prepare('SELECT * FROM api_category WHERE id = ?').get(req.params.id);
  res.json(formatCategory(updated));
});

module.exports = router;
