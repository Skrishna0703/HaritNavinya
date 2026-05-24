import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, AlertTriangle, MapPin, Clock, Target, RefreshCw } from "lucide-react";

// Fix default Leaflet icon paths for Vite (safe best-effort)
try {
  const iconUrl = new URL("../..//node_modules/leaflet/dist/images/marker-icon.png", import.meta.url).href;
  const iconRetinaUrl = new URL("../..//node_modules/leaflet/dist/images/marker-icon-2x.png", import.meta.url).href;
  const shadowUrl = new URL("../..//node_modules/leaflet/dist/images/marker-shadow.png", import.meta.url).href;
  (L.Icon.Default as any).mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
} catch (e) {
  // ignore in constrained environments
}

const INDIA_CENTER = [22.9734, 78.6569];

const STATE_COORDINATES: Record<string, [number, number]> = {
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

function severityColor(s: string) {
  if (!s) return "#22C55E";
  if (s.toLowerCase() === "high") return "#EF4444";
  if (s.toLowerCase() === "medium") return "#F97316";
  return "#22C55E";
}

function getAlertIcon(alertType: string | undefined): string {
  const type = (alertType || "").toLowerCase();
  if (type.includes("flood") || type.includes("rain") || type.includes("rainfall")) return "💧";
  if (type.includes("fire") || type.includes("heat") || type.includes("wave")) return "🔥";
  if (type.includes("cyclone") || type.includes("storm") || type.includes("wind")) return "🌪️";
  if (type.includes("earthquake") || type.includes("quake")) return "🌍";
  if (type.includes("lightning") || type.includes("thunder")) return "⚡";
  return "⚠️";
}

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 10, { duration: 1.0 });
  }, [coords, map]);
  return null;
}

export const DisasterAlerts = ({ onBack }: { onBack: () => void }) => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<any>(INDIA_CENTER);
  const [zoom, setZoom] = useState(5);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState('all');

  useEffect(() => {
    const styleId = "disaster-alerts-pulse-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
      .pulse-marker { width:20px; height:20px; border-radius:50%; background:#3b82f6; box-shadow:0 0 0 0 rgba(59,130,246,0.5); animation:pulse 2s infinite; border:3px solid white; }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(59,130,246,0.6);} 70%{box-shadow:0 0 0 14px rgba(59,130,246,0);} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0);} }
      .alert-marker { width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; font-size:28px; box-shadow:0 2px 8px rgba(0,0,0,0.3); cursor:pointer; transition:transform 0.2s; }
      .alert-marker:hover { transform: scale(1.15); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = import.meta.env.PROD ? 'https://haritnavinya.onrender.com' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        
        // Fetch from selected state or all major states for map view
        const statesToFetch = selectedState === 'all' ? 
          ['maharashtra', 'karnataka', 'tamil nadu', 'uttar pradesh', 'delhi', 'west bengal', 'assam', 'kerala', 'rajasthan', 'goa', 'gujarat', 'odisha']
          : [selectedState];
        
        let allAlerts: any[] = [];
        
        for (const state of statesToFetch) {
          try {
            const response = await fetch(`${API_BASE}/api/disaster/alerts?state=${state}`);
            const data = await response.json();
            const alertsArray = data.alerts || [];
            allAlerts = [...allAlerts, ...alertsArray.map((a: any) => ({ ...a, state: a.state || state }))];
          } catch (err) {
            console.error(`Failed to fetch alerts for ${state}:`, err);
          }
        }
        
        if (!mounted) return;
        
        const normalized = allAlerts.map((a: any) => {
          const state = a.state || selectedState || "India";
          const coords = a.coordinates || (STATE_COORDINATES as any)[state.replace(/^.*?(?=[A-Z])/g, '').trim()] || undefined;
          return {
            id: a.guid || a.id || String(Math.random()),
            state,
            title: a.title || a.type || "Alert",
            severity: a.severity || "Medium",
            description: a.description || a.contentSnippet || "",
            timeRemaining: a.timeRemaining || "",
            affectedArea: a.affectedArea || "",
            coordinates: coords,
            link: a.link || "",
            date: a.date || a.pubDate || new Date().toISOString(),
          };
        });
        
        setAlerts(normalized);
        
        if (normalized.length === 0) {
          setError("No alerts found for selected region");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch disaster alerts:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch alerts");
          setAlerts([]);
          setLoading(false);
        }
      }
    };
    
    fetchAlerts();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    
    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedState]);


  useEffect(() => {
    if (!navigator?.geolocation) { setMapCenter(INDIA_CENTER); setZoom(5); return; }
    const success = (pos: any) => { const coords = [pos.coords.latitude, pos.coords.longitude]; setUserLocation(coords); setMapCenter(coords); setZoom(10); };
    const error = () => { setUserLocation(null); setMapCenter(INDIA_CENTER); setZoom(5); };
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 });
  }, []);

  const createAlertIcon = (color: string, alertType?: string) => {
    const icon = getAlertIcon(alertType);
    return L.divIcon({
      className: "alert-marker",
      html: `<div style="background:${color}; width:100%; height:100%; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; font-size:28px; box-shadow:0 2px 8px rgba(0,0,0,0.3);">${icon}</div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -30],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Disaster Alerts</h1>
                <p className="text-red-100 text-sm">Real-time weather & disaster monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">Live Updates</div>
              <div className="text-xs text-red-100">Across India</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-2 border-red-200 shadow-xl">
              <CardContent className="p-0">
                <div className="rounded-xl overflow-hidden">
                  <MapContainer center={mapCenter} zoom={zoom} style={{ height: 500, width: "100%" }}>
                    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FlyToLocation coords={userLocation} />
                    {userLocation ? <Marker position={userLocation} icon={L.divIcon({ className: "pulse-marker" as any })}><Popup>You are here</Popup></Marker> : <Circle center={INDIA_CENTER as any} radius={400000} pathOptions={{ fillOpacity: 0.02, color: "#0ea5e9" }} />}
                    {alerts.map((a: any) => {
                      const coords = a.coordinates || (a.state ? (STATE_COORDINATES as any)[a.state] : undefined);
                      if (!coords) return null;
                      const color = severityColor(a.severity || "Low");
                      return (
                        <Marker key={a.id} position={coords} icon={createAlertIcon(color, a.title)} eventHandlers={{ click: () => setSelectedAlert(a) }}>
                          <Popup>
                            <div className="max-w-xs">
                              <h4 className="font-semibold">{a.title}</h4>
                              <div className="text-xs text-gray-600">{a.state}</div>
                              <div className="mt-2 text-sm">{a.description}</div>
                              <div className="mt-2 text-xs text-gray-500">
                                <div>Severity: <span style={{ color }}>{a.severity}</span></div>
                                {a.timeRemaining ? <div>Time remaining: {a.timeRemaining}</div> : null}
                                {a.affectedArea ? <div>Affected area: {a.affectedArea}</div> : null}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Details Section */}
          <div className="space-y-4">
            {/* State Selector */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">🇮🇳 All India</option>
                  {/* States */}
                  <optgroup label="States">
                    <option value="andhra pradesh">Andhra Pradesh</option>
                    <option value="arunachal pradesh">Arunachal Pradesh</option>
                    <option value="assam">Assam</option>
                    <option value="bihar">Bihar</option>
                    <option value="chhattisgarh">Chhattisgarh</option>
                    <option value="goa">Goa</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="haryana">Haryana</option>
                    <option value="himachal pradesh">Himachal Pradesh</option>
                    <option value="jharkhand">Jharkhand</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="kerala">Kerala</option>
                    <option value="madhya pradesh">Madhya Pradesh</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="manipur">Manipur</option>
                    <option value="meghalaya">Meghalaya</option>
                    <option value="mizoram">Mizoram</option>
                    <option value="nagaland">Nagaland</option>
                    <option value="odisha">Odisha</option>
                    <option value="punjab">Punjab</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="sikkim">Sikkim</option>
                    <option value="tamil nadu">Tamil Nadu</option>
                    <option value="telangana">Telangana</option>
                    <option value="tripura">Tripura</option>
                    <option value="uttar pradesh">Uttar Pradesh</option>
                    <option value="uttarakhand">Uttarakhand</option>
                    <option value="west bengal">West Bengal</option>
                  </optgroup>
                  {/* Union Territories */}
                  <optgroup label="Union Territories">
                    <option value="andaman & nicobar">Andaman & Nicobar Islands</option>
                    <option value="chandigarh">Chandigarh</option>
                    <option value="dadra & nagar haveli">Dadra & Nagar Haveli</option>
                    <option value="daman & diu">Daman & Diu</option>
                    <option value="delhi">Delhi</option>
                    <option value="jammu & kashmir">Jammu & Kashmir</option>
                    <option value="ladakh">Ladakh</option>
                    <option value="puducherry">Puducherry</option>
                  </optgroup>
                </select>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg">
                    {loading ? "Loading..." : `Active Alerts: ${alerts.length}`}
                  </h3>
                </div>
                
                {error && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> {error}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  {loading ? (
                    <p className="text-gray-500">Fetching NDMA alerts...</p>
                  ) : alerts.length === 0 ? (
                    <p className="text-green-600 font-semibold">✓ No active alerts - Stay safe!</p>
                  ) : (
                    <>
                      <p>High severity: {alerts.filter((a) => a.severity === "High" || a.severity?.toLowerCase() === "high").length}</p>
                      <p>Medium severity: {alerts.filter((a) => a.severity === "Medium" || a.severity?.toLowerCase() === "medium").length}</p>
                    </>
                  )}
                </div>
                
                <Button
                  onClick={() => {
                    setLoading(true);
                    const API_BASE = import.meta.env.PROD ? 'https://haritnavinya.onrender.com' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
                    
                    const statesToFetch = selectedState === 'all' ? 
                      ['maharashtra', 'karnataka', 'tamil nadu', 'uttar pradesh', 'delhi', 'west bengal', 'assam', 'kerala', 'rajasthan', 'goa', 'gujarat', 'odisha']
                      : [selectedState];
                    
                    let allAlerts: any[] = [];
                    let completed = 0;
                    
                    statesToFetch.forEach(state => {
                      fetch(`${API_BASE}/api/disaster/alerts?state=${state}`)
                        .then(r => r.json())
                        .then(data => {
                          const alertsArray = data.alerts || [];
                          allAlerts = [...allAlerts, ...alertsArray.map((a: any) => ({ 
                            ...a, 
                            state: a.state || state,
                            id: a.guid || a.id || String(Math.random()),
                          }))];
                          completed++;
                          if (completed === statesToFetch.length) {
                            const normalized = allAlerts.map((a: any) => ({
                              id: a.id,
                              state: a.state,
                              title: a.title || a.type || "Alert",
                              severity: a.severity || "Medium",
                              description: a.description || a.contentSnippet || "",
                              timeRemaining: a.timeRemaining || "",
                              affectedArea: a.affectedArea || "",
                              coordinates: a.coordinates || (STATE_COORDINATES as any)[a.state?.replace(/^.*?(?=[A-Z])/g, '').trim()] || undefined,
                              link: a.link || "",
                              date: a.date || a.pubDate || new Date().toISOString(),
                            }));
                            setAlerts(normalized);
                            setError(normalized.length === 0 ? "No alerts found" : null);
                            setLoading(false);
                          }
                        })
                        .catch(err => {
                          completed++;
                          if (completed === statesToFetch.length) {
                            setError(err.message);
                            setLoading(false);
                          }
                        });
                    });
                  }}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </Button>
              </CardContent>
            </Card>

            {/* Alerts List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                <Card className="bg-gray-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-600 text-sm">Loading alerts from NDMA SACHET...</p>
                  </CardContent>
                </Card>
              ) : alerts.length === 0 ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-green-700 font-semibold">All systems normal</p>
                    <p className="text-xs text-green-600 mt-1">No disaster alerts in your region</p>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`cursor-pointer transition border-l-4 ${selectedAlert?.id === alert.id ? "ring-2 ring-red-500" : ""}`}
                    style={{ borderLeftColor: severityColor(alert.severity) }}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-sm">{alert.title}</h4>
                        <span
                          className="text-xs px-2 py-1 rounded-full text-white font-semibold"
                          style={{ backgroundColor: severityColor(alert.severity) }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {alert.state}
                        </div>
                        {alert.affectedArea && (
                          <div className="flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            {alert.affectedArea}
                          </div>
                        )}
                        {alert.timeRemaining && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {alert.timeRemaining}
                          </div>
                        )}
                      </div>
                      {alert.description && (
                        <p className="text-xs text-gray-700 mt-2 line-clamp-2">{alert.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Alert Details */}
        {selectedAlert && (
          <Card className="mt-6 border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedAlert.title}</h2>
                  <p className="text-gray-600">{selectedAlert.state}</p>
                </div>
                <span
                  className="text-sm px-3 py-1 rounded-lg text-white font-bold"
                  style={{ backgroundColor: severityColor(selectedAlert.severity) }}
                >
                  {selectedAlert.severity} Severity
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">Region</p>
                  <p className="font-bold text-gray-800">{selectedAlert.state}</p>
                </div>
                {selectedAlert.affectedArea && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500">Affected Area</p>
                    <p className="font-bold text-gray-800">{selectedAlert.affectedArea}</p>
                  </div>
                )}
                {selectedAlert.timeRemaining && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500">Time Remaining</p>
                    <p className="font-bold text-gray-800">{selectedAlert.timeRemaining}</p>
                  </div>
                )}
              </div>

              {selectedAlert.description && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700"><strong>Description:</strong></p>
                  <p className="text-gray-600 mt-2">{selectedAlert.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
