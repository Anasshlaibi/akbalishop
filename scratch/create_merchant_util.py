import sys

script = '''import { Product } from '../types';
import { SITE_DOMAIN, enrichProductWithSeo } from './seoGenerator';

export function mapCategoryToGoogleTaxonomy(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('camera') || cat.includes('appareil')) {
    return 'Cameras & Optics > Cameras > Video Cameras';
  }
  if (cat.includes('obj') || cat.includes('lens')) {
    return 'Cameras & Optics > Camera & Optic Accessories > Camera Lenses';
  }
  if (cat.includes('eclair') || cat.includes('light')) {
    return 'Cameras & Optics > Photography > Photo Studio & Lighting > Studio Lighting';
  }
  if (cat.includes('audio') || cat.includes('mic') || cat.includes('son')) {
    return 'Electronics > Audio > Microphones';
  }
  if (cat.includes('stabilis') || cat.includes('gimbal')) {
    return 'Cameras & Optics > Camera & Optic Accessories > Camera Tripods & Monopods';
  }
  return 'Cameras & Optics > Camera & Optic Accessories';
}

export function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateGoogleMerchantXml(products: Product[]): string {
  const itemsXml = products
    .filter(p => p.isActive !== false && !p.seoNoindex)
    .map(p => {
      const enriched = enrichProductWithSeo(p);
      const id = escapeXml(p.id);
      const title = escapeXml(enriched.seoTitle || p.name);
      const desc = escapeXml(p.description || p.shortDescription || enriched.seoDescription);
      const link = escapeXml(enriched.canonicalUrl || `${SITE_DOMAIN}/?product=${p.slug || p.id}`);
      
      let imgUrl = p.image || `${SITE_DOMAIN}/logo.png`;
      if (!imgUrl.startsWith('http')) {
        imgUrl = `${SITE_DOMAIN}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
      }
      const imageLink = escapeXml(imgUrl);

      const condition = p.isOccasion || p.condition === 'used' ? 'used' : 'new';
      const availability = p.inStock ? 'in_stock' : 'out_of_stock';
      const priceFormatted = `${p.price.toFixed(2)} MAD`;
      const brand = escapeXml(p.brand || 'AKABLISHOP');
      const googleCat = escapeXml(mapCategoryToGoogleTaxonomy(p.category));

      return `    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${priceFormatted}</g:price>
      <g:brand>${brand}</g:brand>
      <g:google_product_category>${googleCat}</g:google_product_category>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AKABLISHOP – Flux Produits Google Merchant Center</title>
    <link>${SITE_DOMAIN}</link>
    <description>Catalogue officiel des équipements audiovisuels et photo/vidéo AKABLISHOP Marrakech Maroc.</description>
\n${itemsXml}\n
  </channel>
</rss>`;
}
'''

with open('src/utils/googleMerchantFeed.ts', 'w', encoding='utf-8') as f:
    f.write(script)

print('Created googleMerchantFeed.ts')
