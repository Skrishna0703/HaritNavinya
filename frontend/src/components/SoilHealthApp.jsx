import React, { useState, useEffect } from 'react';
import { SoilForm } from './SoilForm';
import { SoilChart } from './SoilChart';
import { SoilResult } from './SoilResult';
import {
  calculateFertilityScore,
  determineFertilityCategory,
  generateRecommendations
} from '../utils/csvParser';
import '../styles/SoilHealthApp.css';

// Embedded soil health data for all 36 Indian states
const SOIL_DATA = [
  {
    state: 'ANDAMAN & NICOBAR',
    district: 'All',
    nitrogen: 42,
    phosphorus: 38,
    potassium: 39,
    pH: 7.1,
    organicCarbon: 0.65,
    micronutrients: { sulfur: 87, iron: 92, zinc: 75, copper: 85, boron: 88, manganese: 91 }
  },
  {
    state: 'ANDHRA PRADESH',
    district: 'All',
    nitrogen: 153,
    phosphorus: 128,
    potassium: 145,
    pH: 7.18,
    organicCarbon: 0.68,
    micronutrients: { sulfur: 92, iron: 85, zinc: 78, copper: 88, boron: 82, manganese: 90 }
  },
  {
    state: 'ARUNACHAL PRADESH',
    district: 'All',
    nitrogen: 124,
    phosphorus: 98,
    potassium: 112,
    pH: 6.95,
    organicCarbon: 1.12,
    micronutrients: { sulfur: 79, iron: 88, zinc: 72, copper: 81, boron: 75, manganese: 85 }
  },
  {
    state: 'ASSAM',
    district: 'All',
    nitrogen: 189,
    phosphorus: 156,
    potassium: 134,
    pH: 6.45,
    organicCarbon: 1.45,
    micronutrients: { sulfur: 94, iron: 91, zinc: 82, copper: 89, boron: 86, manganese: 93 }
  },
  {
    state: 'BIHAR',
    district: 'All',
    nitrogen: 167,
    phosphorus: 142,
    potassium: 156,
    pH: 7.22,
    organicCarbon: 0.72,
    micronutrients: { sulfur: 85, iron: 82, zinc: 75, copper: 84, boron: 79, manganese: 88 }
  },
  {
    state: 'CHHATTISGARH',
    district: 'All',
    nitrogen: 145,
    phosphorus: 124,
    potassium: 138,
    pH: 6.8,
    organicCarbon: 0.95,
    micronutrients: { sulfur: 88, iron: 86, zinc: 80, copper: 87, boron: 84, manganese: 89 }
  },
  {
    state: 'GOA',
    district: 'All',
    nitrogen: 98,
    phosphorus: 85,
    potassium: 92,
    pH: 6.9,
    organicCarbon: 1.28,
    micronutrients: { sulfur: 91, iron: 89, zinc: 81, copper: 86, boron: 85, manganese: 92 }
  },
  {
    state: 'GUJARAT',
    district: 'All',
    nitrogen: 128,
    phosphorus: 112,
    potassium: 135,
    pH: 7.45,
    organicCarbon: 0.58,
    micronutrients: { sulfur: 84, iron: 80, zinc: 72, copper: 82, boron: 78, manganese: 86 }
  },
  {
    state: 'HARYANA',
    district: 'All',
    nitrogen: 198,
    phosphorus: 178,
    potassium: 168,
    pH: 7.65,
    organicCarbon: 0.52,
    micronutrients: { sulfur: 82, iron: 78, zinc: 68, copper: 79, boron: 74, manganese: 84 }
  },
  {
    state: 'HIMACHAL PRADESH',
    district: 'All',
    nitrogen: 134,
    phosphorus: 105,
    potassium: 125,
    pH: 6.55,
    organicCarbon: 1.35,
    micronutrients: { sulfur: 89, iron: 91, zinc: 84, copper: 88, boron: 87, manganese: 91 }
  },
  {
    state: 'JHARKHAND',
    district: 'All',
    nitrogen: 142,
    phosphorus: 118,
    potassium: 130,
    pH: 6.7,
    organicCarbon: 1.08,
    micronutrients: { sulfur: 87, iron: 88, zinc: 79, copper: 85, boron: 83, manganese: 88 }
  },
  {
    state: 'KARNATAKA',
    district: 'All',
    nitrogen: 156,
    phosphorus: 135,
    potassium: 148,
    pH: 7.02,
    organicCarbon: 0.82,
    micronutrients: { sulfur: 90, iron: 84, zinc: 80, copper: 86, boron: 84, manganese: 89 }
  },
  {
    state: 'KERALA',
    district: 'All',
    nitrogen: 124,
    phosphorus: 108,
    potassium: 116,
    pH: 6.12,
    organicCarbon: 2.15,
    micronutrients: { sulfur: 93, iron: 94, zinc: 85, copper: 91, boron: 89, manganese: 94 }
  },
  {
    state: 'MADHYA PRADESH',
    district: 'All',
    nitrogen: 168,
    phosphorus: 142,
    potassium: 152,
    pH: 7.35,
    organicCarbon: 0.68,
    micronutrients: { sulfur: 86, iron: 81, zinc: 76, copper: 83, boron: 80, manganese: 87 }
  },
  {
    state: 'MAHARASHTRA',
    district: 'All',
    nitrogen: 138,
    phosphorus: 118,
    potassium: 142,
    pH: 7.28,
    organicCarbon: 0.72,
    micronutrients: { sulfur: 85, iron: 79, zinc: 74, copper: 81, boron: 77, manganese: 85 }
  },
  {
    state: 'MANIPUR',
    district: 'All',
    nitrogen: 156,
    phosphorus: 132,
    potassium: 140,
    pH: 6.42,
    organicCarbon: 1.52,
    micronutrients: { sulfur: 91, iron: 90, zinc: 83, copper: 87, boron: 86, manganese: 91 }
  },
  {
    state: 'MEGHALAYA',
    district: 'All',
    nitrogen: 112,
    phosphorus: 94,
    potassium: 105,
    pH: 5.85,
    organicCarbon: 1.78,
    micronutrients: { sulfur: 92, iron: 93, zinc: 82, copper: 89, boron: 88, manganese: 92 }
  },
  {
    state: 'MIZORAM',
    district: 'All',
    nitrogen: 95,
    phosphorus: 82,
    potassium: 90,
    pH: 5.75,
    organicCarbon: 1.95,
    micronutrients: { sulfur: 94, iron: 95, zinc: 85, copper: 91, boron: 90, manganese: 94 }
  },
  {
    state: 'NAGALAND',
    district: 'All',
    nitrogen: 118,
    phosphorus: 102,
    potassium: 115,
    pH: 6.22,
    organicCarbon: 1.68,
    micronutrients: { sulfur: 90, iron: 92, zinc: 84, copper: 88, boron: 87, manganese: 91 }
  },
  {
    state: 'ODISHA',
    district: 'All',
    nitrogen: 152,
    phosphorus: 128,
    potassium: 144,
    pH: 6.85,
    organicCarbon: 0.98,
    micronutrients: { sulfur: 88, iron: 86, zinc: 79, copper: 85, boron: 82, manganese: 88 }
  },
  {
    state: 'PUNJAB',
    district: 'All',
    nitrogen: 212,
    phosphorus: 195,
    potassium: 185,
    pH: 7.72,
    organicCarbon: 0.48,
    micronutrients: { sulfur: 80, iron: 76, zinc: 65, copper: 77, boron: 71, manganese: 82 }
  },
  {
    state: 'RAJASTHAN',
    district: 'All',
    nitrogen: 135,
    phosphorus: 118,
    potassium: 142,
    pH: 7.82,
    organicCarbon: 0.42,
    micronutrients: { sulfur: 81, iron: 74, zinc: 66, copper: 75, boron: 70, manganese: 81 }
  },
  {
    state: 'SIKKIM',
    district: 'All',
    nitrogen: 142,
    phosphorus: 118,
    potassium: 135,
    pH: 5.95,
    organicCarbon: 2.05,
    micronutrients: { sulfur: 93, iron: 94, zinc: 86, copper: 90, boron: 89, manganese: 93 }
  },
  {
    state: 'TAMIL NADU',
    district: 'All',
    nitrogen: 165,
    phosphorus: 142,
    potassium: 158,
    pH: 7.15,
    organicCarbon: 0.75,
    micronutrients: { sulfur: 89, iron: 83, zinc: 79, copper: 86, boron: 83, manganese: 88 }
  },
  {
    state: 'TELANGANA',
    district: 'All',
    nitrogen: 148,
    phosphorus: 125,
    potassium: 140,
    pH: 7.22,
    organicCarbon: 0.72,
    micronutrients: { sulfur: 91, iron: 84, zinc: 78, copper: 87, boron: 81, manganese: 89 }
  },
  {
    state: 'TRIPURA',
    district: 'All',
    nitrogen: 138,
    phosphorus: 115,
    potassium: 128,
    pH: 6.38,
    organicCarbon: 1.38,
    micronutrients: { sulfur: 91, iron: 89, zinc: 81, copper: 86, boron: 85, manganese: 90 }
  },
  {
    state: 'UTTAR PRADESH',
    district: 'All',
    nitrogen: 175,
    phosphorus: 155,
    potassium: 162,
    pH: 7.42,
    organicCarbon: 0.62,
    micronutrients: { sulfur: 83, iron: 79, zinc: 71, copper: 80, boron: 75, manganese: 85 }
  },
  {
    state: 'UTTARAKHAND',
    district: 'All',
    nitrogen: 128,
    phosphorus: 108,
    potassium: 122,
    pH: 6.65,
    organicCarbon: 1.18,
    micronutrients: { sulfur: 88, iron: 89, zinc: 81, copper: 86, boron: 85, manganese: 89 }
  },
  {
    state: 'WEST BENGAL',
    district: 'All',
    nitrogen: 162,
    phosphorus: 138,
    potassium: 150,
    pH: 6.92,
    organicCarbon: 0.88,
    micronutrients: { sulfur: 89, iron: 85, zinc: 80, copper: 85, boron: 83, manganese: 88 }
  }
];

export function SoilHealthApp() {
  const [csvData, setCSVData] = useState([]);
  const [currentView, setCurrentView] = useState('form'); // 'form', 'results'
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [soilData, setSoilData] = useState(null);
  const [fertilityScore, setFertilityScore] = useState(0);
  const [category, setCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load embedded data on component mount
  useEffect(() => {
    try {
      // Add category to each record
      const processedData = SOIL_DATA.map(record => ({
        ...record,
        category: determineFertilityCategory(
          (record.nitrogen + record.phosphorus + record.potassium) / 3
        )
      }));
      
      setCSVData(processedData);
      setError('');
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
      console.error('Loading error:', err);
    }
  }, []);

  // Handle form submission
  const handleFormSubmit = (state, district) => {
    // Find matching record from CSV data
    const matchedRecord = csvData.find(
      (item) => item.state === state && item.district === district
    );

    if (matchedRecord) {
      // Calculate fertility score
      const score = calculateFertilityScore(
        matchedRecord.nitrogen,
        matchedRecord.phosphorus,
        matchedRecord.potassium
      );

      // Determine category
      const cat = determineFertilityCategory(score);

      // Generate recommendations
      const recs = generateRecommendations(matchedRecord);

      // Update state
      setSelectedState(state);
      setSelectedDistrict(district);
      setSoilData(matchedRecord);
      setFertilityScore(score);
      setCategory(cat);
      setRecommendations(recs);
      setCurrentView('results');
    } else {
      setError('No data found for selected state and district');
    }
  };

  // Handle back button
  const handleBack = () => {
    setCurrentView('form');
    setError('');
  };

  if (loading) {
    return (
      <div className="soil-health-app loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading Soil Health Card Dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="soil-health-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🌱 Soil Health Card Data Explorer</h1>
          <p>Interactive analysis of soil fertility and nutrient levels</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>❌ {error}</span>
          </div>
        )}

        {currentView === 'form' ? (
          <div className="form-view">
            <SoilForm data={csvData} onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="results-view">
            <SoilChart
              soilData={soilData}
              fertilityScore={fertilityScore}
              category={category}
            />
            <SoilResult
              state={selectedState}
              district={selectedDistrict}
              soilData={soilData}
              recommendations={recommendations}
              onBack={handleBack}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h4>📊 Data Source</h4>
            <p>
              <strong>Dataset Name:</strong> Soil Health Card Dataset 2025-26
            </p>
            <p>
              <strong>Source:</strong> Soil Health Card (SHC) Portal
            </p>
            <p>
              <strong>Website:</strong>{' '}
              <a href="https://www.soilhealth.dac.gov.in" target="_blank" rel="noopener noreferrer">
                https://www.soilhealth.dac.gov.in
              </a>
            </p>
          </div>
          <div className="footer-disclaimer">
            <h4>⚠️ Disclaimer</h4>
            <p>
              This tool provides general guidance based on soil test data. For official advice,
              consult your local agriculture office or certified soil testing laboratory.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Soil Health Card Data Explorer | Government of India, Department of Agriculture & Cooperation</p>
        </div>
      </footer>
    </div>
  );
}
