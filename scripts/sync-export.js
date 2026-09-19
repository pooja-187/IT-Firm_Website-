const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');

if (!fs.existsSync(outDir)) {
  console.error('[sync-export] Error: out directory does not exist.');
  process.exit(1);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('[sync-export] Synchronizing Next.js static export to workspace root...');

// 1. Remove old _next and copy fresh out/_next
const destNext = path.join(rootDir, '_next');
if (fs.existsSync(destNext)) {
  fs.rmSync(destNext, { recursive: true, force: true });
}
if (fs.existsSync(path.join(outDir, '_next'))) {
  copyDirRecursive(path.join(outDir, '_next'), destNext);
  console.log('[sync-export] Copied _next/ static bundles.');
}

// 2. Copy all files from out/ directly into rootDir (HTML, TXT, RSC payloads, SVG, ICO)
const outEntries = fs.readdirSync(outDir, { withFileTypes: true });
for (const entry of outEntries) {
  const srcPath = path.join(outDir, entry.name);
  const destPath = path.join(rootDir, entry.name);

  if (entry.isDirectory()) {
    if (entry.name !== '_next') {
      copyDirRecursive(srcPath, destPath);
      console.log(`[sync-export] Copied directory ${entry.name}/`);
    }
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}
console.log('[sync-export] Copied root HTML, TXT, and RSC payload files.');

// 3. Ensure dual-compatibility: every <route>.html has <route>/index.html
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== '404.html');
for (const htmlFile of htmlFiles) {
  const routeName = path.basename(htmlFile, '.html');
  const routeDir = path.join(rootDir, routeName);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  const indexInRoute = path.join(routeDir, 'index.html');
  fs.copyFileSync(path.join(rootDir, htmlFile), indexInRoute);
  console.log(`[sync-export] Ensured ${routeName}/index.html from ${htmlFile}`);
}

// 4. Also ensure out/ folder has dual index.html for any direct static serving
for (const htmlFile of htmlFiles) {
  const routeName = path.basename(htmlFile, '.html');
  const outRouteDir = path.join(outDir, routeName);
  if (fs.existsSync(outRouteDir)) {
    fs.copyFileSync(path.join(rootDir, htmlFile), path.join(outRouteDir, 'index.html'));
  }
}

console.log('[sync-export] Synchronization complete successfully.');
