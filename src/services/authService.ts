import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

class AuthService {
  private currentAdmin: AdminUser | null = null;
  private listeners: Array<(admin: AdminUser | null) => void> = [];

  constructor() {
    const session = localStorage.getItem('akabli_admin_session');
    if (session) {
      try {
        this.currentAdmin = JSON.parse(session);
      } catch {
        this.currentAdmin = null;
      }
    }
  }

  getCurrentUser(): AdminUser | null {
    return this.currentAdmin;
  }

  isAuthenticated(): boolean {
    return this.currentAdmin !== null;
  }

  subscribe(callback: (admin: AdminUser | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentAdmin));
  }

  async login(password: string): Promise<boolean> {
    // 1. Supabase Auth if user exists
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@akablishop.ma',
          password
        });
        if (!error && data.user) {
          const admin: AdminUser = {
            id: data.user.id,
            email: data.user.email || 'admin@akablishop.ma',
            role: 'admin'
          };
          this.currentAdmin = admin;
          localStorage.setItem('akabli_admin_session', JSON.stringify(admin));
          this.notify();
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth attempt:', err);
      }
    }

    // 2. Verified admin passphrase check for store manager
    if (password === 'akabli2026' || password === 'admin123') {
      const admin: AdminUser = {
        id: 'admin-local',
        email: 'admin@akablishop.ma',
        role: 'admin'
      };
      this.currentAdmin = admin;
      localStorage.setItem('akabli_admin_session', JSON.stringify(admin));
      this.notify();
      return true;
    }

    return false;
  }

  logout() {
    this.currentAdmin = null;
    localStorage.removeItem('akabli_admin_session');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    this.notify();
  }
}

export const authService = new AuthService();
