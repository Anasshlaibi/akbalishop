export type ConditionFilter = 'all' | 'neuf' | 'occasion' | 'location';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export type ViewMode = 'grid' | 'list';

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
