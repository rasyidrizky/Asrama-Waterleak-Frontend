import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 

    const checkSessionAndRole = async () => {
      try {
        // 1. Tarik sesi dari local storage (Offline, tidak akan hang)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            throw new Error("Sesi kosong atau kadaluwarsa");
        }

        // 2. Tarik data jabatan (Online)
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (isMounted) {
          setSession(session);
          setRole(userProfile.role);
        }

      } catch (error) {
        console.warn("Autentikasi ditolak:", error.message);
        
        // KUNCI SOLUSI FINAL: 
        // Jangan gunakan 'await' di sini. Biarkan pembersihan berjalan di latar belakang
        // sehingga layar tidak akan pernah stuck menunggu balasan server.
        supabase.auth.signOut().catch(() => {}); 
        
        if (isMounted) {
            setSession(null);
            setRole(null);
        }
      } finally {
        // Karena tidak ada await yang menahan, ini PASTI tereksekusi
        if (isMounted) setLoading(false); 
      }
    };

    checkSessionAndRole();

    // Listener hanya untuk menangkap event jika user menekan tombol Logout manual
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        setSession(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // RENDER UI
  // ==========================================
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'Pengelola') {
      return <Navigate to="/executive" replace />;
    } else if (role === 'Teknisi') {
      return <Navigate to="/" replace />;
    } else {
      return (
        <div className="flex flex-col h-screen items-center justify-center bg-[#F8F9FA] text-center px-4">
           <h1 className="text-3xl font-bold text-red-600 mb-2">Akses Ditolak (403)</h1>
           <p className="text-gray-600 mb-6 max-w-md">
             Akun Anda berhasil login, tetapi belum didaftarkan ke dalam sistem otorisasi asrama. 
           </p>
           <button 
             onClick={() => {
               setLoading(true);
               // Di sini kita pakai await karena ini aksi manual dari tombol
               supabase.auth.signOut().finally(() => setLoading(false));
             }} 
             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
           >
             Kembali ke Login
           </button>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;