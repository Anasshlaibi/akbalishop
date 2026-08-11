import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { X, Search, Phone, ChevronRight, MessageCircle, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    setActiveTab, 
    setSelectedCategory, 
    setConditionFilter, 
    setIsSearchModalOpen,
    resetFilters 
  } = useShop();

  if (!isOpen) return null;

  const handleCategorySelect = (categorySlug?: string, condition?: 'occasion' | 'location') => {
    resetFilters();
    setActiveTab('shop');
    if (categorySlug) setSelectedCategory(categorySlug);
    if (condition) setConditionFilter(condition);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white border-r border-gray-200 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-50">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1">
                  <img src="/wp-content/uploads/Akablishop-Logo-N.png" alt="AKABLISHOP" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-slate-900">AKABLI<span className="text-amber-600">SHOP</span></span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-500 -mt-1 font-bold">Marrakech</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 border border-gray-200 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search Button */}
          <div className="mt-4">
            <button
              onClick={() => { onClose(); setIsSearchModalOpen(true); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border border-gray-200 text-slate-500 hover:text-slate-900 hover:border-amber-400 text-sm"
            >
              <span className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Rechercher du matériel...</span>
              </span>
            </button>
          </div>

          {/* Navigation Category List */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => { resetFilters(); setActiveTab('home'); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-slate-800 hover:text-amber-600 hover:bg-slate-100"
            >
              <span>Accueil</span>
            </button>

            <button
              onClick={() => handleCategorySelect()}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-slate-800 hover:text-amber-600 hover:bg-slate-100"
            >
              <span>Toute la Boutique</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <div className="pt-2 pb-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3">
              Nos Catégories Matériel
            </div>

            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-semibold">{cat.itemCount}</span>
              </button>
            ))}

            <div className="pt-3 pb-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3">
              Services Spéciaux
            </div>

            <button
              onClick={() => handleCategorySelect(undefined, 'occasion')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold text-amber-700 hover:bg-amber-50"
            >
              <span>Occasions Certifiées</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCategorySelect(undefined, 'location')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              <span>Location Matériel Pro</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Footer Contact Info */}
        <div className="pt-6 border-t border-gray-200 space-y-3">
          <a
            href="https://wa.me/+212695252921"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Commander par WhatsApp</span>
          </a>

          <div className="text-[11px] text-slate-600 space-y-1.5 pt-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+212 695252921</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Al Massar, Marrakech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
