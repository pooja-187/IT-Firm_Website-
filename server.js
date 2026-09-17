const express = require('express');
const next = require('next');
const path = require('node:path');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Enable CORS
  server.use(cors({
    origin: true,
    credentials: true,
  }));

  // Body parser with 50MB limit to handle Base64 image uploads from admin panel
  server.use(express.json({ limit: '50mb' }));
  server.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // 1. Static Media Routes: /media -> manzio-backend/media
  server.use('/media', express.static(path.join(__dirname, 'manzio-backend', 'media')));

  // 2. Admin Panel SPA Routes: /admin -> public/admin
  server.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
  server.use('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
  });

  // 3. Backend REST API Routes from manzio-backend
  const authRoutes = require('./manzio-backend/routes/auth');
  const categoryRoutes = require('./manzio-backend/routes/categories');
  const projectRoutes = require('./manzio-backend/routes/projects');
  const blogRoutes = require('./manzio-backend/routes/blogs');
  const serviceRoutes = require('./manzio-backend/routes/services');
  const faqRoutes = require('./manzio-backend/routes/faq');
  const statisticRoutes = require('./manzio-backend/routes/statistics');
  const partnerRoutes = require('./manzio-backend/routes/partners');

  server.use('/api/auth', authRoutes);
  server.use('/api/categories', categoryRoutes);
  server.use('/api/projects', projectRoutes);
  server.use('/api/works', projectRoutes);
  server.use('/api/blogs', blogRoutes);
  server.use('/api/services', serviceRoutes);
  server.use('/api/faq', faqRoutes);
  server.use('/api/faqs', faqRoutes);
  server.use('/api/statistics', statisticRoutes);
  server.use('/api/stats', statisticRoutes);
  server.use('/api/partners', partnerRoutes);
  server.use('/api/clients', partnerRoutes);

  // Health check endpoint
  server.get('/api', (req, res) => {
    res.json({
      status: 'online',
      engine: 'Unified Node.js Express + Next.js Production Server',
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

  // 4. Delegate all other frontend requests to Next.js handler
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> [Manzio Unified Server] Ready on http://localhost:${PORT}`);
    console.log(`> [Manzio Unified Server] Admin panel: http://localhost:${PORT}/admin`);
    console.log(`> [Manzio Unified Server] REST API: http://localhost:${PORT}/api`);
  });
}).catch((ex) => {
  console.error('[Manzio Unified Server] Startup error:', ex.stack);
  process.exit(1);
});
