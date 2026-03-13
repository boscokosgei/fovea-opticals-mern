// frontend/src/pages/admin/OpticiansManager.js - UPDATED
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const OpticiansManager = () => {
  const { opticians, loading, fetchOpticians, createOptician, updateOptician, deleteOptician } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingOptician, setEditingOptician] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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

  // Fetch opticians when component mounts
  useEffect(() => {
    console.log('📋 Fetching opticians...');
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
      setSelectedFile(file);
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
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'availableDays') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'image') {
          submitData.append(key, formData[key]?.toString() || '');
        }
      });

      if (selectedFile) {
        submitData.append('image', selectedFile);
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
        
        // CRITICAL: Fetch opticians again to update the list
        console.log('🔄 Refreshing opticians list after successful operation');
        await fetchOpticians(); // This will update the list immediately
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

  const handleDelete = async (id) => {
    const result = await deleteOptician(id);
    if (result.success) {
      // Refresh list after delete
      fetchOpticians();
    }
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

  // Filter opticians based on search
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
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold text-blue-600">{opticians.length}</span> opticians
          </p>
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
                  <img 
                    src={optician.image} 
                    alt={optician.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
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

      {/* If no opticians found */}
      {!loading && filteredOpticians.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No opticians found</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add your first optician
          </button>
        </div>
      )}

      {/* Modal - Your existing modal code */}
      {/* ... */}
    </div>
  );
};

export default OpticiansManager;