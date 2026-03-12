// frontend/src/pages/Services.js - DYNAMIC VERSION
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const { data: services, loading, error, refetch } = useServices();
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [filter, setFilter] = useState('all');

  // Categories for filtering
  const categories = ['all', 'eye-exams', 'glasses', 'contacts', 'children', 'corporate'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading our services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredServices = filter === 'all' 
    ? services 
    : services?.filter(s => s.category === filter) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive eye care services tailored to meet all your vision needs
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
              }`}
            >
              {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <div 
              key={service.id || index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{service.icon || '👁️'}</span>
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-blue-600">
                  {service.duration || '60 min'}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="space-y-3 mb-6">
                  {service.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    KES {service.price || 'Contact us'}
                  </span>
                  <Link
                    to={isAuthenticated ? '/appointments' : '/login'}
                    state={{ selectedService: service }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedService.name}</h2>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-4">{selectedService.fullDescription || selectedService.description}</p>
                
                <h3 className="text-xl font-bold mb-2">What's included:</h3>
                <ul className="list-disc pl-6 mb-4">
                  {selectedService.details?.map((detail, idx) => (
                    <li key={idx} className="text-gray-600 mb-1">{detail}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold mb-2">Duration:</h3>
                <p className="text-gray-600 mb-4">{selectedService.duration || '60 minutes'}</p>

                <h3 className="text-xl font-bold mb-2">Price:</h3>
                <p className="text-2xl font-bold text-blue-600 mb-6">KES {selectedService.price || 'Contact for pricing'}</p>

                <div className="flex gap-4">
                  <Link
                    to={isAuthenticated ? '/appointments' : '/login'}
                    state={{ selectedService }}
                    className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </Link>
                  <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                    Contact for Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;