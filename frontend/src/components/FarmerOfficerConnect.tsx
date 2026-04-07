import React from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Bell, Network, Mail } from "lucide-react";
import { motion } from "motion/react";

interface FarmerOfficerConnectProps {
  onBack: () => void;
}

export function FarmerOfficerConnect({ onBack }: FarmerOfficerConnectProps) {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
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
                <Network className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Farmer–Officer Connect</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-12 sm:p-16">
              {/* Animated Icon */}
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Network className="w-12 h-12 text-white" />
              </motion.div>

              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                🤝 Coming Soon!
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-2 font-semibold">
                Network - Government Liaison & Officer Connectivity
              </p>

              {/* Description */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
                <p className="text-lg text-gray-700 mb-4 font-medium">
                  Direct connection with agricultural government officers:
                </p>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Connect with District Agricultural Officers
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Book direct consultations with farming experts
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Access government schemes & subsidy programs
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Get support for agricultural documentation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Schedule video calls & in-person meetings
                  </li>
                </ul>
              </div>

              {/* Stay Tuned Message */}
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 mb-8"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Bell className="w-5 h-5" />
                  <p className="font-bold text-lg">Stay Tuned for Updates!</p>
                </div>
                <p className="text-sm text-blue-50">
                  📅 Connecting farmers with government officers coming soon
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">50+</p>
                  <p className="text-sm text-gray-600">Govt Officers</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">100+</p>
                  <p className="text-sm text-gray-600">Schemes</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
              </div>

              {/* Email Subscription */}
              <div className="mb-8 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Get early access when we launch:
                </label>
                <div className="flex gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribed}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <Button
                    onClick={handleSubscribe}
                    disabled={!email || subscribed}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {subscribed ? '✓ Subscribed' : 'Notify Me'}
                  </Button>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg rounded-lg hover:shadow-lg transition-all w-full"
              >
                Explore Other Features
              </Button>

              {/* Footer Note */}
              <p className="text-sm text-gray-500 mt-6">
                🚀 Launching with direct government integration • Check back soon!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}