// frontend/src/pages/admin/ServicesManager.js
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const ServicesManager = () => {
  const { services, loading, fetchServices, createService, updateService, deleteService } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'eye-exams',
    duration: '',
    price: '',
    features: [],
    icon: '👁️',
    isActive: true
  });

  const categories = [
    { id: 'eye-exams', name: 'Eye Exams', icon: '👁️' },
    { id: 'glasses', name: 'Glasses & Lenses', icon: '👓' },
    { id: 'contacts', name: 'Contact Lenses', icon: '💫' },
    { id: 'children', name: "Children's Eye Care", icon: '🧒' },
    { id: 'corporate', name: 'Corporate Care', icon: '🏢' },
    { id: 'surgery', name: 'Eye Surgery', icon: '🔬' }
  ];

  const durations = ['30 min', '45 min', '60 min', '90 min', '120 min'];

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureAdd = (feature) => {
    if (feature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const serviceData = {
      ...formData,
      price: parseInt(formData.price) || 0
    };

    let result;
    if (editingService) {
      result = await updateService(editingService._id, serviceData);
    } else {
      result = await createService(serviceData);
    }

    if (result.success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      category: service.category || 'eye-exams',
      duration: service.duration || '',
      price: service.price || '',
      features: service.features || [],
      icon: service.icon || '👁️',
      isActive: service.isActive !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteService(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'eye-exams',
      duration: '',
      price: '',
      features: [],
      icon: '👁️',
      isActive: true
    });
    setEditingService(null);
  };

  const filteredServices = services.filter(service =>
    service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
          <p className="text-gray-600 mt-1">Add, edit, or remove services offered</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search services..."
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
            + Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <span className="text-6xl">{service.icon || '👁️'}</span>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Category:</span>
                    <span className="font-medium">
                      {categories.find(c => c.id === service.category)?.name || service.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Price:</span>
                    <span className="font-bold text-blue-600">KES {service.price}</span>
                  </div>
                </div>

                {service.features?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <div className="space-y-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{service.features.length - 3} more features
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
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
                  {editingService ? 'Edit Service' : 'Add New Service'}
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Comprehensive Eye Exam"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed description of the service..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select duration</option>
                      {durations.map(dur => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="👁️">Eye 👁️</option>
                      <option value="👓">Glasses 👓</option>
                      <option value="💫">Contacts 💫</option>
                      <option value="🔬">Surgery 🔬</option>
                      <option value="👶">Children 👶</option>
                      <option value="🏢">Corporate 🏢</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-4 py-2 bg-gray-50 rounded-lg">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleFeatureRemove(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a feature..."
                        id="newFeature"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFeatureAdd(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = document.getElementById('newFeature');
                          handleFeatureAdd(input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Service is active and visible to customers
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingService ? 'Update Service' : 'Add Service'}
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

export default ServicesManager;