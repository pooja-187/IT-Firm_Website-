const express = require('express');
const { db } = require('../db');

const router = express.Router();

function formatService(row) {
  if (!row) return null;
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    heading: row.heading,
    description: row.description,
    glow_color: row.glow_color || 'rgba(139,92,246,0.07)',
  };
}

// GET /api/services/
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM api_service ORDER BY number ASC').all();
  res.json(rows.map(formatService));
});

// GET /api/services/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_service WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatService(row));
});

// POST /api/services/
router.post('/', (req, res) => {
  const { number, title, heading, description, glow_color = 'rgba(139,92,246,0.07)' } = req.body;
  if (!number || !title || !heading || !description) {
    return res.status(400).json({ error: 'number, title, heading, and description are required.' });
  }

  const info = db.prepare(
    'INSERT INTO api_service (number, title, heading, description, glow_color) VALUES (?, ?, ?, ?, ?)'
  ).run(number, title, heading, description, glow_color);

  const row = db.prepare('SELECT * FROM api_service WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(formatService(row));
});

// PUT / PATCH /api/services/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_service WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_service WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const b = req.body;
  const number = b.number !== undefined ? b.number : existing.number;
  const title = b.title !== undefined ? b.title : existing.title;
  const heading = b.heading !== undefined ? b.heading : existing.heading;
  const description = b.description !== undefined ? b.description : existing.description;
  const glow_color = b.glow_color !== undefined ? b.glow_color : existing.glow_color;

  db.prepare(
    'UPDATE api_service SET number = ?, title = ?, heading = ?, description = ?, glow_color = ? WHERE id = ?'
  ).run(number, title, heading, description, glow_color, req.params.id);

  const updated = db.prepare('SELECT * FROM api_service WHERE id = ?').get(req.params.id);
  res.json(formatService(updated));
});

module.exports = router;
