import React from 'react';
import { useShop } from '../../context/ShopContext';
import { FilterSidebar } from './FilterSidebar';
import { X, Check } from 'lucide-react';

export const MobileFilters: React.FC = () => {
  const { isMobileFilterOpen, setIsMobileFilterOpen, resetFilters } = useShop();

  if (!isMobileFilterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsMobileFilterOpen(false)}
      />

      {/* Slide-Up Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-dark-bg border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-50">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h3 className="text-base font-bold text-white">Filtres Catalogue</h3>
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 rounded-lg bg-dark-surface border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterSidebar />
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full py-3 rounded-xl bg-brand-amber text-dark-bg font-extrabold text-xs shadow-glow hover:brightness-110 flex items-center justify-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Appliquer les filtres</span>
          </button>
        </div>
      </div>
    </div>
  );
};
