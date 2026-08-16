import { Product } from '../types';

export interface SeoAuditCheck {
  label: string;
  passed: boolean;
  warning?: string;
  weight: number;
}

export interface SeoAuditResult {
  score: number; // 0 - 100
  checks: SeoAuditCheck[];
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
}

export function calculateProductSeoScore(product: Partial<Product>): SeoAuditResult {
  const checks: SeoAuditCheck[] = [];

  // 1. Title Tag
  const title = (product.seoTitle || product.name || '').trim();
  const titleLen = title.length;
  const titlePassed = titleLen >= 20 && titleLen <= 75;
  checks.push({
    label: 'Titre SEO (Title Tag)',
    passed: titlePassed,
    warning: !title ? 'Titre manquant' : titleLen < 20 ? 'Titre trop court (<20 caractères)' : titleLen > 75 ? 'Titre trop long (>75 caractères)' : undefined,
    weight: 15
  });

  // 2. Meta Description
  const desc = (product.seoDescription || product.shortDescription || product.description || '').trim();
  const descLen = desc.length;
  const descPassed = descLen >= 80 && descLen <= 170;
  checks.push({
    label: 'Méta-description',
    passed: descPassed,
    warning: !desc ? 'Méta-description manquante' : descLen < 80 ? 'Méta-description trop courte (<80 caractères)' : descLen > 170 ? 'Méta-description trop longue (>170 caractères)' : undefined,
    weight: 15
  });

  // 3. H1 Heading
  const h1 = (product.seoH1 || product.name || '').trim();
  const h1Passed = h1.length >= 5 && h1.length <= 100;
  checks.push({
    label: 'Balise H1 principale',
    passed: h1Passed,
    warning: !h1 ? 'H1 manquant' : undefined,
    weight: 10
  });

  // 4. Image & Alt Text
  const hasImage = Boolean(product.image && product.image.trim());
  const altText = (product.seoAltText || '').trim();
  const imagePassed = hasImage;
  checks.push({
    label: 'Image principale du produit',
    passed: imagePassed,
    warning: !hasImage ? 'Aucune image produit définie' : undefined,
    weight: 10
  });

  const altPassed = hasImage && (Boolean(altText) || Boolean(product.name && product.brand));
  checks.push({
    label: 'Texte alternatif (Alt Text)',
    passed: altPassed,
    warning: !altPassed ? 'Texte alt manquant pour les images' : undefined,
    weight: 10
  });

  // 5. Brand & Category
  const hasBrand = Boolean(product.brand && product.brand.trim());
  checks.push({
    label: 'Marque officielle (Brand)',
    passed: hasBrand,
    warning: !hasBrand ? 'Marque non spécifiée' : undefined,
    weight: 5
  });

  const hasCategory = Boolean(product.category && product.category.trim());
  checks.push({
    label: 'Catégorie de produit',
    passed: hasCategory,
    warning: !hasCategory ? 'Catégorie non spécifiée' : undefined,
    weight: 5
  });

  // 6. Price & Stock Availability
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  checks.push({
    label: 'Prix valide (MAD)',
    passed: hasPrice,
    warning: !hasPrice ? 'Prix manquant ou égal à 0' : undefined,
    weight: 10
  });

  // 7. Product Description Richness
  const fullDesc = (product.description || '').trim();
  const descRich = fullDesc.length >= 80;
  checks.push({
    label: 'Description détaillée (>80 chars)',
    passed: descRich,
    warning: !descRich ? 'Description détaillée trop succinte' : undefined,
    weight: 10
  });

  // 8. Canonical URL & Open Graph Image
  const hasCanonical = Boolean(product.canonicalUrl || product.id || product.slug);
  checks.push({
    label: 'URL canonique',
    passed: hasCanonical,
    warning: !hasCanonical ? 'URL canonique non configurée' : undefined,
    weight: 5
  });

  const hasOgImage = Boolean(product.ogImage || product.image);
  checks.push({
    label: 'Image Open Graph (Partage Réseaux)',
    passed: hasOgImage,
    warning: !hasOgImage ? 'Image Open Graph manquante' : undefined,
    weight: 5
  });

  // Calculate Weighted Score
  const maxPossibleScore = checks.reduce((acc, c) => acc + c.weight, 0);
  const earnedScore = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0);
  const score = Math.min(100, Math.round((earnedScore / maxPossibleScore) * 100));

  let rating: SeoAuditResult['rating'] = 'Critical';
  if (score >= 90) rating = 'Excellent';
  else if (score >= 75) rating = 'Good';
  else if (score >= 50) rating = 'Needs Improvement';

  return {
    score,
    checks,
    rating
  };
}
