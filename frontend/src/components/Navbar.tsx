import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, Globe, Heart } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ onLoginClick, isLoggedIn, onLogout }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', path: '#home' },
    { key: 'hospitals', path: '#hospitals' },
    { key: 'labScanner', path: '#lab' },
    { key: 'riskCalculator', path: '#risk' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SwasthSathi</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login/Logout */}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="hidden sm:flex px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('nav.login')}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
