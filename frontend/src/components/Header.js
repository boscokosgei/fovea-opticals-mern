// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Fovea Opticals
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
            <Link 
              to="/appointments" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              Book Appointment
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;