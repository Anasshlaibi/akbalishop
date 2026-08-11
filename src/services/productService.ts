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
   * Map raw Supabase database record to domain Product interface
   */
  public mapRowToProduct(row: Database['public']['Tables']['products']['Row']): Product {
    return {
      id: row.id,
      slug: row.slug || row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      oldPrice: row.old_price ? Number(row.old_price) : undefined,
      rating: Number(row.rating || 5),
      reviewCount: Number(row.review_count || 0),
      inStock: Boolean(row.in_stock),
      stockCount: row.stock_count ? Number(row.stock_count) : undefined,
      isActive: row.is_active !== false,
      isNew: Boolean(row.is_new),
      isOccasion: Boolean(row.is_occasion),
      isRental: Boolean(row.is_rental),
      rentalPricePerDay: row.rental_price_per_day ? Number(row.rental_price_per_day) : undefined,
      image: row.image,
      gallery: Array.isArray(row.gallery) && (row.gallery as string[]).length > 0 ? (row.gallery as string[]) : [row.image],
      shortDescription: row.short_description || '',
      description: row.description || '',
      specs: (row.specs as Record<string, string>) || {},
      whatsInTheBox: Array.isArray(row.whats_in_the_box) ? (row.whats_in_the_box as string[]) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Map domain Product interface to raw database columns
   */
  public mapProductToRow(product: Product): Database['public']['Tables']['products']['Insert'] {
    return {
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      old_price: product.oldPrice || null,
      rating: product.rating,
      review_count: product.reviewCount,
      in_stock: product.inStock,
      stock_count: product.stockCount || null,
      is_active: product.isActive ?? true,
      is_new: product.isNew || false,
      is_occasion: product.isOccasion || false,
      is_rental: product.isRental || false,
      rental_price_per_day: product.rentalPricePerDay || null,
      image: product.image,
      gallery: product.gallery,
      short_description: product.shortDescription,
      description: product.description,
      specs: product.specs,
      whats_in_the_box: product.whatsInTheBox
    };
  }

  /**
   * Fetch all products from Supabase.
   * SUPABASE IS THE ONLY PRODUCTION SOURCE OF TRUTH.
   * If Supabase returns 0 products, return [] (empty list). Do NOT fall back to static seed data.
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

      // Map Supabase rows to Product models
      const map = new Map<string, Product>();
      data.forEach(row => {
        const prod = this.mapRowToProduct(row as Database['public']['Tables']['products']['Row']);
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
      return this.mapRowToProduct(data as Database['public']['Tables']['products']['Row']);
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
   * Non-Optimistic Create/Upsert: Mutation executes against DB first
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
        const newProd = this.mapRowToProduct(data[0] as Database['public']['Tables']['products']['Row']);
        return { success: true, data: newProd };
      }
    }
    return { success: true, data: product };
  }

  /**
   * Non-Optimistic Update: Mutation executes against DB first using select & upsert fallback
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
          const updatedProd = this.mapRowToProduct(upsertData[0] as Database['public']['Tables']['products']['Row']);
          return { success: true, data: updatedProd };
        }
      } else {
        const updatedProd = this.mapRowToProduct(data[0] as Database['public']['Tables']['products']['Row']);
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
