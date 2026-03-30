import mongoose from 'mongoose';

const soilSchema = new mongoose.Schema(
  {
    // Location information
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      default: 'State-Average',
      trim: true,
      index: true,
    },
    block: {
      type: String,
      default: null,
    },
    village: {
      type: String,
      default: null,
    },

    // Macronutrients (NPK)
    nutrients: {
      nitrogen: {
        value: { type: Number, min: 0, max: 500 },
        category: { type: String, enum: ['Low', 'Medium', 'High'] },
        unit: { type: String, default: 'mg/kg' },
        highCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        lowCount: { type: Number, default: 0 },
      },
      phosphorus: {
        value: { type: Number, min: 0, max: 500 },
        category: { type: String, enum: ['Low', 'Medium', 'High'] },
        unit: { type: String, default: 'mg/kg' },
        highCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        lowCount: { type: Number, default: 0 },
      },
      potassium: {
        value: { type: Number, min: 0, max: 500 },
        category: { type: String, enum: ['Low', 'Medium', 'High'] },
        unit: { type: String, default: 'mg/kg' },
        highCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        lowCount: { type: Number, default: 0 },
      },

      // Organic matter and pH
      organicCarbon: {
        value: { type: Number, min: 0, max: 10 },
        category: { type: String, enum: ['Low', 'Medium', 'High'] },
        unit: { type: String, default: '%' },
        highCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        lowCount: { type: Number, default: 0 },
      },
      pH: {
        value: { type: Number, min: 3, max: 10 },
        category: { type: String, enum: ['Acidic', 'Neutral', 'Alkaline'] },
        unit: { type: String, default: 'pH' },
        alkalineCount: { type: Number, default: 0 },
        acidicCount: { type: Number, default: 0 },
        neutralCount: { type: Number, default: 0 },
      },
      electricalConductivity: {
        value: { type: Number, default: 0 },
        category: { type: String, enum: ['NonSaline', 'Saline'] },
        unit: { type: String, default: 'dS/m' },
        nonSalineCount: { type: Number, default: 0 },
        salineCount: { type: Number, default: 0 },
      },
    },

    // Micronutrients
    micronutrients: {
      sulfur: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
      iron: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
      zinc: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
      copper: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
      boron: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
      manganese: {
        sufficiencyPercent: { type: Number, min: 0, max: 100 },
        category: { type: String, enum: ['Sufficient', 'Deficient'] },
      },
    },

    // Metadata
    cycle: { type: String, default: 'Cycle-II' },
    scheme: { type: String, default: 'SHCS' },
    source: {
      provider: { type: String, default: 'Soil Health Card Scheme - DAC' },
      dataUrl: { type: String, default: 'https://www.soilhealth.dac.gov.in' },
      fetchedAt: { type: Date },
    },

    // Status
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate fertility score
soilSchema.pre('save', function (next) {
  try {
    if (this.nutrients.nitrogen && this.nutrients.phosphorus && this.nutrients.potassium) {
      const n = (this.nutrients.nitrogen.value / 300) * 100;
      const p = (this.nutrients.phosphorus.value / 100) * 100;
      const k = (this.nutrients.potassium.value / 300) * 100;

      this.fertilityScore = Math.round((n + p + k) / 3);
      this.overallCategory = this.fertilityScore >= 70 ? 'High' : this.fertilityScore >= 40 ? 'Medium' : 'Low';
    }
  } catch (error) {
    console.error('Error in pre-save middleware:', error);
  }
  next();
});

// Add virtual field for fertility score
soilSchema.add({
  fertilityScore: { type: Number, default: 0 },
  overallCategory: { type: String, default: 'Medium' },
});

// Index for better query performance
soilSchema.index({ state: 1, district: 1 });
soilSchema.index({ state: 1 });
soilSchema.index({ 'nutrients.nitrogen.category': 1 });
soilSchema.index({ 'nutrients.phosphorus.category': 1 });
soilSchema.index({ 'nutrients.potassium.category': 1 });

// Method: Get recommendations based on soil data
soilSchema.methods.getRecommendations = function () {
  const recommendations = [];

  // Nitrogen recommendations
  if (this.nutrients.nitrogen.value < 50) {
    recommendations.push({
      nutrient: 'Nitrogen',
      issue: 'Low nitrogen levels',
      recommendation: 'Add Urea fertilizer',
      dosage: '100-150 kg/ha',
      priority: 'High',
    });
  }

  // Phosphorus recommendations
  if (this.nutrients.phosphorus.value < 30) {
    recommendations.push({
      nutrient: 'Phosphorus',
      issue: 'Low phosphorus levels',
      recommendation: 'Apply DAP (Diammonium Phosphate)',
      dosage: '50-75 kg/ha',
      priority: 'High',
    });
  }

  // Potassium recommendations
  if (this.nutrients.potassium.value < 40) {
    recommendations.push({
      nutrient: 'Potassium',
      issue: 'Low potassium levels',
      recommendation: 'Apply Potash or Muriate of Potash',
      dosage: '40-50 kg/ha',
      priority: 'High',
    });
  }

  // Organic matter recommendations
  if (this.nutrients.organicCarbon.value < 0.5) {
    recommendations.push({
      nutrient: 'Organic Matter',
      issue: 'Low organic carbon',
      recommendation: 'Add Compost or Farmyard Manure (FYM)',
      dosage: '15-20 tons/ha',
      priority: 'High',
    });
  }

  // pH recommendations
  const pH = this.nutrients.pH.value;
  if (pH < 6.0) {
    recommendations.push({
      nutrient: 'pH',
      issue: 'Highly acidic soil',
      recommendation: 'Add Lime (CaCO3)',
      dosage: '2-4 tons/ha',
      priority: 'High',
    });
  } else if (pH > 7.5) {
    recommendations.push({
      nutrient: 'pH',
      issue: 'Alkaline soil',
      recommendation: 'Add Sulfur or elemental sulfur',
      dosage: '1-2 tons/ha',
      priority: 'High',
    });
  }

  // Micronutrient recommendations
  if (this.micronutrients.zinc.sufficiencyPercent < 50) {
    recommendations.push({
      nutrient: 'Zinc',
      issue: 'Zinc deficiency detected',
      recommendation: 'Apply Zinc Sulfate',
      dosage: '20-25 kg/ha',
      priority: 'Medium',
    });
  }

  if (this.micronutrients.iron.sufficiencyPercent < 50) {
    recommendations.push({
      nutrient: 'Iron',
      issue: 'Iron deficiency detected',
      recommendation: 'Apply Iron Sulfate or Chelated Iron',
      dosage: '10-15 kg/ha',
      priority: 'Medium',
    });
  }

  return recommendations;
};

// Method: Compare with optimal values
soilSchema.methods.compareWithOptimal = function () {
  const optimalValues = {
    nitrogen: 300,
    phosphorus: 55,
    potassium: 200,
    pH: 6.5,
    organicCarbon: 3.0,
  };

  return {
    nitrogen: {
      current: this.nutrients.nitrogen.value,
      optimal: optimalValues.nitrogen,
      percentage: ((this.nutrients.nitrogen.value / optimalValues.nitrogen) * 100).toFixed(1),
    },
    phosphorus: {
      current: this.nutrients.phosphorus.value,
      optimal: optimalValues.phosphorus,
      percentage: ((this.nutrients.phosphorus.value / optimalValues.phosphorus) * 100).toFixed(1),
    },
    potassium: {
      current: this.nutrients.potassium.value,
      optimal: optimalValues.potassium,
      percentage: ((this.nutrients.potassium.value / optimalValues.potassium) * 100).toFixed(1),
    },
    pH: {
      current: this.nutrients.pH.value,
      optimal: optimalValues.pH,
      difference: (this.nutrients.pH.value - optimalValues.pH).toFixed(1),
    },
    organicCarbon: {
      current: this.nutrients.organicCarbon.value,
      optimal: optimalValues.organicCarbon,
      percentage: ((this.nutrients.organicCarbon.value / optimalValues.organicCarbon) * 100).toFixed(1),
    },
  };
};

export const Soil = mongoose.model('Soil', soilSchema);
