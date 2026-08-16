import React, { useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { enrichProductWithSeo } from '../../utils/seoGenerator';

export const MetaManager: React.FC = () => {
  const { activeTab, selectedProduct, selectedCategory } = useShop();

  useEffect(() => {
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

    if (activeTab === 'product' && selectedProduct) {
      const p = enrichProductWithSeo(selectedProduct);

      // 1. Title & Meta Description & Canonical
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

      // 4. Dynamic Product JSON-LD Schema
      const schemaId = 'dynamic-product-jsonld';
      let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': p.name,
        'image': [p.image, ...(p.gallery || [])].filter(Boolean),
        'description': p.description || p.shortDescription || p.seoDescription,
        'sku': p.id,
        'brand': {
          '@type': 'Brand',
          'name': p.brand || 'AKABLISHOP'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': p.rating || 5.0,
          'reviewCount': p.reviewCount || 10
        },
        'offers': {
          '@type': 'Offer',
          'url': p.canonicalUrl || window.location.href,
          'priceCurrency': 'MAD',
          'price': p.price,
          'priceValidUntil': '2027-12-31',
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
            'item': 'https://akablishop.ma/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': p.category,
            'item': `https://akablishop.ma/?category=${encodeURIComponent(p.category)}`
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
      const categoryName = selectedCategory && selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'Boutique';
      document.title = `${categoryName} Matériel Audiovisuel | AKABLISHOP Marrakech`;
      updateMetaTag('meta[name="description"]', 'content', `Achetez et louez votre matériel audiovisuel ${categoryName} à Marrakech. Caméras, objectifs, éclairage studio Godox, gimbals DJI et micros Røde.`);
      updateMetaTag('link[rel="canonical"]', 'href', 'https://akablishop.ma/?tab=shop');
    } else if (activeTab === 'contact') {
      document.title = `Contact & Magasin à Marrakech | AKABLISHOP Maroc`;
      updateMetaTag('link[rel="canonical"]', 'href', 'https://akablishop.ma/?tab=contact');
    } else {
      document.title = `AKABLISHOP | Vente & Location Matériel Audiovisuel Marrakech Maroc`;
      updateMetaTag('link[rel="canonical"]', 'href', 'https://akablishop.ma/');
    }
  }, [activeTab, selectedProduct, selectedCategory]);

  return null;
};
