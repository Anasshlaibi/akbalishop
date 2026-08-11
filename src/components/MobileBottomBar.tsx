import React from 'react';
import { ShoppingBag, Home, Grid3X3, MessageCircle, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';

export const MobileBottomBar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { activeTab, setActiveTab, resetFilters, setIsSearchModalOpen } = useShop();

  const handleWhatsApp = () => {
    window.open('https://wa.me/+212695252921?text=Bonjour AKABLISHOP, je voudrais des informations sur vos produits.', '_blank');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-16 safe-bottom">

        {/* Home */}
        <button
          onClick={() => { resetFilters(); setActiveTab('home'); window.scrollTo({ top: 0 }); }}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
            activeTab === 'home' ? 'text-amber-600' : 'text-slate-400'
          }`}
          aria-label="Accueil"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Accueil</span>
          {activeTab === 'home' && <span className="absolute bottom-0 w-8 h-0.5 bg-amber-500 rounded-full" />}
        </button>

        {/* Boutique */}
        <button
          onClick={() => { resetFilters(); setActiveTab('shop'); window.scrollTo({ top: 0 }); }}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
            activeTab === 'shop' ? 'text-amber-600' : 'text-slate-400'
          }`}
          aria-label="Boutique"
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-[9px] font-bold">Boutique</span>
          {activeTab === 'shop' && <span className="absolute bottom-0 w-8 h-0.5 bg-amber-500 rounded-full" />}
        </button>

        {/* Cart — Center prominent button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 relative touch-manipulation"
          aria-label="Panier"
        >
          <div className="relative -mt-5 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border-4 border-white">
            <ShoppingBag className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold text-amber-600 mt-0.5">Panier</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-400 touch-manipulation"
          aria-label="Recherche"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold">Recherche</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-emerald-600 touch-manipulation"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[9px] font-bold">WhatsApp</span>
        </button>

      </div>
    </nav>
  );
};
