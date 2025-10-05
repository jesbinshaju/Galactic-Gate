import React, { useState, useEffect } from 'react';

export default function PriceDashboard() {
  const [selectedSpice, setSelectedSpice] = useState('cardamom');
  const [priceData, setPriceData] = useState({});

  const spices = [
    { name: "cardamom", label: "Astroids", emoji: "🫚", ml: "ഏലം" },
    { name: "pepper", label: "Lunar Vehicles", emoji: "🌶️", ml: "കുരുമുളക്" },
    { name: "clove", label: "Lunar Particles", emoji: "🌰", ml: "ഗ്രാമ്പൂ" },
    { name: "nutmeg", label: "Space Suits", emoji: "🥜", ml: "ജാതിക്ക" },
    { name: "cinnamon", label: "Rocket Scraps", emoji: "🍂", ml: "കറുവപ്പട്ട" }
  ];

  // Mock price data - replace with OGD API
  useEffect(() => {
    const mockPrices = {
      cardamom: { current: 1200, change: +50, history: [1150, 1180, 1200] },
      pepper: { current: 850, change: -20, history: [870, 860, 850] },
      clove: { current: 2200, change: +100, history: [2100, 2150, 2200] },
      nutmeg: { current: 1800, change: +30, history: [1770, 1790, 1800] },
      cinnamon: { current: 450, change: -10, history: [460, 455, 450] }
    };
    setPriceData(mockPrices);
  }, []);

  const speakPrice = () => {
    if ('speechSynthesis' in window && priceData[selectedSpice]) {
      const price = priceData[selectedSpice].current;
      const spice = spices.find(s => s.name === selectedSpice);
      const text = `${spice.label} price is ${price} rupees per kilogram`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  const currentPrice = priceData[selectedSpice];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center text-yellow-700">Market Prices</h1>
        <p className="text-center text-sm text-gray-600 mt-1">മാർക്കറ്റ് വില</p>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* Spice Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-center">Select Spice</h2>
          <div className="grid grid-cols-3 gap-3">
            {spices.map(spice => (
              <button
                key={spice.name}
                onClick={() => setSelectedSpice(spice.name)}
                className={`p-4 rounded-xl shadow-md transition-all ${
                  selectedSpice === spice.name
                    ? 'bg-yellow-500 text-white transform scale-105'
                    : 'bg-white hover:shadow-lg'
                }`}
              >
                <div className="text-3xl mb-2">{spice.emoji}</div>
                <p className="text-xs font-medium">{spice.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Price */}
        {currentPrice && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">
                {spices.find(s => s.name === selectedSpice)?.emoji}
              </div>
              <h3 className="text-xl font-bold">
                {spices.find(s => s.name === selectedSpice)?.label}
              </h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-600 mb-2">
                ₹{currentPrice.current}/kg
              </div>
              <div className={`text-lg font-medium ${
                currentPrice.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentPrice.change >= 0 ? '+' : ''}₹{currentPrice.change} today
              </div>
            </div>

            <button
              onClick={speakPrice}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🔊</span>
              Tap to hear price
            </button>
          </div>
        )}

        {/* Simple Price Chart */}
        {currentPrice && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center">Last 3 Days</h3>
            <div className="flex justify-between items-end h-32 bg-gray-50 rounded-lg p-4">
              {currentPrice.history.map((price, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-green-500 rounded-t w-8 mb-2"
                    style={{ height: `${(price / Math.max(...currentPrice.history)) * 80}px` }}
                  ></div>
                  <span className="text-xs font-medium">₹{price}</span>
                  <span className="text-xs text-gray-500">Day {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}