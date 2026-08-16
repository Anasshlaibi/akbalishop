import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { Menu, ChevronDown, Camera, Aperture, Sun, Mic, Video, RefreshCw, Calendar, Sliders } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-4 h-4" />,
  Aperture: <Aperture className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />
};

export const CategoryMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, setSelectedCategory, setConditionFilter, setActiveTab, resetFilters } = useShop();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (categoryId: string) => {
    resetFilters();
    if (categoryId === 'occasions') {
      setConditionFilter('occasion');
      setSelectedCategory(null);
    } else if (categoryId === 'rental') {
      setConditionFilter('location');
      setSelectedCategory(null);
    } else {
      setConditionFilter('all');
      setSelectedCategory(categoryId);
    }
    setActiveTab('shop');
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition-all"
      >
        <Menu className="w-4 h-4 text-slate-950" />
        <span>Nos Catégories</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-950 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-gray-100 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50/50">
            Rayons Matériel Audiovisuel
          </div>

          <div className="py-1 max-h-[70vh] overflow-y-auto">
            {(categories || CATEGORIES).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="w-full px-4 py-2.5 flex items-center space-x-3 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <span className="p-1.5 rounded-lg bg-amber-100/70 text-amber-700 flex-shrink-0">
                  {iconMap[cat.iconName] || <Camera className="w-4 h-4" />}
                </span>
                <span className="flex-1 truncate">{cat.name}</span>
                <span className="text-[10px] font-extrabold text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-100">
                  {cat.itemCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
