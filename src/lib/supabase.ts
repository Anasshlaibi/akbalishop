/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://rnngcrvefxfbbnamkfkc.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubmdjcnZlZnhmYmJuYW1rZmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MDM0MzQsImV4cCI6MjEwMTk3OTQzNH0.BYYv713s64dU8f8jUBAnwOVPKzZXtwIdUFnNyhBCsmU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
