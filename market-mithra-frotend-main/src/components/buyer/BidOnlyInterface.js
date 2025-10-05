import React, { useState, useEffect } from 'react';
import BidForm from './BidForm';
import AuctionCard from './AuctionCard';

// Bid-only interface for buyers - removes sell options, focuses on bidding
// Integrates BidForm component with auction listings
const BidOnlyInterface = ({ user }) => {
  const [auctions, setAuctions] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Fetch available auctions for bidding
  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auctions`, {
        headers: { 'x-user-id': user._id || user.id }
      });
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.filter(auction => auction.status === 'open'));
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bid placement success
  const handleBidPlaced = () => {
    setShowBidForm(false);
    setSelectedAuction(null);
    fetchAuctions(); // Refresh auction data
  };

  // Open bid form for specific auction
  const openBidForm = (auction) => {
    setSelectedAuction(auction);
    setShowBidForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Auctions</h1>
          <p className="text-gray-600">Place bids on spice auctions from verified farmers</p>
        </div>

        {auctions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500 mb-4">🔨</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auctions</h3>
            <p className="text-gray-600">Check back later for new spice auctions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {auctions.map((auction) => (
              <div key={auction._id} className="relative">
                <AuctionCard 
                  auction={auction} 
                  onBidPlaced={fetchAuctions}
                  showQuickBid={true}
                />
                <button
                  onClick={() => openBidForm(auction)}
                  className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  📝 Detailed Bid
                </button>
              </div>
            ))}
          </div>
        )}

        {showBidForm && selectedAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <BidForm
                auctionId={selectedAuction._id}
                initialData={{
                  spiceType: selectedAuction.productId?.spice,
                  quantity: selectedAuction.productId?.quantity
                }}
                onBidPlaced={handleBidPlaced}
                onCancel={() => {
                  setShowBidForm(false);
                  setSelectedAuction(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidOnlyInterface;