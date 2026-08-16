import { Product } from '../types';
import { SITE_DOMAIN } from './seoGenerator';

export function generateSitemapXml(products: Product[]): string {
  const lastMod = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${SITE_DOMAIN}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?tab=shop`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?tab=rental`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?tab=contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_DOMAIN}/?category=cameras`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=objectifs`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=eclairage`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=audio`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=stabilisateurs`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_DOMAIN}/?category=accessoires`, priority: '0.7', changefreq: 'weekly' }
  ];

  const productUrls = products
    .filter(p => p.isActive !== false && !p.seoNoindex)
    .map(p => {
      const canonical = p.canonicalUrl || `${SITE_DOMAIN}/?product=${p.slug || p.id}`;
      const title = (p.seoTitle || p.name).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const desc = (p.seoDescription || p.shortDescription || p.name).slice(0, 150).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const imgUrl = (p.image || '').replace(/&/g, '&amp;');

      return `  <url>
    <loc>${canonical}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split('T')[0] : lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${imgUrl ? `<image:image>
      <image:loc>${imgUrl.startsWith('http') ? imgUrl : SITE_DOMAIN + imgUrl}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${desc}</image:caption>
    </image:image>` : ''}
  </url>`;
    });

  const staticXml = staticUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticXml}
${productUrls.join('\n')}
</urlset>`;
}
