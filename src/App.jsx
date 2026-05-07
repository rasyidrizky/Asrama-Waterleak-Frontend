import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Infrastructure from './pages/Infrastructure';
import AuditLog from './pages/AuditLog';
import ExecutiveDashboard from './pages/ExecutiveDashboard'; 
import ExecutiveInfrastructure from './pages/ExecutiveInfrastructure';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/executive"
          element={
            <ProtectedRoute allowedRole="Pengelola">
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/executive/infrastruktur"
          element={
            <ProtectedRoute allowedRole="Pengelola">
              <ExecutiveInfrastructure />
            </ProtectedRoute>
          }
        />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;