import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Leaf, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  ArrowLeft,
  Shield,
  Droplets,
  Sun
} from "lucide-react";

// Background image for the Plant Disease Detection page.
// Place your image at: src/assets/plant-hero.jpg
const heroImgUrl = new URL('../assets/plant-hero.jpg', import.meta.url).href;

interface PlantDiseaseDetectionProps {
  onBack: () => void;
}

export function PlantDiseaseDetection({ onBack }: PlantDiseaseDetectionProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis({
        disease: "Tomato Leaf Blight",
        confidence: 92,
        severity: "Moderate",
        treatment: {
          organic: "Neem oil spray, copper fungicide",
          chemical: "Chlorothalonil or Mancozeb",
          prevention: "Improve air circulation, avoid overhead watering"
        },
        expectedDamage: "15-25% yield loss if untreated"
      });
    }, 3000);
  };

  const sampleDiseases = [
    { name: "Tomato Leaf Blight", confidence: 92, severity: "Moderate", date: "Today" },
    { name: "Rice Blast", confidence: 87, severity: "High", date: "Yesterday" },
    { name: "Wheat Rust", confidence: 95, severity: "Low", date: "2 days ago" },
    { name: "Potato Late Blight", confidence: 89, severity: "High", date: "3 days ago" }
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat font-['Poppins',sans-serif]"
      style={{ backgroundImage: `url(${heroImgUrl})` }}
    >
      {/* overlay for readability */}
      <div className="min-h-screen" style={{ backgroundColor: 'rgba(0,0,0,0.28)' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg">
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
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Plant Disease Detection</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            AI-Powered Disease Detection
          </h2>
          <p className="text-xl text-gray-600">
            Upload a photo of your crop to get instant disease diagnosis and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Section */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Upload Plant Image</h3>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center bg-green-50">
                  <Upload className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-gray-800 mb-2">
                    Drop your image here or click to browse
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Choose File
                      </Button>
                    </label>
                    
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded plant" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-medium">Analyzing Image...</h4>
                      <Progress value={60} className="w-full" />
                      <p className="text-gray-600">AI models processing your image</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={analyzeImage}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3"
                    >
                      Analyze Again
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Analysis Results</h3>
              
              {!analysis ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    No Analysis Yet
                  </h4>
                  <p className="text-gray-500">
                    Upload an image to get started with disease detection
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Disease Info */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <h4 className="text-xl font-bold text-red-800">{analysis.disease}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={analysis.confidence} className="flex-1" />
                          <span className="font-bold text-red-700">{analysis.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Severity</p>
                        <span className="font-bold text-orange-700">{analysis.severity}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-red-700 bg-red-100 rounded-lg p-3">
                      {analysis.expectedDamage}
                    </p>
                  </div>

                  {/* Treatment Recommendations */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-lg">Treatment Options</h5>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Organic Treatment</span>
                      </div>
                      <p className="text-green-700">{analysis.treatment.organic}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Chemical Treatment</span>
                      </div>
                      <p className="text-blue-700">{analysis.treatment.chemical}</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Prevention</span>
                      </div>
                      <p className="text-yellow-700">{analysis.treatment.prevention}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detection History */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Recent Detections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleDiseases.map((disease, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      disease.severity === 'High' ? 'bg-red-100 text-red-700' :
                      disease.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {disease.severity}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {disease.date}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-800 mb-2">{disease.name}</h4>
                  
                  <div className="flex items-center gap-2">
                    <Progress value={disease.confidence} className="flex-1 h-2" />
                    <span className="text-xs font-medium text-gray-600">{disease.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  );
}