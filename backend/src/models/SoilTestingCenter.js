import mongoose from 'mongoose';

const soilTestingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  district: {
    type: String,
    required: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  pincode: {
    type: String,
    required: false
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  services: {
    type: [String],
    default: [
      'Soil pH Testing',
      'Nutrient Testing',
      'Organic Matter Analysis',
      'Heavy Metal Testing'
    ]
  },
  operatingHours: {
    open: {
      type: String,
      default: '09:00 AM'
    },
    close: {
      type: String,
      default: '05:00 PM'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index for better query performance
soilTestingCenterSchema.index({ state: 1, district: 1 });

export default mongoose.model('SoilTestingCenter', soilTestingCenterSchema);
