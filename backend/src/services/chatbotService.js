import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const isGroqApiKey = (apiKey) => typeof apiKey === 'string' && apiKey.startsWith('gsk_');

const getProvider = (apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  return isGroqApiKey(apiKey) ? 'groq' : 'gemini';
};

const callGroqChat = async (messages, apiKey) => {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 700
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No response generated from Groq model');
  }

  return content;
};

/**
 * InitializeGemini AI client for Agriculture Chatbot
 * @param {string} apiKey - Google Gemini API key
 * @returns {object} Initialized Gemini client
 */
const initializeGemini = (apiKey) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Agriculture-specific system prompt for the chatbot
 */
const AGRICULTURE_SYSTEM_PROMPT = `You are an expert agriculture assistant designed specifically for Indian farmers.

Your goal is to provide accurate, practical, and easy-to-understand farming advice based on the user's query.

Follow these instructions strictly:

* Respond in simple English or Hindi (or mix based on query language)
* Focus on Indian agriculture conditions
* If crop is mentioned:
  include soil, fertilizer (NPK), irrigation, season, yield
* If pest/disease is mentioned:
  include problem description, solution (organic + chemical), prevention methods
* If soil data is given (N, P, K, pH, rainfall, temperature):
  recommend best crop with detailed explanation
* If question is general:
  provide step-by-step farming guide

Format response as follows when applicable:

🌱 Crop Advice:
* Soil: [soil type requirements]
* Fertilizer: [NPK recommendations]
* Irrigation: [water requirements]
* Season: [best planting time]
* Yield: [expected production]

🐛 Disease/Pest Solution:
* Problem: [description]
* Solution: [organic and chemical options]
* Prevention: [preventive measures]

💡 Additional Tips:
[Extra advice relevant to query]

Keep response concise (200–300 words max)
Always provide practical, actionable advice
If uncertain, suggest consulting local agricultural officers`;

/**
 * Generate response from Gemini AI for agriculture queries
 * @param {string} userMessage - User's question or query
 * @param {string} apiKey - Google Gemini API key
 * @returns {Promise<string>} AI-generated response
 */
export const generateChatbotResponse = async (userMessage, apiKey) => {
  try {
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error('User message cannot be empty');
    }

    if (userMessage.length > 10000) {
      throw new Error('Message is too long. Please keep it under 10,000 characters');
    }

    const provider = getProvider(apiKey);

    if (provider === 'groq') {
      return callGroqChat([
        { role: 'system', content: AGRICULTURE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `User Question: ${userMessage}\n\nPlease provide helpful agricultural advice based on the above question.`
        }
      ], apiKey);
    }

    const genAI = initializeGemini(apiKey);

    const modelsToTry = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
    let model = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: AGRICULTURE_SYSTEM_PROMPT
        });

        const fullPrompt = `User Question: ${userMessage}\n\nPlease provide helpful agricultural advice based on the above question.`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          return text;
        }
      } catch (error) {
        lastError = error;
        console.warn(`Model ${modelName} failed:`, error.message);
      }
    }

    if (lastError) {
      throw lastError;
    }

    throw new Error('No response generated from AI model');
  } catch (error) {
    console.error('Chatbot Service Error:', error.message);

    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing AI API key');
    } else if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again later');
    } else if (error.message.includes('500')) {
      throw new Error('AI service error. Please try again');
    } else if (error.message.includes('not found') || error.message.includes('not supported')) {
      throw new Error('Model not available with current API key. Check your quota and billing.');
    }

    throw error;
  }
};

/**
 * Generate response with conversation history (for multi-turn conversations)
 * @param {string} userMessage - Current user message
 * @param {Array} conversationHistory - Array of previous messages
 * @param {string} apiKey - Google Gemini API key
 * @returns {Promise<string>} AI-generated response
 */
export const generateChatbotResponseWithHistory = async (
  userMessage,
  conversationHistory = [],
  apiKey
) => {
  try {
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error('User message cannot be empty');
    }

    const provider = getProvider(apiKey);

    if (provider === 'groq') {
      const messages = [
        { role: 'system', content: AGRICULTURE_SYSTEM_PROMPT },
        ...conversationHistory.map((msg) => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      return callGroqChat(messages, apiKey);
    }

    const genAI = initializeGemini(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: AGRICULTURE_SYSTEM_PROMPT
    });

    const contents = conversationHistory.map((msg) => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const result = await model.generateContent({
      contents: contents
    });

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated from AI model');
    }

    return text;
  } catch (error) {
    console.error('Chatbot Service Error (with history):', error.message);
    throw error;
  }
};

/**
 * Extract agricultural data from user input
 * Useful for parsing soil data or crop information
 * @param {string} userMessage - User message to analyze
 * @returns {object} Extracted agricultural data
 */
export const extractAgriculturalData = (userMessage) => {
  const data = {
    cropMentioned: null,
    diseaseMentioned: false,
    soilDataPresent: false,
    location: null,
    season: null
  };

  const message = userMessage.toLowerCase();

  // Common crop keywords
  const crops = ['wheat', 'rice', 'maize', 'corn', 'tomato', 'onion', 'potato', 
                 'cotton', 'sugarcane', 'pulses', 'lentil', 'chickpea', 'soybean',
                 'groundnut', 'coconut', 'apple', 'mango', 'banana'];
  
  for (const crop of crops) {
    if (message.includes(crop)) {
      data.cropMentioned = crop;
      break;
    }
  }

  // Disease/pest keywords
  const diseaseKeywords = ['disease', 'pest', 'insect', 'blight', 'fungal', 'viral', 'yellowing'];
  data.diseaseMentioned = diseaseKeywords.some(keyword => message.includes(keyword));

  // Soil data indicators
  const soilKeywords = ['npk', 'soil', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'ph level'];
  data.soilDataPresent = soilKeywords.some(keyword => message.includes(keyword));

  // Season detection
  const seasons = { summer: 'Summer', monsoon: 'Monsoon', winter: 'Winter', rabi: 'Rabi', kharif: 'Kharif' };
  for (const [season, name] of Object.entries(seasons)) {
    if (message.includes(season)) {
      data.season = name;
      break;
    }
  }

  return data;
};

export default {
  generateChatbotResponse,
  generateChatbotResponseWithHistory,
  extractAgriculturalData,
  initializeGemini,
  AGRICULTURE_SYSTEM_PROMPT
};
