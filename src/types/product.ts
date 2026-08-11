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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}
