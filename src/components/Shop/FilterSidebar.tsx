import React from 'react';
import { useShop, ConditionFilter } from '../../context/ShopContext';
import { CATEGORIES, normalizeCategorySlug, getCategoryCount } from '../../data/categories';
import { BRANDS } from '../../data/brands';
import { Filter, RotateCcw, Check, Sparkles, RefreshCw, Calendar, Tag } from 'lucide-react';

export const FilterSidebar: React.FC = () => {
  const {
    products,
    availableBrands,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    conditionFilter,
    setConditionFilter,
    resetFilters
  } = useShop();

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      
      {/* Header Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filtres Catalogue</span>
        </div>

        <button
          onClick={resetFilters}
          className="text-[11px] text-slate-500 hover:text-amber-700 flex items-center space-x-1 transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Condition Filter (Neuf, Occasion, Location) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Type de Matériel</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Tous', icon: Tag },
            { id: 'neuf', label: 'Neuf', icon: Sparkles },
            { id: 'occasion', label: 'Occasion', icon: RefreshCw },
            { id: 'location', label: 'Location', icon: Calendar }
          ].map(cond => {
            const Icon = cond.icon;
            const active = conditionFilter === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setConditionFilter(cond.id as ConditionFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  active 
                    ? 'bg-amber-600 text-white font-extrabold shadow-sm'
                    : 'bg-slate-50 border border-gray-200 text-slate-700 hover:border-amber-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cond.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category List Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Catégories</h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === null 
                ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Toutes les catégories</span>
          </button>

          {CATEGORIES.map(cat => {
            const normSel = selectedCategory ? normalizeCategorySlug(selectedCategory) : null;
            const active = normSel === cat.slug;
            const count = getCategoryCount(cat.slug, products);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(active ? null : cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-semibold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Marque</h4>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedBrand === null 
                ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Toutes les marques</span>
          </button>

          {(availableBrands || []).map((b: { brand: string; count: number }) => {
            const active = selectedBrand === b.brand;
            return (
              <button
                key={b.brand}
                onClick={() => setSelectedBrand(active ? null : b.brand)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{b.brand}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-semibold">{b.count}</span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
