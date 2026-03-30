import mongoose from 'mongoose';

/**
 * Soil Fertility Data Schema - Cycle II
 * Based on Soil Health Card Scheme (India)
 */
const soilSchema = new mongoose.Schema(
  {
    // Location Information
    state: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    block: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true
    },
    
    // Nutrient Data
    nutrients: {
      nitrogen: {
        value: {
          type: Number,
          min: 0,
          max: 1000
        },
        category: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        },
        unit: { type: String, default: 'mg/kg' }
      },
      phosphorus: {
        value: {
          type: Number,
          min: 0,
          max: 500
        },
        category: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        },
        unit: { type: String, default: 'mg/kg' }
      },
      potassium: {
        value: {
          type: Number,
          min: 0,
          max: 1000
        },
        category: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        },
        unit: { type: String, default: 'mg/kg' }
      },
      organicCarbon: {
        value: {
          type: Number,
          min: 0,
          max: 20
        },
        category: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        },
        unit: { type: String, default: '%' }
      },
      pH: {
        value: {
          type: Number,
          min: 0,
          max: 14
        },
        category: {
          type: String,
          enum: ['Acidic', 'Neutral', 'Alkaline'],
          default: 'Neutral'
        },
        unit: { type: String, default: 'pH' }
      },
      electricalConductivity: {
        value: {
          type: Number,
          min: 0
        },
        unit: { type: String, default: 'dS/m' }
      }
    },
    
    // Soil Metrics
    fertilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    
    overallCategory: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    
    // Cycle Information
    cycle: {
      type: String,
      enum: ['Cycle-I', 'Cycle-II', 'Cycle-III'],
      default: 'Cycle-II'
    },
    
    // Data Source
    source: {
      provider: { type: String, default: 'SoilHealthCard-DAC' },
      apiUrl: { type: String },
      fetchedAt: { type: Date },
      dataUrl: { type: String }
    },
    
    // Metadata
    status: {
      type: String,
      enum: ['active', 'archived', 'pending'],
      default: 'active'
    },
    
    version: {
      type: Number,
      default: 1
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'soil_fertility_data'
  }
);

// Compound Index for efficient queries
soilSchema.index({ state: 1, district: 1 });
soilSchema.index({ state: 1, 'nutrients.nitrogen.category': 1 });
soilSchema.index({ lastUpdated: -1 });

/**
 * Pre-save middleware to calculate fertility score
 */
soilSchema.pre('save', function (next) {
  try {
    const n = this.nutrients.nitrogen.value || 0;
    const p = this.nutrients.phosphorus.value || 0;
    const k = this.nutrients.potassium.value || 0;

    // Normalize values to 0-100 scale
    const normalizedN = Math.min((n / 300) * 100, 100);
    const normalizedP = Math.min((p / 100) * 100, 100);
    const normalizedK = Math.min((k / 300) * 100, 100);

    // Calculate average fertility score (NPK)
    this.fertilityScore = Math.round((normalizedN + normalizedP + normalizedK) / 3);

    // Determine overall category
    if (this.fertilityScore >= 70) {
      this.overallCategory = 'High';
    } else if (this.fertilityScore >= 40) {
      this.overallCategory = 'Medium';
    } else {
      this.overallCategory = 'Low';
    }

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to get soil recommendations
 */
soilSchema.methods.getRecommendations = function () {
  const recommendations = [];

  // Nitrogen recommendations
  if (this.nutrients.nitrogen.category === 'Low') {
    recommendations.push({
      nutrient: 'Nitrogen',
      issue: `Low nitrogen level (${this.nutrients.nitrogen.value} mg/kg)`,
      recommendation: 'Add Urea (46% N) or Ammonium Nitrate',
      dosage: 'Apply 100-150 kg urea per hectare',
      crops: ['Wheat', 'Rice', 'Corn', 'Sugarcane']
    });
  }

  // Phosphorus recommendations
  if (this.nutrients.phosphorus.category === 'Low') {
    recommendations.push({
      nutrient: 'Phosphorus',
      issue: `Low phosphorus level (${this.nutrients.phosphorus.value} mg/kg)`,
      recommendation: 'Add DAP (Diammonium Phosphate) or Single Super Phosphate',
      dosage: 'Apply 50-75 kg DAP per hectare',
      crops: ['Pulses', 'Wheat', 'Groundnut', 'Oilseeds']
    });
  }

  // Potassium recommendations
  if (this.nutrients.potassium.category === 'Low') {
    recommendations.push({
      nutrient: 'Potassium',
      issue: `Low potassium level (${this.nutrients.potassium.value} mg/kg)`,
      recommendation: 'Add Potasium Chloride (MOP) or Wood Ash',
      dosage: 'Apply 40-50 kg MOP per hectare',
      crops: ['Potato', 'Sugarcane', 'Fruits', 'Vegetables']
    });
  }

  // pH recommendations
  if (this.nutrients.pH.value > 7.5) {
    recommendations.push({
      nutrient: 'pH (Alkaline)',
      issue: `Alkaline soil (pH ${this.nutrients.pH.value})`,
      recommendation: 'Add Elemental Sulfur or Iron Sulfate',
      dosage: 'Apply 1-2 tons sulfur per hectare',
      impact: 'Improves micronutrient availability'
    });
  } else if (this.nutrients.pH.value < 6.0) {
    recommendations.push({
      nutrient: 'pH (Acidic)',
      issue: `Acidic soil (pH ${this.nutrients.pH.value})`,
      recommendation: 'Add Agricultural Lime (CaCO3)',
      dosage: 'Apply 2-4 tons lime per hectare',
      impact: 'Increases soil pH and nutrient availability'
    });
  }

  // Organic matter recommendations
  if (this.nutrients.organicCarbon.category === 'Low') {
    recommendations.push({
      nutrient: 'Organic Matter',
      issue: `Low organic carbon (${this.nutrients.organicCarbon.value}%)`,
      recommendation: 'Add Compost, FYM (Farmyard Manure), or Green Manure',
      dosage: 'Apply 10-15 tons FYM per hectare annually',
      benefit: 'Improves soil structure, water retention, and nutrient cycling'
    });
  }

  return recommendations;
};

/**
 * Method to compare with optimal values
 */
soilSchema.methods.compareWithOptimal = function () {
  const optimalValues = {
    nitrogen: { min: 250, max: 350 },
    phosphorus: { min: 25, max: 35 },
    potassium: { min: 150, max: 250 },
    organicCarbon: { min: 0.7, max: 2.5 },
    pH: { min: 6.5, max: 7.5 }
  };

  return {
    nitrogen: {
      value: this.nutrients.nitrogen.value,
      optimal: optimalValues.nitrogen,
      status: this.nutrients.nitrogen.value >= optimalValues.nitrogen.min && 
              this.nutrients.nitrogen.value <= optimalValues.nitrogen.max ? 'Optimal' : 'Needs Adjustment'
    },
    phosphorus: {
      value: this.nutrients.phosphorus.value,
      optimal: optimalValues.phosphorus,
      status: this.nutrients.phosphorus.value >= optimalValues.phosphorus.min && 
              this.nutrients.phosphorus.value <= optimalValues.phosphorus.max ? 'Optimal' : 'Needs Adjustment'
    },
    potassium: {
      value: this.nutrients.potassium.value,
      optimal: optimalValues.potassium,
      status: this.nutrients.potassium.value >= optimalValues.potassium.min && 
              this.nutrients.potassium.value <= optimalValues.potassium.max ? 'Optimal' : 'Needs Adjustment'
    },
    pH: {
      value: this.nutrients.pH.value,
      optimal: optimalValues.pH,
      status: this.nutrients.pH.value >= optimalValues.pH.min && 
              this.nutrients.pH.value <= optimalValues.pH.max ? 'Optimal' : 'Needs Adjustment'
    }
  };
};

export default mongoose.model('SoilFertility', soilSchema);
