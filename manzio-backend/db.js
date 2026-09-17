const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

const dbPath = path.join(__dirname, 'db.sqlite3');
const db = new DatabaseSync(dbPath);

// Ensure media directories exist
const mediaDirs = ['projects', 'partners', 'blogs'];
for (const dir of mediaDirs) {
  const fullPath = path.join(__dirname, 'media', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/**
 * Format relative image path (e.g. 'projects/image.jpg') into an absolute URL
 */
function getAbsoluteMediaUrl(req, relativePath) {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  const host = req.get('host') || '127.0.0.1:8000';
  const protocol = req.protocol || 'http';
  const cleaned = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return `${protocol}://${host}/media/${cleaned}`;
}

/**
 * Decode base64 image string and save to disk
 * Returns relative path stored in DB (e.g. 'projects/uuid.jpg')
 */
function saveBase64Image(data, subfolder = 'projects') {
  if (!data || typeof data !== 'string') return null;
  if (!data.startsWith('data:image')) {
    // If it's already a relative path or url, return it
    if (data.includes('/media/')) {
      const parts = data.split('/media/');
      return parts[parts.length - 1];
    }
    return data;
  }

  try {
    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext.includes('+')) ext = ext.split('+')[0];

    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const targetDir = path.join(__dirname, 'media', subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const fullPath = path.join(targetDir, fileName);
    fs.writeFileSync(fullPath, buffer);
    return `${subfolder}/${fileName}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return null;
  }
}

module.exports = {
  db,
  getAbsoluteMediaUrl,
  saveBase64Image,
};
