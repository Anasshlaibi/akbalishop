import React, { useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { enrichProductWithSeo, getCategoryPath, SITE_DOMAIN } from '../../utils/seoGenerator';
import { CATEGORIES, normalizeCategorySlug } from '../../data/categories';
import localSeo from '../../data/localSeo.json';

export const MetaManager: React.FC = () => {
  const { activeTab, selectedProduct, selectedCategory, selectedBrand } = useShop();

  useEffect(() => {
    if (activeTab === 'product' && !selectedProduct) return;
    const updateMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        if (selector.startsWith('meta[name=')) {
          element = document.createElement('meta');
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          element = document.createElement('meta');
          const propMatch = selector.match(/property="([^"]+)"/);
          if (propMatch) element.setAttribute('property', propMatch[1]);
        } else if (selector.startsWith('link[rel=')) {
          element = document.createElement('link');
          const relMatch = selector.match(/rel="([^"]+)"/);
          if (relMatch) element.setAttribute('rel', relMatch[1]);
        }
        if (element) document.head.appendChild(element);
      }
      if (element) element.setAttribute(attr, value);
    };
    const updatePageMeta = (title: string, description: string, canonical: string) => {
      document.title = title;
      updateMetaTag('meta[name="description"]', 'content', description);
      updateMetaTag('meta[name="robots"]', 'content', 'index, follow');
      updateMetaTag('link[rel="canonical"]', 'href', canonical);
      updateMetaTag('meta[property="og:type"]', 'content', 'website');
      updateMetaTag('meta[property="og:title"]', 'content', title);
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[property="og:url"]', 'content', canonical);
      updateMetaTag('meta[property="og:image"]', 'content', `${SITE_DOMAIN}/wp-content/uploads/AkabliShop-Head.webp`);
      updateMetaTag('meta[name="twitter:title"]', 'content', title);
      updateMetaTag('meta[name="twitter:description"]', 'content', description);
      updateMetaTag('meta[name="twitter:url"]', 'content', canonical);
      updateMetaTag('meta[name="twitter:image"]', 'content', `${SITE_DOMAIN}/wp-content/uploads/AkabliShop-Head.webp`);
      document.getElementById('dynamic-product-jsonld')?.remove();
      document.getElementById('dynamic-breadcrumb-jsonld')?.remove();
      document.getElementById('prerender-product-jsonld')?.remove();
    };

    if (activeTab === 'product' && selectedProduct) {
      document.getElementById('prerender-product-jsonld')?.remove();
      const p = enrichProductWithSeo(selectedProduct);

      // 1. Title, Meta Description & Canonical
      document.title = p.seoTitle || `${p.name} - AKABLISHOP Marrakech Maroc`;
      updateMetaTag('meta[name="description"]', 'content', p.seoDescription || '');
      updateMetaTag('meta[name="keywords"]', 'content', p.seoKeywords || '');
      updateMetaTag('meta[name="robots"]', 'content', p.seoNoindex ? 'noindex, nofollow' : 'index, follow');
      updateMetaTag('link[rel="canonical"]', 'href', p.canonicalUrl || window.location.href);

      // 2. Open Graph Tags
      updateMetaTag('meta[property="og:title"]', 'content', p.ogTitle || p.seoTitle || p.name);
      updateMetaTag('meta[property="og:description"]', 'content', p.ogDescription || p.seoDescription || '');
      updateMetaTag('meta[property="og:image"]', 'content', p.ogImage || p.image);
      updateMetaTag('meta[property="og:url"]', 'content', p.canonicalUrl || window.location.href);
      updateMetaTag('meta[property="og:type"]', 'content', 'product');

      // 3. Twitter Card Tags
      updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
      updateMetaTag('meta[name="twitter:title"]', 'content', p.ogTitle || p.seoTitle || p.name);
      updateMetaTag('meta[name="twitter:description"]', 'content', p.ogDescription || p.seoDescription || '');
      updateMetaTag('meta[name="twitter:image"]', 'content', p.ogImage || p.image);

      // 4. Dynamic Rich Snippet Product JSON-LD Schema
      const schemaId = 'dynamic-product-jsonld';
      let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const imagesArray = Array.from(new Set([p.image, ...(p.gallery || [])])).filter(Boolean).map(img => {
        return img.startsWith('http') ? img : `${SITE_DOMAIN}${img.startsWith('/') ? '' : '/'}${img}`;
      });

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': p.name,
        'image': imagesArray,
        'description': p.description || p.shortDescription || p.seoDescription,
        'sku': p.id,
        'mpn': p.id,
        'brand': {
          '@type': 'Brand',
          'name': p.brand || 'AKABLISHOP'
        },
        'offers': {
          '@type': 'Offer',
          'url': p.canonicalUrl || window.location.href,
          'priceCurrency': 'MAD',
          'price': p.price,
          'itemCondition': p.isOccasion ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
          'availability': p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'AKABLISHOP Marrakech'
          }
        }
      };

      // 5. Dynamic BreadcrumbList JSON-LD Schema
      const breadcrumbId = 'dynamic-breadcrumb-jsonld';
      let breadcrumbTag = document.getElementById(breadcrumbId) as HTMLScriptElement;
      if (!breadcrumbTag) {
        breadcrumbTag = document.createElement('script');
        breadcrumbTag.id = breadcrumbId;
        breadcrumbTag.type = 'application/ld+json';
        document.head.appendChild(breadcrumbTag);
      }

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Accueil',
            'item': SITE_DOMAIN
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': p.category,
            'item': `${SITE_DOMAIN}${getCategoryPath(normalizeCategorySlug(p.category))}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': p.name,
            'item': p.canonicalUrl || window.location.href
          }
        ]
      };

      scriptTag.textContent = JSON.stringify(productSchema);
      breadcrumbTag.textContent = JSON.stringify(breadcrumbSchema);

    } else if (activeTab === 'shop') {
      const normCat = selectedCategory ? normalizeCategorySlug(selectedCategory) : null;
      const catObj = CATEGORIES.find(c => c.slug === normCat);
      const localCategory = localSeo.find(category => category.slug === normCat);
      const title = localCategory?.title || 'Matériel photo et vidéo à Marrakech | AKABLISHOP';
      const description = localCategory?.description || 'Explorez les caméras, objectifs, éclairages et accessoires photo et vidéo du catalogue AKABLISHOP à Marrakech.';
      updatePageMeta(title, description, `${SITE_DOMAIN}${getCategoryPath(catObj ? normCat : null)}`);
      updateMetaTag('meta[name="keywords"]', 'content', localCategory ? `${localCategory.name}, Marrakech, AKABLISHOP` : 'matériel audiovisuel Marrakech, AKABLISHOP');

    } else if (activeTab === 'contact') {
      updatePageMeta('Contact et showroom photo vidéo à Marrakech | AKABLISHOP', 'Contactez AKABLISHOP à Marrakech pour la vente et la location de matériel photo et vidéo. Appelez, écrivez ou demandez un devis pour votre équipement.', `${SITE_DOMAIN}/contact/`);
    } else {
      updatePageMeta('AKABLISHOP | Matériel photo et vidéo à Marrakech', 'AKABLISHOP propose caméras, objectifs, éclairages et accessoires photo et vidéo à Marrakech, avec vente et location selon les produits.', `${SITE_DOMAIN}/`);
    }
  }, [activeTab, selectedProduct, selectedCategory, selectedBrand]);

  return null;
};
