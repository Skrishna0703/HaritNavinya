import Papa from 'papaparse';

export function parseCSV(csvPath) {
  return new Promise((resolve, reject) => {
    fetch(csvPath)
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Transform raw CSV data to normalized format
            const parsedData = results.data.map((row) => {
              // Extract state (handle both "State" and "state" headers)
              const state = row.State || row.state;
              
              // Calculate nutrient values from High/Medium/Low distributions
              const nitrogen = calculateNutrientValue(row.n_High || 0, row.n_Medium || 0, row.n_Low || 0);
              const phosphorus = calculateNutrientValue(row.p_High || 0, row.p_Medium || 0, row.p_Low || 0);
              const potassium = calculateNutrientValue(row.k_High || 0, row.k_Medium || 0, row.k_Low || 0);
              const organicCarbon = calculateOCPercentage(row.OC_High || 0, row.OC_Medium || 0, row.OC_Low || 0);
              const pH = calculatePHValue(row.pH_Alkaline || 0, row.pH_Acidic || 0, row.pH_Neutral || 0);
              
              // Calculate micronutrient sufficiency percentages
              const sulfur = calculateSufficiency(row.S_Sufficient || 0, row.S_Deficient || 0);
              const iron = calculateSufficiency(row.Fe_Sufficient || 0, row.Fe_Deficient || 0);
              const zinc = calculateSufficiency(row.Zn_Sufficient || 0, row.Zn_Deficient || 0);
              const copper = calculateSufficiency(row.Cu_Sufficient || 0, row.Cu_Deficient || 0);
              const boron = calculateSufficiency(row.B_Sufficient || 0, row.B_Deficient || 0);
              const manganese = calculateSufficiency(row.Mn_Sufficient || 0, row.Mn_Deficient || 0);

              return {
                state: state?.trim() || 'Unknown',
                district: row.district?.trim() || 'All',
                nitrogen: Math.round(nitrogen),
                phosphorus: Math.round(phosphorus),
                potassium: Math.round(potassium),
                pH: parseFloat(pH.toFixed(2)),
                organicCarbon: parseFloat(organicCarbon.toFixed(2)),
                category: determineFertilityCategory((nitrogen + phosphorus + potassium) / 3),
                micronutrients: {
                  sulfur: Math.round(sulfur),
                  iron: Math.round(iron),
                  zinc: Math.round(zinc),
                  copper: Math.round(copper),
                  boron: Math.round(boron),
                  manganese: Math.round(manganese)
                }
              };
            });

            resolve(parsedData);
          },
          error: (error) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          }
        });
      })
      .catch((error) => {
        reject(new Error(`Failed to fetch CSV: ${error.message}`));
      });
  });
}

// Calculate weighted nutrient value from High/Medium/Low counts
function calculateNutrientValue(high, medium, low) {
  const total = high + medium + low;
  if (total === 0) return 50; // Default value if no data

  // Weighted calculation: High=100, Medium=50, Low=20
  const weightedSum = (high * 100) + (medium * 50) + (low * 20);
  return weightedSum / total;
}

// Calculate organic carbon percentage
function calculateOCPercentage(high, medium, low) {
  const total = high + medium + low;
  if (total === 0) return 0.5;

  // High OC = 1.5%, Medium OC = 0.8%, Low OC = 0.3%
  const weightedSum = (high * 1.5) + (medium * 0.8) + (low * 0.3);
  return weightedSum / total;
}

// Calculate pH value from distribution
function calculatePHValue(alkaline, acidic, neutral) {
  const total = alkaline + acidic + neutral;
  if (total === 0) return 6.5;

  // Acidic = 5.5, Neutral = 6.5-7.5, Alkaline = 8.0
  const weightedSum = (acidic * 5.5) + (neutral * 7.0) + (alkaline * 8.0);
  return weightedSum / total;
}

// Calculate nutrient sufficiency percentage
function calculateSufficiency(sufficient, deficient) {
  const total = sufficient + deficient;
  if (total === 0) return 50;

  return (sufficient / total) * 100;
}

// Determine fertility category
export function determineFertilityCategory(score) {
  if (score < 40) return 'Low';
  if (score >= 40 && score <= 70) return 'Medium';
  return 'High';
}

// Calculate fertility score from NPK
export function calculateFertilityScore(nitrogen, phosphorus, potassium) {
  // Normalize values (assuming 0-300 range for N, 0-200 for P, 0-200 for K)
  const normalizedN = Math.min(nitrogen / 300, 1) * 100;
  const normalizedP = Math.min(phosphorus / 200, 1) * 100;
  const normalizedK = Math.min(potassium / 200, 1) * 100;

  const score = (normalizedN + normalizedP + normalizedK) / 3;
  return Math.round(score);
}

// Generate recommendations based on soil data
export function generateRecommendations(soilData) {
  const recommendations = [];

  // Nitrogen recommendations
  if (soilData.nitrogen < 50) {
    recommendations.push({
      parameter: 'Nitrogen',
      issue: 'Low nitrogen levels detected',
      recommendation: 'Add Urea or Ammonium Nitrate fertilizer',
      dosage: '100-150 kg/ha',
      priority: 'High'
    });
  }

  // Phosphorus recommendations
  if (soilData.phosphorus < 30) {
    recommendations.push({
      parameter: 'Phosphorus',
      issue: 'Low phosphorus levels detected',
      recommendation: 'Apply DAP (Diammonium Phosphate) or SSP (Single Super Phosphate)',
      dosage: '50-75 kg/ha',
      priority: 'High'
    });
  }

  // Potassium recommendations
  if (soilData.potassium < 40) {
    recommendations.push({
      parameter: 'Potassium',
      issue: 'Low potassium levels detected',
      recommendation: 'Apply Potassium Chloride (Potash) or Wood Ash',
      dosage: '40-60 kg/ha',
      priority: 'High'
    });
  }

  // pH recommendations
  if (soilData.pH > 7.5) {
    recommendations.push({
      parameter: 'Soil pH',
      issue: 'Soil is too alkaline (pH > 7.5)',
      recommendation: 'Add compost, peat moss, or sulfur to lower pH',
      dosage: '2-5 tons/ha of compost',
      priority: 'Medium'
    });
  }

  if (soilData.pH < 6) {
    recommendations.push({
      parameter: 'Soil pH',
      issue: 'Soil is too acidic (pH < 6)',
      recommendation: 'Add lime (CaCO3) or calcium hydroxide',
      dosage: '1-3 tons/ha of lime',
      priority: 'Medium'
    });
  }

  // Organic carbon recommendations
  if (soilData.organicCarbon < 0.6) {
    recommendations.push({
      parameter: 'Organic Matter',
      issue: 'Low organic carbon content',
      recommendation: 'Add Farmyard Manure (FYM) or Compost',
      dosage: '15-20 tons/ha',
      priority: 'High'
    });
  }

  // Micronutrient recommendations
  if (soilData.micronutrients?.zinc < 60) {
    recommendations.push({
      parameter: 'Zinc',
      issue: 'Low zinc availability',
      recommendation: 'Apply Zinc Sulfate or Zinc-enriched fertilizer',
      dosage: '5-10 kg/ha',
      priority: 'Medium'
    });
  }

  return recommendations;
}
