import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function SoilChart({ soilData, fertilityScore, category }) {
  // Prepare data for bar chart (NPK)
  const barChartData = [
    { name: 'Nitrogen', value: soilData.nitrogen },
    { name: 'Phosphorus', value: soilData.phosphorus },
    { name: 'Potassium', value: soilData.potassium }
  ];

  // Prepare data for micronutrients bar chart
  const micronutrientsData = soilData.micronutrients
    ? [
        { name: 'Sulfur', value: soilData.micronutrients.sulfur },
        { name: 'Iron', value: soilData.micronutrients.iron },
        { name: 'Zinc', value: soilData.micronutrients.zinc },
        { name: 'Copper', value: soilData.micronutrients.copper },
        { name: 'Boron', value: soilData.micronutrients.boron },
        { name: 'Manganese', value: soilData.micronutrients.manganese }
      ]
    : [];

  // Prepare data for pie chart (fertility category distribution)
  const pieChartData = [
    { name: 'Nutrients Balance', value: fertilityScore }
  ];

  // Color mapping for fertility categories
  const getCategoryColor = () => {
    if (category === 'High') return '#10b981';
    if (category === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="soil-chart-container">
      <div className="charts-grid">
        {/* Bar Chart for NPK */}
        <div className="chart-wrapper">
          <h3>Macronutrients (NPK) Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fertility Score Display */}
        <div className="chart-wrapper">
          <h3>Soil Fertility Score</h3>
          <div className="fertility-score-display">
            <div
              className={`fertility-circle fertility-${category.toLowerCase()}`}
              style={{ borderColor: getCategoryColor() }}
            >
              <span className="score">{fertilityScore}</span>
              <span className="category">{category}</span>
            </div>
            <div className="score-description">
              <div className="score-range">
                <p>
                  <strong>Low:</strong> &lt; 40
                </p>
                <p>
                  <strong>Medium:</strong> 40 - 70
                </p>
                <p>
                  <strong>High:</strong> &gt; 70
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Micronutrients Bar Chart */}
      {micronutrientsData.length > 0 && (
        <div className="chart-wrapper">
          <h3>Micronutrients Sufficiency Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={micronutrientsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Sufficiency %', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value}% sufficient`}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Soil Metrics Table */}
      <div className="metrics-table">
        <h3>Detailed Soil Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nitrogen (N)</td>
              <td>{soilData.nitrogen}</td>
              <td>ppm</td>
              <td>{getMetricStatus(soilData.nitrogen, 'nitrogen')}</td>
            </tr>
            <tr>
              <td>Phosphorus (P)</td>
              <td>{soilData.phosphorus}</td>
              <td>ppm</td>
              <td>{getMetricStatus(soilData.phosphorus, 'phosphorus')}</td>
            </tr>
            <tr>
              <td>Potassium (K)</td>
              <td>{soilData.potassium}</td>
              <td>ppm</td>
              <td>{getMetricStatus(soilData.potassium, 'potassium')}</td>
            </tr>
            <tr>
              <td>pH Level</td>
              <td>{soilData.pH}</td>
              <td>-</td>
              <td>{getMetricStatus(soilData.pH, 'pH')}</td>
            </tr>
            <tr>
              <td>Organic Carbon</td>
              <td>{soilData.organicCarbon}</td>
              <td>%</td>
              <td>{getMetricStatus(soilData.organicCarbon, 'organicCarbon')}</td>
            </tr>
            {soilData.micronutrients && (
              <>
                <tr>
                  <td colSpan="4" style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px' }}>
                    Micronutrients
                  </td>
                </tr>
                <tr>
                  <td>Sulfur (S)</td>
                  <td>{soilData.micronutrients.sulfur}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.sulfur)}</td>
                </tr>
                <tr>
                  <td>Iron (Fe)</td>
                  <td>{soilData.micronutrients.iron}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.iron)}</td>
                </tr>
                <tr>
                  <td>Zinc (Zn)</td>
                  <td>{soilData.micronutrients.zinc}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.zinc)}</td>
                </tr>
                <tr>
                  <td>Copper (Cu)</td>
                  <td>{soilData.micronutrients.copper}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.copper)}</td>
                </tr>
                <tr>
                  <td>Boron (B)</td>
                  <td>{soilData.micronutrients.boron}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.boron)}</td>
                </tr>
                <tr>
                  <td>Manganese (Mn)</td>
                  <td>{soilData.micronutrients.manganese}</td>
                  <td>% sufficient</td>
                  <td>{getMicronutrientStatus(soilData.micronutrients.manganese)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to get metric status
function getMetricStatus(value, parameter) {
  if (parameter === 'nitrogen') {
    return value < 50 ? '⚠️ Low' : value < 150 ? '⚡ Medium' : '✅ High';
  }
  if (parameter === 'phosphorus') {
    return value < 30 ? '⚠️ Low' : value < 70 ? '⚡ Medium' : '✅ High';
  }
  if (parameter === 'potassium') {
    return value < 40 ? '⚠️ Low' : value < 120 ? '⚡ Medium' : '✅ High';
  }
  if (parameter === 'pH') {
    return value < 6 ? '⚠️ Acidic' : value > 7.5 ? '⚠️ Alkaline' : '✅ Neutral';
  }
  if (parameter === 'organicCarbon') {
    return value < 0.6 ? '⚠️ Low' : value < 1.0 ? '⚡ Medium' : '✅ High';
  }
  return '—';
}

// Helper function to get micronutrient status
function getMicronutrientStatus(value) {
  return value < 50 ? '⚠️ Deficient' : value < 80 ? '⚡ Moderate' : '✅ Sufficient';
}
