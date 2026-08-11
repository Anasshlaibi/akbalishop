import React from 'react';
import { Order, OrderStatus } from '../../types';
import { ShoppingBag, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateStatus }) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" />En attente</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle2 className="w-3 h-3" />Confirmée</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"><Truck className="w-3 h-3" />Expédiée</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><PackageCheck className="w-3 h-3" />Livrée</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" />Annulée</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">N° Commande</th>
              <th className="p-3.5">Client & Contact</th>
              <th className="p-3.5">Ville / Adresse</th>
              <th className="p-3.5">Total & Articles</th>
              <th className="p-3.5">Statut</th>
              <th className="p-3.5 text-right">Changer Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5">
                  <span className="font-extrabold text-slate-900 font-mono">{order.orderNumber || order.id}</span>
                  <span className="block text-[10px] text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="font-bold text-slate-900">{order.customerName}</span>
                  <span className="block text-[10px] text-slate-500 font-mono">{order.customerPhone}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-slate-800">{order.city}</span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-xs">{order.address}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-extrabold text-slate-900">{order.totalAmount.toLocaleString('fr-FR')} DH</span>
                  <span className="block text-[10px] text-slate-500">{order.items.length} article(s)</span>
                </td>
                <td className="p-3.5">
                  {getStatusBadge(order.status)}
                </td>
                <td className="p-3.5 text-right">
                  <select
                    value={order.status}
                    onChange={e => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune commande enregistrée</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
