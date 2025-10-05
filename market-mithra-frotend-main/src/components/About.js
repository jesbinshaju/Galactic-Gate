import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-green-700 text-center">About Market Mithra</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌶️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Market Mithra</h2>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We are on a mission to <strong>empower Kerala's spice farmers</strong> and revolutionize the way spices are traded, priced, and grown.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform brings <strong>real-time spice price tracking</strong>, AI-powered price predictions, climate-aware crop insights, and direct farmer-to-trader connections — ensuring better profits, transparency, and sustainability.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌿</span>
            <h3 className="text-xl font-bold text-green-700">Our Vision</h3>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            To transform Kerala's spice economy into a <strong>globally competitive and farmer-friendly ecosystem</strong> using data, technology, and innovation.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Market Mithra bridges the gap between farmers, traders, and the spice market through:
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="text-lg font-bold text-blue-600 mb-2">Live Market Prices</h4>
                <p className="text-gray-700">Real-time spice price updates to help farmers make informed selling decisions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h4 className="text-lg font-bold text-green-600 mb-2">Direct Trade Marketplace</h4>
                <p className="text-gray-700">Eliminates middlemen for better farmer profits through direct farmer-to-trader connections.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-3xl">🌱</div>
              <div>
                <h4 className="text-lg font-bold text-orange-600 mb-2">Farming Insights</h4>
                <p className="text-gray-700">Spice-specific tips and climate-aware crop insights for higher yields and better quality.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Platform Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎤</div>
              <h4 className="font-bold text-green-700 mb-2">Voice Support</h4>
              <p className="text-sm text-gray-600">Malayalam & English voice guidance for easy navigation</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-bold text-blue-700 mb-2">Mobile First</h4>
              <p className="text-sm text-gray-600">Designed specifically for farmers using smartphones</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-bold text-yellow-700 mb-2">Fair Pricing</h4>
              <p className="text-sm text-gray-600">Transparent pricing with no hidden fees</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-purple-700 mb-2">Secure Trading</h4>
              <p className="text-sm text-gray-600">Safe and secure transactions for all users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}