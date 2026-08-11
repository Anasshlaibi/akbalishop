import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, setActiveTab, resetFilters } = useShop();
  const [filterTab, setFilterTab] = useState<'all' | 'cameras' | 'objectifs' | 'occasions' | 'location'>('all');

  const activeProducts = products.filter(p => p.isActive !== false);

  const filteredProducts = activeProducts.filter(p => {
    if (filterTab === 'cameras') return p.category.toLowerCase() === 'cameras';
    if (filterTab === 'objectifs') return p.category.toLowerCase() === 'objectifs' || p.category.toLowerCase() === 'lenses';
    if (filterTab === 'occasions') return p.isOccasion === true || p.condition === 'used';
    if (filterTab === 'location') return p.isRental === true || p.commercialMode === 'rental' || p.commercialMode === 'both';
    return true;
  });

  return (
    <section className="py-8 sm:py-16 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase font-bold tracking-widest text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sélection d'Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Nos Produits Populaires
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'cameras', label: 'Caméras' },
              { id: 'objectifs', label: 'Objectifs' },
              { id: 'occasions', label: 'Occasions' },
              { id: 'location', label: 'Location' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                  filterTab === tab.id
                    ? 'bg-amber-600 text-white font-extrabold shadow-md'
                    : 'bg-white border border-gray-200 text-slate-600 hover:text-slate-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => { resetFilters(); setActiveTab('shop'); }}
            className="px-8 py-3.5 rounded-xl bg-white border border-gray-300 text-slate-900 hover:border-amber-500 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all inline-flex items-center space-x-2"
          >
            <span>Voir tout le catalogue ({activeProducts.length} produits)</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>

      </div>
    </section>
  );
};
