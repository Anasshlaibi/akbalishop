import { normalizeCategorySlug } from '../data/categories';
import { enrichProductWithSeo } from '../utils/seoGenerator';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { SEED_PRODUCTS } from '../data/seed/seedData';

export interface MutationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const VALID_POSTGRES_CATEGORIES = [
  'accessoires',
  'appareils-photo',
  'audio',
  'cameras',
  'eclairage',
  'lenses',
  'location',
  'objectifs',
  'occasions',
  'stabilisateurs',
  'Son'
];

class ProductService {
  public normalizeBrand(brand: string): string {
    if (!brand) return 'AKABLISHOP';
    const trimmed = brand.trim();
    const lower = trimmed.toLowerCase();

    const brandMap: Record<string, string> = {
      'godox': 'Godox',
      'sony': 'Sony',
      'canon': 'Canon',
      'nikon': 'Nikon',
      'dji': 'DJI',
      'ulanzi': 'Ulanzi',
      'gopro': 'GoPro',
      'insta360': 'Insta360',
      '7artisans': '7Artisans',
      'fujifilm': 'Fujifilm',
      'hollyland': 'Hollyland',
      'lexar': 'Lexar',
      'røde': 'Røde',
      'rode': 'Røde',
      'akablishop': 'AKABLISHOP',
      'k&f': 'K&F Concept',
      'k&f concept': 'K&F Concept'
    };

    if (brandMap[lower]) {
      return brandMap[lower];
    }

    return trimmed.replace(/\b\w/g, char => char.toUpperCase());
  }

  public toValidPostgresCategory(cat: string): string {
    return normalizeCategorySlug(cat);
  }

  public mapRowToProduct(row: any): Product {
    let gallery: string[] = [];
    if (Array.isArray(row.gallery)) {
      gallery = row.gallery;
    } else if (typeof row.gallery === 'string' && row.gallery.trim()) {
      try {
        const parsed = JSON.parse(row.gallery);
        if (Array.isArray(parsed)) gallery = parsed;
      } catch {
        gallery = [row.image];
      }
    }
    if (gallery.length === 0 && row.image) {
      gallery = [row.image];
    }

    let specs: Record<string, string> = {};
    if (typeof row.specs === 'object' && row.specs !== null && !Array.isArray(row.specs)) {
      specs = row.specs;
    } else if (typeof row.specs === 'string' && row.specs.trim()) {
      try {
        const parsed = JSON.parse(row.specs);
        if (typeof parsed === 'object' && parsed !== null) specs = parsed;
      } catch {
        specs = {};
      }
    }

    let whatsInTheBox: string[] = [];
    if (Array.isArray(row.whats_in_the_box)) {
      whatsInTheBox = row.whats_in_the_box;
    } else if (typeof row.whats_in_the_box === 'string' && row.whats_in_the_box.trim()) {
      try {
        const parsed = JSON.parse(row.whats_in_the_box);
        if (Array.isArray(parsed)) whatsInTheBox = parsed;
      } catch {
        whatsInTheBox = [];
      }
    }

    // Preserve custom category name if saved in specs
    const displayCategory = normalizeCategorySlug(row.category || specs.__custom_category || 'cameras');

    const rawProduct: Product = {
      id: String(row.id),
      slug: row.slug ? String(row.slug) : String(row.id),
      name: String(row.name || ''),
      brand: String(row.brand || 'AKABLISHOP'),
      category: displayCategory,
      price: Number(row.price || 0),
      oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : undefined,
      rating: Number(row.rating || 5),
      reviewCount: Number(row.review_count || 0),
      inStock: row.in_stock !== false && row.in_stock !== 'false',
      stockCount: row.stock_count !== null && row.stock_count !== undefined ? Number(row.stock_count) : 1,
      isActive: row.is_active !== false && row.is_active !== 'false',
      isNew: Boolean(row.is_new),
      isOccasion: Boolean(row.is_occasion),
      isRental: Boolean(row.is_rental),
      rentalPricePerDay: row.rental_price_per_day !== null && row.rental_price_per_day !== undefined ? Number(row.rental_price_per_day) : undefined,
      image: String(row.image || '/wp-content/uploads/electronics-store-55.png'),
      gallery,
      shortDescription: String(row.short_description || ''),
      description: String(row.description || ''),
      specs,
      whatsInTheBox,
      createdAt: row.created_at,
      updatedAt: row.updated_at,

      // SEO database fields
      seoTitle: row.seo_title || undefined,
      seoDescription: row.seo_description || undefined,
      seoKeywords: row.seo_keywords || undefined,
      seoH1: row.seo_h1 || undefined,
      seoShortDescription: row.seo_short_description || undefined,
      seoAltText: row.seo_alt_text || undefined,
      canonicalUrl: row.canonical_url || undefined,
      ogTitle: row.og_title || undefined,
      ogDescription: row.og_description || undefined,
      ogImage: row.og_image || undefined,
      seoNoindex: Boolean(row.seo_noindex)
    };

    return enrichProductWithSeo(rawProduct);
  }

  public mapProductToRow(product: Product): any {
    const galleryVal = Array.isArray(product.gallery) && product.gallery.length > 0 
      ? JSON.stringify(product.gallery) 
      : JSON.stringify([product.image]);

    let specsObj: Record<string, string> = {};
    if (typeof product.specs === 'object' && product.specs !== null) {
      specsObj = { ...product.specs };
    }
    
    // Store exact custom category in specs if it's not a standard Postgres enum
    if (!VALID_POSTGRES_CATEGORIES.includes(product.category)) {
      specsObj.__custom_category = product.category;
    }

    const specsVal = JSON.stringify(specsObj);

    const boxVal = Array.isArray(product.whatsInTheBox) 
      ? JSON.stringify(product.whatsInTheBox) 
      : JSON.stringify([]);

    return {
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      brand: this.normalizeBrand(product.brand),
      category: this.toValidPostgresCategory(product.category),
      price: Number(product.price),
      old_price: product.oldPrice ? Number(product.oldPrice) : null,
      rating: Number(product.rating || 5),
      review_count: Number(product.reviewCount || 0),
      in_stock: Boolean(product.inStock),
      is_new: Boolean(product.isNew),
      is_occasion: Boolean(product.isOccasion),
      is_rental: Boolean(product.isRental),
      rental_price_per_day: product.rentalPricePerDay ? Number(product.rentalPricePerDay) : null,
      image: product.image,
      gallery: galleryVal,
      short_description: product.shortDescription || '',
      description: product.description || '',
      specs: specsVal,
      whats_in_the_box: boxVal,
      
      // SEO DB Columns
      seo_title: product.seoTitle || null,
      seo_description: product.seoDescription || null,
      seo_keywords: product.seoKeywords || null,
      seo_h1: product.seoH1 || null,
      seo_short_description: product.seoShortDescription || null,
      seo_alt_text: product.seoAltText || null,
      canonical_url: product.canonicalUrl || null,
      og_title: product.ogTitle || null,
      og_description: product.ogDescription || null,
      og_image: product.ogImage || null,
      seo_noindex: product.seoNoindex ?? false,
      updated_at: new Date().toISOString()
    };
  }

  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_PRODUCTS;
    }

    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('productService.getProducts Supabase error:', error.message || error);
        return [];
      }

      if (!data) {
        return [];
      }

      const map = new Map<string, Product>();
      data.forEach((row: any) => {
        const prod = this.mapRowToProduct(row);
        map.set(prod.id, prod);
      });

      return Array.from(map.values());
    } catch (err) {
      console.error('productService.getProducts exception:', err);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;
      return this.mapRowToProduct(data);
    } catch {
      return null;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.getProductById(slug);
  }

  async createProduct(product: Product): Promise<MutationResult<Product>> {
    if (isSupabaseConfigured && supabase) {
      const row = this.mapProductToRow(product);
      const { data, error } = await supabase
        .from('products')
        .upsert([row])
        .select()
        .maybeSingle();

      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.error('productService.createProduct database error:', msg);

        if (msg.includes('product_category_enum') || msg.includes('enum')) {
          console.warn('Retrying product creation with fallback category cameras...');
          const fallbackRow = { ...row, category: 'cameras' };
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .upsert([fallbackRow])
            .select()
            .maybeSingle();

          if (!retryError && retryData) {
            const newProd = this.mapRowToProduct(retryData);
            return { success: true, data: newProd };
          }
        }

        if (msg.includes('product_brand_enum')) {
          console.warn('Retrying product creation with fallback brand AKABLISHOP...');
          const fallbackRow = { ...row, brand: 'AKABLISHOP' };
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .upsert([fallbackRow])
            .select()
            .maybeSingle();

          if (!retryError && retryData) {
            const newProd = this.mapRowToProduct(retryData);
            return { success: true, data: newProd };
          }
        }

        return { success: false, error: msg };
      }

      if (!data) {
        return { success: false, error: 'Database insert failed: No record returned.' };
      }

      const newProd = this.mapRowToProduct(data);
      return { success: true, data: newProd };
    }
    return { success: true, data: product };
  }

  async updateProduct(product: Product): Promise<MutationResult<Product>> {
    if (isSupabaseConfigured && supabase) {
      const row = this.mapProductToRow(product);

      // 1. Attempt upsert (insert or update) by exact ID match
      const { data, error } = await supabase
        .from('products')
        .upsert(row)
        .select()
        .maybeSingle();

      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.error('productService.updateProduct database error:', msg);

        if (msg.includes('product_category_enum') || msg.includes('enum')) {
          console.warn('Retrying product update with fallback category cameras...');
          const fallbackRow = { ...row, category: 'cameras' };
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .update(fallbackRow)
            .eq('id', product.id)
            .select()
            .maybeSingle();

          if (!retryError && retryData) {
            const updatedProd = this.mapRowToProduct(retryData);
            return { success: true, data: updatedProd };
          }
        }

        if (msg.includes('product_brand_enum')) {
          console.warn('Retrying product update with fallback brand AKABLISHOP...');
          const fallbackRow = { ...row, brand: 'AKABLISHOP' };
          const { data: retryData, error: retryError } = await supabase
            .from('products')
            .update(fallbackRow)
            .eq('id', product.id)
            .select()
            .maybeSingle();

          if (!retryError && retryData) {
            const updatedProd = this.mapRowToProduct(retryData);
            return { success: true, data: updatedProd };
          }
        }

        return { success: false, error: msg };
      }

      if (!data) {
        const { data: slugData, error: slugError } = await supabase
          .from('products')
          .update(row)
          .eq('slug', product.id)
          .select()
          .maybeSingle();

        if (slugError) {
          const msg = slugError.message || JSON.stringify(slugError);
          console.error('productService.updateProduct slug error:', msg);
          return { success: false, error: msg };
        }

        if (!slugData) {
          return { success: false, error: `Product with ID '${product.id}' was not found in Supabase database.` };
        }

        const updatedProd = this.mapRowToProduct(slugData);
        return { success: true, data: updatedProd };
      }

      const updatedProd = this.mapRowToProduct(data);
      return { success: true, data: updatedProd };
    }
    return { success: true, data: product };
  }

  async deactivateProduct(id: string): Promise<MutationResult<string>> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: false })
        .eq('id', id);

      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.error('productService.deactivateProduct database error:', msg);
        return { success: false, error: msg };
      }
    }
    return { success: true, data: id };
  }

  async deleteProduct(id: string): Promise<MutationResult<string>> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.error('productService.deleteProduct database error:', msg);
        return { success: false, error: msg };
      }
    }
    return { success: true, data: id };
  }

  async getUniqueBrands(): Promise<string[]> {
    const fallbackBrands = ['7Artisans', 'AKABLISHOP', 'Canon', 'DJI', 'Fujifilm', 'Godox', 'GoPro', 'Hollyland', 'Insta360', 'K&F Concept', 'Lexar', 'Nikon', 'Røde', 'Sony', 'Ulanzi'];

    if (!isSupabaseConfigured || !supabase) {
      return fallbackBrands;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('brand');

      if (error || !data) {
        return fallbackBrands;
      }

      const uniqueSet = new Set<string>();
      fallbackBrands.forEach(b => uniqueSet.add(b));
      data.forEach((item: any) => {
        if (item.brand && typeof item.brand === 'string' && item.brand.trim()) {
          uniqueSet.add(item.brand.trim());
        }
      });

      return Array.from(uniqueSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } catch {
      return fallbackBrands;
    }
  }

  async getUniqueCategories(): Promise<string[]> {
    const fallbackCategories = ['accessoires', 'appareils-photo', 'audio', 'cameras', 'eclairage', 'lenses', 'location', 'objectifs', 'occasions', 'stabilisateurs'];

    if (!isSupabaseConfigured || !supabase) {
      return fallbackCategories;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('category');

      if (error || !data) {
        return fallbackCategories;
      }

      const uniqueSet = new Set<string>();
      fallbackCategories.forEach(c => uniqueSet.add(c));
      data.forEach((item: any) => {
        if (item.category && typeof item.category === 'string' && item.category.trim()) {
          uniqueSet.add(item.category.trim());
        }
      });

      return Array.from(uniqueSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } catch {
      return fallbackCategories;
    }
  }
}

export const productService = new ProductService();

