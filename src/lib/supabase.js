/**
 * @file supabase.js
 * @description Initialises and exports the Supabase client using Vite env variables.
 * Import this wherever Supabase auth or database queries are needed.
 */
import { createClient } from '@supabase/supabase-js';

// Real credentials are embedded as fallback so the live Vercel deployment works
// even when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not configured
// in the Vercel dashboard environment variables.
const SUPABASE_URL = 'https://gfyvfjgwnercvunvqzpk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeXZmamd3bmVyY3Z1bnZxenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNzM2ODgsImV4cCI6MjA5OTg0OTY4OH0.rgvbQLs7ReaCM90lVZ3fod-2IVlq5pYOKx2kUYCfvQk';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
