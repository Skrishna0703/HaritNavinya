import axios from 'axios';
import {
  getLastNDays,
  formatDate,
  parseDate,
  groupByCommodity,
  cleanRecord,
  filterByDate,
  getTopGainersLosers,
  getAveragePrice,
  getPriceInfo,
  getPriceTrendForCommodity,
  getCacheIfValid,
  setCacheWithTTL,
  handleAPIError,
  calculatePercentageChange,
  formatPercentChange
} from '../utils/helpers.js';

// In-memory cache for API responses (consider moving to Redis in production)
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AGMARKNET_API_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

// All Indian states and union territories
const ALL_INDIAN_STATES = [
  // States (28)
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories (8)
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry", "Ladakh"
];

// Mock market data for fallback when external API is unavailable
const MOCK_MARKET_DATA = [
  // Maharashtra
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Onion', Price: 2800, MinPrice: 2500, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Tomato', Price: 4500, MinPrice: 4200, MaxPrice: 5100, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Garlic', Price: 3200, MinPrice: 3000, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Ginger', Price: 2900, MinPrice: 2600, MaxPrice: 3300, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Potato', Price: 1300, MinPrice: 1000, MaxPrice: 1700, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Chilli', Price: 8200, MinPrice: 7800, MaxPrice: 8900, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Rice', Price: 2950, MinPrice: 2700, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Maharashtra', Market: 'Nashik', Commodity: 'Wheat', Price: 2180, MinPrice: 2050, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  
  // Gujarat
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Cotton', Price: 6200, MinPrice: 5800, MaxPrice: 6800, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Groundnut', Price: 5500, MinPrice: 5200, MaxPrice: 5900, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Cumin', Price: 7800, MinPrice: 7200, MaxPrice: 8400, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Sesame', Price: 5200, MinPrice: 4800, MaxPrice: 5800, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Onion', Price: 2600, MinPrice: 2400, MaxPrice: 3000, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Potato', Price: 1400, MinPrice: 1100, MaxPrice: 1800, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Tomato', Price: 4200, MinPrice: 3800, MaxPrice: 4800, Arrival_Date: '28/03/2026' },
  { State: 'Gujarat', Market: 'Ahmedabad', Commodity: 'Garlic', Price: 3100, MinPrice: 2900, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  
  // Punjab
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Wheat', Price: 2150, MinPrice: 2000, MaxPrice: 2350, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Rice', Price: 2890, MinPrice: 2700, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Maize', Price: 1850, MinPrice: 1750, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Cotton', Price: 6150, MinPrice: 5900, MaxPrice: 6500, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Potato', Price: 1250, MinPrice: 1000, MaxPrice: 1600, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Onion', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Punjab', Market: 'Ludhiana', Commodity: 'Tomato', Price: 4100, MinPrice: 3700, MaxPrice: 4600, Arrival_Date: '28/03/2026' },
  
  // Uttar Pradesh
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Potato', Price: 1200, MinPrice: 800, MaxPrice: 1600, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Onion', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Rice', Price: 2870, MinPrice: 2700, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Wheat', Price: 2140, MinPrice: 2000, MaxPrice: 2350, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Chilli', Price: 8500, MinPrice: 8000, MaxPrice: 9200, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Garlic', Price: 3150, MinPrice: 2950, MaxPrice: 3550, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Ginger', Price: 2850, MinPrice: 2550, MaxPrice: 3250, Arrival_Date: '28/03/2026' },
  { State: 'Uttar Pradesh', Market: 'Lucknow', Commodity: 'Tomato', Price: 4300, MinPrice: 3900, MaxPrice: 5000, Arrival_Date: '28/03/2026' },
  
  // Karnataka
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Coffee', Price: 12500, MinPrice: 11800, MaxPrice: 13200, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Arecanut', Price: 8900, MinPrice: 8400, MaxPrice: 9600, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Cardamom', Price: 15200, MinPrice: 14500, MaxPrice: 16000, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Tamarind', Price: 4200, MinPrice: 3900, MaxPrice: 4600, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Coconut', Price: 5600, MinPrice: 5200, MaxPrice: 6100, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Rice', Price: 2920, MinPrice: 2700, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Karnataka', Market: 'Bangalore', Commodity: 'Potato', Price: 1350, MinPrice: 1050, MaxPrice: 1750, Arrival_Date: '28/03/2026' },
  
  // Tamil Nadu
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Rice', Price: 2950, MinPrice: 2800, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Coconut', Price: 5800, MinPrice: 5400, MaxPrice: 6300, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Turmeric', Price: 7200, MinPrice: 6800, MaxPrice: 7900, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Pepper', Price: 11500, MinPrice: 11000, MaxPrice: 12300, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Sugarcane', Price: 3500, MinPrice: 3200, MaxPrice: 3900, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Onion', Price: 2650, MinPrice: 2350, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Potato', Price: 1280, MinPrice: 980, MaxPrice: 1680, Arrival_Date: '28/03/2026' },
  { State: 'Tamil Nadu', Market: 'Chennai', Commodity: 'Tomato', Price: 4400, MinPrice: 4000, MaxPrice: 5100, Arrival_Date: '28/03/2026' },
  
  // Bihar
  { State: 'Bihar', Market: 'Patna', Commodity: 'Rice', Price: 2880, MinPrice: 2700, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Wheat', Price: 2185, MinPrice: 2050, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Potato', Price: 1180, MinPrice: 900, MaxPrice: 1550, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Maize', Price: 1900, MinPrice: 1750, MaxPrice: 2100, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Garlic', Price: 3100, MinPrice: 2900, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Ginger', Price: 2820, MinPrice: 2520, MaxPrice: 3220, Arrival_Date: '28/03/2026' },
  { State: 'Bihar', Market: 'Patna', Commodity: 'Tomato', Price: 4200, MinPrice: 3800, MaxPrice: 4800, Arrival_Date: '28/03/2026' },
  
  // West Bengal
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Rice', Price: 2910, MinPrice: 2700, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Jute', Price: 4800, MinPrice: 4400, MaxPrice: 5300, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Potato', Price: 1220, MinPrice: 950, MaxPrice: 1600, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Onion', Price: 2680, MinPrice: 2400, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Mustard', Price: 5200, MinPrice: 4900, MaxPrice: 5800, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Ginger', Price: 2880, MinPrice: 2580, MaxPrice: 3280, Arrival_Date: '28/03/2026' },
  { State: 'West Bengal', Market: 'Kolkata', Commodity: 'Tomato', Price: 4100, MinPrice: 3700, MaxPrice: 4600, Arrival_Date: '28/03/2026' },
  
  // Rajasthan
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Mustard', Price: 5150, MinPrice: 4850, MaxPrice: 5750, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Chilli', Price: 8450, MinPrice: 7950, MaxPrice: 9150, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Gram', Price: 5600, MinPrice: 5200, MaxPrice: 6100, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Barley', Price: 1750, MinPrice: 1550, MaxPrice: 1950, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Maize', Price: 1920, MinPrice: 1750, MaxPrice: 2150, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Onion', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Potato', Price: 1300, MinPrice: 1000, MaxPrice: 1700, Arrival_Date: '28/03/2026' },
  { State: 'Rajasthan', Market: 'Jaipur', Commodity: 'Cotton', Price: 6100, MinPrice: 5800, MaxPrice: 6600, Arrival_Date: '28/03/2026' },
  
  // Telangana
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Rice', Price: 2920, MinPrice: 2750, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Cotton', Price: 6280, MinPrice: 5950, MaxPrice: 6700, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Chilli', Price: 8520, MinPrice: 8000, MaxPrice: 9200, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Turmeric', Price: 7300, MinPrice: 6900, MaxPrice: 8050, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Potato', Price: 1320, MinPrice: 1020, MaxPrice: 1720, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Garlic', Price: 3120, MinPrice: 2920, MaxPrice: 3520, Arrival_Date: '28/03/2026' },
  { State: 'Telangana', Market: 'Hyderabad', Commodity: 'Tomato', Price: 4350, MinPrice: 3950, MaxPrice: 5050, Arrival_Date: '28/03/2026' },
  
  // Kerala
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Coconut', Price: 5950, MinPrice: 5500, MaxPrice: 6450, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Pepper', Price: 11500, MinPrice: 11000, MaxPrice: 12300, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Cardamom', Price: 15500, MinPrice: 14800, MaxPrice: 16400, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Rubber', Price: 18200, MinPrice: 17400, MaxPrice: 19200, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Rice', Price: 3050, MinPrice: 2850, MaxPrice: 3350, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Onion', Price: 2800, MinPrice: 2500, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Potato', Price: 1450, MinPrice: 1150, MaxPrice: 1850, Arrival_Date: '28/03/2026' },
  { State: 'Kerala', Market: 'Kochi', Commodity: 'Garlic', Price: 3200, MinPrice: 3000, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  
  // Andhra Pradesh
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Rice', Price: 2900, MinPrice: 2700, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Groundnut', Price: 5400, MinPrice: 5100, MaxPrice: 5800, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Onion', Price: 2720, MinPrice: 2420, MaxPrice: 3120, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Potato', Price: 1310, MinPrice: 1010, MaxPrice: 1710, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Tomato', Price: 4280, MinPrice: 3880, MaxPrice: 4880, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Chilli', Price: 8350, MinPrice: 7850, MaxPrice: 9050, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Garlic', Price: 3130, MinPrice: 2930, MaxPrice: 3530, Arrival_Date: '28/03/2026' },
  { State: 'Andhra Pradesh', Market: 'Visakhapatnam', Commodity: 'Maize', Price: 1880, MinPrice: 1750, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  
  // Arunachal Pradesh
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Rice', Price: 3100, MinPrice: 2900, MaxPrice: 3400, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Onion', Price: 3050, MinPrice: 2750, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Potato', Price: 1650, MinPrice: 1350, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Ginger', Price: 3200, MinPrice: 2900, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Garlic', Price: 3500, MinPrice: 3300, MaxPrice: 3900, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Tomato', Price: 4600, MinPrice: 4200, MaxPrice: 5200, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Maize', Price: 2050, MinPrice: 1850, MaxPrice: 2350, Arrival_Date: '28/03/2026' },
  { State: 'Arunachal Pradesh', Market: 'Itanagar', Commodity: 'Mustard', Price: 5400, MinPrice: 5100, MaxPrice: 5900, Arrival_Date: '28/03/2026' },
  
  // Assam
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Rice', Price: 2850, MinPrice: 2650, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Tea', Price: 22500, MinPrice: 21000, MaxPrice: 24000, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Onion', Price: 2650, MinPrice: 2350, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Potato', Price: 1150, MinPrice: 900, MaxPrice: 1500, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Ginger', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Garlic', Price: 2950, MinPrice: 2750, MaxPrice: 3350, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Tomato', Price: 3950, MinPrice: 3550, MaxPrice: 4550, Arrival_Date: '28/03/2026' },
  { State: 'Assam', Market: 'Guwahati', Commodity: 'Maize', Price: 1750, MinPrice: 1550, MaxPrice: 1950, Arrival_Date: '28/03/2026' },
  
  // Chhattisgarh
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Rice', Price: 2800, MinPrice: 2600, MaxPrice: 3000, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Maize', Price: 1900, MinPrice: 1750, MaxPrice: 2100, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Onion', Price: 2600, MinPrice: 2300, MaxPrice: 3000, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Potato', Price: 1200, MinPrice: 900, MaxPrice: 1600, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Gram', Price: 5500, MinPrice: 5100, MaxPrice: 6000, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Ginger', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Chhattisgarh', Market: 'Raipur', Commodity: 'Tomato', Price: 4050, MinPrice: 3650, MaxPrice: 4650, Arrival_Date: '28/03/2026' },
  
  // Goa
  { State: 'Goa', Market: 'Panaji', Commodity: 'Coconut', Price: 5700, MinPrice: 5300, MaxPrice: 6200, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Cashew', Price: 24000, MinPrice: 22000, MaxPrice: 26000, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Rice', Price: 2920, MinPrice: 2700, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Onion', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Potato', Price: 1300, MinPrice: 1000, MaxPrice: 1700, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Tomato', Price: 4200, MinPrice: 3800, MaxPrice: 4800, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Garlic', Price: 3150, MinPrice: 2950, MaxPrice: 3550, Arrival_Date: '28/03/2026' },
  { State: 'Goa', Market: 'Panaji', Commodity: 'Arecanut', Price: 8700, MinPrice: 8200, MaxPrice: 9400, Arrival_Date: '28/03/2026' },
  
  // Haryana
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Wheat', Price: 2220, MinPrice: 2080, MaxPrice: 2450, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Rice', Price: 2950, MinPrice: 2750, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Maize', Price: 1950, MinPrice: 1800, MaxPrice: 2150, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Potato', Price: 1250, MinPrice: 950, MaxPrice: 1650, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Garlic', Price: 3100, MinPrice: 2900, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Ginger', Price: 2850, MinPrice: 2550, MaxPrice: 3250, Arrival_Date: '28/03/2026' },
  { State: 'Haryana', Market: 'Hisar', Commodity: 'Tomato', Price: 4150, MinPrice: 3750, MaxPrice: 4750, Arrival_Date: '28/03/2026' },
  
  // Himachal Pradesh
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Apple', Price: 8200, MinPrice: 7800, MaxPrice: 8900, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Potato', Price: 1450, MinPrice: 1150, MaxPrice: 1850, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Onion', Price: 2900, MinPrice: 2600, MaxPrice: 3300, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Tomato', Price: 4400, MinPrice: 4000, MaxPrice: 5000, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Garlic', Price: 3200, MinPrice: 3000, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Ginger', Price: 3100, MinPrice: 2800, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Wheat', Price: 2200, MinPrice: 2050, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Himachal Pradesh', Market: 'Shimla', Commodity: 'Maize', Price: 1950, MinPrice: 1800, MaxPrice: 2150, Arrival_Date: '28/03/2026' },
  
  // Jharkhand
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Rice', Price: 2870, MinPrice: 2650, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Maize', Price: 1850, MinPrice: 1700, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Onion', Price: 2680, MinPrice: 2380, MaxPrice: 3080, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Potato', Price: 1180, MinPrice: 900, MaxPrice: 1550, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Ginger', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Tomato', Price: 4100, MinPrice: 3700, MaxPrice: 4700, Arrival_Date: '28/03/2026' },
  { State: 'Jharkhand', Market: 'Ranchi', Commodity: 'Wheat', Price: 2150, MinPrice: 2000, MaxPrice: 2350, Arrival_Date: '28/03/2026' },
  
  // Madhya Pradesh
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Soybean', Price: 5900, MinPrice: 5500, MaxPrice: 6400, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Gram', Price: 5700, MinPrice: 5300, MaxPrice: 6200, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Wheat', Price: 2180, MinPrice: 2050, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Onion', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Potato', Price: 1280, MinPrice: 980, MaxPrice: 1680, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Tomato', Price: 4150, MinPrice: 3750, MaxPrice: 4750, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Garlic', Price: 3100, MinPrice: 2900, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Madhya Pradesh', Market: 'Indore', Commodity: 'Chilli', Price: 8250, MinPrice: 7750, MaxPrice: 8950, Arrival_Date: '28/03/2026' },
  
  // Manipur
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Rice', Price: 3050, MinPrice: 2850, MaxPrice: 3350, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Onion', Price: 2900, MinPrice: 2600, MaxPrice: 3300, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Potato', Price: 1500, MinPrice: 1200, MaxPrice: 1900, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Tomato', Price: 4400, MinPrice: 4000, MaxPrice: 5000, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Garlic', Price: 3250, MinPrice: 3050, MaxPrice: 3650, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Ginger', Price: 3000, MinPrice: 2700, MaxPrice: 3400, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Cabbage', Price: 1850, MinPrice: 1550, MaxPrice: 2250, Arrival_Date: '28/03/2026' },
  { State: 'Manipur', Market: 'Imphal', Commodity: 'Carrot', Price: 2100, MinPrice: 1800, MaxPrice: 2500, Arrival_Date: '28/03/2026' },
  
  // Meghalaya
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Rice', Price: 3150, MinPrice: 2950, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Potato', Price: 1550, MinPrice: 1250, MaxPrice: 1950, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Onion', Price: 3000, MinPrice: 2700, MaxPrice: 3400, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Cabbage', Price: 1900, MinPrice: 1600, MaxPrice: 2300, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Carrot', Price: 2200, MinPrice: 1900, MaxPrice: 2600, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Tomato', Price: 4500, MinPrice: 4100, MaxPrice: 5100, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Ginger', Price: 3200, MinPrice: 2900, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Meghalaya', Market: 'Shillong', Commodity: 'Garlic', Price: 3300, MinPrice: 3100, MaxPrice: 3700, Arrival_Date: '28/03/2026' },
  
  // Mizoram
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Rice', Price: 3200, MinPrice: 3000, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Onion', Price: 3050, MinPrice: 2750, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Potato', Price: 1600, MinPrice: 1300, MaxPrice: 2000, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Tomato', Price: 4550, MinPrice: 4150, MaxPrice: 5150, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Cabbage', Price: 1950, MinPrice: 1650, MaxPrice: 2350, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Garlic', Price: 3400, MinPrice: 3200, MaxPrice: 3800, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Ginger', Price: 3250, MinPrice: 2950, MaxPrice: 3650, Arrival_Date: '28/03/2026' },
  { State: 'Mizoram', Market: 'Aizawl', Commodity: 'Carrot', Price: 2250, MinPrice: 1950, MaxPrice: 2650, Arrival_Date: '28/03/2026' },
  
  // Nagaland
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Rice', Price: 3250, MinPrice: 3050, MaxPrice: 3550, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Onion', Price: 3100, MinPrice: 2800, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Potato', Price: 1650, MinPrice: 1350, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Tomato', Price: 4600, MinPrice: 4200, MaxPrice: 5200, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Ginger', Price: 3300, MinPrice: 3000, MaxPrice: 3700, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Garlic', Price: 3450, MinPrice: 3250, MaxPrice: 3850, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Cabbage', Price: 2000, MinPrice: 1700, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Nagaland', Market: 'Kohima', Commodity: 'Carrot', Price: 2300, MinPrice: 2000, MaxPrice: 2700, Arrival_Date: '28/03/2026' },
  
  // Odisha
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Rice', Price: 2880, MinPrice: 2650, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Onion', Price: 2680, MinPrice: 2380, MaxPrice: 3080, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Potato', Price: 1200, MinPrice: 900, MaxPrice: 1600, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Tomato', Price: 4100, MinPrice: 3700, MaxPrice: 4700, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Maize', Price: 1900, MinPrice: 1750, MaxPrice: 2100, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Ginger', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Odisha', Market: 'Bhubaneswar', Commodity: 'Mustard', Price: 5100, MinPrice: 4800, MaxPrice: 5700, Arrival_Date: '28/03/2026' },
  
  // Sikkim
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Cardamom', Price: 15800, MinPrice: 15100, MaxPrice: 16700, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Onion', Price: 3200, MinPrice: 2900, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Potato', Price: 1700, MinPrice: 1400, MaxPrice: 2100, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Ginger', Price: 3400, MinPrice: 3100, MaxPrice: 3800, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Garlic', Price: 3600, MinPrice: 3400, MaxPrice: 4000, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Tomato', Price: 4700, MinPrice: 4300, MaxPrice: 5300, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Rice', Price: 3300, MinPrice: 3100, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Sikkim', Market: 'Gangtok', Commodity: 'Apple', Price: 8500, MinPrice: 8100, MaxPrice: 9200, Arrival_Date: '28/03/2026' },
  
  // Tripura
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Rice', Price: 2920, MinPrice: 2700, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Potato', Price: 1350, MinPrice: 1050, MaxPrice: 1750, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Tomato', Price: 4200, MinPrice: 3800, MaxPrice: 4800, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Ginger', Price: 2800, MinPrice: 2500, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Garlic', Price: 3050, MinPrice: 2850, MaxPrice: 3450, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Rubber', Price: 17800, MinPrice: 17000, MaxPrice: 18800, Arrival_Date: '28/03/2026' },
  { State: 'Tripura', Market: 'Agartala', Commodity: 'Coconut', Price: 5600, MinPrice: 5200, MaxPrice: 6100, Arrival_Date: '28/03/2026' },
  
  // Uttarakhand
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Rice', Price: 3000, MinPrice: 2800, MaxPrice: 3300, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Wheat', Price: 2250, MinPrice: 2100, MaxPrice: 2500, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Onion', Price: 2950, MinPrice: 2650, MaxPrice: 3350, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Potato', Price: 1500, MinPrice: 1200, MaxPrice: 1900, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Apple', Price: 8300, MinPrice: 7900, MaxPrice: 9000, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Tomato', Price: 4350, MinPrice: 3950, MaxPrice: 4950, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Garlic', Price: 3200, MinPrice: 3000, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Uttarakhand', Market: 'Dehradun', Commodity: 'Ginger', Price: 3100, MinPrice: 2800, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  
  // Delhi
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Wheat', Price: 2220, MinPrice: 2080, MaxPrice: 2450, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Rice', Price: 2980, MinPrice: 2760, MaxPrice: 3210, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Onion', Price: 2800, MinPrice: 2500, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Potato', Price: 1300, MinPrice: 1000, MaxPrice: 1700, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Tomato', Price: 4350, MinPrice: 3950, MaxPrice: 4950, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Garlic', Price: 3200, MinPrice: 3000, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Ginger', Price: 2950, MinPrice: 2650, MaxPrice: 3350, Arrival_Date: '28/03/2026' },
  { State: 'Delhi', Market: 'Delhi', Commodity: 'Maize', Price: 1920, MinPrice: 1750, MaxPrice: 2150, Arrival_Date: '28/03/2026' },
  
  // Chandigarh
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Wheat', Price: 2200, MinPrice: 2050, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Rice', Price: 2930, MinPrice: 2710, MaxPrice: 3160, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Onion', Price: 2750, MinPrice: 2450, MaxPrice: 3150, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Potato', Price: 1280, MinPrice: 980, MaxPrice: 1680, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Tomato', Price: 4250, MinPrice: 3850, MaxPrice: 4850, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Garlic', Price: 3120, MinPrice: 2920, MaxPrice: 3520, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Ginger', Price: 2900, MinPrice: 2600, MaxPrice: 3300, Arrival_Date: '28/03/2026' },
  { State: 'Chandigarh', Market: 'Chandigarh', Commodity: 'Maize', Price: 1900, MinPrice: 1750, MaxPrice: 2100, Arrival_Date: '28/03/2026' },
  
  // Puducherry
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Rice', Price: 2960, MinPrice: 2740, MaxPrice: 3190, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Coconut', Price: 5750, MinPrice: 5350, MaxPrice: 6250, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Onion', Price: 2680, MinPrice: 2380, MaxPrice: 3080, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Potato', Price: 1320, MinPrice: 1020, MaxPrice: 1720, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Tomato', Price: 4280, MinPrice: 3880, MaxPrice: 4880, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Pepper', Price: 11200, MinPrice: 10700, MaxPrice: 12000, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Garlic', Price: 3080, MinPrice: 2880, MaxPrice: 3480, Arrival_Date: '28/03/2026' },
  { State: 'Puducherry', Market: 'Puducherry', Commodity: 'Ginger', Price: 2820, MinPrice: 2520, MaxPrice: 3220, Arrival_Date: '28/03/2026' },
  
  // Ladakh
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Potato', Price: 2000, MinPrice: 1800, MaxPrice: 2400, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Onion', Price: 3500, MinPrice: 3200, MaxPrice: 3900, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Tomato', Price: 5200, MinPrice: 4800, MaxPrice: 5800, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Garlic', Price: 4200, MinPrice: 4000, MaxPrice: 4600, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Ginger', Price: 4100, MinPrice: 3800, MaxPrice: 4500, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Apple', Price: 9000, MinPrice: 8500, MaxPrice: 9800, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Apricot', Price: 10500, MinPrice: 10000, MaxPrice: 11500, Arrival_Date: '28/03/2026' },
  { State: 'Ladakh', Market: 'Leh', Commodity: 'Wheat', Price: 2300, MinPrice: 2150, MaxPrice: 2550, Arrival_Date: '28/03/2026' },
  
  // Andaman and Nicobar Islands
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Coconut', Price: 6200, MinPrice: 5800, MaxPrice: 6800, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Rice', Price: 3200, MinPrice: 3000, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Onion', Price: 3400, MinPrice: 3100, MaxPrice: 3800, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Potato', Price: 1800, MinPrice: 1500, MaxPrice: 2200, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Tomato', Price: 4800, MinPrice: 4400, MaxPrice: 5400, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Garlic', Price: 3600, MinPrice: 3400, MaxPrice: 4000, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Fish', Price: 8000, MinPrice: 7500, MaxPrice: 8800, Arrival_Date: '28/03/2026' },
  { State: 'Andaman and Nicobar Islands', Market: 'Port Blair', Commodity: 'Banana', Price: 3500, MinPrice: 3200, MaxPrice: 3900, Arrival_Date: '28/03/2026' },
  
  // Dadra and Nagar Haveli
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Rice', Price: 2850, MinPrice: 2650, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Onion', Price: 2600, MinPrice: 2300, MaxPrice: 3000, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Potato', Price: 1250, MinPrice: 950, MaxPrice: 1650, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Tomato', Price: 4100, MinPrice: 3700, MaxPrice: 4700, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Groundnut', Price: 5300, MinPrice: 5000, MaxPrice: 5700, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Maize', Price: 1850, MinPrice: 1700, MaxPrice: 2050, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Garlic', Price: 3000, MinPrice: 2800, MaxPrice: 3400, Arrival_Date: '28/03/2026' },
  { State: 'Dadra and Nagar Haveli', Market: 'Silvassa', Commodity: 'Ginger', Price: 2700, MinPrice: 2400, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  
  // Daman and Diu
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Rice', Price: 2900, MinPrice: 2700, MaxPrice: 3100, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Onion', Price: 2650, MinPrice: 2350, MaxPrice: 3050, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Potato', Price: 1300, MinPrice: 1000, MaxPrice: 1700, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Tomato', Price: 4200, MinPrice: 3800, MaxPrice: 4800, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Fish', Price: 7800, MinPrice: 7300, MaxPrice: 8500, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Garlic', Price: 3100, MinPrice: 2900, MaxPrice: 3500, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Coconut', Price: 5500, MinPrice: 5100, MaxPrice: 6000, Arrival_Date: '28/03/2026' },
  { State: 'Daman and Diu', Market: 'Daman', Commodity: 'Ginger', Price: 2800, MinPrice: 2500, MaxPrice: 3200, Arrival_Date: '28/03/2026' },
  
  // Lakshadweep
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Coconut', Price: 6500, MinPrice: 6100, MaxPrice: 7000, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Rice', Price: 3300, MinPrice: 3100, MaxPrice: 3600, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Fish', Price: 8500, MinPrice: 8000, MaxPrice: 9200, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Banana', Price: 3800, MinPrice: 3500, MaxPrice: 4200, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Onion', Price: 3600, MinPrice: 3300, MaxPrice: 4000, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Mango', Price: 4200, MinPrice: 3900, MaxPrice: 4600, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Pumpkin', Price: 2200, MinPrice: 1900, MaxPrice: 2600, Arrival_Date: '28/03/2026' },
  { State: 'Lakshadweep', Market: 'Kavarati', Commodity: 'Brinjal', Price: 2850, MinPrice: 2550, MaxPrice: 3250, Arrival_Date: '28/03/2026' }
];

/**
 * Fetch data from Agmarknet API with caching
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} API response data
 */
async function fetchAgmarknetData(filters = {}) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured in environment variables');
    }

    // Build cache key from filters
    const cacheKey = JSON.stringify(filters);
    
    // Check cache first
    const cachedData = getCacheIfValid(apiCache, cacheKey);
    if (cachedData) {
      console.log('✅ Using cached data');
      return cachedData;
    }

    console.log('🔄 Fetching fresh data from Agmarknet API...');

    const params = {
      'api-key': apiKey,
      'format': 'json',
      'limit': 200,
      ...filters
    };

    const response = await axios.get(AGMARKNET_API_BASE, { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data || !response.data.records) {
      throw new Error('Invalid API response structure');
    }

    // Cache the response
    setCacheWithTTL(apiCache, cacheKey, response.data.records, CACHE_TTL);

    console.log(`✅ Fetched ${response.data.records.length} records from Agmarknet`);
    return response.data.records;

  } catch (error) {
    const errorInfo = handleAPIError(error, 'Agmarknet API Fetch');
    throw new Error(`Failed to fetch Agmarknet data: ${errorInfo.error}`);
  }
}

/**
 * GET /api/dashboard
 * Main dashboard endpoint returning today's prices, trends, gainers & losers
 */
export async function getDashboard(req, res) {
  try {
    const { state = 'Maharashtra', market, commodity = 'All' } = req.query;

    console.log(`📊 Dashboard request - State: ${state}, Market: ${market}, Commodity: ${commodity}`);

    // Build API filters
    const filters = {};
    if (state) {
      filters['filters[state]'] = state;
    }
    if (market) {
      filters['filters[market]'] = market;
    }

    // Fetch raw data from Agmarknet API
    console.log('🔄 Fetching from Agmarknet API...');
    const rawData = await fetchAgmarknetData(filters);

    // Clean all records
    const cleanedData = rawData.map(cleanRecord);

    if (cleanedData.length === 0) {
      console.log('⚠️ No data from API, using mock data...');
      let mockData = MOCK_MARKET_DATA.filter(record => {
        const stateMatches = !state || record.State.toLowerCase() === state.toLowerCase();
        const commodityMatches = commodity === 'All' || !commodity || record.Commodity.toLowerCase() === commodity.toLowerCase();
        return stateMatches && commodityMatches;
      });

      const todayPrices = mockData.map(record => ({
        commodity: record.Commodity,
        price: record.Price,
        market: record.Market,
        minPrice: record.MinPrice,
        maxPrice: record.MaxPrice,
        change: `+${Math.floor(Math.random() * 5)}%`,
        volume: Math.floor(Math.random() * 1000) + 100
      })).sort((a, b) => b.price - a.price);

      return res.status(200).json({
        success: true,
        state,
        source: 'mock',
        todayPrices: todayPrices.slice(0, 8),
        topGainers: todayPrices.slice(0, 3),
        topLosers: todayPrices.slice(-3),
        priceTrends: []
      });
    }

    // Group data by date
    const dataByDate = {};
    cleanedData.forEach(record => {
      const date = record.arrivalDate;
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }
      dataByDate[date].push(record);
    });

    // Get the latest date available
    const availableDates = Object.keys(dataByDate).sort().reverse();
    const latestDate = availableDates[0];
    const previousDate = availableDates.length > 1 ? availableDates[1] : null;

    const todayData = dataByDate[latestDate] || [];
    const yesterdayData = previousDate ? dataByDate[previousDate] : [];

    console.log(`📅 API Data - Date: ${latestDate}, Records: ${todayData.length}`);

    // Get today's prices grouped by commodity
    const todayGrouped = groupByCommodity(todayData);
    const yesterdayGrouped = groupByCommodity(yesterdayData);

    // Build today's prices array
    let todayPrices = Object.entries(todayGrouped)
      .map(([commodityName, records]) => {
        const { price, volume } = getPriceInfo(records);
        const yesterdayPrice = getAveragePrice(yesterdayGrouped[commodityName] || []);
        const percentChange = calculatePercentageChange(yesterdayPrice, price);

        return {
          commodity: commodityName,
          price: Math.round(price),
          market: records[0]?.market || 'Unknown',
          minPrice: Math.min(...records.map(r => r.minPrice || 0)),
          maxPrice: Math.max(...records.map(r => r.maxPrice || 0)),
          change: formatPercentChange(percentChange),
          volume,
          unit: 'Tonnes'
        };
      })
      .filter(item => {
        if (commodity !== 'All' && commodity) {
          return item.commodity.toLowerCase() === commodity.toLowerCase();
        }
        return true;
      })
      .sort((a, b) => b.price - a.price);

    // Get top gainers and losers
    const { topGainers, topLosers } = getTopGainersLosers(todayGrouped, yesterdayGrouped, 3);

    console.log(`✅ Returning ${todayPrices.length} prices for ${state}`);

    return res.status(200).json({
      success: true,
      state,
      source: 'agmarknet_api',
      dataDate: latestDate,
      todayPrices,
      topGainers,
      topLosers,
      priceTrends: []
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error.message);
    
    // Fallback to mock data on API error
    console.log('📦 Using mock data as fallback...');
    const { state = 'Maharashtra', commodity = 'All' } = req.query;
    
    let mockData = MOCK_MARKET_DATA.filter(record => {
      const stateMatches = !state || record.State.toLowerCase() === state.toLowerCase();
      const commodityMatches = commodity === 'All' || !commodity || record.Commodity.toLowerCase() === commodity.toLowerCase();
      return stateMatches && commodityMatches;
    });

    const todayPrices = mockData.map(record => ({
      commodity: record.Commodity,
      price: record.Price,
      market: record.Market,
      minPrice: record.MinPrice,
      maxPrice: record.MaxPrice,
      change: `+${Math.floor(Math.random() * 5)}%`,
      volume: Math.floor(Math.random() * 1000) + 100
    })).sort((a, b) => b.price - a.price);

    res.status(200).json({
      success: true,
      state,
      source: 'mock_fallback',
      message: 'Using mock data - API unavailable',
      todayPrices: todayPrices.slice(0, 8),
      topGainers: todayPrices.slice(0, 3),
      topLosers: todayPrices.slice(-3),
      priceTrends: []
    });
  }
}

/**
 * GET /api/trends
 * Get price trends for a commodity
 */
export async function getTrends(req, res) {
  try {
    const { state = 'Maharashtra', commodity = 'Onion', days = 7 } = req.query;
    console.log(`📈 Getting trends for ${commodity} in ${state} (${days} days)...`);

    // Return mock price trend data
    const trendData = [];
    const basePrice = Math.floor(Math.random() * 3000) + 1000;
    
    for (let i = days; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date: date.toISOString().split('T')[0],
        price: Math.floor(basePrice + (Math.random() - 0.5) * 500),
        volume: Math.floor(Math.random() * 500) + 100
      });
    }

    res.status(200).json({
      success: true,
      state,
      commodity,
      days,
      data: trendData
    });
  } catch (error) {
    console.error('❌ Trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends',
      error: error.message
    });
  }
}

/**
 * GET /api/available-states
 * Get list of states available in the database
 */
export async function getAvailableStates(req, res) {
  try {
    console.log('🌍 Fetching available states...');
    
    // Return all Indian states and union territories
    res.status(200).json({
      success: true,
      states: ALL_INDIAN_STATES,
      count: ALL_INDIAN_STATES.length
    });
  } catch (error) {
    console.error('❌ States fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
      message: error.message
    });
  }
}

/**
 * GET /api/available-commodities
 * Get list of commodities (optionally filtered by state)
 */
export async function getAvailableCommodities(req, res) {
  try {
    const { state } = req.query;
    console.log(`🌾 Fetching commodities${state ? ` for state: ${state}` : ''}...`);

    // Fetch all data and filter in JavaScript
    const filters = state ? { 'filters[state]': state } : {};
    const rawData = await fetchAgmarknetData(filters);
    
    // Extract unique commodities
    const commodities = [...new Set(rawData.map(r => r.Commodity).filter(Boolean))];

    console.log(`✅ Found ${commodities.length} commodities${state ? ` in ${state}` : ''}`);

    res.status(200).json({
      success: true,
      commodities: commodities.sort(),
      count: commodities.length,
      state: state || 'All States'
    });
  } catch (error) {
    console.error('❌ Commodities fetch error:', error.message);
    
    // Fallback to mock data
    let filtered = MOCK_MARKET_DATA;
    if (state) {
      filtered = filtered.filter(record => record.State && record.State.toLowerCase() === state.toLowerCase());
    }
    
    const commodities = [...new Set(filtered.map(record => record.Commodity).filter(Boolean))];

    res.status(200).json({
      success: true,
      commodities: commodities.sort(),
      count: commodities.length,
      state: state || 'All States',
      source: 'mock'
    });
  }
}

/**
 * GET /api/market-data
 * Get raw market data for a specific commodity and state
 */
export async function getMarketData(req, res) {
  try {
    const { state = 'Maharashtra', commodity, market, limit = 20 } = req.query;

    const filters = {};
    if (state) {
      filters['filters[state]'] = state;
    }
    if (market) {
      filters['filters[market]'] = market;
    }
    if (commodity) {
      filters['filters[commodity]'] = commodity;
    }

    const rawData = await fetchAgmarknetData(filters);
    const cleanedData = rawData
      .map(cleanRecord)
      .sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate))
      .slice(0, parseInt(limit) || 20);

    res.status(200).json({
      success: true,
      state,
      commodity: commodity || 'All',
      market: market || 'All Markets',
      count: cleanedData.length,
      data: cleanedData
    });
  } catch (error) {
    console.error('❌ Market data fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: error.message
    });
  }
}

/**
 * GET /api/mandi/debug
 * Debug endpoint to fetch raw data and log available records
 * Useful for troubleshooting data availability
 */
export async function getDebug(req, res) {
  try {
    console.log('🐛 Debug endpoint called - Fetching raw data without filters...');

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'API_KEY not configured',
        message: 'API_KEY not found in environment variables'
      });
    }

    // Fetch raw data with minimal filters
    const params = {
      'api-key': apiKey,
      'format': 'json',
      'limit': 100
    };

    console.log('📡 Calling Agmarknet API with params:', params);
    const response = await axios.get(AGMARKNET_API_BASE, { 
      params,
      timeout: 45000 // 45 second timeout for debug - API can be slow
    });

    // Log raw response structure
    console.log('📊 Raw API Response:');
    console.log('  - Record count:', response.data.records?.length || 0);
    if (response.data.records && response.data.records.length > 0) {
      console.log('  - First record:', JSON.stringify(response.data.records[0], null, 2));
      console.log('  - Available fields:', Object.keys(response.data.records[0]));
    }

    const records = response.data.records;

    // Handle empty data
    if (!records || records.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No data found from API',
        recordCount: 0,
        data: []
      });
    }

    // Get latest available date from dataset
    const latestDate = records.reduce((latest, item) => {
      const itemDate = new Date(item.Arrival_Date);
      const latestDateObj = new Date(latest);
      return itemDate > latestDateObj ? item.Arrival_Date : latest;
    }, records[0].Arrival_Date);

    console.log('📅 Latest available date in dataset:', latestDate);

    // Filter records by latest date
    const latestData = records.filter(item => item.Arrival_Date === latestDate);

    console.log(`✅ Found ${latestData.length} records for latest date (${latestDate})`);

    // Clean and simplify data
    const simplifiedData = latestData.map(item => ({
      commodity: item.Commodity,
      market: item.Market,
      price: Number(item.Modal_Price),
      date: item.Arrival_Date,
      state: item.State,
      min_price: Number(item.Min_Price),
      max_price: Number(item.Max_Price),
      arrival_date: item.Arrival_Date
    }));

    res.status(200).json({
      success: true,
      message: 'Debug data fetched successfully',
      latestDate,
      recordCount: simplifiedData.length,
      totalRecordsFetched: records.length,
      data: simplifiedData.slice(0, 20) // Return first 20 for preview
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error.message);
    
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status
    };

    if (error.response?.data) {
      errorDetails.apiResponse = error.response.data;
    }

    res.status(500).json({
      success: false,
      error: 'Debug fetch failed',
      details: errorDetails
    });
  }
}

/**
 * GET /api/health
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: 'Mandi API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
}
