import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check buyer auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'buyer') {
      window.location.href = '/login';
      return;
    }
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auction/user/${user.id}`);
      setBids(response.data);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your bids...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
          <p className="text-gray-600 mt-1">Track all your auction bids</p>
        </div>

        <div className="space-y-4">
          {bids.length > 0 ? (
            bids.map(bid => (
              <div key={bid._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {bid.auctionId.productId.spice} - Grade {bid.auctionId.productId.grade}
                    </h3>
                    <p className="text-gray-600">
                      {formatPrice(bid.auctionId.productId.quantityKg)} kg available
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{formatPrice(bid.amount)}
                    </div>
                    <div className="text-sm text-gray-500">Your bid</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Product Value</div>
                    <div className="font-bold">₹{formatPrice(bid.auctionId.productId.calculatedTotal)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Bid Placed</div>
                    <div className="font-bold">{new Date(bid.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Auction Status: <span className="font-medium capitalize">{bid.auctionId.status}</span>
                  </div>
                  <a
                    href={`/buyer/auction/${bid.auctionId.productId._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    View Auction
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bids Yet</h2>
              <p className="text-gray-600 mb-4">Start bidding on auctions to see them here</p>
              <a
                href="/auctions"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Auctions
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}