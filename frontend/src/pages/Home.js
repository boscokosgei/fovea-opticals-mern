// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Fovea Optical <span className="text-blue-300">Ltd</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-blue-200">
              Bringing Vision to Life
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your premier destination for high-quality optical products and comprehensive 
              eye care services in Eldoret.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/book-appointment" 
                className="bg-white text-blue-800 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg"
              >
                Book an Appointment
              </Link>
              <Link 
                to="/services" 
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-blue-700">Fovea Optical Limited</span>
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    At <span className="font-bold text-blue-800">Fovea Optical Limited</span>, we are dedicated to enhancing your vision health. 
                    As a leading provider of optical solutions, we specialize in everything from 
                    prescription glasses and contact lenses to advanced eye examinations.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our mission is to deliver <span className="font-bold text-blue-800">cutting-edge, personalized optical care</span> that ensures 
                    clarity, comfort, and style for every individual.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-lg">
                  <div className="text-4xl mb-4">👁️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Optometrists</h3>
                  <p className="text-gray-600">Certified professionals with extensive experience</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-lg">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Equipment</h3>
                  <p className="text-gray-600">State-of-the-art diagnostic technology</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-lg">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Care</h3>
                  <p className="text-gray-600">Personalized attention for each patient</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-lg">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Service</h3>
                  <p className="text-gray-600">Excellence in every aspect of eye care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a complete range of eye care services to meet all your vision needs
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-2xl font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <span>Learn more</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Explore All Services</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Fovea Optical?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our commitment to excellence in eye care
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-2xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">5000+</div>
              <div className="text-xl font-semibold text-blue-200">Happy Customers</div>
              <div className="text-blue-300 mt-2">Satisfied with our services</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">15+</div>
              <div className="text-xl font-semibold text-blue-200">Years Experience</div>
              <div className="text-blue-300 mt-2">In optical industry</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">100%</div>
              <div className="text-xl font-semibold text-blue-200">Quality Assurance</div>
              <div className="text-blue-300 mt-2">Premium products guarantee</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">24/7</div>
              <div className="text-xl font-semibold text-blue-200">Support</div>
              <div className="text-blue-300 mt-2">Customer care available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Experience <span className="text-blue-200">Perfect Vision?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust Fovea Optical for their eye care needs. 
              Schedule your appointment today and take the first step towards clearer vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/book-appointment" 
                className="bg-white hover:bg-gray-100 text-blue-700 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg flex items-center"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Appointment Now
              </Link>
              
              <Link 
                to="/contact" 
                className="border-2 border-white hover:bg-white/10 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: 0719 530 732
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-blue-400/30">
              <p className="text-blue-200">
                📍 <span className="font-semibold">Location:</span> Eldoret Town, Kenya
              </p>
              <p className="text-blue-200 mt-2">
                ⏰ <span className="font-semibold">Hours:</span> Mon-Fri 8:00 AM - 7:00 PM, Sat 9:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Services data
const services = [
  {
    title: "Comprehensive Eye Exams",
    description: "State-of-the-art diagnostic technology for precise results. Advanced equipment for accurate vision assessment and eye health screening."
  },
  {
    title: "Prescription Glasses & Lenses",
    description: "A wide selection of high-quality frames and lenses from top international brands. Customized to your prescription and style preferences."
  },
  {
    title: "Contact Lenses",
    description: "Soft, rigid, and specialty lenses to suit your lifestyle. Professional fitting and follow-up care included."
  },
  {
    title: "Sunglasses",
    description: "UV protection paired with the latest stylish designs. Prescription sunglasses available for vision correction."
  },
  {
    title: "Children's Eye Care",
    description: "Specialized services tailored for our young patients. Early detection and management of vision problems in children."
  },
  {
    title: "Corporate Vision Care",
    description: "Customized eye screening programs for businesses. Group packages and corporate discounts available."
  }
];

// Benefits data
const benefits = [
  {
    title: "Expertise & Experience",
    description: "Our team of qualified optometrists brings years of industry knowledge and continuous training."
  },
  {
    title: "Premium Products",
    description: "We carry top eyewear brands like Ray-Ban, Oakley, and local favorites, all backed by warranty."
  },
  {
    title: "Customer-Centric Approach",
    description: "Personalized eye care solutions tailored just for you. We listen to understand your specific needs."
  },
  {
    title: "Affordable Pricing",
    description: "High-quality vision care that offers the best value. Flexible payment options available."
  },
  {
    title: "Advanced Technology",
    description: "Digital eye exam equipment for accurate diagnoses and precise prescriptions."
  },
  {
    title: "Wide Product Range",
    description: "From designer frames to budget-friendly options. Something for every style and budget."
  },
  {
    title: "Comprehensive After-Sales",
    description: "Free adjustments, maintenance, cleaning, and expert guidance throughout your journey with us."
  },
  {
    title: "Fast & Reliable Service",
    description: "Quick turnaround on exams and orders. Most prescriptions filled within 24 hours."
  },
  {
    title: "Family-Friendly Environment",
    description: "Comfortable, welcoming space for patients of all ages. Kids' corner and wheelchair accessible."
  }
];

export default Home;