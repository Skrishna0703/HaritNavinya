import {
  generateChatbotResponse,
  generateChatbotResponseWithHistory,
  extractAgriculturalData
} from '../services/chatbotService.js';

/**
 * Intelligent fallback responses for agriculture questions
 */
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('blight')) {
    return `🔍 **Plant Disease Solution:**

Common symptoms:
• Yellow/brown spots on leaves
• Wilting or stunted growth
• Unusual discoloration

**Treatment Options:**
🌿 Organic: Neem oil (3%), Bordeaux mixture, Bacillus subtilis
🧪 Chemical: Mancozeb, Tebuconazole, Carbendazim

**Prevention:**
• Crop rotation (2-3 years)
• Proper spacing for air circulation
• Avoid overhead irrigation
• Remove infected plants immediately

**Timing:** Apply preventive spray 2 weeks before monsoon`;

  } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('npk') || lowerMessage.includes('nutrient')) {
    return `🌱 **Fertilizer Recommendation:**

**NPK Requirements by Crop Stage:**
• Vegetative: N-heavy (10-26-26)
• Flowering: P-heavy (10-52-10)
• Fruiting: K-heavy (0-0-48)

**Recommended Schedule:**
1. **Base Dose**: Before sowing (Farm Yard Manure 5 tons/acre)
2. **Top Dress I**: 30-45 days (Urea 50 kg/acre)
3. **Top Dress II**: 60-75 days (remaining fertilizer)

**Micronutrients:**
• Zinc: 5-10 kg/hectare
• Iron: 5-10 kg/hectare
• Boron: 1-2 kg/hectare

**Application Method:** Soil application or foliar spray`;

  } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('season')) {
    return `🌾 **Crop Recommendation Guide:**

**Kharif (Monsoon) Crops:**
• Rice, Maize, Cotton, Groundnut, Soybean
• Sowing: June-July
• Harvest: September-October

**Rabi (Winter) Crops:**
• Wheat, Chickpea, Lentil, Mustard, Cumin
• Sowing: October-November
• Harvest: March-April

**Zaid (Summer) Crops:**
• Watermelon, Muskmelon, Cucumber, Okra
• Sowing: February-March
• Harvest: May-June

**Factors to Consider:**
✓ Soil type and pH
✓ Water availability
✓ Temperature range
✓ Local market demand
✓ Your experience level`;

  } else if (lowerMessage.includes('soil') || lowerMessage.includes('ph') || lowerMessage.includes('loamy')) {
    return `🌍 **Soil Analysis Tips:**

**Soil Types:**
• Sandy: Well-draining, low water retention → Irrigation needed
• Loamy: Ideal for most crops → Balanced properties
• Clay: Water retention, poor drainage → Add organic matter

**pH Requirements:**
• pH 6.0-7.0: Most vegetables and cereals
• pH 5.5-6.5: Rice and sugarcane
• pH 7.0-8.0: Pulses and oilseeds

**Improvement Methods:**
• Add Farm Yard Manure (5 tons/acre)
• Green manuring and cover crops
• Drip irrigation for clay soils
• Mulching to retain moisture

**Testing:** Get soil tested every 2 years`;

  } else if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
    return `💧 **Irrigation Guide:**

**Water Requirements (mm/season):**
• Wheat: 450-650 mm
• Rice: 1000-1500 mm
• Cotton: 600-1000 mm
• Vegetables: 300-500 mm

**Irrigation Methods:**
🚿 Surface: Suitable for clayey soils
💧 Drip: 30-50% water saving, ideal for vegetables
🌦️ Sprinkler: For sandy soils, crops with wide row spacing

**Frequency:**
• Check soil moisture at 15 cm depth
• Irrigate when available water depletes 50%
• Avoid waterlogging

**Timing:** Early morning or evening recommended`;

  } else {
    return `🌾 **Agriculture Assistant at Your Service!**

I can help you with:
✓ Crop selection for your region
✓ Pest and disease management
✓ Fertilizer recommendations
✓ Soil improvement techniques
✓ Irrigation planning
✓ Seasonal farming guide
✓ Market price insights

Please ask specific questions like:
• "What crop for monsoon?"
• "How to treat tomato blight?"
• "Best fertilizer for wheat?"
• "Irrigation for sandy soil?"

Let me know how I can help! 🌱`;
  }
};

/**
 * Handle chat endpoint - accepts user message and returns AI response
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate request body
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message field is required in request body'
      });
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'API key not configured. Contact administrator.'
      });
    }

    // Extract agricultural data from user input for context
    const agriculturalData = extractAgriculturalData(message);

    let reply;
    try {
      // Try to get response from Gemini API
      if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        reply = await generateChatbotResponseWithHistory(message, conversationHistory, apiKey);
      } else {
        reply = await generateChatbotResponse(message, apiKey);
      }
    } catch (apiError) {
      console.warn('Gemini API unavailable, using fallback response:', apiError.message);
      // Use intelligent fallback response
      reply = getFallbackResponse(message);
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      reply: reply,
      context: agriculturalData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat Controller Error:', error.message);

    // Handle specific error types
    let statusCode = 500;
    let errorMessage = 'An error occurred while processing your request';

    if (error.message.includes('API key')) {
      statusCode = 500;
      errorMessage = 'API configuration error';
    } else if (error.message.includes('Rate limit')) {
      statusCode = 429;
      errorMessage = 'Too many requests. Please try again later';
    } else if (error.message.includes('cannot be empty')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes('too long')) {
      statusCode = 400;
      errorMessage = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: error.message
    });
  }
};

/**
 * Health check endpoint
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Agriculture Chatbot API is running',
    service: 'gemini-agriculture-chatbot',
    timestamp: new Date().toISOString()
  });
};

/**
 * Get chatbot info and capabilities
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getChatbotInfo = (req, res) => {
  res.status(200).json({
    success: true,
    chatbot: {
      name: 'Agriculture AI Assistant',
      version: '1.0.0',
      description: 'Expert agriculture assistant for Indian farmers',
      capabilities: [
        'Crop recommendations',
        'Pest and disease identification',
        'Fertilizer recommendations',
        'Soil analysis',
        'Weather-based farming guidance',
        'Irrigation planning',
        'Seasonal crop planning',
        'Market price insights'
      ],
      supportedLanguages: ['English', 'Hindi'],
      model: 'gemini-1.5-flash',
      endpoints: {
        chat: 'POST /api/chatbot/chat',
        health: 'GET /api/chatbot/health',
        info: 'GET /api/chatbot/info'
      }
    }
  });
};

export default {
  chatWithAI,
  healthCheck,
  getChatbotInfo
};
