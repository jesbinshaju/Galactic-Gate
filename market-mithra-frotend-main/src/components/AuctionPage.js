import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuctionPage({ productId }) {
  const [auctionData, setAuctionData] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (productId) {
      fetchAuctionData();
      const interval = setInterval(fetchAuctionData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [productId]);

  useEffect(() => {
    if (auctionData?.auction?.endsAt) {
      const timer = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [auctionData]);

  const fetchAuctionData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auction/${productId}`);
      setAuctionData(response.data);
    } catch (error) {
      console.error('Failed to fetch auction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!auctionData?.auction?.endsAt) return;
    
    const now = new Date().getTime();
    const endTime = new Date(auctionData.auction.endsAt).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeLeft('Auction ended');
    }
  };

  const formatPrice = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (value && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    if (value && typeof value.toString === "function") {
      return parseFloat(value.toString());
    }
    return 0;
  };

  const placeBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.role !== 'buyer') {
        showToast('Only buyers can place bids', 'error');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auction/${productId}/bid`,
        { amount: parseFloat(bidAmount) },
        { headers: { 'x-user-id': user.id } }
      );

      showToast('Bid placed successfully!', 'success');
      setBidAmount('');
      fetchAuctionData(); // Refresh data
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to place bid', 'error');
    } finally {
      setBidLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading auction...</div>
      </div>
    );
  }

  if (!auctionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Auction not found</div>
      </div>
    );
  }

  const { auction, bids, highestBid, bidCount } = auctionData;
  const product = auction.productId;
  const currentPrice = highestBid ? formatPrice(highestBid.amount) : formatPrice(auction.startPrice);
  const minBid = currentPrice + formatPrice(auction.minIncrement);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Product Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {product.spice} - Grade {product.grade}
              </h1>
              <p className="text-gray-600 mt-1">
                {formatPrice(product.quantityKg)} kg available
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Auction Status</div>
              <div className={`text-lg font-bold ${
                auction.status === 'live' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {auction.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Current Price & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-sm text-blue-600 font-medium">Current Price</div>
              <div className="text-3xl font-bold text-blue-800">₹{currentPrice}</div>
              <div className="text-xs text-blue-600 mt-1">
                {bidCount} bid{bidCount !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-sm text-orange-600 font-medium">Time Remaining</div>
              <div className="text-xl font-bold text-orange-800">{timeLeft}</div>
              <div className="text-xs text-orange-600 mt-1">
                Ends {new Date(auction.endsAt).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-sm text-green-600 font-medium">Starting Price</div>
              <div className="text-2xl font-bold text-green-800">₹{formatPrice(auction.startPrice)}</div>
              <div className="text-xs text-green-600 mt-1">
                Min increment: ₹{formatPrice(auction.minIncrement)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bid Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Place Your Bid</h2>
            
            <form onSubmit={placeBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={minBid}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Minimum: ₹${minBid}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your bid must be at least ₹{minBid}
                </p>
              </div>

              <button
                type="submit"
                disabled={bidLoading || auction.status !== 'live'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {bidLoading ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </form>

            {auction.status !== 'live' && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center text-gray-600">
                Auction is not currently active
              </div>
            )}
          </div>

          {/* Bid History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bid History ({bidCount})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bids.length > 0 ? (
                bids.map((bid, index) => (
                  <div
                    key={bid._id}
                    className={`p-3 rounded-lg border ${
                      index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {bid.bidderId.name}
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Highest
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {bid.bidderId.district}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{formatPrice(bid.amount)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(bid.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No bids yet. Be the first to bid!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}