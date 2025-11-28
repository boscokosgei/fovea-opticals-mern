require('dotenv').config();
const mongoose = require('mongoose');
const Optician = require('./src/models/Optician');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkOpticians() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await Optician.countDocuments();
    console.log(`📊 Number of opticians in database: ${count}`);
    
    if (count === 0) {
      console.log('❌ No opticians found in database');
      console.log('💡 Running opticians seed...');
      
      // Insert opticians directly
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
      
      console.log(`✅ Added ${opticians.length} opticians to database`);
    } else {
      const allOpticians = await Optician.find();
      console.log('👓 Current opticians:');
      allOpticians.forEach(optician => {
        console.log(`  - ${optician.name} (${optician.specialty})`);
      });
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkOpticians();