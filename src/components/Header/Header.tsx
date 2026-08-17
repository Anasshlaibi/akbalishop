import React from 'react';
import { useShop, ActiveTab } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, Heart, Menu, Database, Phone, Truck, User } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
      
      {/* Row 1: Brand Logo, Wide Pill Search Bar, & Business Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Mobile Menu Trigger & Official AKABLISHOP Brand Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-gray-200 text-slate-700 hover:text-amber-600 transition-all"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className="flex items-center space-x-3 group text-left flex-shrink-0"
            >
              {/* Clean White Container Logo */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-gray-200 p-1 shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/logo-icon.png"
                  alt="AKABLISHOP Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
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

          {/* Center: Wide Pill-Shaped Search Bar (Yahyaoui Style) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between bg-slate-50 border border-gray-200 rounded-full p-1 pl-5 shadow-inner cursor-pointer hover:bg-white hover:border-amber-400 transition-all"
            >
              <span className="text-slate-400 text-xs font-semibold truncate pr-2">
                Rechercher du matériel (Sony, Canon, Godox, DJI...)
              </span>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-sm transition-colors"
                title="Rechercher"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right: Contact Details (Bureau & Livraison) */}
          <div className="hidden xl:flex items-center space-x-6 text-xs font-semibold flex-shrink-0">
            <a
              href="tel:+212701896033"
              className="flex items-center space-x-2.5 text-slate-700 hover:text-amber-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Bureau</span>
                <span className="font-extrabold text-slate-900">+212 701 896 033</span>
              </div>
            </a>

            <div className="flex items-center space-x-2.5 text-slate-700">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Livraison Disponible</span>
                <span className="font-extrabold text-amber-600">Partout au Maroc</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Soft, Smooth Pastel Tint Navigation Accent Bar */}
      <div className="bg-amber-50/70 border-t border-b border-amber-200/60 shadow-sm py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Solid Rounded "Nos Catégories" Button */}
          <div className="flex items-center space-x-4">
            <CategoryMenu />
          </div>

          {/* Middle: Clean Smooth Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            <button
              onClick={() => { resetFilters(); setActiveTab('home'); }}
              className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'text-amber-700 bg-amber-100/80 border border-amber-300/60 font-black'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-100/40'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => { resetFilters(); setActiveTab('shop'); }}
              className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'shop'
                  ? 'text-amber-700 bg-amber-100/80 border border-amber-300/60 font-black'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-100/40'
              }`}
            >
              Boutique
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'occasion')}
              className="px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800 hover:bg-amber-100/60 rounded-xl transition-all"
            >
              Occasions
            </button>

            <button
              onClick={() => handleNavClick('shop', undefined, 'location')}
              className="px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 hover:bg-emerald-100/60 rounded-xl transition-all"
            >
              Location
            </button>

            <button
              onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'contact'
                  ? 'text-amber-700 bg-amber-100/80 border border-amber-300/60 font-black'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-100/40'
              }`}
            >
              Contact & Devis
            </button>
          </nav>

          {/* Right: Circular Action Buttons (Admin CMS, Wishlist, Cart) */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Search Button for Mobile */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden p-2 rounded-full bg-white border border-gray-200 text-slate-700 hover:text-amber-600 transition-all"
              title="Rechercher"
            >
              <Search className="w-4 h-4 text-amber-600" />
            </button>

            {/* Wishlist Circular Button */}
            <button
              onClick={() => { setActiveTab('shop'); }}
              className="relative w-9 h-9 rounded-full bg-white border border-gray-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-all shadow-sm"
              title="Liste de souhaits"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-1.5 rounded-full font-black text-xs shadow-sm transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block font-black">{subtotal.toLocaleString('fr-FR')} DH</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
