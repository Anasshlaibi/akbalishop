import React from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-dark-bg border-b border-white/5 text-xs text-dark-muted py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-6">
          <a 
            href="tel:+212695252921" 
            className="flex items-center space-x-1.5 hover:text-brand-amber transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-amber" />
            <span>+212 695252921</span>
          </a>
          <a 
            href="mailto:akablishop@gmail.com" 
            className="hidden sm:flex items-center space-x-1.5 hover:text-brand-amber transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-brand-amber" />
            <span>akablishop@gmail.com</span>
          </a>
          <span className="hidden lg:flex items-center space-x-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-brand-amber" />
            <span>Al Massar, Marrakech - Maroc</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Livraison partout au Maroc</span>
          <span className="text-gray-600">|</span>
          <a 
            href="https://wa.me/+212695252921" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>
          <a 
            href="https://www.instagram.com/akablishop/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-400 transition-colors"
            title="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
