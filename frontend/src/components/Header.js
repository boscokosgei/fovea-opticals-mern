// frontend/src/components/Header.js - Updated with auth
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Fovea Optical
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">
              Home
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">
              Services
            </Link>
            <Link to="/opticians" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">
              Our Opticians
            </Link>
            
            {isAuthenticated && isAdmin && (
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/appointments" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;