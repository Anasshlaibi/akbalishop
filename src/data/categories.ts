export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
  iconName: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cameras",
    name: "Caméras & Boîtiers",
    slug: "cameras",
    description: "Capturez chaque instant, chaque détail avec notre gamme de boîtiers hybrides et caméras cinéma.",
    itemCount: 0,
    image: "/wp-content/uploads/categories/cameras.jpg",
    iconName: "Camera"
  },
  {
    id: "objectifs",
    name: "Objectifs",
    slug: "objectifs",
    description: "La perfection de l'image et l'excellence optique pour Sony, Nikon, Canon et Leica.",
    itemCount: 0,
    image: "/wp-content/uploads/categories/objectifs.jpg",
    iconName: "Aperture"
  },
  {
    id: "eclairage",
    name: "Éclairage & Studio",
    slug: "eclairage",
    description: "Illuminez votre créativité avec nos panneaux LED, flashs studio et projecteurs Godox.",
    itemCount: 0,
    image: "/wp-content/uploads/categories/eclairage.jpg",
    iconName: "Sun"
  },
  {
    id: "stabilisateurs",
    name: "Stabilisateurs & Gimbals",
    slug: "stabilisateurs",
    description: "La stabilité à votre service : gimbals 3 axes DJI Ronin pour caméras et smartphones.",
    itemCount: 0,
    image: "/wp-content/uploads/categories/stabilisateurs.webp",
    iconName: "Video"
  },
  {
    id: "occasions",
    name: "Occasions / Seconde Main",
    slug: "occasions",
    description: "Seconde vie, premières émotions : matériel audiovisuel contrôlé et garanti au meilleur prix.",
    itemCount: 0,
    image: "/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png",
    iconName: "RefreshCw"
  },
  {
    id: "location",
    name: "Location de Matériel",
    slug: "location",
    description: "Louez votre équipement professionnel pour vos tournage à Marrakech et partout au Maroc.",
    itemCount: 0,
    image: "/wp-content/uploads/SONY-FX6-jpg-300x300.webp",
    iconName: "Calendar"
  },
  {
    id: "accessoires",
    name: "Accessoires & Produits Divers",
    slug: "accessoires",
    description: "Trouvez l'introuvable : cartes mémoire, batteries, filtres ND, sacs de transport et trépieds.",
    itemCount: 0,
    image: "/wp-content/uploads/categories/accessoires.webp",
    iconName: "Sliders"
  }
];

export function normalizeCategorySlug(rawCategory?: string | null): string {
  if (!rawCategory) return 'accessoires';
  const trimmed = rawCategory.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'cameras' || lower === 'camera' || lower === 'appareils-photo' || lower.includes('boitier') || lower.includes('boîtier') || lower.includes('caméra') || lower.includes('instax')) {
    return 'cameras';
  }
  if (lower === 'objectifs' || lower === 'objectif' || lower === 'lenses' || lower === 'lens' || lower.includes('obj')) {
    return 'objectifs';
  }
  if (lower === 'eclairage' || lower === 'lighting' || lower.includes('éclair') || lower.includes('eclair') || lower.includes('studio') || lower.includes('led') || lower.includes('flash')) {
    return 'eclairage';
  }
  if (lower === 'stabilisateurs' || lower === 'stabilizers' || lower === 'stabilizer' || lower.includes('stabilisat') || lower.includes('gimbal') || lower.includes('ronin')) {
    return 'stabilisateurs';
  }
  if (lower === 'occasions' || lower === 'occasion' || lower === 'used' || lower.includes('seconde') || lower.includes('main')) {
    return 'occasions';
  }
  if (lower === 'location' || lower === 'rental' || lower.includes('louer') || lower.includes('locat')) {
    return 'location';
  }
  if (lower === 'audio' || lower === 'son' || lower.includes('mic') || lower.includes('sound')) {
    return 'audio';
  }
  if (lower === 'accessoires' || lower === 'accessories' || lower.includes('divers') || lower.includes('carte')) {
    return 'accessoires';
  }

  const found = CATEGORIES.find(c => c.slug === lower || c.id === lower);
  if (found) return found.slug;

  return 'accessoires';
}

export function getCategoryCount(catSlug: string, products: any[]): number {
  const normTarget = normalizeCategorySlug(catSlug);
  const activeProducts = (products || []).filter(p => p && p.isActive !== false);

  if (normTarget === 'occasions') {
    return activeProducts.filter(p => normalizeCategorySlug(p.category) === 'occasions' || p.isOccasion || p.condition === 'used').length;
  }
  if (normTarget === 'location') {
    return activeProducts.filter(p => normalizeCategorySlug(p.category) === 'location' || p.isRental || p.commercialMode === 'rental' || p.commercialMode === 'both').length;
  }

  return activeProducts.filter(p => normalizeCategorySlug(p.category) === normTarget).length;
}

const STORAGE_KEY = "akabli_custom_categories_v1";

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return CATEGORIES.map(def => {
          const found = parsed.find((p: any) => p.id === def.id || p.slug === def.slug);
          return found ? { ...def, ...found } : def;
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse categories from localStorage:', err);
  }
  return CATEGORIES;
}

export function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage:', err);
  }
}
