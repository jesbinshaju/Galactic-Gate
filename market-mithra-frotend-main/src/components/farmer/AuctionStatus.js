import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuctionStatus() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions?sellerId=${user.id}`, {
        headers: { 'x-user-id': user.id }
      });
      setAuctions(response.data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeAuction = async (auctionId) => {
    setClosingId(auctionId);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}/close`,
        {},
        { headers: { 'x-user-id': user.id } }
      );

      showToast('Auction closed successfully!', 'success');
      fetchAuctions(); // Refresh list
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to close auction', 'error');
    } finally {
      setClosingId(null);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Auctions</h1>
          <p className="text-gray-600 mt-1">Track your product auctions and manage closures</p>
        </div>

        <div className="space-y-4">
          {auctions.length > 0 ? (
            auctions.map(auction => (
              <div key={auction._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {auction.productId.spice} - Grade {auction.productId.grade}
                    </h3>
                    <p className="text-gray-600">
                      {auction.productId.quantityKg} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      auction.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {auction.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">Current Bid</div>
                    <div className="text-2xl font-bold text-blue-800">
                      ₹{auction.highestBid || auction.startingPrice}
                    </div>
                    {auction.highestBidder && (
                      <div className="text-xs text-blue-600 mt-1">
                        by {auction.highestBidder.name}
                      </div>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600">End Time</div>
                    <div className="text-lg font-bold text-orange-800">
                      {new Date(auction.endTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      {new Date(auction.endTime).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600">Starting Price</div>
                    <div className="text-lg font-bold text-green-800">
                      ₹{auction.startingPrice}
                    </div>
                  </div>
                </div>

                {auction.status === 'closed' && auction.highestBidder && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-yellow-700 font-medium">Winner</div>
                    <div className="text-lg font-bold text-yellow-800">
                      {auction.highestBidder.name} - ₹{auction.highestBid}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {auction.highestBidder.district}
                    </div>
                  </div>
                )}

                {auction.status === 'active' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => closeAuction(auction._id)}
                      disabled={closingId === auction._id}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {closingId === auction._id ? 'Closing...' : 'Close Auction'}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Auctions Yet</h2>
              <p className="text-gray-600">Your product auctions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}