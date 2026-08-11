import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
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
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, isAdminOpen, setIsAdminOpen } = useShop();

  // Don't render at all when closed
  if (!isAdminOpen) return null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'akabli2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
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

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700"
          title="Fermer"
        >
          <XCircle className="w-5 h-5" />
        </button>
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">AKABLISHOP CMS</h2>
          <p className="text-slate-400 text-sm mb-6">Accès sécurisé à la gestion du catalogue Supabase</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-semibold"
                autoFocus
              />
              {authError && (
                <p className="text-rose-500 text-xs font-semibold mt-2 text-left">Mot de passe incorrect</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 rounded-xl text-sm transition-colors shadow-lg"
            >
              Déverrouiller le CMS Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 overflow-y-auto font-sans">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <Package className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-bold font-display text-white">Gestion du Catalogue Supabase</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Gérez vos équipements en direct dans PostgreSQL</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center space-x-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voir le Site Client</span>
            </button>

            <button
              onClick={handleCreateProduct}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou marque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
          >
            <option value="all">Toutes les catégories</option>
            <option value="cameras">Caméras</option>
            <option value="objectifs">Objectifs</option>
            <option value="audio">Audio</option>
            <option value="eclairage">Éclairage</option>
            <option value="stabilisateurs">Stabilisateurs</option>
            <option value="accessoires">Accessoires</option>
            <option value="occasions">Occasions</option>
          </select>
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
