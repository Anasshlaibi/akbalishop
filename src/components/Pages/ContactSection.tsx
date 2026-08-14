import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check, FileText, Download, Loader2, Navigation } from 'lucide-react';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const ORDERS_WA  = '212701896033';
const CONTACT_WA = '212701896033';
const SHEET_WEBHOOK_URL = ''; // paste your Google Apps Script URL here
// ─────────────────────────────────────────────────────────────────────────────

type FormTab = 'contact' | 'devis';

interface DevisData {
  name: string; phone: string; email: string;
  equipment: string; dates: string; budget: string; project: string;
}

function generateDevisRef() {
  return `AKB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function generatePDF(data: DevisData, ref: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.text('AKABLISHOP', 14, 18);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Matériel Audiovisuel Professionnel — Marrakech, Maroc', 14, 26);
  doc.text('+212 701 986 033  |  akablishop@gmail.com  |  akablishop.ma', 14, 32);
  doc.setFillColor(251, 191, 36);
  doc.roundedRect(140, 8, 60, 22, 4, 4, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('DEMANDE DE DEVIS', 170, 16, { align: 'center' });
  doc.setFontSize(11); doc.text(ref, 170, 24, { align: 'center' });
  doc.setTextColor(100, 116, 139); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 50);
  doc.setTextColor(15, 23, 42); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Informations Client', 14, 62);
  autoTable(doc, {
    startY: 66, head: [],
    body: [['Nom et Prénom', data.name], ['Téléphone', data.phone], ['Email', data.email || '—']],
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55, fillColor: [248, 250, 252] }, 1: { cellWidth: 125 } },
    styles: { fontSize: 10, cellPadding: 4, lineColor: [226, 232, 240], lineWidth: 0.3 },
    theme: 'grid',
  });
  const afterClient = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
  doc.text('Détails de la Demande', 14, afterClient);
  autoTable(doc, {
    startY: afterClient + 4, head: [],
    body: [['Matériel souhaité', data.equipment], ['Dates', data.dates || '—'], ['Budget (DH)', data.budget || '—']],
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70, fillColor: [248, 250, 252] }, 1: { cellWidth: 110 } },
    styles: { fontSize: 10, cellPadding: 4, lineColor: [226, 232, 240], lineWidth: 0.3 },
    theme: 'grid',
  });
  const afterDetails = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
  doc.text('Description du Projet', 14, afterDetails);
  doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, afterDetails + 4, 182, 50, 3, 3, 'FD');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(data.project, 172), 19, afterDetails + 12);
  doc.setFillColor(15, 23, 42); doc.rect(0, 272, 210, 25, 'F');
  doc.setTextColor(148, 163, 184); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('AKABLISHOP — 1 Etage N°2, Résidence Alwifaq 126 Lotissement Al Massar, Marrakech, Maroc', 105, 281, { align: 'center' });
  doc.text('Lundi–Samedi : 09h00–19h30  |  akablishop.ma', 105, 288, { align: 'center' });
  doc.save(`Devis_AKABLISHOP_${ref}.pdf`);
}

async function sendToGoogleSheets(data: DevisData & { ref: string }) {
  if (!SHEET_WEBHOOK_URL) return;
  try {
    await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch { /* silent */ }
}

export const ContactSection: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormTab>('contact');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [devisForm, setDevisForm] = useState<DevisData>({ name: '', phone: '', email: '', equipment: '', dates: '', budget: '', project: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Bonjour AKABLISHOP 👋\n\nNom: ${contactForm.name}\nTéléphone: ${contactForm.phone}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`);
    window.open(`https://wa.me/${CONTACT_WA}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const handleDevisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ref = generateDevisRef();
    generatePDF(devisForm, ref);
    sendToGoogleSheets({ ...devisForm, ref });
    const msg = encodeURIComponent(
      `📋 *DEMANDE DE DEVIS — AKABLISHOP*\nRéf: *${ref}*\n\n👤 Nom: ${devisForm.name}\n📞 Téléphone: ${devisForm.phone}\n📧 Email: ${devisForm.email}\n\n🎬 Matériel: ${devisForm.equipment}\n📅 Dates: ${devisForm.dates || '—'}\n💰 Budget: ${devisForm.budget || '—'} DH\n\n📝 Projet:\n${devisForm.project}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${ORDERS_WA}?text=${msg}`, '_blank');
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 py-10 text-center px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">AKABLISHOP Marrakech</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mt-1 mb-2">Contactez Notre Équipe</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">Appelez, WhatsApp, email ou naviguez jusqu'au showroom — choisissez votre moyen.</p>
      </div>

      {/* ── Quick Contact Icons Row ── */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* Call */}
          <a href="tel:+212701896033"
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-500 text-amber-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appeler</span>
              <span className="block text-xs font-extrabold text-slate-800 mt-0.5">+212 701 986 033</span>
            </div>
          </a>

          {/* WhatsApp */}
          <a href={`https://wa.me/${ORDERS_WA}?text=Bonjour AKABLISHOP, je souhaite des informations.`} target="_blank" rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp</span>
              <span className="block text-xs font-extrabold text-slate-800 mt-0.5">Message Direct</span>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:akablishop@gmail.com"
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-500 text-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
              <span className="block text-xs font-extrabold text-slate-800 mt-0.5">akablishop@gmail.com</span>
            </div>
          </a>

          {/* Navigate */}
          <a href="https://maps.app.goo.gl/91F4FCEdXLrTiGmg7" target="_blank" rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-200 hover:border-rose-400 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 group-hover:bg-rose-500 text-rose-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Itinéraire</span>
              <span className="block text-xs font-extrabold text-slate-800 mt-0.5">Showroom Marrakech</span>
            </div>
          </a>

        </div>
      </div>

      {/* ── Main Content: Map Left | Form Right — SAME SECTION, NO SCROLL ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT: Map + Info strip — fully visible, no scroll needed */}
          <div className="flex flex-col gap-4">

            {/* Map — large and prominent */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                title="AKABLISHOP Showroom Marrakech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.644645410812!2d-8.114818722926973!3d31.643578641041906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafe9003898617d%3A0x8f046b20c42b2805!2sAkabli%20Shop!5e0!3m2!1sfr!2sma!4v1786457585338!5m2!1sfr!2sma"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info strip below map */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adresse</span>
                    <span className="text-xs font-semibold text-slate-800 leading-snug">1 Etage N°2, Résidence Alwifaq 126 Lotissement Al Massar, Marrakech</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Horaires</span>
                    <span className="text-xs font-semibold text-slate-800">Lun – Sam : 09h00 – 19h30</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Dimanche : Sur rendez-vous</span>
                  </div>
                </div>

              </div>

              <a href={`https://wa.me/${ORDERS_WA}`} target="_blank" rel="noopener noreferrer"
                className="mt-4 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter sur WhatsApp — Réponse immédiate</span>
              </a>
            </div>
          </div>

          {/* RIGHT: Form tabs — same height as map+info */}
          <div className="flex flex-col gap-4">

            {/* Tab switcher */}
            <div className="flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
              <button
                onClick={() => { setActiveForm('contact'); setSubmitted(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeForm === 'contact' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Nous Contacter
              </button>
              <button
                onClick={() => { setActiveForm('devis'); setSubmitted(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeForm === 'devis' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Demande de Devis
              </button>
            </div>

            {/* Form card */}
            <div className="flex-1 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeForm === 'devis' ? 'Devis Envoyé !' : 'Message Envoyé !'}
                  </h3>
                  {activeForm === 'devis' && (
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      ✅ PDF téléchargé<br />
                      ✅ Envoyé sur WhatsApp +212 701 986 033<br />
                      {SHEET_WEBHOOK_URL && '✅ Enregistré dans Google Sheets'}
                    </p>
                  )}
                  <button onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-slate-100 border border-gray-200 text-xs font-semibold hover:border-amber-400 transition-colors"
                  >
                    Nouvelle demande
                  </button>
                </div>
              ) : activeForm === 'contact' ? (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <h3 className="text-base font-bold text-slate-900 font-display">Envoyez-nous un Message</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nom *</label>
                      <input type="text" required placeholder="Votre nom"
                        value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Téléphone *</label>
                      <input type="tel" required placeholder="+212 6XX XXX XXX"
                        value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                    <input type="email" placeholder="nom@exemple.com"
                      value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Message *</label>
                    <textarea rows={5} required placeholder="Votre question ou demande..."
                      value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-slate-900 text-xs focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Envoyer via WhatsApp
                  </button>
                </form>
              ) : (
                <form onSubmit={handleDevisSubmit} className="space-y-3.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">Demande de Devis</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold">
                        <Download className="w-3 h-3" /> PDF auto-généré
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        <MessageCircle className="w-3 h-3" /> WhatsApp +212 701 986 033
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nom *</label>
                      <input type="text" required placeholder="Votre nom"
                        value={devisForm.name} onChange={e => setDevisForm({ ...devisForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Téléphone *</label>
                      <input type="tel" required placeholder="+212 6XX XXX XXX"
                        value={devisForm.phone} onChange={e => setDevisForm({ ...devisForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                    <input type="email" placeholder="nom@exemple.com"
                      value={devisForm.email} onChange={e => setDevisForm({ ...devisForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Matériel souhaité *</label>
                    <input type="text" required placeholder="Ex: Sony FX3, Godox SL60W, DJI RS3..."
                      value={devisForm.equipment} onChange={e => setDevisForm({ ...devisForm, equipment: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dates</label>
                      <input type="text" placeholder="Ex: 15–18 août"
                        value={devisForm.dates} onChange={e => setDevisForm({ ...devisForm, dates: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Budget (DH)</label>
                      <input type="text" placeholder="Ex: 5 000 DH"
                        value={devisForm.budget} onChange={e => setDevisForm({ ...devisForm, budget: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Description du projet *</label>
                    <textarea rows={3} required placeholder="Type de tournage, lieu, durée, équipe..."
                      value={devisForm.project} onChange={e => setDevisForm({ ...devisForm, project: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-slate-950 font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Génération PDF...</span></>
                      : <><Send className="w-4 h-4" /><span>Générer Devis PDF & Envoyer WhatsApp</span></>
                    }
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
