import React from 'react';
import { Product } from '../../types';
import { AlertCircle, CheckCircle, Package } from 'lucide-react';

interface AdminInventoryProps {
  products: Product[];
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ products }) => {
  const lowStockThreshold = 3;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total Références</p>
            <p className="text-lg font-extrabold text-slate-900">{products.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase">En Stock</p>
            <p className="text-lg font-extrabold text-emerald-900">{inStockCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-rose-600 font-bold uppercase">Rupture / Alerte</p>
            <p className="text-lg font-extrabold text-rose-900">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Produit</th>
              <th className="p-3.5">Marque</th>
              <th className="p-3.5">Quantité Stock</th>
              <th className="p-3.5">Statut Inventaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const stock = product.stockCount ?? (product.inStock ? 1 : 0);
              const isLow = stock <= lowStockThreshold && stock > 0;
              return (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{product.name}</td>
                  <td className="p-3.5 font-semibold text-slate-600">{product.brand}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{stock} unité(s)</td>
                  <td className="p-3.5">
                    {stock === 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">Rupture de Stock</span>
                    ) : isLow ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Stock Faible ({stock})</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Disponible</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
