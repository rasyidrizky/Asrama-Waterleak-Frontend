import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    // PERBAIKAN: Mengganti 'min-h-screen' menjadi 'h-screen' dan menambahkan 'sticky top-0'
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col transition-all z-20 font-sans">
      
      {/* Header / Logo */}
      <div className="p-8 pb-10">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
          <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.202 4.662 5.997 9.606 5.997 13.613 0 3.328-2.67 6.061-5.997 6.061-3.326 0-5.997-2.733-5.997-6.061 0-4.007 2.795-8.951 5.997-13.613z" />
          </svg>
          Telemetri
        </h2>
      </div>

      {/* Menu Navigasi */}
      {/* PERBAIKAN: Menambahkan 'overflow-y-auto' agar menu bisa digulir di layar laptop kecil tanpa menyembunyikan tombol Keluar */}
      <nav className="flex-1 px-5 space-y-1 overflow-y-auto">
        <Link 
          to="/" 
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
            location.pathname === '/' 
              ? 'bg-slate-50 text-slate-800 font-bold shadow-sm' 
              : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          <svg className={`w-5 h-5 ${location.pathname === '/' ? 'text-blue-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span className="text-sm">Dashboard</span>
        </Link>

        <Link 
          to="/infrastruktur" 
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
            location.pathname === '/infrastruktur' 
              ? 'bg-slate-50 text-slate-800 font-bold shadow-sm' 
              : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          <svg className={`w-5 h-5 ${location.pathname === '/infrastruktur' ? 'text-blue-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
          </svg>
          <span className="text-sm">Infrastruktur</span>
        </Link>

        <Link 
          to="/audit" 
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
            location.pathname === '/audit' 
              ? 'bg-slate-50 text-slate-800 font-bold shadow-sm' 
              : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          <svg className={`w-5 h-5 ${location.pathname === '/audit' ? 'text-blue-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span className="text-sm">Audit & Log</span>
        </Link>
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 mb-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-600 font-medium transition-colors mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-sm">Bantuan</span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="text-sm">Keluar</span>
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;