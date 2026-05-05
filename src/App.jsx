import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Infrastructure from './pages/Infrastructure';
import AuditLog from './pages/AuditLog';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTE PUBLIK */}
        <Route path="/login" element={<Login />} />

        {/* RUTE PRIVAT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/infrastruktur"
          element={
            <ProtectedRoute>
              <Infrastructure />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <AuditLog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;