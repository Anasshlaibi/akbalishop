export interface ExtractedCameraSpecs {
  brand?: string;
  focalLengthMin?: number;
  focalLengthMax?: number;
  isZoom?: boolean;
  isPrime?: boolean;
  aperture?: number;
  isTStop?: boolean;
  threadDiameter?: number;
  mount?: string;
  category?: 'cameras' | 'objectifs' | 'accessoires' | 'eclairage' | 'audio' | 'stabilisateurs' | 'location' | 'occasions';
  cameraModel?: string;
  batteryType?: string;
  resolution?: string;
  intent?: 'portrait' | 'wide' | 'lowlight' | 'cinema' | 'vlog' | 'interview' | 'travel';
}

const BRANDS = [
  'sony', 'canon', 'nikon', 'dji', 'godox', 'røde', 'rode',
  'ulanzi', '7artisans', 'lexar', 'sandisk', 'k&f', 'k&f concept',
  'gopro', 'insta360', 'nicefoto', 'fujifilm', 'mahlole', 'akablishop'
];

const MOUNTS = [
  { keywords: ['sony e', 'e-mount', 'emount', 'sony-e'], name: 'Sony E' },
  { keywords: ['canon rf', 'rf-mount', 'rfmount', 'canon-rf'], name: 'Canon RF' },
  { keywords: ['canon ef', 'ef-mount', 'efmount', 'canon-ef'], name: 'Canon EF' },
  { keywords: ['nikon z', 'z-mount', 'zmount', 'nikon-z'], name: 'Nikon Z' },
  { keywords: ['arri pl', 'pl-mount', 'pl mount'], name: 'ARRI PL' },
  { keywords: ['leica l', 'l-mount', 'lmount'], name: 'Leica L' }
];

const CAMERA_MODELS = [
  { keywords: ['fx6', 'sony fx6'], name: 'Sony FX6' },
  { keywords: ['fx3', 'sony fx3'], name: 'Sony FX3' },
  { keywords: ['fx30', 'sony fx30'], name: 'Sony FX30' },
  { keywords: ['a7s iii', 'a7s3', 'a7siii', 'a7s mark 3'], name: 'Sony a7S III' },
  { keywords: ['a7 iv', 'a7m4', 'a7iv', 'a7 4'], name: 'Sony a7 IV' },
  { keywords: ['z 7ii', 'z7 ii', 'z72', 'z7mark2'], name: 'Nikon Z 7II' },
  { keywords: ['z8', 'nikon z8'], name: 'Nikon Z8' },
  { keywords: ['z9', 'nikon z9'], name: 'Nikon Z9' },
  { keywords: ['r5', 'canon r5'], name: 'Canon EOS R5' },
  { keywords: ['r6', 'canon r6'], name: 'Canon EOS R6' },
  { keywords: ['x4', 'insta360 x4'], name: 'Insta360 X4' },
  { keywords: ['mini 12', 'instax mini 12'], name: 'Instax Mini 12' }
];

const BATTERY_TYPES = [
  { keywords: ['np-fz100', 'fz100', 'fz 100'], name: 'NP-FZ100' },
  { keywords: ['lp-e6', 'lp-e6n', 'lpe6'], name: 'LP-E6N' },
  { keywords: ['np-f770', 'np-f970', 'np-f550', 'npf770'], name: 'NP-F770' },
  { keywords: ['bp-u35', 'bpu35'], name: 'BP-U35' }
];

const INTENTS = [
  { keywords: ["portrait", "portraits", "visage", "flou d'arriere plan", "bokeh"], intent: 'portrait' as const },
  { keywords: ["grand angle", "paysage", "architecture", "immo", "immobilier", "wide"], intent: 'wide' as const },
  { keywords: ["faible lumiere", "basse lumiere", "nuit", "sombre", "nocturne", "low light"], intent: 'lowlight' as const },
  { keywords: ["cinema", "film", "tournage", "long metrage", "court metrage", "filmmaking"], intent: 'cinema' as const },
  { keywords: ["vlog", "vlogging", "voyage", "travel", "poche", "compact"], intent: 'vlog' as const },
  { keywords: ["interview", "podcast", "youtube", "studio", "face camera"], intent: 'interview' as const }
];

/**
 * Extract structured domain camera specs from a search query or title
 */
export function parseCameraSpecs(text: string): ExtractedCameraSpecs {
  const lower = text.toLowerCase().trim();
  const specs: ExtractedCameraSpecs = {};

  // 1. Detect Brand
  for (const b of BRANDS) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(lower)) {
      if (b === 'rode') specs.brand = 'Røde';
      else if (b === 'k&f' || b === 'k&f concept') specs.brand = 'K&F Concept';
      else specs.brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  // 2. Detect Mount
  for (const m of MOUNTS) {
    if (m.keywords.some(k => lower.includes(k))) {
      specs.mount = m.name;
      break;
    }
  }

  // 3. Detect Camera Models
  for (const cm of CAMERA_MODELS) {
    if (cm.keywords.some(k => lower.includes(k))) {
      specs.cameraModel = cm.name;
      specs.category = 'cameras';
      break;
    }
  }

  // 4. Detect Battery Types
  for (const bt of BATTERY_TYPES) {
    if (bt.keywords.some(k => lower.includes(k))) {
      specs.batteryType = bt.name;
      specs.category = 'accessoires';
      break;
    }
  }

  // 5. Detect Focal Length Ranges or Fixed Focal Lengths
  // e.g. 70-200, 70 200, 24-70, 24 70, 16-35
  const rangeMatch = lower.match(/\b(\d{2,3})[\s/-]{1,3}(\d{2,3})\s*(mm|millim[èe]tre)?\b/i);
  if (rangeMatch) {
    const f1 = parseInt(rangeMatch[1], 10);
    const f2 = parseInt(rangeMatch[2], 10);
    if (f1 >= 10 && f2 <= 800 && f1 < f2) {
      specs.focalLengthMin = f1;
      specs.focalLengthMax = f2;
      specs.isZoom = true;
      specs.category = 'objectifs';
    }
  }

  // Single focal length e.g. 50mm, 85mm, 35mm, 24mm, 135mm, 50 mm, 85
  if (!specs.focalLengthMin) {
    const singleMatch = lower.match(/\b(14|16|18|20|24|28|35|40|50|55|85|100|105|135|200|300|400|500|600)\s*(mm|millim[èe]tre|mm\b)?\b/i);
    if (singleMatch) {
      const val = parseInt(singleMatch[1], 10);
      specs.focalLengthMin = val;
      specs.focalLengthMax = val;
      specs.isPrime = true;
      specs.category = 'objectifs';
    }
  }

  // 6. Detect Aperture (f/1.4, f1.4, f/1.8, 1.8, f/2.8, 2.8, t2.0, t/2.0)
  const apertureMatch = lower.match(/\b[ft]\/?\s*([0-9]\.[0-9]|[0-9])\b/i) || 
                        lower.match(/\b(1\.2|1\.4|1\.8|2\.0|2\.5|2\.8|4\.0|4)\b/);
  if (apertureMatch) {
    const apVal = parseFloat(apertureMatch[1]);
    if (apVal >= 0.95 && apVal <= 22) {
      specs.aperture = apVal;
      if (lower.includes('t') && !lower.includes('f/')) {
        specs.isTStop = true;
      }
      if (!specs.category) specs.category = 'objectifs';
    }
  }

  // 7. Detect Filter Diameter (55mm, 62mm, 67mm, 77mm, 82mm)
  const filterMatch = lower.match(/\b(52|55|58|62|67|72|77|82|95)\s*(mm|\b)/i);
  if (filterMatch && (lower.includes('filtre') || lower.includes('filter') || lower.includes('vnd') || lower.includes('nd') || lower.includes('mist') || lower.includes('diametre'))) {
    specs.threadDiameter = parseInt(filterMatch[1], 10);
    specs.category = 'accessoires';
  }

  // 8. Detect Intents
  for (const it of INTENTS) {
    if (it.keywords.some(k => lower.includes(k))) {
      specs.intent = it.intent;
      break;
    }
  }

  // 9. Detect Category keywords
  if (!specs.category) {
    if (/objectif|objectifs|focale|lentille|optique/i.test(lower)) specs.category = 'objectifs';
    else if (/cam[eé]ra|cam[eé]ras|boitier|appareil photo|hybride/i.test(lower)) specs.category = 'cameras';
    else if (/eclairage|[eé]clairage|lumiere|lumière|led|softbox|spot|projecteur|torche/i.test(lower)) specs.category = 'eclairage';
    else if (/micro|microphone|audio|son|enregistreur/i.test(lower)) specs.category = 'audio';
    else if (/stabilisateur|gimbal|tr[eé]pied|stand/i.test(lower)) specs.category = 'stabilisateurs';
    else if (/accessoire|accessoires|carte|batterie|filtre|sac|chargeur|cable|bague/i.test(lower)) specs.category = 'accessoires';
    else if (/location|louer/i.test(lower)) specs.category = 'location';
    else if (/occasion|occasions|seconde main/i.test(lower)) specs.category = 'occasions';
  }

  return specs;
}
