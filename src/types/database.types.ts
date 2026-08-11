export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string | null
          name: string
          brand: string
          category: string
          price: number
          old_price: number | null
          rating: number
          review_count: number
          in_stock: boolean
          stock_count: number | null
          is_new: boolean
          is_occasion: boolean
          is_rental: boolean
          is_active: boolean | null
          rental_price_per_day: number | null
          image: string
          gallery: Json
          short_description: string
          description: string
          specs: Json
          whats_in_the_box: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug?: string | null
          name: string
          brand: string
          category: string
          price: number
          old_price?: number | null
          rating?: number
          review_count?: number
          in_stock?: boolean
          stock_count?: number | null
          is_new?: boolean
          is_occasion?: boolean
          is_rental?: boolean
          is_active?: boolean | null
          rental_price_per_day?: number | null
          image: string
          gallery?: Json
          short_description?: string
          description?: string
          specs?: Json
          whats_in_the_box?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string | null
          name?: string
          brand?: string
          category?: string
          price?: number
          old_price?: number | null
          rating?: number
          review_count?: number
          in_stock?: boolean
          stock_count?: number | null
          is_new?: boolean
          is_occasion?: boolean
          is_rental?: boolean
          is_active?: boolean | null
          rental_price_per_day?: number | null
          image?: string
          gallery?: Json
          short_description?: string
          description?: string
          specs?: Json
          whats_in_the_box?: Json
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          city: string
          address: string
          payment_method: string
          total_amount: number
          items: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          customer_name: string
          customer_phone: string
          city: string
          address: string
          payment_method: string
          total_amount: number
          items: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          city?: string
          address?: string
          payment_method?: string
          total_amount?: number
          items?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          product_id: string
          stock_quantity: number
          reserved_quantity: number
          low_stock_threshold: number
          updated_at: string
        }
        Insert: {
          product_id: string
          stock_quantity?: number
          reserved_quantity?: number
          low_stock_threshold?: number
          updated_at?: string
        }
        Update: {
          product_id?: string
          stock_quantity?: number
          reserved_quantity?: number
          low_stock_threshold?: number
          updated_at?: string
        }
      }
    }
  }
}
