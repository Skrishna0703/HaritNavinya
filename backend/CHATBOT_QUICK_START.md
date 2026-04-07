# 🌱 Agriculture Chatbot API - QUICK START

## 60 Second Setup

### Step 1: Get Gemini API Key (Free)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and save it

### Step 2: Create .env File
Create `backend/.env` file:
```env
GEMINI_API_KEY=your_key_here
CHATBOT_PORT=5001
NODE_ENV=development
```

### Step 3: Start Chatbot Server
```bash
cd backend
npm run chatbot:dev
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║   Agriculture Chatbot API - Google Gemini Powered      ║
╠════════════════════════════════════════════════════════╣
║  🌱 Server running at: http://localhost:5001
```

### Step 4: Test the API
```bash
# In another terminal
node backend/test-chatbot.js
```

## 🚀 Usage Examples

### Send a Chat Message
```bash
curl -X POST http://localhost:5001/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What fertilizer for tomato plants?"
  }'
```

### Check Health
```bash
curl http://localhost:5001/api/chatbot/health
```

### Get Chatbot Info
```bash
curl http://localhost:5001/api/chatbot/info
```

## 📂 File Structure

```
backend/
├── src/
│   ├── chatbot-server.js              ← Main server
│   ├── controllers/chatbotController.js
│   ├── routes/chatbotRoutes.js
│   └── services/chatbotService.js
├── package.json
├── .env                               ← Create this!
├── .env.example                       ← Reference
├── CHATBOT_API_GUIDE.md              ← Full docs
└── test-chatbot.js                   ← Test script
```

## 🔧 Integration in Frontend

Update your React component:

```typescript
// In AIChatbot.tsx handleSendMessage()
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
  // Add bot response to messages
  const botMessage: Message = {
    id: Date.now().toString(),
    type: 'bot',
    content: data.reply,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, botMessage]);
}
```

## ⚙️ Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| GEMINI_API_KEY | Yes | `abc123...xyz` |
| CHATBOT_PORT | No | `5001` |
| NODE_ENV | No | `development` |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Server won't start | Check if port 5001 is in use |
| 500 error with API key message | Create .env and add GEMINI_API_KEY |
| CORS errors | Frontend URL may not be in corsOptions |
| Slow responses | First request may take longer (API warm-up) |

## 📚 Full Documentation

See `CHATBOT_API_GUIDE.md` for:
- Detailed endpoint documentation
- All error codes
- Performance optimization
- Scaling considerations
- Security best practices

## 🎯 Next Steps

1. ✅ Set up .env file with API key
2. ✅ Start chatbot server
3. ✅ Run test script
4. ✅ Integrate with frontend
5. ✅ Deploy to production

---

**Ready to go?** Start with: `npm run chatbot:dev`

For help: See `CHATBOT_API_GUIDE.md`
