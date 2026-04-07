import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Bot, 
  ArrowLeft,
  Send,
  Mic,
  User,
  Leaf,
  Droplets,
  Bug,
  TrendingUp,
  MapPin,
  MessageCircle,
  Sparkles
} from "lucide-react";

interface AIChatbotProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function AIChatbot({ onBack }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! 👋 I'm your AI farming assistant. I can help you with crop diseases, fertilizer recommendations, weather advice, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { 
      icon: Bug, 
      text: "Identify Plant Disease", 
      query: "How can I identify and treat plant diseases in my crops?",
      color: "from-red-400 to-pink-500"
    },
    { 
      icon: Droplets, 
      text: "Fertilizer Advice", 
      query: "What fertilizer should I use for better crop yield?",
      color: "from-blue-400 to-cyan-500"
    },
    { 
      icon: Leaf, 
      text: "Crop Recommendation", 
      query: "Which crops are best for my soil and climate?",
      color: "from-green-400 to-emerald-500"
    },
    { 
      icon: TrendingUp, 
      text: "Market Prices", 
      query: "What are the current market prices for my crops?",
      color: "from-purple-400 to-indigo-500"
    }
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('disease') || lowerMessage.includes('pest')) {
      return "🔍 For plant diseases, I recommend: \n\n1. **Upload a photo** using our Disease Detection feature\n2. **Common signs**: Yellow/brown spots, wilting, unusual growth\n3. **Prevention**: Proper spacing, good drainage, crop rotation\n4. **Treatment**: Use organic neem oil or copper-based fungicides\n\nWould you like me to guide you through the photo upload process?";
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return "🌱 Here's my fertilizer recommendation:\n\n**For most crops:**\n• **NPK 10-26-26** for flowering stage\n• **Organic compost** - 2-3 tons per acre\n• **Micronutrients** - Zinc, Iron, Boron\n\n**Application timing:**\n• Base dose: Before sowing\n• Top dressing: 30-45 days after sowing\n\nWhat specific crop are you growing? I can give more targeted advice!";
    } else if (lowerMessage.includes('crop') || lowerMessage.includes('recommend')) {
      return "🌾 Based on current conditions, I suggest:\n\n**High-profit crops:**\n• **Tomatoes** - ₹4,500/quintal (trending up 12%)\n• **Onions** - Good storage value\n• **Wheat** - Stable demand\n\n**Consider these factors:**\n• Your soil type and pH\n• Available water resources\n• Market accessibility\n\nCan you tell me your location and soil type for personalized recommendations?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return "📈 **Today's Market Update:**\n\n• **Wheat**: ₹2,150/quintal (+2.3%)\n• **Rice**: ₹2,890/quintal (+0.8%)\n• **Tomato**: ₹4,500/quintal (+12.3%) 🔥\n• **Potato**: ₹1,200/quintal (+5.1%)\n\n**AI Insight**: Tomato prices are surging! Great time to sell if you have stock. Need help finding nearby buyers?";
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return "🌤️ **Weather Advisory:**\n\n**Next 7 days:**\n• Light rain expected in 2-3 days\n• Temperature: 25-32°C\n• Humidity: 65-75%\n\n**Farming tips:**\n• Postpone spraying before rain\n• Ensure proper drainage\n• Good time for transplanting\n\nWant me to set up weather alerts for your area?";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! 😊 I'm here to help with all your farming questions. You can ask me about:\n\n• Plant disease diagnosis\n• Fertilizer recommendations\n• Crop selection advice\n• Market prices and trends\n• Weather updates\n• Soil health tips\n\nWhat would you like to know?";
    } else {
      return "I understand you're asking about farming. While I have knowledge about crops, diseases, fertilizers, and market trends, could you be more specific? \n\nFor example:\n• \"How to treat tomato blight?\"\n• \"Best fertilizer for wheat?\"\n• \"Current onion prices?\"\n\nI'm here to help! 🌱";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call the real backend API
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.reply,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Fallback to mock response if API fails
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: getBotResponse(messageToSend),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to mock response on network error
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(messageToSend),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Farm Assistant</h1>
                <p className="text-indigo-100 text-sm">Always here to help</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        onClick={() => handleQuickAction(action.query)}
                        className="w-full justify-start h-auto p-4 hover:bg-gray-50"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-white"
                          style={{ background: `linear-gradient(135deg, ${action.color.replace('from-', '').replace(' to-', ', ')})` }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-left text-sm">{action.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">AI Capabilities</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Plant Disease Diagnosis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Fertilizer Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Market Price Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Weather Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Crop Planning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto max-h-96 lg:max-h-[500px]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {message.type === 'bot' && (
                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {message.type === 'user' && (
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t bg-gray-50 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-4 py-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about farming..."
                      className="border-0 bg-transparent focus:outline-none flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    AI assistant trained on agricultural data • Responses may vary
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}