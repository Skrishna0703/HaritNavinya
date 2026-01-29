import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { 
  Leaf, 
  Menu, 
  X, 
  ChevronDown,
  Home,
  Info,
  Grid3X3,
  Phone,
  User
} from "lucide-react";
import exampleImage from 'figma:asset/4e6c2c537f2dec2da15ac9b835ffc52668e45165.png';

interface NavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function Navbar({ currentPage = 'home', onPageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'about', label: 'About', icon: Info, href: '#about' },
    { id: 'features', label: 'Features', icon: Grid3X3, href: '#features' },
    { id: 'contact', label: 'Contact', icon: Phone, href: '#contact' },
  ];

  const handleNavClick = (id: string, href: string) => {
    if (onPageChange) {
      onPageChange(id);
    }
    setMobileMenuOpen(false);
    
    // Smooth scroll to section
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 navbar-animate transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 py-2' 
            : 'bg-transparent py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${
            scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
          }`}>
            {/* Logo Section */}
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-lg lg:text-xl font-bold transition-all duration-300 ${
                  scrolled ? 'text-gray-800' : 'text-white'
                } drop-shadow-sm`}>
                  HaritNavinya
                </h1>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  scrolled ? 'text-green-600' : 'text-green-200'
                }`}>
                  Smart Agriculture System
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.href)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 group nav-item-hover ${
                      isActive
                        ? scrolled
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                          : 'bg-white/20 text-white backdrop-blur-sm shadow-lg'
                        : scrolled
                          ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="relative">
                      {item.label}
                      {isActive && (
                        <div className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ${
                          scrolled ? 'bg-white' : 'bg-green-200'
                        }`}></div>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className={`font-medium transition-all duration-300 hover:scale-105 border-2 ${
                  scrolled
                    ? 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                    : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                size="sm"
                className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Get Started</span>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden transition-colors ${
                scrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-700 shadow-sm'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" id="navbar-spacer"></div>
    </>
  );
}