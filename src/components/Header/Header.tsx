import React from 'react';
import { useShop, ActiveTab } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, Heart, Menu, Database } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import CategoryMenu from './CategoryMenu';

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
    <header className="sticky top-0 z-40 w-full bg-white shadow-md border-b border-gray-200">
      {/* Top Announcement Bar: White background + Black Text */}
      <AnnouncementBar />

      {/* Main Middle Row: Logo, Large Search Bar, Admin & Cart Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Mobile Menu Trigger & AKABLISHOP Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 transition-all"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official AKABLISHOP Brand Logo */}
            <button
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className="flex items-center space-x-3 group text-left flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 p-0.5 shadow-md flex-shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src="/wp-content/uploads/Akablishop-Logo-N.png"
                    alt="AKABLISHOP Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-display font-black text-lg sm:text-2xl tracking-tight text-slate-900 leading-none group-hover:text-amber-600 transition-colors">
                  AKABLI<span className="text-amber-600">SHOP</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-extrabold mt-0.5">
                  Audiovisuel Pro Marrakech
                </span>
              </div>
            </button>
          </div>

          {/* Middle: Prominent Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-300 text-slate-400 hover:border-amber-500 hover:bg-white transition-all shadow-inner text-xs font-semibold"
            >
              <span className="flex items-center space-x-2 truncate">
                <Search className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Rechercher matériel (Sony, Canon, Godox, DJI...)</span>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-extrabold ml-2">
                RECHERCHER
              </span>
            </button>
          </div>

          {/* Right: Controls (Admin CMS, Wishlist, Shopping Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Admin CMS Trigger (No AI icons) */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all text-xs font-black shadow-sm"
              title="Ouvrir le panneau d'administration CMS"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline-block">Admin CMS</span>
            </button>

            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 transition-all"
              title="Rechercher"
            >
              <Search className="w-4 h-4 text-amber-600" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => { setActiveTab('shop'); }}
              className="relative p-2.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 transition-all"
              title="Liste de souhaits"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-all shadow-md"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[9px] text-slate-900 uppercase font-black tracking-wider leading-tight">Mon Panier</span>
                <span className="text-xs font-black text-slate-950">{subtotal.toLocaleString('fr-FR')} DH</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Row 2: Golden Yellow Navigation Accent Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-t border-amber-400 shadow-sm py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Category Mega Dropdown Menu */}
          <div className="py-0.5">
            <CategoryMenu />
          </div>

          {/* Right: Main Navigation Bar Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-3">
            <button
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-950 hover:bg-amber-600/30'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => { resetFilters(); setActiveTab('shop'); }}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'shop'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-950 hover:bg-amber-600/30'
              }`}
            >
              Boutique
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'occasion')}
              className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-200/60 hover:bg-slate-900 hover:text-amber-400 rounded-xl transition-all"
            >
              Occasions
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'location')}
              className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-300/60 hover:bg-slate-900 hover:text-emerald-400 rounded-xl transition-all"
            >
              Location
            </button>

            <button
              onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'contact'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-950 hover:bg-amber-600/30'
              }`}
            >
              Contact & Devis
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;