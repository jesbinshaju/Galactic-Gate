import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [prices, setPrices] = useState({
    pepper: '',
    cardamom: '',
    clove: '',
    nutmeg: '',
    cinnamon: '',
    vanilla: ''
  });
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(false);

  const spiceInfo = {
    pepper: { label: "Black Pepper", image: "/images/pepper.png" },
    cardamom: { label: "Cardamom", image: "/images/cardamom.png" },
    clove: { label: "Clove", image: "/images/clove.png" },
    nutmeg: { label: "Nutmeg", image: "/images/nutmeg.png" },
    cinnamon: { label: "Cinnamon", image: "/images/cinnamon.png" },
    vanilla: { label: "Vanilla", image: "/images/vanilla.png" }
  };

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/spices');
      const data = await response.json();
      const priceMap = {};
      data.forEach(spice => {
        priceMap[spice.name] = spice.current?.close || 0;
      });
      setCurrentPrices(priceMap);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const updateSinglePrice = async (spice) => {
    if (!prices[spice]) {
      alert('Please enter a price');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/admin/update-price', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify({
          spice,
          price: parseFloat(prices[spice])
        })
      });

      if (response.ok) {
        alert(`✅ ${spiceInfo[spice].label} price updated to ₹${prices[spice]}`);
        setPrices(prev => ({ ...prev, [spice]: '' }));
        fetchCurrentPrices();
      } else {
        alert('❌ Failed to update price');
      }
    } catch (error) {
      alert('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdate = async () => {
    const validPrices = {};
    Object.keys(prices).forEach(spice => {
      if (prices[spice] && parseFloat(prices[spice]) > 0) {
        validPrices[spice] = parseFloat(prices[spice]);
      }
    });

    if (Object.keys(validPrices).length === 0) {
      alert('Please enter at least one price');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/admin/bulk-update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify({ prices: validPrices })
      });

      if (response.ok) {
        alert(`✅ Updated ${Object.keys(validPrices).length} spice prices`);
        setPrices({
          pepper: '', cardamom: '', clove: '', nutmeg: '', cinnamon: '', vanilla: ''
        });
        fetchCurrentPrices();
      } else {
        alert('❌ Failed to update prices');
      }
    } catch (error) {
      alert('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 pb-20">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-purple-700">Admin Panel</h1>
            <p className="text-sm text-gray-600">Manual Price Updates</p>
          </div>
          <div className="flex space-x-2">
            <a 
              href="/admin/market-rates"
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium text-sm"
            >
              Market Rates
            </a>
            <a 
              href="/admin/certificates"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm"
            >
              Certificates
            </a>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Current Prices Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4 text-center">Current Market Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(spiceInfo).map(spice => (
              <div key={spice} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={spiceInfo[spice].image} 
                    alt={spiceInfo[spice].label}
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                  />
                  <span className="font-medium">{spiceInfo[spice].label}</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ₹{currentPrices[spice] || 0}/kg
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Update Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4 text-center">Update Prices</h2>
          
          <div className="space-y-4">
            {Object.keys(spiceInfo).map(spice => (
              <div key={spice} className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <img 
                    src={spiceInfo[spice].image} 
                    alt={spiceInfo[spice].label}
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                  />
                  <span className="font-medium w-24">{spiceInfo[spice].label}</span>
                  <input
                    type="number"
                    value={prices[spice]}
                    onChange={(e) => setPrices(prev => ({ ...prev, [spice]: e.target.value }))}
                    placeholder="Enter new price"
                    className="flex-1 p-2 border rounded-lg"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={() => updateSinglePrice(spice)}
                  disabled={loading || !prices[spice]}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Update
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={bulkUpdate}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-xl font-bold text-lg"
            >
              {loading ? 'Updating...' : 'Update All Prices'}
            </button>
          </div>
        </div>

        {/* Quick Price Sets */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-center">Quick Price Sets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setPrices({
                pepper: '850', cardamom: '2400', clove: '900', nutmeg: '600', cinnamon: '500', vanilla: '3500'
              })}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg border-2 border-yellow-300"
            >
              <div className="font-bold text-yellow-800">Standard Rates</div>
              <div className="text-sm text-yellow-600">Load typical market prices</div>
            </button>
            
            <button
              onClick={() => setPrices({
                pepper: '900', cardamom: '2600', clove: '950', nutmeg: '650', cinnamon: '550', vanilla: '3800'
              })}
              className="p-4 bg-green-100 hover:bg-green-200 rounded-lg border-2 border-green-300"
            >
              <div className="font-bold text-green-800">Premium Rates</div>
              <div className="text-sm text-green-600">Load higher quality prices</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}