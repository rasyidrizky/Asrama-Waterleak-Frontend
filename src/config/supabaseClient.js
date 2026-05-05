import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Variabel VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);