import React from 'react';
import { Truck, MessageCircle, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white text-[10px] sm:text-[11px] font-medium py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Mobile: single scrolling message | Desktop: full bar */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider flex-shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AKABLISHOP Maroc</span>
            <span className="sm:hidden">AKABLI</span>
          </span>

          <span className="hidden sm:inline text-slate-600">•</span>

          <span className="text-slate-200 truncate flex items-center gap-1">
            <Truck className="w-3 h-3 flex-shrink-0 text-white" />
            <span><strong className="text-white">Livraison express</strong><span className="hidden sm:inline"> partout au Maroc</span> | Offerte dès <strong>2 000 DH</strong></span>
          </span>
        </div>

        {/* Right: WhatsApp always visible, phone on md+ */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:+212695252921"
            className="hidden md:flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <span>+212 695252921</span>
          </a>

          <a
            href="https://wa.me/+212695252921?text=Bonjour AKABLISHOP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden text-[10px]">WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
