# Integration Guide - Soil Health CSV Reader

Quick instructions to integrate the Soil Health CSV Reader into your existing React application.

## Option 1: Replace Existing SoilDataInsights Component

If you want to **replace** the API-based component with the CSV-based one:

### In App.tsx

**Before**:
```typescript
import { SoilDataInsights } from './components/SoilDataInsights';

// Used in routing:
case 'soil':
  return <SoilDataInsights onBack={() => setActiveView('dashboard')} />;
```

**After**:
```typescript
import { SoilHealthApp } from './components/SoilHealthApp';

// Replace with:
case 'soil':
  return <SoilHealthApp />;
```

### Pros & Cons

**Pros**:
- ✅ No backend required
- ✅ Faster load times
- ✅ Client-side processing
- ✅ Good for learning/demos

**Cons**:
- ❌ Limited to pre-loaded CSV data
- ❌ No real-time data updates
- ❌ Cannot add/modify data

---

## Option 2: Keep Both Components (Recommended)

### Create a New Menu Option

In your Navbar or Dashboard component:

```typescript
<div className="nav-item" onClick={() => setActiveView('soil-csv')}>
  📊 Soil Data (CSV)
</div>
<div className="nav-item" onClick={() => setActiveView('soil-api')}>
  🌍 Soil Data (Live)
</div>
```

### Route to Appropriate Component

```typescript
switch(activeView) {
  case 'soil-csv':
    return <SoilHealthApp />;
  case 'soil-api':
    return <SoilDataInsights onBack={() => setActiveView('dashboard')} />;
  // ... other routes
}
```

**Allows users to choose**:
- Quick CSV insights tool
- Full API-based live data

---

## Option 3: Embedded in Dashboard

### Create a New Dashboard Page

Create `SoilDashboard.tsx`:

```typescript
import React, { useState } from 'react';
import { SoilHealthApp } from './components/SoilHealthApp';
import { SoilDataInsights } from './components/SoilDataInsights';

interface SoilDashboardProps {
  onBack: () => void;
}

export function SoilDashboard({ onBack }: SoilDashboardProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'api'>('csv');

  return (
    <div className="soil-dashboard">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'csv' ? 'active' : ''}
          onClick={() => setActiveTab('csv')}
        >
          📄 Quick Analysis (CSV)
        </button>
        <button
          className={activeTab === 'api' ? 'active' : ''}
          onClick={() => setActiveTab('api')}
        >
          🌍 Live Data (API)
        </button>
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'csv' && <SoilHealthApp />}
        {activeTab === 'api' && <SoilDataInsights onBack={() => {}} />}
      </div>
    </div>
  );
}
```

---

## File Checklist

Ensure all these files exist in your project:

```
✅ src/components/
   ├── SoilForm.jsx              (Form component)
   ├── SoilChart.jsx             (Charts & metrics)
   ├── SoilResult.jsx            (Results & recommendations)
   └── SoilHealthApp.jsx         (Main orchestrator)

✅ src/utils/
   └── csvParser.js              (CSV parsing logic)

✅ src/styles/
   └── SoilHealthApp.css         (Complete styling)

✅ public/data/
   └── soil_health_card_dataset_2025_26.csv  (Dataset)

✅ package.json
   └── "papaparse": "^X.X.X"     (Installed)
```

---

## Dependency Check

Run these commands to verify:

```bash
# Check if PapaParse is installed
npm list papaparse

# Check if Recharts is installed
npm list recharts

# If missing, install:
npm install papaparse --save
npm install recharts --save  # (should already be there)
```

Expected output:
```
├── papaparse@5.4.1
└── recharts@2.15.2
```

---

## CSV Dataset Setup

### File Format

Ensure CSV has these columns (in order):
```
state,district,nitrogen,phosphorus,potassium,pH,organicCarbon,category
```

### Sample Data
```csv
Andhra Pradesh,Anantapur,185,95,155,7.2,0.85,Medium
Andhra Pradesh,Chittoor,195,105,165,7.0,0.92,Medium
Maharashtra,Pune,175,95,155,6.6,1.02,High
```

### File Location
```
frontend/
└── public/
    └── data/
        └── soil_health_card_dataset_2025_26.csv
```

**Important**: Place CSV in `public/data/` folder, NOT in `src/`

---

## Styling Integration

If you're using Tailwind CSS in your main app, the SoilHealthApp uses custom CSS. 

### Option A: Keep Separate CSS (Recommended)

No action needed - `SoilHealthApp.css` loads independently.

### Option B: Integrate with Tailwind

Create a Tailwind-compatible version:

```bash
# Install Tailwind if not done
npm install tailwindcss postcss autoprefixer
```

Then rewrite `SoilHealthApp.css` using Tailwind classes.

---

## Testing the Integration

### Step 1: Verify Installation
```bash
npm list papaparse recharts
```

### Step 2: Check File Paths
```bash
# Verify CSV exists
dir public\data\
# Should show: soil_health_card_dataset_2025_26.csv
```

### Step 3: Import Component
In your main file:
```typescript
import { SoilHealthApp } from './components/SoilHealthApp';
```

### Step 4: Test Rendering
```bash
npm run dev
# Navigate to the component
# Should see header and form
```

### Step 5: Test Functionality
- [ ] Page loads without errors
- [ ] CSV loads (check Network tab)
- [ ] Form displays states
- [ ] Selecting state filters districts
- [ ] Submitting shows results
- [ ] Charts display with data
- [ ] Recommendations appear
- [ ] Back button works

---

## Customization Examples

### Change CSV Location

In `SoilHealthApp.jsx`, modify:
```javascript
// Line ~48
const csvPath = '/data/soil_health_card_dataset_2025_26.csv';

// To:
const csvPath = '/data/custom_filename.csv';
```

### Add More States

Simply add rows to CSV:
```csv
Uttarakhand,Almora,165,85,145,6.8,0.95,Medium
Uttarakhand,Nainital,175,95,155,6.5,1.05,High
```

New locations automatically available in form.

### Change Colors

In `SoilHealthApp.css`, modify CSS variables:
```css
:root {
  --primary-color: #16a34a;      /* Change green */
  --secondary-color: #78350f;    /* Change brown */
  --accent-color: #f59e0b;       /* Change amber */
}
```

### Modify Recommendation Thresholds

In `csvParser.js`, adjust in `generateRecommendations()`:
```javascript
// Example: lower nitrogen threshold
if (soilData.nitrogen < 75) {  // Changed from 50
  recommendations.push({
    parameter: 'Nitrogen',
    issue: 'Low nitrogen levels detected',
    // ...
  });
}
```

---

## Troubleshooting

### "PapaParse is not defined"
```bash
npm install papaparse --save
# Then restart: npm run dev
```

### "CSV file not found"
- Check browser Network tab for 404
- Verify path: `public/data/soil_health_card_dataset_2025_26.csv`
- Check that file exists in public folder

### "Form shows no states"
- Verify CSV has data
- Check browser console for parsing errors
- Ensure CSV columns are named correctly

### "Charts not rendering"
- Check that Recharts is installed
- Verify soilData is not null
- Look for JavaScript errors in console

### Styling looks broken
- Verify `SoilHealthApp.css` is imported
- Check no CSS conflicts from main app
- Clear browser cache (Ctrl+Shift+Delete)

---

## Performance Tips

1. **Lazy Load Component**
   ```typescript
   const SoilHealthApp = lazy(() => import('./components/SoilHealthApp'));
   ```

2. **Memoize Form Component**
   ```typescript
   export const SoilForm = memo(({ data, onSubmit }) => {
     // component code
   });
   ```

3. **Optimize CSV Size**
   - Remove unnecessary columns
   - Use shorter state names
   - Compress numeric precision

4. **Cache Parsed Data**
   ```javascript
   const [csvData, setCsvData] = useState(null);
   const cachedData = useMemo(() => csvData, [csvData]);
   ```

---

## Migration from API to CSV

If moving from the backend API to CSV:

1. **Export API data to CSV**
   ```bash
   # From backend, export soil data to CSV
   node src/scripts/export-to-csv.js
   ```

2. **Place in public folder**
   ```bash
   cp output.csv frontend/public/data/soil_health_card_dataset_2025_26.csv
   ```

3. **Update component import**
   ```typescript
   import { SoilHealthApp } from './components/SoilHealthApp';
   ```

4. **Remove API dependency**
   - Component works offline
   - No backend needed
   - Faster load times

---

## Support & References

- **PapaParse Docs**: https://www.papaparse.com/docs
- **Recharts Docs**: https://recharts.org/guide
- **React Docs**: https://react.dev
- **Soil Health Card**: https://www.soilhealth.dac.gov.in

---

**Last Updated**: March 29, 2026
**Version**: 1.0
**Status**: Ready for Production ✅
