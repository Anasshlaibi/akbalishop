import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Star, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, setSelectedProduct, setActiveTab } = useShop();
  const { addToCart } = useCart();

  if (!quickViewProduct) return null;

  const handleFullDetail = () => {
    setSelectedProduct(quickViewProduct);
    setActiveTab('product');
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-12 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
        
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-100 border border-gray-200 text-slate-600 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 items-center">
          
          {/* Left Preview Image */}
          <div className="md:col-span-5 aspect-square rounded-xl bg-slate-50 border border-gray-200 p-4 flex items-center justify-center">
            <img 
              src={quickViewProduct.image} 
              alt={quickViewProduct.name} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right Info */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{quickViewProduct.brand}</span>
              <h3 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">{quickViewProduct.name}</h3>
            </div>

            <div className="flex items-center space-x-2 text-amber-500 text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(quickViewProduct.rating) ? 'fill-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="font-bold text-slate-900">{quickViewProduct.rating}</span>
              <span className="text-slate-500">({quickViewProduct.reviewCount} avis)</span>
            </div>

            <div className="text-2xl font-extrabold text-slate-900">
              {quickViewProduct.price.toLocaleString('fr-FR')} <span className="text-sm font-bold text-amber-700">DH</span>
              {quickViewProduct.oldPrice && (
                <span className="text-xs text-slate-400 line-through ml-2">
                  {quickViewProduct.oldPrice.toLocaleString('fr-FR')} DH
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
              {quickViewProduct.shortDescription}
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs tracking-wide uppercase shadow-md hover:brightness-110 flex items-center justify-center space-x-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={handleFullDetail}
                className="w-full py-2.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 text-xs font-semibold hover:text-slate-900 flex items-center justify-center space-x-1.5"
              >
                <span>Voir la fiche technique complète</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
