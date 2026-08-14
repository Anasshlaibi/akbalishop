import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { productService, MutationResult } from '../../services/productService';
import { uploadProductImage } from '../../services/storageService';
import { X, Save, Settings, AlertCircle, Upload, Image as ImageIcon, CheckCircle, RefreshCw, Link as LinkIcon, Zap, ChevronDown, Plus } from 'lucide-react';

const DEFAULT_BRANDS = [
  '7Artisans',
  'AKABLISHOP',
  'Canon',
  'DJI',
  'Fujifilm',
  'Godox',
  'GoPro',
  'Hollyland',
  'Insta360',
  'K&F Concept',
  'Lexar',
  'Nikon',
  'Røde',
  'Sony',
  'Ulanzi'
];

const DEFAULT_CATEGORIES = [
  'accessoires',
  'appareils-photo',
  'audio',
  'cameras',
  'eclairage',
  'lenses',
  'location',
  'objectifs',
  'occasions',
  'stabilisateurs',
  'Son'
];

interface ProductEditorModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Product) => Promise<MutationResult<Product> | void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Brands & Categories state with instant default options
  const [brandsOptions, setBrandsOptions] = useState<string[]>(DEFAULT_BRANDS);
  const [categoriesOptions, setCategoriesOptions] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isCustomBrand, setIsCustomBrand] = useState<boolean>(false);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);

  // Image Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [uploadStats, setUploadStats] = useState<{
    originalKb: number;
    compressedKb: number;
    seoFilename: string;
  } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
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
  });

  // Synchronize form state whenever target product or modal visibility changes
  useEffect(() => {
    setErrorMessage(null);
    setUploadNotice(null);
    setUploadStats(null);
    setIsCustomBrand(false);
    setIsCustomCategory(false);

    if (isOpen) {
      const currentBrand = product?.brand || 'Sony';
      const currentCategory = product?.category || 'cameras';

      if (product) {
        setFormData({ ...product });
      } else {
        setFormData({
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
        });
      }

      // Immediately initialize options including current product values
      setBrandsOptions(prev => {
        const set = new Set([...DEFAULT_BRANDS, ...prev]);
        if (currentBrand) set.add(currentBrand);
        return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      });

      setCategoriesOptions(prev => {
        const set = new Set([...DEFAULT_CATEGORIES, ...prev]);
        if (currentCategory) set.add(currentCategory);
        return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      });

      // Fetch dynamic unique brands and categories from Supabase products table
      const loadDynamicOptions = async () => {
        try {
          const [fetchedBrands, fetchedCategories] = await Promise.all([
            productService.getUniqueBrands(),
            productService.getUniqueCategories()
          ]);

          setBrandsOptions(prev => {
            const set = new Set([...DEFAULT_BRANDS, ...fetchedBrands, ...prev]);
            if (currentBrand) set.add(currentBrand);
            return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
          });

          setCategoriesOptions(prev => {
            const set = new Set([...DEFAULT_CATEGORIES, ...fetchedCategories, ...prev]);
            if (currentCategory) set.add(currentCategory);
            return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
          });
        } catch (err) {
          console.error('Failed to load dynamic options from Supabase:', err);
        }
      };

      loadDynamicOptions();
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Process file upload, WebP compression & SEO renaming
  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    setUploadNotice(null);

    try {
      const res = await uploadProductImage(file, formData.name || 'product');
      if (res.success) {
        setFormData(prev => ({
          ...prev,
          image: res.url,
          gallery: prev.gallery && prev.gallery.length > 0 ? prev.gallery : [res.url]
        }));
        setUploadStats({
          originalKb: res.originalSizeKb,
          compressedKb: res.compressedSizeKb,
          seoFilename: res.seoFilename
        });
        if (res.error) {
          setUploadNotice(res.error);
        }
      } else {
        setErrorMessage(res.error || 'Erreur lors du chargement de l\'image');
      }
    } catch (err: any) {
      console.error('File upload handler error:', err);
      setErrorMessage(err?.message || 'Échec du traitement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const p: Product = {
        id: product?.id || `prod-${Date.now()}`,
        name: formData.name,
        brand: productService.normalizeBrand(formData.brand || 'Sony'),
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
        gallery: formData.gallery && formData.gallery.length > 0 ? formData.gallery : [formData.image || '/public/placeholder-gear.jpg'],
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        specs: formData.specs || { 'Garantie': 'AKABLISHOP 1 An' },
        whatsInTheBox: formData.whatsInTheBox || ['Matériel principal', 'Accessoires inclus']
      };

      const res: any = await onSave(p);
      if (res && res.error) {
        setErrorMessage(res.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Save product error:', err);
      setErrorMessage(err?.message || 'Erreur de connexion à Supabase');
    } finally {
      setIsSubmitting(false);
    }
  };

  const savingsPercent = uploadStats
    ? Math.round(((uploadStats.originalKb - uploadStats.compressedKb) / uploadStats.originalKb) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl z-50 text-slate-900 overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold font-display">
              {product ? `Éditer: ${product.name}` : 'Nouveau Produit AKABLISHOP'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Erreur Supabase : {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de l'Équipement *</label>
            <input
              type="text"
              required
              placeholder="Ex: Sony FX3 Cinema Line"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* MARQUE SELECTOR / DROPDOWN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Marque</label>
                {isCustomBrand && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBrand(false);
                      setFormData(prev => ({ ...prev, brand: brandsOptions[0] || 'Sony' }));
                    }}
                    className="text-[10px] text-amber-600 font-bold hover:underline"
                  >
                    Choisir de la liste
                  </button>
                )}
              </div>

              {!isCustomBrand ? (
                <div className="relative">
                  <select
                    required
                    value={brandsOptions.includes(formData.brand || '') ? formData.brand : (formData.brand ? formData.brand : (brandsOptions[0] || 'Sony'))}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__NEW_BRAND__') {
                        setIsCustomBrand(true);
                        setFormData(prev => ({ ...prev, brand: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, brand: val }));
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold appearance-none cursor-pointer pr-8"
                  >
                    {formData.brand && !brandsOptions.includes(formData.brand) && (
                      <option value={formData.brand}>{formData.brand}</option>
                    )}
                    {brandsOptions.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="__NEW_BRAND__" className="font-extrabold text-amber-600 bg-amber-50">
                      + Ajouter une nouvelle marque...
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Saisir nouvelle marque..."
                  value={formData.brand || ''}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-400 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
                />
              )}
            </div>

            {/* CATÉGORIE SELECTOR / DROPDOWN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Catégorie</label>
                {isCustomCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setFormData(prev => ({ ...prev, category: categoriesOptions[0] || 'cameras' }));
                    }}
                    className="text-[10px] text-amber-600 font-bold hover:underline"
                  >
                    Choisir de la liste
                  </button>
                )}
              </div>

              {!isCustomCategory ? (
                <div className="relative">
                  <select
                    required
                    value={categoriesOptions.includes(formData.category || '') ? formData.category : (formData.category ? formData.category : (categoriesOptions[0] || 'cameras'))}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__NEW_CATEGORY__') {
                        setIsCustomCategory(true);
                        setFormData(prev => ({ ...prev, category: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, category: val }));
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold appearance-none cursor-pointer pr-8"
                  >
                    {formData.category && !categoriesOptions.includes(formData.category) && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                    {categoriesOptions.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__NEW_CATEGORY__" className="font-extrabold text-amber-600 bg-amber-50">
                      + Ajouter une nouvelle catégorie...
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Saisir nouvelle catégorie..."
                  value={formData.category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-400 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
                />
              )}
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
                value={formData.price !== undefined ? formData.price : ''}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prix Location (DH/Jour)</label>
              <input
                type="number"
                min={0}
                placeholder="1200"
                value={formData.rentalPricePerDay !== undefined && formData.rentalPricePerDay !== null ? formData.rentalPricePerDay : ''}
                onChange={e => setFormData({ ...formData, rentalPricePerDay: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* AUTOMATED IMAGE UPLOADER & SEO OPTIMIZER SECTION */}
          <div className="border border-amber-200/80 bg-amber-50/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Image du Produit (Optimisé SEO & Supabase Storage)
                </span>
              </div>
              
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageInputMode('file')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
                    imageInputMode === 'file' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Depuis PC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
                    imageInputMode === 'url' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Lien URL</span>
                </button>
              </div>
            </div>

            {imageInputMode === 'file' ? (
              <div className="space-y-3">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isUploading
                      ? 'border-amber-400 bg-amber-100/50'
                      : 'border-slate-300 hover:border-amber-500 hover:bg-white bg-slate-50/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-2">
                      <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
                      <p className="text-xs font-bold text-slate-700">
                        Conversion WebP & Renommage SEO en cours...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Cliquez ou glissez une image depuis votre PC
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Auto-conversion WebP (ultra-rapide, moins de 200KB) + SEO slug Google
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Metrics Badge */}
                {uploadStats && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>
                        Optimisé pour SEO & Vitesse : <b>{uploadStats.seoFilename}</b>
                      </span>
                    </div>
                    {savingsPercent > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md font-bold text-[10px] flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>-{savingsPercent}% ({uploadStats.originalKb}KB → {uploadStats.compressedKb}KB)</span>
                      </span>
                    )}
                  </div>
                )}

                {uploadNotice && (
                  <div className="p-2 text-[10px] rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900 font-medium">
                    ℹ️ {uploadNotice}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="https://.../mon-image.webp"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            {/* Image Thumbnail Preview */}
            {formData.image && (
              <div className="flex items-center space-x-3 p-2 bg-white rounded-xl border border-gray-200">
                <img
                  src={formData.image}
                  alt="Aperçu du produit"
                  className="w-14 h-14 object-contain rounded-lg border border-gray-100 bg-slate-50 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/public/placeholder-gear.jpg';
                  }}
                />
                <div className="flex-1 overflow-hidden text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Aperçu Visuel</span>
                  <p className="text-xs font-semibold text-slate-800 truncate">{formData.name || 'Produit sans titre'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{formData.image}</p>
                </div>
              </div>
            )}
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description Complète</label>
            <textarea
              rows={4}
              placeholder="Description détaillée de l'équipement..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
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
              disabled={isSubmitting || isUploading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer dans Supabase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
