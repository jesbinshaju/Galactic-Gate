import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { formatPrice, getNumericPrice } from '../utils/priceUtils';

export default function Market() {
  const [priceData, setPriceData] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState("cardamom");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [language, setLanguage] = useState('en');

  const spices = [
    { name: "pepper", label: "Astroids", image: "/images/pepper.png", ml: "കുരുമുളക്" },
    { name: "cardamom", label: "Lunar Vehicle", image: "/images/cardamom.png", ml: "ഏലം" },
    { name: "clove", label: "Lunar Particles", image: "/images/clove.png", ml: "ഗ്രാമ്പൂ" },
    { name: "nutmeg", label: "Space Suit", image: "/images/nutmeg.png", ml: "ജാതിക്ക" },
    { name: "cinnamon", label: "Rocket-Scrap", image: "/images/cinnamon.png", ml: "കറുവപ്പട്ട" },
    { name: "vanilla", label: "Autograph", image: "/images/vanilla.png", ml: "വനില" }
  ];

  const numberToMalayalam = (num) => {
    const ones = ['', 'ഒന്ന്', 'രണ്ട്', 'മൂന്ന്', 'നാല്', 'അഞ്ച്', 'ആറ്', 'ഏഴ്', 'എട്ട്', 'ഒമ്പത്'];
    const tens = ['', '', 'ഇരുപത്', 'മുപ്പത്', 'നാല്പത്', 'അമ്പത്', 'അറുപത്', 'എഴുപത്', 'എണ്‍പത്', 'തൊണ്ണൂറ്'];
    const hundreds = ['', 'നൂറ്', 'ഇരുനൂറ്', 'മുന്നൂറ്', 'നാനൂറ്', 'അഞ്ഞൂറ്', 'ആറുനൂറ്', 'എഴുനൂറ്', 'എണ്ണൂറ്', 'ഒമ്പതുനൂറ്'];
    
    if (num === 0) return 'പൂജ്യം';
    if (num < 10) return ones[num];
    if (num === 10) return 'പത്ത്';
    if (num < 20) return ones[num - 10] + 'പത്ത്';
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one > 0 ? ones[one] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return hundreds[hundred] + (remainder > 0 ? ' ' + numberToMalayalam(remainder) : '');
    }
    if (num < 100000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return numberToMalayalam(thousand) + ' ആയിരം' + (remainder > 0 ? ' ' + numberToMalayalam(remainder) : '');
    }
    return num.toString(); // Fallback for very large numbers
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    try {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language with fallbacks for Malayalam
      if (language === 'ml') {
        utterance.lang = 'ml-IN';
        // Fallback to Hindi if Malayalam not available
        const voices = speechSynthesis.getVoices();
        const malayalamVoice = voices.find(voice => voice.lang.includes('ml'));
        const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
        
        if (malayalamVoice) {
          utterance.voice = malayalamVoice;
        } else if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = 'hi-IN';
        }
      } else {
        utterance.lang = 'en-IN';
      }
      
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          console.error('Speech error:', event.error);
        }
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      const API_URL = process.env.REACT_APP_API_URL;
      axios.get(`${API_URL}/api/spices/${selectedSpice}/ohlc`)
        .then(res => {
          const data = res.data.map(item => ({
            ...item,
            date: new Date(item.timestamp).toLocaleDateString()
          }));
          setPriceData(data);
          if (data.length > 0) {
            setCurrentPrice(data[data.length - 1]);
          }
        })
        .catch(console.error);
    };
    fetchData();
    const iv = setInterval(fetchData, 3600000);
    return () => clearInterval(iv);
  }, [selectedSpice]);

  const selectedSpiceInfo = spices.find(s => s.name === selectedSpice);
  
  const getPriceText = () => {
    if (!currentPrice || !selectedSpiceInfo) return language === 'ml' ? 'വില ലോഡ് ചെയ്യുന്നു' : 'Loading price';
    
    const price = getNumericPrice(currentPrice.close);
    
    if (language === 'ml') {
      const priceInMalayalam = numberToMalayalam(Math.floor(price));
      return `${selectedSpiceInfo.ml} ന്റെ ഇന്നത്തെ വില കിലോഗ്രാമിന് ${priceInMalayalam} രൂപ ആണ്`;
    } else {
      return `Current price of ${selectedSpiceInfo.label} is ${price} rupees per kilogram`;
    }
  };
  
  const priceText = getPriceText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-neutral-100">
        <div className="flex justify-between items-center max-w-lg mx-auto px-6 py-5">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-700">{language === 'ml' ? 'വിപണി വില' : 'Market Prices'}</h1>
            <p className="text-caption text-neutral-500 mt-1">{language === 'ml' ? 'തത്സമയ നിരക്കുകൾ' : 'Live market rates'}</p>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
            className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 transition-all duration-200 border border-neutral-200"
          >
            {language === 'en' ? 'മലയാളം' : 'English'}
          </button>
        </div>
      </header>

      {/* Spice Grid */}
      <div className="px-6 py-4">
        <div className="mb-8">
          <h2 className="text-heading text-xl mb-4 text-center">Select Spice</h2>
          <div className="grid grid-cols-2 gap-3">
            {spices.map(spice => (
              <button
                key={spice.name}
                onClick={() => setSelectedSpice(spice.name)}
                className={`p-6 rounded-2xl shadow-medium hover:shadow-strong transform hover:scale-[1.02] transition-all duration-300 group ${
                  selectedSpice === spice.name
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-primary-50'
                }`}
              >
                <img 
                  src={spice.image} 
                  alt={spice.label}
                  className="w-10 h-10 object-cover rounded-xl mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                />
                <h3 className="font-bold text-sm mb-1">{spice.label}</h3>
                <p className="text-xs opacity-75">{language === 'ml' ? spice.ml : 'Premium'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Price Card */}
        {currentPrice && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedSpiceInfo?.image} 
                  alt={selectedSpiceInfo?.label}
                  className="w-12 h-12 object-cover rounded-xl"
                  onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                />
                <div>
                  <h2 className="text-heading text-2xl mb-1">
                    {selectedSpiceInfo?.label}
                  </h2>
                  <p className="text-caption">
                    Updated: {new Date(currentPrice.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => speak(priceText)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-4 rounded-xl shadow-medium hover:shadow-strong transition-all duration-200"
              >
                <span className="text-xl">🔊</span>
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-secondary-600 mb-3">
                ₹{formatPrice(currentPrice.close)}/kg
              </div>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="bg-secondary-50 px-4 py-2 rounded-xl border border-secondary-200">
                  <span className="text-caption">High</span>
                  <div className="font-bold text-secondary-700">₹{formatPrice(currentPrice.high)}</div>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-200">
                  <span className="text-caption">Low</span>
                  <div className="font-bold text-primary-700">₹{formatPrice(currentPrice.low)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Chart */}
        {priceData.length > 0 && (
          <div className="card p-6">
            <div className="text-center mb-6">
              <h3 className="text-heading text-xl mb-2">30-Day Price Trend</h3>
              <p className="text-body">Historical price movement</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={priceData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `₹${value}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#16a34a" 
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#15803d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}