/**
 * HaritNavinya Disaster Alerts API - Frontend Integration Guide
 * 
 * This guide shows how to integrate the NDMA SACHET disaster alerts
 * API into your frontend React/Vue components.
 */

// ============================================
// BASIC FETCH EXAMPLE
// ============================================

async function fetchDisasterAlerts(state = 'maharashtra') {
  try {
    const response = await fetch(
      `https://haritnavinya.onrender.com/api/disaster/alerts?state=${state}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Disaster Alerts:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return null;
  }
}

// ============================================
// REACT HOOK EXAMPLE
// ============================================

import { useState, useEffect } from 'react';

function DisasterAlerts({ state = 'maharashtra' }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/disaster/alerts?state=${state}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch alerts');
        }

        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [state]);

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Disaster Alerts for {state}</h2>
      {alerts.length === 0 ? (
        <p>No alerts at this time</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <small>{new Date(alert.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// API ENDPOINTS REFERENCE
// ============================================

/*
GET /api/disaster/health
- Health check for disaster service
- Returns: { success: true, service: 'Disaster Alerts', ... }

GET /api/disaster/supported-states
- Lists all states with available alerts
- Returns: { success: true, supportedStates: ['maharashtra', 'goa', ...] }

GET /api/disaster/alerts?state=maharashtra
- Fetches disaster alerts for specific state
- Query params:
  - state: maharashtra | goa | karnataka | gujarat
- Returns:
  {
    success: true,
    state: 'maharashtra',
    feedUrl: 'https://sachet.ndma.gov.in/cap_public_website/rss/maharashtra/en/',
    alertCount: 5,
    alerts: [
      {
        title: 'Heavy Rainfall Warning',
        description: 'Heavy rainfall expected in Konkan region',
        link: 'https://...',
        date: '2026-05-24T12:30:00Z'
      }
    ]
  }
*/

// ============================================
// EXAMPLE ALERT TYPES
// ============================================

const ALERT_TYPES = {
  RAINFALL: 'Heavy rainfall',
  FLOOD: 'Flood warning',
  CYCLONE: 'Cyclone alert',
  LIGHTNING: 'Lightning alert',
  HEATWAVE: 'Heatwave warning',
  EARTHQUAKE: 'Earthquake alert'
};

// ============================================
// ERROR HANDLING
// ============================================

async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      if (response.status === 404) {
        console.warn('Feed not found - NDMA SACHET may be temporarily unavailable');
        return { alerts: [], error: 'Feed temporarily unavailable' };
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  return { alerts: [], error: 'Failed after retries' };
}

// ============================================
// COMPONENT WITH ALERT FILTERING
// ============================================

function SmartDisasterAlerts({ state = 'maharashtra', alertType = null }) {
  const [alerts, setAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/disaster/alerts?state=${state}`
        );
        const data = await response.json();

        let filteredAlerts = data.alerts || [];

        // Filter by alert type if specified
        if (alertType) {
          filteredAlerts = filteredAlerts.filter(alert =>
            alert.title.toLowerCase().includes(alertType.toLowerCase())
          );
        }

        setAlerts(filteredAlerts);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state, alertType]);

  return (
    <div className="disaster-alerts">
      <div className="header">
        <h2>⚠️ Disaster Alerts - {state}</h2>
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {alerts.length === 0 ? (
        <p className="no-alerts">✅ No active alerts</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert-card">
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              {alert.link && (
                <a href={alert.link} target="_blank" rel="noopener noreferrer">
                  Read more →
                </a>
              )}
              <time>{new Date(alert.date).toLocaleString()}</time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// USAGE IN APP.jsx
// ============================================

// In your main app:
// <DisasterAlerts state="maharashtra" />
// or
// <SmartDisasterAlerts state="maharashtra" alertType="rainfall" />

export {
  fetchDisasterAlerts,
  fetchWithRetry,
  DisasterAlerts,
  SmartDisasterAlerts,
  ALERT_TYPES
};
