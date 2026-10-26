import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import localSeo from '../src/data/localSeo.json' with { type: 'json' };

const domain = 'https://www.akablishop.ma';
const source = await readFile('src/lib/supabase.ts', 'utf8');
const defaultUrl = source.match(/const defaultUrl = '([^']+)'/)?.[1];
const defaultKey = source.match(/const defaultKey = '([^']+)'/)?.[1];
const env = loadEnv('production', process.cwd(), 'VITE_');
const url = env.VITE_SUPABASE_URL || defaultUrl;
const key = env.VITE_SUPABASE_ANON_KEY || defaultKey;
if (!url || !key) throw new Error('Public catalog API configuration is missing');

let response;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    response = await fetch(`${url}/rest/v1/products?select=id,slug,name,brand,category,image,short_description,description,seo_title,seo_description,seo_noindex,is_occasion,is_rental&limit=1000`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15000)
    });
    break;
  } catch (error) {
    if (attempt === 2) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
}
if (!response.ok) throw new Error(`Catalog API returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
const allRows = await response.json();
if (!Array.isArray(allRows) || allRows.length === 0) throw new Error('Catalog API returned no products');
if (allRows.length === 1000) throw new Error('Catalog exceeds the 1000-product page limit');
const rows = allRows.filter(row => row.id !== '__hero_slides_config__' && !row.seo_noindex);
if (!Array.isArray(rows) || rows.length === 0) throw new Error('Catalog API returned no products');

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const clean = value => String(value ?? '').trim().replace(/\s+/g, ' ');
const setMeta = (html, selector, value) => html.replace(selector, (_, start, end) => `${start}${escapeHtml(value)}${end}`);
const template = await readFile('dist/index.html', 'utf8');
const sitemap = [`${domain}/`];
const seen = new Set();
const categoryPath = slug => slug ? `/marrakech/${encodeURIComponent(slug)}/` : '/marrakech/';
const categoryFor = row => {
  const category = clean(row.category).toLowerCase();
  if (['camera', 'cameras', 'appareils-photo'].includes(category)) return 'cameras';
  if (['objectif', 'objectifs', 'lenses'].includes(category)) return 'objectifs';
  if (['eclairage', 'lighting'].includes(category)) return 'eclairage';
  if (['audio', 'son'].includes(category)) return 'audio';
  if (['stabilisateurs', 'stabilizers'].includes(category)) return 'stabilisateurs';
  if (['occasion', 'occasions'].includes(category)) return 'occasions';
  if (['location', 'rental'].includes(category)) return 'location';
  return 'accessoires';
};
const belongsToCategory = (row, slug) => slug === 'occasions'
  ? Boolean(row.is_occasion) || categoryFor(row) === 'occasions'
  : slug === 'location' ? Boolean(row.is_rental) || categoryFor(row) === 'location'
    : categoryFor(row) === slug;
const productLink = row => `<li><a href="/produits/${encodeURIComponent(row.slug || row.id)}/">${escapeHtml(row.name)}</a></li>`;
const pageHtml = ({ title, description, canonical, image, type = 'website', body, schema }) => {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, /(<meta name="title" content=")[^"]*("\s*\/>)/, title);
  html = setMeta(html, /(<meta name="description" content=")[^"]*("\s*\/>)/, description);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*("\s*\/>)/, canonical);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*("\s*\/>)/, canonical);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*("\s*\/>)/, title);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*("\s*\/>)/, description);
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*("\s*\/>)/, image);
  html = setMeta(html, /(<meta name="twitter:url" content=")[^"]*("\s*\/>)/, canonical);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*("\s*\/>)/, title);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*("\s*\/>)/, description);
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*("\s*\/>)/, image);
  html = html.replace('<meta property="og:type" content="website" />', `<meta property="og:type" content="${type}" />`);
  if (schema) html = html.replace('</head>', `<script id="prerender-product-jsonld" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n</head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
};
const writePage = async (path, html) => {
  const folder = join('dist', ...path.split('/').filter(Boolean));
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
};

for (const row of rows) {
  if (!row.id || !row.name) continue;
  const slug = String(row.slug || row.id);
  if (seen.has(slug)) throw new Error(`Duplicate product slug: ${slug}`);
  seen.add(slug);
  const path = `/produits/${encodeURIComponent(slug)}/`;
  const canonical = `${domain}${path}`;
  const editorialTitle = clean(row.seo_title);
  const title = editorialTitle && editorialTitle.length <= 70 ? editorialTitle : `${clean(row.name)} | AKABLISHOP Marrakech`;
  const snippet = clean(row.short_description) || clean(row.description);
  const cleanSnippet = snippet.length > 130 ? `${snippet.slice(0, 127).trimEnd()}...` : snippet;
  const description = snippet ? `${clean(row.name)} chez AKABLISHOP à Marrakech. ${cleanSnippet}` : `Découvrez ${clean(row.name)} chez AKABLISHOP à Marrakech. Contactez-nous pour connaître la disponibilité et les modalités de retrait.`;
  const image = row.image ? new URL(row.image, domain).href : `${domain}/logo.png`;
  const category = categoryFor(row);
  const schema = {
    '@context': 'https://schema.org', '@type': 'Product', name: row.name,
    image: [image], description, sku: String(row.id),
    brand: { '@type': 'Brand', name: row.brand || 'AKABLISHOP' }, url: canonical
  };
  const body = `<main><nav><a href="/">AKABLISHOP</a> / <a href="${categoryPath(category)}">${escapeHtml(localSeo.find(item => item.slug === category)?.name || 'Catalogue Marrakech')}</a></nav><article><h1>${escapeHtml(row.name)}</h1><img src="${escapeHtml(image)}" alt="${escapeHtml(row.name)}" width="600" height="600" /><p>${escapeHtml(description)}</p><p>${escapeHtml(clean(row.description))}</p><p>Découvrez ce produit chez AKABLISHOP à Marrakech. Contactez l'équipe pour confirmer sa disponibilité et les modalités de retrait.</p><a href="/contact/">Contacter le showroom</a></article></main>`;
  await writePage(path, pageHtml({ title, description, canonical, image, type: 'product', body, schema }));
  sitemap.push(canonical);
}

const catalogTitle = 'Matériel photo et vidéo à Marrakech | AKABLISHOP';
const catalogDescription = 'Explorez les caméras, objectifs, éclairages et accessoires photo et vidéo du catalogue AKABLISHOP à Marrakech.';
const categoryLinks = localSeo.map(item => `<li><a href="${categoryPath(item.slug)}">${escapeHtml(item.name)}</a></li>`).join('');
const catalogBody = `<main><h1>Matériel photo et vidéo à Marrakech</h1><p>${escapeHtml(catalogDescription)}</p><p>Vente et location selon les produits. Contactez le showroom pour confirmer disponibilité et retrait.</p><nav aria-label="Catégories"><ul>${categoryLinks}</ul></nav><h2>Produits du catalogue</h2><ul>${rows.filter(row => row.id && row.name).map(productLink).join('')}</ul><a href="/contact/">Contacter AKABLISHOP</a></main>`;
await writePage(categoryPath(), pageHtml({ title: catalogTitle, description: catalogDescription, canonical: `${domain}${categoryPath()}`, image: `${domain}/logo.png`, body: catalogBody }));
sitemap.push(`${domain}${categoryPath()}`);

for (const category of localSeo) {
  const products = rows.filter(row => row.id && row.name && belongsToCategory(row, category.slug));
  if (!products.length) continue;
  const path = categoryPath(category.slug);
  const body = `<main><nav><a href="/">AKABLISHOP</a> / <a href="${categoryPath()}">Catalogue Marrakech</a></nav><h1>${escapeHtml(category.name)} à Marrakech</h1><p>${escapeHtml(category.description)}</p><p>${escapeHtml(category.detail)}</p><h2>Produits de cette catégorie</h2><ul>${products.map(productLink).join('')}</ul><p>Pour confirmer disponibilité, prix et retrait à Marrakech, <a href="/contact/">contactez le showroom</a>.</p></main>`;
  await writePage(path, pageHtml({ title: category.title, description: category.description, canonical: `${domain}${path}`, image: `${domain}/logo.png`, body }));
  sitemap.push(`${domain}${path}`);
}

const contactBody = `<main><h1>Contact et showroom photo vidéo à Marrakech</h1><p>Contactez AKABLISHOP pour une question sur un produit, un devis ou un retrait au showroom.</p><address>AKABLISHOP, Marrakech, Maroc. <a href="tel:+212701896033">+212 701 896 033</a> · <a href="mailto:akablishopmarrakech@gmail.com">akablishopmarrakech@gmail.com</a></address><p><a href="https://www.google.com/maps?q=31.614086,-8.066086">Voir l'emplacement sur Google Maps</a></p><a href="${categoryPath()}">Parcourir les produits</a></main>`;
await writePage('/contact/', pageHtml({ title: 'Contact et showroom photo vidéo à Marrakech | AKABLISHOP', description: 'Contactez AKABLISHOP à Marrakech pour la vente et la location de matériel photo et vidéo. Appelez, écrivez ou demandez un devis pour votre équipement.', canonical: `${domain}/contact/`, image: `${domain}/logo.png`, body: contactBody }));
sitemap.push(`${domain}/contact/`);

const homeBody = `<main><h1>AKABLISHOP, matériel photo et vidéo à Marrakech</h1><p>Caméras, objectifs, éclairages et accessoires photo et vidéo. Vente et location selon les produits.</p><nav aria-label="Catalogue Marrakech"><a href="${categoryPath()}">Explorer le catalogue</a><ul>${categoryLinks}</ul></nav><h2>Produits du catalogue</h2><ul>${rows.filter(row => row.id && row.name).slice(0, 24).map(productLink).join('')}</ul><a href="/contact/">Contacter le showroom</a></main>`;
await writeFile('dist/index.html', template.replace('<div id="root"></div>', `<div id="root">${homeBody}</div>`));

await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(loc => `  <url><loc>${escapeHtml(loc)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generated ${seen.size} product pages, local category pages, and ${sitemap.length} sitemap entries from the live catalog`);
