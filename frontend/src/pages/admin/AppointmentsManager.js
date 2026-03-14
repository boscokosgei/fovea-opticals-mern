// frontend/src/pages/admin/AppointmentsManager.js
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { format } from 'date-fns';

const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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

  const filterAppointments = () => {
    let filtered = appointments;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status === filter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const filteredAppointments = filterAppointments();

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
            <option value="upcoming">Upcoming</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{apt.service}</div>
                    <div className="text-xs text-gray-500">Dr. {apt.optician}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{format(new Date(apt.date), 'MMM dd, yyyy')}</div>
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
                      className="text-sm border rounded px-2 py-1"
                      defaultValue={apt.status}
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

      {/* Empty State */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No appointments found</p>
          <p className="text-gray-400 mt-2">Appointments will appear here when patients book</p>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Appointment Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedAppointment.patientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedAppointment.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Optician</p>
                    <p className="font-medium">{selectedAppointment.optician || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{format(new Date(selectedAppointment.date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedAppointment.status)}`}>
                      {selectedAppointment.status || 'pending'}
                    </span>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="mt-1 p-3 bg-gray-50 rounded">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment._id, 'confirmed')}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment._id, 'completed')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Cancel
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

export default AppointmentsManager;