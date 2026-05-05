import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../config/api';

const Infrastructure = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua"); 

  const fetchInfrastructureData = async () => {
    try {
      const response = await api.get('/web/nodes');
      setNodes(response.data.data || []);
    } catch (error) {
      console.error("Gagal menarik data infrastruktur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfrastructureData();
    const intervalId = setInterval(fetchInfrastructureData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location_block.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'Aktif') {
      matchesFilter = node.status === 'NORMAL';
    } else if (filterStatus === 'Offline') {
      matchesFilter = node.status === 'OFFLINE' || node.status === 'BAHAYA';
    }

    return matchesSearch && matchesFilter;
  });

  const totalNodes = nodes.length;
  const activeNodes = nodes.filter(n => n.status === 'NORMAL').length;
  const issueNodes = nodes.filter(n => n.status === 'BAHAYA' || n.status === 'OFFLINE').length;

  return (
    <div className="flex h-screen bg-[#F5F6F8] font-sans tracking-wide overflow-hidden">
      <Sidebar />

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* 1. HEADER */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Infrastruktur</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Modul Diagnostik dan Pelacakan Jaringan Perangkat IoT.</p>
          </div>
        </header>
        
        {/* 2. TIGA KARTU RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">Total Instrumen</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-800">{totalNodes}</p>
          </div>

          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">Status Optimal</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-emerald-500">{activeNodes}</p>
          </div>

          <div className={`p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all ${issueNodes > 0 ? 'bg-red-50/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${issueNodes > 0 ? 'text-red-500' : 'text-slate-400'} text-sm font-semibold`}>Perlu Perhatian</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${issueNodes > 0 ? 'bg-red-100 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>
            <p className={`text-4xl font-bold ${issueNodes > 0 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>{issueNodes}</p>
          </div>
        </div>

        {/* 3. BARIS FILTER & PENCARIAN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Bagian Kiri: Tombol Status (Pill Style) */}
          <div className="flex items-center bg-[#E2E8F0]/50 p-1.5 rounded-full">
            <button 
              onClick={() => setFilterStatus('Semua')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filterStatus === 'Semua' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilterStatus('Aktif')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filterStatus === 'Aktif' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Aktif
            </button>
            <button 
              onClick={() => setFilterStatus('Offline')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filterStatus === 'Offline' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Bermasalah
            </button>
          </div>

          {/* Bagian Kanan: Search Bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Cari ID Perangkat atau Lokasi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-none rounded-full text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-shadow"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* 4. TABEL DATA INVENTARIS */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-50">ID Perangkat</th>
                  <th className="px-6 py-4 border-b border-slate-50">Lokasi</th>
                  <th className="px-6 py-4 border-b border-slate-50">Tipe</th>
                  <th className="px-6 py-4 border-b border-slate-50">Sinkronisasi</th>
                  <th className="px-6 py-4 border-b border-slate-50">Latensi</th>
                  <th className="px-6 py-4 border-b border-slate-50 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">Menarik data dari server...</td>
                  </tr>
                ) : filteredNodes.length > 0 ? (
                  filteredNodes.map((node) => (
                    <tr key={node.id} className="hover:bg-slate-50 transition-colors group rounded-2xl cursor-default">
                      <td className="px-6 py-5 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                          </div>
                          <span className="font-mono text-slate-500">{node.id.substring(0,8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-800 font-bold">{node.location_block}</td>
                      <td className="px-6 py-5 border-b border-slate-50">{node.device_type || 'Flowmeter'}</td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-400">
                        {node.last_sync ? new Date(node.last_sync).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '-'}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 font-mono text-xs">
                        {node.latency ? <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{node.latency} ms</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-right">
                        <div className="flex justify-end">
                          <span className={`px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 w-max ${node.status === 'NORMAL' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'NORMAL' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                            {node.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">
                      Tidak ada perangkat yang cocok dengan filter atau pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. PAGINASI (Pill Style) */}
        <div className="flex justify-center items-center gap-2 mt-8 pb-8">
          <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-slate-50 hover:text-slate-600 transition shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold shadow-md">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-slate-50 hover:text-slate-600 transition shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Infrastructure;