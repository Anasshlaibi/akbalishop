import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">AKABLISHOP Marrakech</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">Contactez Notre Équipe Expert</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Une question technique sur une caméra ? Besoin d'un devis pour une location de matériel au Maroc ? Notre équipe vous répond immédiatement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display">Coordonnées du Showroom</h3>

              <div className="space-y-4 text-xs">
                <a 
                  href="tel:+212695252921"
                  className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 hover:border-amber-400 transition-all text-slate-700 hover:text-slate-900"
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Téléphone / WhatsApp</span>
                    <span className="text-sm font-extrabold text-slate-900">+212 695252921</span>
                  </div>
                </a>

                <a 
                  href="mailto:akablishop@gmail.com"
                  className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 hover:border-amber-400 transition-all text-slate-700 hover:text-slate-900"
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Email Officiel</span>
                    <span className="text-sm font-semibold text-slate-900">akablishop@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 text-slate-700">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Adresse Showroom</span>
                    <span className="text-xs font-semibold text-slate-900">
                      1 Etage N°2, Résidence Alwifaq 126 Lotissement Al Massar, Marrakech, Maroc
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 text-slate-700">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Horaires d'ouverture</span>
                    <span className="text-xs font-semibold text-slate-900">Lundi - Samedi : 09h00 à 19h30</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <a
                href="https://wa.me/+212695252921"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter directement sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">Envoyez-nous un Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Nom et Prénom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Votre numéro"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Votre Message *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Décrivez votre projet, le matériel recherché ou votre demande de location..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-wide shadow-md hover:brightness-110 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer le Message</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Envoyé !</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    Merci {form.name}. Notre équipe vous recontactera dans les plus brefs délais par téléphone ou email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 border border-gray-200 text-xs font-semibold text-slate-900 hover:border-amber-400"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
