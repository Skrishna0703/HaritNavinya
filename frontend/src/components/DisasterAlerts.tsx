import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
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
  "Maharashtra": [19.7515, 75.7139],
  "Gujarat": [22.2587, 71.1924],
  "Karnataka": [15.3173, 75.7139],
  "Tamil Nadu": [11.1271, 78.6569],
  "Delhi": [28.7041, 77.1025],
  "Kerala": [10.8505, 76.2711],
  "West Bengal": [22.9868, 87.8550],
  "Assam": [26.2006, 92.9376],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Rajasthan": [27.0238, 74.2179],
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

export default function DisasterAlerts({ onBack }) {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

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
    fetch("http://localhost:4000/api/disaster/alerts")
      .then((r) => r.json())
      .then((data) => {
        const alertsWithCoords = (data.alerts || data || []).map((a) => ({
          ...a,
          coordinates: a.coordinates || STATE_COORDINATES[a.state || a.region] || INDIA_CENTER,
        }));
        setAlerts(alertsWithCoords);
      })
      .catch((e) => console.error("Failed to fetch alerts:", e));
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

  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ["websocket", "polling"] });
    socket.on("connect", () => { setConnected(true); console.log(" Connected"); });
    socket.on("alert:new", (newAlert) => {
      const alertWithCoords = {
        ...newAlert,
        coordinates: newAlert.coordinates || STATE_COORDINATES[newAlert.state] || INDIA_CENTER,
      };
      setAlerts((prev) => [alertWithCoords, ...prev]);
    });
    socket.on("alert:update", (updatedAlert) => {
      setAlerts((prev) => prev.map((a) => (a.id === updatedAlert.id ? { ...a, ...updatedAlert } : a)));
    });
    socket.on("alert:delete", (alertId) => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    });
    socket.on("disconnect", () => setConnected(false));
    socketRef.current = socket;
    return () => socket.close();
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
            {connected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-green-500 text-sm font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-red-500 text-sm font-medium">Connecting...</span>
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
