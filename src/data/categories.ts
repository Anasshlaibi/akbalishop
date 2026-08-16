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
    id: 'cameras',
    name: 'Caméras & Boîtiers',
    slug: 'cameras',
    description: 'Capturez chaque instant, chaque détail avec notre gamme de boîtiers hybrides et caméras cinéma.',
    itemCount: 18,
    image: '/wp-content/uploads/AkabliShop-Head.webp',
    iconName: 'Camera'
  },
  {
    id: 'lenses',
    name: 'Objectifs',
    slug: 'objectifs',
    description: 'La perfection de l\'image et l\'excellence optique pour Sony, Nikon, Canon et Leica.',
    itemCount: 24,
    image: '/wp-content/uploads/AkabliShop-Lens.webp',
    iconName: 'Aperture'
  },
  {
    id: 'lighting',
    name: 'Éclairage & Studio',
    slug: 'eclairage',
    description: 'Illuminez votre créativité avec nos panneaux LED, flashs studio et projecteurs Godox.',
    itemCount: 16,
    image: '/wp-content/uploads/electronics-store-85-300x266.png',
    iconName: 'Sun'
  },
  {
    id: 'audio',
    name: 'Audio & Microphones',
    slug: 'audio',
    description: 'Le son qui fait vibrer vos sens : micros HF, enregistreurs et microphones canon Røde.',
    itemCount: 14,
    image: '/wp-content/uploads/electronics-store-86-300x266.png',
    iconName: 'Mic'
  },
  {
    id: 'stabilizers',
    name: 'Stabilisateurs & Gimbals',
    slug: 'stabilisateurs',
    description: 'La stabilité à votre service : gimbals 3 axes DJI Ronin pour caméras et smartphones.',
    itemCount: 10,
    image: '/wp-content/uploads/electronics-store-87.png',
    iconName: 'Video'
  },
  {
    id: 'occasions',
    name: 'Occasions / Seconde Main',
    slug: 'occasions',
    description: 'Seconde vie, premières émotions : matériel audiovisuel contrôlé et garanti au meilleur prix.',
    itemCount: 12,
    image: '/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png',
    iconName: 'RefreshCw'
  },
  {
    id: 'rental',
    name: 'Location de Matériel',
    slug: 'location',
    description: 'Louez votre équipement professionnel pour vos tournage à Marrakech et partout au Maroc.',
    itemCount: 15,
    image: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
    iconName: 'Calendar'
  },
  {
    id: 'accessories',
    name: 'Accessoires & Produits Divers',
    slug: 'accessoires',
    description: 'Trouvez l\'introuvable : cartes mémoire, batteries, filtres ND, sacs de transport et trépieds.',
    itemCount: 30,
    image: '/wp-content/uploads/electronics-store-55.png',
    iconName: 'Sliders'
  }
];

const STORAGE_KEY = 'akabli_custom_categories_v1';

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
