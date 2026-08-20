import React from 'react';
import { BRANDS } from '../data/brands';
import { useShop } from '../context/ShopContext';

export const BrandSection: React.FC = () => {
  const { setActiveTab, setSelectedBrand, resetFilters } = useShop();

  const handleBrandClick = (brandName: string) => {
    resetFilters();
    setSelectedBrand(brandName);
    setActiveTab('shop');
  };

  return (
    <section className="py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <div className="text-xs uppercase font-bold tracking-widest text-amber-700 mb-1">
            Partenaires & Marques Officiellement Référencées
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900">
            Les Plus Grandes Marques de la Création Audiovisuelle
          </h3>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
          {BRANDS.map(brand => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="group rounded-2xl bg-slate-50 border border-gray-200 p-4 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center h-24"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-h-8 max-w-[90px] object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all"
              />
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-amber-700 mt-1.5 transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
