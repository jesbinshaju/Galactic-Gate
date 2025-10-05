import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const speak = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onerror = (event) => {
        // Ignore 'interrupted' errors as they're expected during navigation
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event.error);
        }
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  const content = {
    en: {
      title: 'Market Mithra',
      sell: 'Sell Spices',
      sellDesc: 'Farmers Panel',
      buy: 'Buy Spices', 
      buyDesc: 'Buyers Panel',
      price: 'Check Market Price',
      priceDesc: 'Live Rates',
      contact: 'Contact Support',
      about: 'About'
    },
    ml: {
      title: 'മാർക്കറ്റ് മിത്ര',
      sell: 'മസാല വിൽക്കുക',
      sellDesc: 'കർഷക പാനൽ',
      buy: 'മസാല വാങ്ങുക',
      buyDesc: 'വാങ്ങുന്നവരുടെ പാനൽ',
      price: 'വിപണി വില പരിശോധിക്കുക',
      priceDesc: 'തത്സമയ നിരക്കുകൾ',
      contact: 'സപ്പോർട്ട് ബന്ധപ്പെടുക',
      about: 'കുറിച്ച്'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <h1 className="text-xl font-bold text-green-700">{t.title}</h1>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
            className="px-3 py-1 bg-orange-100 rounded-full text-sm font-medium"
          >
            {language === 'en' ? 'മലയാളം' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="p-6 max-w-md mx-auto">
        <div className="space-y-6 mt-8">
          
          {/* Sell Spices Button */}
          <button
            onClick={() => {
              speak(t.sell, language);
              navigate('/farmer');
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h2 className="text-2xl font-bold mb-2">{t.sell}</h2>
              <p className="text-lg opacity-90">{t.sellDesc}</p>
            </div>
          </button>

          {/* Buy Spices Button */}
          <button
            onClick={() => {
              speak(t.buy, language);
              navigate('/buyer');
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-2">{t.buy}</h2>
              <p className="text-lg opacity-90">{t.buyDesc}</p>
            </div>
          </button>

          {/* Check Price Button */}
          <button
            onClick={() => {
              speak(t.price, language);
              navigate('/market');
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2">{t.price}</h2>
              <p className="text-lg opacity-90">{t.priceDesc}</p>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-center space-x-8 max-w-md mx-auto">
          <button 
            onClick={() => navigate('/contact')}
            className="text-green-600 font-medium"
          >
            {t.contact}
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => navigate('/about')}
            className="text-green-600 font-medium"
          >
            {t.about}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;