// frontend/src/App.js - FINAL CORRECTED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import TestAuth from './components/TestAuth';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Opticians from './pages/Opticians';
import BookAppointment from './pages/Appointments';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
//import AdminAppointments from './pages/admin/AppointmentsManager';
import AdminServices from './pages/admin/ServicesManager'; // FIXED: Changed from ServiceManager
import AdminOpticians from './pages/admin/OpticiansManager';
import { AdminProvider } from './context/AdminContext'
import AppointmentsManager from './pages/admin/AppointmentsManager';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AdminProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow animate-fadeIn">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/opticians" element={<Opticians />} />
                <Route path="/appointments" element=  {
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/*" element={
                  <ProtectedRoute adminOnly>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/appointments" element={
                  <ProtectedRoute adminOnly>
                    <AppointmentsManager />
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
          </AdminProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;