import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './components/Home';
import Market from './components/Market';
import FarmerPanel from './components/FarmerPanel';
import BuyerPanel from './components/BuyerPanel';
import AdminPanel from './components/AdminPanel';
import AdminMarketRates from './components/AdminMarketRates';
import SellerProductForm from './components/SellerProductForm';
import AuctionPage from './components/AuctionPage';
import AuctionsList from './components/AuctionsList';
import MyBids from './components/MyBids';
import BuyerAuctionPage from './components/BuyerAuctionPage';
import AdminCertificateReview from './components/AdminCertificateReview';
import FarmerCertificatePage from './components/FarmerCertificatePage';
import Login from './components/Login';
import Auth from './components/Auth';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import NotificationsPage from './components/NotificationsPage';
import BuyerDashboard from './components/BuyerDashboard';
import SellerDashboard from './components/SellerDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

// Wrapper component to handle route params
function AuctionPageWrapper() {
  const { productId } = useParams();
  return <AuctionPage productId={productId} />;
}

// Buyer auction wrapper
function BuyerAuctionPageWrapper() {
  const { productId } = useParams();
  return <BuyerAuctionPage productId={productId} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Navbar user={user || { role: 'buyer' }} />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/farmer" element={<FarmerPanel user={user || { role: 'farmer' }} />} />
          <Route path="/farmer/dashboard" element={<SellerDashboard user={user || { role: 'farmer' }} />} />
          <Route path="/buyer" element={<BuyerPanel />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard user={user || { role: 'buyer' }} />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/market-rates" element={<AdminMarketRates />} />
          <Route path="/admin/certificates" element={<AdminCertificateReview />} />
          <Route path="/farmer/direct-sell" element={<SellerProductForm />} />
          <Route path="/farmer/product/:productId/certificate" element={<FarmerCertificatePage />} />
          <Route path="/auctions" element={<AuctionsList />} />
          <Route path="/auction/:productId" element={<AuctionPageWrapper />} />
          <Route path="/buyer/auction/:productId" element={<BuyerAuctionPageWrapper />} />
          <Route path="/buyer/my-bids" element={<MyBids />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile user={user || {}} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />} />
          <Route path="/notifications" element={<NotificationsPage user={user || {}} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;