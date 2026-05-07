import React from 'react';
import { useNavigate } from 'react-router-dom';

// Komponen ini menerima props dari react-toastify (closeToast) dan data anomali kita
const AlertNotification = ({ closeToast, locationBlock, flowRate, toastProps }) => {
  const navigate = useNavigate();

  const handleLihatDetail = () => {
    closeToast(); // Tutup pop-up
    navigate('/executive/infrastruktur'); // Arahkan ke halaman infrastruktur
  };

  return (
    <div className="flex flex-col bg-white font-sans w-full max-w-sm rounded-[1rem]">
      {/* Header Notifikasi */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center">
            {/* Ikon Tetesan Air Merah (Sesuai Mockup) */}
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.202 4.662 5.997 9.606 5.997 13.613 0 3.328-2.67 6.061-5.997 6.061-3.326 0-5.997-2.733-5.997-6.061 0-4.007 2.795-8.951 5.997-13.613z" />
            </svg>
          </div>
          <span className="text-sm font-extrabold text-slate-800">AquaMonitor</span>
        </div>
        <span className="text-xs font-medium text-slate-400">Baru saja</span>
      </div>

      {/* Konten Utama */}
      <div className="mb-4">
        <h4 className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1.5">
          Peringatan Kebocoran Air
        </h4>
        <p className="text-slate-600 text-sm font-medium leading-relaxed">
          {locationBlock ? `${locationBlock} · ` : 'Infrastruktur Asrama · '} 
          Debit anomali {flowRate ? `${flowRate} L/mnt ` : ''}terdeteksi. Ketuk untuk rincian.
        </p>
      </div>

      {/* Tombol Aksi (Sesuai Mockup) */}
      <div className="flex border-t border-slate-100 pt-3 mt-1">
        <button 
          onClick={handleLihatDetail}
          className="flex-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors border-r border-slate-100"
        >
          Lihat detail
        </button>
        <button 
          onClick={closeToast}
          className="flex-1 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;