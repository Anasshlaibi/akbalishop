import React from 'react';
import { CATEGORIES, Category } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { Camera, Aperture, Sun, Mic, Video, RefreshCw, Calendar, Sliders, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-5 h-5" />,
  Aperture: <Aperture className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />
};

export const CategoryGrid: React.FC = () => {
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
    <section className="py-16 bg-dark-bg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-brand-amber mb-1">
              Catalogue AKABLISHOP
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Explorez par Catégorie Matériel
            </h2>
          </div>
          
          <button
            onClick={() => { resetFilters(); setActiveTab('shop'); }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-brand-amber transition-colors"
          >
            <span>Voir toutes les catégories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="group relative rounded-2xl bg-dark-card border border-white/10 p-5 hover:border-brand-amber/60 hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-amber/10 rounded-full blur-2xl group-hover:bg-brand-amber/20 transition-all" />

              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-dark-surface border border-white/10 text-brand-amber group-hover:bg-brand-amber group-hover:text-dark-bg transition-colors">
                    {iconMap[cat.iconName] || <Camera className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-dark-surface px-2.5 py-1 rounded-full border border-white/5">
                    {cat.itemCount} produits
                  </span>
                </div>

                {/* Category Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-brand-amber transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {/* Bottom Image Thumbnail & Arrow Link */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-dark-bg p-1 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <span className="inline-flex items-center space-x-1 text-xs font-bold text-brand-amber group-hover:translate-x-1 transition-transform">
                  <span>Parcourir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
