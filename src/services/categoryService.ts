import { Category, CATEGORIES } from '../data/categories';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  cameras: '/wp-content/uploads/AkabliShop-Head.webp',
  objectifs: '/wp-content/uploads/AkabliShop-Lens.webp',
  lenses: '/wp-content/uploads/AkabliShop-Lens.webp',
  lens: '/wp-content/uploads/AkabliShop-Lens.webp',
  eclairage: '/wp-content/uploads/electronics-store-85-300x266.png',
  lighting: '/wp-content/uploads/electronics-store-85-300x266.png',
  audio: '/wp-content/uploads/electronics-store-86-300x266.png',
  stabilisateurs: '/wp-content/uploads/electronics-store-87.png',
  stabilizers: '/wp-content/uploads/electronics-store-87.png',
  occasions: '/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png',
  location: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
  rental: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
  accessoires: '/wp-content/uploads/electronics-store-55.png',
  accessories: '/wp-content/uploads/electronics-store-55.png',
  'appareils-photo': '/wp-content/uploads/AkabliShop-Head.webp',
};

export class CategoryService {
  public mapRowToCategory(row: CategoryRow): Category {
    let img = (row.image || '').trim();
    if (!img || (!img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:'))) {
      const slugKey = (row.slug || row.id || '').toLowerCase();
      img = DEFAULT_CATEGORY_IMAGES[slugKey] || '/wp-content/uploads/electronics-store-55.png';
    }

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      itemCount: row.item_count || 0,
      image: img,
      iconName: row.icon_name || 'Tag'
    };
  }

  public mapCategoryToRow(category: Category): Database['public']['Tables']['categories']['Insert'] {
    const slug = (category.slug || category.id).toLowerCase().trim();
    return {
      id: category.id || slug,
      name: category.name,
      slug: slug,
      description: category.description || '',
      item_count: category.itemCount || 0,
      image: category.image,
      icon_name: category.iconName || 'Tag',
      updated_at: new Date().toISOString()
    };
  }

  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured || !supabase) {
      return CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('categoryService.getCategories error:', error.message);
        return CATEGORIES;
      }

      if (!data || data.length === 0) {
        // Seed default categories into Supabase if table is empty
        this.seedDefaultCategories().catch(err => {
          console.error('Failed to seed default categories:', err);
        });
        return CATEGORIES;
      }

      return data.map(row => this.mapRowToCategory(row as CategoryRow));
    } catch (err) {
      console.error('categoryService.getCategories exception:', err);
      return CATEGORIES;
    }
  }

  async seedDefaultCategories(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const rows = CATEGORIES.map(cat => this.mapCategoryToRow(cat));
      const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.warn('Failed to seed categories:', error.message);
      }
    } catch (err) {
      console.error('Seed exception:', err);
    }
  }

  async saveCategory(category: Category): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      const row = this.mapCategoryToRow(category);
      
      // 1. Try upserting by ID
      const { error } = await supabase.from('categories').upsert([row], { onConflict: 'id' });
      
      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.warn('categoryService.saveCategory initial upsert failed, trying update by slug:', msg);

        // 2. Fallback: Update by slug if slug already exists under a different primary key
        const { error: updateError } = await supabase
          .from('categories')
          .update({
            name: row.name,
            description: row.description,
            image: row.image,
            icon_name: row.icon_name,
            updated_at: row.updated_at
          })
          .eq('slug', row.slug);

        if (!updateError) {
          return { success: true };
        }

        console.error('categoryService.saveCategory fallback error:', updateError.message);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('categoryService.saveCategory exception:', err);
      return { success: false, error: err?.message || 'Failed to save category' };
    }
  }

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      const { error } = await supabase.from('categories').delete().or(`id.eq.${id},slug.eq.${id}`);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete category' };
    }
  }
}

export const categoryService = new CategoryService();
