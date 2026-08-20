import { generateSeoAltText } from '../utils/seoGenerator';
import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Eye, Heart, Star, RefreshCw, Calendar } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { setQuickViewProduct, setSelectedProduct, setActiveTab } = useShop();

  const isLiked = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateDiscount = () => {
    if (!product.oldPrice || product.oldPrice <= product.price) return null;
    const percentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    return percentage;
  };

  const discount = calculateDiscount();

  if (layout === 'list') {
    return (
      <div className="group rounded-2xl bg-white border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div
          onClick={handleCardClick}
          className="relative w-full sm:w-40 h-36 rounded-xl bg-slate-50 p-3 border border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0"
        >
          <img src={product.image} alt={generateSeoAltText(product)} loading="lazy" decoding="async" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          {product.isOccasion && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold">Occasion</span>
          )}
        </div>

        <div className="flex-1 space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{product.brand}</span>
          <h3 onClick={handleCardClick} className="text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed hidden sm:block">{product.shortDescription}</p>
          <div className="flex items-center space-x-1 text-amber-500 text-xs">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="font-bold text-slate-700">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-base font-extrabold text-slate-900">{product.price.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-amber-700">DH</span></div>
            {product.oldPrice && <div className="text-xs text-slate-400 line-through">{product.oldPrice.toLocaleString('fr-FR')} DH</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleWishlist(product.id)} className={`p-2.5 rounded-xl border transition-all touch-manipulation ${isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-gray-200 text-slate-500'}`}>
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => addToCart(product)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 flex items-center gap-1.5 transition-all touch-manipulation"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">

      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {discount && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-extrabold shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isOccasion && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold shadow-sm flex items-center gap-1">
              <RefreshCw className="w-2 h-2" /><span>Occasion</span>
            </span>
          )}
          {product.isRental && !product.isOccasion && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow-sm flex items-center gap-1">
              <Calendar className="w-2 h-2" /><span>Location</span>
            </span>
          )}
        </div>

        {/* Wishlist — always tappable on mobile */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md border transition-all touch-manipulation ${isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white/90 border-gray-200 text-slate-400'}`}
          aria-label="Favoris"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Product Image */}
      <div
        onClick={handleCardClick}
        className="relative aspect-square w-full bg-slate-50 p-3 flex items-center justify-center cursor-pointer overflow-hidden border-b border-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View — hidden on mobile (tap = navigate), shown on hover desktop */}
        <button
          onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 text-slate-800 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center gap-1 shadow-md hidden sm:flex"
        >
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <span>Aperçu rapide</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider truncate">{product.brand}</span>
            <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              <span className="text-[10px] font-semibold text-slate-700">{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={handleCardClick}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price + Add to Cart */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900 leading-tight">
              {product.price.toLocaleString('fr-FR')} <span className="text-[10px] font-semibold text-amber-700">DH</span>
            </div>
            {product.oldPrice && (
              <div className="text-[10px] text-slate-400 line-through leading-none mt-0.5">
                {product.oldPrice.toLocaleString('fr-FR')} DH
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-md hover:brightness-110 active:scale-95 transition-all touch-manipulation flex-shrink-0"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
