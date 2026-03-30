## Loading Animation Integration Guide

### Overview
The HaritNavinya project now features a smooth Lottie-based loading animation from LottieFiles that displays across the entire application.

### Files Created/Modified

1. **[components/LoadingScreen.tsx](src/components/LoadingScreen.tsx)** - Main loading screen component
   - Displays a loading animation fetched from LottieFiles
   - Shows customizable loading messages
   - Renders in a fixed overlay with backdrop blur

2. **[hooks/useLoading.ts](src/hooks/useLoading.ts)** - React hook for loading state management
   - `startLoading(message?)` - Show loading screen with optional message
   - `stopLoading()` - Hide loading screen
   - `setLoadingMessage(message)` - Update loading message
   - Returns: `{ isLoading, loadingMessage, startLoading, stopLoading, setLoadingMessage }`

3. **[App.tsx](src/App.tsx)** - Updated to include loading screen
   - Initial app load shows "Initializing HaritNavinya..." for 1.5 seconds
   - Page navigation shows loading animation during transitions
   - Loading overlay appears instantly and dismisses after 0.8 seconds

### Animation Source
- **Animation URL**: `https://lottie.host/839fe9f2-1181-11ee-8d9c-ab00d840e1f7/esZsyzRPxl.json`
- **Type**: Lottie JSON format
- **License**: Free to use under the Lottie Simple License

### Usage

#### Display Loading Screen in Components
```typescript
import { useLoading } from '../hooks/useLoading';

function MyComponent() {
  const { startLoading, stopLoading } = useLoading();

  const handleAsync = async () => {
    startLoading('Fetching data...');
    try {
      const data = await fetchSomeData();
      // process data
    } finally {
      stopLoading();
    }
  };

  return <button onClick={handleAsync}>Load Data</button>;
}
```

#### Customize Loading Message
```typescript
startLoading('Processing your request...');
```

### Features
✅ Automatic initial load animation  
✅ Smooth page transition loading states  
✅ Customizable loading messages  
✅ Backdrop blur effect  
✅ Responsive design  
✅ Fallback spinner if animation fails  

### Customization

To change animation duration, edit `App.tsx`:
```typescript
// Initial load - currently 1500ms
setTimeout(() => {
  stopLoading();
  setIsInitialLoad(false);
}, 1500); // Adjust this value

// Page transitions - currently 800ms
setTimeout(() => {
  setCurrentPage(route as PageType);
  stopLoading();
}, 800); // Adjust this value
```

To change loading screen styling, edit `LoadingScreen.tsx`:
- Background opacity: `bg-opacity-95` 
- Backdrop blur: `backdrop-blur-sm`
- Text color: `text-gray-700`
- Animation container: `w-64 h-64`

### Dependencies
- `lottie-react@^2.4.1` (already installed)
- React 18+
