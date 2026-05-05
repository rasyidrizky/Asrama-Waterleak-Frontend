import React from 'react';
import { supabase } from '../config/supabaseClient';

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Gagal login:", error.message);
      alert("Terjadi kesalahan saat mencoba login dengan Google.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          Dashboard Telemetri
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Sistem Pemantauan Infrastruktur Air Asrama. Silakan login untuk melanjutkan.
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google Logo" 
            className="w-5 h-5" 
          />
          <span>Masuk dengan Google</span>
        </button>
        
        <div className="mt-8 text-xs text-slate-400">
          Akses terbatas hanya untuk Teknisi Terdaftar.
        </div>
      </div>
    </div>
  );
};

export default Login;