import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuctionTimer from '../shared/AuctionTimer';

// Reusable auction card with quick bid, timer, and watch functionality
// Connects to POST /api/auctions/:id/quick-bid, POST /api/auctions/:id/watch
const AuctionCard = ({ auction, onBidPlaced, showQuickBid = true }) => {
  const [quickBidAmount, setQuickBidAmount] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const product = auction.productId || auction.product;
  const currentPrice = auction.highestBid || auction.startingPrice;
  const minBid = currentPrice + (auction.minIncrement || 10);

  const handleQuickBid = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auctions/${auction._id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify({ amount: parseFloat(quickBidAmount) })
      });

      if (response.ok) {
        alert('Bid placed successfully!');
        setQuickBidAmount('');
        onBidPlaced?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to place bid');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatch = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auctions/${auction._id}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        }
      });

      if (response.ok) {
        setIsWatched(!isWatched);
      }
    } catch (error) {
      console.error('Error toggling watch:', error);
    }
  };

  return (
    <div className="card p-6 hover:shadow-strong transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          <h3 className="text-heading text-xl mb-2 capitalize">
            {product.spice} - Grade {product.grade}
          </h3>
          <p className="text-subheading mb-1">{product.quantity}kg available</p>
          <p className="text-caption">
            by {product.seller?.name || 'Farmer'}, {product.seller?.district || 'Location'}
          </p>
        </div>
        <button
          onClick={toggleWatch}
          className={`p-3 rounded-xl transition-all duration-200 ${
            isWatched 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-neutral-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          {isWatched ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-3xl font-display font-bold text-secondary-600">₹{currentPrice}</span>
          <AuctionTimer endTime={auction.endTime} />
        </div>
        <div className="text-caption">
          {auction.bidCount || 0} bid{(auction.bidCount || 0) !== 1 ? 's' : ''} placed
        </div>
      </div>

      {showQuickBid && auction.status === 'open' && (
        <form onSubmit={handleQuickBid} className="mb-5">
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              min={minBid}
              value={quickBidAmount}
              onChange={(e) => setQuickBidAmount(e.target.value)}
              placeholder={`Min: ₹${minBid}`}
              className="input-field flex-1 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !quickBidAmount}
              className="btn-accent px-6 py-3 text-sm font-medium disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing...' : 'Place Bid'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <button
          onClick={() => alert('Auction details: ' + product.spice + ' - Grade ' + product.grade + ' - ₹' + currentPrice)}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center gap-2"
        >
          <span>🔨</span>
          <span>View Auction Details</span>
        </button>
        
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 text-center">
          <p className="text-caption text-accent-700 font-medium">
            📝 Auction-based bidding • No direct purchase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;