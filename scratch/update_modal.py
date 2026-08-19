import sys

path = 'src/components/Admin/ProductEditorModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import_code = '''import { generateSeoTitle, generateSeoDescription, generateSeoH1, generateSeoKeywords, generateSeoAltText, generateCanonicalUrl, generateOpenGraph } from '../../utils/seoGenerator';
import { calculateProductSeoScore } from '../../utils/seoScoreCalculator';
'''

if 'generateSeoTitle' not in text:
    text = import_code + text

target = '<div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200">'

seo_jsx = '''          {/* ── Advanced SEO & Metadata Section ── */}
          <div className="border border-amber-200 rounded-2xl bg-amber-50/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Référencement & SEO (Google & Réseaux)
                </h4>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    seoTitle: generateSeoTitle(prev),
                    seoDescription: generateSeoDescription(prev),
                    seoH1: generateSeoH1(prev),
                    seoKeywords: generateSeoKeywords(prev),
                    seoAltText: generateSeoAltText(prev),
                    canonicalUrl: generateCanonicalUrl(prev),
                    ...generateOpenGraph(prev)
                  }));
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow transition-all"
              >
                <Zap className="w-3 h-3" />
                <span>Générer Automatiquement le SEO</span>
              </button>
            </div>

            {/* Real-time SEO Score Card */}
            {(() => {
              const seoAudit = calculateProductSeoScore(formData);
              const isExcellent = seoAudit.score >= 90;
              const isGood = seoAudit.score >= 75;
              const badgeClass = isExcellent ? 'bg-emerald-500 text-white' : isGood ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white';
              const barClass = isExcellent ? 'bg-emerald-500' : isGood ? 'bg-amber-500' : 'bg-rose-500';
              return (
                <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Score de Qualité SEO :</span>
                    <span className={'px-2.5 py-0.5 rounded-full text-xs font-black ' + badgeClass}>
                      {seoAudit.score} / 100 ({seoAudit.rating})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={'h-full transition-all ' + barClass}
                      style={{ width: seoAudit.score + '%' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    {seoAudit.checks.map((check, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        {check.passed ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        )}
                        <span className={check.passed ? 'text-slate-700' : 'text-amber-800 font-semibold'}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Titre SEO (Meta Title)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sony FX3 – Caméra Cinéma Full Frame | Prix au Maroc | AKABLISHOP"
                  value={formData.seoTitle || ''}
                  onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Méta-description (SERP Snippet)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Achetez Sony FX3 au meilleur prix au Maroc (40000 DH)..."
                  value={formData.seoDescription || ''}
                  onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Titre H1 Produit</label>
                  <input
                    type="text"
                    placeholder="Ex: Sony FX3 Caméra Cinéma"
                    value={formData.seoH1 || ''}
                    onChange={e => setFormData({ ...formData, seoH1: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Texte Alternatif Image (Alt)</label>
                  <input
                    type="text"
                    placeholder="Ex: Sony FX3 caméra cinéma full frame Maroc"
                    value={formData.seoAltText || ''}
                    onChange={e => setFormData({ ...formData, seoAltText: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mots-clés SEO (Keywords)</label>
                <input
                  type="text"
                  placeholder="Sony FX3, caméra cinéma Maroc, FX3 prix Marrakech"
                  value={formData.seoKeywords || ''}
                  onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="seoNoindex"
                  checked={Boolean(formData.seoNoindex)}
                  onChange={e => setFormData({ ...formData, seoNoindex: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="seoNoindex" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Masquer du référencement (robots noindex)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200">'''

if target in text:
    text = text.replace(target, seo_jsx)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('ProductEditorModal.tsx updated successfully!')
else:
    print('Target string not found')
