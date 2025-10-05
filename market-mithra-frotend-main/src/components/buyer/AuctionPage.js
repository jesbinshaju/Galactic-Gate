import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuctionPage({ auctionId }) {
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (auctionId) {
      fetchAuction();
      const interval = setInterval(fetchAuction, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [auctionId]);

  useEffect(() => {
    if (auction?.endTime) {
      const timer = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [auction]);

  const fetchAuction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}`, {
        headers: { 'x-user-id': user.id }
      });
      setAuction(response.data);
    } catch (error) {
      console.error('Failed to fetch auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!auction?.endTime) return;
    
    const now = new Date().getTime();
    const endTime = new Date(auction.endTime).getTime();
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
        `${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}/bid`,
        { amount: parseFloat(bidAmount) },
        { headers: { 'x-user-id': user.id } }
      );

      showToast('Bid placed successfully!', 'success');
      setBidAmount('');
      fetchAuction(); // Refresh auction data
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
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4 animate-pulse">🔨</div>
          <p className="text-body text-xl">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-body text-xl">Auction not found</p>
        </div>
      </div>
    );
  }

  const product = auction.productId;
  const currentBid = auction.highestBid || auction.startingPrice;
  const minBid = currentBid + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 pb-20">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-strong z-50 ${
          toast.type === 'success' 
            ? 'bg-secondary-500 text-white border border-secondary-600' 
            : 'bg-red-500 text-white border border-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Product Header */}
        <div className="card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-heading text-3xl mb-2 capitalize">
                {product.spice} - Grade {product.grade}
              </h1>
              <p className="text-body text-lg">
                {product.quantityKg} kg available
              </p>
            </div>
            <div className="text-right">
              <div className="text-caption">Status</div>
              <div className={`text-lg font-bold px-3 py-1 rounded-xl ${
                auction.status === 'active' 
                  ? 'text-secondary-700 bg-secondary-100 border border-secondary-200' 
                  : 'text-neutral-700 bg-neutral-100 border border-neutral-200'
              }`}>
                {auction.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Current Bid & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-accent-50 p-6 rounded-2xl border border-accent-200">
              <div className="text-sm text-accent-700 font-medium mb-2">Current Bid</div>
              <div className="text-3xl font-display font-bold text-accent-800">₹{currentBid}</div>
              {auction.highestBidder && (
                <div className="text-xs text-accent-600 mt-2">
                  by {auction.highestBidder.name}
                </div>
              )}
            </div>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200">
              <div className="text-sm text-primary-700 font-medium mb-2">Time Remaining</div>
              <div className="text-xl font-bold text-primary-800">{timeLeft}</div>
              <div className="text-xs text-primary-600 mt-2">
                Ends {new Date(auction.endTime).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-secondary-50 p-6 rounded-2xl border border-secondary-200">
              <div className="text-sm text-secondary-700 font-medium mb-2">Starting Price</div>
              <div className="text-2xl font-bold text-secondary-800">₹{auction.startingPrice}</div>
              <div className="text-xs text-secondary-600 mt-2">
                Min next bid: ₹{minBid}
              </div>
            </div>
          </div>
        </div>

        {/* Bid Form */}
        <div className="card p-6">
          <h2 className="text-heading text-xl mb-6 flex items-center gap-2">
            <span>🔨</span>
            <span>Place Your Bid</span>
          </h2>
          
          <form onSubmit={placeBid} className="space-y-6">
            <div>
              <label className="block text-subheading text-sm mb-3">
                Bid Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min={minBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="input-field text-lg"
                placeholder={`Minimum: ₹${minBid}`}
                required
              />
              <p className="text-caption mt-2">
                Your bid must be at least ₹{minBid}
              </p>
            </div>

            <button
              type="submit"
              disabled={bidLoading || auction.status !== 'active'}
              className="w-full btn-accent py-4 text-lg disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              {bidLoading ? 'Placing Bid...' : '🔨 Place Bid'}
            </button>
          </form>

          {auction.status !== 'active' && (
            <div className="mt-6 p-4 bg-neutral-100 rounded-xl text-center border border-neutral-200">
              <p className="text-body">⚠️ Auction is not currently active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}