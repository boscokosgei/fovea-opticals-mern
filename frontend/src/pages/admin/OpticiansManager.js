// frontend/src/pages/admin/OpticiansManager.js - WITH IMAGE UPLOAD
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const OpticiansManager = () => {
  const { opticians, loading, fetchOpticians, createOptician, updateOptician, deleteOptician } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingOptician, setEditingOptician] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'availableDays') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'image') { // Skip image field if we're uploading file
          submitData.append(key, formData[key]?.toString() || '');
        }
      });

      // Append file if selected
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }else if (formData.image && !editingOptician) {
      // If there's an image URL from editing, include it
      submitData.append('image', formData.image);
      }
      // Debug: Log FormData contents
      console.log('📤 Submitting FormData:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let result;
      if (editingOptician) {
        result = await updateOptician(editingOptician._id, submitData);
      } else {
        result = await createOptician(submitData);
      }

      if (result.success) {
        setShowModal(false);
        resetForm();
        fetchOpticians();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
    setPreviewUrl(optician.image || '');
    setShowModal(true);
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
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingOptician(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header - same as before */}
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

      {/* Modal with File Upload */}
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

              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                {/* Image Upload Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-6">
                    {/* Image Preview */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-3xl">👤</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors inline-block"
                      >
                        Choose Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Max file size: 5MB. Supported: JPG, PNG, GIF, WEBP
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rest of your form fields - same as before */}
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

                  <div className="md:col-span-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (KES)
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
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