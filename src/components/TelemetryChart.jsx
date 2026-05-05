import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const TelemetryChart = ({ data, viewMode }) => {
  const chartData = data.map(item => {
    const timeString = item.timeISO 
      ? new Date(item.timeISO).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : item.time; 
      
    return {
      ...item,
      displayTime: timeString
    };
  });

  let nodeKeys = [];
  if (viewMode === 'semua') {
    const keysSet = new Set();
    chartData.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'time' && k !== 'timeISO' && k !== 'displayTime' && k !== 'debit') {
          keysSet.add(k);
        }
      });
    });
    nodeKeys = Array.from(keysSet);
  } else {
    nodeKeys = ['debit']; 
  }

  // Palet warna yang sedikit lebih pastel/modern menyesuaikan referensi
  const colors = ['#4379F2', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'];

  return (
    <div style={{ width: '100%', height: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
          
          {/* Definisi Gradasi Warna untuk Area Bawah Grafik */}
          <defs>
            {nodeKeys.map((key, index) => (
              <linearGradient key={`color-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>

          {/* Grid dibikin sangat samar hanya garis horizontal */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          
          <XAxis 
            dataKey="displayTime" 
            stroke="#94A3B8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={15}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            unit="L" 
          />
          
          {/* Tooltip Gelap ala Referensi UI */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0F172A', 
              borderRadius: '12px', 
              border: 'none', 
              color: '#F8FAFC',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            itemStyle={{ color: '#E2E8F0' }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748B' }}/>
          
          {nodeKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={viewMode === 'semua' ? `Blok: ${key}` : 'Laju Aliran'}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${key})`}
              dot={{ r: 0 }} // Menghilangkan titik agar mulus seperti referensi
              activeDot={{ r: 6, strokeWidth: 0, fill: colors[index % colors.length] }}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;