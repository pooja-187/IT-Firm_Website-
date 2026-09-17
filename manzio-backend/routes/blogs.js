const express = require('express');
const { db, getAbsoluteMediaUrl, saveBase64Image } = require('../db');

const router = express.Router();

function formatBlog(req, blogRow) {
  if (!blogRow) return null;
  const imageRows = db.prepare('SELECT image FROM api_blogimage WHERE blog_id = ?').all(blogRow.id);
  const images = imageRows
    .map(r => getAbsoluteMediaUrl(req, r.image))
    .filter(Boolean);

  return {
    id: blogRow.id,
    title: blogRow.title,
    date: blogRow.date,
    meta_description: blogRow.meta_description || '',
    description: blogRow.description || '',
    images,
  };
}

// GET /api/blogs/
router.get('/', (req, res) => {
  const blogs = db.prepare('SELECT * FROM api_blog ORDER BY date DESC, id DESC').all();
  res.json(blogs.map(b => formatBlog(req, b)));
});

// GET /api/blogs/:id/
router.get('/:id/', (req, res) => {
  const blog = db.prepare('SELECT * FROM api_blog WHERE id = ?').get(req.params.id);
  if (!blog) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatBlog(req, blog));
});

// POST /api/blogs/
router.post('/', (req, res) => {
  const {
    title,
    date = new Date().toISOString().split('T')[0],
    meta_description = '',
    description,
    uploaded_images = []
  } = req.body;

  if (!title) return res.status(400).json({ title: ['This field is required.'] });
  if (!description) return res.status(400).json({ description: ['This field is required.'] });

  const info = db.prepare(
    'INSERT INTO api_blog (title, date, meta_description, description) VALUES (?, ?, ?, ?)'
  ).run(title, date, meta_description, description);

  const blogId = info.lastInsertRowid;

  if (Array.isArray(uploaded_images)) {
    for (const imgData of uploaded_images) {
      const savedPath = saveBase64Image(imgData, 'blogs');
      if (savedPath) {
        db.prepare('INSERT INTO api_blogimage (image, blog_id) VALUES (?, ?)').run(savedPath, blogId);
      }
    }
  }

  const newBlog = db.prepare('SELECT * FROM api_blog WHERE id = ?').get(blogId);
  res.status(201).json(formatBlog(req, newBlog));
});

// PUT / PATCH /api/blogs/:id/
router.all('/:id/', (req, res, next) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return next();
  }

  const existing = db.prepare('SELECT * FROM api_blog WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM api_blogimage WHERE blog_id = ?').run(req.params.id);
    db.prepare('DELETE FROM api_blog WHERE id = ?').run(req.params.id);
    return res.status(204).send();
  }

  const b = req.body;
  const title = b.title !== undefined ? b.title : existing.title;
  const date = b.date !== undefined ? b.date : existing.date;
  const meta_description = b.meta_description !== undefined ? b.meta_description : existing.meta_description;
  const description = b.description !== undefined ? b.description : existing.description;

  db.prepare(
    'UPDATE api_blog SET title = ?, date = ?, meta_description = ?, description = ? WHERE id = ?'
  ).run(title, date, meta_description, description, req.params.id);

  if (Array.isArray(b.uploaded_images)) {
    db.prepare('DELETE FROM api_blogimage WHERE blog_id = ?').run(req.params.id);
    for (const imgData of b.uploaded_images) {
      const savedPath = saveBase64Image(imgData, 'blogs');
      if (savedPath) {
        db.prepare('INSERT INTO api_blogimage (image, blog_id) VALUES (?, ?)').run(savedPath, req.params.id);
      }
    }
  }

  const updated = db.prepare('SELECT * FROM api_blog WHERE id = ?').get(req.params.id);
  res.json(formatBlog(req, updated));
});

module.exports = router;
