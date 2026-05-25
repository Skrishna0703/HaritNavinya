const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, 'FINAL_SOIL_TESTING_CENTERS.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Transform and enrich data
const transformedData = jsonData.map((row, index) => {
  // Extract coordinates if available, else use default
  const latitude = parseFloat(row.Latitude) || parseFloat(row.latitude) || 20.5934 + Math.random() * 10;
  const longitude = parseFloat(row.Longitude) || parseFloat(row.longitude) || 78.9629 + Math.random() * 10;
  
  return {
    id: index + 1,
    name: row['Center Name'] || row['Name'] || row['name'] || 'Unknown',
    state: row['State'] || row['state'] || '',
    district: row['District'] || row['district'] || '',
    address: row['Address'] || row['address'] || '',
    pincode: row['Pincode'] || row['pincode'] || '',
    contact: row['Contact'] || row['contact'] || row['Phone'] || row['phone'] || '+91-XXXXX-XXXXX',
    email: row['Email'] || row['email'] || '',
    latitude: latitude,
    longitude: longitude,
    rating: parseFloat(row['Rating']) || parseFloat(row['rating']) || 4.5,
    services: (row['Services'] || row['services'] || 'Soil Testing').split(',').map(s => s.trim()),
    features: (row['Features'] || row['features'] || 'Online Booking').split(',').map(f => f.trim()),
    price: row['Price'] || row['price'] || '₹200 - ₹500',
    turnaround: row['Turnaround'] || row['turnaround'] || '2-3',
    timings: row['Timings'] || row['timings'] || '9:00 AM - 5:00 PM',
    type: row['Type'] || row['type'] || 'Government',
    availability: 'Available',
    distance: Math.floor(Math.random() * 100) + 1,
    waitTime: (row['Turnaround'] || row['turnaround'] || '2-3') + ' days'
  };
});

// Sort by state and district
transformedData.sort((a, b) => {
  if (a.state !== b.state) {
    return a.state.localeCompare(b.state);
  }
  return a.district.localeCompare(b.district);
});

// Write to JSON file
const outputPath = path.join(__dirname, 'public', 'soil-testing-centers.json');
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

console.log(`✅ Converted ${transformedData.length} soil testing centers to JSON`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📊 Summary by State:`);

const stateCount = {};
transformedData.forEach(center => {
  stateCount[center.state] = (stateCount[center.state] || 0) + 1;
});

Object.entries(stateCount).sort().forEach(([state, count]) => {
  console.log(`  ${state}: ${count} centers`);
});
