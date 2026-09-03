import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
import { CategoryEditorModal } from './CategoryEditorModal';
import { SlideEditorModal } from './SlideEditorModal';
import { HeroSlide } from '../../types';
import { Category } from '../../data/categories';
import { intelligentSearchService, SearchAnalyticsItem } from '../../services/intelligentSearchService';
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
  Key,
  BarChart2,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'akabli_admin_session_v1';

export const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, updateCategory, slides, addSlide, updateSlide, deleteSlide, reorderSlides, isAdminOpen, setIsAdminOpen } = useShop();

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
  
  const [adminTab, setAdminTab] = useState<'products' | 'categories' | 'search' | 'slides'>('products');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
  const [isCreateCategoryMode, setIsCreateCategoryMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [slidesTabFilter, setSlidesTabFilter] = useState<'all' | 'main' | 'secondary'>('all');
  const [isSlideEditorOpen, setIsSlideEditorOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Search Analytics Data State
  const [analyticsData, setAnalyticsData] = useState<{ topSearches: SearchAnalyticsItem[]; zeroResults: SearchAnalyticsItem[] }>({
    topSearches: [],
    zeroResults: []
  });

  useEffect(() => {
    if (adminTab === 'search') {
      const data = intelligentSearchService.getSearchAnalytics();
      setAnalyticsData(data);
    }
  }, [adminTab]);

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
                <Key className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
              </div>
              {authError && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 inline mr-1" /> Mot de passe incorrect.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 mt-2"
            >
              Se Connecter
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
            <p className="text-xs text-slate-400 mt-0.5">Gérez vos équipements, recherche intelligente & suggestions</p>
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
                🏷️ Catégories ({categories ? categories.length : 8})
              </button>
              <button
                onClick={() => setAdminTab('slides')}
                className={'px-4 py-2 rounded-xl transition-all ' + (
                  adminTab === 'slides' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                )}
              >
                🖼️ Slides & Offres ({slides ? slides.length : 6})
              </button>
              <button
                onClick={() => setAdminTab('search')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  adminTab === 'search' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🔍 Recherche & Analytics
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
              className="p-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 rounded-xl border border-rose-800/40 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* SEARCH ANALYTICS TAB */}
        {adminTab === 'search' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Recherches Enregistrées</span>
                  <BarChart2 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-white">{analyticsData.topSearches.reduce((acc, i) => acc + i.count, 0)}</div>
                <p className="text-[11px] text-slate-500">Total des requêtes clients saisies</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Recherches Sans Résultat</span>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-rose-400">{analyticsData.zeroResults.length}</div>
                <p className="text-[11px] text-slate-500">Mots-clés sans produit correspondant</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Moteur Intelligent</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400">Actif (Fuzzy + Specs)</div>
                <p className="text-[11px] text-slate-500">Normalisation 70-200, f/2.8 & Montures</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Searched Terms */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span>Top Mots-Clés Recherchés</span>
                </h3>
                <div className="space-y-2">
                  {analyticsData.topSearches.length > 0 ? (
                    analyticsData.topSearches.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="font-bold text-amber-400 font-mono">"{item.query}"</div>
                        <div className="flex items-center space-x-3 text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 font-extrabold text-white">{item.count} recherche(s)</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">Aucune donnée de recherche encore enregistrée.</p>
                  )}
                </div>
              </div>

              {/* Zero Result Queries */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Recherches à 0 Résultat (À ajouter)</span>
                </h3>
                <div className="space-y-2">
                  {analyticsData.zeroResults.length > 0 ? (
                    analyticsData.zeroResults.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="font-bold text-rose-400 font-mono">"{item.query}"</div>
                        <span className="text-[10px] text-slate-500">Ajoutez un synonyme ou produit</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">Toutes les recherches ont retourné des produits !</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* SLIDES & HERO BANNERS MANAGEMENT TAB */}
        {adminTab === 'slides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSlidesTabFilter('all')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                    slidesTabFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  Tous ({(slides || []).length})
                </button>
                <button
                  onClick={() => setSlidesTabFilter('main')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                    slidesTabFilter === 'main' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  Carrousel Principal ({(slides || []).filter(s => s.type === 'main').length})
                </button>
                <button
                  onClick={() => setSlidesTabFilter('secondary')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                    slidesTabFilter === 'secondary' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  Bannières Droite ({(slides || []).filter(s => s.type === 'secondary').length})
                </button>
              </div>

              <button
                onClick={() => { setEditingSlide(null); setIsSlideEditorOpen(true); }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Slide / Bannière</span>
              </button>
            </div>

            {/* Slides Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(slides || [])
                .filter(s => slidesTabFilter === 'all' || s.type === slidesTabFilter)
                .map((slide, idx) => {
                  const linkedProd = slide.productId ? products.find(p => p.id === slide.productId) : null;
                  return (
                    <div key={slide.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-16 h-16 rounded-xl object-contain bg-slate-950 p-1.5 border border-slate-800 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={'px-2 py-0.5 rounded text-[9px] font-black uppercase ' + (
                                slide.type === 'main' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                              )}>
                                {slide.type === 'main' ? 'Carrousel Principal' : 'Bannière Droite'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold">
                                {slide.badge}
                              </span>
                            </div>

                            <h4 className="font-bold text-white text-sm line-clamp-1">{slide.title}</h4>
                            
                            {slide.subtitle && (
                              <p className="text-xs text-slate-400 line-clamp-1">{slide.subtitle}</p>
                            )}

                            <div className="flex items-center space-x-2 text-xs pt-0.5">
                              <span className="font-extrabold text-amber-400">{slide.price}</span>
                              {slide.oldPrice && (
                                <span className="text-slate-500 line-through text-[10px]">{slide.oldPrice}</span>
                              )}
                              {linkedProd && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold border border-emerald-800/50">
                                  📦 Lié: {linkedProd.name.slice(0, 20)}...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={'px-2 py-0.5 rounded text-[10px] font-bold ' + (
                            slide.isActive !== false ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-500'
                          )}>
                            {slide.isActive !== false ? '● Actif' : '○ Masqué'}
                          </span>
                          <span className="text-slate-500 text-[10px]">Pos: #{idx + 1}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => { setEditingSlide(slide); setIsSlideEditorOpen(true); }}
                            className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center space-x-1 px-2.5 font-bold text-[11px]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Éditer</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Supprimer ce slide ?')) deleteSlide(slide.id);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Filtrer par nom ou marque..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateProduct}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Produit</th>
                      <th className="px-4 py-3">Marque / Catégorie</th>
                      <th className="px-4 py-3 text-right">Prix (DH)</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 flex-shrink-0" />
                          <span className="font-bold text-white truncate max-w-xs">{product.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-amber-400 uppercase text-[10px]">{product.brand}</div>
                          <div className="text-slate-400 capitalize">{product.category}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-white">
                          {product.price.toLocaleString('fr-FR')} DH
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            product.inStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {product.inStock ? 'En Stock' : 'Rupture'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {product.isActive !== false ? (
                            <span className="text-emerald-400 font-bold text-[10px]">Actif</span>
                          ) : (
                            <span className="text-slate-500 font-bold text-[10px]">Inactif</span>
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
