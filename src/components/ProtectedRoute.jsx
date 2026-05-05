import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi saat komponen pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Dengarkan perubahan status secara real-time (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Bersihkan pendengar saat komponen dilepas
    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan layar loading sebentar saat mengecek token
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Jika tidak ada sesi valid, lempar paksa ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Jika aman, render halaman yang diminta (misal: Dashboard)
  return children;
};

export default ProtectedRoute;