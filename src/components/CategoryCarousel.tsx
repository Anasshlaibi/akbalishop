import React from 'react';
import { CATEGORIES, Category, normalizeCategorySlug, getCategoryCount } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { getCategoryPath } from '../utils/seoGenerator';

export const CategoryCarousel: React.FC = () => {
  const { products, categories, setActiveTab, setSelectedCategory, setConditionFilter, resetFilters } = useShop();

  const handleCategoryClick = (event: React.MouseEvent<HTMLAnchorElement>, cat: Category) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    resetFilters();
    setActiveTab('shop');
    const norm = normalizeCategorySlug(cat.slug);
    setSelectedCategory(norm);
    if (norm === 'occasions') {
      setConditionFilter('occasion');
    } else if (norm === 'location') {
      setConditionFilter('location');
    }
  };

  

  return (
    <section className="py-6 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Category Cards List */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {(categories || CATEGORIES).map((cat) => {
            const count = getCategoryCount(cat.slug, products);
            return (
              <a
                key={cat.id}
                href={getCategoryPath(cat.slug)}
                onClick={(event) => handleCategoryClick(event, cat)}
                className="group flex-shrink-0 w-36 sm:w-40 rounded-2xl bg-white border border-gray-200 hover:border-amber-500 hover:shadow-md p-3 cursor-pointer transition-all duration-300 flex flex-col items-center text-center shadow-sm"
              >
                {/* Category Image Box */}
                <div className="w-20 h-20 rounded-xl bg-slate-50 p-2 border border-gray-100 flex items-center justify-center overflow-hidden mb-2 group-hover:border-amber-300 transition-colors">
                  <img 
                    src={cat.image && (cat.image.startsWith('/') || cat.image.startsWith('http') || cat.image.startsWith('data:')) ? cat.image : '/wp-content/uploads/electronics-store-55.png'} 
                    alt={cat.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/wp-content/uploads/electronics-store-55.png';
                    }}
                  />
                </div>

                {/* Category Title */}
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  {count} {count === 1 ? 'produit' : 'produits'}
                </span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
