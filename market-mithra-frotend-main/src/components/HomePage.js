import React, { useState } from 'react';

export default function HomePage({ onNavigate }) {
  const [language, setLanguage] = useState('en');

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-neutral-100">
        <div className="flex justify-between items-center max-w-lg mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-700">SpiceMarket Kerala</h1>
            <p className="text-caption text-neutral-500 mt-1">മസാല മാർക്കറ്റ് കേരളം</p>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
            className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 transition-all duration-200 border border-neutral-200"
          >
            {language === 'en' ? 'മലയാളം' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Section */}
      <div className="px-6 max-w-lg mx-auto pt-12 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
            {language === 'en' ? 'Kerala Spice Marketplace' : 'കേരള മസാല മാർക്കറ്റ്'}
          </h2>
          <p className="text-body text-lg">
            {language === 'en' ? 'Connect farmers and buyers directly' : 'കർഷകരെയും വാങ്ങുന്നവരെയും നേരിട്ട് ബന്ധിപ്പിക്കുന്നു'}
          </p>
        </div>
        
        <div className="space-y-5">
          {/* Sell Spices */}
          <button
            onClick={() => {
              speak(language === 'en' ? 'Sell your spices' : 'നിങ്ങളുടെ മസാലകൾ വിൽക്കുക');
              onNavigate('farmer');
            }}
            className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white p-8 rounded-3xl shadow-medium hover:shadow-strong transform hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🌿</div>
            <h3 className="text-2xl font-display font-bold mb-2">
              {language === 'en' ? 'Sell Spices' : 'മസാലകൾ വിൽക്കുക'}
            </h3>
            <p className="text-lg opacity-90 font-medium">
              {language === 'en' ? 'Farmer Panel' : 'കർഷക പാനൽ'}
            </p>
            <div className="mt-4 text-sm opacity-75">
              {language === 'en' ? 'Create auctions • Manage inventory' : 'ലേലം സൃഷ്ടിക്കുക • ഇൻവെന്ററി കൈകാര്യം ചെയ്യുക'}
            </div>
          </button>

          {/* Buy Spices */}
          <button
            onClick={() => {
              speak(language === 'en' ? 'Buy fresh spices' : 'പുതിയ മസാലകൾ വാങ്ങുക');
              onNavigate('buyer');
            }}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white p-8 rounded-3xl shadow-medium hover:shadow-strong transform hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🛒</div>
            <h3 className="text-2xl font-display font-bold mb-2">
              {language === 'en' ? 'Buy Spices' : 'മസാലകൾ വാങ്ങുക'}
            </h3>
            <p className="text-lg opacity-90 font-medium">
              {language === 'en' ? 'Buyer Panel' : 'വാങ്ങുന്നവരുടെ പാനൽ'}
            </p>
            <div className="mt-4 text-sm opacity-75">
              {language === 'en' ? 'Browse auctions • Place bids' : 'ലേലം ബ്രൗസ് ചെയ്യുക • ബിഡ് നൽകുക'}
            </div>
          </button>

          {/* Check Market Price */}
          <button
            onClick={() => {
              speak(language === 'en' ? 'Check market prices' : 'മാർക്കറ്റ് വില പരിശോധിക്കുക');
              onNavigate('prices');
            }}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-8 rounded-3xl shadow-medium hover:shadow-strong transform hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-display font-bold mb-2">
              {language === 'en' ? 'Market Prices' : 'മാർക്കറ്റ് വില'}
            </h3>
            <p className="text-lg opacity-90 font-medium">
              {language === 'en' ? 'Live Rates' : 'തത്സമയ നിരക്കുകൾ'}
            </p>
            <div className="mt-4 text-sm opacity-75">
              {language === 'en' ? 'Real-time pricing • Market trends' : 'തത്സമയ വിലനിർണ്ണയം • മാർക്കറ്റ് ട്രെൻഡുകൾ'}
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-neutral-100">
            <div className="flex justify-center space-x-8">
              <button className="text-caption hover:text-primary-600 transition-colors duration-200 font-medium">
                Contact Support
              </button>
              <div className="w-px bg-neutral-300"></div>
              <button className="text-caption hover:text-primary-600 transition-colors duration-200 font-medium">
                About
              </button>
            </div>
            <p className="text-caption mt-4 text-neutral-400">
              © 2024 SpiceMarket Kerala. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}