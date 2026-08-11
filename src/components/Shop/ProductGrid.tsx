import React from 'react';
import { useShop, SortOption } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { CATEGORIES } from '../../data/categories';
import { Grid, List, SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    selectedCategory,
    selectedBrand,
    conditionFilter,
    searchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    setIsMobileFilterOpen,
    resetFilters
  } = useShop();

  // Filter products based on search, category, brand, condition
  const filteredProducts = PRODUCTS.filter(product => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory) {
      if (product.category !== selectedCategory) return false;
    }

    // Brand filter
    if (selectedBrand) {
      if (product.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    }

    // Condition filter
    if (conditionFilter === 'neuf' && !product.isNew) return false;
    if (conditionFilter === 'occasion' && !product.isOccasion) return false;
    if (conditionFilter === 'location' && !product.isRental) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default featured
  });

  // Get active category object for title
  const activeCategoryObj = CATEGORIES.find(c => c.slug === selectedCategory);

  return (
    <div className="flex-1 space-y-6">
      
      {/* Header Bar (Breadcrumbs, Title & Controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>Boutique</span>
            {selectedCategory && (
              <>
                <span className="mx-1.5 text-slate-400">/</span>
                <span className="text-amber-700 font-semibold">{activeCategoryObj?.name || selectedCategory}</span>
              </>
            )}
            {selectedBrand && (
              <>
                <span className="mx-1.5 text-slate-400">/</span>
                <span className="text-amber-700 font-semibold">{selectedBrand}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
            {activeCategoryObj ? activeCategoryObj.name : selectedBrand ? `Matériel ${selectedBrand}` : 'Catalogue Audiovisuel Pro'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'produit disponible' : 'produits disponibles'}
          </p>
        </div>

        {/* Controls (Sort Dropdown & Grid Toggle) */}
        <div className="flex items-center space-x-3">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-slate-700 hover:text-amber-700 flex items-center space-x-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Filtres</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-white text-slate-900">Trier par : En Vedette</option>
              <option value="price-asc" className="bg-white text-slate-900">Prix : Croissant</option>
              <option value="price-desc" className="bg-white text-slate-900">Prix : Décroissant</option>
              <option value="rating" className="bg-white text-slate-900">Meilleures Notes</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vue Grille"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vue Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Product List / Grid Render */}
      {sortedProducts.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4"
        }>
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} layout={viewMode} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center space-y-4 my-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <SearchX className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Aucun produit ne correspond à vos filtres</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
              Essayez de modifier votre recherche ou d'effacer les filtres actifs.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs tracking-wide shadow-md hover:brightness-110 transition-all inline-block"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      )}

    </div>
  );
};
