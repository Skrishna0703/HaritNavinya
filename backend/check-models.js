import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function checkAvailableModels() {
  try {
    console.log('🔍 Checking available Gemini models...\n');
    
    // Try to list models
    const modelNames = [
      'models/gemini-pro',
      'models/gemini-pro-vision',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-2.0-flash',
      'models/gemini-exp-1114'
    ];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`✓ ${modelName} - Available`);
      } catch (error) {
        console.log(`✗ ${modelName} - Not available`);
      }
    }

    // Try to get model info
    console.log('\n🧪 Testing simple message with available models...\n');
    
    const testModels = ['gemini-pro', 'gemini-pro-vision', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    
    for (const modelName of testModels) {
      try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`✓ ${modelName} works!\n`);
        break;
      } catch (error) {
        console.log(`✗ ${modelName} failed: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('Error checking models:', error.message);
  }
}

checkAvailableModels();
