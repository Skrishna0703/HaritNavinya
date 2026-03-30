import { getCachedSoilData } from './csvDataParser.js';

/**
 * Get soil data for a specific state
 */
export async function getSoilDataByState(state) {
  try {
    if (!state) {
      throw new Error('State parameter is required');
    }

    const cachedData = getCachedSoilData();
    const soilData = cachedData.find((s) => s.state.toLowerCase() === state.toLowerCase());

    if (!soilData) {
      throw new Error(`No soil data found for state: ${state}`);
    }

    return soilData;
  } catch (error) {
    console.error('Error getting soil data by state:', error.message);
    throw error;
  }
}

/**
 * Get soil data with location details
 */
export async function getSoilDataByLocation(state, district = null) {
  try {
    const soilData = await getSoilDataByState(state);
    
    // For CSV data, district is stored as "All" for state-level aggregates
    if (district && district !== 'All' && district !== 'State-Average') {
      console.warn(`District-level data not available. Returning state aggregate for: ${state}`);
    }

    return soilData;
  } catch (error) {
    console.error('Error getting soil data by location:', error.message);
    throw error;
  }
}

/**
 * Get soil insights with recommendations
 */
export async function getSoilInsights(state, district = null) {
  try {
    const soilData = await getSoilDataByLocation(state, district);

    const recommendations = generateRecommendations(soilData);

    return {
      location: {
        state: soilData.state,
        district: soilData.district,
      },
      nutrients: soilData.nutrients || {},
      micronutrients: soilData.micronutrients || {},
      fertilityScore: calculateFertilityScore(soilData),
      category: determineFertilityCategory(calculateFertilityScore(soilData)),
      recommendations,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting soil insights:', error.message);
    throw error;
  }
}

/**
 * Get all states
 */
export async function getAllStates() {
  try {
    const cachedData = getCachedSoilData();
    const states = cachedData.map((s) => s.state).filter((v, i, a) => a.indexOf(v) === i).sort();
    return states;
  } catch (error) {
    console.error('Error getting all states:', error.message);
    throw error;
  }
}

/**
 * Get districts for a state (returns state-level aggregates for CSV data)
 */
export async function getDistrictsByState(state) {
  try {
    const soilData = await getSoilDataByState(state);
    // CSV data is state-level aggregated
    return [soilData.district || 'All'];
  } catch (error) {
    console.error('Error getting districts by state:', error.message);
    throw error;
  }
}

/**
 * Compare soil data across states
 */
export async function compareSoilData(states) {
  try {
    if (!states || !Array.isArray(states) || states.length === 0) {
      throw new Error('States array is required');
    }

    const cachedData = getCachedSoilData();
    const soilDataList = states
      .map((state) => cachedData.find((s) => s.state.toLowerCase() === state.toLowerCase()))
      .filter(Boolean);

    if (soilDataList.length === 0) {
      throw new Error('No soil data found for specified states');
    }

    const getNValue = (sd) => sd.nutrients?.nitrogen?.value || 0;
    const getPValue = (sd) => sd.nutrients?.phosphorus?.value || 0;
    const getKValue = (sd) => sd.nutrients?.potassium?.value || 0;
    const getpHValue = (sd) => sd.nutrients?.pH?.value || 7;
    const getOCValue = (sd) => sd.nutrients?.organicCarbon?.value || 0;

    return {
      comparison: soilDataList.map((sd) => ({
        state: sd.state,
        nitrogen: getNValue(sd),
        phosphorus: getPValue(sd),
        potassium: getKValue(sd),
        pH: getpHValue(sd),
        organicCarbon: getOCValue(sd),
        fertilityScore: calculateFertilityScore(sd),
        category: determineFertilityCategory(calculateFertilityScore(sd)),
      })),
      average: {
        nitrogen: Math.round(soilDataList.reduce((sum, s) => sum + getNValue(s), 0) / soilDataList.length),
        phosphorus: Math.round(soilDataList.reduce((sum, s) => sum + getPValue(s), 0) / soilDataList.length),
        potassium: Math.round(soilDataList.reduce((sum, s) => sum + getKValue(s), 0) / soilDataList.length),
        pH: parseFloat(
          (soilDataList.reduce((sum, s) => sum + getpHValue(s), 0) / soilDataList.length).toFixed(2)
        ),
        organicCarbon: parseFloat(
          (soilDataList.reduce((sum, s) => sum + getOCValue(s), 0) / soilDataList.length).toFixed(2)
        ),
        fertilityScore: Math.round(
          soilDataList.reduce((sum, s) => sum + calculateFertilityScore(s), 0) / soilDataList.length
        ),
      },
    };
  } catch (error) {
    console.error('Error comparing soil data:', error.message);
    throw error;
  }
}

/**
 * Get soil statistics for a state
 */
export async function getSoilStatistics(state) {
  try {
    const soilData = await getSoilDataByState(state);

    const stats = {
      state: soilData.state,
      nutrients: soilData.nutrients || {},
      micronutrients: soilData.micronutrients || {},
      fertilityScore: calculateFertilityScore(soilData),
      category: determineFertilityCategory(calculateFertilityScore(soilData)),
    };

    return stats;
  } catch (error) {
    console.error('Error getting soil statistics:', error.message);
    throw error;
  }
}

/**
 * Filter soil data by nutrient ranges
 */
export async function filterSoilDataByNutrients(filters = {}) {
  try {
    const cachedData = getCachedSoilData();
    
    let results = cachedData;

    if (filters.nitrogenMin !== undefined) {
      results = results.filter((s) => s.nitrogen >= filters.nitrogenMin);
    }
    if (filters.nitrogenMax !== undefined) {
      results = results.filter((s) => s.nitrogen <= filters.nitrogenMax);
    }

    if (filters.phosphorusMin !== undefined) {
      results = results.filter((s) => s.phosphorus >= filters.phosphorusMin);
    }
    if (filters.phosphorusMax !== undefined) {
      results = results.filter((s) => s.phosphorus <= filters.phosphorusMax);
    }

    if (filters.potassiumMin !== undefined) {
      results = results.filter((s) => s.potassium >= filters.potassiumMin);
    }
    if (filters.potassiumMax !== undefined) {
      results = results.filter((s) => s.potassium <= filters.potassiumMax);
    }

    if (filters.fertilityMin !== undefined) {
      results = results.filter((s) => calculateFertilityScore(s) >= filters.fertilityMin);
    }
    if (filters.fertilityMax !== undefined) {
      results = results.filter((s) => calculateFertilityScore(s) <= filters.fertilityMax);
    }

    if (filters.category) {
      results = results.filter(
        (s) => determineFertilityCategory(calculateFertilityScore(s)) === filters.category
      );
    }

    return results.slice(0, 100);
  } catch (error) {
    console.error('Error filtering soil data:', error.message);
    throw error;
  }
}

/**
 * Get recommended crops for a state based on soil properties
 */
export async function getRecommendedCrops(state) {
  try {
    const soilData = await getSoilDataByState(state);
    const cropSuitability = calculateCropSuitability(soilData);

    return {
      state: soilData.state,
      recommendedCrops: cropSuitability,
    };
  } catch (error) {
    console.error('Error getting recommended crops:', error.message);
    throw error;
  }
}

/**
 * Calculate fertility score
 */
function calculateFertilityScore(soilData) {
  const N = soilData.nutrients?.nitrogen?.value || 0;
  const P = soilData.nutrients?.phosphorus?.value || 0;
  const K = soilData.nutrients?.potassium?.value || 0;
  const pH = soilData.nutrients?.pH?.value || 7;
  const OC = soilData.nutrients?.organicCarbon?.value || 0;

  //Macronutrient score (0-100 scale)
  let macroScore = 0;

  // Nitrogen scoring (0-40)
  if (N < 50) macroScore += 10;
  else if (N < 150) macroScore += 20;
  else if (N < 250) macroScore += 35;
  else macroScore += 40;

  // Phosphorus scoring (0-25)
  if (P < 20) macroScore += 8;
  else if (P < 50) macroScore += 15;
  else if (P < 100) macroScore += 22;
  else macroScore += 25;

  // Potassium scoring (0-25)
  if (K < 40) macroScore += 8;
  else if (K < 120) macroScore += 15;
  else if (K < 200) macroScore += 22;
  else macroScore += 25;

  // pH scoring (0-10)
  if (pH >= 6.0 && pH <= 7.5) macroScore += 10;
  else if ((pH >= 5.5 && pH < 6.0) || (pH > 7.5 && pH <= 8.0)) macroScore += 6;
  else macroScore += 2;

  // Organic Carbon bonus (0-5)
  if (OC >= 2.0) macroScore += 5;
  else if (OC >= 1.5) macroScore += 4;
  else if (OC >= 1.0) macroScore += 3;
  else if (OC >= 0.5) macroScore += 2;

  // Micronutrient bonus (0-7)
  let microScore = 0;
  if (soilData.micronutrients) {
    const { sulfur, iron, zinc, copper, boron, manganese } = soilData.micronutrients;
    const sufficientCount = [
      sulfur?.category === 'Sufficient' ? 1 : 0,
      iron?.category === 'Sufficient' ? 1 : 0,
      zinc?.category === 'Sufficient' ? 1 : 0,
      copper?.category === 'Sufficient' ? 1 : 0,
      boron?.category === 'Sufficient' ? 1 : 0,
      manganese?.category === 'Sufficient' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
    
    microScore = Math.round((sufficientCount / 6) * 7);
  }

  const totalScore = Math.min(100, macroScore + microScore);
  return Math.round(totalScore);
}

/**
 * Determine fertility category
 */
function determineFertilityCategory(score) {
  if (score < 40) return 'Low';
  if (score < 70) return 'Medium';
  return 'High';
}

/**
 * Generate recommendations based on soil data
 */
function generateRecommendations(soilData) {
  const recommendations = [];
  
  const N = soilData.nutrients?.nitrogen?.value || 0;
  const P = soilData.nutrients?.phosphorus?.value || 0;
  const K = soilData.nutrients?.potassium?.value || 0;
  const pH = soilData.nutrients?.pH?.value || 7;
  const OC = soilData.nutrients?.organicCarbon?.value || 0;

  // Nitrogen recommendations
  if (N < 50) {
    recommendations.push({
      parameter: 'Nitrogen (N)',
      issue: 'Low nitrogen level',
      recommendation: 'Apply nitrogen-rich fertilizers (Urea, Ammonium nitrate)',
      dosage: '80-100 kg/hectare',
      priority: 'High',
    });
  }

  // Phosphorus recommendations
  if (P < 20) {
    recommendations.push({
      parameter: 'Phosphorus (P)',
      issue: 'Low phosphorus level',
      recommendation: 'Apply phosphate fertilizers (Single superphosphate, DAP)',
      dosage: '40-50 kg/hectare',
      priority: 'High',
    });
  }

  // Potassium recommendations
  if (K < 40) {
    recommendations.push({
      parameter: 'Potassium (K)',
      issue: 'Low potassium level',
      recommendation: 'Apply potassium fertilizers (Muriate of potash, Potassium sulfate)',
      dosage: '30-40 kg/hectare',
      priority: 'High',
    });
  }

  // pH recommendations
  if (pH < 6.0) {
    recommendations.push({
      parameter: 'Soil pH',
      issue: 'Acidic soil',
      recommendation: 'Apply lime or calcium carbonate to raise pH',
      dosage: '2-5 tons/hectare',
      priority: 'Medium',
    });
  } else if (pH > 7.5) {
    recommendations.push({
      parameter: 'Soil pH',
      issue: 'Alkaline soil',
      recommendation: 'Apply sulfur or organic matter',
      dosage: '1-2 tons/hectare',
      priority: 'Medium',
    });
  }

  // Organic Carbon recommendations
  if (OC < 0.6) {
    recommendations.push({
      parameter: 'Organic Carbon',
      issue: 'Low organic matter',
      recommendation: 'Increase farm yard manure or compost application',
      dosage: '10-15 tons/hectare annually',
      priority: 'Medium',
    });
  }

  return recommendations;
}

/**
 * Calculate crop suitability based on soil properties
 */
function calculateCropSuitability(soilData) {
  const N = soilData.nutrients?.nitrogen?.value || 0;
  const P = soilData.nutrients?.phosphorus?.value || 0;
  const K = soilData.nutrients?.potassium?.value || 0;
  const pH = soilData.nutrients?.pH?.value || 7;

  const crops = [
    {
      name: 'Wheat',
      requirements: { minN: 150, maxN: 350, minP: 20, maxP: 60, minK: 100, maxK: 250, pHMin: 6.0, pHMax: 7.5 },
      season: 'Rabi',
    },
    {
      name: 'Rice',
      requirements: { minN: 80, maxN: 320, minP: 20, maxP: 60, minK: 80, maxK: 250, pHMin: 5.5, pHMax: 7.5 },
      season: 'Kharif',
    },
    {
      name: 'Maize',
      requirements: { minN: 120, maxN: 300, minP: 25, maxP: 60, minK: 100, maxK: 250, pHMin: 6.0, pHMax: 7.5 },
      season: 'Kharif',
    },
    {
      name: 'Sugarcane',
      requirements: { minN: 150, maxN: 400, minP: 30, maxP: 70, minK: 100, maxK: 300, pHMin: 5.5, pHMax: 8.0 },
      season: 'Year-round',
    },
    {
      name: 'Cotton',
      requirements: { minN: 120, maxN: 280, minP: 20, maxP: 50, minK: 50, maxK: 150, pHMin: 6.0, pHMax: 8.0 },
      season: 'Kharif',
    },
    {
      name: 'Groundnut',
      requirements: { minN: 30, maxN: 50, minP: 25, maxP: 80, minK: 40, maxK: 100, pHMin: 5.5, pHMax: 8.0 },
      season: 'Kharif',
    },
    {
      name: 'Soybean',
      requirements: { minN: 30, maxN: 60, minP: 15, maxP: 40, minK: 30, maxK: 80, pHMin: 6.0, pHMax: 7.5 },
      season: 'Kharif',
    },
  ];

  const suitability = crops.map((crop) => {
    let score = 0;

    // Check nitrogen suitability
    if (N >= crop.requirements.minN && N <= crop.requirements.maxN) {
      score += 25;
    } else if (N >= crop.requirements.minN - 50 && N <= crop.requirements.maxN + 50) {
      score += 15;
    } else {
      score += 5;
    }

    // Check phosphorus suitability
    if (P >= crop.requirements.minP && P <= crop.requirements.maxP) {
      score += 25;
    } else if (P >= crop.requirements.minP - 10 && P <= crop.requirements.maxP + 10) {
      score += 15;
    } else {
      score += 5;
    }

    // Check potassium suitability
    if (K >= crop.requirements.minK && K <= crop.requirements.maxK) {
      score += 25;
    } else if (K >= crop.requirements.minK - 20 && K <= crop.requirements.maxK + 20) {
      score += 15;
    } else {
      score += 5;
    }

    // Check pH suitability
    if (pH >= crop.requirements.pHMin && pH <= crop.requirements.pHMax) {
      score += 25;
    } else if (pH >= crop.requirements.pHMin - 0.5 && pH <= crop.requirements.pHMax + 0.5) {
      score += 15;
    } else {
      score += 5;
    }

    return {
      crop: crop.name,
      season: crop.season,
      suitabilityScore: score,
      suitability: score >= 90 ? 'Highly Recommended' : score >= 70 ? 'Recommended' : 'May Require Amendments',
    };
  });

  return suitability.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
