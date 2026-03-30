import React, { useState, useEffect } from 'react';

export function SoilForm({ data, onSubmit }) {
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);

  // Extract unique states from data
  useEffect(() => {
    if (data.length > 0) {
      const uniqueStates = [...new Set(data.map(item => item.state))].sort();
      setStates(uniqueStates);
      if (uniqueStates.length > 0) {
        setSelectedState(uniqueStates[0]);
      }
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedState) {
      onSubmit(selectedState, 'All');
    }
  };

  return (
    <div className="soil-form-container">
      <form onSubmit={handleSubmit} className="soil-form">
        <h2>Soil Fertility Analysis</h2>
        <p className="form-subtitle">Select a state to view soil health data</p>

        <div className="form-group">
          <label htmlFor="state">Select State:</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            required
          >
            <option value="">-- Choose a State --</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <p className="form-info">
          📊 Data from: Soil Health Card (SHC) Portal - Cycle II, 2025-26
        </p>

        <button type="submit" disabled={!selectedState}>
          View Soil Analysis
        </button>
      </form>
    </div>
  );
}
