import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CreateAuctionForm from './farmer/CreateAuctionForm';
import AuctionManagement from './farmer/AuctionManagement';

export default function FarmerPanel({ user }) {
  const [step, setStep] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [listing, setListing] = useState({ price: '', quantity: '', photo: null });
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en');
  const [auctions, setAuctions] = useState([]);
  const [closingId, setClosingId] = useState(null);
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [showManageAuctions, setShowManageAuctions] = useState(false);

  const closeAuction = async (auctionId) => {
    setClosingId(auctionId);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}/close`,
        {},
        { headers: { 'x-user-id': user._id || user.id } }
      );
      alert('Auction closed successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to close auction');
    } finally {
      setClosingId(null);
    }
  };

  const spices = [
    { name: "pepper", label: "Black Pepper", image: "/images/pepper.png", ml: "കുരുമുളക്" },
    { name: "cardamom", label: "Cardamom", image: "/images/cardamom.png", ml: "ഏലം" },
    { name: "clove", label: "Clove", image: "/images/clove.png", ml: "ഗ്രാമ്പൂ" },
    { name: "nutmeg", label: "Nutmeg", image: "/images/nutmeg.png", ml: "ജാതിക്ക" },
    { name: "cinnamon", label: "Cinnamon", image: "/images/cinnamon.png", ml: "കറുവപ്പട്ട" },
    { name: "vanilla", label: "Vanilla", image: "/images/vanilla.png", ml: "വനില" }
  ];

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || 
                             window.webkitSpeechRecognition || 
                             window.mozSpeechRecognition || 
                             window.msSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('❌ Voice input not supported in this browser. Please use manual input.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      
      // Auto-stop after 10 seconds to prevent hanging
      const timeout = setTimeout(() => {
        recognition.stop();
        setIsListening(false);
      }, 10000);

      recognition.start();

      recognition.onresult = (event) => {
        clearTimeout(timeout);
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice input:', transcript);
        
        // Language-specific pattern matching
        let priceMatch, quantityMatch;
        
        if (language === 'ml') {
          // Malayalam patterns
          priceMatch = transcript.match(/(\d+)\s*(രൂപ|വില)/) || transcript.match(/(\d+)\s*(price|rupees?)/);
          quantityMatch = transcript.match(/(\d+)\s*(കിലോ|കിലോഗ്രാം)/) || transcript.match(/(\d+)\s*(kilo|kg|kilogram)/);
        } else {
          // English patterns
          priceMatch = transcript.match(/(\d+)\s*(price|rupees?)/);
          quantityMatch = transcript.match(/(\d+)\s*(kilo|kg|kilogram)/);
        }
        
        if (priceMatch) {
          setListing(prev => ({ ...prev, price: priceMatch[1] }));
        }
        if (quantityMatch) {
          setListing(prev => ({ ...prev, quantity: quantityMatch[1] }));
        }
        
        if (priceMatch || quantityMatch) {
          // Success feedback
          const successMsg = `✅ Got it! ${priceMatch ? `Price: ₹${priceMatch[1]}` : ''} ${quantityMatch ? `Quantity: ${quantityMatch[1]}kg` : ''}`;
          alert(successMsg);
        } else {
          const example = language === 'ml' ? '"1200 രൂപ, 50 കിലോ"' : '"1200 price, 50 kilo"';
          alert(`⚠️ Could not understand. Please say like: ${example}`);
        }
        
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        clearTimeout(timeout);
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('❌ Microphone access denied. Please enable microphone permissions and try again.');
        } else if (event.error === 'no-speech') {
          // Don't show alert for no-speech, just provide gentle feedback
          console.log('No speech detected - user can try again');
        } else if (event.error === 'audio-capture') {
          alert('❌ Microphone not available. Please check your microphone.');
        } else {
          alert('❌ Voice input failed. Please use manual input below.');
        }
      };

      recognition.onend = () => {
        clearTimeout(timeout);
        setIsListening(false);
      };
    } catch (error) {
      console.error('Speech recognition setup error:', error);
      alert('❌ Voice input setup failed. Please use manual input.');
      setIsListening(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setListing(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

  const confirmListing = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spice: selectedSpice.name,
          price: listing.price,
          quantity: listing.quantity,
          userId: user.id
        })
      });
      
      if (response.ok) {
        alert('✅ Your spice listing has been posted successfully!');
        // Reset form
        setStep(1);
        setSelectedSpice(null);
        setListing({ price: '', quantity: '', photo: null });
      } else {
        alert('❌ Failed to post listing. Please try again.');
      }
    } catch (error) {
      console.error('Error posting listing:', error);
      alert('❌ Network error. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-accent-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-neutral-100">
        <div className="max-w-lg mx-auto px-6 py-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-secondary-700">Sell Your Spices</h1>
              <p className="text-caption text-neutral-500 mt-1">നിങ്ങളുടെ മസാലകൾ വിൽക്കുക</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
              className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 transition-all duration-200 border border-neutral-200"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/farmer/dashboard"
              className="btn-secondary text-center text-sm py-2.5"
            >
              📊 Dashboard
            </Link>
            <button
              onClick={() => setShowCreateAuction(true)}
              className="btn-primary text-sm py-2.5"
            >
              🔨 Create Auction
            </button>
            <button
              onClick={() => setShowManageAuctions(!showManageAuctions)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium text-sm"
            >
              ⚙️ Manage
            </button>
            <Link
              to="/farmer/direct-sell"
              className="btn-accent text-center text-sm py-2.5"
            >
              💰 Direct Sell
            </Link>
          </div>
          
          {/* Active Auctions */}
          {auctions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-subheading text-sm mb-3 flex items-center gap-2">
                <span>🔥</span>
                <span>Active Auctions</span>
              </h3>
              <div className="space-y-3">
                {auctions.map(auction => (
                  <div key={auction._id} className="card p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="text-subheading font-medium capitalize">{auction.productId.spice} - Grade {auction.productId.grade}</div>
                        <div className="text-caption mt-1">
                          Current: <span className="font-bold text-secondary-600">₹{auction.highestBid || auction.startingPrice}</span>
                          {auction.winner && (
                            <span className="text-secondary-600 ml-2 font-medium">Winner: {auction.winner.name} - ₹{auction.finalPrice}</span>
                          )}
                          {auction.status === 'closed' && !auction.winner && (
                            <span className="text-neutral-500 ml-2">No winner</span>
                          )}
                        </div>
                      </div>
                      {auction.status === 'open' && (
                        <button
                          onClick={() => closeAuction(auction._id)}
                          disabled={closingId === auction._id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-neutral-300 text-white px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                        >
                          {closingId === auction._id ? 'Closing...' : 'Close'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* Step 1: Select Spice */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🌶️</div>
              <h2 className="text-heading text-2xl mb-2">Select Your Spice</h2>
              <p className="text-body">Choose the spice you want to sell</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {spices.map(spice => (
                <button
                  key={spice.name}
                  onClick={() => {
                    setSelectedSpice(spice);
                    setStep(2);
                  }}
                  className="card p-6 hover:shadow-strong transform hover:scale-[1.02] transition-all duration-300 group"
                >
                  <img 
                    src={spice.image} 
                    alt={spice.label}
                    className="w-16 h-16 object-cover rounded-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                  />
                  <h3 className="text-heading text-lg mb-1">{spice.label}</h3>
                  <p className="text-caption">{spice.ml}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Voice Input */}
        {step === 2 && selectedSpice && (
          <div>
            <div className="text-center mb-6">
              <img 
                src={selectedSpice.image} 
                alt={selectedSpice.label}
                className="w-20 h-20 object-cover rounded-lg mx-auto mb-4"
                onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
              />
              <h2 className="text-2xl font-bold">{selectedSpice.label}</h2>
              <p className="text-gray-600">{selectedSpice.ml}</p>
            </div>

            <div className="card p-6 mb-6">
              <h3 className="text-heading text-lg mb-4 text-center">Tell us your price & quantity</h3>
              
              <button
                onClick={startVoiceInput}
                disabled={isListening}
                className={`w-full p-8 rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white'
                }`}
              >
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-xl font-bold">
                  {isListening ? 'Listening... Speak now!' : 'Tap to Speak'}
                </p>
                <p className="text-sm opacity-90 mt-2">
                  {isListening 
                    ? (language === 'ml' ? 'സ്പഷ്ടമായി പറയുക: "1200 രൂപ, 50 കിലോ"' : 'Say clearly: "1200 price, 50 kilo"')
                    : (language === 'ml' ? 'ഉദാഹരണം: "1200 രൂപ, 50 കിലോ"' : 'Example: "1200 price, 50 kilo"')
                  }
                </p>
                {isListening && (
                  <div className="mt-2">
                    <div className="w-full bg-red-300 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </button>
              
              {/* Voice Input Tips */}
              <div className="mt-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
                <p className="text-sm text-accent-700 font-medium mb-2">💡 {language === 'ml' ? 'ശബ്ദ ഇന്പുട്ട് സൂചനകൾ:' : 'Voice Input Tips:'}</p>
                <ul className="text-xs text-accent-600 space-y-1">
                  {language === 'ml' ? (
                    <>
                      <li>• സ്പഷ്ടമായി പറയുക</li>
                      <li>• സംഖ്യ മുമ്പ്: "1200 രൂപ, 50 കിലോ"</li>
                      <li>• വിലയ്ക്ക്: "രൂപ" അല്ലെങ്കിൽ "വില"</li>
                      <li>• തൂക്കം: "കിലോ" അല്ലെങ്കിൽ "കിലോഗ്രാം"</li>
                    </>
                  ) : (
                    <>
                      <li>• Speak clearly and slowly</li>
                      <li>• Say numbers first: "1200 price, 50 kilo"</li>
                      <li>• Use "price" or "rupees" for price</li>
                      <li>• Use "kilo" or "kg" for quantity</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Manual Input Fallback */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-subheading text-sm mb-2">Price per kg (₹)</label>
                  <input
                    type="number"
                    value={listing.price}
                    onChange={(e) => setListing(prev => ({ ...prev, price: e.target.value }))}
                    className="input-field text-lg"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-subheading text-sm mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    value={listing.quantity}
                    onChange={(e) => setListing(prev => ({ ...prev, quantity: e.target.value }))}
                    className="input-field text-lg"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mt-6">
                <label className="block text-subheading text-sm mb-2">Upload Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-xl text-center cursor-pointer hover:border-secondary-500 transition-all duration-200 block bg-neutral-50 hover:bg-secondary-50"
                >
                  {listing.photo ? (
                    <img src={listing.photo} alt="Spice" className="w-20 h-20 object-cover mx-auto rounded" />
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📷</div>
                      <p>Tap to add photo</p>
                    </div>
                  )}
                </label>
              </div>

              {listing.price && listing.quantity && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-6 btn-secondary p-4 text-lg"
                >
                  Continue →
                </button>
              )}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 p-3 rounded-xl font-medium transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedSpice && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your Listing</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center mb-6">
                <img 
                  src={selectedSpice.image} 
                  alt={selectedSpice.label}
                  className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                  onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                />
                <h3 className="text-xl font-bold">{selectedSpice.label}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Price:</span>
                  <span className="text-xl font-bold text-green-600">₹{listing.price}/kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quantity:</span>
                  <span className="text-xl font-bold">{listing.quantity} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Value:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{(parseFloat(listing.price) * parseFloat(listing.quantity)).toLocaleString()}
                  </span>
                </div>
                {listing.photo && (
                  <div className="text-center">
                    <img src={listing.photo} alt="Spice" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                  </div>
                )}
              </div>

              <button
                onClick={confirmListing}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold text-xl"
              >
                ✅ Confirm & Post
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg"
            >
              ← Back to Edit
            </button>
          </div>
        )}
        
        {/* Auction Management Section */}
        {showManageAuctions && (
          <div className="mt-6">
            <AuctionManagement user={user} />
          </div>
        )}
        
        {/* Create Auction Modal */}
        {showCreateAuction && (
          <CreateAuctionForm
            user={user}
            onClose={() => setShowCreateAuction(false)}
            onSuccess={() => {
              setShowCreateAuction(false);
            }}
          />
        )}
      </div>
    </div>
  );
}