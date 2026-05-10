import React, { useState, useEffect } from 'react';
import SidebarPengelola from '../components/SidebarPengelola';
import api from '../config/api';

const ExecutiveInfrastructure = () => {
  const [nodes, setNodes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const nodesRes = await api.get('/web/nodes');
      setNodes(nodesRes.data.data || []);

      const logsRes = await api.get('/web/logs');
      setLogs(logsRes.data.data || []);
      
    } catch (error) {
      console.error("Gagal menarik data rekapitulasi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const totalNodes = nodes.length;
  const onlineNodes = nodes.filter(n => n.is_online).length;
  const offlineNodes = totalNodes - onlineNodes;
  const kesiapanPersen = totalNodes > 0 ? Math.round((onlineNodes / totalNodes) * 100) : 0;

  const recentAnomalies = logs.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#F5F6F8] font-sans tracking-wide">
      <SidebarPengelola />

      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        
        {/* HEADER - Disamakan dengan ExecutiveDashboard */}
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Infrastruktur</h1>
            <p className="text-slate-400 text-sm font-medium">Status sistem pemantauan & rekapitulasi kesehatan node.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Sinkronisasi
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
            Memuat rekapitulasi infrastruktur...
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* --- GRID ATAS: 3 KARTU METRIK --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Kartu Utama: Persentase (Warna Solid) */}
              <div className="md:col-span-2 p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] bg-emerald-700 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-semibold opacity-90">Kesiapan Infrastruktur</h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-5xl font-extrabold mb-3">{kesiapanPersen}%</h2>
                  <div className="w-full max-w-sm bg-black/20 rounded-full h-2 mb-3">
                    <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${kesiapanPersen}%` }}></div>
                  </div>
                  <p className="text-xs font-medium opacity-90 flex items-center gap-2">
                    <span>{onlineNodes} aktif</span> &middot; <span>{offlineNodes} offline dari {totalNodes} node</span>
                  </p>
                </div>
              </div>

              {/* Kartu Samping 1: Node Online */}
              <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between md:col-span-1">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Node Online</h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-5xl font-extrabold text-emerald-500">{onlineNodes}</h2>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-slate-400">
                    Sensor terhubung & aktif
                  </div>
                </div>
              </div>

              {/* Kartu Samping 2: Node Offline */}
              <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between md:col-span-1">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Node Offline</h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className={`text-5xl font-extrabold ${offlineNodes > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                    {offlineNodes}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-slate-400">
                    Membutuhkan perbaikan
                  </div>
                </div>
              </div>

            </div>

            {/* --- DAFTAR ANOMALI TERKINI --- */}
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-1">Riwayat Anomali Terkini</h3>
                  <p className="text-sm text-slate-400 font-medium">Log kejadian terbaru yang terekam oleh sistem</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentAnomalies.length > 0 ? (
                  recentAnomalies.map((log) => {
                    const isResolved = log.is_resolved;
                    const durasi = (log.start_time && log.end_time) ? Math.round((new Date(log.end_time) - new Date(log.start_time)) / 60000) : null;
                    const formattedDate = new Date(log.start_time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});

                    return (
                      <div key={log.anomaly_id} className={`flex items-center justify-between p-5 rounded-[1.25rem] border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] transition-all group
                        ${!isResolved ? 'bg-red-50/40 border-red-100 hover:bg-red-50' : 'bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/40'}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 
                            ${!isResolved ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full ${!isResolved ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                          </div>
                          <div>
                            <h4 className={`text-base font-extrabold mb-1 ${!isResolved ? 'text-red-800' : 'text-emerald-800'}`}>
                              {log.nodes?.location_block || 'Lokasi Tidak Diketahui'}
                            </h4>
                            <p className="text-sm font-medium text-slate-500">
                              {formattedDate} &middot; {durasi !== null ? `${durasi} mnt penanganan` : 'Dalam proses penanganan'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 text-xs font-bold rounded-full 
                            ${!isResolved ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {!isResolved ? 'Aktif' : 'Selesai'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className="text-slate-400 font-bold">Belum ada riwayat anomali yang terekam.</p>
                  </div>
                )}
              </div>

              {recentAnomalies.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="text-sm font-bold border border-slate-200 text-slate-500 px-5 py-2 rounded-full hover:bg-slate-50 transition">
                    Lihat riwayat lengkap
                  </button>
                </div>
              )}

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default ExecutiveInfrastructure;