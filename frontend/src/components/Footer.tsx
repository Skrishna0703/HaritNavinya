import React from 'react';
import { Database, ExternalLink } from 'lucide-react';

type PageFooterProps = 'plant-disease' | 'crop-recommendation' | 'fertilizer-recommendation' | 'market-price' | 'disaster-alerts' | 'ai-chatbot' | 'soil-data-insights' | 'weather-forecast' | 'soil-testing-centers' | 'smart-farming-guidance' | 'farmer-officer-connect' | 'post-harvest-support';

interface PageFooterInfo {
  title: string;
  datasets: Array<{
    icon: string;
    name: string;
    link?: string;
  }>;
  description: string;
}

const pageFooterData: Record<PageFooterProps, PageFooterInfo> = {
  'plant-disease': {
    title: 'Plant Disease Detection',
    datasets: [
      { icon: '🖼️', name: 'Image Dataset', link: 'https://unsplash.com' },
      { icon: '🤖', name: 'Deep Learning Models' },
      { icon: '📚', name: 'Crop Disease Database' }
    ],
    description: 'Powered by AI-based image recognition for accurate plant disease identification'
  },
  'crop-recommendation': {
    title: 'Crop Recommendation',
    datasets: [
      { icon: '📊', name: 'Government Agricultural Data' },
      { icon: '🌍', name: 'Climate & Weather Data' },
      { icon: '🧬', name: 'Crop Suitability Matrix' }
    ],
    description: 'Data-driven crop selection based on soil, climate, and market conditions'
  },
  'fertilizer-recommendation': {
    title: 'Fertilizer Recommendation',
    datasets: [
      { icon: '📊', name: 'Nutrient.csv (36 States)', link: 'https://soilhealth.dac.gov.in' },
      { icon: '⚗️', name: 'Soil Analysis Data' },
      { icon: '📋', name: 'Fertilizer Guidelines' }
    ],
    description: 'Customized fertilizer recommendations based on soil nutrient analysis'
  },
  'market-price': {
    title: 'Market Price Forecast',
    datasets: [
      { icon: '🛒', name: 'MANDI Market Prices' },
      { icon: '📈', name: 'Historical Price Data' },
      { icon: '🔮', name: 'Price Prediction Model' }
    ],
    description: 'Real-time agricultural commodity pricing and trend analysis'
  },
  'disaster-alerts': {
    title: 'Disaster Alerts & Monitoring',
    datasets: [
      { icon: '⚠️', name: 'Weather Alerts' },
      { icon: '🌪️', name: 'Disaster Database' },
      { icon: '📍', name: 'Location-based Notifications' }
    ],
    description: 'Real-time disaster and weather alerts for agricultural areas'
  },
  'ai-chatbot': {
    title: 'AI Agricultural Assistant',
    datasets: [
      { icon: '🤖', name: 'Agricultural Knowledge Base' },
      { icon: '📚', name: 'Expert Advisories' },
      { icon: '💬', name: 'Multi-language Support' }
    ],
    description: 'AI-powered chatbot for agricultural guidance and farmer support'
  },
  'soil-data-insights': {
    title: 'Soil Data & Insights',
    datasets: [
      { icon: '📊', name: 'Nutrient.csv (36 States)', link: 'https://soilhealth.dac.gov.in' },
      { icon: '🧪', name: 'Soil Health Card Data' },
      { icon: '📈', name: 'Fertility Analytics' }
    ],
    description: 'Comprehensive soil analysis and fertility mapping across India'
  },
  'weather-forecast': {
    title: 'Weather Forecast',
    datasets: [
      { icon: '🌦️', name: 'Weather API Data' },
      { icon: '📍', name: 'Location-based Forecasts' },
      { icon: '📊', name: 'Historical Weather Patterns' }
    ],
    description: 'Accurate weather forecasting for agricultural planning'
  },
  'soil-testing-centers': {
    title: 'Soil Testing Centers',
    datasets: [
      { icon: '🏢', name: 'soil-testing-centers.json' },
      { icon: '📍', name: 'ICSR Database', link: 'https://www.icsr.in' },
      { icon: '📋', name: 'Testing Standards & Guidelines' }
    ],
    description: 'Directory of accredited soil testing laboratories across India'
  },
  'smart-farming-guidance': {
    title: 'Smart Farming Guidance',
    datasets: [
      { icon: '🚜', name: 'Modern Agricultural Techniques' },
      { icon: '💧', name: 'Precision Irrigation Data' },
      { icon: '🌱', name: 'Sustainable Farming Practices' }
    ],
    description: 'Expert guidance for modern and sustainable farming practices'
  },
  'farmer-officer-connect': {
    title: 'Farmer-Officer Connect',
    datasets: [
      { icon: '👥', name: 'Officer Directory' },
      { icon: '🏛️', name: 'Government Resources' },
      { icon: '📞', name: 'Support Network' }
    ],
    description: 'Direct connection between farmers and agricultural officers'
  },
  'post-harvest-support': {
    title: 'Post-Harvest Support',
    datasets: [
      { icon: '📦', name: 'Storage & Handling Guidelines' },
      { icon: '🏭', name: 'Processing Techniques' },
      { icon: '🛒', name: 'Market Linkage Data' }
    ],
    description: 'Post-harvest solutions for better crop preservation and market access'
  }
};

interface FooterProps {
  page?: PageFooterProps;
}

export const Footer: React.FC<FooterProps> = ({ page }) => {
  const currentYear = new Date().getFullYear();

  if (!page) {
    return null;
  }

  const pageInfo = pageFooterData[page];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Page-specific content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h3 className="text-white font-bold text-2xl mb-2 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-500" />
              {pageInfo.title}
            </h3>
            <p className="text-gray-400 text-sm">{pageInfo.description}</p>
          </div>

          {/* Datasets Grid */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">📊 Datasets & Data Sources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageInfo.datasets.map((dataset, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{dataset.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{dataset.name}</p>
                      {dataset.link && (
                        <a
                          href={dataset.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
                        >
                          Visit Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div className="border-t border-slate-700 pt-6">
            <h4 className="text-white font-semibold text-sm mb-3">📝 Credits & Attribution</h4>
            <p className="text-gray-400 text-sm">
              UI: shadcn/ui | Charts: Recharts | Animations: Motion/React | Icons: Lucide React | Images: Unsplash | Build: Vite
            </p>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© {currentYear} HaritNavinya. All rights reserved.</p>
            <div className="text-right mt-4 md:mt-0">
              <p>Version: 1.0.0 | Status: Production Ready ✅</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
