/**
 * Soil Fertility Calculations & Helpers
 * Production-ready utility functions
 */

/**
 * Categorize nutrient value
 */
export const categorizeNutrient = (value, nutrientType) => {
  const ranges = {
    nitrogen: { low: 50, high: 250 },
    phosphorus: { low: 30, high: 60 },
    potassium: { low: 40, high: 200 },
    organicCarbon: { low: 0.5, high: 1.0 }
  };

  const range = ranges[nutrientType] || { low: 0, high: 100 };

  if (value < range.low) return 'Low';
  if (value > range.high) return 'High';
  return 'Medium';
};

/**
 * Normalize nutrient value to 0-100 scale
 */
export const normalizeNutrientValue = (value, nutrientType) => {
  const maxValues = {
    nitrogen: 300,
    phosphorus: 100,
    potassium: 300,
    organicCarbon: 3,
    pH: 14
  };

  const max = maxValues[nutrientType] || 100;
  return Math.min((value / max) * 100, 100);
};

/**
 * Calculate fertility score from NPK values
 * @param {number} n - Nitrogen value
 * @param {number} p - Phosphorus value
 * @param {number} k - Potassium value
 * @returns {number} Fertility score (0-100)
 */
export const calculateFertilityScore = (n, p, k) => {
  const normalizedN = normalizeNutrientValue(n || 0, 'nitrogen');
  const normalizedP = normalizeNutrientValue(p || 0, 'phosphorus');
  const normalizedK = normalizeNutrientValue(k || 0, 'potassium');

  return Math.round((normalizedN + normalizedP + normalizedK) / 3);
};

/**
 * Get fertility category based on score
 */
export const getFertilityCategory = (score) => {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

/**
 * Generate soil recommendations
 */
export const generateRecommendations = (nutrients) => {
  const recommendations = [];

  // Nitrogen
  if (nutrients.nitrogen < 50) {
    recommendations.push({
      nutrient: 'Nitrogen (N)',
      issue: `Critical - ${nutrients.nitrogen} mg/kg`,
      suggestion: 'Add Urea (46% N)',
      quantity: '100-150 kg/hectare',
      priority: 'High',
      timing: 'Before planting or split application'
    });
  } else if (nutrients.nitrogen < 150) {
    recommendations.push({
      nutrient: 'Nitrogen (N)',
      issue: `Low - ${nutrients.nitrogen} mg/kg`,
      suggestion: 'Add Ammonium Nitrate or Urea',
      quantity: '75-100 kg/hectare',
      priority: 'Medium',
      timing: 'During growing season'
    });
  }

  // Phosphorus
  if (nutrients.phosphorus < 30) {
    recommendations.push({
      nutrient: 'Phosphorus (P)',
      issue: `Critical - ${nutrients.phosphorus} mg/kg`,
      suggestion: 'Add DAP (Diammonium Phosphate)',
      quantity: '50-75 kg/hectare',
      priority: 'High',
      timing: 'With basal application at planting'
    });
  } else if (nutrients.phosphorus < 50) {
    recommendations.push({
      nutrient: 'Phosphorus (P)',
      issue: `Low - ${nutrients.phosphorus} mg/kg`,
      suggestion: 'Add Single Super Phosphate (SSP)',
      quantity: '40-60 kg/hectare',
      priority: 'Medium',
      timing: 'Before or during planting'
    });
  }

  // Potassium
  if (nutrients.potassium < 40) {
    recommendations.push({
      nutrient: 'Potassium (K)',
      issue: `Critical - ${nutrients.potassium} mg/kg`,
      suggestion: 'Add Potassium Chloride (MOP)',
      quantity: '40-50 kg/hectare',
      priority: 'High',
      timing: 'Before planting'
    });
  } else if (nutrients.potassium < 120) {
    recommendations.push({
      nutrient: 'Potassium (K)',
      issue: `Low - ${nutrients.potassium} mg/kg`,
      suggestion: 'Add MOP or Wood Ash',
      quantity: '30-40 kg/hectare',
      priority: 'Medium',
      timing: 'During crop growth'
    });
  }

  // pH
  if (nutrients.pH > 7.5) {
    recommendations.push({
      issue: `Alkaline soil - pH ${nutrients.pH}`,
      suggestion: 'Add Elemental Sulfur or Iron Sulfate',
      quantity: '1-2 tons/hectare',
      priority: 'Medium',
      benefit: 'Increases micronutrient availability',
      note: 'Adjust pH gradually over multiple seasons'
    });
  } else if (nutrients.pH < 6.0) {
    recommendations.push({
      issue: `Acidic soil - pH ${nutrients.pH}`,
      suggestion: 'Add Agricultural Lime (Calcium Carbonate)',
      quantity: '2-4 tons/hectare',
      priority: 'Medium',
      benefit: 'Neutralizes acidity and improves nutrient uptake',
      note: 'Allow time for reaction before planting'
    });
  }

  // Organic Matter
  if (nutrients.organicCarbon < 0.5) {
    recommendations.push({
      issue: 'Very Low Organic Matter',
      suggestion: 'Add Compost or Farmyard Manure (FYM)',
      quantity: '15-20 tons/hectare',
      priority: 'High',
      benefit: 'Improves soil structure and water retention'
    });
  }

  return recommendations;
};

/**
 * Calculate water retention capacity based on soil properties
 */
export const estimateWaterRetention = (organicCarbon, pH) => {
  let capacity = 50; // Base capacity

  // Higher organic matter = better retention
  capacity += (organicCarbon * 10);

  // Optimal pH improves retention
  if (pH >= 6.5 && pH <= 7.5) {
    capacity += 10;
  }

  return Math.min(Math.round(capacity), 100);
};

/**
 * Get suitable crops based on soil properties
 */
export const getSuitableCrops = (nutrients, pH) => {
  const suitableCrops = {};

  // High nitrogen soils
  if (nutrients.nitrogen > 200) {
    suitableCrops.highN = ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Vegetables'];
  }

  // High phosphorus soils
  if (nutrients.phosphorus > 40) {
    suitableCrops.highP = ['Pulses', 'Groundnut', 'Soybean', 'Mustard'];
  }

  // High potassium soils
  if (nutrients.potassium > 150) {
    suitableCrops.highK = ['Potato', 'Banana', 'Sugarcane', 'Fruits'];
  }

  // Acidic soils (pH < 6)
  if (pH < 6) {
    suitableCrops.acidTolerant = ['Tea', 'Coffee', 'Pineapple'];
  }

  // Alkaline soils (pH > 7.5)
  if (pH > 7.5) {
    suitableCrops.alkalineTolerant = ['Barley', 'Chickpea', 'Date Palm'];
  }

  return suitableCrops;
};

/**
 * Format soil data for frontend
 */
export const formatSoilDataForFrontend = (soilDoc) => {
  return {
    location: {
      state: soilDoc.state,
      district: soilDoc.district,
      block: soilDoc.block,
      village: soilDoc.village
    },
    nutrients: {
      nitrogen: {
        value: soilDoc.nutrients.nitrogen.value,
        category: soilDoc.nutrients.nitrogen.category,
        status: soilDoc.nutrients.nitrogen.category,
        recommendation: soilDoc.nutrients.nitrogen.value < 50 ? 'Add Urea' : 'Adequate'
      },
      phosphorus: {
        value: soilDoc.nutrients.phosphorus.value,
        category: soilDoc.nutrients.phosphorus.category,
        status: soilDoc.nutrients.phosphorus.category,
        recommendation: soilDoc.nutrients.phosphorus.value < 30 ? 'Add DAP' : 'Adequate'
      },
      potassium: {
        value: soilDoc.nutrients.potassium.value,
        category: soilDoc.nutrients.potassium.category,
        status: soilDoc.nutrients.potassium.category,
        recommendation: soilDoc.nutrients.potassium.value < 40 ? 'Add Potash' : 'Adequate'
      },
      organicCarbon: {
        value: soilDoc.nutrients.organicCarbon.value,
        category: soilDoc.nutrients.organicCarbon.category,
        status: soilDoc.nutrients.organicCarbon.category,
        recommendation: soilDoc.nutrients.organicCarbon.value < 0.5 ? 'Add Compost' : 'Good'
      },
      pH: {
        value: soilDoc.nutrients.pH.value,
        category: soilDoc.nutrients.pH.category,
        status: soilDoc.nutrients.pH.category
      }
    },
    fertilityScore: soilDoc.fertilityScore,
    overallCategory: soilDoc.overallCategory,
    waterRetention: estimateWaterRetention(
      soilDoc.nutrients.organicCarbon.value,
      soilDoc.nutrients.pH.value
    ),
    recommendations: soilDoc.getRecommendations(),
    comparison: soilDoc.compareWithOptimal(),
    suitableCrops: getSuitableCrops(
      {
        nitrogen: soilDoc.nutrients.nitrogen.value,
        phosphorus: soilDoc.nutrients.phosphorus.value,
        potassium: soilDoc.nutrients.potassium.value
      },
      soilDoc.nutrients.pH.value
    ),
    lastUpdated: soilDoc.lastUpdated,
    cycle: soilDoc.cycle
  };
};

/**
 * Validate soil data structure
 */
export const validateSoilData = (data) => {
  const errors = [];

  if (!data.state) errors.push('State is required');
  if (!data.district) errors.push('District is required');

  if (data.nutrients?.nitrogen?.value !== undefined) {
    if (data.nutrients.nitrogen.value < 0 || data.nutrients.nitrogen.value > 1000) {
      errors.push('Nitrogen must be between 0-1000 mg/kg');
    }
  }

  if (data.nutrients?.pH?.value !== undefined) {
    if (data.nutrients.pH.value < 0 || data.nutrients.pH.value > 14) {
      errors.push('pH must be between 0-14');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  categorizeNutrient,
  normalizeNutrientValue,
  calculateFertilityScore,
  getFertilityCategory,
  generateRecommendations,
  estimateWaterRetention,
  getSuitableCrops,
  formatSoilDataForFrontend,
  validateSoilData
};
