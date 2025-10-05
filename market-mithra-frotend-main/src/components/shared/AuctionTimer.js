import React, { useState, useEffect } from 'react';

// Countdown timer component for auctions
// Shows time remaining with color-coded urgency
const AuctionTimer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
    
    return () => clearInterval(timer);
  }, [endTime]);

  const updateTimer = () => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      setTimeLeft('Ended');
      onExpire?.();
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Mark as urgent if less than 1 hour left
    setIsUrgent(difference < 60 * 60 * 1000);

    if (days > 0) {
      setTimeLeft(`${days}d ${hours}h`);
    } else if (hours > 0) {
      setTimeLeft(`${hours}h ${minutes}m`);
    } else {
      setTimeLeft(`${minutes}m ${seconds}s`);
    }
  };

  return (
    <div className={`text-sm font-medium ${
      timeLeft === 'Ended' 
        ? 'text-gray-500' 
        : isUrgent 
          ? 'text-red-600 animate-pulse' 
          : 'text-orange-600'
    }`}>
      {timeLeft === 'Ended' ? '⏰ Ended' : `⏱️ ${timeLeft}`}
    </div>
  );
};

export default AuctionTimer;