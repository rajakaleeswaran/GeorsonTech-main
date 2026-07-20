/**
 * @file supabase.js
 * @description Initialises and exports the Supabase client using Vite env variables.
 * Import this wherever Supabase auth or database queries are needed.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
