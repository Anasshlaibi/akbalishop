import React from 'react';
import { useShop } from '../context/ShopContext';
import { Calendar, ArrowRight, Video, CheckCircle2 } from 'lucide-react';

export const RentalSection: React.FC = () => {
  const { setActiveTab, setConditionFilter, resetFilters } = useShop();

  const handleRentalClick = () => {
    resetFilters();
    setActiveTab('shop');
    setConditionFilter('location');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>Service Spécialisé Marrakech & Maroc</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900">
              Location de Matériel Audiovisuel Professionnel
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Pour vos tournages de longs-métrages, publicités, clips vidéo et événements à Marrakech et partout au Maroc. Louez nos caméras cinéma Sony FX6 / FX3, boîtiers hybrides, zooms G Master, éclairages Godox et micros Røde.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg text-xs text-slate-700 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Caméras Cinéma & Hybrides révisés</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Objectifs Cine & Zooms f/2.8</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Projecteurs LED Studio & HF Audio</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Tarifs dégressifs à la semaine</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRentalClick}
                className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center space-x-2"
              >
                <Video className="w-4 h-4" />
                <span>Découvrir le catalogue location</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white p-4 border border-gray-200 overflow-hidden shadow-md">
              <div className="aspect-[4/3] rounded-xl bg-slate-50 p-4 flex items-center justify-center relative">
                <img 
                  src="/wp-content/uploads/SONY-FX6-jpg-300x300.webp" 
                  alt="Location Matériel Audiovisuel"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-slate-900 font-bold shadow-sm">
                  Location dès <span className="text-emerald-600 font-extrabold">200 DH/jour</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
