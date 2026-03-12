// frontend/src/pages/admin/OpticiansManager.js
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const OpticiansManager = () => {
  const { opticians, loading, fetchOpticians, createOptician, updateOptician, deleteOptician } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingOptician, setEditingOptician] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    bio: '',
    image: '',
    availableDays: [],
    consultationFee: ''
  });

  const specializations = [
    'Pediatric Optometry',
    'Contact Lenses',
    'Low Vision',
    'Ocular Disease',
    'Vision Therapy',
    'Geriatric Optometry',
    'Sports Vision',
    'Neuro-Optometry'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchOpticians();
  }, [fetchOpticians]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const opticianData = {
      ...formData,
      consultationFee: parseInt(formData.consultationFee) || 0
    };

    let result;
    if (editingOptician) {
      result = await updateOptician(editingOptician._id, opticianData);
    } else {
      result = await createOptician(opticianData);
    }

    if (result.success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleEdit = (optician) => {
    setEditingOptician(optician);
    setFormData({
      name: optician.name || '',
      email: optician.email || '',
      phone: optician.phone || '',
      specialization: optician.specialization || '',
      experience: optician.experience || '',
      qualification: optician.qualification || '',
      bio: optician.bio || '',
      image: optician.image || '',
      availableDays: optician.availableDays || [],
      consultationFee: optician.consultationFee || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteOptician(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      qualification: '',
      bio: '',
      image: '',
      availableDays: [],
      consultationFee: ''
    });
    setEditingOptician(null);
  };

  const filteredOpticians = opticians.filter(optician =>
    optician.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    optician.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Opticians</h2>
          <p className="text-gray-600 mt-1">Add, edit, or remove opticians from your practice</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search opticians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 sm:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Add Optician
          </button>
        </div>
      </div>

      {/* Opticians Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opticians...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpticians.map(optician => (
            <div key={optician._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                {optician.image ? (
                  <img src={optician.image} alt={optician.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl text-white">👨‍⚕️</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{optician.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{optician.specialization}</p>
                <p className="text-sm text-gray-600 mb-3">{optician.experience} experience</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Phone:</span>
                    <span className="font-medium">{optician.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Email:</span>
                    <span className="font-medium truncate">{optician.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Fee:</span>
                    <span className="font-medium">KES {optician.consultationFee || 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(optician)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(optician._id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingOptician ? 'Edit Optician' : 'Add New Optician'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 years"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., PhD, MSc"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (KES)
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description about the optician..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.availableDays.includes(day)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingOptician ? 'Update Optician' : 'Add Optician'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpticiansManager;