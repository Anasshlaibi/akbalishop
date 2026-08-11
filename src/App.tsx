import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header/Header';
import { MobileNavDrawer } from './components/Header/MobileNavDrawer';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryCarousel } from './components/CategoryCarousel';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BrandSection } from './components/BrandSection';
import { RentalSection } from './components/RentalSection';
import { TrustBadges } from './components/TrustBadges';
import { BrandStory } from './components/BrandStory';
import { FilterSidebar } from './components/Shop/FilterSidebar';
import { ProductGrid } from './components/Shop/ProductGrid';
import { MobileFilters } from './components/Shop/MobileFilters';
import { ProductDetail } from './components/ProductDetail/ProductDetail';
import { CartDrawer } from './components/Cart/CartDrawer';
import { CheckoutModal } from './components/Cart/CheckoutModal';
import { SearchModal } from './components/Search/SearchModal';
import { QuickViewModal } from './components/QuickView/QuickViewModal';
import { ContactSection } from './components/Pages/ContactSection';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Footer } from './components/Footer/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';

const AppContent: React.FC = () => {
  const { activeTab, selectedProduct } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-16 sm:pb-0">
      
      {/* Header Bar */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Dynamic View Controller */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Kamerty E-Commerce 10-Step Layout */}
            <HeroCarousel />
            <CategoryCarousel />
            <FeaturedProducts />
            <BrandSection />
            <RentalSection />
            <TrustBadges />
            <BrandStory />
          </>
        )}

        {activeTab === 'shop' && (
          <div className="py-4 sm:py-8 bg-slate-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="hidden lg:block">
                  <FilterSidebar />
                </div>
                <ProductGrid />
              </div>
            </div>
            <MobileFilters />
          </div>
        )}

        {activeTab === 'product' && selectedProduct && (
          <ProductDetail product={selectedProduct} />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Drawers & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <QuickViewModal />
      <AdminPanel />
      <MobileBottomBar />

    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ShopProvider>
  );
}

export default App;
