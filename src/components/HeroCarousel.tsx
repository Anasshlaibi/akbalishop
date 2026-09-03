import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { slides, products, setActiveTab, setSelectedProduct, resetFilters } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute active main slides from context slides or fallback
  const mainSlides = useMemo(() => {
    const activeMain = (slides || []).filter(s => s.type === 'main' && s.isActive !== false);
    if (activeMain.length === 0) return [];
    
    return activeMain.map(slide => {
      const linkedProduct = slide.productId ? products.find(p => p.id === slide.productId || p.slug === slide.productId) : null;
      return {
        id: slide.id,
        badge: slide.badge || 'PROMO EXCLUSIVE',
        title: slide.title,
        subtitle: slide.subtitle || linkedProduct?.shortDescription || '',
        price: slide.price || (linkedProduct ? (linkedProduct.price.toLocaleString('fr-FR') + ' DH') : ''),
        oldPrice: slide.oldPrice || (linkedProduct?.oldPrice ? (linkedProduct.oldPrice.toLocaleString('fr-FR') + ' DH') : undefined),
        image: slide.image || linkedProduct?.image || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
        ctaText: slide.ctaText || 'Commander le Kit Cinéma',
        stockBadge: slide.stockBadge || 'Stock Marrakech',
        product: linkedProduct
      };
    });
  }, [slides, products]);

  // Compute active secondary promotional banners
  const secondaryBanners = useMemo(() => {
    const activeSec = (slides || []).filter(s => s.type === 'secondary' && s.isActive !== false);
    if (activeSec.length === 0) return [];

    return activeSec.map(slide => {
      const linkedProduct = slide.productId ? products.find(p => p.id === slide.productId || p.slug === slide.productId) : null;
      return {
        id: slide.id,
        badge: slide.badge || 'OFFRE SPÉCIALE',
        title: slide.title,
        price: slide.price || (linkedProduct ? (linkedProduct.price.toLocaleString('fr-FR') + ' DH') : ''),
        oldPrice: slide.oldPrice || (linkedProduct?.oldPrice ? (linkedProduct.oldPrice.toLocaleString('fr-FR') + ' DH') : undefined),
        image: slide.image || linkedProduct?.image || '/wp-content/uploads/AkabliShop-Lens.webp',
        ctaText: slide.ctaText || 'Profiter de l\'offre',
        product: linkedProduct
      };
    });
  }, [slides, products]);

  const handleSlideChange = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const nextSlide = () => {
    if (mainSlides.length === 0) return;
    handleSlideChange((currentIndex + 1) % mainSlides.length);
  };

  const prevSlide = () => {
    if (mainSlides.length === 0) return;
    handleSlideChange((currentIndex - 1 + mainSlides.length) % mainSlides.length);
  };

  useEffect(() => {
    if (!isPaused && mainSlides.length > 1) {
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
  const secondaryBanner = secondaryBanners[currentIndex % (secondaryBanners.length || 1)] || secondaryBanners[0];

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
              <div className={'grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 my-auto transition-all duration-500 ease-out ' + (
                isAnimating ? 'opacity-0 scale-[0.98] translate-y-2' : 'opacity-100 scale-100 translate-y-0'
              )}>
                
                {/* Text Area */}
                <div className="sm:col-span-7 space-y-3.5 text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full badge-amber text-[10px] font-extrabold tracking-wider">
                    <Zap className="w-3 h-3 text-slate-900" />
                    <span>{currentSlide.badge}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display text-slate-900 leading-snug">
                    {currentSlide.title}
                  </h2>

                  {currentSlide.subtitle && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {currentSlide.subtitle}
                    </p>
                  )}

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
                      {currentSlide.stockBadge || 'Stock Marrakech'}
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
                    onClick={() => handleSlideChange(idx)}
                    className={'h-2 rounded-full transition-all ' + (
                      currentIndex === idx 
                        ? 'w-6 bg-amber-600' 
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    )}
                    aria-label={'Aller au slide ' + (idx + 1)}
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
                <span>{secondaryBanner.ctaText || "Profiter de l'offre"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
