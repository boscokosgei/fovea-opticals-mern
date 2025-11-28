// backend/src/seed.js
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Optician = require('./models/Optician');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Service.deleteMany({});
    await Optician.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert services
    console.log('📝 Creating services...');
    const services = await Service.insertMany([
      {
        name: 'Comprehensive Eye Exam',
        description: 'Complete vision assessment including refraction, eye health evaluation, and prescription update.',
        duration: 60,
        price: 120
      },
      {
        name: 'Contact Lens Fitting',
        description: 'Professional fitting and training for new contact lens wearers.',
        duration: 45,
        price: 80
      },
      {
        name: 'Pediatric Vision Screening',
        description: 'Specialized eye examination for children to detect vision problems early.',
        duration: 30,
        price: 90
      },
      {
        name: 'Glaucoma Screening',
        description: 'Advanced testing to detect early signs of glaucoma.',
        duration: 45,
        price: 100
      },
      {
        name: 'Diabetic Eye Exam',
        description: 'Comprehensive examination for patients with diabetes to monitor eye health.',
        duration: 45,
        price: 110
      }
    ]);
    console.log(`✅ Seeded ${services.length} services`);

    // Insert opticians
    console.log('👓 Creating opticians...');
    const opticians = await Optician.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Pediatric Optometry',
        bio: 'With over 10 years of experience in pediatric eye care, Dr. Johnson specializes in children\'s vision development and myopia control.',
        imageUrl: '/images/opticians/dr-sarah.jpg',
        experience: 10,
        available: true
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Contact Lenses',
        bio: 'Dr. Chen is an expert in fitting specialty contact lenses and managing complex corneal conditions.',
        imageUrl: '/images/opticians/dr-chen.jpg',
        experience: 8,
        available: true
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Ocular Disease',
        bio: 'Specializing in the diagnosis and management of ocular diseases including glaucoma and macular degeneration.',
        imageUrl: '/images/opticians/dr-rodriguez.jpg',
        experience: 12,
        available: true
      }
    ]);
    console.log(`✅ Seeded ${opticians.length} opticians`);

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();