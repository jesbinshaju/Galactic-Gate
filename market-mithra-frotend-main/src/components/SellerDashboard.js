import React, { useState, useEffect } from 'react';
import SellerReviews from './SellerReviews';

const SellerDashboard = ({ user }) => {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [closedAuctions, setClosedAuctions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch seller's products and auctions
      const productsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/seller/products?farmerId=${user._id || user.id}`, {
        headers: {
          'x-user-id': user._id || user.id
        }
      });
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        
        const active = products.filter(p => p.auction?.status === 'open');
        const closed = products.filter(p => p.auction?.status === 'closed');
        
        setActiveAuctions(active);
        setClosedAuctions(closed);
      }

      // Fetch notifications
      const notificationsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications?userId=${user._id || user.id}`, {
        headers: {
          'x-user-id': user._id || user.id
        }
      });
      if (notificationsResponse.ok) {
        const notifs = await notificationsResponse.json();
        setNotifications(notifs.slice(0, 5)); // Show latest 5
      }

      // Set trust score from user data
      setTrustScore(user.trustScore || 0);
      setTotalReviews(user.totalReviews || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeAuction = async (auctionId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auctions/${auctionId}/close`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        }
      });
      
      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error closing auction:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-green-700">Seller Dashboard</h1>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-600">
                {trustScore > 0 ? `⭐ ${trustScore.toFixed(1)}` : 'No ratings yet'}
              </div>
              <div className="text-xs text-gray-500">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600">വിൽപ്പനക്കാരുടെ പാനൽ</p>
        <p className="text-center text-xs text-green-600 mt-1">Welcome, {user?.name} from {user?.district}</p>
      </header>

      <div className="p-4 max-w-md mx-auto">
        
        {/* Recent Notifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              {notifications.map((notif) => (
                <div key={notif._id} className={`p-3 border-b last:border-b-0 ${!notif.isRead ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Auctions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Auctions</h2>
          {activeAuctions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No active auctions
            </div>
          ) : (
            <div className="grid gap-4">
              {activeAuctions.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.spice}</h3>
                      <p className="text-gray-600">Quantity: {product.quantity}kg</p>
                      <p className="text-sm text-gray-500">
                        Current bid: ₹{product.auction?.highestBid || product.auction?.startingPrice}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ends: {new Date(product.auction?.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => closeAuction(product.auction._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Close Auction
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Closed Auctions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Closed Auctions</h2>
          {closedAuctions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No closed auctions
            </div>
          ) : (
            <div className="grid gap-4">
              {closedAuctions.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.spice}</h3>
                      <p className="text-gray-600">Quantity: {product.quantity}kg</p>
                      <p className="text-sm text-gray-500">
                        {product.auction?.winner 
                          ? `Sold for: ₹${product.auction.finalPrice}` 
                          : 'No bids received'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.auction?.winner 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.auction?.winner ? 'Sold' : 'Unsold'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Reviews Section */}
        <div className="mt-8">
          <SellerReviews sellerId={user._id} />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;