import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TelemetryChart from '../components/TelemetryChart';
import api from '../config/api';

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('spesifik'); 

  const fetchNodes = async () => {
    try {
      const response = await api.get('/web/nodes'); 
      const nodesData = response.data.data;
      setNodes(nodesData);
      
      if (!selectedNode && nodesData.length > 0) {
        setSelectedNode(nodesData[0].node_id);
      }
    } catch (error) {
      console.error("Gagal menarik data inventaris node:", error);
    }
  };

  const fetchTelemetryData = async (nodeId) => {
    try {
      const url = viewMode === 'semua' ? '/web/telemetry-all' : `/web/telemetry/${nodeId}`;
      const response = await api.get(url);
      setChartData(response.data.data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const intervalId = setInterval(() => {
      fetchNodes();
      if (selectedNode) fetchTelemetryData(selectedNode);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [selectedNode, viewMode]); 

  useEffect(() => {
    if (selectedNode) fetchTelemetryData(selectedNode);
  }, [selectedNode, viewMode]); 

const handleResolveIncident = async (anomalyId) => {
    const catatanTeknisi = window.prompt(
      "Insiden ini akan ditandai selesai. Silakan masukkan catatan perbaikan (opsional):", 
      "Perbaikan fisik selesai dilakukan."
    );

    if (catatanTeknisi === null) return;

    try {
      await api.put(`/web/resolve/${anomalyId}`, { action_description: catatanTeknisi });
      alert("Status dikembalikan menjadi NORMAL. Log insiden ditutup.");
      fetchNodes(); 
    } catch (error) {
      alert("Gagal memperbarui status. Periksa koneksi.");
    }
  };

  const totalNodes = nodes.length;
  const anomalyNodes = nodes.filter(n => n.has_anomaly || n.status === 'BAHAYA').length; 
  const offlineNodes = nodes.filter(n => n.is_online === false).length;

  return (
    <div className="flex min-h-screen bg-[#F5F6F8] font-sans tracking-wide">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Ringkasan Infrastruktur</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Sistem Pemantauan Terpusat (Versi Produksi)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">Total Node Aktif</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-800">{totalNodes - offlineNodes}</p>
          </div>
          
          <div className={`p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all ${anomalyNodes > 0 ? 'bg-red-50/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${anomalyNodes > 0 ? 'text-red-500' : 'text-slate-400'} text-sm font-semibold`}>Terdeteksi Anomali</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${anomalyNodes > 0 ? 'bg-red-100 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <p className={`text-4xl font-bold ${anomalyNodes > 0 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>{anomalyNodes}</p>
          </div>

          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-semibold">Node Offline</h3>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path></svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-800">{offlineNodes}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Performa Aliran Air</h3>
              <p className="text-sm text-slate-400 font-medium">
                {viewMode === 'semua' ? 'Memantau seluruh infrastruktur' : (
                  <>Fokus pemantauan: <span className="text-slate-700">{nodes.find(n => n.node_id === selectedNode)?.location_block || selectedNode}</span></>
                )}
              </p>
            </div>

            <div className="flex items-center bg-[#F5F6F8] p-1.5 rounded-full">
              <button 
                onClick={() => setViewMode('spesifik')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'spesifik' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Node Spesifik
              </button>
              <button 
                onClick={() => setViewMode('semua')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'semua' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Semua Node
              </button>
            </div>
          </div>

          {viewMode === 'spesifik' && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-400">Filter Lokasi:</span>
              <select
                value={selectedNode || ''}
                onChange={(e) => setSelectedNode(e.target.value)}
                className="bg-slate-50 border-none text-slate-700 text-sm font-medium rounded-full focus:ring-2 focus:ring-blue-100 block px-4 py-2 cursor-pointer outline-none"
              >
                {nodes.map(node => (
                  <option key={node.node_id} value={node.node_id}>
                    {node.location_block}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">Menarik data analitik...</div>
            ) : chartData.length > 0 ? (
              <TelemetryChart data={chartData} viewMode={viewMode} nodesData={nodes} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">Belum ada rekaman untuk perangkat ini.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-xl font-bold text-slate-800">Inventaris Infrastruktur</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-50">ID Perangkat</th>
                  <th className="px-6 py-4 border-b border-slate-50">Lokasi Blok</th>
                  <th className="px-6 py-4 border-b border-slate-50">Sinkronisasi</th>
                  <th className="px-6 py-4 border-b border-slate-50 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium text-sm">
                {nodes.map((node) => {
                  let statusVisual = 'NORMAL';
                  if (!node.is_online) statusVisual = 'OFFLINE';
                  else if (node.status === 'BAHAYA' || node.has_anomaly) statusVisual = 'BAHAYA';

                  return (
                    <tr 
                      key={node.node_id} 
                      onClick={() => {
                        setViewMode('spesifik');
                        setSelectedNode(node.node_id);
                      }}
                      className={`transition-colors cursor-pointer group hover:bg-slate-50 rounded-2xl ${selectedNode === node.node_id && viewMode === 'spesifik' ? 'bg-[#F8FAFC]' : ''}`}
                    >
                      <td className="px-6 py-5 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                          </div>
                          <span className="font-mono text-slate-500 uppercase">{node.node_id?.substring(0, 8) || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-800 font-bold">{node.location_block}</td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-400">
                        {node.last_sync ? new Date(node.last_sync).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : 'Menunggu...'}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-right">
                        <div className="flex items-center justify-end gap-4">
                          {statusVisual === 'BAHAYA' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleResolveIncident(node.anomaly_id || node.node_id); }}
                              className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                              Tandai Selesai
                            </button>
                          )}
                          <span className={`px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 
                            ${statusVisual === 'NORMAL' ? 'bg-emerald-50 text-emerald-600' : 
                              statusVisual === 'OFFLINE' ? 'bg-slate-100 text-slate-500' : 
                              'bg-red-50 text-red-600'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full 
                              ${statusVisual === 'NORMAL' ? 'bg-emerald-500' : 
                                statusVisual === 'OFFLINE' ? 'bg-slate-400' : 
                                'bg-red-500 animate-pulse'}`}
                            ></span>
                            {statusVisual === 'NORMAL' ? 'Aman' : statusVisual === 'OFFLINE' ? 'Terputus' : 'Kebocoran'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;