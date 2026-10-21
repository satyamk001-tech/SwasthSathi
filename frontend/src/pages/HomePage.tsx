import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Send, Bot, User, Sparkles, ArrowRight, Stethoscope, Building2, Scan, Activity } from 'lucide-react';
import { delhiHospitals } from '../data/hospitals';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am SwasthSathi, your AI Health Assistant. How can I help you today? You can ask me about symptoms, health tips, or any medical concerns.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('fever') || lowerQuery.includes('बुखार')) {
      return 'For fever, I recommend:\n\n1. Rest and stay hydrated\n2. Take paracetamol if temperature exceeds 101°F\n3. Keep a cool cloth on your forehead\n4. Consult a doctor if fever persists more than 3 days\n\nHowever, please consult a healthcare professional for proper diagnosis.';
    }
    
    if (lowerQuery.includes('headache') || lowerQuery.includes('सिरदर्द')) {
      return 'For headache, you can try:\n\n1. Rest in a quiet, dark room\n2. Take a mild pain reliever\n3. Stay hydrated\n4. Practice deep breathing\n\nIf headaches are frequent or severe, please consult a doctor.';
    }
    
    if (lowerQuery.includes('hospital') || lowerQuery.includes('अस्पताल') || lowerQuery.includes('clinic')) {
      const hospitalCount = delhiHospitals.length;
      return `I can help you find hospitals in Delhi. There are ${hospitalCount} hospitals in our database including AIIMS, Safdarjung, Fortis, and Apollo. Scroll to the Hospitals section to see all options with ratings and distances.`;
    }
    
    if (lowerQuery.includes('diabetes') || lowerQuery.includes('मधुमेह') || lowerQuery.includes('sugar')) {
      return 'For diabetes management:\n\n1. Monitor blood sugar regularly\n2. Follow a balanced diet with low glycemic index foods\n3. Exercise regularly (30 mins daily)\n4. Take prescribed medications as directed\n\nRegular check-ups with your doctor are essential. Would you like me to help you calculate your diabetes risk?';
    }
    
    if (lowerQuery.includes('blood pressure') || lowerQuery.includes('BP') || lowerQuery.includes('रक्तचाप')) {
      return 'For blood pressure management:\n\n1. Reduce salt intake\n2. Exercise regularly\n3. Maintain healthy weight\n4. Limit alcohol consumption\n5. Manage stress\n\nNormal BP is around 120/80 mmHg. Please consult a doctor for proper monitoring.';
    }
    
    if (lowerQuery.includes('thank') || lowerQuery.includes('धन्यवाद')) {
      return 'You are welcome! Stay healthy. Feel free to ask me any health-related questions anytime.';
    }
    
    return 'Thank you for your question. For specific medical advice, I recommend consulting with a healthcare professional. However, I can help you with:\n\n- General health information\n- Finding nearby hospitals\n- Lab report analysis\n- Health risk assessment\n\nHow can I assist you further?';
  };

  const features = [
    { icon: MessageCircle, key: 'chatbot', desc: 'chatbot.desc', color: 'bg-blue-500' },
    { icon: Building2, key: 'hospitals', desc: 'hospitals.desc', color: 'bg-green-500' },
    { icon: Scan, key: 'lab', desc: 'lab.desc', color: 'bg-purple-500' },
    { icon: Activity, key: 'risk', desc: 'risk.desc', color: 'bg-orange-500' },
  ];

  return (
    <div id="home" className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Healthcare
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                {t('home.hero.title')}
                <span className="block text-primary">{t('home.hero.subtitle')}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {t('home.hero.description')}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#chat"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#hospitals"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Find Hospitals
                </a>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="animate-fade-in-up stagger-2">
              <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 bg-primary text-primary-foreground">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">SwasthSathi</h3>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div id="chat" className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === 'assistant' && (
                            <Bot className="w-4 h-4 mt-1 text-primary" />
                          )}
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={t('home.chat.placeholder')}
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions powered by artificial intelligence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <a
                key={feature.key}
                href={`#${feature.key === 'hospitals' ? 'hospitals' : feature.key === 'lab' ? 'lab' : feature.key === 'risk' ? 'risk' : 'home'}`}
                className={`group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up stagger-${index + 1}`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(`home.features.${feature.key}`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`home.features.${feature.desc}`)}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
