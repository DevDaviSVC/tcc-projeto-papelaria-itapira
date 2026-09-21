import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = express.Router();
const publicDirectory = fileURLToPath(new URL('../../../public/', import.meta.url));
const frontendDirectory = fileURLToPath(new URL('../../../../frontend/vitrine/dist/', import.meta.url));

router.get('/', (req, res) => res.sendFile(path.join(publicDirectory, 'index.html')));
router.use('/app-assets', express.static(path.join(frontendDirectory, 'app-assets')));

for (const [legacy, target] of [
  ['/vitrine.html', '/vitrine'], ['/admin.html', '/admin'], ['/login.html', '/login'],
]) {
  router.get(legacy, (req, res) => {
    const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    res.redirect(301, target + query);
  });
}
router.get(['/product', '/product.html'], (req, res) => {
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  res.redirect(301, id ? `/product/${encodeURIComponent(id)}` : '/vitrine');
});

function sendBuildFile(res, next, relativePath, status = 200) {
  res.status(status).sendFile(path.join(frontendDirectory, relativePath), (error) => {
    if (!error) return;
    if (error.code === 'ENOENT') {
      return res.status(503).type('text').send('Frontend não compilado. Execute npm run build em frontend/vitrine.');
    }
    next(error);
  });
}

router.get(['/sitemap.xml', '/robots.txt'], (req, res, next) => sendBuildFile(res, next, req.path.slice(1)));
router.get(['/login', '/admin'], (req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  sendBuildFile(res, next, `pages${req.path.replace(/\/$/, '')}.html`);
});
router.get('/vitrine', (req, res, next) => sendBuildFile(res, next, 'pages/vitrine.html'));
router.get('/product/:id', (req, res, next) => {
  if (!/^[a-z0-9-]+$/.test(req.params.id)) return sendNotFound(req, res, next);
  res.sendFile(path.join(frontendDirectory, 'pages/product', `${req.params.id}.html`), (error) => {
    if (!error) return;
    if (error.code === 'ENOENT') return sendNotFound(req, res, next);
    next(error);
  });
});

export function sendNotFound(req, res, next) {
  res.set('X-Robots-Tag', 'noindex');
  sendBuildFile(res, next, 'pages/404.html', 404);
}

export default router;
