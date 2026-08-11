/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables or fallback to project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rnngcrvefxfbbnamkfkc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubmdjcnZlZnhmYmJuYW1rZmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MDM0MzQsImV4cCI6MjEwMTk3OTQzNH0.BYYv713s64dU8f8jUBAnwOVPKzZXtwIdUFnNyhBCsmU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
