// frontend/src/components/Header.js - COMPLETE FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // For mobile touch
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const toggleMobileMenu = () => {
    console.log('Mobile menu toggled:', !isMobileMenuOpen); // Debug log
    setIsMobileMenuOpen(prev => !prev);
  };

  const MenuLinks = ({ isMobile = false }) => (
    <>
      <Link 
        to="/" 
        className={`${isMobile ? 'block py-3 border-b' : 'text-gray-600 hover:text-blue-600'} transition duration-300 font-medium`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link 
        to="/services" 
        className={`${isMobile ? 'block py-3 border-b' : 'text-gray-600 hover:text-blue-600'} transition duration-300 font-medium`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Services
      </Link>
      <Link 
        to="/opticians" 
        className={`${isMobile ? 'block py-3 border-b' : 'text-gray-600 hover:text-blue-600'} transition duration-300 font-medium`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Our Opticians
      </Link>
      
      {isAuthenticated && isAdmin && (
        <Link 
          to="/admin/dashboard" 
          className={`${isMobile ? 'block py-3 border-b' : 'text-gray-600 hover:text-blue-600'} transition duration-300 font-medium`}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50" ref={menuRef}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Fovea Optical
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <MenuLinks />
            
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

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-gray-600 p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 overflow-y-auto">
              <div className="p-6 pt-20">
                <nav className="space-y-1">
                  <MenuLinks isMobile={true} />
                  
                  <div className="pt-6 border-t mt-4">
                    {isAuthenticated ? (
                      <>
                        <div className="py-3 text-gray-600 border-b">
                          Welcome, <span className="font-semibold">{user?.name}</span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left py-3 text-red-600 font-medium border-b"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login" 
                          className="block py-3 border-b font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link 
                          to="/appointments" 
                          className="block py-3 border-b font-medium text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Book Appointment
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;