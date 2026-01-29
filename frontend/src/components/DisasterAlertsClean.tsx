import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

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

export const DisasterAlerts = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<any>(INDIA_CENTER);
  const [zoom, setZoom] = useState(5);
  const [alerts, setAlerts] = useState<any[]>([]);
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
    fetch("http://localhost:4000/api/disaster/alerts")
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
    const socket = io("http://localhost:4000");
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
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Disaster Alerts</h3>
        <div className="text-sm text-gray-500">Live updates • India</div>
      </div>

      <div className="w-full rounded-2xl shadow-xl overflow-hidden border">
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: 330, width: "100%" }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToLocation coords={userLocation} />
          {userLocation ? <Marker position={userLocation} icon={L.divIcon({ className: "pulse-marker" as any })}><Popup>You are here</Popup></Marker> : <Circle center={INDIA_CENTER as any} radius={400000} pathOptions={{ fillOpacity: 0.02, color: "#0ea5e9" }} />}
          {alerts.map((a: any) => {
            const coords = a.coordinates || (a.state ? (STATE_COORDINATES as any)[a.state] : undefined);
            if (!coords) return null;
            const color = severityColor(a.severity || "Low");
            return (
              <Marker key={a.id} position={coords} icon={createAlertIcon(color)}>
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
    </div>
  );
};
