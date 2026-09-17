const express = require('express');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const serviceRoutes = require('./routes/services');
const faqRoutes = require('./routes/faq');
const statisticRoutes = require('./routes/statistics');
const partnerRoutes = require('./routes/partners');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup matching Django's CORS_ALLOW_ALL_ORIGINS = True
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body parser with 50MB limit to handle Base64 images from custom admin panel
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static media files serving (exact same URL structure as Django: /media/...)
app.use('/media', express.static(path.join(__dirname, 'media')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/works', projectRoutes); // Alias
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/faqs', faqRoutes); // Alias
app.use('/api/statistics', statisticRoutes);
app.use('/api/stats', statisticRoutes); // Alias
app.use('/api/partners', partnerRoutes);
app.use('/api/clients', partnerRoutes); // Alias

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    engine: 'Node.js Express REST API',
    endpoints: [
      '/api/projects/',
      '/api/works/',
      '/api/categories/',
      '/api/services/',
      '/api/blogs/',
      '/api/faq/',
      '/api/statistics/',
      '/api/clients/',
      '/api/partners/',
      '/api/auth/token/',
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Manzio Node Backend] Running on http://127.0.0.1:${PORT}`);
  console.log(`[Manzio Node Backend] Media static files served at http://127.0.0.1:${PORT}/media/`);
});
