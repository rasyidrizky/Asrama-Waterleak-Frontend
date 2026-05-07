import React, { useState, useEffect } from 'react';
import SidebarPengelola from '../components/SidebarPengelola';
import AlertNotification from '../components/AlertNotification';
import api from '../config/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const ExecutiveDashboard = () => {
  const [summary, setSummary] = useState({
    total_infrastruktur: 0,
    infrastruktur_aktif: 0,
    kebocoran_saat_ini: 0,
    status_kesehatan: "Memuat..."
  });
  
  const [nodes, setNodes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const sumRes = await api.get('/web/executive/summary');
      const newData = sumRes.data.data;
      
      const nodesRes = await api.get('/web/nodes');
      const nodesData = nodesRes.data.data || [];
      setNodes(nodesData);

      if (newData.kebocoran_saat_ini > summary.kebocoran_saat_ini && summary.kebocoran_saat_ini !== 0) {
          
          const nodeBermasalah = nodesData.find(n => n.has_anomaly || n.status === 'BAHAYA');
          const lokasi = nodeBermasalah ? nodeBermasalah.location_block : 'Sistem Asrama';

          toast(
            <AlertNotification 
              locationBlock={lokasi} 
              flowRate=">15" 
            />, 
            {
              position: "top-right",
              autoClose: false,
              closeButton: false,
              className: '!bg-white !p-5 !rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border-l-4 border-red-500', 
            }
          );
      }
      setSummary(newData);

      const telRes = await api.get('/web/telemetry-all');
      const rawTel = telRes.data.data || [];
      
      const aggregatedChart = rawTel.map(item => {
         let totalDebit = 0;
         Object.keys(item).forEach(key => {
           if (key !== 'time' && typeof item[key] === 'number') {
             totalDebit += item[key];
           }
         });
         return { time: item.time, debit: parseFloat(totalDebit.toFixed(1)) };
      });
      setChartData(aggregatedChart);

    } catch (error) {
      console.error("Gagal menarik data eksekutif:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [summary.kebocoran_saat_ini]); 

  const kesiapanNode = summary.total_infrastruktur > 0 
    ? Math.round((summary.infrastruktur_aktif / summary.total_infrastruktur) * 100) 
    : 0;
  const nodeOffline = summary.total_infrastruktur - summary.infrastruktur_aktif;
  const estimasiKonsumsi = chartData.length > 0 ? (chartData[chartData.length - 1].debit * 60).toFixed(0) : 0; 

  const isWaspada = summary.kebocoran_saat_ini > 0;

  return (
    <div className="flex min-h-screen bg-[#F5F6F8] font-sans tracking-wide">
      <ToastContainer />
      <SidebarPengelola />

      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">Dashboard</h1>
            <p className="text-slate-400 text-sm font-medium">Pantau, analisis, dan pastikan keandalan distribusi air asrama.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Unduh Laporan
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
            Menyinkronkan data infrastruktur...
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className={`p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden
                ${isWaspada ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white'}`}>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-semibold opacity-90">Status Keamanan</h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold mb-1">{isWaspada ? 'Waspada' : 'Aman'}</h2>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium opacity-90 bg-white/10 w-max px-2.5 py-1 rounded-md">
                    {isWaspada ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> {summary.kebocoran_saat_ini} indikasi kebocoran</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Terkendali dari bulan lalu</>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Laju Konsumsi</h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-800">{estimasiKonsumsi} <span className="text-xl text-slate-400 font-bold">L/j</span></h2>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Berdasarkan agregasi real-time
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Kesiapan Jaringan</h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-800">{kesiapanNode}%</h2>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-slate-400">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {summary.infrastruktur_aktif} Sensor merespon
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Terputus</h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                  </div>
                </div>
                <div>
                  <h2 className={`text-4xl font-extrabold ${nodeOffline > 0 ? 'text-red-500' : 'text-slate-800'}`}>{nodeOffline}</h2>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-slate-400">
                    Menunggu pemeliharaan teknisi
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-1">Tren Laju Aliran Air</h3>
                    <p className="text-sm text-slate-400 font-medium">Pemantauan akumulatif seluruh blok asrama</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full">Real-time</span>
                  </div>
                </div>
                
                <div className="flex-1 min-h-[300px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}} 
                          cursor={{stroke: '#f1f5f9', strokeWidth: 2}}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="debit" 
                          name="Debit Total (L/m)"
                          stroke="#047857"
                          strokeWidth={4} 
                          dot={false}
                          activeDot={{ r: 7, fill: '#047857', stroke: '#fff', strokeWidth: 3 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50/50 rounded-2xl">
                      Belum ada data terekam
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col gap-6">
                
                <div className="bg-white p-7 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-extrabold text-slate-800">Status Blok</h3>
                    <button className="text-xs font-bold border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full hover:bg-slate-50 transition">
                      Lihat Semua
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {nodes.slice(0, 5).map((node) => {
                      let isError = !node.is_online || node.status === 'BAHAYA' || node.has_anomaly;
                      let statusText = !node.is_online ? 'Offline' : (node.status === 'BAHAYA' || node.has_anomaly) ? 'Kebocoran' : 'Aman beroperasi';

                      return (
                        <div key={node.node_id} className="flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 
                              ${isError ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                              <div className={`w-3 h-3 rounded-full ${isError ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">{node.location_block}</h4>
                              <p className="text-xs font-medium text-slate-400 mt-0.5">{statusText}</p>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </div>
                        </div>
                      );
                    })}
                    
                    {nodes.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">Belum ada blok terdaftar.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default ExecutiveDashboard;