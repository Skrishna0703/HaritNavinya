import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SoilTestingCenter from './src/models/SoilTestingCenter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please set MONGODB_URI in your .env file');
  process.exit(1);
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Load JSON data
    const jsonPath = path.join(__dirname, 'soil-testing-centers.json');
    console.log(`📂 Loading JSON data from: ${jsonPath}`);
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ JSON file not found at: ${jsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(rawData);
    console.log(`✅ Loaded ${jsonData.length} centers from JSON\n`);

    // Transform data for MongoDB
    console.log('🔄 Transforming data...');
    const transformedData = jsonData.map((center, index) => {
      // Parse state and district from combined format
      let district = 'Unknown';
      let state = 'Unknown';
      
      const combinedText = center.district || center.state || '';
      const parts = combinedText.split(',').map((s) => s.trim()).filter((s) => s);
      
      if (parts.length === 2) {
        district = parts[0];
        state = parts[1];
      } else if (parts.length === 1) {
        state = parts[0];
        district = center.name?.split(' ')[0] || 'Unknown';
      }

      // Generate mock coordinates based on state
      const stateCoordinates = {
        'ARUNACHAL PRADESH': { lat: 28.2180, lng: 94.7278 },
        'ASSAM': { lat: 26.1445, lng: 91.7362 },
        'BIHAR': { lat: 25.0961, lng: 85.3131 },
        'CHHATTISGARH': { lat: 21.2787, lng: 81.8661 },
        'GOA': { lat: 15.2993, lng: 73.8243 },
        'GUJARAT': { lat: 22.2587, lng: 71.1924 },
        'HARYANA': { lat: 29.0588, lng: 77.0745 },
        'HIMACHAL PRADESH': { lat: 31.7433, lng: 77.1205 },
        'JHARKHAND': { lat: 23.6102, lng: 85.2799 },
        'KARNATAKA': { lat: 15.3173, lng: 75.7139 },
        'KERALA': { lat: 10.8505, lng: 76.2711 },
        'MADHYA PRADESH': { lat: 22.9375, lng: 78.6553 },
        'MAHARASHTRA': { lat: 19.7515, lng: 75.7139 },
        'MANIPUR': { lat: 24.6637, lng: 93.9063 },
        'MEGHALAYA': { lat: 25.4670, lng: 91.3662 },
        'MIZORAM': { lat: 23.1815, lng: 92.9789 },
        'NAGALAND': { lat: 26.1584, lng: 94.5624 },
        'ODISHA': { lat: 20.9517, lng: 85.0985 },
        'PUNJAB': { lat: 31.5497, lng: 74.3436 },
        'RAJASTHAN': { lat: 27.0238, lng: 74.2179 },
        'SIKKIM': { lat: 27.5330, lng: 88.5122 },
        'TAMIL NADU': { lat: 11.1271, lng: 78.6569 },
        'TELANGANA': { lat: 18.1124, lng: 79.0193 },
        'TRIPURA': { lat: 23.9408, lng: 91.9882 },
        'UTTAR PRADESH': { lat: 26.8467, lng: 80.9462 },
        'UTTARAKHAND': { lat: 30.0668, lng: 79.0193 },
        'WEST BENGAL': { lat: 24.8735, lng: 88.3063 }
      };
      
      const coords = stateCoordinates[state] || { lat: 20.5934, lng: 78.9629 };
      const latitude = coords.lat + (Math.random() - 0.5) * 0.5;
      const longitude = coords.lng + (Math.random() - 0.5) * 0.5;

      return {
        name: center.name || 'Unknown Laboratory',
        district: district,
        state: state,
        address: center.address || 'Address not available',
        pincode: center.pincode || 'N/A',
        phone: center.phone || 'N/A',
        email: center.email || 'N/A',
        latitude: latitude,
        longitude: longitude,
        rating: 4.5 + Math.random() * 0.5,
        services: [
          'Soil pH Testing',
          'Nutrient Testing',
          'Organic Matter Analysis',
          'Heavy Metal Testing'
        ]
      };
    });

    // Clear existing data
    console.log('🗑️  Clearing existing data from MongoDB...');
    await SoilTestingCenter.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed database
    console.log('💾 Seeding database with testing centers...');
    const result = await SoilTestingCenter.insertMany(transformedData);
    console.log(`✅ Successfully inserted ${result.length} testing centers\n`);

    // Display statistics
    console.log('📊 Database Statistics:');
    const stats = await SoilTestingCenter.aggregate([
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    stats.forEach((stat) => {
      console.log(`  • ${stat._id}: ${stat.count} centers`);
    });

    console.log(`\n✅ Database seeding completed successfully!\n`);
    console.log('📝 You can now use the Testing Centers API:');
    console.log('   • GET /api/testing-centers');
    console.log('   • GET /api/testing-centers/states');
    console.log('   • GET /api/testing-centers/state?state=Maharashtra');
    console.log('   • GET /api/testing-centers/location?state=Maharashtra&district=Mumbai');
    console.log('   • GET /api/testing-centers/search?q=laboratory');
    console.log('   • GET /api/testing-centers/:id\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('\nStack trace:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
