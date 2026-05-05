import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../config/api';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const fetchLogs = async () => {
    try {
      const response = await api.get('/web/logs');
      setLogs(response.data.data || []);
    } catch (error) {
      console.warn("Gagal menarik data log:", error);
      setLogs([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const currentMonthLogs = logs.filter(log => {
    const logDate = new Date(log.created_at || log.waktu_mulai);
    const now = new Date();
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
  });

  const totalKejadian = currentMonthLogs.length; 
  const estimasiAirTerbuang = currentMonthLogs.reduce((sum, log) => sum + (Number(log.estimasi_volume) || 0), 0);
  const totalDurasi = currentMonthLogs.reduce((sum, log) => sum + (Number(log.durasi_menit) || 0), 0);
  const rataRataDurasi = totalKejadian > 0 ? (totalDurasi / totalKejadian).toFixed(1) : 0;

  const uniqueLocations = Array.from(new Set(logs.map(log => log.location_block).filter(Boolean)));

  const filteredLogs = logs.filter(log => {
    const matchLocation = locationFilter === 'Semua' || log.location_block === locationFilter;
    const matchStatus = statusFilter === 'Semua' || log.status === statusFilter;

    let matchDate = true;
    if (startDate && endDate) {
      const logDate = new Date(log.created_at || log.waktu_mulai).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + 86400000; 
      matchDate = logDate >= start && logDate <= end;
    }

    return matchLocation && matchStatus && matchDate;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    let csvContent = "ID Log,Waktu Mulai,Waktu Berakhir,Lokasi,Durasi (mnt),Rata-rata Debit (L/m),Status\n";

    filteredLogs.forEach(log => {
      const waktuMulai = log.waktu_mulai ? new Date(log.waktu_mulai).toLocaleString('id-ID').replace(',', '') : '-';
      const waktuBerakhir = log.waktu_berakhir ? new Date(log.waktu_berakhir).toLocaleString('id-ID').replace(',', '') : '-';
      
      csvContent += `${log.id},${waktuMulai},${waktuBerakhir},${log.location_block},${log.durasi_menit || '-'},${log.debit_air || '-'},${log.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_kebocoran_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-[#F5F6F8] font-sans tracking-wide overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Log Riwayat & Audit Kebocoran</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Basis data historis anomali tervalidasi - Audit operasional & kalkulasi Non-Revenue Water.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="text-slate-400 text-sm font-semibold">Estimasi Air Terbuang</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-800">{estimasiAirTerbuang}</p>
              <span className="text-lg font-bold text-slate-400 mb-1">Liter</span>
            </div>
          </div>
          
          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <h3 className="text-slate-400 text-sm font-semibold">Total Insiden</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-800">{totalKejadian}</p>
              <span className="text-lg font-bold text-slate-400 mb-1">Kejadian</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-slate-400 text-sm font-semibold">Rata-rata Durasi</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-slate-800">{rataRataDurasi}</p>
              <span className="text-lg font-bold text-slate-400 mb-1">Menit</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          
          <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between bg-white">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50 px-2 py-1 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <svg className="w-4 h-4 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-transparent border-none focus:outline-none text-slate-600 font-medium"
                />
                <span className="text-slate-300">-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-transparent border-none focus:outline-none text-slate-600 font-medium"
                />
              </div>
              
              <div className="relative">
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-full text-sm font-medium text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                >
                  <option value="Semua">Semua Blok</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-4 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-full text-sm font-medium text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tervalidasi">Tervalidasi</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Ditinjau">Ditinjau</option>
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-4 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            <button 
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-bold rounded-full transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Ekspor CSV
            </button>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-50 w-12">#</th>
                  <th className="px-6 py-4 border-b border-slate-50">Waktu Mulai</th>
                  <th className="px-6 py-4 border-b border-slate-50">Waktu Berakhir</th>
                  <th className="px-6 py-4 border-b border-slate-50">Lokasi</th>
                  <th className="px-6 py-4 border-b border-slate-50">Durasi</th>
                  <th className="px-6 py-4 border-b border-slate-50">Debit (Avg)</th>
                  <th className="px-6 py-4 border-b border-slate-50 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">Menarik arsip log...</td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors group rounded-2xl cursor-default">
                      <td className="px-6 py-5 border-b border-slate-50 font-mono text-xs text-slate-400">
                        {(index + 1).toString().padStart(3, '0')}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-800">
                        {log.waktu_mulai ? new Date(log.waktu_mulai).toLocaleString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'}) : new Date(log.created_at).toLocaleString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-slate-500">
                        {log.waktu_berakhir ? new Date(log.waktu_berakhir).toLocaleString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'}) : '-'}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 font-bold text-slate-700">{log.location_block}</td>
                      <td className="px-6 py-5 border-b border-slate-50 font-mono text-xs">
                        {log.durasi_menit ? <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{log.durasi_menit} mnt</span> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 font-mono text-xs text-red-500 font-bold">
                        {log.debit_air ? `${log.debit_air} L/m` : '-'}
                      </td>
                      <td className="px-6 py-5 border-b border-slate-50 text-right">
                        <div className="flex justify-end">
                          <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full uppercase flex items-center gap-1.5 w-max
                            ${log.status === 'Tervalidasi' ? 'bg-red-50 text-red-600' : 
                              log.status === 'Ditinjau' ? 'bg-orange-50 text-orange-600' : 
                              'bg-emerald-50 text-emerald-600'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Tervalidasi' ? 'bg-red-500' : log.status === 'Ditinjau' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                            {log.status || 'Selesai'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p className="font-semibold text-slate-400">Log Historis Kosong</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-4 text-xs text-slate-400 font-medium text-center">
            Menampilkan <span className="font-bold text-slate-600">{filteredLogs.length}</span> kejadian tervalidasi. Data ini terintegrasi langsung dengan database log operasional.
          </div>
        </div>

      </main>
    </div>
  );
};

export default AuditLog;