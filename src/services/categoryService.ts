import { Category, CATEGORIES } from '../data/categories';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database.types';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  cameras: '/wp-content/uploads/categories/cameras.jpg',
  objectifs: '/wp-content/uploads/categories/objectifs.jpg',
  lenses: '/wp-content/uploads/categories/objectifs.jpg',
  lens: '/wp-content/uploads/categories/objectifs.jpg',
  eclairage: '/wp-content/uploads/categories/eclairage.jpg',
  lighting: '/wp-content/uploads/categories/eclairage.jpg',
  stabilisateurs: '/wp-content/uploads/categories/stabilisateurs.webp',
  stabilizers: '/wp-content/uploads/categories/stabilisateurs.webp',
  occasions: '/wp-content/uploads/Sony-a7S-III-%E2%80%93-Boitier-nu-Bon-etat-300x300.png',
  location: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
  rental: '/wp-content/uploads/SONY-FX6-jpg-300x300.webp',
  accessoires: '/wp-content/uploads/categories/accessoires.webp',
  accessories: '/wp-content/uploads/categories/accessoires.webp',
  'appareils-photo': '/wp-content/uploads/categories/cameras.jpg',
};

export class CategoryService {
  public mapRowToCategory(row: CategoryRow): Category {
    let img = (row.image || '').trim();
    if (!img || (!img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:'))) {
      const slugKey = (row.slug || row.id || '').toLowerCase();
      img = DEFAULT_CATEGORY_IMAGES[slugKey] || '/wp-content/uploads/categories/accessoires.webp';
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

      if (data && data.length > 0) {
        const audioRow = data.find((r: any) => r.slug === 'audio' || r.id === 'audio' || r.slug === 'son' || r.id === 'son');
        if (audioRow) {
          supabase.from('categories').delete().or('id.eq.audio,slug.eq.audio,id.eq.son,slug.eq.son').then(() => {
            console.log('Cleaned up audio/son category row from Supabase');
          });
        }
      }

      const canonicalMap = new Map<string, Category>();

      CATEGORIES.forEach(cat => canonicalMap.set(cat.slug, cat));

      if (data && data.length > 0) {
        data.forEach((row: any) => {
          const cat = this.mapRowToCategory(row as CategoryRow);
          const slug = cat.slug.toLowerCase();
          if (slug === 'audio' || slug === 'son') return;

          let targetSlug = slug;
          if (slug === 'lens' || slug === 'lenses') targetSlug = 'objectifs';
          else if (slug === 'appareils-photo') targetSlug = 'cameras';
          else if (slug === 'lighting') targetSlug = 'eclairage';
          else if (slug === 'stabilizers') targetSlug = 'stabilisateurs';
          else if (slug === 'rental') targetSlug = 'location';
          else if (slug === 'accessories') targetSlug = 'accessoires';

          const existing = canonicalMap.get(targetSlug);
          canonicalMap.set(targetSlug, existing ? { ...existing, ...cat, slug: targetSlug } : cat);
        });
      }

      return Array.from(canonicalMap.values());
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
      
      const { error } = await supabase.from('categories').upsert([row], { onConflict: 'id' });
      
      if (error) {
        const msg = error.message || JSON.stringify(error);
        console.warn('categoryService.saveCategory initial upsert failed, trying update by slug:', msg);

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
