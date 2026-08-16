import { Product } from '../types';

export const SITE_DOMAIN = 'https://akablishop.ma';

export function normalizeText(text?: string): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

export function generateSeoTitle(product: Partial<Product>): string {
  if (product.seoTitle && product.seoTitle.trim()) {
    return normalizeText(product.seoTitle);
  }

  const name = normalizeText(product.name || 'Produit Audiovisuel');
  const brand = normalizeText(product.brand || 'AKABLISHOP');
  const category = (product.category || '').toLowerCase();
  
  const startsWithBrand = name.toLowerCase().startsWith(brand.toLowerCase());
  const displayName = startsWithBrand ? name : `${brand} ${name}`;

  if (category.includes('camera') || category.includes('appareil')) {
    return `${displayName} – Caméra & Boîtier Plein Format | Prix au Maroc | AKABLISHOP`;
  }
  if (category.includes('obj') || category.includes('lens')) {
    return `${displayName} – Objectif Photo & Cinéma | Prix au Maroc | AKABLISHOP`;
  }
  if (category.includes('eclair') || category.includes('light')) {
    return `${displayName} – Éclairage Studio Photo & Vidéo au Maroc | AKABLISHOP`;
  }
  if (category.includes('audio') || category.includes('mic') || category.includes('son')) {
    return `${displayName} – Microphone Professionnel Photo & Vidéo au Maroc | AKABLISHOP`;
  }
  if (category.includes('stabilis') || category.includes('gimbal')) {
    return `${displayName} – Stabilisateur Gimbal 3 Axes au Maroc | AKABLISHOP`;
  }
  if (category.includes('occas') || product.isOccasion) {
    return `${displayName} – Occasion Révisée Garantie au Maroc | AKABLISHOP`;
  }
  if (category.includes('locat') || product.isRental) {
    return `${displayName} – Location Matériel Tournage Marrakech Maroc | AKABLISHOP`;
  }

  return `${displayName} – Matériel Audiovisuel Professionnel au Maroc | AKABLISHOP`;
}

export function generateSeoDescription(product: Partial<Product>): string {
  if (product.seoDescription && product.seoDescription.trim()) {
    return normalizeText(product.seoDescription);
  }

  const name = normalizeText(product.name || 'Matériel Audiovisuel');
  const brand = normalizeText(product.brand || 'AKABLISHOP');
  const priceFormatted = product.price ? `${product.price.toLocaleString('fr-FR')} DH` : 'Meilleur prix';
  const descSnippet = normalizeText(product.shortDescription || product.description || '');
  const cleanSnippet = descSnippet.length > 90 ? descSnippet.slice(0, 90) + '...' : descSnippet;

  if (cleanSnippet) {
    return `Achetez ${name} (${brand}) au meilleur prix au Maroc (${priceFormatted}) chez AKABLISHOP Marrakech. ${cleanSnippet} Livraison sécurisée.`;
  }

  return `Découvrez ${name} par ${brand} chez AKABLISHOP Marrakech. Vente & location de matériel audiovisuel certifié au Maroc au prix de ${priceFormatted}.`;
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
  if (product.canonicalUrl && product.canonicalUrl.trim()) {
    return normalizeText(product.canonicalUrl);
  }
  const idOrSlug = product.slug || product.id || '';
  return `${SITE_DOMAIN}/?product=${idOrSlug}`;
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
