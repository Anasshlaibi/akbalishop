import { Product } from '../types';

export const SITE_DOMAIN = 'https://www.akablishop.ma';

export function getProductPath(product: Partial<Product>): string {
  return `/produits/${encodeURIComponent(product.slug || product.id || '')}/`;
}

export function getCategoryPath(slug?: string | null): string {
  return slug ? `/marrakech/${encodeURIComponent(slug)}/` : '/marrakech/';
}

export function normalizeText(text?: string): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

export function generateSeoTitle(product: Partial<Product>): string {
  const name = normalizeText(product.name || 'Produit Audiovisuel');
  const editorialTitle = normalizeText(product.seoTitle);
  if (editorialTitle && editorialTitle.length <= 70) return editorialTitle;
  return `${name} | AKABLISHOP Marrakech`;
}

export function generateSeoDescription(product: Partial<Product>): string {
  const name = normalizeText(product.name || 'Matériel Audiovisuel');
  const descSnippet = normalizeText(product.shortDescription || product.description || '');
  const cleanSnippet = descSnippet.length > 130 ? descSnippet.slice(0, 127).trimEnd() + '...' : descSnippet;

  if (cleanSnippet) {
    return `${name} chez AKABLISHOP à Marrakech. ${cleanSnippet}`;
  }

  return `Découvrez ${name} chez AKABLISHOP à Marrakech. Contactez-nous pour connaître la disponibilité et les modalités de retrait.`;
}

export function generateSeoH1(product: Partial<Product>): string {
  if (product.seoH1 && product.seoH1.trim()) {
    return normalizeText(product.seoH1);
  }
  return normalizeText(product.name || 'Détails du Produit');
}

export function generateSeoKeywords(product: Partial<Product>): string {
  if (product.seoKeywords && product.seoKeywords.trim()) {
    return normalizeText(product.seoKeywords);
  }
  const name = normalizeText(product.name || '');
  const brand = normalizeText(product.brand || '');
  const category = normalizeText(product.category || '');

  const baseKeywords = [
    name,
    brand,
    `${brand} Maroc`,
    `${name} prix Maroc`,
    `achat ${name} Marrakech`,
    `${category} Maroc`,
    'AKABLISHOP Marrakech',
    'matériel audiovisuel Maroc'
  ];

  return Array.from(new Set(baseKeywords.filter(Boolean))).join(', ');
}

export function generateSeoAltText(product: Partial<Product>, index = 0): string {
  if (product.seoAltText && product.seoAltText.trim() && index === 0) {
    return normalizeText(product.seoAltText);
  }
  const name = normalizeText(product.name || 'Matériel Audiovisuel');
  const brand = normalizeText(product.brand || 'AKABLISHOP');
  const viewSuffix = index > 0 ? ` vue ${index + 1}` : '';
  
  return `${brand} ${name}${viewSuffix} - Matériel Audiovisuel Professionnel Marrakech Maroc`;
}

export function generateCanonicalUrl(product: Partial<Product>): string {
  return `${SITE_DOMAIN}${getProductPath(product)}`;
}

export function generateOpenGraph(product: Partial<Product>) {
  return {
    title: product.ogTitle || generateSeoTitle(product),
    description: product.ogDescription || generateSeoDescription(product),
    image: product.ogImage || product.image || `${SITE_DOMAIN}/logo.png`,
    url: generateCanonicalUrl(product),
    type: 'product'
  };
}

export function enrichProductWithSeo(product: Product): Product {
  const seoTitle = generateSeoTitle(product);
  const seoDescription = generateSeoDescription(product);
  const seoH1 = generateSeoH1(product);
  const seoKeywords = generateSeoKeywords(product);
  const seoAltText = generateSeoAltText(product);
  const canonicalUrl = generateCanonicalUrl(product);
  const og = generateOpenGraph(product);

  return {
    ...product,
    seoTitle,
    seoDescription,
    seoH1,
    seoKeywords,
    seoShortDescription: product.seoShortDescription || product.shortDescription || seoDescription.slice(0, 150),
    seoAltText,
    canonicalUrl,
    ogTitle: og.title,
    ogDescription: og.description,
    ogImage: og.image,
    seoNoindex: Boolean(product.seoNoindex)
  };
}
