# Weather Integration (Frontend & Backend)

This document explains how to run the backend and wire the frontend to it.

## Backend

1. Navigate to `backend/`.
2. Install dependencies:

   npm install

3. Add your OpenWeather API key to `backend/.env`:

   OPENWEATHER_API_KEY=your_key_here
   PORT=5000

   Get a free API key from: https://openweathermap.org/api

4. Run in development mode:

   npm run dev

The backend listens on `http://localhost:5000` by default and exposes `/api/weather?lat=..&lon=..`.

## Frontend

The frontend (Vite) component `frontend/src/components/WeatherForecast.tsx` now requests the user's geolocation and calls the backend:

- It uses `import.meta.env.VITE_API_BASE_URL` if present, otherwise falls back to `http://localhost:5000`.
- On component load, it requests browser geolocation permission (falls back to Pune if denied).
- It calls the backend with user's lat/lon and renders real weather data.

If you run the frontend with a dev server on a different port, you can either:

- Start the backend on port 5000 and let the frontend call `http://localhost:5000`.
- Or set `VITE_API_BASE_URL` in your frontend `.env` file to point to your backend.

Example `.env` for the frontend (project root or frontend root depending on setup):

VITE_API_BASE_URL=http://localhost:5000

## Quick Start (Local Development)

1. **Backend**:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on http://localhost:5000

2. **Frontend** (from project root):
   ```powershell
   npm run dev
   ```
   Frontend runs on http://localhost:5173 (Vite default)

3. Open app in browser and navigate to Weather Forecast page. Allow location access. The component will fetch weather for your coordinates.

## Deploy

- **Backend**: deploy as a Node.js app (Heroku, Render, Fly, Railway, etc.). Make sure to set `OPENWEATHER_API_KEY` environment variable.
- **Frontend**: deploy static app to Netlify/Vercel. Configure the frontend to call the backend by setting `VITE_API_BASE_URL` to the backend URL.

Example Netlify `.env`:
```
VITE_API_BASE_URL=https://your-backend-url.herokuapp.com
```

## Where to put the API key

- **Backend**: `backend/.env` (local) or environment variables in your hosting provider (production).
- **Do NOT** put the OpenWeather API key in the frontend or public repository.

## Testing the API

Test the backend endpoint directly:
```powershell
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:5000/api/weather?lat=18.5204&lon=73.8567' -UseBasicParsing | Select-Object -ExpandProperty Content"
```

You should get a JSON response with current weather, hourly forecast, weekly forecast, and farming advice.

## Troubleshooting

- **401 Unauthorized**: Your API key is invalid or doesn't have the right permissions. Get a new key from https://openweathermap.org/api
- **Connection refused**: Backend not running. Make sure `npm run dev` is running in the backend folder.
- **CORS errors**: Make sure the frontend is calling the right backend URL. Check `VITE_API_BASE_URL` env var.
- **No location data**: Browser geolocation is not working. Check browser permissions or use fallback (Pune).


