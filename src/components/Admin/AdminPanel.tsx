import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import { authService } from '../../services/authService';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminInventory } from './AdminInventory';
import { ProductEditorModal } from './ProductEditorModal';
import {
  X,
  Database,
  Package,
  ShoppingBag,
  Layers,
  LogOut
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    isAdminOpen,
    setIsAdminOpen,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus
  } = useShop();

  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  if (!isAdminOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authService.login(passwordInput);
    if (success) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleAdminLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAdminOpen(false)} />
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-50 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display">Connexion Admin AKABLISHOP</h3>
            </div>
            <button onClick={() => setIsAdminOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mot de passe Administrateur</label>
              <input
                type="password"
                required
                placeholder="Entrez le mot de passe..."
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setAuthError(false); }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
              {authError && (
                <p className="text-xs text-rose-400 mt-1">Mot de passe incorrect. Veuillez réessayer.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Déverrouiller le CMS Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSaveProduct = async (productData: Product) => {
    if (editingProduct) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsAdminOpen(false)}
      />

      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold font-display">AKABLISHOP Admin CMS</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {isSupabaseConfigured ? 'Connecté Supabase' : 'CMS Mode Direct'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Panneau de Gestion Produits, Stock et Commandes Client</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAdminLogout}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400"
              title="Déconnexion Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 py-3 border-b border-gray-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'products' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gestion Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'orders' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes Clients ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'inventory' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventaire & Stock</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              onAddClick={() => { setEditingProduct(null); setIsEditorOpen(true); }}
              onEditClick={p => { setEditingProduct(p); setIsEditorOpen(true); }}
              onDeleteClick={handleDeleteProduct}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateStatus={updateOrderStatus}
            />
          )}

          {activeTab === 'inventory' && (
            <AdminInventory
              products={products}
            />
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <ProductEditorModal
        product={editingProduct}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
