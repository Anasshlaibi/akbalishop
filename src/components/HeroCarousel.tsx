import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { products, setActiveTab, setSelectedProduct, resetFilters } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Find dynamic products from Supabase/ShopContext
  const fx6Product = products && products.length > 0 ? (products.find(p => p.id === 'sony-fx6-cinema') || products[0]) : null;
  const nikonProduct = products && products.length > 0 ? (products.find(p => p.id === 'nikon-z7-mark-ii') || products[1] || products[0]) : null;
  const a7sProduct = products && products.length > 0 ? (products.find(p => p.id === 'sony-a7s-iii-occasion') || products[2] || products[0]) : null;

  const mainSlides = [
    {
      id: fx6Product?.id || 'sony-fx6-cinema',
      badge: 'CINEMA LINE • EN VEDETTE',
      title: fx6Product?.name || 'Sony FX6 – Caméra Cinéma 4K',
      subtitle: fx6Product?.shortDescription || 'Capteur plein format Exmor R 10.2 MP, 15+ stops dynamique et filtre ND variable.',
      price: fx6Product ? `${fx6Product.price.toLocaleString('fr-FR')} DH` : '73.000 DH',
      oldPrice: fx6Product?.oldPrice ? `${fx6Product.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: fx6Product?.image || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
      ctaText: 'Commander le Kit Cinéma',
      product: fx6Product
    },
    {
      id: nikonProduct?.id || 'nikon-z7-mark-ii',
      badge: 'HYBRIDE PLEIN FORMAT',
      title: nikonProduct?.name || 'NIKON Z 7II Boîtier Nu 45.7 MP',
      subtitle: nikonProduct?.shortDescription || 'Double processeur EXPEED 6, vidéo 4K 60p et système AF haute précision.',
      price: nikonProduct ? `${nikonProduct.price.toLocaleString('fr-FR')} DH` : '38.400 DH',
      oldPrice: nikonProduct?.oldPrice ? `${nikonProduct.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: nikonProduct?.image || '/wp-content/uploads/NIKON-Z7-MARK-II-jpg-300x300.webp',
      ctaText: 'Découvrir l\'Offre Nikon',
      product: nikonProduct
    },
    {
      id: a7sProduct?.id || 'sony-a7s-iii-occasion',
      badge: 'SECONDE MAIN CERTIFIÉE',
      title: a7sProduct?.name || 'Sony a7S III – Boîtier Nu (Bon Occasion)',
      subtitle: a7sProduct?.shortDescription || 'Capteur 12.1 MP 4K 120p, révisé dans nos ateliers avec garantie 6 mois AKABLISHOP.',
      price: a7sProduct ? `${a7sProduct.price.toLocaleString('fr-FR')} DH` : '31.200 DH',
      oldPrice: a7sProduct?.oldPrice ? `${a7sProduct.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: a7sProduct?.image || '/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png',
      ctaText: 'Voir l\'Occasion Certifiée',
      product: a7sProduct
    }
  ];

  // Secondary dynamic banners
  const lensProduct = products && products.length > 0 ? (products.find(p => p.id === 'sony-fe-24-70mm-f28-gm-ii') || products[3] || products[0]) : null;
  const godoxProduct = products && products.length > 0 ? (products.find(p => p.id === 'godox-sl60w-led-light') || products[4] || products[0]) : null;
  const rodeProduct = products && products.length > 0 ? (products.find(p => p.id === 'rode-wireless-pro') || products[5] || products[0]) : null;

  const secondaryBanners = [
    {
      badge: 'OBJECTIF G MASTER',
      title: lensProduct?.name || 'Sony FE 24-70mm f/2.8 GM II',
      price: lensProduct ? `${lensProduct.price.toLocaleString('fr-FR')} DH` : '24.500 DH',
      oldPrice: lensProduct?.oldPrice ? `${lensProduct.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: lensProduct?.image || '/wp-content/uploads/AkabliShop-Lens.webp',
      product: lensProduct
    },
    {
      badge: 'ÉCLAIRAGE STUDIO',
      title: godoxProduct?.name || 'Godox SL60W Projecteur LED',
      price: godoxProduct ? `${godoxProduct.price.toLocaleString('fr-FR')} DH` : '1.850 DH',
      oldPrice: godoxProduct?.oldPrice ? `${godoxProduct.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: godoxProduct?.image || '/wp-content/uploads/electronics-store-85-300x266.png',
      product: godoxProduct
    },
    {
      badge: 'SON SANS FIL 32-BIT',
      title: rodeProduct?.name || 'Røde Wireless PRO Kit',
      price: rodeProduct ? `${rodeProduct.price.toLocaleString('fr-FR')} DH` : '5.200 DH',
      oldPrice: rodeProduct?.oldPrice ? `${rodeProduct.oldPrice.toLocaleString('fr-FR')} DH` : undefined,
      image: rodeProduct?.image || '/wp-content/uploads/electronics-store-86-300x266.png',
      product: rodeProduct
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mainSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mainSlides.length) % mainSlides.length);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex, mainSlides.length]);

  const handleProductClick = (productObj: any) => {
    if (productObj && productObj.id) {
      setSelectedProduct(productObj.id);
      setActiveTab('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      resetFilters();
      setActiveTab('shop');
    }
  };

  const currentSlide = mainSlides[currentIndex] || mainSlides[0];
  const secondaryBanner = secondaryBanners[currentIndex] || secondaryBanners[0];

  return (
    <section 
      className="py-6 bg-slate-50 border-b border-gray-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Layout: 65-70% Main Carousel + 30-35% Secondary Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Large Carousel (70% width) */}
          <div className="lg:col-span-8 relative rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm min-h-[360px] sm:min-h-[420px]">
            
            {/* Ambient Light Backdrop */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Body Content */}
            {currentSlide && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 my-auto">
                
                {/* Text Area */}
                <div className="sm:col-span-7 space-y-3.5 text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full badge-amber text-[10px] font-extrabold tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>{currentSlide.badge}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display text-slate-900 leading-snug">
                    {currentSlide.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {currentSlide.subtitle}
                  </p>

                  {/* Price Display */}
                  <div className="flex items-baseline space-x-3 pt-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {currentSlide.price}
                    </span>
                    {currentSlide.oldPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {currentSlide.oldPrice}
                      </span>
                    )}
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleProductClick(currentSlide.product)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all inline-flex items-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{currentSlide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Product Artwork Image */}
                <div className="sm:col-span-5 flex items-center justify-center">
                  <div 
                    onClick={() => handleProductClick(currentSlide.product)}
                    className="relative aspect-square w-48 sm:w-full max-w-[240px] rounded-2xl bg-slate-50 p-4 border border-gray-200 flex items-center justify-center cursor-pointer group shadow-inner"
                  >
                    <img 
                      src={currentSlide.image} 
                      alt={currentSlide.title}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[9px] text-amber-700 font-bold shadow-sm">
                      Stock Marrakech
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Slider Navigation Arrows & Dot Indicators */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
              
              {/* Slide Dots */}
              <div className="flex items-center space-x-2">
                {mainSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx 
                        ? 'w-6 bg-amber-600' 
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Aller au slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 hover:border-amber-400 transition-all"
                  aria-label="Slide précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 hover:border-amber-400 transition-all"
                  aria-label="Slide suivant"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Secondary Promotional Banner (30% width) */}
          {secondaryBanner && (
            <div 
              onClick={() => handleProductClick(secondaryBanner.product)}
              className="lg:col-span-4 rounded-3xl bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group min-h-[360px] sm:min-h-[420px]"
            >
              <div className="space-y-2 relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase">
                  {secondaryBanner.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {secondaryBanner.title}
                </h3>
                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-xl font-extrabold text-slate-900">{secondaryBanner.price}</span>
                  {secondaryBanner.oldPrice && (
                    <span className="text-xs text-slate-400 line-through">{secondaryBanner.oldPrice}</span>
                  )}
                </div>
              </div>

              {/* Artwork Image */}
              <div className="my-auto py-4 flex items-center justify-center relative z-10">
                <div className="w-44 h-44 rounded-2xl bg-slate-50 p-3 border border-gray-100 flex items-center justify-center">
                  <img 
                    src={secondaryBanner.image} 
                    alt={secondaryBanner.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Bottom Link Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700 relative z-10">
                <span>Profiter de l'offre</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
