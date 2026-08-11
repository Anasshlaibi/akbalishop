import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Save, Sparkles } from 'lucide-react';

interface ProductEditorModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Product) => Promise<void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (product) return { ...product };
    return {
      name: '',
      brand: 'Sony',
      category: 'cameras',
      price: 10000,
      oldPrice: undefined,
      inStock: true,
      condition: 'new',
      commercialMode: 'sale',
      isNew: true,
      isOccasion: false,
      isRental: false,
      rentalPricePerDay: undefined,
      image: '/public/placeholder-gear.jpg',
      shortDescription: '',
      description: ''
    };
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    setIsSubmitting(true);

    try {
      const p: Product = {
        id: product?.id || `prod-${Date.now()}`,
        name: formData.name,
        brand: formData.brand || 'Sony',
        category: formData.category || 'cameras',
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        rating: product?.rating || 5.0,
        reviewCount: product?.reviewCount || 0,
        inStock: formData.inStock ?? true,
        stockCount: formData.stockCount ? Number(formData.stockCount) : 1,
        condition: formData.condition || 'new',
        commercialMode: formData.commercialMode || 'sale',
        isNew: formData.isNew ?? true,
        isOccasion: formData.isOccasion ?? false,
        isRental: formData.isRental ?? false,
        rentalPricePerDay: formData.rentalPricePerDay ? Number(formData.rentalPricePerDay) : undefined,
        image: formData.image || '/public/placeholder-gear.jpg',
        gallery: [formData.image || '/public/placeholder-gear.jpg'],
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        specs: formData.specs || { 'Garantie': 'AKABLISHOP 1 An' },
        whatsInTheBox: formData.whatsInTheBox || ['Matériel principal', 'Accessoires inclus']
      };

      await onSave(p);
      onClose();
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl z-50 text-slate-900 overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold font-display">
              {product ? 'Éditer le Produit' : 'Nouveau Produit AKABLISHOP'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de l'Équipement *</label>
            <input
              type="text"
              required
              placeholder="Ex: Sony FX3 Cinema Line"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marque</label>
              <select
                value={formData.brand || 'Sony'}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              >
                <option value="Sony">Sony</option>
                <option value="Canon">Canon</option>
                <option value="Nikon">Nikon</option>
                <option value="DJI">DJI</option>
                <option value="Godox">Godox</option>
                <option value="Rode">Rode</option>
                <option value="Blackmagic">Blackmagic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
              <select
                value={formData.category || 'cameras'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              >
                <option value="cameras">Boîtiers Caméras</option>
                <option value="lenses">Objectifs & Optiques</option>
                <option value="lighting">Éclairage Studio</option>
                <option value="audio">Microphones & Audio</option>
                <option value="stabilizers">Gimbals & Stabilisateurs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prix Vente (DH) *</label>
              <input
                type="number"
                required
                min={0}
                placeholder="69900"
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prix Location (DH/Jour)</label>
              <input
                type="number"
                min={0}
                placeholder="1200"
                value={formData.rentalPricePerDay || ''}
                onChange={e => setFormData({ ...formData, rentalPricePerDay: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Image du Produit</label>
            <input
              type="text"
              placeholder="/public/placeholder-gear.jpg"
              value={formData.image || ''}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description Courte</label>
            <textarea
              rows={2}
              placeholder="Aperçu des caractéristiques principales..."
              value={formData.shortDescription || ''}
              onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
