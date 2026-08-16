import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../../data/categories';
import { uploadProductImage } from '../../services/storageService';
import { X, Save, Image as ImageIcon, Upload, Link as LinkIcon, RefreshCw, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface CategoryEditorModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCategory: Category) => void;
}

export const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Category | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    originalKb: number;
    compressedKb: number;
    seoFilename: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category && isOpen) {
      setFormData({ ...category });
      setErrorMessage(null);
      setUploadNotice(null);
      setUploadStats(null);
    }
  }, [category, isOpen]);

  if (!isOpen || !formData) return null;

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    setUploadNotice(null);

    try {
      const res = await uploadProductImage(file, formData.name || 'category');
      if (res.success && res.url) {
        setFormData(prev => prev ? ({ ...prev, image: res.url }) : null);
        setUploadStats({
          originalKb: res.originalSizeKb,
          compressedKb: res.compressedSizeKb,
          seoFilename: res.seoFilename
        });
        if (res.error) setUploadNotice(res.error);
      } else {
        setErrorMessage(res.error || 'Erreur lors du chargement de l\'image de catégorie');
      }
    } catch (err: any) {
      console.error('Category image upload error:', err);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;
    onSave(formData);
    onClose();
  };

  const savingsPercent = uploadStats
    ? Math.round(((uploadStats.originalKb - uploadStats.compressedKb) / uploadStats.originalKb) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center font-sans">
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl z-50 text-slate-900 overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold">
              Changer l'image de la catégorie: {category?.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de la Catégorie *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-medium"
            />
          </div>

          {/* IMAGE UPLOADER & PREVIEW */}
          <div className="border border-amber-200/80 bg-amber-50/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                Picture / Image de la Catégorie
              </span>

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
                  <span>URL</span>
                </button>
              </div>
            </div>

            {imageInputMode === 'file' ? (
              <div className="space-y-3">
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
                      <p className="text-xs font-bold text-slate-700">Conversion WebP en cours...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Cliquez ou glissez une nouvelle image pour la catégorie
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Optimisation WebP automatique + Sauvegarde sur le CDN
                      </p>
                    </div>
                  )}
                </div>

                {uploadStats && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">Optimisé : <b>{uploadStats.seoFilename}</b></span>
                    </div>
                    {savingsPercent > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md font-bold text-[10px] flex items-center space-x-1 flex-shrink-0">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>-{savingsPercent}%</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="https://.../category-image.webp"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            {/* Preview Box */}
            <div className="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-gray-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/wp-content/uploads/electronics-store-55.png';
                  }}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aperçu dans le carrousel</span>
                <p className="text-xs font-bold text-slate-900 truncate">{formData.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{formData.image}</p>
              </div>
            </div>
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
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer la Catégorie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};