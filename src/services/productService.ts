import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { SEED_PRODUCTS } from '../data/seed/seedData';
import { Database } from '../types/database.types';

export interface MutationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ProductService {
  /**
   * Robust mapping from raw Supabase database record (handling stringified JSON, numbers, and strings)
   */
  public mapRowToProduct(row: any): Product {
    // Parse gallery (handles array, JSON string, or single image fallback)
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

    // Parse specs (handles object, JSON string, or empty object)
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

    // Parse whats_in_the_box (handles array, JSON string, or empty array)
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

    return {
      id: String(row.id),
      slug: row.slug ? String(row.slug) : String(row.id),
      name: String(row.name || ''),
      brand: String(row.brand || 'AKABLISHOP'),
      category: String(row.category || 'cameras'),
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
      updatedAt: row.updated_at
    };
  }

  /**
   * Map domain Product interface to database columns (handling JSON stringification for Supabase schema)
   */
  public mapProductToRow(product: Product): any {
    const galleryVal = Array.isArray(product.gallery) && product.gallery.length > 0 
      ? JSON.stringify(product.gallery) 
      : JSON.stringify([product.image]);

    const specsVal = typeof product.specs === 'object' && product.specs !== null 
      ? JSON.stringify(product.specs) 
      : JSON.stringify({});

    const boxVal = Array.isArray(product.whatsInTheBox) 
      ? JSON.stringify(product.whatsInTheBox) 
      : JSON.stringify([]);

    return {
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: Number(product.price),
      old_price: product.oldPrice ? Number(product.oldPrice) : null,
      rating: Number(product.rating || 5),
      review_count: Number(product.reviewCount || 0),
      in_stock: Boolean(product.inStock),
      stock_count: product.stockCount ? Number(product.stockCount) : 1,
      is_active: product.isActive ?? true,
      is_new: Boolean(product.isNew),
      is_occasion: Boolean(product.isOccasion),
      is_rental: Boolean(product.isRental),
      rental_price_per_day: product.rentalPricePerDay ? Number(product.rentalPricePerDay) : null,
      image: product.image,
      gallery: galleryVal,
      short_description: product.shortDescription || '',
      description: product.description || '',
      specs: specsVal,
      whats_in_the_box: boxVal
    };
  }

  /**
   * Fetch all products from Supabase.
   * SUPABASE IS THE ONLY PRODUCTION SOURCE OF TRUTH.
   */
  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_PRODUCTS;
    }

    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('productService.getProducts Supabase error:', error);
        return [];
      }

      if (!data) {
        return [];
      }

      const map = new Map<string, Product>();
      data.forEach(row => {
        const prod = this.mapRowToProduct(row);
        map.set(prod.id, prod);
      });

      return Array.from(map.values());
    } catch (err) {
      console.error('productService.getProducts exception:', err);
      return [];
    }
  }

  /**
   * Fetch single product by ID or Slug directly from Supabase
   */
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

  /**
   * Fetch single product by Slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.getProductById(slug);
  }

  /**
   * Create/Upsert product in Supabase
   */
  async createProduct(product: Product): Promise<MutationResult<Product>> {
    if (isSupabaseConfigured && supabase) {
      const row = this.mapProductToRow(product);
      const { data, error } = await supabase.from('products').upsert([row]).select();
      if (error) {
        console.error('productService.createProduct database error:', error);
        return { success: false, error: error.message };
      }
      if (data && data.length > 0) {
        const newProd = this.mapRowToProduct(data[0]);
        return { success: true, data: newProd };
      }
    }
    return { success: true, data: product };
  }

  /**
   * Update product in Supabase using ID/slug matching and upsert fallback
   */
  async updateProduct(product: Product): Promise<MutationResult<Product>> {
    if (isSupabaseConfigured && supabase) {
      const row = this.mapProductToRow(product);

      // Attempt update by matching ID or Slug
      const { data, error } = await supabase
        .from('products')
        .update(row)
        .or(`id.eq.${product.id},slug.eq.${product.id}`)
        .select();

      if (error) {
        console.error('productService.updateProduct database error:', error);
        return { success: false, error: error.message };
      }

      // If update matched 0 rows, fallback to upsert
      if (!data || data.length === 0) {
        const { data: upsertData, error: upsertError } = await supabase
          .from('products')
          .upsert([row])
          .select();

        if (upsertError) {
          console.error('productService.updateProduct upsert error:', upsertError);
          return { success: false, error: upsertError.message };
        }

        if (upsertData && upsertData.length > 0) {
          const updatedProd = this.mapRowToProduct(upsertData[0]);
          return { success: true, data: updatedProd };
        }
      } else {
        const updatedProd = this.mapRowToProduct(data[0]);
        return { success: true, data: updatedProd };
      }
    }
    return { success: true, data: product };
  }

  /**
   * Soft Deactivate: Sets is_active = false
   */
  async deactivateProduct(id: string): Promise<MutationResult<string>> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .or(`id.eq.${id},slug.eq.${id}`);

      if (error) {
        console.error('productService.deactivateProduct database error:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: true, data: id };
  }

  /**
   * Hard Delete: Removes product record from Supabase
   */
  async deleteProduct(id: string): Promise<MutationResult<string>> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .or(`id.eq.${id},slug.eq.${id}`);

      if (error) {
        console.error('productService.deleteProduct database error:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: true, data: id };
  }
}

export const productService = new ProductService();
