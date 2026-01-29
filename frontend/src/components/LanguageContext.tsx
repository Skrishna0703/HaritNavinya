import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    home: 'Home',
    about: 'About',
    features: 'Features',
    contact: 'Contact',
    support: 'Support',
    
    // Hero Section
    heroTitle: 'Smart Agriculture System',
    heroSubtitle: 'AI-Powered Farming Solutions for Modern Agriculture',
    heroDescription: 'Empowering farmers with cutting-edge technology for better crop yields, disease detection, and market insights.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    watchDemo: 'Watch Demo',
    
    // Hero New
    transformYour: 'Transform Your',
    agricultural: 'Agricultural',
    operations: 'Operations',
    heroDescNew: 'Harness the power of AI to optimize your farming operations, predict crop health, and maximize yields with our comprehensive AgriTech platform.',
    getStartedFree: 'Get Started Free',
    
    // Weather Widget
    liveWeather: 'Live Weather',
    mumbaiMaharashtra: 'Mumbai, Maharashtra',
    sunny: 'Sunny',
    humidity: 'Humidity',
    wind: 'Wind',
    
    // Market Price
    marketPriceTicker: 'Market Price Updates',
    todaysPrices: "Today's Market Prices",
    
    // About/How It Works
    howItWorksTitle: 'How HaritNavinya Works',
    farmerInputs: 'Farmer Inputs',
    farmerInputsDesc: 'Upload images, soil data, and field information',
    aiModels: 'AI Models',
    aiModelsDesc: 'Advanced ML algorithms analyze your data',
    smartInsights: 'Smart Insights',
    smartInsightsDesc: 'Get actionable recommendations instantly',
    
    // Stats
    farmersEmpowered: 'Farmers Empowered',
    detectionAccuracy: 'Detection Accuracy',
    cropsSupported: 'Crops Supported',
    aiAssistance: 'AI Assistance',
    
    // Features Section
    featuresTitle: 'Smart Features for Modern Farming',
    featuresSubtitle: 'Comprehensive AI-powered tools to revolutionize your agricultural practices',
    
    // Feature Cards
    plantDisease: 'Plant Disease Detection',
    plantDiseaseDesc: 'Advanced detection system',
    cropRecommendation: 'Crop Recommendation',
    cropRecommendationDesc: 'Optimal crop selection',
    fertilizerRecommendation: 'Fertilizer Recommendation',
    fertilizerRecommendationDesc: 'Nutrient optimization',
    marketPrice: 'Market Price Forecast',
    marketPriceDesc: 'Real-time pricing',
    disasterAlerts: 'Disaster Alerts',
    disasterAlertsDesc: 'Early alert system',
    aiChatbot: 'AI Chatbot',
    aiChatbotDesc: '24/7 farm support',
    soilData: 'Soil Data & Fertility Insights',
    soilDataDesc: 'Comprehensive soil health',
    weatherForecast: 'Weather & Rainfall Forecast',
    weatherForecastDesc: '7-day predictions',
    soilTesting: 'Nearest Soil Testing Centers',
    soilTestingDesc: 'Find nearby labs',
    smartFarming: 'Smart Farming Guidance',
    smartFarmingDesc: 'Professional advice',
    farmerOfficer: 'Farmer–Officer Connect',
    farmerOfficerDesc: 'Government liaison',
    postHarvest: 'Post-Harvest Support',
    postHarvestDesc: 'Storage & distribution',
    
    // Feature Labels
    aiModule: 'AI Module',
    smartTool: 'Smart Tool',
    precision: 'Precision',
    analytics: 'Analytics',
    warning: 'Warning',
    assistant: 'Assistant',
    analysis: 'Analysis',
    forecast: 'Forecast',
    locator: 'Locator',
    expert: 'Expert',
    network: 'Network',
    service: 'Service',
    
    // CTA
    explore: 'Explore',
    
    // Footer
    developedBy: 'Developed By',
    finalYearStudents: 'Final Year AI&DS Students',
    collegeName: 'Genba Sopanrao Moze College of Engineering',
    buildingFuture: 'Building the future of agriculture',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    ourTeam: 'Our Team',
    careers: 'Careers',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved',
    
    // Mission & Vision
    ourMission: 'Our Mission',
    missionText: 'To democratize agricultural technology and empower every Indian farmer with AI-powered tools that enhance crop yields, reduce costs, and promote sustainable farming practices.',
    ourVision: 'Our Vision',
    visionText: 'To create a future where technology and traditional farming wisdom work together, making Indian agriculture more resilient, profitable, and sustainable for generations to come.',
    
    // Technology
    poweredByAI: 'Powered by Advanced AI',
    techSubtitle: 'Cutting-edge technology meets agricultural expertise',
    machineLearning: 'Machine Learning',
    satelliteData: 'Satellite Data',
    weatherAnalytics: 'Weather Analytics',
    marketIntelligence: 'Market Intelligence',
    knowledgeBase: 'Knowledge Base',
    communitySupport: 'Community Support',
  },
  hi: {
    // Navbar
    home: 'मुख्य पृष्ठ',
    about: 'हमारे बारे में',
    features: 'विशेषताएं',
    contact: 'संपर्क करें',
    support: 'सहायता',
    
    // Hero Section
    heroTitle: 'स्मार्ट कृषि प्रणाली',
    heroSubtitle: 'आधुनिक कृषि के लिए एआई-संचालित समाधान',
    heroDescription: 'बेहतर फसल उपज, रोग पहचान और बाजार जानकारी के लिए अत्याधुनिक तकनीक से किसानों को सशक्त बनाना।',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    watchDemo: 'डेमो देखें',
    
    // Hero New
    transformYour: 'बदलें अपनी',
    agricultural: 'कृषि',
    operations: 'संचालन',
    heroDescNew: 'हमारे व्यापक एग्रीटेक प्लेटफॉर्म के साथ अपनी खेती संचालन को अनुकूलित करने, फसल स्वास्थ्य की भविष्यवाणी करने और पैदावार को अधिकतम करने के लिए एआई की शक्ति का उपयोग करें।',
    getStartedFree: 'निःशुल्क शुरू करें',
    
    // Weather Widget
    liveWeather: 'लाइव मौसम',
    mumbaiMaharashtra: 'मुंबई, महाराष्ट्र',
    sunny: 'धूप',
    humidity: 'आर्द्रता',
    wind: 'हवा',
    
    // Market Price
    marketPriceTicker: 'बाजार मूल्य अपडेट',
    todaysPrices: 'आज के बाजार मूल्य',
    
    // About/How It Works
    howItWorksTitle: 'हरितनवीन्य कैसे काम करता है',
    farmerInputs: 'किसान इनपुट',
    farmerInputsDesc: 'चित्र, मिट्टी डेटा और खेत की जानकारी अपलोड करें',
    aiModels: 'एआई मॉडल',
    aiModelsDesc: 'उन्नत एमएल एल्गोरिदम आपके डेटा का विश्लेषण करते हैं',
    smartInsights: 'स्मार्ट इनसाइट्स',
    smartInsightsDesc: 'तुरंत कार्रवाई योग्य सुझाव प्राप्त करें',
    
    // Stats
    farmersEmpowered: 'सशक्त किसान',
    detectionAccuracy: 'पहचान सटीकता',
    cropsSupported: 'समर्थित फसलें',
    aiAssistance: 'एआई सहायता',
    
    // Features Section
    featuresTitle: 'आधुनिक कृषि के लिए स्मार्ट विशेषताएं',
    featuresSubtitle: 'आपकी कृषि प्रथाओं में क्रांति लाने के लिए व्यापक एआई-संचालित उपकरण',
    
    // Feature Cards
    plantDisease: 'पौधों की बीमारी का पता लगाना',
    plantDiseaseDesc: 'उन्नत पहचान प्रणाली',
    cropRecommendation: 'फसल सिफारिश',
    cropRecommendationDesc: 'इष्टतम फसल चयन',
    fertilizerRecommendation: 'उर्वरक सिफारिश',
    fertilizerRecommendationDesc: 'पोषक तत्व अनुकूलन',
    marketPrice: 'बाजार मूल्य पूर्वानुमान',
    marketPriceDesc: 'वास्तविक समय मूल्य निर्धारण',
    disasterAlerts: 'आपदा चेतावनी',
    disasterAlertsDesc: 'प्रारंभिक चेतावनी प्रणाली',
    aiChatbot: 'एआई चैटबॉट',
    aiChatbotDesc: '24/7 खेत सहायता',
    soilData: 'मिट्टी डेटा और उर्वरता जानकारी',
    soilDataDesc: 'व्यापक मिट्टी स्वास्थ्य',
    weatherForecast: 'मौसम और वर्षा पूर्वानुमान',
    weatherForecastDesc: '7-दिन की भविष्यवाणी',
    soilTesting: 'निकटतम मिट्टी परीक्षण केंद्र',
    soilTestingDesc: 'पास की प्रयोगशालाएं खोजें',
    smartFarming: 'स्मार्ट कृषि मार्गदर्शन',
    smartFarmingDesc: 'पेशेवर सलाह',
    farmerOfficer: 'किसान-अधिकारी कनेक्ट',
    farmerOfficerDesc: 'सरकारी संपर्क',
    postHarvest: 'फसल-कटाई के बाद सहायता',
    postHarvestDesc: 'भंडारण और वितरण',
    
    // Feature Labels
    aiModule: 'एआई मॉड्यूल',
    smartTool: 'स्मार्ट टूल',
    precision: 'परिशुद्धता',
    analytics: 'विश्लेषण',
    warning: 'चेतावनी',
    assistant: 'सहायक',
    analysis: 'विश्लेषण',
    forecast: 'पूर्वानुमान',
    locator: 'लोकेटर',
    expert: 'विशेषज्ञ',
    network: 'नेटवर्क',
    service: 'सेवा',
    
    // CTA
    explore: 'अन्वेषण करें',
    
    // Footer
    developedBy: 'द्वारा विकसित',
    finalYearStudents: 'अंतिम वर्ष एआई एंड डीएस छात्र',
    collegeName: 'जेनबा सोपनराव मोजे कॉलेज ऑफ इंजीनियरिंग',
    buildingFuture: 'कृषि का भविष्य बना रहे हैं',
    quickLinks: 'त्वरित लिंक',
    aboutUs: 'हमारे बारे में',
    ourTeam: 'हमारी टीम',
    careers: 'करियर',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित',
    
    // Mission & Vision
    ourMission: 'हमारा मिशन',
    missionText: 'कृषि प्रौद्योगिकी को लोकतांत्रिक बनाना और प्रत्येक भारतीय किसान को एआई-संचालित उपकरणों से सशक्त बनाना जो फसल की पैदावार बढ़ाते हैं, लागत कम करते हैं और टिकाऊ खेती को बढ़ावा देते हैं।',
    ourVision: 'हमारी दृष्टि',
    visionText: 'एक ऐसा भविष्य बनाना जहां प्रौद्योगिकी और पारंपरिक कृषि ज्ञान एक साथ काम करें, जिससे भारतीय कृषि आने वाली पीढ़ियों के लिए अधिक लचीली, लाभदायक और टिकाऊ हो।',
    
    // Technology
    poweredByAI: 'उन्नत एआई द्वारा संचालित',
    techSubtitle: 'अत्याधुनिक तकनीक कृषि विशेषज्ञता से मिलती है',
    machineLearning: 'मशीन लर्निंग',
    satelliteData: 'सैटेलाइट डेटा',
    weatherAnalytics: 'मौसम विश्लेषण',
    marketIntelligence: 'बाजार सूचना',
    knowledgeBase: 'ज्ञान आधार',
    communitySupport: 'समुदाय सहायता',
  },
  mr: {
    // Navbar
    home: 'मुख्यपृष्ठ',
    about: 'आमच्याबद्दल',
    features: 'वैशिष्ट्ये',
    contact: 'संपर्क',
    support: 'मदत',
    
    // Hero Section
    heroTitle: 'स्मार्ट शेती प्रणाली',
    heroSubtitle: 'आधुनिक शेतीसाठी एआय-चालित उपाय',
    heroDescription: 'चांगल्या पीक उत्पादन, रोग शोध आणि बाजार माहितीसाठी अत्याधुनिक तंत्रज्ञानाने शेतकऱ्यांना सशक्त करणे.',
    getStarted: 'सुरू करा',
    learnMore: 'अधिक जाणून घ्या',
    watchDemo: 'डेमो पहा',
    
    // About/How It Works
    howItWorksTitle: 'हरितनवीन्य कसे कार्य करते',
    farmerInputs: 'शेतकरी इनपुट',
    farmerInputsDesc: 'चित्रे, माती डेटा आणि शेताची माहिती अपलोड करा',
    aiModels: 'एआय मॉडेल्स',
    aiModelsDesc: 'प्रगत एमएल अल्गोरिदम तुमच्या डेटाचे विश्लेषण करतात',
    smartInsights: 'स्मार्ट इनसाइट्स',
    smartInsightsDesc: 'लगेच कृतीयोग्य शिफारशी मिळवा',
    
    // Stats
    farmersEmpowered: 'सशक्त शेतकरी',
    detectionAccuracy: 'शोध अचूकता',
    cropsSupported: 'समर्थित पिके',
    aiAssistance: 'एआय सहाय्य',
    
    // Mission & Vision
    ourMission: 'आमचे ध्येय',
    missionText: 'कृषी तंत्रज्ञानाला लोकशाही बनवणे आणि प्रत्येक भारतीय शेतकऱ्याला एआय-चालित साधनांनी सशक्त करणे जे पीक उत्पादन वाढवतात, खर्च कमी करतात आणि शाश्वत शेतीला प्रोत्साहन देतात.',
    ourVision: 'आमची दृष्टी',
    visionText: 'असे भविष्य निर्माण करणे जिथे तंत्रज्ञान आणि पारंपरिक शेती ज्ञान एकत्र काम करतात, ज्यामुळे भारतीय शेती येणाऱ्या पिढ्यांसाठी अधिक लवचिक, फायदेशीर आणि शाश्वत होईल.',
    
    // Features
    featuresTitle: 'आधुनिक शेतीसाठी स्मार्ट वैशिष्ट्ये',
    featuresSubtitle: 'तुमच्या शेती पद्धतींमध्ये क्रांती घडवण्यासाठी सर्वसमावेशक एआय-चालित साधने',
    plantDisease: 'वनस्पती रोग शोध',
    cropRecommendation: 'पीक शिफारस',
    fertilizerRecommendation: 'खत शिफारस',
    marketPrice: 'बाजार किंमत अंदाज',
    disasterAlerts: 'आपत्ती सूचना',
    aiChatbot: 'एआय चॅटबॉट',
    soilData: 'माती डेटा आणि सुपीकता माहिती',
    weatherForecast: 'हवामान आणि पाऊस अंदाज',
    soilTesting: 'जवळचे माती चाचणी केंद्र',
    smartFarming: 'स्मार्ट शेती मार्गदर्शन',
    farmerOfficer: 'शेतकरी-अधिकारी कनेक्ट',
    postHarvest: 'कापणीनंतर समर्थन',
    
    // Footer
    developedBy: 'द्वारे विकसित',
    finalYearStudents: 'अंतिम वर्षाचे एआय आणि डीएस विद्यार्थी',
    collegeName: 'जेनबा सोपनराव मोजे कॉलेज ऑफ इंजिनिअरिंग',
    buildingFuture: 'शेतीचे भविष्य तयार करत आहेत',
    
    // Technology
    poweredByAI: 'प्रगत एआय द्वारे समर्थित',
    techSubtitle: 'अत्याधुनिक तंत्रज्ञान कृषी तज्ञांना भेटते',
    machineLearning: 'मशीन लर्निंग',
    satelliteData: 'सॅटेलाइट डेटा',
    weatherAnalytics: 'हवामान विश्लेषण',
    marketIntelligence: 'बाजार माहिती',
    knowledgeBase: 'ज्ञान आधार',
    communitySupport: 'समुदाय समर्थन',
  },
  ta: {
    // Navbar
    home: 'முகப்பு',
    about: 'எங்களைப் பற்றி',
    features: 'அம்சங்கள்',
    contact: 'தொடர்பு',
    support: 'ஆதரவு',
    
    // Hero
    heroTitle: 'ஸ்மார்ட் விவசாய அமைப்பு',
    heroSubtitle: 'நவீன விவசாயத்திற்கான AI-இயக்கப்படும் தீர்வுகள்',
    heroDescription: 'சிறந்த பயிர் விளைச்சல், நோய் கண்டறிதல் மற்றும் சந்தை நுண்ணறிவுக்காக அதிநவீன தொழில்நுட்பத்துடன் விவசாयிகளுக்கு அதிகாரமளித்தல்.',
    getStarted: 'தொடங்குங்கள்',
    learnMore: 'மேலும் அறிக',
    watchDemo: 'டெமோவைப் பார்க்கவும்',
    
    // About
    howItWorksTitle: 'ஹரித்நவின்யா எவ்வாறு செயல்படுகிறது',
    farmerInputs: 'விவசாயி உள்ளீடுகள்',
    farmerInputsDesc: 'படங்கள், மண் தரவு மற்றும் வயல் தகவலைப் பதிவேற்றவும்',
    aiModels: 'AI மாதிரிகள்',
    aiModelsDesc: 'மேம்பட்ட ML வழிமுறைகள் உங்கள் தரவை பகுப்பாய்வு செய்கின்றன',
    smartInsights: 'ஸ்மார்ட் நுண்ணறிவுகள்',
    smartInsightsDesc: 'உடனடியாக செயல்படக்கூடிய பரிந்துரைகளைப் பெறுங்கள்',
    
    // Stats
    farmersEmpowered: 'அதிகாரமளிக்கப்பட்ட விவசாயிகள்',
    detectionAccuracy: 'கண்டறிதல் துல்லியம்',
    cropsSupported: 'ஆதரிக்கப்பட்ட பயிர்கள்',
    aiAssistance: 'AI உதவி',
    
    // Mission & Vision
    ourMission: 'எங்கள் நோக்கம்',
    missionText: 'விவசாய தொழில்நுட்பத்தை ஜனநாயகமாக்குதல் மற்றும் ஒவ்வொரு இந்திய விவசாயியையும் AI-இயக்கப்படும் கருவிகளால் அதிகாரமளித்தல்.',
    ourVision: 'எங்கள் பார்வை',
    visionText: 'தொழில்நுட்பமும் பாரம்பரிய விவசாய அறிவும் ஒன்றாக இணைந்து செயல்படும் எதிர்காலத்தை உருவாக்குதல்.',
    
    // Features
    featuresTitle: 'நவீன விவசாயத்திற்கான ஸ்மார்ட் அம்சங்கள்',
    featuresSubtitle: 'உங்கள் விவசாய நடைமுறைகளில் புரட்சி செய்ய விரிவான AI-இயக்கப்படும் கருவிகள்',
    plantDisease: 'தாவர நோய் கண்டறிதல்',
    cropRecommendation: 'பயிர் பரிந்துரை',
    fertilizerRecommendation: 'உரப் பரிந்துரை',
    marketPrice: 'சந்தை விலை முன்னறிவிப்பு',
    disasterAlerts: 'பேரிடர் எச்சரிக்கைகள்',
    aiChatbot: 'AI சாட்பாட்',
    soilData: 'மண் தரவு மற்றும் வளத்தன்மை நுண்ணறிவுகள்',
    weatherForecast: 'வானிலை மற்றும் மழை முன்னறிவிப்பு',
    soilTesting: 'அருகிலுள்ள மண் சோதனை மையங்கள்',
    smartFarming: 'ஸ்மார்ட் விவசாய வழிகாட்டுதல்',
    farmerOfficer: 'விவசாயி-அதிகாரி இணைப்பு',
    postHarvest: 'அறுவடைக்குப் பின் ஆதரவு',
    
    // Footer
    developedBy: 'உருவாக்கியவர்கள்',
    finalYearStudents: 'இறுதியாண்டு AI & DS மாணவர்கள்',
    collegeName: 'ஜென்பா சோபன்ராவ் மோஜே பொறியியல் கல்லூரி',
    buildingFuture: 'விவசாயத்தின் எதிர்காலத்தை உருவாக்குகிறது',
    
    // Technology
    poweredByAI: 'மேம்பட்ட AI மூலம் இயக்கப்படுகிறது',
    techSubtitle: 'अதிநவீன தொழில்நுட்பம் விவசாய நிபுணத்துவத்தை சந்திக்கிறது',
    machineLearning: 'இயந்திர கற்றல்',
    satelliteData: 'செயற்கைக்கோள் தரவு',
    weatherAnalytics: 'வானிலை பகுப்பாய்வு',
    marketIntelligence: 'சந்தை நுண்ணறிவு',
    knowledgeBase: 'அறிவு தளம்',
    communitySupport: 'சமூக ஆதரவு',
  },
  te: {
    // Navbar
    home: 'హోమ్',
    about: 'మా గురించి',
    features: 'ఫీచర్లు',
    contact: 'సంప్రదించండి',
    support: 'మద్దతు',
    
    // Hero
    heroTitle: 'స్మార్ట్ వ్యవసాయ వ్యవస్థ',
    heroSubtitle: 'ఆధునిక వ్యవసాయం కోసం AI-ఆధారిత పరిష్కారాలు',
    heroDescription: 'మెరుగైన పంట దిగుబడి, వ్యాధి గుర్తింపు మరియు మార్కెట్ అంతర్దృష్టుల కోసం అత్యాధునిక సాంకేతికతతో రైతులకు అధికారం ఇవ్వడం.',
    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరింత తెలుసుకోండి',
    watchDemo: 'డెమో చూడండి',
    
    // About
    howItWorksTitle: 'హరిత్నవిన్యా ఎలా పనిచేస్తుంది',
    farmerInputs: 'రైతు ఇన్‌పుట్‌లు',
    farmerInputsDesc: 'చిత్రాలు, నేల డేటా మరియు పొలం సమాచారాన్ని అప్‌లోడ్ చేయండి',
    aiModels: 'AI మోడల్స్',
    aiModelsDesc: 'అధునాతన ML అల్గారిథమ్‌లు మీ డేటాను విశ్లేషిస్తాయి',
    smartInsights: 'స్మార్ట్ ఇన్‌సైట్‌లు',
    smartInsightsDesc: 'తక్షణమే చర్య తీసుకోదగిన సిఫార్సులను పొందండి',
    
    // Stats
    farmersEmpowered: 'అధికారం పొందిన రైతులు',
    detectionAccuracy: 'గుర్తింపు ఖచ్చితత్వం',
    cropsSupported: 'మద్దతు ఉన్న పంటలు',
    aiAssistance: 'AI సహాయం',
    
    // Mission & Vision
    ourMission: 'మా లక్ష్యం',
    missionText: 'వ్యవసాయ సాంకేతికతను ప్రజాస్వామ్యం చేయడం మరియు ప్రతి భారతీయ రైతుకు AI-ఆధారిత సాధనాలతో అధికారం ఇవ్వడం.',
    ourVision: 'మా దృష్టి',
    visionText: 'సాంకేతికత మరియు సాంప్రదాయ వ్యవసాయ జ్ఞానం కలిసి పనిచేసే భవిష్యత్తును సృష్టించడం.',
    
    // Features
    featuresTitle: 'ఆధునిక వ్యవసాయం కోసం స్మార్ట్ ఫీచర్లు',
    featuresSubtitle: 'మీ వ్యవసాయ పద్ధతులలో విప్లవం చేయడానికి సమగ్ర AI-ఆధారిత సాధనాలు',
    plantDisease: 'మొక్క వ్యాధి గుర్తింపు',
    cropRecommendation: 'పంట సిఫార్సు',
    fertilizerRecommendation: 'ఎరువుల సిఫార్సు',
    marketPrice: 'మార్కెట్ ధర అంచనా',
    disasterAlerts: 'విపత్తు హెచ్చరికలు',
    aiChatbot: 'AI చాట్‌బాట్',
    soilData: 'నేల డేటా & సారవంతత అంతర్దృష్టులు',
    weatherForecast: 'వాతావరణం & వర్షపాతం అంచనా',
    soilTesting: 'సమీప నేల పరీక్ష కేంద్రాలు',
    smartFarming: 'స్మార్ట్ వ్యవసాయ మార్గదర్శకత్వం',
    farmerOfficer: 'రైతు-అధికారి కనెక్ట్',
    postHarvest: 'పంట కోత తర్వాత మద్దతు',
    
    // Footer
    developedBy: 'అభివృద్ధి చేసినవారు',
    finalYearStudents: 'చివరి సంవత్సరం AI & DS విద్యార్థులు',
    collegeName: 'జెన్బా సోపన్రావ్ మోజే కాలేజ్ ఆఫ్ ఇంజినీరింగ్',
    buildingFuture: 'వ్యవసాయ భవిష్యత్తును నిర్మిస్తున్నారు',
    
    // Technology
    poweredByAI: 'అధునాతన AI ద్వారా శక్తివంతం',
    techSubtitle: 'అత్యాధునిక సాంకేతికత వ్యవసాయ నైపుణ్యాన్ని కలుస్తుంది',
    machineLearning: 'మెషిన్ లెర్నింగ్',
    satelliteData: 'ఉపగ్రహ డేటా',
    weatherAnalytics: 'వాతావరణ విశ్లేషణ',
    marketIntelligence: 'మార్కెట్ ఇంటెలిజెన్స్',
    knowledgeBase: 'జ్ఞాన స్థావరం',
    communitySupport: 'సమాజ మద్దతు',
  },
  bn: {
    // Navbar
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    features: 'বৈশিষ্ট্য',
    contact: 'যোগাযোগ',
    support: 'সহায়তা',
    
    // Hero
    heroTitle: 'স্মার্ট কৃষি ব্যবস্থা',
    heroSubtitle: 'আধুনিক কৃষির জন্য AI-চালিত সমাধান',
    heroDescription: 'উন্নত ফসল উৎপাদন, রোগ সনাক্তকরণ এবং বাজার তথ্যের জন্য অত্যাধুনিক প্রযুক্তি দিয়ে কৃষকদের ক্ষমতায়ন।',
    getStarted: 'শুরু করুন',
    learnMore: 'আরও জানুন',
    watchDemo: 'ডেমো দেখুন',
    
    // About
    howItWorksTitle: 'হরিতনবীন্যা কীভাবে কাজ করে',
    farmerInputs: 'কৃষক ইনপুট',
    farmerInputsDesc: 'ছবি, মাটির ডেটা এবং ক্ষেতের তথ্য আপলোড করুন',
    aiModels: 'AI মডেল',
    aiModelsDesc: 'উন্নত ML অ্যালগরিদম আপনার ডেটা বিশ্লেষণ করে',
    smartInsights: 'স্মার্ট ইনসাইট',
    smartInsightsDesc: 'তাৎক্ষণিক কার্যকর সুপারিশ পান',
    
    // Stats
    farmersEmpowered: 'ক্ষমতাপ্রাপ্ত কৃষক',
    detectionAccuracy: 'সনাক্তকরণ নির্ভুলতা',
    cropsSupported: 'সমর্থিত ফসল',
    aiAssistance: 'AI সহায়তা',
    
    // Mission & Vision
    ourMission: 'আমাদের মিশন',
    missionText: 'কৃষি প্রযুক্তিকে গণতান্ত্রিক করা এবং প্রতিটি ভারতীয় কৃষককে AI-চালিত সরঞ্জাম দিয়ে ক্ষমতায়ন করা।',
    ourVision: 'আমাদের দৃষ্টিভঙ্গি',
    visionText: 'একটি ভবিষ্যত তৈরি করা যেখানে প্রযুক্তি এবং ঐতিহ্যবাহী কৃষি জ্ঞান একসাথে কাজ করে।',
    
    // Features
    featuresTitle: 'আধুনিক কৃষির জন্য স্মার্ট বৈশিষ্ট্য',
    featuresSubtitle: 'আপনার কৃষি অনুশীলনে বিপ্লব ঘটাতে ব্যাপক AI-চালিত সরঞ্জাম',
    plantDisease: 'উদ্ভিদ রোগ সনাক্তকরণ',
    cropRecommendation: 'ফসল সুপারিশ',
    fertilizerRecommendation: 'সার সুপারিশ',
    marketPrice: 'বাজার মূল্য পূর্বাভাস',
    disasterAlerts: 'দুর্যোগ সতর্কতা',
    aiChatbot: 'AI চ্যাটবট',
    soilData: 'মাটির ডেটা এবং উর্বরতা তথ্য',
    weatherForecast: 'আবহাওয়া এবং বৃষ্টিপাত পূর্বাভাস',
    soilTesting: 'নিকটতম মাটি পরীক্ষা কেন্দ্র',
    smartFarming: 'স্মার্ট কৃষি নির্দেশনা',
    farmerOfficer: 'কৃষক-কর্মকর্তা সংযোগ',
    postHarvest: 'ফসল কাটার পরে সহায়তা',
    
    // Footer
    developedBy: 'দ্বারা উন্নত',
    finalYearStudents: 'চূড়ান্ত বছরের AI & DS ছাত্র',
    collegeName: 'জেনবা সোপানরাও মোজে কলেজ অফ ইঞ্জিনিয়ারিং',
    buildingFuture: 'কৃষির ভবিষ্যৎ নির্মাণ করছে',
    
    // Technology
    poweredByAI: 'উন্নত AI দ্বারা চালিত',
    techSubtitle: 'অত্যাধুনিক প্রযুক্তি কৃষি দক্ষতার সাথে মিলিত হয়',
    machineLearning: 'মেশিন লার্নিং',
    satelliteData: 'স্যাটেলাইট ডেটা',
    weatherAnalytics: 'আবহাওয়া বিশ্লেষণ',
    marketIntelligence: 'বাজার বুদ্ধিমত্তা',
    knowledgeBase: 'জ্ঞান ভিত্তি',
    communitySupport: 'সম্প্রদায় সহায়তা',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}