import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parse the Nutrient CSV file and transform into individual soil records
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of soil data objects
 */
export async function parseNutrientCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const transformedData = transformCSVRow(row);
          if (transformedData) {
            results.push(transformedData);
          }
        } catch (error) {
          console.error('Error transforming row:', error, row);
        }
      })
      .on('end', () => {
        console.log(`✅ Successfully parsed ${results.length} states from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}

/**
 * Transform CSV row to soil data format
 * Calculates average nutrient levels from High/Medium/Low distribution
 * @param {Object} row - CSV row data
 * @returns {Object} Transformed soil data
 */
function transformCSVRow(row) {
  try {
    const state = row.State?.trim();
    if (!state) return null;

    // Extract totals
    const total = {
      n: (parseInt(row.n_High) || 0) + (parseInt(row.n_Medium) || 0) + (parseInt(row.n_Low) || 0),
      p: (parseInt(row.p_High) || 0) + (parseInt(row.p_Medium) || 0) + (parseInt(row.p_Low) || 0),
      k: (parseInt(row.k_High) || 0) + (parseInt(row.k_Medium) || 0) + (parseInt(row.k_Low) || 0),
      oc: (parseInt(row.OC_High) || 0) + (parseInt(row.OC_Medium) || 0) + (parseInt(row.OC_Low) || 0),
      ph: (parseInt(row.pH_Alkaline) || 0) + (parseInt(row.pH_Acidic) || 0) + (parseInt(row.pH_Neutral) || 0),
      ec: (parseInt(row.EC_NonSaline) || 0) + (parseInt(row.EC_Saline) || 0),
      s: (parseInt(row.S_Sufficient) || 0) + (parseInt(row.S_Deficient) || 0),
      fe: (parseInt(row.Fe_Sufficient) || 0) + (parseInt(row.Fe_Deficient) || 0),
      zn: (parseInt(row.Zn_Sufficient) || 0) + (parseInt(row.Zn_Deficient) || 0),
      cu: (parseInt(row.Cu_Sufficient) || 0) + (parseInt(row.Cu_Deficient) || 0),
      b: (parseInt(row.B_Sufficient) || 0) + (parseInt(row.B_Deficient) || 0),
      mn: (parseInt(row.Mn_Sufficient) || 0) + (parseInt(row.Mn_Deficient) || 0),
    };

    // Calculate percentages and estimates
    const calculateNutrientValue = (highCount, mediumCount, lowCount, scale = 100) => {
      const total = highCount + mediumCount + lowCount;
      if (total === 0) return 50; // Default to medium if no data
      
      // Weight: High=100, Medium=50, Low=20
      const weighted = (highCount * 100 + mediumCount * 50 + lowCount * 20) / total;
      return weighted;
    };

    const calculateSufficiencyPercent = (sufficientCount, deficientCount) => {
      const total = sufficientCount + deficientCount;
      if (total === 0) return 50; // Default
      return (sufficientCount / total) * 100;
    };

    const calculatePHValue = (alkalineCount, acidicCount, neutralCount) => {
      const total = alkalineCount + acidicCount + neutralCount;
      if (total === 0) return 7.0; // Default neutral
      
      // Alkaline=8.0, Neutral=7.0, Acidic=6.0
      const weightedPH = (alkalineCount * 8.0 + neutralCount * 7.0 + acidicCount * 6.0) / total;
      return parseFloat(weightedPH.toFixed(1));
    };

    // Parse nutrient values
    const nitrogenValue = calculateNutrientValue(
      parseInt(row.n_High) || 0,
      parseInt(row.n_Medium) || 0,
      parseInt(row.n_Low) || 0
    );

    const phosphorusValue = calculateNutrientValue(
      parseInt(row.p_High) || 0,
      parseInt(row.p_Medium) || 0,
      parseInt(row.p_Low) || 0
    );

    const potassiumValue = calculateNutrientValue(
      parseInt(row.k_High) || 0,
      parseInt(row.k_Medium) || 0,
      parseInt(row.k_Low) || 0
    );

    const ocValue = calculateNutrientValue(
      parseInt(row.OC_High) || 0,
      parseInt(row.OC_Medium) || 0,
      parseInt(row.OC_Low) || 0,
      3 // Scale for OC percentage
    ) / 33.33;

    const phValue = calculatePHValue(
      parseInt(row.pH_Alkaline) || 0,
      parseInt(row.pH_Acidic) || 0,
      parseInt(row.pH_Neutral) || 0
    );

    // Secondary nutrients
    const sulfurSufficiency = calculateSufficiencyPercent(
      parseInt(row.S_Sufficient) || 0,
      parseInt(row.S_Deficient) || 0
    );

    const ironSufficiency = calculateSufficiencyPercent(
      parseInt(row.Fe_Sufficient) || 0,
      parseInt(row.Fe_Deficient) || 0
    );

    const zincSufficiency = calculateSufficiencyPercent(
      parseInt(row.Zn_Sufficient) || 0,
      parseInt(row.Zn_Deficient) || 0
    );

    const copperSufficiency = calculateSufficiencyPercent(
      parseInt(row.Cu_Sufficient) || 0,
      parseInt(row.Cu_Deficient) || 0
    );

    const boronSufficiency = calculateSufficiencyPercent(
      parseInt(row.B_Sufficient) || 0,
      parseInt(row.B_Deficient) || 0
    );

    const manganeseSufficiency = calculateSufficiencyPercent(
      parseInt(row.Mn_Sufficient) || 0,
      parseInt(row.Mn_Deficient) || 0
    );

    // Build normalized soil data
    return {
      state: state,
      district: 'State-Average', // Placeholder - this is state-level data
      block: 'Mixed',
      village: 'Statistical Average',

      // Macronutrients
      nutrients: {
        nitrogen: {
          value: Math.round(nitrogenValue),
          category: categorizeNutrient(nitrogenValue, 'nitrogen'),
          unit: 'mg/kg',
          highCount: parseInt(row.n_High) || 0,
          mediumCount: parseInt(row.n_Medium) || 0,
          lowCount: parseInt(row.n_Low) || 0,
        },
        phosphorus: {
          value: Math.round(phosphorusValue),
          category: categorizeNutrient(phosphorusValue, 'phosphorus'),
          unit: 'mg/kg',
          highCount: parseInt(row.p_High) || 0,
          mediumCount: parseInt(row.p_Medium) || 0,
          lowCount: parseInt(row.p_Low) || 0,
        },
        potassium: {
          value: Math.round(potassiumValue),
          category: categorizeNutrient(potassiumValue, 'potassium'),
          unit: 'mg/kg',
          highCount: parseInt(row.k_High) || 0,
          mediumCount: parseInt(row.k_Medium) || 0,
          lowCount: parseInt(row.k_Low) || 0,
        },

        // Organic matter and pH
        organicCarbon: {
          value: parseFloat(ocValue.toFixed(2)),
          category: categorizeNutrient(ocValue * 33.33, 'organicCarbon'),
          unit: '%',
          highCount: parseInt(row.OC_High) || 0,
          mediumCount: parseInt(row.OC_Medium) || 0,
          lowCount: parseInt(row.OC_Low) || 0,
        },
        pH: {
          value: phValue,
          category: categorizePH(phValue),
          unit: 'pH',
          alkalineCount: parseInt(row.pH_Alkaline) || 0,
          acidicCount: parseInt(row.pH_Acidic) || 0,
          neutralCount: parseInt(row.pH_Neutral) || 0,
        },
        electricalConductivity: {
          value: (parseInt(row.EC_NonSaline) || 0),
          category: (parseInt(row.EC_NonSaline) || 0) > (parseInt(row.EC_Saline) || 0) ? 'NonSaline' : 'Saline',
          unit: 'dS/m',
          nonSalineCount: parseInt(row.EC_NonSaline) || 0,
          salineCount: parseInt(row.EC_Saline) || 0,
        },
      },

      // Micronutrients
      micronutrients: {
        sulfur: {
          sufficiencyPercent: Math.round(sulfurSufficiency),
          category: sulfurSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
        iron: {
          sufficiencyPercent: Math.round(ironSufficiency),
          category: ironSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
        zinc: {
          sufficiencyPercent: Math.round(zincSufficiency),
          category: zincSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
        copper: {
          sufficiencyPercent: Math.round(copperSufficiency),
          category: copperSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
        boron: {
          sufficiencyPercent: Math.round(boronSufficiency),
          category: boronSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
        manganese: {
          sufficiencyPercent: Math.round(manganeseSufficiency),
          category: manganeseSufficiency > 70 ? 'Sufficient' : 'Deficient',
        },
      },

      // Metadata
      cycle: row.Cycle || 'Cycle-II',
      scheme: row.Scheme || 'SHCS',
      source: {
        provider: 'Soil Health Card Scheme - DAC',
        dataUrl: 'https://www.soilhealth.dac.gov.in',
        fetchedAt: new Date(),
      },

      // Tracking
      status: 'active',
      version: 1,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error transforming row:', error);
    return null;
  }
}

/**
 * Categorize nutrient value into Low/Medium/High
 */
function categorizeNutrient(value, nutrientType = 'general') {
  // Standard categorization for nutrients (adjusted for weighted values 0-100)
  switch (nutrientType) {
    case 'nitrogen':
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';

    case 'phosphorus':
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';

    case 'potassium':
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';

    case 'organicCarbon':
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';

    default:
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';
  }
}

/**
 * Categorize pH value
 */
function categorizePH(pH) {
  if (pH < 6.0) return 'Acidic';
  if (pH <= 7.5) return 'Neutral';
  return 'Alkaline';
}

/**
 * Load and cache CSV data
 */
let cachedSoilData = null;

export async function loadSoilDataFromCSV(filePath) {
  if (cachedSoilData) {
    console.log('📦 Using cached soil data');
    return cachedSoilData;
  }

  try {
    console.log('📂 Loading soil data from CSV...');
    const data = await parseNutrientCSV(filePath);
    cachedSoilData = data;
    console.log(`✅ Cached ${data.length} states`);
    return data;
  } catch (error) {
    console.error('❌ Error loading CSV:', error);
    throw error;
  }
}

/**
 * Get cached soil data
 */
export function getCachedSoilData() {
  return cachedSoilData;
}

/**
 * Clear cache
 */
export function clearSoilDataCache() {
  cachedSoilData = null;
  console.log('🗑️ Soil data cache cleared');
}
