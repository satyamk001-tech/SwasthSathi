import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.hospitals': 'Hospitals',
    'nav.labScanner': 'Lab Scanner',
    'nav.riskCalculator': 'Risk Calculator',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Home Page
    'home.hero.title': 'Talk to SwasthSathi',
    'home.hero.subtitle': 'Your AI Health Assistant',
    'home.hero.description': 'Get instant health guidance, symptom analysis, and personalized recommendations in English or Hindi.',
    'home.chat.placeholder': 'Ask SwasthSathi about your health...',
    'home.chat.send': 'Send',
    'home.features.title': 'Our Services',
    'home.features.chatbot': 'AI Health Chat',
    'home.features.chatbot.desc': 'Get 24/7 health guidance powered by AI',
    'home.features.hospitals': 'Find Hospitals',
    'home.features.hospitals.desc': 'Locate nearby hospitals with detailed info',
    'home.features.lab': 'Lab Scanner',
    'home.features.lab.desc': 'AI-powered lab report analysis',
    'home.features.risk': 'Risk Calculator',
    'home.features.risk.desc': 'Assess your health risks',
    
    // Hospitals
    'hospitals.title': 'Delhi Hospitals',
    'hospitals.search': 'Search hospitals...',
    'hospitals.rating': 'Rating',
    'hospitals.distance': 'km away',
    'hospitals.cashless': 'Cashless',
    'hospitals.emergency': 'Emergency',
    'hospitals.viewMap': 'View on Map',
    'hospitals.call': 'Call',
    
    // Lab Scanner
    'lab.title': 'Lab Report Scanner',
    'lab.upload': 'Upload Lab Report',
    'lab.dropzone': 'Drag & drop your lab report here or click to browse',
    'lab.analyzing': 'Analyzing your report...',
    'lab.results': 'Analysis Results',
    'lab.download': 'Download Report',
    'lab.scanAgain': 'Scan Another',
    
    // Risk Calculator
    'risk.title': 'Health Risk Calculator',
    'risk.subtitle': 'Assess your health risks',
    'risk.age': 'Age',
    'risk.bmi': 'BMI',
    'risk.bloodPressure': 'Blood Pressure',
    'risk.diabetes': 'Diabetes',
    'risk.smoking': 'Smoking',
    'risk.familyHistory': 'Family History',
    'risk.calculate': 'Calculate Risk',
    'risk.yourRisk': 'Your Risk Score',
    'risk.low': 'Low Risk',
    'risk.moderate': 'Moderate Risk',
    'risk.high': 'High Risk',
    'risk.recommendations': 'Recommendations',
    'risk.yes': 'Yes',
    'risk.no': 'No',
    
    // Login
    'login.title': 'ABHA Login',
    'login.subtitle': 'Enter your mobile number',
    'login.mobile': 'Mobile Number',
    'login.getOtp': 'Get OTP',
    'login.otp': 'Enter OTP',
    'login.verify': 'Verify & Login',
    'login.resend': 'Resend OTP',
    'login.skip': 'Skip for now',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.hospitals': 'अस्पताल',
    'nav.labScanner': 'लैब स्कैनर',
    'nav.riskCalculator': 'जोखिम कैलकुलेटर',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Home Page
    'home.hero.title': 'स्वास्थसाथी से बात करें',
    'home.hero.subtitle': 'आपका AI स्वास्थ सहायक',
    'home.hero.description': 'अंग्रेज़ी या हिंदी में तुरंत स्वास्थ मार्गदर्शन, लक्षण विश्लेषण और व्यक्तिगत सिफारिशें प्राप्त करें।',
    'home.chat.placeholder': 'स्वास्थसाथी से अपने स्वास्थ के बारे में पूछें...',
    'home.chat.send': 'भेजें',
    'home.features.title': 'हमारी सेवाएं',
    'home.features.chatbot': 'AI स्वास्थ चैट',
    'home.features.chatbot.desc': 'AI से संचालित 24/7 स्वास्थ मार्गदर्शन प्राप्त करें',
    'home.features.hospitals': 'अस्पताल खोजें',
    'home.features.hospitals.desc': 'विस्तृत जानकारी के साथ पास के अस्पतालों का पता लगाएं',
    'home.features.lab': 'लैब स्कैनर',
    'home.features.lab.desc': 'AI-संचालित लैब रिपोर्ट विश्लेषण',
    'home.features.risk': 'जोखिम कैलकुलेटर',
    'home.features.risk.desc': 'अपने स्वास्थ जोखिमों का आकलन करें',
    
    // Hospitals
    'hospitals.title': 'दिल्ली अस्पताल',
    'hospitals.search': 'अस्पताल खोजें...',
    'hospitals.rating': 'रेटिंग',
    'hospitals.distance': 'किमी दूर',
    'hospitals.cashless': 'कैशलेस',
    'hospitals.emergency': 'आपातकालीन',
    'hospitals.viewMap': 'मानचित्र पर देखें',
    'hospitals.call': 'कॉल करें',
    
    // Lab Scanner
    'lab.title': 'लैब रिपोर्ट स्कैनर',
    'lab.upload': 'लैब रिपोर्ट अपलोड करें',
    'lab.dropzone': 'अपनी लैब रिपोर्ट यहां खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    'lab.analyzing': 'आपकी रिपोर्ट का विश्लेषण हो रहा है...',
    'lab.results': 'विश्लेषण परिणाम',
    'lab.download': 'रिपोर्ट डाउनलोड करें',
    'lab.scanAgain': 'दूसरा स्कैन करें',
    
    // Risk Calculator
    'risk.title': 'स्वास्थ जोखिम कैलकुलेटर',
    'risk.subtitle': 'अपने स्वास्थ जोखिमों का आकलन करें',
    'risk.age': 'आयु',
    'risk.bmi': 'BMI',
    'risk.bloodPressure': 'रक्तचाप',
    'risk.diabetes': 'मधुमेह',
    'risk.smoking': 'धूम्रपान',
    'risk.familyHistory': 'पारिवारिक इतिहास',
    'risk.calculate': 'जोखिम की गणना करें',
    'risk.yourRisk': 'आपका जोखिम स्कोर',
    'risk.low': 'कम जोखिम',
    'risk.moderate': 'मध्यम जोखिम',
    'risk.high': 'उच्च जोखिम',
    'risk.recommendations': 'सिफारिशें',
    'risk.yes': 'हां',
    'risk.no': 'नहीं',
    
    // Login
    'login.title': 'ABHA लॉगिन',
    'login.subtitle': 'अपना मोबाइल नंबर दर्ज करें',
    'login.mobile': 'मोबाइल नंबर',
    'login.getOtp': 'OTP प्राप्त करें',
    'login.otp': 'OTP दर्ज करें',
    'login.verify': 'सत्यापित करें और लॉगिन करें',
    'login.resend': 'OTP पुनः भेजें',
    'login.skip': 'अभी के लिए छोड़ें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.retry': 'पुनः प्रयास करें',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
