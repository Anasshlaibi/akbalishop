import React, { useState } from 'react';
import { Product } from '../../types';
import { Search, Plus, Edit3, Trash2, Package } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onAddClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (id: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar: Search & Add Product */}
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
          onClick={onAddClick}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Produit</th>
              <th className="p-3.5">Catégorie / Marque</th>
              <th className="p-3.5">Prix</th>
              <th className="p-3.5">Statut</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate max-w-xs">{product.name}</p>
                    <p className="text-[10px] text-slate-400">ID: {product.id}</p>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-slate-700">{product.brand}</span>
                  <span className="block text-[10px] text-slate-400 capitalize">{product.category}</span>
                </td>
                <td className="p-3.5 font-extrabold text-slate-900">
                  {product.price.toLocaleString('fr-FR')} DH
                  {product.rentalPricePerDay && (
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      Loc: {product.rentalPricePerDay.toLocaleString('fr-FR')} DH/j
                    </span>
                  )}
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    product.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {product.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEditClick(product)}
                      className="p-1.5 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(product.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun produit trouvé</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
