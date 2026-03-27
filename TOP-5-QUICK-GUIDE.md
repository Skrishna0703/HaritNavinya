# 🎯 Top 5 Crops Feature - Quick Guide

## What You Get

A dynamic chart and cards showing the **5 crops with the highest prices** in your selected state.

---

## 📊 What the Chart Shows

### Bar Chart
- **Orange bars** = Maximum price in last 7 days
- **Green bars** = Average price across markets
- 5 commodities displayed side-by-side
- Hover over bars to see exact prices

### Information Cards
- **Ranking** - #1 to #5 highest prices
- **Max Price** - Displayed in orange
- **Avg Price** - Displayed in green  
- **Market Count** - How many markets tracked

---

## 🎮 How to Use

1. **Open the app** → http://localhost:3000
2. **Select State** → Choose any state (Maharashtra, Punjab, etc.)
3. **Scroll Down** → Find "Top 5 Highest Prices by Crop"
4. **View Chart** → See bar graph with prices
5. **Check Cards** → See detailed data below chart
6. **Change State** → Chart updates automatically!

---

## 📈 Example Output

### For Maharashtra:
```
Top 5 Highest Prices:
1. Onion    - ₹1400 max (₹1250 avg) - 8 markets
2. Garlic   - ₹1200 max (₹1100 avg) - 6 markets
3. Tomato   - ₹1100 max (₹1000 avg) - 5 markets
4. Wheat    - ₹1000 max (₹900 avg)  - 4 markets
5. Rice     - ₹950 max (₹880 avg)   - 3 markets
```

---

## ✨ Key Features

✅ **Real-time Data** - Live from Agmarknet API
✅ **Visual Charts** - Easy to understand prices
✅ **Auto-update** - Changes when you select different state
✅ **Loading Indicator** - Shows while fetching
✅ **Responsive** - Works on mobile, tablet, desktop
✅ **Error Handling** - Graceful fallback if data unavailable

---

## 🔄 How Data is Collected

1. Select a state
2. Component fetches all 10 commodities in that state
3. Calculates max and average price for each
4. Sorts by highest maximum price
5. Shows top 5 in chart
6. Displays in cards below

**Total commodities checked**: Onion, Potato, Rice, Wheat, Chilli, Garlic, Ginger, Tomato, Cabbage, Carrot

---

## 🎨 Colors

| Color | Meaning |
|-------|---------|
| 🟠 Orange | Maximum Price |
| 🟢 Green | Average Price |
| 🟡 Yellow-Orange | Card Background |
| 🔵 Blue | Borders & Accents |

---

## 📱 Responsive Design

- **Desktop**: 5 cards in a row
- **Tablet**: 3-2 cards per row  
- **Mobile**: 1 card per row

All fully responsive!

---

## 🔍 What the Numbers Mean

### Max Price
The highest price found in any market for that commodity in the last 7 days. This is what farmers should aim for when selling!

### Avg Price
The average across all markets. Shows the typical price you'd get.

### Markets Count
How many different markets tracked prices for this commodity.

---

## 💡 Use Cases

### For Farmers:
- "Onion has highest price (₹1400), I should sell onions now!"
- "Garlic is second at ₹1200, good backup option"
- "Rice is lowest at ₹950, not good time to sell rice"

### For Planning:
- "Onion and Garlic are trending up, should grow more"
- "Market opportunity in these high-price crops"
- "Seasonal planning based on price trends"

---

## 🎉 Everything Works!

✅ Chart displays live data
✅ Prices update automatically
✅ No hardcoded dummy data
✅ Real Agmarknet API integration
✅ Beautiful visual presentation

---

## 📍 Current Setup

- **Backend**: http://localhost:4000 (API)
- **Frontend**: http://localhost:3000 (Display)
- **Data Source**: Agmarknet (data.gov.in)
- **Update Frequency**: Real-time

---

## 🚀 You're All Set!

The Top 5 Crops feature is live and working perfectly. Farmers can now see at a glance which crops have the best market prices! 🌾

