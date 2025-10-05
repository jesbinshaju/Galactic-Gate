import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuctionCard from './buyer/AuctionCard';
import AuctionFilters from './buyer/AuctionFilters';

export default function AuctionsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For now, we'll simulate getting products that could have auctions
      // In a real app, you'd have an endpoint to get all active auctions
      setProducts([
        {
          _id: '1',
          spice: 'cardamom',
          grade: 'A',
          quantityKg: 5,
          calculatedTotal: 5400,
          sellerId: { name: 'Test Farmer', district: 'Idukki' }
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
        <div className="text-xl">Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
          <p className="text-gray-600 mt-1">Bid on premium spices from local farmers</p>
        </div>

        <AuctionFilters onFiltersChange={(filters) => console.log('Filters:', filters)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const mockAuction = {
              _id: product._id,
              productId: product,
              startingPrice: Math.round(formatPrice(product.calculatedTotal) * 0.85),
              highestBid: null,
              endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              status: 'open',
              bidCount: 0
            };
            
            return (
              <AuctionCard
                key={product._id}
                auction={mockAuction}
                onBidPlaced={() => fetchProducts()}
              />
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Auctions</h2>
            <p className="text-gray-600">Check back later for new auction listings</p>
          </div>
        )}
      </div>
    </div>
  );
}