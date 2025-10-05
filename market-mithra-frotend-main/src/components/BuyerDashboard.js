import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';

const BuyerDashboard = ({ user }) => {
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's bids
      const bidsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auctions/user/${user._id || user.id}/bids`, {
        headers: {
          'x-user-id': user._id || user.id
        }
      });
      if (bidsResponse.ok) {
        const bids = await bidsResponse.json();
        
        // Separate active bids and won auctions
        const active = bids.filter(bid => bid.auction?.status === 'open');
        const won = bids.filter(bid => bid.auction?.status === 'closed' && bid.auction?.winner?.toString() === (user._id || user.id));
        
        setActiveBids(active);
        setWonAuctions(won);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4 animate-pulse">📊</div>
          <p className="text-body text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🛒</div>
          <h1 className="text-heading text-3xl mb-2">Buyer Dashboard</h1>
          <p className="text-body">Track your bids and manage won auctions</p>
        </div>
        
        {/* Active Bids */}
        <div className="mb-10">
          <h2 className="text-heading text-2xl mb-6 flex items-center gap-3">
            <span>⏳</span>
            <span>Active Bids</span>
          </h2>
          {activeBids.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-body text-lg">No active bids</p>
              <p className="text-caption mt-2">Start bidding on auctions to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBids.map((bid) => (
                <div key={bid._id} className="card p-6 hover:shadow-strong transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-heading text-xl mb-2 capitalize">{bid.auction?.productId?.spice}</h3>
                      <div className="space-y-1">
                        <p className="text-subheading">Your bid: <span className="font-bold text-accent-600">₹{bid.amount}</span></p>
                        <p className="text-caption">
                          Current highest: <span className="font-medium">₹{bid.auction?.highestBid || bid.auction?.startingPrice}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        bid.amount === bid.auction?.highestBid 
                          ? 'bg-secondary-100 text-secondary-800 border border-secondary-200' 
                          : 'bg-primary-100 text-primary-800 border border-primary-200'
                      }`}>
                        {bid.amount === bid.auction?.highestBid ? '🏆 Winning' : '⚡ Outbid'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Won Auctions */}
        <div>
          <h2 className="text-heading text-2xl mb-6 flex items-center gap-3">
            <span>🏆</span>
            <span>Won Auctions</span>
          </h2>
          {wonAuctions.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-body text-lg">No won auctions yet</p>
              <p className="text-caption mt-2">Keep bidding to win your first auction!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wonAuctions.map((bid) => (
                <div key={bid._id} className="card p-6 border-l-4 border-secondary-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-heading text-xl mb-2 capitalize">{bid.auction?.productId?.spice}</h3>
                      <div className="space-y-1">
                        <p className="text-subheading">Final price: <span className="font-bold text-secondary-600">₹{bid.auction?.finalPrice}</span></p>
                        <p className="text-caption">
                          Quantity: <span className="font-medium">{bid.auction?.productId?.quantity}kg</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <span className="block px-4 py-2 rounded-xl text-sm font-medium bg-secondary-100 text-secondary-800 border border-secondary-200">
                        ✅ Won
                      </span>
                      <button
                        onClick={() => {
                          setSelectedAuction({
                            productId: bid.auction.productId._id,
                            sellerName: 'Seller'
                          });
                          setShowReviewForm(true);
                        }}
                        className="px-4 py-2 text-sm bg-accent-100 text-accent-700 rounded-xl hover:bg-accent-200 transition-colors duration-200 font-medium border border-accent-200"
                      >
                        ⭐ Review Seller
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showReviewForm && selectedAuction && (
          <ReviewForm
            productId={selectedAuction.productId}
            sellerName={selectedAuction.sellerName}
            onSubmit={() => {
              setShowReviewForm(false);
              setSelectedAuction(null);
            }}
            onCancel={() => {
              setShowReviewForm(false);
              setSelectedAuction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;