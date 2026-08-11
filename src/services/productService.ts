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
   * Map domain Product interface strictly to existing Supabase table columns
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
        console.error('productService.getProducts Supabase error:', error.message || error);
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
   * Database-first Create: Inserts into Supabase and returns single verified row
   */
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

  /**
   * Database-first Update: Executes Supabase UPDATE with .eq('id', product.id).select().maybeSingle()
   */
  async updateProduct(product: Product): Promise<MutationResult<Product>> {
    if (isSupabaseConfigured && supabase) {
      const row = this.mapProductToRow(product);

      // 1. Attempt update by exact ID match
      const { data, error } = await supabase
        .from('products')
        .update(row)
        .eq('id', product.id)
        .select()
        .maybeSingle();

      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.error('productService.updateProduct database error:', msg);
        return { success: false, error: msg };
      }

      if (!data) {
        // 2. Fallback attempt update by slug match
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

  /**
   * Soft Deactivate: Sets in_stock = false in Supabase
   */
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

  /**
   * Hard Delete: Removes product record from Supabase
   */
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
}

export const productService = new ProductService();
