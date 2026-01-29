import React, { useState } from 'react';
import { Leaf, Home, Info, Grid3X3, Phone, Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// Agriculture leaf icon component for branding
const AgricultureIcon = ({ className }: { className?: string }) => (
  <Leaf className={className} />
);

interface ModernNavbarProps {
  className?: string;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function ModernNavbar({ className = "", currentPage = 'home', onPageChange }: ModernNavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'hi' as const, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr' as const, name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta' as const, name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te' as const, name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn' as const, name: 'বাংলা', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const navLinks = [
    { id: 'home', label: t('home'), href: '#home' },
    { id: 'about', label: t('about'), href: '#about' },
    { id: 'features', label: t('features'), href: '#features' },
    { id: 'contact', label: t('contact'), href: '#contact' }
  ];

  const handleNavClick = (id: string, href: string) => {
    if (onPageChange) {
      onPageChange(id);
    }
    
    // Smooth scroll to section
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`fixed top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 sm:px-0 ${className}`}
    >
      {/* Compact pill-shaped container */}
      <div 
        className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg w-full max-w-[92vw] sm:min-w-[480px] sm:w-auto backdrop-blur-xl border border-green-200/20"
        style={{ 
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.92), rgba(34, 197, 94, 0.88))',
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.25), 0 1px 4px rgba(34, 197, 94, 0.1)'
        }}
      >
        {/* Left: Compact Logo Button */}
        <button 
          className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-white/95 rounded-full hover:scale-110 transition-transform duration-200 hover:shadow-sm flex-shrink-0"
          aria-label="HaritNavinya Home"
          onClick={() => handleNavClick('home', '#home')}
        >
          <AgricultureIcon className="text-green-600 w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* Center: Compact Navigation Links */}
        <div className="flex items-center space-x-2 sm:space-x-5 mx-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id, link.href)}
              className={`font-medium text-xs transition-colors duration-200 relative group whitespace-nowrap px-1 sm:px-2 py-1 rounded-md ${
                currentPage === link.id 
                  ? 'text-white font-semibold bg-white/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {link.label}
              <span className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/70 rounded-full transition-all duration-300 ${
                currentPage === link.id ? 'w-4' : 'w-0 group-hover:w-3'
              }`}></span>
            </button>
          ))}
        </div>

        {/* Language Selector */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/90 text-green-700 rounded-full font-medium text-xs hover:bg-white hover:shadow-sm transition-all duration-200"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <Languages className="w-3 h-3" />
            <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showLangDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowLangDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden z-50 min-w-[140px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-50 transition-colors ${
                      language === lang.code ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Compact Contact Button */}
        <button 
          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 text-green-700 rounded-full font-medium text-xs hover:bg-white hover:shadow-sm transition-all duration-200 flex-shrink-0"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          onClick={() => handleNavClick('contact', '#contact')}
        >
          <span className="hidden sm:inline">{t('support')}</span>
          <span className="sm:hidden">Help</span>
        </button>
      </div>
    </nav>
  );
}