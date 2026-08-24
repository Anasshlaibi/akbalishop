/**
 * Query Normalizer for AkbaliShop Intelligent Search
 */

const TYPO_MAP: Record<string, string> = {
  'sigam': 'sigma',
  'sigmma': 'sigma',
  'sonny': 'sony',
  'sonni': 'sony',
  'soney': 'sony',
  'tamorn': 'tamron',
  'tamrom': 'tamron',
  'nikkon': 'nikon',
  'nicon': 'nikon',
  'cannom': 'canon',
  'cannond': 'canon',
  'canonn': 'canon',
  'roade': 'røde',
  'rode': 'røde',
  'dij': 'dji',
  'dji': 'dji',
  'lesar': 'lexar',
  'sandik': 'sandisk',
  'sandisck': 'sandisk',
  'artisans': '7artisans',
  '7artisan': '7artisans',
  'kf': 'k&f',
  'k&f': 'k&f concept',
  'godoxx': 'godox'
};

const SYNONYM_MAP: Record<string, string> = {
  'lentille': 'objectif',
  'optique': 'objectif',
  'optiques': 'objectifs',
  'lentilles': 'objectifs',
  'boitier': 'caméra',
  'boîtier': 'caméra',
  'hybride': 'caméra',
  'microphone': 'micro',
  'enregistreurs': 'audio',
  'lumiere': 'éclairage',
  'lumieres': 'éclairage',
  'projecteur': 'éclairage',
  'gimbal': 'stabilisateur',
  'trepied': 'trépied'
};

export function normalizeQuery(query: string): string {
  if (!query) return '';
  let q = query.toLowerCase().trim();

  // 1. Normalize numbers and focal lengths (e.g., 70 200, 70200, 70 200 mm, 70-200mm -> 70-200mm)
  q = q.replace(/\b(70)[-\s]?(200)\b/gi, '70-200mm');
  q = q.replace(/\b70200\b/gi, '70-200mm');
  q = q.replace(/\b(24)[-\s]?(70)\b/gi, '24-70mm');
  q = q.replace(/\b2470\b/gi, '24-70mm');
  q = q.replace(/\b(16)[-\s]?(35)\b/gi, '16-35mm');
  q = q.replace(/\b1635\b/gi, '16-35mm');
  q = q.replace(/\b(15)[-\s]?(35)\b/gi, '15-35mm');
  q = q.replace(/\b(100)[-\s]?(400)\b/gi, '100-400mm');

  // 2. Normalize single focal length metrics (e.g., 85 mm -> 85mm, 50 millimeter -> 50mm)
  q = q.replace(/\b(\d{2,3})\s*(millimeter|millimeters|millim[èe]tre|mm)\b/gi, '$1mm');

  // 3. Normalize apertures (e.g., f2.8, f/2.8, f 2.8, 2.8 -> f/2.8)
  q = q.replace(/\b[f]\/?\s*([0-9]\.[0-9])\b/gi, 'f/$1');
  q = q.replace(/\b([f])\s*([0-9]\.[0-9])\b/gi, 'f/$2');

  // 4. Tokenize and replace typos & synonyms
  const tokens = q.split(/\s+/).map(t => {
    const cleanToken = t.replace(/[^a-z0-9\/-]/gi, '');
    if (TYPO_MAP[cleanToken]) return TYPO_MAP[cleanToken];
    if (SYNONYM_MAP[cleanToken]) return SYNONYM_MAP[cleanToken];
    return t;
  });

  return tokens.join(' ');
}
