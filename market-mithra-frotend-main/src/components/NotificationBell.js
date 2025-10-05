import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ user }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Disabled for prototype
    setUnreadCount(0);
  }, [user]);

  const fetchUnreadCount = async () => {
    // Disabled for prototype
    setUnreadCount(0);
  };

  const handleClick = () => {
    navigate('/notifications');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-3.5-3.5a50.002 50.002 0 00-2.5-2.5V9a6 6 0 10-12 0v1.5c0 .9-.4 1.8-1 2.5L1 17h5m9 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;