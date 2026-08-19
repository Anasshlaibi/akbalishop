import { Category, CATEGORIES } from '../data/categories';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

export class CategoryService {
  public mapRowToCategory(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      itemCount: row.item_count || 0,
      image: row.image,
      iconName: row.icon_name || 'Tag'
    };
  }

  public mapCategoryToRow(category: Category): Database['public']['Tables']['categories']['Insert'] {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug || category.id,
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
      const { error } = await supabase.from('categories').upsert(rows);
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
      const { error } = await supabase.from('categories').upsert([row]);
      if (error) {
        console.error('categoryService.saveCategory error:', error.message);
        return { success: false, error: error.message };
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
      const { error } = await supabase.from('categories').delete().eq('id', id);
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
