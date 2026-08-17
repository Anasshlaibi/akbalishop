import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
import { CategoryEditorModal } from './CategoryEditorModal';
import { Category } from '../../data/categories';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Lock, 
  ArrowLeft,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Key
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'akabli_admin_session_v1';

export const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, updateCategory, isAdminOpen, setIsAdminOpen } = useShop();

  // All React Hooks MUST be called unconditionally at the top level
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true' || localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [adminTab, setAdminTab] = useState<'products' | 'categories'>('products');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
  const [isCreateCategoryMode, setIsCreateCategoryMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Synchronize authentication status with storage
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const p = (password || '').trim().toLowerCase().replace(/\s+/g, '');
    
    // Flexible password matching (accepts all standard admin combinations)
    const validPasswords = ['@simo@12'];

    if (validPasswords.includes(password.trim())) {
      setIsAuthenticated(true);
      setAuthError(false);
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        if (rememberMe) {
          localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        }
      } catch (err) {
        console.error('Storage save error:', err);
      }
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (err) {
      console.error('Storage clear error:', err);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = async (productData: Product) => {
    if (editingProduct) {
      return await updateProduct(productData);
    } else {
      return await addProduct(productData);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Early exit only AFTER calling all hooks
  if (!isAdminOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
          title="Fermer"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">AKABLISHOP CMS</h2>
          <p className="text-slate-400 text-xs mb-6">Accès sécurisé à la gestion du catalogue & des catégories</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mot de Passe Administrateur</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Entrez votre mot de passe..."
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    authError ? 'border-rose-500 focus:border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-amber-500'
                  }`}
                />
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              </div>
              {authError && (
                <p className="text-rose-400 text-xs font-semibold mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Mot de passe incorrect</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                />
                <span>Mémoriser la session sur cet appareil</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
            >
              Déverrouiller le Panneau Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 overflow-y-auto font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
                PostgreSQL & Supabase Sync
              </span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">Panneau d'Administration AKABLISHOP</h1>
            <p className="text-xs text-slate-400 mt-0.5">Gérez vos équipements & photos de catégories en direct</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setAdminTab('products')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  adminTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                📦 Équipements ({products.length})
              </button>
              <button
                id="btn-tab-categories"
                onClick={() => setAdminTab('categories')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  adminTab === 'categories' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏷️ Catégories & Images ({categories ? categories.length : 8})
              </button>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center space-x-2 border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voir le Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* CATEGORY MANAGEMENT GRID */}
        {adminTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold text-white">Gestion des Catégories, Images & Icônes</h3>
                  <p className="text-xs text-slate-400">Modifiez les visuels de vos catégories ou ajoutez une nouvelle catégorie.</p>
                </div>
                <button 
                  onClick={() => { setEditingCategory(null); setIsCreateCategoryMode(true); setIsCategoryEditorOpen(true); }} 
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 rounded-xl flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nouvelle Catégorie</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(categories || []).map(cat => {
                const count = products.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase() || p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div key={cat.id} className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 transition-all shadow-lg group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 p-2 flex items-center justify-center overflow-hidden relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 w-full">
                      <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                      <p className="text-[10px] text-amber-400 font-semibold uppercase">{count} produits associés</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCreateCategoryMode(false);
                        setIsCategoryEditorOpen(true);
                      }}
                      className="w-full py-2 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs text-slate-200 rounded-xl transition-colors flex items-center justify-center space-x-1.5 border border-slate-700"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modifier & Image</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou marque..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateProduct}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Catégorie</th>
                      <th className="px-4 py-3">Prix Vente</th>
                      <th className="px-4 py-3">Prix Location</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{product.name}</div>
                              <div className="text-[10px] text-slate-400">{product.brand} • ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-amber-400 border border-amber-500/20 uppercase">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-white">
                          {product.price.toLocaleString()} DH
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {product.rentalPricePerDay ? `${product.rentalPricePerDay.toLocaleString()} DH/j` : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {product.inStock ? (
                            <span className="inline-flex items-center text-emerald-400 text-[11px] font-bold space-x-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>En stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-400 text-[11px] font-bold space-x-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rupture</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                              title="Éditer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <CategoryEditorModal
          isOpen={isCategoryEditorOpen}
          category={editingCategory}
          isCreateMode={isCreateCategoryMode}
          onClose={() => setIsCategoryEditorOpen(false)}
          onSave={(catData) => {
            if (isCreateCategoryMode) {
              addCategory(catData);
            } else if (editingCategory) {
              updateCategory(editingCategory.id, catData);
            }
          }}
        />

        <ProductEditorModal
          isOpen={isEditorOpen}
          product={editingProduct}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveProduct}
        />
      </div>
    </div>
  );
};
