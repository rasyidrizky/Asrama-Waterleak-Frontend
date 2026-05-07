import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Infrastructure from './pages/Infrastructure';
import AuditLog from './pages/AuditLog';
// Pastikan Anda sudah membuat komponen untuk Pengelola ini
import ExecutiveDashboard from './pages/ExecutiveDashboard'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTE PUBLIK */}
        <Route path="/login" element={<Login />} />

        {/* ========================================= */}
        {/* RUTE PRIVAT - KHUSUS PENGELOLA (EXECUTIVE) */}
        {/* ========================================= */}
        <Route
          path="/executive"
          element={
            <ProtectedRoute allowedRole="Pengelola">
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />

        {/* ========================================= */}
        {/* RUTE PRIVAT - KHUSUS TEKNISI */}
        {/* ========================================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="Teknisi">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/infrastruktur"
          element={
            <ProtectedRoute allowedRole="Teknisi">
              <Infrastructure />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit"
          element={
            <ProtectedRoute allowedRole="Teknisi">
              <AuditLog />
            </ProtectedRoute>
          }
        />

        {/* CATCH-ALL ROUTE: Lempar kembali ke akar (root) jika URL tidak valid. 
            ProtectedRoute akan otomatis mengarahkan sesuai role user. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;