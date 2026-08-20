import React from 'react';
import { useShop, SortOption } from '../../context/ShopContext';
import { ProductCard } from '../ProductCard';
import { CATEGORIES, normalizeCategorySlug } from '../../data/categories';
import { Grid, List, SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    filteredProducts,
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

  // Public storefront products (excluding soft-deactivated is_active === false)
  const activeProducts = products.filter(p => p.isActive !== false);

  // Use filteredProducts directly from ShopContext
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default featured
  });

  // Get active category object for title
  const normSelCategory = selectedCategory ? normalizeCategorySlug(selectedCategory) : null;
  const activeCategoryObj = CATEGORIES.find(c => c.slug === normSelCategory);

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
            <h3 className="text-lg font-bold text-slate-900">Aucun produit disponible dans le catalogue Supabase</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
              Les produits sont synchronisés en direct depuis la base de données Supabase.
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
