import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../ProductCard';
import { 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Calendar, 
  Check, 
  ArrowLeft,
  Share2,
  Box,
  FileText,
  Sliders,
  MessageSquare
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { products, setActiveTab } = useShop();

  const [activeImage, setActiveImage] = useState(product.image);

  React.useEffect(() => {
    setActiveImage(product.image);
  }, [product.id, product.image]);
  const [quantity, setQuantity] = useState(1);
  const [activeTabSection, setActiveTabSection] = useState<'desc' | 'specs' | 'box' | 'reviews'>('desc');
  const [copied, setCopied] = useState(false);

  const isLiked = isInWishlist(product.id);

  // Filter related active products from Supabase catalog
  const activeProducts = products.filter(p => p.isActive !== false);
  const relatedProducts = activeProducts.filter(
    p => p.id !== product.id && (p.category.toLowerCase() === product.category.toLowerCase() || p.brand.toLowerCase() === product.brand.toLowerCase())
  ).slice(0, 4);

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Bonjour AKABLISHOP, je souhaite commander le produit suivant :\n\n*${product.name}*\nPrix : ${product.price.toLocaleString('fr-FR')} DH\nQuantité : ${quantity}\n\nMerci de me donner les détails de livraison.`
    );
    window.open(`https://wa.me/212701896033?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} chez AKABLISHOP Maroc`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('shop')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la Boutique</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Lien copié !' : 'Partager'}</span>
          </button>
        </div>

        {/* Top Product Hero Layout (Left Gallery, Right Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Preview */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-center overflow-hidden shadow-sm">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain max-h-[450px]"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {(product.isOccasion || product.condition === 'used') && (
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-extrabold shadow flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Occasion Certifiée</span>
                  </span>
                )}
                {(product.isRental || product.commercialMode === 'rental' || product.commercialMode === 'both') && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shadow flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Disponible en Location</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selector Carousel */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl bg-white border p-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      activeImage === img
                        ? 'border-amber-500 ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vue ${idx+1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Purchase Panel */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Brand & Category */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 font-bold text-amber-800 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="capitalize text-slate-500">Catégorie: {product.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Stock Status */}
            <div className="flex items-center space-x-4 border-y border-gray-200 py-3 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900 ml-1">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} avis certifiés)</span>
              </div>

              <span className="text-gray-300">|</span>

              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <Check className="w-4 h-4" />
                <span>En Stock à Marrakech</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">Prix Spécial</span>
                <div className="text-3xl font-extrabold text-slate-900">
                  {product.price.toLocaleString('fr-FR')} <span className="text-lg font-bold text-amber-600">DH</span>
                </div>
                {product.oldPrice && (
                  <div className="text-xs text-slate-400 line-through mt-0.5">
                    Ancien Prix: {product.oldPrice.toLocaleString('fr-FR')} DH
                  </div>
                )}
              </div>

              {product.rentalPricePerDay && (
                <div className="text-right border-l border-gray-200 pl-4">
                  <span className="block text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Option Location</span>
                  <span className="text-sm font-extrabold text-slate-900">{product.rentalPricePerDay} DH</span>
                  <span className="block text-[10px] text-slate-500">/ Jour de tournage</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.shortDescription}
            </p>

            {/* Quantity Selector & Main Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-700">Quantité:</span>
                <div className="flex items-center bg-slate-100 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg text-slate-700 hover:bg-white font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg text-slate-700 hover:bg-white font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="sm:col-span-7 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au Panier</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="sm:col-span-5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  isLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white border-gray-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Produit dans votre Liste de Souhaits' : 'Ajouter aux favoris'}</span>
              </button>
            </div>

            {/* Delivery & Warranty Guarantees Box */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 grid grid-cols-2 gap-4 text-left text-xs shadow-sm">
              <div className="flex items-start space-x-2.5">
                <Truck className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900">Livraison Express Maroc</h5>
                  <p className="text-[10px] text-slate-500">Gratuite dès 2 000 DH d'achat</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900">Garantie & Support</h5>
                  <p className="text-[10px] text-slate-500">SAV dédié à Marrakech</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM: Detailed Tabs (Description, Specifications, Box Content, Reviews) */}
        <div className="pt-8 border-t border-gray-200">
          
          {/* Tabs Selector */}
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 overflow-x-auto">
            {[
              { id: 'desc', label: 'Description Détaillée', icon: FileText },
              { id: 'specs', label: 'Spécifications Techniques', icon: Sliders },
              { id: 'box', label: 'Contenu du Coffret', icon: Box },
              { id: 'reviews', label: `Avis Clients (${product.reviewCount})`, icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTabSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabSection(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                    active
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="py-8 max-w-4xl">
            {activeTabSection === 'desc' && (
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <h3 className="text-lg font-bold text-slate-900">À propos du {product.name}</h3>
                <p>{product.description}</p>
                <p>
                  Disponible chez **AKABLISHOP Marrakech**, votre spécialiste indépendant du matériel de prise de vue cinématographique et photographique au Maroc.
                </p>
              </div>
            )}

            {activeTabSection === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Fiche Technique</h3>
                <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200 bg-white">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-white">
                      <span className="font-bold text-slate-500">{key}</span>
                      <span className="sm:col-span-2 text-slate-900 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTabSection === 'box' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Qu'est-ce qui est inclus dans le coffret ?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.whatsInTheBox.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200 flex items-center space-x-3 text-xs text-slate-800 shadow-sm">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTabSection === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Avis et Évaluations Clients</h3>
                  <span className="text-xs text-amber-600 font-bold">★ {product.rating} / 5</span>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Youssef B.', date: 'Il y a 3 jours', comment: 'Matériel commandé à Marrakech et livré le lendemain à Casablanca. Emballage irréprochable et caméra 100% conforme !', rating: 5 },
                    { name: 'Mehdi K.', date: 'Il y a 1 semaine', comment: 'Excellente équipe AKABLISHOP, conseils précieux pour le choix du kit optique Sony. Je recommande vivement !', rating: 5 }
                  ].map((rev, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.name}</span>
                        <span className="text-slate-400 text-[10px]">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3 h-3 fill-amber-400" />)}
                      </div>
                      <p className="text-slate-700">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Related Products Carousel Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 space-y-6">
            <h3 className="text-xl font-bold font-display text-slate-900">Produits Similaires Recommandés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
