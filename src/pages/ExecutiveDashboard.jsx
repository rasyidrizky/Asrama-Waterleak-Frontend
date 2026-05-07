import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExecutiveDashboard = () => {
  const [summary, setSummary] = useState({
    total_infrastruktur: 0,
    infrastruktur_aktif: 0,
    kebocoran_saat_ini: 0,
    status_kesehatan: "Memuat..."
  });

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('supabaseToken');
      const response = await axios.get('https://backend-anda.fly.dev/api/web/executive/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newData = response.data.data;
      
      // Logika Notifikasi (Trigger jika jumlah anomali / kebocoran bertambah)
      if (newData.kebocoran_saat_ini > summary.kebocoran_saat_ini && summary.kebocoran_saat_ini !== 0) {
          toast.error(`🚨 Peringatan Darurat! Terdeteksi ${newData.kebocoran_saat_ini} kebocoran aktif. Teknisi telah disiagakan.`, {
              position: "top-right",
              autoClose: false, // Jangan tutup otomatis agar pengelola pasti membaca
              theme: "colored",
          });
      }

      setSummary(newData);
    } catch (error) {
      console.error("Gagal menarik data eksekutif", error);
    }
  };

  // Polling data setiap 10 detik (sebagai pengganti Push Notification FCM)
  useEffect(() => {
    fetchSummary(); // Tarik awal
    const interval = setInterval(fetchSummary, 10000); 
    return () => clearInterval(interval);
  }, [summary.kebocoran_saat_ini]); // Dependency agar perbandingan data sebelumnya valid

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Executive Overview</h1>
      <p className="text-gray-500 mb-8">Ringkasan kondisi distribusi air UPT Asrama secara real-time.</p>

      {/* Grid Minimalist SaaS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Status Kesehatan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Status Infrastruktur</h3>
          <span className={`text-2xl font-bold px-4 py-1 rounded-full ${summary.status_kesehatan === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {summary.status_kesehatan}
          </span>
        </div>

        {/* Card 2: Jumlah Kebocoran */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-50">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Insiden Aktif (Kebocoran)</h3>
          <p className="text-4xl font-extrabold text-red-600">{summary.kebocoran_saat_ini}</p>
        </div>

        {/* Card 3: Node Aktif */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Sensor Aktif</h3>
          <p className="text-4xl font-extrabold text-gray-800">
            {summary.infrastruktur_aktif} <span className="text-lg text-gray-400 font-normal">/ {summary.total_infrastruktur} Node</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ExecutiveDashboard;