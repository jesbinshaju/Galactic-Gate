import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    market: 'Market Prices',
    auctions: 'Auctions',
    sell: 'Sell',
    buy: 'Buy',
    prices: 'Prices',
    alerts: 'Alerts',
    profile: 'Profile',
    dashboard: 'Dashboard',
    
    // Common
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    price: 'Price',
    quantity: 'Quantity',
    location: 'Location',
    farmer: 'Farmer',
    available: 'Available',
    
    // Buyer Panel
    buySpices: 'Buy Spices',
    buyerPanel: 'Buyer Panel',
    directBuy: 'Direct Buy',
    searchSpices: 'Search Spices',
    lowPrice: 'Low Price',
    highQuantity: 'High Quantity',
    noSpicesFound: 'No spices found',
    loadingListings: 'Loading listings...',
    call: 'Call',
    order: 'Order',
    
    // Spices
    pepper: 'Astroids',
    cardamom: 'Lunar Vehicles',
    clove: 'Lunar Particlea',
    nutmeg: 'Space Suits',
    cinnamon: 'Space Scraps',
    vanilla: 'Astronaut Autographs'
  },
  
 /* ml: {
    // Navigation
    home: 'ഹോം',
    market: 'വിപണി വില',
    auctions: 'ലേലം',
    sell: 'വിൽക്കുക',
    buy: 'വാങ്ങുക',
    prices: 'വില',
    alerts: 'അലേർട്ട്',
    profile: 'പ്രൊഫൈൽ',
    dashboard: 'ഡാഷ്ബോർഡ്',
    
    // Common
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    search: 'തിരയുക',
    filter: 'ഫിൽട്ടർ',
    all: 'എല്ലാം',
    price: 'വില',
    quantity: 'അളവ്',
    location: 'സ്ഥലം',
    farmer: 'കർഷകൻ',
    available: 'ലഭ്യമാണ്',
    
    // Buyer Panel
    buySpices: 'മസാല വാങ്ങുക',
    buyerPanel: 'വാങ്ങുന്നവരുടെ പാനൽ',
    directBuy: 'നേരിട്ട് വാങ്ങുക',
    searchSpices: 'മസാല തിരയുക',
    lowPrice: 'കുറഞ്ഞ വില',
    highQuantity: 'കൂടുതൽ അളവ്',
    noSpicesFound: 'മസാലകൾ കണ്ടെത്തിയില്ല',
    loadingListings: 'ലിസ്റ്റിംഗുകൾ ലോഡ് ചെയ്യുന്നു...',
    call: 'വിളിക്കുക',
    order: 'ഓർഡർ',
    
    // Spices
    pepper: 'കുരുമുളക്',
    cardamom: 'ഏലം',
    clove: 'ഗ്രാമ്പൂ',
    nutmeg: 'ജാതിക്ക',
    cinnamon: 'കറുവപ്പട്ട',
    vanilla: 'വനില'
  }*/
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};