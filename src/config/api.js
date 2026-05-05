import axios from 'axios';
import { supabase } from './supabaseClient';

// Membuat instance Axios dengan Base URL dari Render
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Middleware Frontend: Otomatis sisipkan JWT sebelum request dikirim
api.interceptors.request.use(async (config) => {
  // Ambil sesi JWT dari Supabase (Google OAuth)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;