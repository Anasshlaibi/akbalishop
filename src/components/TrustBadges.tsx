import React from 'react';
import { ShieldCheck, Truck, MapPin, Camera } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="text-xs uppercase font-bold tracking-widest text-amber-700 mb-1">
            Pourquoi Choisir AKABLISHOP
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            La Référence Matériel Audiovisuel au Maroc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6 space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Équipement Pro Garanti</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Matériel neuf certifié d'origine et occasions révisées rigoureusement dans notre atelier technique.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6 space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Livraison Partout au Maroc</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Expédition rapide et sécurisée vers toutes les villes du Royaume : Casablanca, Rabat, Marrakech, Agadir, Tanger.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6 space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Service de Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Louez des caméras cinéma, objectifs et kits d'éclairage pour vos projets vidéo et shootings photo.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6 space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Showroom à Marrakech</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Venez tester le matériel sur place : Al Massar, Marrakech. Équipe passionnée à votre service.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
