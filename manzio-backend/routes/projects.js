const express = require('express');
const { db, getAbsoluteMediaUrl, saveBase64Image } = require('../db');

const router = express.Router();

function formatProject(req, row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category_name || '',
    category_name: row.category_name || '',
    client: row.client || '',
    imageUrl: getAbsoluteMediaUrl(req, row.image),
    status: row.status || 'active',
    createdAt: row.created_at,
    is_featured: Boolean(row.is_featured),
    featured_description: row.featured_description || '',
    short_description: row.short_description || '',
    featured_metric_1: row.featured_metric_1 || '',
    featured_metric_2: row.featured_metric_2 || '',
    featured_metric_3: row.featured_metric_3 || '',
    featured_cta_text: row.featured_cta_text || '',
    featured_theme_color: row.featured_theme_color || '',
    featured_priority: row.featured_priority || 0,
  };
}

// GET /api/projects/ and /api/works/
router.get('/', (req, res) => {
  const { status, category_name } = req.query;
  let query = 'SELECT * FROM api_project';
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (category_name) {
    conditions.push('category_name = ?');
    params.push(category_name);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY featured_priority DESC, created_at DESC';
  const rows = db.prepare(query).all(...params);
  res.json(rows.map(r => formatProject(req, r)));
});

// GET /api/projects/:id/
router.get('/:id/', (req, res) => {
  const row = db.prepare('SELECT * FROM api_project WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatProject(req, row));
});

// Helper to resolve category ID & Name
function resolveCategory(categoryInput) {
  if (!categoryInput) return { id: null, name: '' };
  let cat = db.prepare('SELECT id, name FROM api_category WHERE name = ?').get(categoryInput);
  if (!cat) {
    const createdAt = new Date().toISOString();
    const info = db.prepare(
      'INSERT INTO api_category (name, description, status, created_at) VALUES (?, ?, ?, ?)'
    ).run(categoryInput, 'Auto-created from project', 'active', createdAt);
    cat = { id: info.lastInsertRowid, name: categoryInput };
  }
  return cat;
}

// POST /api/projects/
router.post('/', (req, res) => {
  const {
    title,
    category,
    category_name,
    client = '',
    image,
    status = 'active',
    is_featured = false,
    featured_description = '',
    short_description = '',
    featured_metric_1 = '',
    featured_metric_2 = '',
    featured_metric_3 = '',
    featured_cta_text = '',
    featured_theme_color = '',
    featured_priority = 0,
  } = req.body;

  if (!title) return res.status(400).json({ title: ['This field is required.'] });

  const catVal = category || category_name || '';
  const resolvedCat = resolveCategory(catVal);
  const catName = resolvedCat.name || catVal;
  const catId = resolvedCat.id;

  let imagePath = null;
  if (image) {
    imagePath = saveBase64Image(image, 'projects');
  }

  const createdAt = new Date().toISOString();

  const insertSql = `
    INSERT INTO api_project (
      title, category_name, client, image, status, created_at, category_id,
      is_featured, featured_description, short_description,
      featured_metric_1, featured_metric_2, featured_metric_3,
      featured_cta_text, featured_theme_color, featured_priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const info = db.prepare(insertSql).run(
    title,
    catName,
    client,
    imagePath,
    status,
    createdAt,
    catId,
    is_featured ? 1 : 0,
    featured_description,
    short_description,
    featured_metric_1,
    featured_metric_2,
    featured_metric_3,
    featured_cta_text,
    featured_theme_color,
    Number(featured_priority) || 0
  );

  const newRow = db.prepare('SELECT * FROM api_project WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(formatProject(req, newRow));
});

// PUT / PATCH /api/projects/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_project WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_project WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const b = req.body;
  const title = b.title !== undefined ? b.title : existing.title;
  const client = b.client !== undefined ? b.client : existing.client;
  const status = b.status !== undefined ? b.status : existing.status;

  let catName = existing.category_name;
  let catId = existing.category_id;
  if (b.category !== undefined || b.category_name !== undefined) {
    const inputCat = b.category || b.category_name || '';
    if (inputCat) {
      const resolved = resolveCategory(inputCat);
      catName = resolved.name;
      catId = resolved.id;
    } else {
      catName = '';
      catId = null;
    }
  }

  let imagePath = existing.image;
  if (b.image !== undefined) {
    if (b.image && b.image.startsWith('data:image')) {
      imagePath = saveBase64Image(b.image, 'projects');
    } else if (b.image === null || b.image === '') {
      imagePath = null;
    }
  }

  const is_featured = b.is_featured !== undefined ? (b.is_featured ? 1 : 0) : existing.is_featured;
  const featured_description = b.featured_description !== undefined ? b.featured_description : existing.featured_description;
  const short_description = b.short_description !== undefined ? b.short_description : existing.short_description;
  const featured_metric_1 = b.featured_metric_1 !== undefined ? b.featured_metric_1 : existing.featured_metric_1;
  const featured_metric_2 = b.featured_metric_2 !== undefined ? b.featured_metric_2 : existing.featured_metric_2;
  const featured_metric_3 = b.featured_metric_3 !== undefined ? b.featured_metric_3 : existing.featured_metric_3;
  const featured_cta_text = b.featured_cta_text !== undefined ? b.featured_cta_text : existing.featured_cta_text;
  const featured_theme_color = b.featured_theme_color !== undefined ? b.featured_theme_color : existing.featured_theme_color;
  const featured_priority = b.featured_priority !== undefined ? (Number(b.featured_priority) || 0) : existing.featured_priority;

  const updateSql = `
    UPDATE api_project SET
      title = ?, category_name = ?, client = ?, image = ?, status = ?, category_id = ?,
      is_featured = ?, featured_description = ?, short_description = ?,
      featured_metric_1 = ?, featured_metric_2 = ?, featured_metric_3 = ?,
      featured_cta_text = ?, featured_theme_color = ?, featured_priority = ?
    WHERE id = ?
  `;

  db.prepare(updateSql).run(
    title,
    catName,
    client,
    imagePath,
    status,
    catId,
    is_featured,
    featured_description,
    short_description,
    featured_metric_1,
    featured_metric_2,
    featured_metric_3,
    featured_cta_text,
    featured_theme_color,
    featured_priority,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM api_project WHERE id = ?').get(req.params.id);
  res.json(formatProject(req, updated));
});

module.exports = router;
