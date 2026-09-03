import React, { useState, useEffect } from 'react';
import { HeroSlide, SlideType, Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { uploadProductImage } from '../../services/storageService';
import { 
  X, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Package, 
  Tag, 
  Zap, 
  DollarSign, 
  Layers,
  AlertCircle
} from 'lucide-react';

interface SlideEditorModalProps {
  isOpen: boolean;
  slide: HeroSlide | null;
  onClose: () => void;
  onSave: (slideData: Partial<HeroSlide>) => void;
}

export const SlideEditorModal: React.FC<SlideEditorModalProps> = ({
  isOpen,
  slide,
  onClose,
  onSave
}) => {
  const { products } = useShop();

  const [type, setType] = useState<SlideType>('main');
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [image, setImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [productId, setProductId] = useState('');
  const [stockBadge, setStockBadge] = useState('Stock Marrakech');
  const [isActive, setIsActive] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    if (slide) {
      setType(slide.type || 'main');
      setBadge(slide.badge || '');
      setTitle(slide.title || '');
      setSubtitle(slide.subtitle || '');
      setPrice(slide.price || '');
      setOldPrice(slide.oldPrice || '');
      setImage(slide.image || '');
      setCtaText(slide.ctaText || '');
      setProductId(slide.productId || '');
      setStockBadge(slide.stockBadge || 'Stock Marrakech');
      setIsActive(slide.isActive !== false);
    } else {
      setType('main');
      setBadge('PROMO EXCLUSIVE');
      setTitle('');
      setSubtitle('');
      setPrice('');
      setOldPrice('');
      setImage('');
      setCtaText('Commander');
      setProductId('');
      setStockBadge('Stock Marrakech');
      setIsActive(true);
    }
    setUploadNotice(null);
  }, [slide, isOpen]);

  // When a product is selected from dropdown, prefill values
    const handleProductSelect = (selectedProdId: string) => {
    setProductId(selectedProdId);
    if (!selectedProdId) return;

    const prod = products.find(p => p.id === selectedProdId || p.slug === selectedProdId);
    if (prod) {
      setTitle(prod.name);
      setPrice(prod.price.toLocaleString('fr-FR') + ' DH');
      if (prod.oldPrice) {
        setOldPrice(prod.oldPrice.toLocaleString('fr-FR') + ' DH');
      } else {
        setOldPrice('');
      }
      if (prod.image) {
        setImage(prod.image);
      }
      if (prod.shortDescription) {
        setSubtitle(prod.shortDescription);
      }
      if (prod.brand) {
        setBadge(prod.brand.toUpperCase() + ' • EN VEDETTE');
      }
      setCtaText(type === 'main' ? 'Découvrir ' + prod.name.slice(0, 18) : 'Profiter de l\'offre');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadNotice(null);
    try {
      const res = await uploadProductImage(file, title || 'slide-image');
      if (res.success && res.url) {
        setImage(res.url);
        setUploadNotice('Image optimisée WebP (' + res.compressedSizeKb + ' KB)');
      } else {
        setUploadNotice("Erreur lors du chargement de l'image.");
      }
    } catch (err: any) {
      setUploadNotice(err?.message || 'Erreur upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Veuillez entrer un titre pour ce slide.');
      return;
    }

    onSave({
      type,
      badge: badge.trim() || (type === 'main' ? 'CINEMA LINE • EN VEDETTE' : 'OFFRE SPÉCIALE'),
      title: title.trim(),
      subtitle: type === 'main' ? subtitle.trim() : undefined,
      price: price.trim(),
      oldPrice: oldPrice.trim() || undefined,
      image: image.trim() || '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
      ctaText: ctaText.trim() || (type === 'main' ? 'Commander le Kit' : "Profiter de l'offre"),
      productId: productId || undefined,
      stockBadge: stockBadge.trim() || undefined,
      isActive
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {slide ? 'Éditer le Slide / Bannière' : "Nouveau Slide / Bannière d'Accueil"}
              </h2>
              <p className="text-xs text-slate-400">Personnalisez les visuels et offres mis en avant sur la boutique</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Slide Position & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Emplacement sur la Page
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('main')}
                  className={'p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ' + (
                    type === 'main' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  )}
                >
                  <Zap className="w-4 h-4" />
                  <span>Carrousel Principal (70%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('secondary')}
                  className={'p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ' + (
                    type === 'secondary' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  )}
                >
                  <Tag className="w-4 h-4" />
                  <span>Bannière Droite (30%)</span>
                </button>
              </div>
            </div>

            {/* Link to Existing Product / Pack */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Lier à un Produit / Pack du Catalogue
              </label>
              <select
                value={productId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full py-3 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Aucun (Contenu Personnalisé) --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    📦 {p.name} ({p.price.toLocaleString('fr-FR')} DH)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Sélectionner un produit pré-remplira automatiquement le titre, le prix et la photo.</p>
            </div>
          </div>

          {/* Picture Upload / Image URL */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Image du Slide / Produit</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 flex-shrink-0 relative overflow-hidden group">
                {image ? (
                  <img src={image} alt="Aperçu" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  placeholder="URL de l'image (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <div className="flex items-center space-x-2">
                  <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{isUploading ? 'Chargement...' : '📁 Choisir une photo sur mon PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {uploadNotice && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> {uploadNotice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Texts & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Titre du Slide / Produit *</label>
              <input
                type="text"
                required
                placeholder="Ex: Sony FX6 – Caméra Cinéma 4K"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Badge Supérieur</label>
              <input
                type="text"
                placeholder="Ex: CINEMA LINE • EN VEDETTE"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {type === 'main' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sous-Titre / Description Courte</label>
              <textarea
                rows={2}
                placeholder="Ex: Capteur plein format Exmor R 10.2 MP, 15+ stops dynamique..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Prices & Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Prix Affiché</label>
              <input
                type="text"
                placeholder="Ex: 66 000 DH"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ancien Prix (Barré)</label>
              <input
                type="text"
                placeholder="Ex: 76 500 DH"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Texte du Bouton CTA</label>
              <input
                type="text"
                placeholder="Ex: Commander le Kit"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Étiquette Stock / Garantie</label>
              <input
                type="text"
                placeholder="Ex: Stock Marrakech"
                value={stockBadge}
                onChange={(e) => setStockBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-200">Actif (Visible sur la boutique)</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-colors shadow-md"
            >
              Enregistrer le Slide
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
