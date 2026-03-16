// frontend/src/pages/admin/AppointmentsManager.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { format } from 'date-fns';

const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add missing error state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching appointments from:', `${API_URL}/appointments`);
      
      const response = await fetch(`${API_URL}/appointments`);

      console.log('📥 Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('✅ Appointments fetched:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  // SINGLE filtering function that returns an array
  const getFilteredAppointments = () => {
    let filtered = appointments;

    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.optician?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredAppointments = getFilteredAppointments(); // This is an ARRAY

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Appointments</h2>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold text-blue-600">{appointments.length}</span> appointments
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchAppointments}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchAppointments}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No appointments found</p>
          <p className="text-gray-400 mt-2">Appointments will appear here when patients book</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{apt.patientName}</div>
                    <div className="text-sm text-gray-500">{apt.patientEmail}</div>
                    <div className="text-xs text-gray-400">{apt.patientPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{apt.service?.name || 'Unknown Service'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{apt.optician?.name || 'Not assigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {apt.date ? format(new Date(apt.date), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(apt.status)}`}>
                      {apt.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <select
                      onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                      value={apt.status}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManager;