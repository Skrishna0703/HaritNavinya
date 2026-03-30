import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ModernNavbar } from "./components/ModernNavbar";
import { LanguageProvider, useLanguage } from "./components/LanguageContext";
import { PlantDiseaseDetection } from "./components/PlantDiseaseDetection";
import { MarketPriceForecast } from "./components/MarketPriceForecast";
import { AIChatbot } from "./components/AIChatbot";
import { CropRecommendation } from "./components/CropRecommendation";
import { FertilizerRecommendation } from "./components/FertilizerRecommendation";
import { DisasterAlerts } from "./components/DisasterAlertsClean";
import { SoilDataInsights } from "./components/SoilDataInsights";
import { WeatherForecast } from "./components/WeatherForecast";
import { SoilTestingCenters } from "./components/SoilTestingCenters";
import { SmartFarmingGuidance } from "./components/SmartFarmingGuidance";
import { FarmerOfficerConnect } from "./components/FarmerOfficerConnect";
import { PostHarvestSupport } from "./components/PostHarvestSupport";
import { motion } from "motion/react";
import LoadingScreen from "./components/LoadingScreen";
import { useLoading } from "./hooks/useLoading";
import { 
  Leaf, 
  Wheat, 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  Bot, 
  Globe, 
  Cloud, 
  MapPin, 
  User, 
  Link, 
  Package,
  Sun,
  CloudRain,
  ThermometerSun,
  Wind,
  ArrowRight,
  Play,
  Users,
  Target,
  Award,
  Zap,
  CheckCircle,
  BookOpen,
  Sparkles,
  TrendingUpIcon
} from "lucide-react";

type PageType = 'home' | 'plant-disease' | 'market-price' | 'ai-chatbot' | 'crop-recommendation' | 'fertilizer-recommendation' | 'disaster-alerts' | 'soil-data-insights' | 'weather-forecast' | 'soil-testing-centers' | 'smart-farming-guidance' | 'farmer-officer-connect' | 'post-harvest-support';

// Custom loading messages and GIFs for each page
const loadingConfig: Record<string, { message: string; gifUrl?: string }> = {
  'plant-disease': { message: 'Analyzing Plant Disease...', gifUrl: '/loading/plant.gif' },
  'crop-recommendation': { message: 'Finding Best Crops for You...', gifUrl: '/loading/crops.gif' },
  'fertilizer-recommendation': { message: 'Calculating Fertilizer Needs...', gifUrl: '/loading/fertilizer.gif' },
  'market-price': { message: 'Loading Market Prices...', gifUrl: '/loading/market.gif' },
  'disaster-alerts': { message: 'Checking Disaster Alerts...', gifUrl: '/loading/alerts.gif' },
  'ai-chatbot': { message: 'Starting AI Assistant...', gifUrl: '/loading/chatbot.gif' },
  'soil-data-insights': { message: 'Analyzing Soil Data...', gifUrl: '/loading/soil.gif' },
  'weather-forecast': { message: 'Fetching Weather Data...', gifUrl: '/loading/weather.gif' },
  'soil-testing-centers': { message: 'Finding Testing Centers...', gifUrl: '/loading/centers.gif' },
  'smart-farming-guidance': { message: 'Loading Smart Farming Guide...', gifUrl: '/loading/farming.gif' },
  'farmer-officer-connect': { message: 'Connecting Farmers...', gifUrl: '/loading/connect.gif' },
  'post-harvest-support': { message: 'Loading Support Resources...', gifUrl: '/loading/harvest.gif' }
};

function AppContent() {
  // Initialize from localStorage, default to 'home' if not found
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const savedPage = localStorage.getItem('currentPage') as PageType;
    return (savedPage && 
      ['home', 'plant-disease', 'market-price', 'ai-chatbot', 'crop-recommendation', 
       'fertilizer-recommendation', 'disaster-alerts', 'soil-data-insights', 
       'weather-forecast', 'soil-testing-centers', 'smart-farming-guidance', 
       'farmer-officer-connect', 'post-harvest-support'].includes(savedPage)) 
      ? savedPage 
      : 'home';
  });
  const [navPage, setNavPage] = useState('home');
  const { t } = useLanguage();
  const { isLoading, loadingMessage, startLoading, stopLoading } = useLoading();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Real API data states
  const [weatherData, setWeatherData] = useState<any>(null);
  const [marketPricesData, setMarketPricesData] = useState<string[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  
  // Show loading on initial app load
  useEffect(() => {
    if (isInitialLoad) {
      startLoading('Initializing HaritNavinya...');
      const timer = setTimeout(() => {
        stopLoading();
        setIsInitialLoad(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, startLoading, stopLoading]);
  
  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Fetch weather data for Mumbai (default location)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        // Weather API not yet implemented, using mock data
        setWeatherData({
          location: { name: 'Mumbai, Maharashtra' },
          current: {
            temp: 28,
            condition: 'Sunny',
            humidity: 65,
            wind_speed: 12
          }
        });
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Fetch market prices data
  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        setMarketLoading(true);
        // Fetch from Maharashtra (default state)
        const response = await fetch('http://localhost:5000/api/dashboard?state=Maharashtra');
        if (response.ok) {
          const data = await response.json();
          // Format prices for display
          const prices = data.todayPrices?.slice(0, 6).map((item: any) => {
            const change = item.change ? (item.change > 0 ? '+' : '') + item.change : 'N/A';
            return `${item.commodity}: ₹${item.price}/quintal (${change})`;
          }) || [];
          setMarketPricesData(prices.length > 0 ? prices : getDefaultMarketPrices());
        } else {
          setMarketPricesData(getDefaultMarketPrices());
        }
      } catch (error) {
        console.error('Failed to fetch market prices:', error);
        setMarketPricesData(getDefaultMarketPrices());
      } finally {
        setMarketLoading(false);
      }
    };
    fetchMarketPrices();
  }, []);

  // Fallback market prices if API fails
  const getDefaultMarketPrices = () => [
    "🌾 Wheat: ₹2,150/quintal (+2.3%)",
    "🌽 Maize: ₹1,850/quintal (-1.2%)",
    "🌾 Rice: ₹2,890/quintal (+0.8%)",
    "🥔 Potato: ₹1,200/quintal (+5.1%)",
    "🧅 Onion: ₹3,200/quintal (-2.8%)",
    "🍅 Tomato: ₹4,500/quintal (+12.3%)"
  ];
  
  const handleFeatureClick = (route: string, externalUrl?: string) => {
    // If it's an external URL, redirect directly
    if (externalUrl) {
      window.location.href = externalUrl;
      return;
    }
    
    const config = loadingConfig[route] || { message: 'Loading...' };
    startLoading(config.message);
    setTimeout(() => {
      setCurrentPage(route as PageType);
      stopLoading();
    }, 800);
  };

  const features = [
    { 
      icon: Leaf, 
      titleKey: "plantDisease",
      labelKey: "aiModule",
      descKey: "plantDiseaseDesc", 
      gradient: "linear-gradient(135deg, #2ecc71, #a3e635)", 
      image: "https://images.unsplash.com/photo-1613316756460-c2624b9c2c2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGxlYWYlMjBtYWNyb3xlbnwxfHx8fDE3NjM0Njg3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'plant-disease',
      clickable: true,
      externalUrl: 'https://plant-disease-detection-mibmco47ai3t8rjztsdrt2.streamlit.app/'
    },
    { 
      icon: Wheat, 
      titleKey: "cropRecommendation",
      labelKey: "smartTool",
      descKey: "cropRecommendationDesc", 
      gradient: "linear-gradient(135deg, #facc15, #f97316)", 
      image: "https://images.unsplash.com/photo-1664729570424-069f0c0d5ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzYzNDY4NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'crop-recommendation',
      clickable: true 
    },
    { 
      icon: Droplets, 
      titleKey: "fertilizerRecommendation",
      labelKey: "precision",
      descKey: "fertilizerRecommendationDesc",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)", 
      image: "https://images.unsplash.com/photo-1757670919588-1fe3b3df3dfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJ0aWxpemVyJTIwZ3JhbnVsZXN8ZW58MXx8fHwxNzYzNDY4NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'fertilizer-recommendation',
      clickable: true 
    },
    { 
      icon: TrendingUp, 
      titleKey: "marketPrice",
      labelKey: "analytics",
      descKey: "marketPriceDesc",
      gradient: "linear-gradient(135deg, #8b5cf6, #d946ef)", 
      image: "https://images.unsplash.com/photo-1649003515353-c58a239cf662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNoYXJ0c3xlbnwxfHx8fDE3NjM0MjM3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'market-price',
      clickable: true 
    },
    { 
      icon: AlertTriangle, 
      titleKey: "disasterAlerts",
      labelKey: "warning",
      descKey: "disasterAlertsDesc",
      gradient: "linear-gradient(135deg, #ef4444, #f59e0b)", 
      image: "https://images.unsplash.com/photo-1653058221377-96690fa50146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMGNsb3VkcyUyMHdlYXRoZXJ8ZW58MXx8fHwxNzYzNDQ3MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'disaster-alerts',
      clickable: true 
    },
    { 
      icon: Bot, 
      titleKey: "aiChatbot",
      labelKey: "assistant",
      descKey: "aiChatbotDesc",
      gradient: "linear-gradient(135deg, #ec4899, #6366f1, #3b82f6)", 
      image: "https://images.unsplash.com/photo-1650355662496-d877e5e1f992?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0JTIwYnViYmxlcyUyMGFpfGVufDF8fHx8MTc2MzQ2ODcyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'ai-chatbot',
      clickable: true 
    },
    { 
      icon: Globe, 
      titleKey: "soilData",
      labelKey: "analysis",
      descKey: "soilDataDesc",
      gradient: "linear-gradient(135deg, #78350f, #16a34a)", 
      image: "https://images.unsplash.com/photo-1613036582025-ba1d4ccb3226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjM0Njg3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'soil-data-insights',
      clickable: true 
    },
    { 
      icon: Cloud, 
      titleKey: "weatherForecast",
      labelKey: "forecast",
      descKey: "weatherForecastDesc",
      gradient: "linear-gradient(135deg, #38bdf8, #7c3aed)", 
      image: "https://images.unsplash.com/photo-1646779012279-ed25d733eaeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZHMlMjByYWluZmFsbHxlbnwxfHx8fDE3NjM0Njg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'weather-forecast',
      clickable: true 
    },
    { 
      icon: MapPin, 
      titleKey: "soilTesting",
      labelKey: "locator",
      descKey: "soilTestingDesc",
      gradient: "linear-gradient(135deg, #14b8a6, #22d3ee)", 
      image: "https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwbWljcm9zY29wZXxlbnwxfHx8fDE3NjM0Njg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'soil-testing-centers',
      clickable: true 
    },
    { 
      icon: User, 
      titleKey: "smartFarming",
      labelKey: "expert",
      descKey: "smartFarmingDesc",
      gradient: "linear-gradient(135deg, #65a30d, #fde047)", 
      image: "https://images.unsplash.com/photo-1710170909047-135c7a010e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBndWlkYW5jZXxlbnwxfHx8fDE3NjM0Njg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'smart-farming-guidance',
      clickable: true 
    },
    { 
      icon: Link, 
      titleKey: "farmerOfficer",
      labelKey: "network",
      descKey: "farmerOfficerDesc",
      gradient: "linear-gradient(135deg, #2563eb, #9333ea)", 
      image: "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kc2hha2UlMjBwYXJ0bmVyc2hpcHxlbnwxfHx8fDE3NjM0NjE3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'farmer-officer-connect',
      clickable: true 
    },
    { 
      icon: Package, 
      titleKey: "postHarvest",
      labelKey: "service",
      descKey: "postHarvestDesc",
      gradient: "linear-gradient(135deg, #fb923c, #f43f5e)", 
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzdG9yYWdlfGVufDF8fHx8MTc2MzM5NTY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      route: 'post-harvest-support',
      clickable: true 
    }
  ];

  // Page routing
  if (currentPage === 'plant-disease') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <PlantDiseaseDetection onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'crop-recommendation') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <CropRecommendation onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'fertilizer-recommendation') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <FertilizerRecommendation onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'market-price') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <MarketPriceForecast onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'disaster-alerts') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <DisasterAlerts onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'ai-chatbot') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <AIChatbot onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'soil-data-insights') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <SoilDataInsights onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'weather-forecast') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <WeatherForecast onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'soil-testing-centers') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <SoilTestingCenters onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'smart-farming-guidance') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <SmartFarmingGuidance onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'farmer-officer-connect') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <FarmerOfficerConnect onBack={() => setCurrentPage('home')} />
      </>
    );
  }
  
  if (currentPage === 'post-harvest-support') {
    return (
      <>
        <LoadingScreen isVisible={isLoading} message={loadingMessage} />
        <PostHarvestSupport onBack={() => setCurrentPage('home')} />
      </>
    );
  }

  return (
    <>
      <LoadingScreen isVisible={isLoading} message={loadingMessage} />
      <div className="min-h-screen bg-white overflow-x-hidden font-['Poppins',sans-serif]">
        {/* Modern Pill-Shaped Navbar */}
        <ModernNavbar currentPage={navPage} onPageChange={setNavPage} />

        {/* Modern SaaS Hero Section */}
        <section 
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
          style={{
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5530 100%)'
        }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[85vh]">
            
            {/* Left Content */}
            <motion.div 
              className="text-center lg:text-left space-y-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Headline */}
              <div className="space-y-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-tight">
                  <motion.span 
                    className="block font-light text-white/90 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {t('transformYour')}
                  </motion.span>
                  <motion.span 
                    className="block font-black"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                      {t('agricultural')}
                    </span>
                  </motion.span>
                  <motion.span 
                    className="block font-light text-white/90 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {t('operations')}
                  </motion.span>
                </h1>
                
                <motion.p 
                  className="text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {t('heroDescNew')}
                </motion.p>
              </div>

              {/* CTA Button */}
              <motion.div 
                className="flex justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                  >
                    {t('getStartedFree')}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Side - Floating Profile Cards */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-lg mx-auto h-[600px]">
                
                {/* Main Profile Card - Green */}
                <motion.div 
                  className="absolute top-16 left-8 w-72 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl animate-float z-10"
                  style={{ 
                    transform: 'rotate(-2deg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 50, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1660081509826-a727cb918397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTQ2NTU3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Farm Manager"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg">Sarah Chen</h3>
                      <p className="text-green-100 text-sm">Farm Manager</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-white/90 text-sm leading-relaxed">
                      "Increased crop yield by 34% using AI insights"
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        ))}
                      </div>
                      <span className="text-white/70 text-xs">5.0 Rating</span>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Card - Pink */}
                <motion.div 
                  className="absolute top-8 right-4 w-64 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 shadow-2xl animate-float z-20"
                  style={{ 
                    animationDelay: '1s', 
                    transform: 'rotate(3deg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 50, rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 3 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1562672767-51120ccfdfeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGV4cGVydCUyMG1hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTk0NjU1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Agriculture Expert"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                    />
                    <div>
                      <h3 className="text-white font-bold">Dr. Mike Rodriguez</h3>
                      <p className="text-pink-100 text-sm">Soil Specialist</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Soil Health</span>
                      <motion.span 
                        className="text-white font-semibold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, type: "spring" }}
                      >
                        98%
                      </motion.span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-white rounded-full h-2 shadow-sm"
                        initial={{ width: 0 }}
                        animate={{ width: "98%" }}
                        transition={{ 
                          delay: 1.5, 
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Third Card - Teal */}
                <motion.div 
                  className="absolute bottom-20 left-12 w-68 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-6 shadow-2xl animate-float z-15"
                  style={{ 
                    animationDelay: '2s', 
                    transform: 'rotate(-1deg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 50, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: -1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1660081509826-a727cb918397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFncmljdWx0dXJhbCUyMHNjaWVudGlzdCUyMHdvbWFufGVufDF8fHx8MTc1OTQ2NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Agricultural Scientist"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                    />
                    <div>
                      <h3 className="text-white font-bold">Emma Watson</h3>
                      <p className="text-teal-100 text-sm">Crop Scientist</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Disease Detection</span>
                      <motion.div 
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <p className="text-white text-lg font-bold">12 threats identified</p>
                    <p className="text-teal-100 text-xs">Last scan: 2 minutes ago</p>
                  </div>
                </motion.div>

                {/* Small Widget Cards */}
                <motion.div 
                  className="absolute top-32 right-16 w-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-xl animate-float z-5"
                  style={{ 
                    animationDelay: '0.5s', 
                    transform: 'rotate(5deg)',
                    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 5 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg">₹2.4M</p>
                    <p className="text-purple-100 text-xs">Revenue Boost</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-8 right-8 w-36 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 shadow-xl animate-float z-5"
                  style={{ 
                    animationDelay: '1.5s', 
                    transform: 'rotate(-3deg)',
                    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg">10K+</p>
                    <p className="text-orange-100 text-xs">Happy Farmers</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Section */}
      <motion.section 
        id="about" 
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            {/* Weather Widget */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
              <Card className="neomorphism border-0 bg-gradient-to-br from-blue-50 to-sky-100 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center">
                      <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">{t('liveWeather')}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{weatherData?.location?.name || 'Mumbai, Maharashtra'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                        </motion.div>
                        <div>
                          <motion.div 
                            className="text-2xl sm:text-3xl font-bold text-gray-800"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {weatherLoading ? 'Loading...' : `${Math.round(weatherData?.current?.temp || 28)}°C`}
                          </motion.div>
                          <div className="text-gray-600 text-xs sm:text-sm">{weatherData?.current?.condition || 'Sunny'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Humidity</div>
                          <div className="font-medium text-sm sm:text-base">{weatherData?.current?.humidity || 65}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Wind</div>
                          <div className="font-medium text-sm sm:text-base">{Math.round(weatherData?.current?.wind_speed || 12)} km/h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                        </motion.div>
                        <div>
                          <motion.div 
                            className="text-2xl sm:text-3xl font-bold text-gray-800"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            28°C
                          </motion.div>
                          <div className="text-gray-600 text-xs sm:text-sm">Sunny</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Humidity</div>
                          <div className="font-medium text-sm sm:text-base">65%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Wind</div>
                          <div className="font-medium text-sm sm:text-base">12 km/h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>

            {/* Market Price Ticker */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
              <Card className="neomorphism border-0 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">Today's Mandi Prices</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{marketLoading ? 'Loading...' : 'Live market rates'}</p>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden bg-white/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <motion.div 
                      className="flex animate-scroll whitespace-nowrap"
                      initial={{ x: "100%" }}
                      animate={{ x: "-100%" }}
                      transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      {marketPricesData.length > 0 ? [...marketPricesData, ...marketPricesData, ...marketPricesData].map((price, index) => (
                        <motion.span 
                          key={index} 
                          className="mx-4 sm:mx-8 font-medium text-gray-800 text-sm sm:text-base"
                          initial={{ opacity: 0.7 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ 
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 2
                          }}
                        >
                          {price}
                        </motion.span>
                      )) : (
                        <span className="mx-4 sm:mx-8 font-medium text-gray-600">Loading market data...</span>
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Workflow Infographic */}
         
        </div>
      </motion.section>

      {/* How It Works Section */}
<motion.section
  id="about"
  className="relative py-16 sm:py-20 lg:py-28 bg-gray-50 overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.8 }}
>
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <motion.div
      className="text-center mb-12 sm:mb-16 lg:mb-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {t("howItWorksTitle")}
      </h2>
    </motion.div>

    {/* Process Steps */}
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-16">



      {/* STEP 1 */}
      <motion.div
        className="relative group w-full lg:w-80"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.08 }}
      >
        <div className="relative rounded-3xl p-8 sm:p-10 h-56 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 opacity-95"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 
            rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30">
              <lord-icon
                src="https://cdn.lordicon.com/dqxvvqzi.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#ffffff"
                style={{ width: "70px", height: "70px" }}
              ></lord-icon>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mt-4">
              {t("farmerInputs")}
            </h3>
            <p className="text-white/90 text-sm mt-2">
              {t("farmerInputsDesc")}
            </p>
          </div>
        </div>
      </motion.div>



      {/* Arrow 1 */}
      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ArrowRight className="w-8 h-8 text-gray-500" />
      </motion.div>



      {/* STEP 2 */}
      <motion.div
        className="relative group w-full lg:w-80"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        whileHover={{ scale: 1.08 }}
      >
        <div className="relative rounded-3xl p-8 sm:p-10 h-56 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden transition-all duration-300">

          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 opacity-95"></div>
          <div className="absolute top-12 -left-12 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 
              rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30">
              <lord-icon
                src="https://cdn.lordicon.com/gqdnbnwt.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#ffffff"
                style={{ width: "70px", height: "70px" }}
              ></lord-icon>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mt-4">
              {t("aiModels")}
            </h3>
            <p className="text-white/90 text-sm mt-2">
              {t("aiModelsDesc")}
            </p>
          </div>
        </div>
      </motion.div>



      {/* Arrow 2 */}
      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ArrowRight className="w-8 h-8 text-gray-500" />
      </motion.div>



      {/* STEP 3 */}
      <motion.div
        className="relative group w-full lg:w-80"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.08 }}
      >
        <div className="relative rounded-3xl p-8 sm:p-10 h-56 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden transition-all duration-300">

          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-95"></div>
          <div className="absolute -top-8 left-8 w-36 h-36 bg-white/30 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 
              rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30">
              <lord-icon
                src="https://cdn.lordicon.com/etwtznjn.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#ffffff"
                style={{ width: "70px", height: "70px" }}
              ></lord-icon>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mt-4">
              {t("smartInsights")}
            </h3>
            <p className="text-white/90 text-sm mt-2">
              {t("smartInsightsDesc")}
            </p>
          </div>
        </div>
      </motion.div>

    </div>




    {/* ====================== */}
    {/*     STATS GRID         */}
    {/* ====================== */}

<motion.div
  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.5 }}
>

 
{/* 1 — Farmers Empowered */}
<motion.div
  className="relative group"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.6 }}
  whileHover={{ scale: 1.05, y: -5 }}
>
  <div className="bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300">
    
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 mb-4">
      <lord-icon
        src="https://cdn.lordicon.com/bhfjfgqz.json"
        trigger="loop"
        colors="primary:#ffffff"
        style={{ width: "45px", height: "45px" }}
      ></lord-icon>
    </div>

    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
      10,000+
    </h3>
    <p className="text-sm text-gray-600">{t("farmersEmpowered")}</p>
  </div>
</motion.div>


{/* 2 — Detection Accuracy */}
<motion.div
  className="relative group"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.7 }}
  whileHover={{ scale: 1.05, y: -5 }}
>
  <div className="bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300">

    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 mb-4">
      <lord-icon
        src="https://cdn.lordicon.com/hwuyodym.json"
        trigger="loop"
        colors="primary:#ffffff"
        style={{ width: "45px", height: "45px" }}
      ></lord-icon>
    </div>

    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
      95%
    </h3>
    <p className="text-sm text-gray-600">{t("detectionAccuracy")}</p>
  </div>
</motion.div>



  {/* 3 — Crops Supported */}
  <motion.div
    className="relative group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8 }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4">
        <lord-icon
          src="https://cdn.lordicon.com/yqzmiobz.json"
          trigger="loop"
          colors="primary:#ffffff"
          style={{ width: "42px", height: "42px" }}
        ></lord-icon>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        50+
      </h3>
      <p className="text-sm text-gray-600">{t("cropsSupported")}</p>
    </div>
  </motion.div>

  {/* 4 — AI Assistance */}
  <motion.div
    className="relative group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.9 }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
        <lord-icon
          src="https://cdn.lordicon.com/abfverha.json"
          trigger="loop"
          colors="primary:#ffffff"
          style={{ width: "42px", height: "42px" }}
        ></lord-icon>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        24/7
      </h3>
      <p className="text-sm text-gray-600">{t("aiAssistance")}</p>
    </div>
  </motion.div>

</motion.div>


  </div>
</motion.section>



      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 sm:mb-6">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('featuresSubtitle')}
            </p>
          </motion.div>

          {/* Modern Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`relative group ${feature.clickable ? 'cursor-pointer' : ''}`}
                  onClick={() => feature.clickable && handleFeatureClick(feature.route, feature.externalUrl)}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 80,
                    damping: 12
                  }}
                >
                  <motion.div 
                    className="relative rounded-[40px] overflow-hidden h-80 sm:h-[360px]"
                    style={{
                      boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                    whileHover={{ 
                      y: -12,
                      scale: 1.02,
                      boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient Background Base */}
                    <div 
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ background: feature.gradient }}
                    />
                    
                    {/* Background Image - Soft Light Blend */}
                    <motion.div 
                      className="absolute inset-0 opacity-25 transition-opacity duration-700 group-hover:opacity-30"
                      style={{
                        backgroundImage: `url('${feature.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center',
                        filter: 'blur(5px)',
                        mixBlendMode: 'soft-light'
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                    />
                    
                    {/* Overlay Blend Layer */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url('${feature.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center',
                        filter: 'blur(3px)',
                        mixBlendMode: 'overlay'
                      }}
                    />
                    
                    {/* Premium Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
                    
                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/15"></div>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/20"></div>
                    
                    {/* Content Container */}
                    <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col">
                      {/* Top Section - Icon and Badge */}
                      <div className="flex items-start justify-between mb-6">
                        {/* Premium Icon Container */}
                        <motion.div 
                          className="relative w-16 h-16 sm:w-[72px] sm:h-[72px]"
                          whileHover={{ 
                            rotate: [0, -10, 10, -5, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <div className="absolute inset-0 bg-white/25 rounded-[20px] backdrop-blur-xl shadow-2xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/5 rounded-[20px]"></div>
                          <div className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/40"></div>
                          <div className="relative w-full h-full flex items-center justify-center">
                            <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-2xl" strokeWidth={2.5} />
                          </div>
                        </motion.div>
                        
                        {/* Premium Badge */}
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, x: 20, scale: 0.8 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                          <span className="relative block text-xs font-bold bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 shadow-xl text-white tracking-wide">
                            {t(feature.labelKey)}
                          </span>
                        </motion.div>
                      </div>

                      {/* Center - Title Section */}
                      <div className="flex-1 flex flex-col justify-center px-1 my-4">
                        <motion.h3 
                          className="font-black text-2xl sm:text-[28px] leading-tight text-white mb-3"
                          style={{
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          {t(feature.titleKey)}
                        </motion.h3>
                        
                        {/* Description */}
                        <motion.p 
                          className="text-white/80 text-sm sm:text-base font-medium leading-relaxed"
                          style={{
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                          }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                        >
                          {t(feature.descKey)}
                        </motion.p>
                      </div>

                      {/* Bottom - Action Indicator */}
                      <div className="mt-auto pt-4">
                        {feature.clickable && (
                          <motion.div
                            className="flex items-center justify-between group-hover:justify-center transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.05 }}
                          >
                            <motion.div 
                              className="flex items-center gap-3 text-white/70 group-hover:text-white transition-colors duration-300"
                              whileHover={{ x: 8 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-sm font-semibold tracking-wide">{t('explore')}</span>
                              <div className="flex items-center gap-1.5">
                                <div className="w-10 h-0.5 bg-white/50 rounded-full group-hover:w-12 transition-all duration-300"></div>
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        id="contact" 
        className="relative bg-gradient-to-br from-green-800 to-emerald-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        {/* Wave Border */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-16" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,0 L0,0 Z" 
              className="fill-white"
            />
          </svg>
        </div>

        <div className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Logo Section */}
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">HaritNavinya</h3>
                </div>
                <p className="text-green-100 text-sm leading-relaxed">
                  Empowering farmers with cutting-edge AI technology for sustainable and profitable agriculture.
                </p>
              </div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">About</h4>
                <ul className="space-y-2 text-green-100 text-sm">
                  {['Our Mission', 'Technology', 'Impact', 'Partners'].map((item, i) => (
                    <motion.li 
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <a href="#" className="hover:text-white transition-colors">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Features */}
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Features</h4>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Disease Detection</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Crop Planning</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Market Insights</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Weather Data</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact</h4>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                </ul>
              </div>
            </div>

            {/* Credits */}
            <motion.div 
              className="border-t border-green-600 pt-6 sm:pt-8 text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 inline-block max-w-lg mx-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-base sm:text-lg font-medium text-white mb-2">
                  Developed by Final Year AI&DS Students
                </p>
                <p className="text-green-200 text-sm sm:text-base">
                  Genba Sopanrao Moze College of Engineering
                </p>
              </motion.div>
              
              <div className="pt-4">
                <p className="text-green-100 text-xs sm:text-sm">
                  © 2024 HaritNavinya. Revolutionizing agriculture with artificial intelligence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}