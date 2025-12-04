// src/App.js - CORRECTED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import TestAuth from './components/TestAuth';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Opticians from './pages/Opticians';
import Appointments from './pages/Appointments';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminOpticians from './pages/admin/Opticians';

function App() {
  return (
    <AuthProvider> {/* ✅ ADD THIS - WRAP EVERYTHING IN AuthProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/opticians" element={<Opticians />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test-auth" element={<TestAuth />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Navigate to="/admin/dashboard" />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/appointments" element={
                <ProtectedRoute adminOnly>
                  <AdminAppointments />
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute adminOnly>
                  <AdminServices />
                </ProtectedRoute>
              } />
              <Route path="/admin/opticians" element={
                <ProtectedRoute adminOnly>
                  <AdminOpticians />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider> 
  );
}

export default App;