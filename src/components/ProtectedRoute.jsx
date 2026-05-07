import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk cek sesi dan peran secara bersamaan
    const checkSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // Ambil peran (role) dari tabel users di Supabase
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (!error && userProfile) {
          setRole(userProfile.role);
        }
      }
      setLoading(false);
    };

    checkSessionAndRole();

    // Listener jika ada perubahan status auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        setRole(userProfile?.role);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tampilan loading UI saat mengecek sesi ke server
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Jika belum login, tendang ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Jika halaman memiliki proteksi role, cek kecocokan role
  if (allowedRole && role !== allowedRole) {
    // Arahkan ke "rumahnya" masing-masing jika salah masuk kamar
    if (role === 'Pengelola') {
      return <Navigate to="/executive" replace />;
    } else if (role === 'Teknisi') {
      return <Navigate to="/" replace />;
    }
  }

  // Lolos semua pengecekan, tampilkan halaman
  return children;
};

export default ProtectedRoute;