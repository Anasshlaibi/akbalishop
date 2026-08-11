import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, MapPin, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { setActiveTab } = useShop();

  return (
    <section className="py-16 bg-slate-50 border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-white border border-gray-200 p-8 sm:p-12 relative overflow-hidden shadow-sm">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full badge-amber text-xs font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>À propos d'AKABLISHOP</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900">
                Révélez le potentiel de vos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">
                  créations audiovisuelles
                </span>.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Trouvez l'introuvable, découvrez l'inédit. Basé à Marrakech, **AKABLISHOP** est le partenaire incontournable des vidéastes, photographes, réalisateurs et créateurs de contenu au Maroc. Nous sélectionnons les meilleurs équipements vidéo, optiques cinéma, éclairages studio et systèmes audio professionnels.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Showroom Marrakech (Al Massar)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Produits 100% Authentiques</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>SAV & Support Technique Expert</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 text-left lg:text-right">
              <button
                onClick={() => setActiveTab('contact')}
                className="px-6 py-3.5 rounded-xl bg-slate-100 border border-gray-300 text-slate-900 hover:border-amber-500 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center space-x-2"
              >
                <span>Visiter notre showroom</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
