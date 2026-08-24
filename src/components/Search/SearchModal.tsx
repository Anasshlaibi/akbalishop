import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, X, ArrowRight, Tag, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { intelligentSearchService } from '../../services/intelligentSearchService';

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

  // Compute Intelligent Ranked Results & Autocomplete Pills
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return intelligentSearchService.searchProducts(searchTerm, products);
  }, [searchTerm, products]);

  const autocomplete = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return intelligentSearchService.getAutocompleteSuggestions(searchTerm, products);
  }, [searchTerm, products]);

  if (!isSearchModalOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-20 flex items-start justify-center font-sans">
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
            placeholder="Rechercher (ex: 70 200, sony 85 1.8, objectif portrait, micro tournage...)"
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

        {/* Dynamic Spec Pills & Smart Autocomplete Suggestions Header */}
        {autocomplete && autocomplete.specPills.length > 0 && (
          <div className="px-4 py-2.5 bg-amber-50/60 border-b border-amber-100 flex items-center space-x-2 overflow-x-auto text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-amber-900 font-bold text-[11px] uppercase tracking-wider flex-shrink-0">Spécifications détectées:</span>
            {autocomplete.specPills.map((pill, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 font-extrabold text-[11px] shadow-sm whitespace-nowrap">
                {pill}
              </span>
            ))}
          </div>
        )}

        {/* Live Search Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {searchTerm.trim() ? (
            searchResults.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  <span>{searchResults.length} matériel(s) trouvé(s)</span>
                  <span className="text-amber-700 font-extrabold text-[10px]">Classement Intelligent AKABLISHOP</span>
                </div>

                {searchResults.slice(0, 6).map(({ product: p, matchedSpecs, score }) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="p-3 rounded-xl bg-white hover:bg-amber-50/40 border border-gray-200 hover:border-amber-400 cursor-pointer transition-all flex items-center space-x-3 group shadow-sm"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-14 h-14 rounded-lg object-contain bg-slate-50 p-1 border border-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-0.5">
                        <span className="font-extrabold text-amber-700 uppercase">{p.brand}</span>
                        <span>•</span>
                        <span className="capitalize">{p.category}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {p.name}
                      </h4>

                      {/* Matched Specs Badges */}
                      {matchedSpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {matchedSpecs.map((spec, i) => (
                            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-extrabold text-slate-900">
                        {p.price.toLocaleString('fr-FR')} <span className="text-[10px] text-amber-700">DH</span>
                      </div>
                      {(p.isOccasion || p.condition === 'used') && <span className="text-[9px] text-amber-600 font-semibold block">Occasion</span>}
                    </div>
                  </div>
                ))}

                {searchResults.length > 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="w-full py-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-all flex items-center justify-center space-x-1 mt-2"
                  >
                    <span>Voir les {searchResults.length} résultats dans la boutique</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
                <p>Aucun résultat exact pour "<strong className="text-slate-900">{searchTerm}</strong>"</p>
                <p className="text-[11px] text-slate-400">Essayez de chercher par focale (ex: 70 200, 50 1.4), marque (Sony, Canon) ou usage (portrait, micro, éclairage).</p>
              </div>
            )
          ) : (
            /* Quick Search Suggestions & Popular Tags */
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  Recherches Populaires
                </div>
                <div className="flex flex-wrap gap-2">
                  {['70 200', 'Sony FX3', 'Sony FX6', 'Sony 85 1.8', 'Objectif Portrait', 'Micro Tournage', 'Filtre 77mm', 'DJI RS 3 Pro'].map(tag => (
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

              <div className="pt-2 border-t border-gray-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Conseils de Recherche Intelligent
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-gray-200">
                  <div>• Tapez <strong className="text-slate-900">70 200</strong> pour les téléobjectifs</div>
                  <div>• Tapez <strong className="text-slate-900">sony 85 1.8</strong> pour la focale fixe</div>
                  <div>• Tapez <strong className="text-slate-900">objectif portrait</strong> pour les optiques à portrait</div>
                  <div>• Tapez <strong className="text-slate-900">lumiere interview</strong> pour l'éclairage studio</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
