import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = ({ user }) => {
  const location = useLocation();
  
  // Don't show navbar on home page
  if (location.pathname === '/') {
    return null;
  }

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', activeColor: 'text-primary-600', hoverColor: 'hover:text-primary-600', bgColor: 'bg-primary-50' },
    { path: '/farmer', icon: '', label: 'Sell Space Stuff', activeColor: 'text-secondary-600', hoverColor: 'hover:text-secondary-600', bgColor: 'bg-secondary-50' },
    { path: '/buyer', icon: '', label: 'Buy Space Stuff', activeColor: 'text-accent-600', hoverColor: 'hover:text-accent-600', bgColor: 'bg-accent-50' },
    { path: '/market', icon: '', label: 'Current Market Price Trend', activeColor: 'text-primary-600', hoverColor: 'hover:text-primary-600', bgColor: 'bg-primary-50' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-neutral-200 z-50 shadow-strong">
      <div className="flex justify-around items-center py-1 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[50px] ${
                isActive 
                  ? `${item.activeColor} ${item.bgColor} shadow-soft` 
                  : `text-neutral-500 ${item.hoverColor} hover:bg-neutral-50`
              }`}
            >
              <span className={`text-lg mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <div className="flex flex-col items-center p-2 rounded-lg min-w-[50px]">
          <div className="mb-0.5">
            <NotificationBell user={user} />
          </div>
          <span className="text-xs font-medium text-neutral-500">Alerts</span>
        </div>
        
        {user?.role === 'admin' && (
          <Link 
            to="/admin" 
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[50px] ${
              location.pathname.startsWith('/admin') 
                ? 'text-red-600 bg-red-50 shadow-soft' 
                : 'text-neutral-500 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <span className={`text-lg mb-0.5 transition-transform duration-200 ${location.pathname.startsWith('/admin') ? 'scale-110' : 'hover:scale-105'}`}>
              ⚙️
            </span>
            <span className="text-xs font-medium">Admin</span>
          </Link>
        )}
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[50px] ${
            location.pathname === '/profile' 
              ? 'text-purple-600 bg-purple-50 shadow-soft' 
              : 'text-neutral-500 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          <span className={`text-lg mb-0.5 transition-transform duration-200 ${location.pathname === '/profile' ? 'scale-110' : 'hover:scale-105'}`}>
            👤
          </span>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;