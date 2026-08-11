import React from 'react';
import { useShop, ActiveTab } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, Heart, Menu, Database } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    activeTab, 
    setActiveTab, 
    setSelectedCategory, 
    setConditionFilter,
    setIsSearchModalOpen,
    setIsAdminOpen,
    resetFilters 
  } = useShop();
  const { totalItems, subtotal, setIsCartOpen, wishlist } = useCart();

  const handleNavClick = (tab: ActiveTab, categorySlug?: string, condition?: 'occasion' | 'location') => {
    setActiveTab(tab);
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory(null);
    }
    
    if (condition) {
      setConditionFilter(condition);
    } else if (tab !== 'shop') {
      setConditionFilter('all');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm overflow-hidden">
      <AnnouncementBar />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* Mobile Menu Trigger & AKABLISHOP Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 transition-all"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* AKABLISHOP Logo */}
            <button 
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className="flex items-center space-x-2.5 group text-left flex-shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1 sm:p-1.5">
                  <img 
                    src="/wp-content/uploads/Akablishop-Logo-N.png" 
                    alt="AKABLISHOP" 
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  AKABLI<span className="text-amber-600">SHOP</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-bold -mt-1 hidden sm:inline-block">
                  Audiovisuel Pro
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links (Responsive for 1366px PC screens) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            <button
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className={`px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'home' 
                  ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                  : 'text-slate-700 hover:text-amber-600 hover:bg-slate-100'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => { resetFilters(); setActiveTab('shop'); }}
              className={`px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'shop'
                  ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                  : 'text-slate-700 hover:text-amber-600 hover:bg-slate-100'
              }`}
            >
              Boutique
            </button>

            <button
              onClick={() => handleNavClick('shop', 'cameras')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Caméras
            </button>

            <button
              onClick={() => handleNavClick('shop', 'objectifs')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Objectifs
            </button>

            <button
              onClick={() => handleNavClick('shop', 'eclairage')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Éclairage
            </button>

            <button
              onClick={() => handleNavClick('shop', 'audio')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Son
            </button>

            <button
              onClick={() => handleNavClick('shop', 'stabilisateurs')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              Stabilisateurs
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'occasion')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
            >
              Occasions
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'location')}
              className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
            >
              Location
            </button>
          </nav>

          {/* Right Controls (Search, Admin CMS, Wishlist, Cart) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Admin CMS Trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all text-xs font-extrabold shadow-sm"
              title="Ouvrir le panneau d'administration CMS & Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden xl:inline-block">Admin CMS</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-500 hover:text-slate-900 hover:border-amber-400 transition-all text-xs"
              title="Rechercher du matériel"
            >
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline-block">Rechercher...</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => { setActiveTab('shop'); }}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 transition-all"
              title="Liste de souhaits"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 hover:bg-amber-100 transition-all shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[9px] text-slate-500 leading-tight">Mon Panier</span>
                <span className="text-xs font-bold text-amber-700">{subtotal.toLocaleString('fr-FR')} DH</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
