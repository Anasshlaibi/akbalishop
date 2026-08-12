import React, { useEffect } from 'react';
import { useShop } from '../../context/ShopContext';

export const MetaManager: React.FC = () => {
  const { activeTab, selectedProduct, selectedCategory } = useShop();

  useEffect(() => {
    // 1. Dynamic Page Titles & Descriptions
    if (activeTab === 'product' && selectedProduct) {
      document.title = `${selectedProduct.name} - AKABLISHOP Marrakech Maroc`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const descText = selectedProduct.shortDescription || selectedProduct.description;
        metaDesc.setAttribute(
          'content',
          `${selectedProduct.name} chez AKABLISHOP Marrakech. ${descText.slice(0, 140)}... Vente et location au meilleur prix au Maroc.`
        );
      }

      // 2. Inject Dynamic Product JSON-LD Schema
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
        'name': selectedProduct.name,
        'image': [selectedProduct.image, ...(selectedProduct.gallery || [])],
        'description': selectedProduct.description || selectedProduct.shortDescription,
        'sku': selectedProduct.id,
        'brand': {
          '@type': 'Brand',
          'name': selectedProduct.brand || 'AKABLISHOP'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': selectedProduct.rating || 5.0,
          'reviewCount': selectedProduct.reviewCount || 10
        },
        'offers': {
          '@type': 'Offer',
          'url': window.location.href,
          'priceCurrency': 'MAD',
          'price': selectedProduct.price,
          'priceValidUntil': '2027-12-31',
          'itemCondition': selectedProduct.isOccasion ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
          'availability': selectedProduct.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'AKABLISHOP Marrakech'
          }
        }
      };

      scriptTag.textContent = JSON.stringify(productSchema);
    } else if (activeTab === 'shop') {
      const categoryName = selectedCategory && selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'Boutique';
      document.title = `${categoryName} Matériel Audiovisuel | AKABLISHOP Marrakech`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `Achetez et louez votre matériel audiovisuel ${categoryName} à Marrakech. Caméras, objectifs, éclairage studio Godox, gimbals DJI et micros Røde.`
        );
      }
    } else if (activeTab === 'contact') {
      document.title = `Contact & Magasin à Marrakech | AKABLISHOP Maroc`;
    } else {
      document.title = `AKABLISHOP | Vente & Location Matériel Audiovisuel Marrakech Maroc`;
    }
  }, [activeTab, selectedProduct, selectedCategory]);

  return null;
};
