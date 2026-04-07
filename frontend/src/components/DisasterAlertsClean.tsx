import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, AlertTriangle, MapPin, Clock, Target } from "lucide-react";

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
  Maharashtra: [19.7515, 75.7139],
  Gujarat: [22.2587, 71.1924],
  Karnataka: [15.3173, 75.7139],
  "Tamil Nadu": [11.1271, 78.6569],
  Delhi: [28.7041, 77.1025],
  Kerala: [10.8505, 76.2711],
  "West Bengal": [22.9868, 87.8550],
  Assam: [26.2006, 92.9376],
  "Uttar Pradesh": [26.8467, 80.9462],
  Rajasthan: [27.0238, 74.2179],
  Telangana: [18.1124, 79.0193],
  "Andhra Pradesh": [15.9129, 79.7400],
  Odisha: [20.9517, 85.0985],
};

function severityColor(s: string) {
  if (!s) return "#22C55E";
  if (s.toLowerCase() === "high") return "#EF4444";
  if (s.toLowerCase() === "medium") return "#F97316";
  return "#22C55E";
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
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const styleId = "disaster-alerts-pulse-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
      .pulse-marker { width:16px; height:16px; border-radius:50%; background:#3b82f6; box-shadow:0 0 0 0 rgba(59,130,246,0.5); animation:pulse 2s infinite; border:2px solid white; }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(59,130,246,0.6);} 70%{box-shadow:0 0 0 14px rgba(59,130,246,0);} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0);} }
      .alert-dot { width:14px; height:14px; border-radius:50%; display:block; border:2px solid white; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/api/disaster/alerts`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const normalized = (data || []).map((a: any) => {
          const state = a.state || a.region || "";
          const coords = a.coordinates || (STATE_COORDINATES as any)[state] || undefined;
          return {
            id: a.id || String(Math.random()),
            state,
            title: a.title || a.type || "Alert",
            severity: a.severity || "Low",
            description: a.description || "",
            timeRemaining: a.timeRemaining || "",
            affectedArea: a.affectedArea || "",
            coordinates: coords,
          };
        });
        setAlerts(normalized);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const socket = io(API_BASE);
    socketRef.current = socket;
    socket.on("connect", () => socket.emit("subscribe_state", { state: "India" }));
    socket.on("alert:new", (newAlert: any) => {
      const state = newAlert.state || newAlert.region || "";
      const coords = newAlert.coordinates || (STATE_COORDINATES as any)[state] || undefined;
      setAlerts((prev) => [{ id: newAlert.id || String(Math.random()), state, title: newAlert.title || newAlert.type || "Alert", severity: newAlert.severity || "Low", description: newAlert.description || "", timeRemaining: newAlert.timeRemaining || "", affectedArea: newAlert.affectedArea || "", coordinates: coords }, ...prev]);
    });
    socket.on("alert:update", (updated: any) => setAlerts((prev) => prev.map((a: any) => (a.id === updated.id ? { ...a, ...updated } : a))));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!navigator?.geolocation) { setMapCenter(INDIA_CENTER); setZoom(5); return; }
    const success = (pos: any) => { const coords = [pos.coords.latitude, pos.coords.longitude]; setUserLocation(coords); setMapCenter(coords); setZoom(10); };
    const error = () => { setUserLocation(null); setMapCenter(INDIA_CENTER); setZoom(5); };
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 });
  }, []);

  const createAlertIcon = (color: string) => L.divIcon({ className: "", html: `<span class=\"alert-dot\" style=\"background:${color}\"></span>`, iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10] });

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
                  <MapContainer center={mapCenter} zoom={zoom} style={{ height: 450, width: "100%" }}>
                    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FlyToLocation coords={userLocation} />
                    {userLocation ? <Marker position={userLocation} icon={L.divIcon({ className: "pulse-marker" as any })}><Popup>You are here</Popup></Marker> : <Circle center={INDIA_CENTER as any} radius={400000} pathOptions={{ fillOpacity: 0.02, color: "#0ea5e9" }} />}
                    {alerts.map((a: any) => {
                      const coords = a.coordinates || (a.state ? (STATE_COORDINATES as any)[a.state] : undefined);
                      if (!coords) return null;
                      const color = severityColor(a.severity || "Low");
                      return (
                        <Marker key={a.id} position={coords} icon={createAlertIcon(color)} eventHandlers={{ click: () => setSelectedAlert(a) }}>
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
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg">Active Alerts: {alerts.length}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {alerts.length === 0 ? (
                    <p className="text-green-600 font-semibold">✓ No active alerts - Stay safe!</p>
                  ) : (
                    <p>{alerts.filter((a) => a.severity === "High").length} High severity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alerts List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
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
