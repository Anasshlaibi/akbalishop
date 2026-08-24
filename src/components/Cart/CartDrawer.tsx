import React, { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { recommendationEngine } from '../../services/recommendationEngine';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, Check, Plus, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    addToCart,
    subtotal, 
    freeShippingThreshold 
  } = useCart();
  const { products, setIsCheckoutOpen } = useShop();

  const cartKitRecommendations = useMemo(() => {
    return recommendationEngine.getCartKitRecommendations(cart, products);
  }, [cart, products]);

  if (!isCartOpen) return null;

  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900 font-display">Votre Panier AKABLISHOP</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-slate-100 border border-gray-200 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-slate-50 border-b border-gray-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Plus que <strong className="text-amber-700 font-bold">{remainingForFreeShipping.toLocaleString('fr-FR')} DH</strong> pour la livraison offerte</span>
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <Check className="w-4 h-4" />
                <span>Félicitations ! Livraison gratuite activée au Maroc.</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              <>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div 
                      key={item.product.id} 
                      className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3.5 relative group shadow-sm"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 rounded-xl object-contain bg-slate-50 p-1.5 border border-gray-100 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-amber-700">{item.product.brand}</span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                        <div className="text-xs font-extrabold text-slate-900 mt-1">
                          {item.product.price.toLocaleString('fr-FR')} <span className="text-[10px] text-amber-700">DH</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center bg-slate-100 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 text-slate-700 hover:text-slate-900 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 text-slate-700 hover:text-slate-900 flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Supprimer du panier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Smart Cart Kit Recommendations */}
                {cartKitRecommendations.length > 0 && (
                  <div className="pt-4 mt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center space-x-1 text-xs text-amber-800 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Complétez votre Kit Tournage</span>
                    </div>

                    <div className="space-y-2">
                      {cartKitRecommendations.map(rec => (
                        <div key={rec.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between text-xs shadow-sm">
                          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                            <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-lg object-contain bg-white p-1 border flex-shrink-0" />
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 truncate text-[11px]">{rec.name}</h5>
                              <span className="text-[10px] text-amber-700 font-extrabold">{rec.price.toLocaleString('fr-FR')} DH</span>
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(rec, 1)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center space-x-1 flex-shrink-0 shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Votre panier est vide</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Découvrez notre sélection de caméras, objectifs et éclairage pour commencer vos achats.
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Controls */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Sous-total HT</span>
                  <span className="font-semibold text-slate-900">{subtotal.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Livraison Maroc</span>
                  <span className="font-semibold text-emerald-700">
                    {subtotal >= freeShippingThreshold ? 'Offerte' : 'Calculée à la commande'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-gray-200">
                  <span>Total TTC</span>
                  <span className="text-amber-700 text-lg">{subtotal.toLocaleString('fr-FR')} DH</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs tracking-wide uppercase shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>Procéder au paiement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Paiement sécurisé à la livraison ou virement bancaire</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
