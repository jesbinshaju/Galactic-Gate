import React, { useEffect } from 'react';
import AuctionPage from './AuctionPage';

export default function BuyerAuctionPage({ productId }) {
  useEffect(() => {
    // Check buyer auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'buyer') {
      window.location.href = '/login';
      return;
    }
  }, []);

  return <AuctionPage productId={productId} />;
}