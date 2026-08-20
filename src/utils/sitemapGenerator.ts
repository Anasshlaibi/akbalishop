import { Product } from '../types';
import { SITE_DOMAIN, generateSeoAltText } from './seoGenerator';

export function generateSitemapXml(products: Product[]): string {
  const lastMod = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${SITE_DOMAIN}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?tab=shop`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=cameras`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=objectifs`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=eclairage`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=stabilisateurs`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=accessoires`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_DOMAIN}/?category=location`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=occasions`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?tab=contact`, priority: '0.6', changefreq: 'monthly' }
  ];

  const productUrls = products
    .filter(p => p.isActive !== false && !p.seoNoindex)
    .map(p => {
      const canonical = p.canonicalUrl || `${SITE_DOMAIN}/?product=${p.slug || p.id}`;
      const title = (p.seoTitle || p.name).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const desc = (p.seoDescription || p.shortDescription || p.name).slice(0, 150).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const galleryImages = Array.from(new Set([p.image, ...(p.gallery || [])])).filter(Boolean);

      const imageXmlBlocks = galleryImages.map((imgUrl, idx) => {
        const fullImg = imgUrl.startsWith('http') ? imgUrl : `${SITE_DOMAIN}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
        const altText = generateSeoAltText(p, idx).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `    <image:image>\n` +
               `      <image:loc>${fullImg.replace(/&/g, '&amp;')}</image:loc>\n` +
               `      <image:title>${altText}</image:title>\n` +
               `      <image:caption>${desc}</image:caption>\n` +
               `    </image:image>`;
      }).join('\n');

      return `  <url>\n` +
             `    <loc>${canonical}</loc>\n` +
             `    <lastmod>${p.updatedAt ? p.updatedAt.split('T')[0] : lastMod}</lastmod>\n` +
             `    <changefreq>weekly</changefreq>\n` +
             `    <priority>0.8</priority>\n` +
             `${imageXmlBlocks}\n` +
             `  </url>`;
    });

  const staticXml = staticUrls.map(u => `  <url>\n` +
    `    <loc>${u.loc}</loc>\n` +
    `    <lastmod>${lastMod}</lastmod>\n` +
    `    <changefreq>${u.changefreq}</changefreq>\n` +
    `    <priority>${u.priority}</priority>\n` +
    `  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n` +
    `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n` +
    `          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
    `${staticXml}\n` +
    `${productUrls.join('\n')}\n` +
    `</urlset>`;
}
