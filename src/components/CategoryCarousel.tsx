import React from 'react';
import { CATEGORIES, Category } from '../data/categories';
import { useShop } from '../context/ShopContext';

export const CategoryCarousel: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setConditionFilter, resetFilters } = useShop();

  const handleCategoryClick = (cat: Category) => {
    resetFilters();
    setActiveTab('shop');
    if (cat.slug === 'occasions') {
      setConditionFilter('occasion');
    } else if (cat.slug === 'location') {
      setConditionFilter('location');
    } else {
      setSelectedCategory(cat.slug);
    }
  };

  return (
    <section className="py-6 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Category Cards List */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="group flex-shrink-0 w-36 sm:w-40 rounded-2xl bg-white border border-gray-200 hover:border-amber-500 hover:shadow-md p-3 cursor-pointer transition-all duration-300 flex flex-col items-center text-center shadow-sm"
            >
              {/* Category Image Box */}
              <div className="w-20 h-20 rounded-xl bg-slate-50 p-2 border border-gray-100 flex items-center justify-center overflow-hidden mb-2 group-hover:border-amber-300 transition-colors">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Category Title */}
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">
                {cat.itemCount} produits
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
