// frontend/src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import OpticiansManager from './OpticiansManager';
import ServicesManager from './ServicesManager';
import AppointmentsManager from './AppointmentsManager';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, fetchStats } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'opticians', name: 'Opticians', icon: '👨‍⚕️' },
    { id: 'services', name: 'Services', icon: '💼' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'patients', name: 'Patients', icon: '👥' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">Here's what's happening with your practice today.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-sm">Last updated</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Opticians" value={stats.totalOpticians} icon="👨‍⚕️" color="blue" trend={5} />
              <StatCard title="Total Services" value={stats.totalServices} icon="💼" color="green" trend={2} />
              <StatCard title="Appointments" value={stats.totalAppointments} icon="📅" color="purple" trend={-3} />
              <StatCard title="Active Patients" value={stats.totalPatients} icon="👥" color="yellow" trend={8} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Appointments Overview</h2>
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">New appointment booked</p>
                          <p className="text-sm text-gray-500">10 minutes ago</p>
                        </div>
                      </div>
                      <span className="text-blue-600 cursor-pointer hover:underline">View</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="text-2xl block mb-2">👨‍⚕️</span>
                  <span className="text-sm font-medium">Add Optician</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="text-2xl block mb-2">💼</span>
                  <span className="text-sm font-medium">Add Service</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="text-2xl block mb-2">📊</span>
                  <span className="text-sm font-medium">Generate Report</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="text-2xl block mb-2">⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opticians' && <OpticiansManager />}
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'appointments' && <AppointmentsManager />}
      </div>
    </div>
  );
};

export default Dashboard;