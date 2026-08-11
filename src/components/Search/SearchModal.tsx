import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, X, ArrowRight, Tag } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { products, isSearchModalOpen, setIsSearchModalOpen, setSelectedProduct, setActiveTab, setSearchQuery } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  // Filter active products from synchronized Supabase products
  const activeProducts = products.filter(p => p.isActive !== false);

  const results = searchTerm.trim() 
    ? activeProducts.filter(p => {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      })
    : [];

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product.id);
    setActiveTab('product');
    setIsSearchModalOpen(false);
  };

  const handleViewAllResults = () => {
    setSearchQuery(searchTerm);
    setActiveTab('shop');
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une caméra, un objectif (ex: Sony FX6, Nikon, Godox...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs text-slate-500 hover:text-slate-900 font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Live Search Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {searchTerm.trim() ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  {results.length} matériel(s) trouvé(s)
                </div>

                {results.slice(0, 6).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-gray-200 hover:border-amber-400 cursor-pointer transition-all flex items-center space-x-3 group shadow-sm"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                        <span className="font-bold text-amber-700 uppercase">{p.brand}</span>
                        <span>•</span>
                        <span className="capitalize">{p.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {p.name}
                      </h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-extrabold text-slate-900">
                        {p.price.toLocaleString('fr-FR')} <span className="text-[10px] text-amber-700">DH</span>
                      </div>
                      {(p.isOccasion || p.condition === 'used') && <span className="text-[9px] text-amber-600 font-semibold">Occasion</span>}
                    </div>
                  </div>
                ))}

                {results.length > 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="w-full py-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Voir les {results.length} résultats dans la boutique</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Aucun résultat pour "<strong className="text-slate-900">{searchTerm}</strong>"
              </div>
            )
          ) : (
            /* Quick Search Suggestions */
            <div className="space-y-3 py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                Recherches Populaires
              </div>
              <div className="flex flex-wrap gap-2">
                {['Sony FX6', 'Sony FX3', 'Nikon Z 7II', 'Sony a7S III Occasion', 'Godox SL60W', 'Røde Wireless', 'DJI RS 3 Pro'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 border border-gray-200 text-xs text-slate-700 hover:text-amber-700 hover:border-amber-400 transition-all flex items-center space-x-1.5 font-medium"
                  >
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
