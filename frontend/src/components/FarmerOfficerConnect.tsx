import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { 
  Link, 
  ArrowLeft,
  User,
  Phone,
  MessageCircle,
  Video,
  Calendar as CalendarIcon,
  Mail,
  MapPin,
  Clock,
  Star,
  Award,
  FileText,
  HelpCircle,
  CheckCircle
} from "lucide-react";

interface FarmerOfficerConnectProps {
  onBack: () => void;
}

export function FarmerOfficerConnect({ onBack }: FarmerOfficerConnectProps) {
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date());
  const [showBooking, setShowBooking] = useState(false);

  const officers = [
    {
      id: "1",
      name: "Dr. Rajesh Kumar Sharma",
      designation: "District Agricultural Officer",
      department: "Department of Agriculture, Pune",
      specialization: ["Crop Management", "Pest Control", "Organic Farming"],
      experience: "15 years",
      rating: 4.9,
      availability: "Available",
      contact: "+91 98765 43210",
      email: "rajesh.sharma@maharashtra.gov.in",
      languages: ["Hindi", "Marathi", "English"],
      location: "Pune District Office",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhZ3JpY3VsdHVyZSUyMG9mZmljZXJ8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=300",
      achievements: ["Best Officer Award 2023", "Organic Farming Expert"],
      nextAvailable: "Today 2:00 PM"
    },
    {
      id: "2",
      name: "Priya Patel",
      designation: "Horticulture Development Officer",
      department: "Horticulture Department",
      specialization: ["Fruit Cultivation", "Vegetable Farming", "Greenhouse Technology"],
      experience: "12 years",
      rating: 4.7,
      availability: "Busy",
      contact: "+91 87654 32109",
      email: "priya.patel@horticulture.gov.in",
      languages: ["Gujarati", "Hindi", "English"],
      location: "Regional Horticulture Office",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBhZ3JpY3VsdHVyZSUyMG9mZmljZXJ8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=300",
      achievements: ["Greenhouse Innovation Award", "Women in Agriculture Leader"],
      nextAvailable: "Tomorrow 10:00 AM"
    },
    {
      id: "3",
      name: "Suresh Patil",
      designation: "Soil Conservation Officer",
      department: "Soil & Water Conservation Dept",
      specialization: ["Soil Health", "Water Management", "Sustainable Farming"],
      experience: "18 years",
      rating: 4.8,
      availability: "Available",
      contact: "+91 76543 21098",
      email: "suresh.patil@soilconservation.gov.in",
      languages: ["Marathi", "Hindi"],
      location: "Soil Conservation Office",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwb2ZmaWNlcnxlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=300",
      achievements: ["Water Conservation Champion", "Sustainable Farming Advocate"],
      nextAvailable: "Today 4:00 PM"
    },
    {
      id: "4",
      name: "Dr. Meera Singh",
      designation: "Plant Pathologist",
      department: "Agricultural Research Institute",
      specialization: ["Disease Management", "Plant Protection", "Research & Development"],
      experience: "10 years",
      rating: 4.6,
      availability: "Available",
      contact: "+91 65432 10987",
      email: "meera.singh@agriresearch.gov.in",
      languages: ["Hindi", "English", "Punjabi"],
      location: "Agricultural Research Center",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzY2llbnRpc3R8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=300",
      achievements: ["Research Excellence Award", "Disease Control Expert"],
      nextAvailable: "Tomorrow 11:30 AM"
    },
    {
      id: "5",
      name: "Vikram Reddy",
      designation: "Extension Officer",
      department: "Krishi Vigyan Kendra",
      specialization: ["Technology Transfer", "Farmer Training", "Demonstration Plots"],
      experience: "8 years",
      rating: 4.5,
      availability: "Available",
      contact: "+91 54321 09876",
      email: "vikram.reddy@kvk.gov.in",
      languages: ["Telugu", "Hindi", "English"],
      location: "KVK Training Center",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhZ3JpY3VsdHVyZSUyMG9mZmljZXJ8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=300",
      achievements: ["Best Extension Worker", "Farmer Education Champion"],
      nextAvailable: "Today 3:30 PM"
    }
  ];

  const faqs = [
    {
      question: "How do I apply for government farming subsidies?",
      answer: "Contact your District Agricultural Officer for subsidy applications. Required documents include land records, Aadhaar card, and bank details.",
      officer: "Dr. Rajesh Kumar Sharma"
    },
    {
      question: "What are the best practices for organic certification?",
      answer: "Follow organic farming guidelines for 3 years, maintain proper records, and get inspection from certified agencies.",
      officer: "Dr. Rajesh Kumar Sharma"
    },
    {
      question: "How to control pest attacks in vegetable crops?",
      answer: "Use IPM approach: biological control, trap crops, organic pesticides, and regular monitoring for early detection.",
      officer: "Dr. Meera Singh"
    },
    {
      question: "What is the process for soil testing?",
      answer: "Visit nearest soil testing center, submit samples with proper documentation, get report within 7 days.",
      officer: "Suresh Patil"
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Busy': return 'bg-yellow-100 text-yellow-700';
      case 'Unavailable': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleBookAppointment = (officerId: string) => {
    setSelectedOfficer(officerId);
    setShowBooking(true);
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
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
                <Link className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Farmer–Officer Connect</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Connect with Agricultural Experts
          </h2>
          <p className="text-xl text-gray-600">
            Get expert guidance from government agricultural officers and specialists
          </p>
        </div>

        {showBooking ? (
          /* Booking Form */
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowBooking(false)}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Officers
                </Button>
              </div>

              <h3 className="text-2xl font-bold mb-6">Book Appointment</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Number</label>
                    <Input placeholder="Enter your phone number" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Village/Location</label>
                    <Input placeholder="Enter your village or location" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Morning (9:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 6:00 PM)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Purpose of Meeting</label>
                    <Textarea 
                      placeholder="Describe your farming issue or query..."
                      className="min-h-24"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-6 space-y-4">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      Confirm Appointment
                    </Button>
                    <Button variant="outline" className="w-full">
                      Request Phone Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Officer Profiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {officers.map((officer) => (
                <Card key={officer.id} className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img 
                          src={officer.image} 
                          alt={officer.name}
                          className="w-24 h-24 rounded-2xl object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{officer.name}</h3>
                            <p className="text-blue-600 font-medium">{officer.designation}</p>
                            <p className="text-sm text-gray-600">{officer.department}</p>
                          </div>
                          <Badge className={getAvailabilityColor(officer.availability)}>
                            {officer.availability}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{officer.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">{officer.experience}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-bold text-sm mb-2">Specialization</h5>
                          <div className="flex flex-wrap gap-1">
                            {officer.specialization.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Languages:</p>
                            <p className="font-medium">{officer.languages.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Next Available:</p>
                            <p className="font-medium text-green-600">{officer.nextAvailable}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBookAppointment(officer.id)}
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            Book
                          </Button>
                        </div>
                      </div>
                    </div>

                    {officer.achievements.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h5 className="font-bold text-sm mb-2">Achievements</h5>
                        <div className="flex flex-wrap gap-1">
                          {officer.achievements.map((achievement, index) => (
                            <Badge key={index} className="bg-yellow-100 text-yellow-700 text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-500" />
                  Frequently Asked Questions
                </h3>
                
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                      <h4 className="font-bold text-lg mb-3">{faq.question}</h4>
                      <p className="text-gray-600 mb-4">{faq.answer}</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Answered by {faq.officer}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    View All FAQs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Emergency Helpline</h4>
                  <p className="text-gray-600 mb-4">24/7 support for urgent farming issues</p>
                  <Button variant="outline" className="border-green-300 text-green-700">
                    1800-180-1551
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Document Support</h4>
                  <p className="text-gray-600 mb-4">Help with government forms and applications</p>
                  <Button variant="outline" className="border-blue-300 text-blue-700">
                    Get Help
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Virtual Meetings</h4>
                  <p className="text-gray-600 mb-4">Schedule video consultations with experts</p>
                  <Button variant="outline" className="border-purple-300 text-purple-700">
                    Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}