import React, { useState } from 'react';

export default function Login() {
  const [credentials, setCredentials] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For testing: accept admin/admin123 or any credentials
      if ((credentials.phone === 'admin' && credentials.password === 'admin123') || 
          credentials.phone.length > 0) {
        const adminUser = {
          id: '68aa16251f9d2149c2f60e43',
          name: 'Test Admin',
          phone: credentials.phone,
          role: 'admin'
        };

        localStorage.setItem('user', JSON.stringify(adminUser));
        window.location.href = '/admin';
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-6">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-heading text-3xl mb-2">Admin Login</h1>
          <p className="text-body">Access the admin dashboard</p>
        </div>
        
        <div className="bg-accent-50 border border-accent-200 p-4 rounded-xl mb-6 text-sm">
          <p className="text-accent-700 font-medium mb-2">💡 Test Credentials:</p>
          <div className="space-y-1 text-accent-600">
            <div>Phone: <code className="bg-accent-100 px-2 py-1 rounded font-mono">admin</code></div>
            <div>Password: <code className="bg-accent-100 px-2 py-1 rounded font-mono">admin123</code></div>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-subheading text-sm mb-3">Phone Number</label>
            <input
              type="tel"
              required
              value={credentials.phone}
              onChange={(e) => setCredentials(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field"
              placeholder="+91 9999999999"
            />
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="input-field"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-accent disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}