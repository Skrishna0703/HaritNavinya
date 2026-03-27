# Mandi Price API - Setup & Testing Guide

## ✅ Setup Complete!

The Mandi Price API backend has been successfully integrated into your HaritNavinya project.

## Running the Servers

### Start Backend (Port 4000)
```bash
cd backend
node src/disaster-server.js
# or with npm
npm start
```

### Start Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

---

## API Endpoints

### 1. Fetch Mandi Prices
```
GET http://localhost:4000/api/mandi
```

**Test Example:**
```bash
curl "http://localhost:4000/api/mandi"
curl "http://localhost:4000/api/mandi?state=Maharashtra"
curl "http://localhost:4000/api/mandi?state=Maharashtra&commodity=Onion"
```

### 2. Get Available States
```
GET http://localhost:4000/api/mandi/states
```

**Test Example:**
```bash
curl "http://localhost:4000/api/mandi/states"
```

### 3. Get Available Commodities
```
GET http://localhost:4000/api/mandi/commodities
```

**Test Example:**
```bash
curl "http://localhost:4000/api/mandi/commodities"
curl "http://localhost:4000/api/mandi/commodities?state=Maharashtra"
```

### 4. Get Price Trends
```
GET http://localhost:4000/api/mandi/trends
```

**Test Example:**
```bash
curl "http://localhost:4000/api/mandi/trends?state=Maharashtra&commodity=Onion"
```

---

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── mandiController.js       ← Mandi API logic
│   ├── routes/
│   │   └── mandiRoutes.js          ← Route definitions
│   ├── disaster/
│   │   └── server.js               ← Main server (updated)
│   └── app.js
├── .env                            ← API key configuration
├── package.json
└── README-MANDI-API.md            ← Full API documentation
```

---

## Environment Variables

The API key is already configured in `.env`:

```env
AGMARKNET_API_KEY=579b464db66ec23bdd0000015ca1b2c8c1d74e0b9b3cd7a1ab59ae4f
```

To use your own API key:
1. Go to https://data.gov.in/
2. Sign up and register for Agmarknet API
3. Replace the key in `.env`

---

## Key Features

✅ **Real-time Data**: Fetches live agricultural commodity prices
✅ **State Filtering**: Get prices by state (Maharashtra, Punjab, etc.)
✅ **Commodity Filtering**: Search by commodity (Onion, Rice, Wheat, etc.)
✅ **Price Trends**: Analyze price movements with statistics
✅ **Pagination**: Support for limit and offset
✅ **Error Handling**: Comprehensive error responses
✅ **Logging**: Debug-friendly console logging
✅ **CORS Enabled**: Frontend can access the API
✅ **Production Ready**: Clean, modular code structure

---

## Testing the API

### Option 1: Using cURL
```bash
# Get all states
curl -X GET "http://localhost:4000/api/mandi/states"

# Get commodities in Maharashtra
curl -X GET "http://localhost:4000/api/mandi/commodities?state=Maharashtra"

# Get onion prices
curl -X GET "http://localhost:4000/api/mandi?commodity=Onion&limit=10"
```

### Option 2: Using Postman
1. Import the endpoints from the list above
2. Test with different query parameters
3. Observe response formats

### Option 3: Using Frontend
Create a component to call the API:

```typescript
async function fetchMandiPrices(state: string, commodity: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/mandi?state=${state}&commodity=${commodity}`
    );
    const data = await response.json();
    
    if (data.success) {
      console.log('Prices:', data.data);
      console.log('Total:', data.total);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Usage
fetchMandiPrices('Maharashtra', 'Onion');
```

---

## Response Example

```json
{
  "success": true,
  "data": [
    {
      "market": "Pune",
      "district": "Pune",
      "state": "Maharashtra",
      "commodity": "Onion",
      "variety": "N/A",
      "price": "1200",
      "min_price": "1100",
      "max_price": "1300",
      "modal_price": "1200",
      "date": "2026-03-20",
      "arrival_quantity": "5000"
    }
  ],
  "total": 1,
  "count": 1,
  "limit": 50,
  "offset": 0,
  "filters": {
    "state": "Maharashtra",
    "commodity": "Onion"
  }
}
```

---

## Troubleshooting

### API returns "No data available"
- Check if the state/commodity spelling is correct
- Try without filters first: `GET /api/mandi`
- Verify the API key in `.env` is correct

### CORS Error from Frontend
- Backend already has CORS enabled
- Ensure backend is running on port 4000
- Check browser console for exact error

### Timeout Error
- Agmarknet API might be slow
- The request timeout is set to 10 seconds
- Try again in a few moments

### API Key Invalid
- Regenerate the API key from data.gov.in
- Update the AGMARKNET_API_KEY in `.env`
- Restart the server

---

## Available States (India)

Andhra Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal

---

## Common Commodities

Chilli, Coconut, Cotton, Garlic, Ginger, Groundnut, Jowar, Maize, Mustard, Onion, Potato, Rice, Soyabean, Sugarcane, Turmeric, Wheat, etc.

---

## Performance Tips

1. **Use Pagination**: Add `limit=50&offset=0` for large requests
2. **Cache Results**: Store frequently requested data
3. **Filter Early**: Use state/commodity filters to reduce data
4. **Error Handling**: Implement retry logic for timeouts

---

## Production Deployment

Before deploying to production:

1. ✅ Move API key to secure environment variables
2. ✅ Add rate limiting to prevent abuse
3. ✅ Implement caching strategy
4. ✅ Add request logging
5. ✅ Test all error scenarios
6. ✅ Monitor API performance
7. ✅ Set up error alerting

---

## Documentation Files

- **README-MANDI-API.md** - Full API documentation
- **mandiController.js** - Implementation details
- **mandiRoutes.js** - Route definitions

---

## Server Status

✅ **Backend**: Running on http://localhost:4000
✅ **Frontend**: Running on http://localhost:3000
✅ **Mandi API**: Fully integrated and operational

---

**Created**: March 23, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
