# Soil Health Card CSV Reader - React Application

A beginner-friendly React application that reads Soil Health Card data from a CSV file and displays interactive charts and soil insights with recommendations.

## 📋 Overview

This application demonstrates:
- ✅ Loading and parsing CSV files using PapaParse
- ✅ React state management with hooks (useState, useEffect)
- ✅ Dynamic form filtering (State → District)
- ✅ Interactive charts using Recharts
- ✅ Soil fertility score calculation
- ✅ Intelligent recommendation engine
- ✅ Responsive UI design
- ✅ Clean, modular component architecture

## 🗂️ File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SoilForm.jsx           # State/District selection form
│   │   ├── SoilChart.jsx          # NPK bar chart & fertility display
│   │   ├── SoilResult.jsx         # Results page with recommendations
│   │   └── SoilHealthApp.jsx      # Main orchestrator component
│   │
│   ├── utils/
│   │   └── csvParser.js           # CSV parsing & calculations
│   │
│   └── styles/
│       └── SoilHealthApp.css      # Complete styling
│
└── public/
    └── data/
        └── soil_health_card_dataset_2025_26.csv  # Dataset
```

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies (if not already done)
cd frontend
npm install papaparse

# Ensure Recharts is installed (should be already)
npm list recharts
```

### 2. Add Component to App

In your main `App.tsx` or `App.jsx`, import and use the component:

```jsx
import { SoilHealthApp } from './components/SoilHealthApp';

function App() {
  return <SoilHealthApp />;
}

export default App;
```

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` (or your Vite port) and select "Soil Health CSV Reader" or navigate directly to the component.

## 📊 Component Details

### SoilForm.jsx
**Purpose**: Cascading dropdown form for location selection

**Props**:
- `data` (Array): Parsed CSV data
- `onSubmit` (Function): Callback when form is submitted

**Features**:
- Automatically extracts unique states from CSV
- Filters districts based on selected state
- Submit button disabled until both fields selected

```jsx
<SoilForm 
  data={csvData} 
  onSubmit={(state, district) => handleSubmit(state, district)}
/>
```

### SoilChart.jsx
**Purpose**: Displays soil metrics using charts and tables

**Props**:
- `soilData` (Object): Soil measurements (N, P, K, pH, OC)
- `fertilityScore` (Number): Calculated score 0-100
- `category` (String): "Low", "Medium", or "High"

**Features**:
- Bar chart for NPK levels
- Circular fertility score display
- Detailed metrics table
- Color-coded status indicators

```jsx
<SoilChart 
  soilData={soilData}
  fertilityScore={75}
  category="High"
/>
```

### SoilResult.jsx
**Purpose**: Displays recommendations and summary

**Props**:
- `state` (String): Selected state
- `district` (String): Selected district
- `soilData` (Object): Soil measurements
- `recommendations` (Array): Generated recommendations
- `onBack` (Function): Callback to return to form

**Features**:
- Priority-based recommendation cards
- Quick summary grid
- Back navigation
- Disclaimer and guidance info

```jsx
<SoilResult
  state="Maharashtra"
  district="Pune"
  soilData={soilData}
  recommendations={recommendations}
  onBack={() => setView('form')}
/>
```

### SoilHealthApp.jsx
**Purpose**: Main orchestrator component

**Features**:
- Loads CSV on mount
- Manages application state
- Routes between Form and Results views
- Error handling and loading states
- Header and footer

**Usage**:
```jsx
import { SoilHealthApp } from './components/SoilHealthApp';

export default function App() {
  return <SoilHealthApp />;
}
```

## 🔧 csvParser.js Utilities

### parseCSV(csvPath)
Returns Promise with parsed CSV data

```javascript
const data = await parseCSV('/data/soil_health_card_dataset_2025_26.csv');
// Returns array of objects with numeric fields converted
```

### calculateFertilityScore(nitrogen, phosphorus, potassium)
Returns normalized score 0-100

```javascript
const score = calculateFertilityScore(185, 105, 165);
// Returns: 78
```

### determineFertilityCategory(score)
Returns "Low", "Medium", or "High"

```javascript
const category = determineFertilityCategory(78);
// Returns: "High"
```

### generateRecommendations(soilData)
Returns array of recommendation objects

```javascript
const recs = generateRecommendations({
  nitrogen: 35,
  phosphorus: 25,
  potassium: 50,
  pH: 8.2,
  organicCarbon: 0.5
});
// Returns array of 3 recommendations (N, P, OC issues)
```

## 📊 CSV Dataset Format

**Required columns**:
- `state` - State name
- `district` - District name
- `nitrogen` - Nitrogen level (ppm)
- `phosphorus` - Phosphorus level (ppm)
- `potassium` - Potassium level (ppm)
- `pH` - Soil pH value
- `organicCarbon` - Organic carbon percentage
- `category` - Soil category ("Low", "Medium", "High")

**Example row**:
```
Andhra Pradesh,Anantapur,185,95,155,7.2,0.85,Medium
```

**Location**: `/frontend/public/data/soil_health_card_dataset_2025_26.csv`

## 🧮 Fertility Calculation Logic

```javascript
// Normalization
const normalizedN = Math.min(nitrogen / 300, 1) * 100;
const normalizedP = Math.min(phosphorus / 200, 1) * 100;
const normalizedK = Math.min(potassium / 200, 1) * 100;

// Final Score
const score = (normalizedN + normalizedP + normalizedK) / 3;
```

**Category Thresholds**:
- Low: score < 40
- Medium: 40 ≤ score ≤ 70
- High: score > 70

## 💡 Recommendation Rules

The app generates recommendations when:

| Parameter | Condition | Action |
|-----------|-----------|--------|
| Nitrogen | < 50 ppm | Add Urea or Ammonium Nitrate (100-150 kg/ha) |
| Phosphorus | < 30 ppm | Apply DAP or SSP (50-75 kg/ha) |
| Potassium | < 40 ppm | Apply Potassium Chloride (40-60 kg/ha) |
| pH | > 7.5 | Add compost or sulfur (2-5 tons/ha) |
| pH | < 6 | Add lime (1-3 tons/ha) |
| Organic Carbon | < 0.6% | Add Farmyard Manure or Compost (15-20 tons/ha) |

## 🎨 Styling

The application uses a custom CSS file (`SoilHealthApp.css`) with:
- CSS custom properties for colors and spacing
- Responsive grid layouts
- Mobile-first design
- Smooth animations and transitions
- Accessibility-focused styling

**Key Colors**:
- Primary: Green (#16a34a)
- Secondary: Brown (#78350f)
- Accent: Amber (#f59e0b)
- Success: Emerald (#10b981)
- Warning: Red (#ef4444)

## 📱 Responsive Design

The app is fully responsive:
- **Desktop**: Multi-column grids, side-by-side layouts
- **Tablet**: 2-column grids, adjusted spacing
- **Mobile**: Single column, stacked layouts, optimized touch targets

## 🔍 How It Works

### Data Flow

```
CSV File
   ↓
PapaParse (csvParser.js)
   ↓
React State (csvData)
   ↓
SoilForm (User Selection)
   ↓
User submits (State, District)
   ↓
Calculate Fertility Score
Generate Recommendations
   ↓
Display in SoilChart & SoilResult
```

### State Management

```jsx
const [csvData, setCSVData] = useState([]);        // Parsed CSV
const [selectedState, setSelectedState] = useState('');
const [selectedDistrict, setSelectedDistrict] = useState('');
const [soilData, setSoilData] = useState(null);    // Selected record
const [fertilityScore, setFertilityScore] = useState(0);
const [recommendations, setRecommendations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```

## 🚀 Enhancement Ideas

1. **Add more data**
   - Include micronutrients (Zn, Fe, B, Mn, Cu, S)
   - Add historical data comparison
   - Multi-year trend analysis

2. **Advanced features**
   - Export recommendations as PDF
   - Print soil report
   - Share results via email
   - Save favorites

3. **Integration**
   - Backend API integration (instead of CSV)
   - Real-time data from soil sensors
   - Weather data integration
   - Crop recommendation engine

4. **UX improvements**
   - Search by pin code
   - Map-based location selection
   - Bookmarking
   - Dark mode

## ⚠️ Troubleshooting

### CSV not loading
- Check file path: `/frontend/public/data/soil_health_card_dataset_2025_26.csv`
- Ensure CSV has correct headers
- Check browser console for errors
- Verify PapaParse is installed: `npm list papaparse`

### Charts not displaying
- Ensure Recharts is installed: `npm list recharts`
- Check if soilData is not null
- Verify numeric values in CSV

### Form not cascading
- Check csvData is properly loaded
- Verify dataset has state/district combinations
- Check browser console for JavaScript errors

### Styling not applied
- Ensure `SoilHealthApp.css` is imported in component
- Clear browser cache
- Check for CSS specificity conflicts

## 📚 Code Examples

### Using the component programmatically

```jsx
import { SoilHealthApp } from './components/SoilHealthApp';

function MyDashboard() {
  return (
    <div>
      <h1>Agricultural Dashboard</h1>
      <SoilHealthApp />
    </div>
  );
}
```

### Custom CSV path

Modify `SoilHealthApp.jsx`:
```javascript
const csvPath = '/data/custom_soil_data.csv';
const data = await parseCSV(csvPath);
```

### Accessing parsed data

```javascript
const { csvData } = await parseCSV(csvPath);
console.log('Total records:', csvData.length);
console.log('States:', [...new Set(csvData.map(d => d.state))]);
```

## 📖 Reference Documentation

- **PapaParse**: https://www.papaparse.com/docs
- **Recharts**: https://recharts.org/guide
- **React Hooks**: https://react.dev/reference/react
- **Soil Health Card**: https://www.soilhealth.dac.gov.in

## 📄 License

This component is part of the HaritNavinya agricultural project.

**Data Source**: Soil Health Card (SHC) Portal - Government of India, Department of Agriculture & Cooperation

Website: https://www.soilhealth.dac.gov.in

## ✅ Checklist for Integration

- [ ] PapaParse installed (`npm install papaparse`)
- [ ] Recharts installed (verify with `npm list recharts`)
- [ ] CSV file placed in `/frontend/public/data/`
- [ ] All component files created in `/frontend/src/components/`
- [ ] Utility file created in `/frontend/src/utils/`
- [ ] CSS file created in `/frontend/src/styles/`
- [ ] Component imported and added to App
- [ ] Application runs: `npm run dev`
- [ ] CSV loads without errors
- [ ] Form displays all states correctly
- [ ] Dropdown filtering works
- [ ] Charts display with data
- [ ] Recommendations generate correctly

---

**Created**: March 29, 2026
**Version**: 1.0
**Status**: Production Ready ✅
