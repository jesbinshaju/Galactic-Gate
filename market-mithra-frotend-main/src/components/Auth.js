import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        alert(`✅ ${isLogin ? 'Login' : 'Signup'} successful!`);
      } else {
        alert(`❌ ${data.error || 'Authentication failed'}`);
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-700">Market Mithra</h1>
          <p className="text-gray-600 mt-2">{isLogin ? 'Welcome Back' : 'Join Us Today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border rounded-lg text-lg"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="+91 9876543210"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">District</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full p-3 border rounded-lg text-lg"
              >
                <option value="">Select your district</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-lg font-bold text-lg"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:text-green-700 font-medium block w-full"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
          
          {/* Quick Test Login */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500 mb-2">Quick Test Login:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const testFarmer = { _id: 'test-farmer', id: 'test-farmer', name: 'Test Farmer', role: 'farmer', district: 'Idukki' };
                  localStorage.setItem('user', JSON.stringify(testFarmer));
                  onLogin(testFarmer);
                }}
                className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm"
              >
                Farmer
              </button>
              <button
                onClick={() => {
                  const testBuyer = { _id: 'test-buyer', id: 'test-buyer', name: 'Test Buyer', role: 'buyer', district: 'Kottayam' };
                  localStorage.setItem('user', JSON.stringify(testBuyer));
                  onLogin(testBuyer);
                }}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm"
              >
                Buyer
              </button>
              <button
                onClick={() => {
                  const testAdmin = { _id: 'test-admin', id: 'test-admin', name: 'Test Admin', role: 'admin', district: 'Admin' };
                  localStorage.setItem('user', JSON.stringify(testAdmin));
                  onLogin(testAdmin);
                }}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}