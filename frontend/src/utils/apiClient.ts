/**
 * API Client Configuration
 * Handles all API requests with proper base URL detection
 */

// Determine API base URL based on environment
export const getApiBaseUrl = (): string => {
  // In production, always use the backend service URL
  if (import.meta.env.PROD) {
    return 'https://haritnavinya.onrender.com';
  }
  
  // In development, use environment variable or localhost fallback
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

// Get weather API URL
export const getWeatherApiUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://haritnavinya.onrender.com';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

export const apiClient = {
  baseURL: getApiBaseUrl(),
  
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  },
};
