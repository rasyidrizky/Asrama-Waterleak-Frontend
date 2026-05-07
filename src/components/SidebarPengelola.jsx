import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const SidebarPengelola = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col transition-all z-20 font-sans">
      
      <div className="p-8 pb-10">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          AquaMonitor
        </h2>
      </div>

      <nav className="flex-1 px-5 space-y-1 overflow-y-auto">
        <Link 
          to="/executive" 
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
            location.pathname === '/executive' 
              ? 'bg-slate-50 text-slate-800 font-bold shadow-sm' 
              : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          <svg className={`w-5 h-5 ${location.pathname === '/executive' ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          <span className="text-sm">Beranda</span>
        </Link>

        <Link 
            to="/executive/infrastruktur" 
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                location.pathname === '/executive/infrastruktur' 
                ? 'bg-slate-50 text-slate-800 font-bold shadow-sm' 
                : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
            }`}
            >
            <svg className={`w-5 h-5 ${location.pathname === '/executive/infrastruktur' ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
            </svg>
            <span className="text-sm">Infrastruktur</span>
        </Link>
      </nav>

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

export default SidebarPengelola;