const express = require('express');
const { db } = require('../db');

const router = express.Router();

function formatFAQ(row) {
  if (!row) return null;
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
  };
}

// GET /api/faq/ and /api/faqs/
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM api_faq ORDER BY id ASC').all();
  res.json(rows.map(formatFAQ));
});

// GET /api/faq/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_faq WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatFAQ(row));
});

// POST /api/faq/
router.post('/', (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'question and answer are required.' });
  }

  const info = db.prepare('INSERT INTO api_faq (question, answer) VALUES (?, ?)').run(question, answer);
  const row = db.prepare('SELECT * FROM api_faq WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(formatFAQ(row));
});

// PUT / PATCH /api/faq/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_faq WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_faq WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const question = req.body.question !== undefined ? req.body.question : existing.question;
  const answer = req.body.answer !== undefined ? req.body.answer : existing.answer;

  db.prepare('UPDATE api_faq SET question = ?, answer = ? WHERE id = ?').run(question, answer, req.params.id);
  const updated = db.prepare('SELECT * FROM api_faq WHERE id = ?').get(req.params.id);
  res.json(formatFAQ(updated));
});

module.exports = router;
