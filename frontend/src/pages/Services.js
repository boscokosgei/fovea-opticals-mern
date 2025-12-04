// src/pages/Services.js
import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Comprehensive Eye Exams",
      description: "Using state-of-the-art diagnostic technology for precise results.",
      details: [
        "Digital retinal imaging",
        "Visual field testing",
        "Prescription assessment",
        "Eye health screening"
      ]
    },
    {
      title: "Prescription Glasses & Lenses",
      description: "A wide selection of high-quality frames and lenses.",
      details: [
        "Single vision lenses",
        "Bifocal/Progressive lenses",
        "Blue light filtering",
        "Anti-reflective coating"
      ]
    },
    // Add other services...
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Comprehensive eye care services tailored to meet all your vision needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{service.title}</h3>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;