import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render, renderHighlights, renderIcons, getMetadata, siteUrl } from '../dist-ssr/prerender.js';

const dist = new URL('../dist/', import.meta.url);
const publicDirectory = new URL('../../../api/public/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
const catalog = JSON.parse(await readFile(new URL('assets/data/catalog.json', publicDirectory), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
const origin = new URL(siteUrl);
if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/') throw new Error('VITE_SITE_URL deve ser a origem HTTP(S) do site, sem caminho.');

function head(pathname) {
  const meta = getMetadata(pathname, catalog);
  return `<title>${escape(meta.title)}</title>
    <meta name="description" content="${escape(meta.description)}">
    <meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow'}">
    <link rel="canonical" href="${escape(meta.url)}">
    <meta property="og:title" content="${escape(meta.title)}">
    <meta property="og:description" content="${escape(meta.description)}">
    <meta property="og:url" content="${escape(meta.url)}">
    <meta property="og:image" content="${escape(meta.image)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_BR">
    ${meta.structuredData ? `<script id="structured-data" type="application/ld+json">${json(meta.structuredData)}</script>` : ''}`;
}

const publicPaths = ['/vitrine', ...catalog.products.map(({ id }) => {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`ID de produto inválido: ${id}`);
  return `/product/${id}`;
})];
for (const pathname of [...publicPaths, '/login', '/admin', '/404']) {
  const file = new URL(`pages${pathname}.html`, dist);
  await mkdir(new URL('.', file), { recursive: true });
  const html = template.replace(/<title>[\s\S]*?<\/title>/, () => head(pathname))
    .replace('<div id="root"></div>', () => `<div id="root">${render(pathname, catalog)}</div><script id="catalog-data" type="application/json">${json(catalog)}</script>`);
  await writeFile(file, html);
}
await writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...publicPaths].map((path) => `<url><loc>${escape(siteUrl + path)}</loc></url>`).join('')}</urlset>`);
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nDisallow: /auth/\nDisallow: /admin/\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(new URL('assets/icons.svg', publicDirectory), renderIcons());
let home = await readFile(new URL('index.html', publicDirectory), 'utf8');
home = home.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, () => `<!-- seo:start -->\n${head('/')}\n<!-- seo:end -->`);
home = home.replace(/<!-- highlights:start -->[\s\S]*?<!-- highlights:end -->/, () => `<!-- highlights:start -->${renderHighlights(catalog)}<!-- highlights:end -->`);
await writeFile(new URL('index.html', publicDirectory), home);
console.log(`HTML gerado para ${publicPaths.length} páginas públicas, login, administração e 404. Origem: ${siteUrl}`);
