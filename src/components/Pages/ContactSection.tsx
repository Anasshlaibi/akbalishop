import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check, FileText } from 'lucide-react';

type FormTab = 'contact' | 'devis';

export const ContactSection: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormTab>('contact');
  const [submitted, setSubmitted] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [devisForm, setDevisForm] = useState({
    name: '', phone: '', email: '',
    equipment: '', dates: '', budget: '', project: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Bonjour AKABLISHOP 👋\n\n` +
      `Nom: ${contactForm.name}\n` +
      `Téléphone: ${contactForm.phone}\n` +
      `Email: ${contactForm.email}\n\n` +
      `Message:\n${contactForm.message}`
    );
    window.open(`https://wa.me/212695252921?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const handleDevisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `🎬 DEMANDE DE DEVIS — AKABLISHOP\n\n` +
      `Nom: ${devisForm.name}\n` +
      `Téléphone: ${devisForm.phone}\n` +
      `Email: ${devisForm.email}\n\n` +
      `Matériel souhaité: ${devisForm.equipment}\n` +
      `Dates: ${devisForm.dates}\n` +
      `Budget estimé: ${devisForm.budget}\n\n` +
      `Description du projet:\n${devisForm.project}`
    );
    window.open(`https://wa.me/212695252921?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">AKABLISHOP Marrakech</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">Contactez Notre Équipe Expert</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Une question technique ? Besoin d'un devis pour une location ou un achat ? Notre équipe vous répond immédiatement sur WhatsApp.
          </p>
        </div>

        {/* Form Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
            <button
              onClick={() => { setActiveForm('contact'); setSubmitted(false); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeForm === 'contact'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Nous Contacter</span>
            </button>
            <button
              onClick={() => { setActiveForm('devis'); setSubmitted(false); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeForm === 'devis'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Demande de Devis</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Info + Map */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 space-y-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display">Coordonnées du Showroom</h3>

              <div className="space-y-3 text-xs">
                <a
                  href="tel:+212695252921"
                  className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 hover:border-amber-400 transition-all text-slate-700"
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5"><Phone className="w-4 h-4" /></div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Téléphone / WhatsApp</span>
                    <span className="text-sm font-extrabold text-slate-900">+212 695 252 921</span>
                  </div>
                </a>

                <a
                  href="mailto:akablishop@gmail.com"
                  className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 hover:border-amber-400 transition-all text-slate-700"
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5"><Mail className="w-4 h-4" /></div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Email Officiel</span>
                    <span className="text-sm font-semibold text-slate-900">akablishop@gmail.com</span>
                  </div>
                </a>

                <a
                  href="https://maps.app.goo.gl/91F4FCEdXLrTiGmg7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 hover:border-amber-400 transition-all text-slate-700"
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5"><MapPin className="w-4 h-4" /></div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Adresse Showroom</span>
                    <span className="text-xs font-semibold text-slate-900">1 Etage N°2, Résidence Alwifaq 126 Lotissement Al Massar, Marrakech, Maroc</span>
                    <span className="block text-[10px] text-amber-600 font-bold mt-0.5">📍 Voir sur Google Maps →</span>
                  </div>
                </a>

                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-slate-50 border border-gray-200 text-slate-700">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5"><Clock className="w-4 h-4" /></div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Horaires d'ouverture</span>
                    <span className="text-xs font-semibold text-slate-900">Lundi – Samedi : 09h00 à 19h30</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Dimanche : Sur rendez-vous</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/212695252921"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter directement sur WhatsApp</span>
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                title="AKABLISHOP Showroom Marrakech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.9461186523595!2d-7.981100000000001!3d31.629400000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8b5f24c7d1%3A0x0!2sAKABLISHOP!5e0!3m2!1sfr!2sma!4v1723376000000!5m2!1sfr!2sma"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Forms */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Envoyé sur WhatsApp !</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    WhatsApp s'est ouvert avec votre message pré-rempli. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 border border-gray-200 text-xs font-semibold text-slate-900 hover:border-amber-400"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : activeForm === 'contact' ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">Envoyez-nous un Message</h3>
                  <p className="text-[11px] text-slate-500">Votre message sera envoyé directement sur WhatsApp pour une réponse instantanée.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Nom et Prénom *</label>
                      <input type="text" required placeholder="Votre nom"
                        value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone *</label>
                      <input type="tel" required placeholder="+212 6XX XXX XXX"
                        value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input type="email" placeholder="nom@exemple.com"
                      value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Votre Message *</label>
                    <textarea rows={5} required placeholder="Décrivez votre projet, le matériel recherché ou votre demande..."
                      value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Envoyer via WhatsApp</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleDevisSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">Demande de Devis</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Remplissez ce formulaire pour recevoir une offre personnalisée. Nous vous répondons sous 1h sur WhatsApp.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Nom et Prénom *</label>
                      <input type="text" required placeholder="Votre nom"
                        value={devisForm.name} onChange={e => setDevisForm({ ...devisForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone *</label>
                      <input type="tel" required placeholder="+212 6XX XXX XXX"
                        value={devisForm.phone} onChange={e => setDevisForm({ ...devisForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input type="email" placeholder="nom@exemple.com"
                      value={devisForm.email} onChange={e => setDevisForm({ ...devisForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Matériel souhaité *</label>
                    <input type="text" required placeholder="Ex: Sony FX3, Godox SL60W, DJI RS3 Pro..."
                      value={devisForm.equipment} onChange={e => setDevisForm({ ...devisForm, equipment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Dates de location / livraison</label>
                      <input type="text" placeholder="Ex: 15 au 18 août 2026"
                        value={devisForm.dates} onChange={e => setDevisForm({ ...devisForm, dates: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Budget estimé (DH)</label>
                      <input type="text" placeholder="Ex: 5 000 DH"
                        value={devisForm.budget} onChange={e => setDevisForm({ ...devisForm, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Description du projet *</label>
                    <textarea rows={4} required placeholder="Décrivez votre projet : type de tournage, lieu, durée, équipe..."
                      value={devisForm.project} onChange={e => setDevisForm({ ...devisForm, project: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer la Demande de Devis via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
