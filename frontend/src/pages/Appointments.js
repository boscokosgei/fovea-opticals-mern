// src/pages/BookAppointment.js - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [opticians, setOpticians] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date: '',
    time: '',
    service: '',
    optician: '',
    notes: ''
  });

  // Fetch services when component mounts
  useEffect(() => {
    console.log('🔄 BookAppointment mounted, fetching data...');
    fetchServices();
    fetchOpticians();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('📡 Fetching services from API...');
      
      // Get API URL from environment or use default
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const url = `${API_URL}/services`;
      console.log('🔗 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Services fetched:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
        setFetchError('');
      } else {
        console.log('⚠️ No services found in database');
        setFetchError('No services available. Please contact admin.');
        // Set empty array to prevent undefined errors
        setServices([]);
      }
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      setFetchError('Failed to load services. Please try again later.');
      setServices([]);
    }
  };

  const fetchOpticians = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/opticians`);
      
      if (response.ok) {
        const data = await response.json();
        setOpticians(data);
      }
    } catch (error) {
      console.error('Error fetching opticians:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('📝 Submitting appointment:', formData);

    try {
      const appointmentData = {
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        service: formData.service,
        optician: formData.optician || null,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending'
      };

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Appointment booked successfully! We will contact you shortly.');
        navigate('/');
      } else {
        alert('❌ Error: ' + (data.error || 'Failed to book appointment'));
      }
    } catch (error) {
      console.error('❌ Error booking appointment:', error);
      alert('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Book an Appointment</h1>
        
        {fetchError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            {fetchError}
          </div>
        )}
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Service *</label>
                <select
                  name="service"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.service}
                  onChange={handleChange}
                  disabled={services.length === 0}
                >
                  <option value="">
                    {services.length === 0 ? 'No services available' : 'Select a service'}
                  </option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.name} - KES {service.price} ({service.duration} min)
                    </option>
                  ))}
                </select>
                {services.length === 0 && !fetchError && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading services...
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Preferred Optician (Optional)</label>
                <select
                  name="optician"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.optician}
                  onChange={handleChange}
                >
                  <option value="">Any available optician</option>
                  {opticians.map(opt => (
                    <option key={opt._id} value={opt._id}>
                      Dr. {opt.name} - {opt.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Preferred Time *</label>
                <select
                  name="time"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="notes"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific concerns or requirements..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || services.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : services.length === 0 ? 'No Services Available' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;