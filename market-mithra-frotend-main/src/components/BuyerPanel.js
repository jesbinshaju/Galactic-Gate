import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BidOnlyInterface from './buyer/BidOnlyInterface';
import { formatPrice } from '../utils/priceUtils';

export default function BuyerPanel() {
  const [viewMode, setViewMode] = useState('auctions'); // 'auctions' or 'listings'
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const spiceInfo = {
    cardamom: { label: "Cardamom", image: "/images/cardamom.png" },
    pepper: { label: "Black Pepper", image: "/images/pepper.png" },
    clove: { label: "Clove", image: "/images/clove.png" },
    nutmeg: { label: "Nutmeg", image: "/images/nutmeg.png" },
    cinnamon: { label: "Cinnamon", image: "/images/cinnamon.png" },
    vanilla: { label: "Vanilla", image: "/images/vanilla.png" }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/listings`);
      
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        throw new Error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Set demo data on error
      setListings([
        { id: 1, spice: 'pepper', grade: 'A', quantity: 50, price: 800, farmer: 'Demo Farmer', phone: '9999999999', location: 'Kerala' },
        { id: 2, spice: 'cardamom', grade: 'B', quantity: 30, price: 1200, farmer: 'Test Farmer', phone: '8888888888', location: 'Idukki' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || 
                             window.webkitSpeechRecognition || 
                             window.mozSpeechRecognition || 
                             window.msSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('❌ Voice search not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Voice search error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('❌ Microphone access denied.');
        } else if (event.error === 'no-speech') {
          alert('⚠️ No speech detected. Try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (error) {
      console.error('Voice search setup error:', error);
      alert('❌ Voice search failed.');
      setIsListening(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const spice = spiceInfo[listing.spice];
    if (!spice) return false;
    
    const matchesSearch = spice.label.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'low-price') return matchesSearch && listing.price < 1000;
    if (filterBy === 'high-quantity') return matchesSearch && listing.quantity > 30;
    return matchesSearch;
  });

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleOrder = async (listing) => {
    try {
      const orderData = {
        spice: listing.spice,
        quantity: listing.quantity,
        price: listing.price,
        farmerId: listing.userId,
        farmerName: listing.farmer,
        farmerPhone: listing.phone,
        location: listing.location
      };

      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Order placed successfully! Order ID: ${result.orderId || 'N/A'}`);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(`❌ Order failed. Calling farmer directly at ${listing.phone}`);
      handleCall(listing.phone);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-neutral-100">
        <div className="max-w-lg mx-auto px-6 py-5">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-display font-bold text-accent-700">Buy Spices</h1>
            <p className="text-caption text-neutral-500 mt-1">Browse auctions and direct purchases</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-3 mb-2">
            <button
              onClick={() => setViewMode('auctions')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'auctions' 
                  ? 'bg-primary-600 text-white shadow-soft' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              🔨 Auctions
            </button>
            <button
              onClick={() => setViewMode('listings')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'listings' 
                  ? 'bg-accent-600 text-white shadow-soft' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              💰 Direct Buy
            </button>
            <Link
              to="/buyer/dashboard"
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary-600 text-white hover:bg-secondary-700 transition-all duration-200 shadow-soft"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Render based on view mode */}
      {viewMode === 'auctions' ? (
        <BidOnlyInterface user={user} />
      ) : (
      <div className="px-6 py-4 max-w-lg mx-auto">
        <div className="card p-6 mb-6">
          <h2 className="text-heading text-xl mb-4 text-center">Search Spices</h2>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search spices..."
              className="input-field flex-1"
            />
            <button
              onClick={startVoiceSearch}
              disabled={isListening}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft hover:shadow-medium'
              }`}
            >
              <span className="text-xl">🎤</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                filterBy === 'all' 
                  ? 'bg-accent-600 text-white shadow-soft' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Spices
            </button>
            <button
              onClick={() => setFilterBy('low-price')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                filterBy === 'low-price' 
                  ? 'bg-accent-600 text-white shadow-soft' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              💰 Low Price
            </button>
            <button
              onClick={() => setFilterBy('high-quantity')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                filterBy === 'high-quantity' 
                  ? 'bg-accent-600 text-white shadow-soft' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              📦 High Quantity
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4 animate-pulse">⏳</div>
              <p className="text-body">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-body">No spices found</p>
              <p className="text-caption mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredListings.map(listing => {
              const spice = spiceInfo[listing.spice];
              return (
                <div key={listing.id} className="card p-6 hover:shadow-strong transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <img 
                      src={spice?.image} 
                      alt={spice?.label}
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-heading text-xl mb-1">{spice?.label}</h3>
                      <p className="text-caption mb-3">Premium Quality Spice</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-body">Price:</span>
                          <span className="font-bold text-secondary-600 text-lg">₹{formatPrice(listing.price)}/kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-body">Available:</span>
                          <span className="font-medium">{listing.quantity} kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-body">Farmer:</span>
                          <span className="font-medium">{listing.farmer}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-body">Location:</span>
                          <span className="font-medium">{listing.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCall(listing.phone)}
                          className="flex-1 btn-secondary flex items-center justify-center gap-2"
                        >
                          <span>📞</span>
                          Call
                        </button>
                        <button
                          onClick={() => handleOrder(listing)}
                          className="flex-1 btn-accent flex items-center justify-center gap-2"
                        >
                          <span>🛒</span>
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      )}
    </div>
  );
}