import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { X, Check, Truck, Building2, CreditCard, MessageCircle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, addOrder } = useShop();
  const { cart, subtotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'pickup'>('cod');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Marrakech',
    address: '',
    notes: ''
  });
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save Order to Supabase & Context Store
    const createdOrderId = addOrder({
      customerName: formData.fullName,
      customerPhone: formData.phone,
      city: formData.city,
      address: formData.address,
      paymentMethod,
      totalAmount: subtotal,
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      }))
    });

    setOrderRef(createdOrderId);
    setIsOrderComplete(true);
  };

  const handleSendWhatsAppConfirmation = () => {
    const itemsList = cart.map(i => `- ${i.product.name} (x${i.quantity})`).join('\n');
    const message = encodeURIComponent(
      `Bonjour AKABLISHOP, je valide ma commande N° *${orderRef}*\n\n` +
      `*Client:* ${formData.fullName}\n` +
      `*Téléphone:* ${formData.phone}\n` +
      `*Ville:* ${formData.city}\n` +
      `*Adresse:* ${formData.address}\n\n` +
      `*Articles:*\n${itemsList}\n\n` +
      `*Total:* ${subtotal.toLocaleString('fr-FR')} DH\n` +
      `*Mode de paiement:* ${paymentMethod === 'cod' ? 'Paiement à la livraison' : paymentMethod === 'bank' ? 'Virement bancaire' : 'Retrait Showroom Marrakech'}`
    );
    window.open(`https://wa.me/212701986033?text=${message}`, '_blank');
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">Finaliser votre Commande</h2>
            <p className="text-xs text-slate-500 font-medium">AKABLISHOP • Matériel Audiovisuel au Maroc</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-lg bg-slate-100 border border-gray-200 text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!isOrderComplete ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Mode de Paiement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'cod', label: 'Paiement à la livraison', sub: 'Espèces à la réception', icon: Truck },
                    { id: 'bank', label: 'Virement bancaire', sub: 'RIB fourni après validation', icon: CreditCard },
                    { id: 'pickup', label: 'Retrait Showroom', sub: 'Al Massar, Marrakech', icon: Building2 }
                  ].map(method => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          active
                            ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm'
                            : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${active ? 'text-amber-600' : ''}`} />
                        <h5 className="text-xs font-bold">{method.label}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{method.sub}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address & Customer Info Form */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Coordonnées de Livraison
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nom et Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Youssef Benjelloun"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 0695252921"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ville *</label>
                    <select
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Marrakech">Marrakech</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Agadir">Agadir</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Fes">Fès</option>
                      <option value="Oujda">Oujda</option>
                      <option value="Autre Ville">Autre Ville au Maroc</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Adresse de livraison complète *</label>
                    <input
                      type="text"
                      required
                      placeholder="Quartier, Rue, N° d'appartement..."
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Résumé ({cart.length} articles)</span>
                  <span className="text-slate-900 font-extrabold">{subtotal.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  {cart.map(i => (
                    <div key={i.product.id} className="flex justify-between">
                      <span className="truncate max-w-[250px]">{i.product.name} (x{i.quantity})</span>
                      <span>{(i.product.price * i.quantity).toLocaleString('fr-FR')} DH</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                Confirmer la Commande ({subtotal.toLocaleString('fr-FR')} DH)
              </button>
            </form>
          ) : (
            /* Order Completion Confirmation Screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Commande Enregistrée dans Supabase</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Merci pour votre confiance !</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 font-medium">
                  Votre référence de commande est <strong className="text-slate-900 font-mono">{orderRef}</strong>. Un conseiller AKABLISHOP vous contactera dans les plus brefs délais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 max-w-md mx-auto space-y-3">
                <button
                  onClick={handleSendWhatsAppConfirmation}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer la confirmation sur WhatsApp</span>
                </button>

                <button
                  onClick={() => { clearCart(); setIsCheckoutOpen(false); setIsOrderComplete(false); }}
                  className="w-full py-2.5 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-semibold hover:text-slate-900"
                >
                  Fermer la fenêtre
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
