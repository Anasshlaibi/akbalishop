import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Sparkles, ShieldCheck, Truck, ArrowRight, Video, Camera, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab, resetFilters } = useShop();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg border-b border-white/5 py-12 lg:py-20">
      {/* Subtle Glow Backdrop Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-amber/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full badge-amber text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
              <span>AKABLISHOP • Équipement Audiovisuel Pro au Maroc</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15]">
              Révélez le potentiel de vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-amber-300 to-brand-gold">
                créations audiovisuelles
              </span>.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Trouvez l'introuvable, découvrez l'inédit. Magasin référence à Marrakech pour la vente et la location de caméras cinéma, hybrides, objectifs, éclairage studio et matériel audio professionnel.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => { resetFilters(); setActiveTab('shop'); }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-brand-gold text-dark-bg font-extrabold text-sm tracking-wide shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Découvrir la boutique</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => { resetFilters(); setActiveTab('shop'); }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel border border-white/15 text-white hover:border-brand-amber/60 hover:bg-white/5 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
              >
                <Video className="w-4 h-4 text-brand-amber" />
                <span>Voir les nouveautés</span>
              </button>
            </div>

            {/* Feature Highlights / Key Guarantees */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-brand-amber/10 border border-brand-amber/20 text-brand-amber">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Authentique</h4>
                  <p className="text-[10px] text-gray-400">Garanti constructeur</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-brand-amber/10 border border-brand-amber/20 text-brand-amber">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Livraison Maroc</h4>
                  <p className="text-[10px] text-gray-400">Rapide & Sécurisée</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-brand-amber/10 border border-brand-amber/20 text-brand-amber">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Support Expert</h4>
                  <p className="text-[10px] text-gray-400">Conseil personnalisé</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-gold/30 via-brand-amber/40 to-transparent blur-lg opacity-70" />

              <div className="relative rounded-3xl glass-panel p-4 border border-white/15 overflow-hidden shadow-2xl">
                
                {/* Hero Main Camera Image */}
                <div className="relative aspect-[4/3] rounded-2xl bg-dark-bg overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src="/wp-content/uploads/AkabliShop-Head.webp" 
                    alt="AKABLISHOP Audiovisual Equipment" 
                    className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 bg-dark-bg/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-brand-amber flex items-center space-x-1">
                    <Camera className="w-3 h-3" />
                    <span>Sony • Nikon • Canon • DJI</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-dark-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400">Caméra Cinéma Vedette</span>
                    <span className="text-xs font-bold text-white">Sony FX6 / FX3 Cinema Line</span>
                  </div>
                </div>

                {/* Floating Product Highlight Banner */}
                <div className="mt-4 p-3.5 rounded-xl bg-dark-surface/80 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/wp-content/uploads/SONY-FX6-jpg-300x300.webp" 
                      alt="Sony FX6" 
                      className="w-12 h-12 rounded-lg object-cover bg-dark-bg p-1 border border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">Sony FX6 – Caméra Cinéma</h4>
                      <p className="text-[11px] text-brand-amber font-semibold">73.000 DH <span className="text-gray-500 line-through text-[10px] ml-1">76.500 DH</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => { resetFilters(); setActiveTab('shop'); }}
                    className="px-3 py-1.5 rounded-lg bg-brand-amber/20 hover:bg-brand-amber text-brand-amber hover:text-dark-bg text-xs font-bold transition-all"
                  >
                    Voir
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
