import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../data/products';
import { isSupabaseConfigured } from '../../lib/supabase';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Database, 
  Package, 
  ShoppingBag, 
  Search, 
  Sparkles,
  RefreshCw,
  Calendar,
  Layers,
  Save,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

import { authService } from '../../services/authService';

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

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: 'Sony',
    category: 'cameras',
    price: 10000,
    oldPrice: undefined,
    inStock: true,
    isNew: true,
    isOccasion: false,
    isRental: false,
    image: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
    shortDescription: '',
    description: ''
  });


  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'supabase'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

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
              <h3 className="text-lg font-bold">Connexion Admin AKABLISHOP</h3>
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


  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProduct.name,
      brand: newProduct.brand || 'Sony',
      category: newProduct.category || 'cameras',
      price: Number(newProduct.price),
      oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
      rating: 5.0,
      reviewCount: 0,
      inStock: newProduct.inStock ?? true,
      isNew: newProduct.isNew ?? true,
      isOccasion: newProduct.isOccasion ?? false,
      isRental: newProduct.isRental ?? false,
      rentalPricePerDay: newProduct.rentalPricePerDay ? Number(newProduct.rentalPricePerDay) : undefined,
      image: newProduct.image || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
      gallery: [newProduct.image || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp'],
      shortDescription: newProduct.shortDescription || '',
      description: newProduct.description || '',
      specs: { 'Origine': 'AKABLISHOP Pro' },
      whatsInTheBox: ['Équipement principal', 'Accessoires standards']
    };

    addProduct(created);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      brand: 'Sony',
      category: 'cameras',
      price: 10000,
      inStock: true,
      image: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
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
              <p className="text-xs text-slate-400">Panneau de Gestion Produits, Prix, Stock et Commandes Client</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
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
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'supabase' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Données / Supabase</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Top Controls: Search & Add Product */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, marque, catégorie..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-500 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Produit</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Image & Nom</th>
                      <th className="p-3.5">Marque & Catégorie</th>
                      <th className="p-3.5">Prix (DH)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Tags</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-1" />
                            <span className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div>
                            <span className="font-bold text-amber-700 uppercase">{p.brand}</span>
                            <span className="block text-[10px] text-slate-400 capitalize">{p.category}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-extrabold text-slate-900">
                          {p.price.toLocaleString('fr-FR')} DH
                          {p.oldPrice && <span className="block text-[10px] text-slate-400 line-through font-normal">{p.oldPrice.toLocaleString('fr-FR')} DH</span>}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => updateProduct({ ...p, inStock: !p.inStock })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              p.inStock 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {p.inStock ? 'En Stock' : 'Rupture'}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.isOccasion && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">Occasion</span>}
                            {p.isRental && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">Location</span>}
                            {p.isNew && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">Neuf</span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Supprimer ${p.name} ?`)) deleteProduct(p.id); }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Historique des Commandes Clients</h3>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-700">{order.id}</span>
                          <h4 className="text-sm font-bold text-slate-900">{order.customerName} ({order.customerPhone})</h4>
                          <p className="text-xs text-slate-500">{order.city} — {order.address}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-slate-900">{order.totalAmount.toLocaleString('fr-FR')} DH</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-gray-200 text-xs font-bold text-slate-800 cursor-pointer"
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 text-slate-600">
                        <span className="font-bold text-slate-800">Articles commandés:</span>
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>- {it.name} (x{it.quantity})</span>
                            <span>{(it.price * it.quantity).toLocaleString('fr-FR')} DH</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border text-center text-slate-500 text-xs">
                  Aucune commande client enregistrée pour le moment.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPABASE INTEGRATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Database className="w-5 h-5" />
                  <span>Configuration Supabase & PostgreSQL</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pour synchroniser vos produits, prix et commandes sur une base de données Cloud Supabase gratuite, créez un projet Supabase et ajoutez vos clés dans votre fichier <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">.env</code> :
                </p>
                <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto">
                  {`VITE_SUPABASE_URL=https://votre-projet.supabase.co\nVITE_SUPABASE_ANON_KEY=votre-cle-api-anon`}
                </pre>
              </div>

              {/* SQL Schema Generator */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Script d'Initialisation SQL pour Supabase</h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  in_stock BOOLEAN DEFAULT true,
  image TEXT NOT NULL
);`);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-amber-700 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? 'Copié !' : 'Copier le SQL'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase pour créer automatiquement les tables nécessaires.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ADD PRODUCT MODAL OVERLAY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ajouter un Nouveau Produit</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom du Produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sony FX30 Caméra Cinéma Super35"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marque *</label>
                  <select
                    value={newProduct.brand}
                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Sony">Sony</option>
                    <option value="Nikon">Nikon</option>
                    <option value="Canon">Canon</option>
                    <option value="Røde">Røde</option>
                    <option value="Godox">Godox</option>
                    <option value="DJI">DJI</option>
                    <option value="GoPro">GoPro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="cameras">Caméras</option>
                    <option value="objectifs">Objectifs</option>
                    <option value="eclairage">Éclairage</option>
                    <option value="audio">Son</option>
                    <option value="stabilisateurs">Stabilisateurs</option>
                    <option value="occasions">Occasions</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Vente (DH) *</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={newProduct.price || ''}
                    onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ancien Prix (DH)</label>
                  <input
                    type="number"
                    placeholder="28000"
                    value={newProduct.oldPrice || ''}
                    onChange={e => setNewProduct({ ...newProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL / Chemin de l'image *</label>
                <input
                  type="text"
                  required
                  placeholder="/wp-content/uploads/SONY-FX6-jpg-300x300.webp"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  />
                  <span>En Stock</span>
                </label>

                <label className="flex items-center space-x-2 font-bold text-amber-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isOccasion}
                    onChange={e => setNewProduct({ ...newProduct, isOccasion: e.target.checked })}
                  />
                  <span>Occasion Certifiée</span>
                </label>

                <label className="flex items-center space-x-2 font-bold text-emerald-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isRental}
                    onChange={e => setNewProduct({ ...newProduct, isRental: e.target.checked })}
                  />
                  <span>Location Disponible</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-500 transition-all"
              >
                Enregistrer le Produit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Modifier: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom du Produit *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Vente (DH) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ancien Prix (DH)</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.image}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  />
                  <span>En Stock</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-500 transition-all flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder les modifications</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
