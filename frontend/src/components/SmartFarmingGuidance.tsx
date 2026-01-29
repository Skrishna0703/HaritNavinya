import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  User, 
  ArrowLeft,
  Book,
  Play,
  Search,
  Calendar,
  Lightbulb,
  Leaf,
  Droplets,
  Bug,
  TrendingUp,
  Clock,
  Star,
  Download,
  Bookmark
} from "lucide-react";

interface SmartFarmingGuidanceProps {
  onBack: () => void;
}

export function SmartFarmingGuidance({ onBack }: SmartFarmingGuidanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tips');

  const farmingTips = [
    {
      category: "Crop Management",
      title: "Optimal Spacing for Higher Yields",
      description: "Learn the science behind plant spacing and how proper arrangement can increase your harvest by 20-30%.",
      difficulty: "Beginner",
      readTime: "5 min",
      likes: 234,
      bookmarked: true,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwcm93cyUyMGZhcm1pbmd8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Spacing", "Yield", "Planning"]
    },
    {
      category: "Pest Control",
      title: "Natural Pest Control Methods",
      description: "Effective organic solutions to protect your crops without harmful chemicals. Eco-friendly approaches that work.",
      difficulty: "Intermediate",
      readTime: "8 min",
      likes: 187,
      bookmarked: false,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcGVzdCUyMGNvbnRyb2x8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Organic", "Pest Control", "Natural"]
    },
    {
      category: "Water Management",
      title: "Drip Irrigation Setup Guide",
      description: "Step-by-step installation of drip irrigation systems to save water and improve crop health efficiently.",
      difficulty: "Advanced",
      readTime: "12 min",
      likes: 156,
      bookmarked: true,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlwJTIwaXJyaWdhdGlvbnxlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Irrigation", "Water Saving", "Technology"]
    },
    {
      category: "Soil Health",
      title: "Composting for Better Soil",
      description: "Create nutrient-rich compost from farm waste. Turn your organic waste into black gold for healthier soil.",
      difficulty: "Beginner",
      readTime: "6 min",
      likes: 298,
      bookmarked: false,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0JTIwZmFybWluZ3xlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Composting", "Soil Health", "Organic"]
    },
    {
      category: "Harvesting",
      title: "Perfect Timing for Crop Harvest",
      description: "Identify the optimal harvest time for maximum quality and market value. Timing is everything in farming.",
      difficulty: "Intermediate",
      readTime: "7 min",
      likes: 189,
      bookmarked: true,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJ2ZXN0JTIwZmFybWluZ3xlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Harvesting", "Timing", "Quality"]
    },
    {
      category: "Technology",
      title: "Smartphone Apps for Modern Farming",
      description: "Essential mobile applications every farmer should have. Leverage technology for better farm management.",
      difficulty: "Beginner",
      readTime: "4 min",
      likes: 145,
      bookmarked: false,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Technology", "Apps", "Digital"]
    }
  ];

  const videoTutorials = [
    {
      title: "Complete Guide to Organic Farming",
      instructor: "Dr. Rajesh Sharma",
      duration: "45 min",
      views: "12.5K",
      rating: 4.8,
      level: "All Levels",
      thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWluZyUyMHZpZGVvfGVufDF8fHx8MTc1OTAyOTE0OXww&ixlib=rb-4.1.0&q=80&w=400",
      topics: ["Soil Preparation", "Seed Selection", "Pest Management", "Harvesting"]
    },
    {
      title: "Drip Irrigation Installation",
      instructor: "Eng. Priya Patel",
      duration: "25 min",
      views: "8.2K",
      rating: 4.6,
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlwJTIwaXJyaWdhdGlvbiUyMHZpZGVvfGVufDF8fHx8MTc1OTAyOTE0OXww&ixlib=rb-4.1.0&q=80&w=400",
      topics: ["System Design", "Installation", "Maintenance", "Troubleshooting"]
    },
    {
      title: "Crop Disease Identification",
      instructor: "Dr. Meera Singh",
      duration: "30 min",
      views: "15.1K",
      rating: 4.9,
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZGlzZWFzZSUyMGlkZW50aWZpY2F0aW9ufGVufDF8fHx8MTc1OTAyOTE0OXww&ixlib=rb-4.1.0&q=80&w=400",
      topics: ["Visual Symptoms", "Common Diseases", "Treatment Methods", "Prevention"]
    },
    {
      title: "Smart Fertilizer Application",
      instructor: "Agri. Amit Kumar",
      duration: "35 min",
      views: "6.8K",
      rating: 4.7,
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJ0aWxpemVyJTIwYXBwbGljYXRpb258ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=400",
      topics: ["Soil Testing", "Nutrient Calculation", "Application Timing", "Equipment Use"]
    }
  ];

  const seasonalGuide = [
    {
      season: "Kharif Season (Jun-Oct)",
      phase: "Preparation",
      period: "June",
      activities: [
        "Soil preparation and testing",
        "Seed treatment and selection",
        "Installation of irrigation systems",
        "Pre-monsoon fertilizer application"
      ],
      crops: ["Rice", "Cotton", "Sugarcane", "Maize"],
      status: "completed"
    },
    {
      season: "Kharif Season (Jun-Oct)",
      phase: "Sowing",
      period: "July",
      activities: [
        "Sowing based on monsoon arrival",
        "Transplanting of paddy seedlings",
        "First irrigation if needed",
        "Weed management planning"
      ],
      crops: ["Rice", "Cotton", "Sugarcane", "Maize"],
      status: "active"
    },
    {
      season: "Kharif Season (Jun-Oct)",
      phase: "Growth",
      period: "Aug-Sep",
      activities: [
        "Regular monitoring for pests",
        "Top dressing of fertilizers",
        "Disease management",
        "Water management during flowering"
      ],
      crops: ["Rice", "Cotton", "Sugarcane", "Maize"],
      status: "upcoming"
    },
    {
      season: "Kharif Season (Jun-Oct)",
      phase: "Harvest",
      period: "October",
      activities: [
        "Maturity assessment",
        "Harvesting at optimal time",
        "Post-harvest processing",
        "Storage preparation"
      ],
      crops: ["Rice", "Cotton", "Sugarcane", "Maize"],
      status: "upcoming"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 to-green-500 text-white shadow-lg">
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
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Smart Farming Guidance</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Learn Smart Farming Techniques
          </h2>
          <p className="text-xl text-gray-600">
            Expert knowledge, video tutorials, and seasonal guidance for modern agricultural practices
          </p>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-8">
          <CardContent className="p-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Ask about crop management, pest control, irrigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-2xl"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-green-600 text-white">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips">Knowledge Cards</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Guide</TabsTrigger>
          </TabsList>

          {/* Knowledge Cards Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmingTips.map((tip, index) => (
                <Card key={index} className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {tip.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Bookmark className={`w-4 h-4 ${tip.bookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tip.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDifficultyColor(tip.difficulty)}>
                        {tip.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {tip.readTime}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tip.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {tip.likes} likes
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-green-600 text-white">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Button size="lg" className="bg-white bg-opacity-90 text-gray-800 hover:bg-white rounded-full w-16 h-16">
                        <Play className="w-8 h-8" />
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black bg-opacity-70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getDifficultyColor(video.level)}>
                        {video.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{video.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">by {video.instructor}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.topics.slice(0, 3).map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {video.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{video.views} views</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-green-600 text-white">
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seasonal Guide Tab */}
          <TabsContent value="seasonal" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Farming Calendar - Current Season</h3>
                
                <div className="space-y-6">
                  {seasonalGuide.map((guide, index) => (
                    <div key={index} className="relative">
                      {/* Timeline connector */}
                      {index < seasonalGuide.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-24 bg-gray-200"></div>
                      )}
                      
                      <div className="flex gap-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          guide.status === 'completed' ? 'bg-green-500' :
                          guide.status === 'active' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}>
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-xl font-bold">{guide.phase}</h4>
                            <Badge className={getStatusColor(guide.status)}>
                              {guide.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{guide.period}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-bold text-sm text-gray-700 mb-2">Key Activities</h5>
                              <ul className="space-y-1">
                                {guide.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-bold text-sm text-gray-700 mb-2">Suitable Crops</h5>
                              <div className="flex flex-wrap gap-1">
                                {guide.crops.map((crop, cropIndex) => (
                                  <Badge key={cropIndex} className="bg-green-100 text-green-700">
                                    {crop}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Access Section */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-50 to-green-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Quick Access Resources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">Crop Library</h4>
                <p className="text-sm text-gray-600 mb-4">Complete guide for 50+ crops</p>
                <Button size="sm" variant="outline">Browse</Button>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">Irrigation Guide</h4>
                <p className="text-sm text-gray-600 mb-4">Water management techniques</p>
                <Button size="sm" variant="outline">Learn</Button>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">Pest Control</h4>
                <p className="text-sm text-gray-600 mb-4">Identification & treatment</p>
                <Button size="sm" variant="outline">Explore</Button>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">Market Trends</h4>
                <p className="text-sm text-gray-600 mb-4">Price analysis & forecasts</p>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}