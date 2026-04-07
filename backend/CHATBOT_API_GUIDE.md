# Agriculture Chatbot API - Setup & Usage Guide

## Overview

A production-ready Node.js/Express backend API that integrates Google Gemini AI to provide intelligent farming assistance for Indian farmers. The chatbot specializes in crop recommendations, pest/disease solutions, fertilizer guidance, and soil management.

## Features

✅ **AI-Powered Responses** - Uses Google Gemini Pro model with agriculture-specific prompt  
✅ **Multi-turn Conversations** - Supports conversation history for better context  
✅ **Error Handling** - Comprehensive error handling and validation  
✅ **CORS Enabled** - Configured for frontend integration  
✅ **Production-Ready** - Clean code with comments and ES modules  
✅ **Health Checks** - Built-in endpoint monitoring  
✅ **Rate Limiting Support** - Graceful handling of API limits  

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Google Gemini API Key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@google/generative-ai` - Google Gemini API client
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment variable management
- Other existing dependencies

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
CHATBOT_PORT=5001
NODE_ENV=development
```

**Get your API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste in `.env`

## Running the Server

### Start Chatbot Server (Production)
```bash
npm run chatbot
```

### Start Chatbot Server (Development with auto-reload)
```bash
npm run chatbot:dev
```

Server will start at `http://localhost:5001`

## API Endpoints

### 1. POST `/api/chatbot/chat`

Send a message to the agriculture chatbot.

**Request:**
```json
{
  "message": "What fertilizer should I use for wheat?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "reply": "🌱 Crop Advice:\n\n* Soil: Well-drained loamy soil...",
  "context": {
    "cropMentioned": "wheat",
    "diseaseMentioned": false,
    "soilDataPresent": false,
    "location": null,
    "season": null
  },
  "timestamp": "2024-04-05T10:30:45.123Z"
}
```

**Query Parameters:**
- `message` (required) - User's farming question
- `conversationHistory` (optional) - Array of previous messages for context

### 2. GET `/api/chatbot/health`

Check if the chatbot API is running.

**Response:**
```json
{
  "success": true,
  "message": "Agriculture Chatbot API is running",
  "service": "gemini-agriculture-chatbot",
  "timestamp": "2024-04-05T10:30:45.123Z"
}
```

### 3. GET `/api/chatbot/info`

Get chatbot information and capabilities.

**Response:**
```json
{
  "success": true,
  "chatbot": {
    "name": "Agriculture AI Assistant",
    "version": "1.0.0",
    "description": "Expert agriculture assistant for Indian farmers",
    "capabilities": [
      "Crop recommendations",
      "Pest and disease identification",
      "Fertilizer recommendations",
      "Soil analysis",
      "Weather-based farming guidance",
      "Irrigation planning",
      "Seasonal crop planning",
      "Market price insights"
    ],
    "supportedLanguages": ["English", "Hindi"],
    "model": "gemini-pro",
    "endpoints": {...}
  }
}
```

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:5001/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have tomato plants with yellow spots. How do I treat them?"
  }'
```

### Using JavaScript/Frontend

```javascript
async function askChatbot(message) {
  const response = await fetch('http://localhost:5001/api/chatbot/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      conversationHistory: [] // Add previous messages here for context
    })
  });

  const data = await response.json();
  return data.reply;
}

// Usage
const response = await askChatbot('What should I plant in monsoon season?');
console.log(response);
```

### Using Python

```python
import requests
import json

url = "http://localhost:5001/api/chatbot/chat"
payload = {
    "message": "How can I improve soil fertility?",
    "conversationHistory": []
}

response = requests.post(url, json=payload)
data = response.json()
print(data['reply'])
```

## Frontend Integration (React/TypeScript)

Update your `AIChatbot.tsx` to use the real backend:

```typescript
// Replace getBotResponse with actual API call
const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputValue,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    const response = await fetch('http://localhost:5001/api/chatbot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: inputValue,
        conversationHistory: messages
      })
    });

    const data = await response.json();
    
    if (data.success) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }
  } catch (error) {
    console.error('Chat error:', error);
  } finally {
    setIsTyping(false);
  }
};
```

## File Structure

```
backend/
├── src/
│   ├── chatbot-server.js           # Main chatbot server
│   ├── controllers/
│   │   └── chatbotController.js    # Request handlers
│   ├── routes/
│   │   └── chatbotRoutes.js        # API route definitions
│   └── services/
│       └── chatbotService.js       # Gemini API integration
├── package.json
├── .env                             # Environment variables (create this)
└── .env.example                     # Environment template
```

## Authentication (Optional)

To add API key authentication to your endpoints:

```javascript
// In chatbotRoutes.js
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.post('/chat', authMiddleware, chatWithAI);
```

## Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing message) |
| 429 | Rate limit exceeded |
| 500 | Server error |

**Example Error Response:**
```json
{
  "success": false,
  "error": "Message field is required in request body"
}
```

## Performance Tips

1. **Conversation History** - Keep history <= 10 messages for optimal performance
2. **Message Length** - Max 10,000 characters per message
3. **Rate Limiting** - Implement request throttling in production
4. **Caching** - Cache common farming queries to reduce API calls

## Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution:** Ensure `.env` file exists with valid API key

### Issue: CORS errors
**Solution:** Check frontend URL is in `corsOptions` in `chatbot-server.js`

### Issue: 429 Rate Limit
**Solution:** Wait before sending next request or implement exponential backoff

### Issue: Empty responses
**Solution:** Check Gemini API key validity and account status

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| GEMINI_API_KEY | Yes | - | Google Gemini API key |
| CHATBOT_PORT | No | 5001 | Server port |
| NODE_ENV | No | development | Environment mode |

## Security Considerations

1. **Never commit `.env`** - Add to `.gitignore`
2. **Use HTTPS in production** - Implement SSL/TLS
3. **Rate limiting** - Implement per-IP limits
4. **Input validation** - Already implemented for message length
5. **API key rotation** - Regenerate keys periodically

## Scaling Considerations

For production deployment:
1. Use environment-specific configs
2. Implement Redis caching
3. Add request queuing for high traffic
4. Monitor API usage and costs
5. Set up error logging and monitoring

## Support & Documentation

- [Google Gemini API Docs](https://ai.google.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [CORS Documentation](https://expressjs.com/en/resources/middleware/cors.html)

## License

This agricultural chatbot API is part of the HaritNavinya project.

---

**Last Updated:** April 2024  
**Version:** 1.0.0
