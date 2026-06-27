import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, ArrowLeft, MapPin, Activity, AlertCircle, Wifi, WifiOff, MapIcon } from "lucide-react";

const iconUrl = new URL("../../node_modules/leaflet/dist/images/marker-icon.png", import.meta.url).href;
const iconRetinaUrl = new URL("../../node_modules/leaflet/dist/images/marker-icon-2x.png", import.meta.url).href;
const shadowUrl = new URL("../../node_modules/leaflet/dist/images/marker-shadow.png", import.meta.url).href;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const INDIA_CENTER = [22.9734, 78.6569];

const STATE_COORDINATES = {
  // States
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.5941, 85.1376],
  "Chhattisgarh": [21.2787, 81.8661],
  "Goa": [15.2993, 73.8243],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 77.0745],
  "Himachal Pradesh": [31.7433, 77.1205],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1815, 92.9789],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550],
  // Union Territories
  "Andaman & Nicobar": [11.7401, 92.6586],
  "Chandigarh": [30.7333, 76.7794],
  "Dadra & Nagar Haveli": [20.1809, 73.0292],
  "Daman & Diu": [20.7148, 72.8479],
  "Delhi": [28.7041, 77.1025],
  "Jammu & Kashmir": [33.7782, 76.5769],
  "Ladakh": [34.1526, 77.5770],
  "Puducherry": [11.9416, 79.8083],
};

const severityColor = (s) => {
  if (!s) return "#22C55E";
  if (s.toLowerCase() === "high") return "#EF4444";
  if (s.toLowerCase() === "medium") return "#F97316";
  return "#22C55E";
};

function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 10, { duration: 1.0 });
  }, [coords, map]);
  return null;
}

// Helper to detect disaster type from alert text
const detectDisasterType = (text: string) => {
  const lower = (text || "").toLowerCase();
  if (lower.includes("cyclone") || lower.includes("cyclonic")) return "cyclone";
  if (lower.includes("flood") || lower.includes("flooding")) return "flood";
  if (lower.includes("earthquake") || lower.includes("seismic")) return "earthquake";
  if (lower.includes("tsunami")) return "tsunami";
  if (lower.includes("landslide") || lower.includes("land slide")) return "landslide";
  if (lower.includes("heat") || lower.includes("heatwave") || lower.includes("heat wave")) return "heatwave";
  if (lower.includes("drought")) return "drought";
  if (lower.includes("thunder") || lower.includes("lightning") || lower.includes("storm")) return "thunderstorm";
  if (lower.includes("heavy rain") || lower.includes("rainfall") || lower.includes("rain")) return "flood";
  if (lower.includes("cold wave") || lower.includes("cold")) return "coldwave";
  if (lower.includes("fog") || lower.includes("dense fog")) return "fog";
  return "other";
};

// Helper to infer severity from alert text
const inferSeverity = (text: string) => {
  const lower = (text || "").toLowerCase();
  if (lower.includes("red alert") || lower.includes("extreme") || lower.includes("very heavy") || lower.includes("severe") || lower.includes("cyclone") || lower.includes("tsunami") || lower.includes("earthquake")) return "High";
  if (lower.includes("orange alert") || lower.includes("heavy") || lower.includes("warning") || lower.includes("flood") || lower.includes("landslide")) return "Medium";
  return "Low";
};

// States to fetch alerts for (key disaster-prone states)
const ALERT_STATES = [
  "maharashtra", "tamil nadu", "kerala", "assam", "uttar pradesh",
  "gujarat", "rajasthan", "odisha", "west bengal", "karnataka",
  "andhra pradesh", "bihar", "uttarakhand", "himachal pradesh", "delhi"
];

// Capitalize state name for display
const capitalizeState = (s: string) => s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function DisasterAlerts({ onBack }) {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const styleId = "disaster-alerts-pulse-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `.pulse-marker { width: 16px; height: 16px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 0 0 rgba(59,130,246, 0.5); position: relative; animation: pulse 2s infinite; border: 2px solid white; } @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59,130,246, 0.6); } 70% { box-shadow: 0 0 0 14px rgba(59,130,246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59,130,246, 0); } }`;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    // Use port 5000 (main server) which has the real NDMA SACHET RSS feed integration
    const API_BASE = import.meta.env.PROD
      ? (import.meta.env.VITE_API_BASE_URL || 'https://haritnavinya.onrender.com')
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

    const fetchAllAlerts = async () => {
      setLoading(true);
      const allAlerts: any[] = [];
      let idCounter = 1;

      // Fetch alerts from multiple states in parallel
      const fetchPromises = ALERT_STATES.map(async (state) => {
        try {
          const response = await fetch(`${API_BASE}/api/disaster/alerts?state=${encodeURIComponent(state)}`);
          const data = await response.json();
          const stateAlerts = data.alerts || [];
          const displayState = capitalizeState(state);

          return stateAlerts.map((a: any) => {
            const combinedText = `${a.title || ""} ${a.description || ""}`;
            const type = detectDisasterType(combinedText);
            const severity = inferSeverity(combinedText);

            return {
              id: String(idCounter++),
              title: a.title || "Alert",
              description: a.description || "No description available",
              state: displayState,
              region: state.replace(/\s+/g, "-"),
              type,
              severity,
              link: a.link || "",
              date: a.date || a.pubDate || new Date().toISOString(),
              timeRemaining: a.date ? new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
              affectedArea: displayState,
              coordinates: STATE_COORDINATES[displayState] || INDIA_CENTER,
              icon: type === "flood" ? "Cloud" : type === "cyclone" ? "Wind" : type === "heatwave" ? "Sun" : type === "earthquake" ? "Activity" : "AlertTriangle",
            };
          });
        } catch (err) {
          console.warn(`Failed to fetch alerts for ${state}:`, err);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      results.forEach((stateAlerts) => allAlerts.push(...stateAlerts));

      // Sort by date (newest first)
      allAlerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAlerts(allAlerts);
      setConnected(allAlerts.length > 0);
      setLoading(false);
    };

    fetchAllAlerts();

    // Refresh alerts every 5 minutes
    const refreshInterval = setInterval(fetchAllAlerts, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
        },
        () => {
          setUserLocation(null);
          setMapCenter(INDIA_CENTER);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              Real-Time Disaster Alerts
            </h1>
            <p className="text-slate-400 mt-1">India-Wide Monitoring System</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
            {loading ? (
              <>
                <Activity className="w-4 h-4 text-yellow-500 animate-spin" />
                <span className="text-yellow-500 text-sm font-medium">Fetching NDMA alerts...</span>
              </>
            ) : connected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-green-500 text-sm font-medium">{alerts.length} alerts from NDMA</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-red-500 text-sm font-medium">No alerts available</span>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 overflow-hidden">
              <CardHeader className="bg-slate-700/50 border-b border-slate-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-blue-500" />
                  Interactive Disaster Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 rounded-b-lg overflow-hidden">
                  <MapContainer center={mapCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <FlyToLocation coords={mapCenter} />
                    {userLocation && (
                      <Marker position={userLocation} icon={L.divIcon({ className: "pulse-marker" })}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold text-blue-600"> Your Location</p>
                            <p className="text-xs text-slate-600">[{userLocation[0].toFixed(2)}, {userLocation[1].toFixed(2)}]</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    {alerts.map((alert) => {
                      const coords = alert.coordinates || INDIA_CENTER;
                      const color = severityColor(alert.severity);
                      return (
                        <Marker
                          key={alert.id}
                          position={coords}
                          icon={L.divIcon({
                            className: "alert-marker",
                            html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 3px solid white; cursor: pointer; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
                          })}
                          eventHandlers={{ click: () => setSelectedAlert(alert) }}
                        >
                          <Popup>
                            <div className="max-w-xs">
                              <h3 className="font-bold text-slate-900">{alert.title}</h3>
                              <Badge className="mt-2" variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "default" : "secondary"}>
                                {alert.severity}
                              </Badge>
                              <p className="text-sm text-slate-700 mt-2">{alert.description}</p>
                              {alert.affectedArea && <p className="text-xs text-slate-600 mt-1"> {alert.affectedArea}</p>}
                              {alert.timeRemaining && <p className="text-xs text-slate-600"> {alert.timeRemaining}</p>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                    {userLocation && <Circle center={userLocation} radius={5000} pathOptions={{ color: "#3b82f6", weight: 2, opacity: 0.3 }} />}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-slate-700/50 border-b border-slate-600">
                <CardTitle className="text-white text-base">Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Alerts</span>
                  <span className="text-2xl font-bold text-white">{alerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">High Severity</span>
                  <Badge variant="destructive">{alerts.filter((a) => a.severity === "High").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Medium Severity</span>
                  <Badge variant="default">{alerts.filter((a) => a.severity === "Medium").length}</Badge>
                </div>
              </CardContent>
            </Card>
            {selectedAlert && (
              <Card className="bg-blue-900/30 border-blue-600">
                <CardHeader className="bg-blue-800/50 border-b border-blue-600">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Alert Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  <div>
                    <p className="text-slate-400 text-xs">Title</p>
                    <p className="text-white font-semibold">{selectedAlert.title}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Severity</p>
                    <Badge className="mt-1" variant={selectedAlert.severity === "High" ? "destructive" : selectedAlert.severity === "Medium" ? "default" : "secondary"}>
                      {selectedAlert.severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">State</p>
                    <p className="text-white">{selectedAlert.state || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Description</p>
                    <p className="text-slate-300 text-sm">{selectedAlert.description}</p>
                  </div>
                  {selectedAlert.affectedArea && (
                    <div>
                      <p className="text-slate-400 text-xs">Affected Area</p>
                      <p className="text-slate-300">{selectedAlert.affectedArea}</p>
                    </div>
                  )}
                  {selectedAlert.timeRemaining && (
                    <div>
                      <p className="text-slate-400 text-xs">Time Remaining</p>
                      <p className="text-slate-300">{selectedAlert.timeRemaining}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-slate-700/50 border-b border-slate-600">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <button
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`w-full text-left p-3 rounded-lg border transition ${
                          selectedAlert?.id === alert.id ? "bg-blue-900/50 border-blue-500" : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ background: severityColor(alert.severity) }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{alert.title}</p>
                            <p className="text-slate-400 text-xs">{alert.state}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">No active alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
