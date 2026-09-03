export type ConditionFilter = 'all' | 'neuf' | 'occasion' | 'location';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export type ViewMode = 'grid' | 'list';

export type ProductCondition = 'new' | 'used' | 'refurbished';
export type CommercialMode = 'sale' | 'rental' | 'both';
export type ProductBadge = 'new' | 'featured' | 'promo' | 'bestseller';

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  price: number; // In DH / MAD
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isActive?: boolean;
  
  // Structured product classification
  condition?: ProductCondition;
  commercialMode?: CommercialMode;
  badges?: ProductBadge[];

  // Legacy compatibility flags
  isNew?: boolean;
  isOccasion?: boolean;
  isRental?: boolean;
  rentalPricePerDay?: number;

  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  specs: ProductSpecs;
  whatsInTheBox: string[];
  createdAt?: string;
  updatedAt?: string;
  // Advanced Product SEO Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoH1?: string;
  seoShortDescription?: string;
  seoAltText?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  seoNoindex?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  // Advanced Product SEO Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoH1?: string;
  seoShortDescription?: string;
  seoAltText?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  seoNoindex?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
  // Advanced Product SEO Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoH1?: string;
  seoShortDescription?: string;
  seoAltText?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  seoNoindex?: boolean;
}

export type SlideType = 'main' | 'secondary';

export interface HeroSlide {
  id: string;
  type: SlideType; // 'main' for left hero carousel, 'secondary' for right promotional banner
  badge: string;
  title: string;
  subtitle?: string;
  price: string;
  oldPrice?: string;
  image: string;
  ctaText?: string;
  productId?: string; // Linked product/pack ID from catalog
  stockBadge?: string; // e.g. "Stock Marrakech"
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-fx6',
    type: 'main',
    badge: 'CINEMA LINE • EN VEDETTE',
    title: 'Sony FX6 – Caméra Cinéma 4K',
    subtitle: 'Capteur plein format Exmor R 10.2 MP, 15+ stops dynamique et filtre ND variable.',
    price: '66.000 DH',
    oldPrice: '76.500 DH',
    image: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
    ctaText: 'Commander le Kit Cinéma',
    productId: 'sony-fx6-cinema',
    stockBadge: 'Stock Marrakech',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'slide-nikon-z7',
    type: 'main',
    badge: 'HYBRIDE PLEIN FORMAT',
    title: 'NIKON Z 7II Boîtier Nu 45.7 MP',
    subtitle: 'Double processeur EXPEED 6, vidéo 4K 60p et système AF haute précision.',
    price: '38.400 DH',
    oldPrice: '42.000 DH',
    image: '/wp-content/uploads/NIKON-Z7-MARK-II-jpg-300x300.webp',
    ctaText: 'Découvrir l\'Offre Nikon',
    productId: 'nikon-z7-mark-ii',
    stockBadge: 'Stock Marrakech',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'slide-a7s-iii',
    type: 'main',
    badge: 'SECONDE MAIN CERTIFIÉE',
    title: 'Sony a7S III – Boîtier Nu (Bon Occasion)',
    subtitle: 'Capteur 12.1 MP 4K 120p, révisé dans nos ateliers avec garantie 6 mois AKABLISHOP.',
    price: '31.200 DH',
    oldPrice: '35.000 DH',
    image: '/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png',
    ctaText: 'Voir l\'Occasion Certifiée',
    productId: 'sony-a7s-iii-occasion',
    stockBadge: 'Garantie 6 Mois',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'slide-lens-2470',
    type: 'secondary',
    badge: 'OBJECTIF G MASTER',
    title: 'Sony FE 24-70mm f/2.8 GM II',
    price: '21.200 DH',
    oldPrice: '26.000 DH',
    image: '/wp-content/uploads/AkabliShop-Lens.webp',
    ctaText: 'Profiter de l\'offre',
    productId: 'sony-fe-24-70mm-f28-gm-ii',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'slide-godox-sl60',
    type: 'secondary',
    badge: 'ÉCLAIRAGE STUDIO',
    title: 'Godox SL60W Projecteur LED',
    price: '1.850 DH',
    oldPrice: '2.200 DH',
    image: '/wp-content/uploads/electronics-store-85-300x266.png',
    ctaText: 'Profiter de l\'offre',
    productId: 'godox-sl60w-led-light',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'slide-rode-wireless',
    type: 'secondary',
    badge: 'SON SANS FIL 32-BIT',
    title: 'Røde Wireless PRO Kit',
    price: '5.200 DH',
    oldPrice: '5.900 DH',
    image: '/wp-content/uploads/electronics-store-86-300x266.png',
    ctaText: 'Profiter de l\'offre',
    productId: 'rode-wireless-pro',
    isActive: true,
    sortOrder: 3
  }
];

const SLIDES_STORAGE_KEY = 'akablishop_hero_slides_v1';

export function getStoredSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored hero slides:', err);
  }
  return DEFAULT_SLIDES;
}

export function saveStoredSlides(slides: HeroSlide[]): void {
  try {
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
  } catch (err) {
    console.error('Failed to save hero slides to localStorage:', err);
  }
}



