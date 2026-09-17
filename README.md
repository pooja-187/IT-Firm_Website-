# Manzio Creative Studio — IT Firm Portfolio & System

A modern, high-performance portfolio website, custom admin panel, and Node.js backend engineered for Manzio Creative Studio.

---

## 🏛️ Architecture Overview

The repository is structured as a unified monorepo containing all 3 tiers:

```
├── src/                  # Client Website (Next.js 15 App Router + React 19 + Framer Motion)
├── manzio-admin/         # Custom Admin Panel Source (Vite + React SPA)
├── manzio-backend/       # Backend API (Node.js Express + SQLite3 + Media Storage)
├── public/
│   ├── admin/            # Pre-compiled Admin Panel (served directly at /admin)
│   └── videos/           # 60 FPS optimized video assets
├── next.config.ts        # Dynamic rewrites (/api/* and /media/* proxying)
└── package.json          # Root scripts managing all tiers
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
Install dependencies for all 3 tiers in one command:
```bash
npm run install:all
```

### 2. Start the Stack
In separate terminal windows (or via background runner):

- **Start Node.js Backend** (Port 8000):
  ```bash
  npm run dev:backend
  ```
- **Start Website & Admin** (Port 3000):
  ```bash
  npm run dev
  ```

Access the apps locally:
- **Client Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

---

## 🌐 Production Deployment Guide (`travinno.com`)

### 1. Build
```bash
npm run build:all
```
*(Compiles the admin panel into `public/admin/` and creates the optimized Next.js production build).*

### 2. Run with PM2
```bash
# Start backend API (Port 8000)
pm2 start manzio-backend/server.js --name "manzio-backend"

# Start website & admin (Port 3000)
pm2 start npm --name "manzio-web" -- start

# Persist processes across server reboots
pm2 save
pm2 startup
```

### 3. Nginx Reverse Proxy
Forward traffic on port 80 / 443 to port 3000:
```nginx
server {
    server_name travinno.com www.travinno.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔑 Default Admin Credentials
- **Username**: `admin` (or `rohanvijesh607@gmail.com`)
- **Password**: `admin`
