import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { Phone, Mail, MapPin, Instagram, MessageCircle, ShieldCheck, Truck, CreditCard, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setConditionFilter, setIsAdminOpen, resetFilters } = useShop();

  const handleNavClick = (categorySlug?: string, condition?: 'occasion' | 'location') => {
    resetFilters();
    setActiveTab('shop');
    if (categorySlug) setSelectedCategory(categorySlug);
    if (condition) setConditionFilter(condition);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      
      {/* Top Banner Guarantees */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Livraison Partout au Maroc</h4>
              <p className="text-[11px] text-slate-400">Casablanca, Rabat, Marrakech, Agadir, Tanger...</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Produits 100% Certifiés</h4>
              <p className="text-[11px] text-slate-400">Sony, Nikon, Canon, Røde, Godox, DJI d'origine</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Paiement Sécurisé</h4>
              <p className="text-[11px] text-slate-400">Paiement à la livraison ou virement bancaire</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1">
                  <img src="/logo.png" alt="AKABLISHOP" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="font-display font-extrabold text-xl text-white">AKABLI<span className="text-amber-500">SHOP</span></span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Révélez le potentiel de vos créations audiovisuelles. Vente et location de matériel vidéo, photo, éclairage studio et microphones professionnels à Marrakech.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://wa.me/+212701896033"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition-all"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/akablishopmarrakech/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-pink-400 border border-slate-700 hover:border-pink-500/40 transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/30 transition-all flex items-center space-x-1 font-bold text-xs"
                title="Panneau de Gestion CMS"
              >
                <Database className="w-4 h-4" />
                <span>Admin CMS</span>
              </button>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">Matériel & Équipement</h4>
            <ul className="space-y-2 text-slate-400">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleNavClick(cat.slug)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services & Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => { resetFilters(); setActiveTab('home'); }} className="hover:text-amber-400 transition-colors">Accueil</button>
              </li>
              <li>
                <button onClick={() => { resetFilters(); setActiveTab('shop'); }} className="hover:text-amber-400 transition-colors">Toute la Boutique</button>
              </li>
              <li>
                <button onClick={() => handleNavClick(undefined, 'occasion')} className="hover:text-amber-400 transition-colors">Occasions Certifiées</button>
              </li>
              <li>
                <button onClick={() => handleNavClick(undefined, 'location')} className="hover:text-emerald-400 transition-colors">Location Matériel</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors">Contact & Showroom</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Showroom */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">Showroom Marrakech</h4>
            
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>1 Etage N°2, Résidence Alwifaq 126 Lotissement Al Massar, Marrakech, Maroc</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="tel:+212701896033" className="hover:text-white font-bold text-white">+212 701896033</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="mailto:akablishop@gmail.com" className="hover:text-white">akablishop@gmail.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800 py-6 bg-slate-950/80 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>akablishop.ma – {new Date().getFullYear()} – Tous droits réservés</span>
          <span>Matériel Audiovisuel Professionnel au Maroc</span>
        </div>
      </div>

    </footer>
  );
};
