import React, { useState, useEffect } from 'react';

// Manage active auctions: edit, cancel, close, view bid history
// Connects to PUT /api/auctions/:id, DELETE /api/auctions/:id, POST /api/auctions/:id/close
const AuctionManagement = ({ user }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/seller/products`, {
        headers: { 'x-user-id': user._id || user.id }
      });
      if (response.ok) {
        const products = await response.json();
        setAuctions(products.filter(p => p.auction));
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeAuction = async (auctionId) => {
    setActionLoading(auctionId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auctions/${auctionId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        }
      });

      if (response.ok) {
        alert('Auction closed successfully!');
        fetchAuctions();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to close auction');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  if (loading) {
    return <div className="text-center py-4">Loading auctions...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Auctions</h2>
      
      {auctions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No auctions found. Create your first auction!
        </div>
      ) : (
        auctions.map(product => {
          const auction = product.auction;
          const isActive = auction.status === 'open';
          
          return (
            <div key={auction._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {product.spice} - Grade {product.grade}
                  </h3>
                  <p className="text-gray-600">{product.quantity}kg available</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-sm ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {auction.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Starting Price</div>
                  <div className="font-bold">₹{auction.startingPrice}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Current Bid</div>
                  <div className="font-bold">₹{auction.highestBid || auction.startingPrice}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Bids Count</div>
                  <div className="font-bold">{auction.bidCount || 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Time Left</div>
                  <div className="font-bold">{formatTimeLeft(auction.endTime)}</div>
                </div>
              </div>

              {auction.status === 'closed' && auction.winner && (
                <div className="bg-green-50 p-3 rounded mb-4">
                  <div className="text-sm text-green-600">Winner</div>
                  <div className="font-bold">Final Price: ₹{auction.finalPrice}</div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={`/auction/${product._id}`}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  View Details
                </a>
                
                {isActive && (
                  <button
                    onClick={() => closeAuction(auction._id)}
                    disabled={actionLoading === auction._id}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-200 text-sm"
                  >
                    {actionLoading === auction._id ? 'Closing...' : 'Close Early'}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AuctionManagement;