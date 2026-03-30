import React from 'react';

export function SoilResult({ state, district, soilData, recommendations, onBack }) {
  return (
    <div className="soil-result-container">
      <div className="result-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Form
        </button>
        <div>
          <h2>Soil Health Report</h2>
          <p className="location-info">
            {state}
          </p>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <h3>📋 Expert Recommendations</h3>

        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            <p>✅ Your soil is in excellent condition! No immediate interventions needed.</p>
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="rec-header">
                  <span className="rec-icon">
                    {rec.priority === 'High' ? '🔴' : '🟡'}
                  </span>
                  <div>
                    <h4>{rec.parameter}</h4>
                    <p className="rec-issue">{rec.issue}</p>
                  </div>
                </div>
                <div className="rec-body">
                  <p className="rec-action">
                    <strong>Action:</strong> {rec.recommendation}
                  </p>
                  <p className="rec-dosage">
                    <strong>Dosage:</strong> {rec.dosage}
                  </p>
                  <span className={`priority-badge priority-${rec.priority.toLowerCase()}`}>
                    {rec.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="summary-section">
        <h3>📊 Quick Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Nitrogen Level</span>
            <span className="summary-value">{soilData.nitrogen} ppm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Phosphorus Level</span>
            <span className="summary-value">{soilData.phosphorus} ppm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Potassium Level</span>
            <span className="summary-value">{soilData.potassium} ppm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">pH Level</span>
            <span className="summary-value">{soilData.pH}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Organic Carbon</span>
            <span className="summary-value">{soilData.organicCarbon}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Soil Category</span>
            <span className="summary-value">{soilData.category}</span>
          </div>
        </div>
      </div>

      {/* Micronutrients Section */}
      {soilData.micronutrients && (
        <div className="micronutrients-section">
          <h3>🧪 Micronutrient Status</h3>
          <div className="micronutrients-grid">
            <div className="micronutrient-item">
              <span>Sulfur</span>
              <span className="micro-value">{soilData.micronutrients.sulfur}% sufficient</span>
            </div>
            <div className="micronutrient-item">
              <span>Iron</span>
              <span className="micro-value">{soilData.micronutrients.iron}% sufficient</span>
            </div>
            <div className="micronutrient-item">
              <span>Zinc</span>
              <span className="micro-value">{soilData.micronutrients.zinc}% sufficient</span>
            </div>
            <div className="micronutrient-item">
              <span>Copper</span>
              <span className="micro-value">{soilData.micronutrients.copper}% sufficient</span>
            </div>
            <div className="micronutrient-item">
              <span>Boron</span>
              <span className="micro-value">{soilData.micronutrients.boron}% sufficient</span>
            </div>
            <div className="micronutrient-item">
              <span>Manganese</span>
              <span className="micro-value">{soilData.micronutrients.manganese}% sufficient</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="info-box">
        <h4>ℹ️ About These Recommendations</h4>
        <ul>
          <li>
            <strong>High Priority (🔴)</strong> - Address immediately for optimal crop growth
          </li>
          <li>
            <strong>Medium Priority (🟡)</strong> - Consider within next planting cycle
          </li>
          <li>
            <strong>Data Source:</strong> Soil Health Card (SHC) Portal, Government of India
          </li>
          <li>
            <strong>Soil Testing:</strong> Test your soil annually for accurate nutrient
            assessment
          </li>
          <li>
            <strong>Professional Help:</strong> Consult your local agriculture officer for personalized guidance
          </li>
        </ul>
      </div>
    </div>
  );
}
