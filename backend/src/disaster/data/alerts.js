// In-memory alerts data (India-specific)
let alerts = [
  {
    id: "1",
    state: "Maharashtra",
    region: "maharashtra",
    type: "flood",
    severity: "High",
    title: "Heavy Rainfall Alert - IMD Warning",
    location: "Coastal Maharashtra",
    description: "IMD warns of heavy to very heavy rainfall in coastal Maharashtra. Risk of flash floods in ghat sections.",
    timeRemaining: "12 hours",
    affectedArea: "300 sq km",
    icon: "Cloud",
    color: "from-blue-400 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    coordinates: [18.5204, 73.8567],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    state: "Tamil Nadu",
    region: "tamil-nadu",
    type: "cyclone",
    severity: "High",
    title: "Cyclonic Disturbance - Bay of Bengal",
    location: "Tamil Nadu Coast",
    description: "Cyclonic circulation forming over Bay of Bengal. Heavy rain and strong winds expected in coastal districts.",
    timeRemaining: "18 hours",
    affectedArea: "400 sq km",
    icon: "Wind",
    color: "from-purple-400 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    coordinates: [11.1271, 78.6569],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    state: "Assam",
    region: "assam",
    type: "flood",
    severity: "High",
    title: "Brahmaputra River Rising - Flood Alert",
    location: "Assam Valley",
    description: "Brahmaputra and tributaries rising due to monsoon rains. Widespread flooding expected in riverine areas.",
    timeRemaining: "24 hours",
    affectedArea: "800 sq km",
    icon: "Cloud",
    color: "from-blue-400 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    coordinates: [26.2006, 92.9376],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    state: "Kerala",
    region: "kerala",
    type: "landslide",
    severity: "Medium",
    title: "Landslide Risk - Western Ghats",
    location: "Idukki, Wayanad",
    description: "Heavy rainfall may trigger landslides in hilly areas. Avoid vulnerable slopes.",
    timeRemaining: "48 hours",
    affectedArea: "150 sq km",
    icon: "AlertTriangle",
    color: "from-orange-400 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    coordinates: [10.8505, 76.2711],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    state: "Uttar Pradesh",
    region: "uttar-pradesh",
    type: "heatwave",
    severity: "Medium",
    title: "Heat Wave Advisory",
    location: "Central Uttar Pradesh",
    description: "High temperature and high humidity expected. Heat index may reach 45-48°C. Precautions advised.",
    timeRemaining: "3 days",
    affectedArea: "2000 sq km",
    icon: "Sun",
    color: "from-orange-400 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    coordinates: [26.8467, 80.9462],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    state: "Gujarat",
    region: "gujarat",
    type: "drought",
    severity: "Low",
    title: "Water Conservation Advisory",
    location: "North Gujarat",
    description: "Below-average rainfall expected in parts of North Gujarat. Plan irrigation accordingly.",
    timeRemaining: "Ongoing",
    affectedArea: "600 sq km",
    icon: "Droplet",
    color: "from-green-400 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    coordinates: [22.2587, 71.1924],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function getAlerts(region = null) {
  if (region) {
    return alerts.filter(a => a.region.toLowerCase() === region.toLowerCase());
  }
  return alerts;
}

export function getAlertById(id) {
  return alerts.find(a => a.id === id);
}

export function createAlert(alertData) {
  const newAlert = {
    id: String(Math.max(0, ...alerts.map(a => parseInt(a.id))) + 1),
    ...alertData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  alerts.push(newAlert);
  return newAlert;
}

export function updateAlert(id, updates) {
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    Object.assign(alert, updates, { updatedAt: new Date() });
  }
  return alert;
}

export function deleteAlert(id) {
  const index = alerts.findIndex(a => a.id === id);
  if (index > -1) {
    alerts.splice(index, 1);
    return true;
  }
  return false;
}

export { alerts };
