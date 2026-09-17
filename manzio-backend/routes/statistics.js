const express = require('express');
const { db } = require('../db');

const router = express.Router();

function formatStatistic(row) {
  if (!row) return null;
  return {
    id: row.id,
    number: row.number,
    suffix: row.suffix || '+',
    label: row.label,
  };
}

// GET /api/statistics/ and /api/stats/
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM api_statistic ORDER BY id ASC').all();
  res.json(rows.map(formatStatistic));
});

// GET /api/statistics/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_statistic WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatStatistic(row));
});

// POST /api/statistics/
router.post('/', (req, res) => {
  const { number, suffix = '+', label } = req.body;
  if (number === undefined || !label) {
    return res.status(400).json({ error: 'number and label are required.' });
  }

  const info = db.prepare(
    'INSERT INTO api_statistic (number, suffix, label) VALUES (?, ?, ?)'
  ).run(Number(number), suffix, label);

  const row = db.prepare('SELECT * FROM api_statistic WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(formatStatistic(row));
});

// PUT / PATCH /api/statistics/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_statistic WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_statistic WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const number = req.body.number !== undefined ? Number(req.body.number) : existing.number;
  const suffix = req.body.suffix !== undefined ? req.body.suffix : existing.suffix;
  const label = req.body.label !== undefined ? req.body.label : existing.label;

  db.prepare(
    'UPDATE api_statistic SET number = ?, suffix = ?, label = ? WHERE id = ?'
  ).run(number, suffix, label, req.params.id);

  const updated = db.prepare('SELECT * FROM api_statistic WHERE id = ?').get(req.params.id);
  res.json(formatStatistic(updated));
});

module.exports = router;
