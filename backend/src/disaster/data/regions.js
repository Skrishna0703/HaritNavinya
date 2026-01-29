// In-memory regions data (Indian States)
const regions = [
  { 
    name: "maharashtra", 
    state: "Maharashtra",
    coordinates: [19.7515, 75.7139], 
    risk: "High",
    description: "Maharashtra State, Western India"
  },
  { 
    name: "tamil-nadu", 
    state: "Tamil Nadu",
    coordinates: [11.1271, 78.6569], 
    risk: "High",
    description: "Tamil Nadu State, Southern India"
  },
  { 
    name: "kerala", 
    state: "Kerala",
    coordinates: [10.8505, 76.2711], 
    risk: "High",
    description: "Kerala State, Southwest Coast"
  },
  { 
    name: "assam", 
    state: "Assam",
    coordinates: [26.2006, 92.9376], 
    risk: "High",
    description: "Assam State, Northeast India"
  },
  { 
    name: "uttar-pradesh", 
    state: "Uttar Pradesh",
    coordinates: [26.8467, 80.9462], 
    risk: "Medium",
    description: "Uttar Pradesh State, Northern India"
  },
  { 
    name: "rajasthan", 
    state: "Rajasthan",
    coordinates: [27.0238, 74.2179], 
    risk: "Medium",
    description: "Rajasthan State, Northwest India"
  },
  { 
    name: "gujarat", 
    state: "Gujarat",
    coordinates: [22.2587, 71.1924], 
    risk: "Medium",
    description: "Gujarat State, Western India"
  },
  { 
    name: "delhi", 
    state: "Delhi",
    coordinates: [28.7041, 77.1025], 
    risk: "Low",
    description: "National Capital Territory, North India"
  }
];

export function getRegions() {
  return regions;
}

export function getRegionByName(name) {
  return regions.find(r => r.name.toLowerCase() === name.toLowerCase());
}

export { regions };
