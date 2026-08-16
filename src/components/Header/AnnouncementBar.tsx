import React from 'react';
import { Truck, MessageCircle, Phone, Tag } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 text-[10px] sm:text-[11px] font-semibold py-2 px-3 sm:px-6 border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand Tag & Free Delivery Notice */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold uppercase tracking-wider flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Tag className="w-3 h-3 text-amber-600" />
            <span>AKABLISHOP MAROC</span>
          </span>

          <span className="hidden sm:inline text-gray-300">•</span>

          <span className="text-slate-700 truncate flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
            <span>
              <strong className="text-slate-900 font-bold">Livraison express</strong>
              <span className="hidden sm:inline"> partout au Maroc</span> | Offerte dès <strong className="text-amber-700 font-extrabold">2 000 DH</strong>
            </span>
          </span>
        </div>

        {/* Right: Phone & WhatsApp Direct */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href="tel:+212701896033"
            className="hidden md:flex items-center gap-1.5 text-slate-700 font-bold hover:text-amber-600 transition-colors"
          >
            <Phone className="w-3 h-3 text-slate-500" />
            <span>+212 701896033</span>
          </a>

          <a
            href="https://wa.me/+212701896033?text=Bonjour AKABLISHOP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-extrabold hover:bg-emerald-100 transition-colors text-[10px]"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
            <span>WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
