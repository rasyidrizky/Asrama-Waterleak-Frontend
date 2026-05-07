import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSessionAndRole = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(session);

        if (session) {
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (!profileError && userProfile) {
            setRole(userProfile.role);
          }
        }
      } catch (error) {
        console.error("Pengecekan otorisasi terganggu:", error.message);
        setSession(null); 
      } finally {
        setLoading(false); 
      }
    };

    checkSessionAndRole();

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
    } 
    
    else {
      return (
        <div className="flex flex-col h-screen items-center justify-center bg-[#F8F9FA] text-center px-4">
           <h1 className="text-3xl font-bold text-red-600 mb-2">Akses Ditolak (403)</h1>
           <p className="text-gray-600 mb-6 max-w-md">
             Akun Anda berhasil login, tetapi belum didaftarkan ke dalam sistem otorisasi asrama. 
             Silakan hubungi Administrator untuk meminta hak akses.
           </p>
           <button 
             onClick={() => supabase.auth.signOut()} 
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