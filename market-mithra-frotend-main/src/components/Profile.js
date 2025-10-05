import React, { useState } from 'react';

export default function Profile({ user, onLogout, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    district: user?.district || '',
    password: ''
  });
  const [notifications, setNotifications] = useState(user.notifications !== false);
  const [loading, setLoading] = useState(false);

  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onUpdateProfile(updatedUser);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '' }));
        alert('✅ Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Failed to update profile'}`);
      }
    } catch (error) {
      alert('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile/notifications`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify({ notifications: !notifications })
      });

      if (response.ok) {
        setNotifications(!notifications);
        alert(`✅ Notifications ${!notifications ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      alert('❌ Failed to update notification settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-accent-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-neutral-100">
        <div className="max-w-lg mx-auto px-6 py-5">
          <h1 className="text-2xl font-display font-bold text-center text-purple-700">My Profile</h1>
          <p className="text-caption text-center text-neutral-500 mt-1">Manage your account settings</p>
        </div>
      </header>

      <div className="px-6 py-8 max-w-lg mx-auto">
        <div className="card p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mb-4 mx-auto shadow-medium">
              👤
            </div>
            <h2 className="text-heading text-2xl mb-2">{user?.name || 'User'}</h2>
            <p className="text-body">{user?.district || 'Location'}</p>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-subheading">Name:</span>
                <span className="font-medium">{user?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-subheading">Phone:</span>
                <span className="font-medium">{user?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-subheading">District:</span>
                <span className="font-medium">{user?.district || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-subheading">Role:</span>
                <span className="font-medium capitalize bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm">{user?.role || 'guest'}</span>
              </div>
              {user.role === 'farmer' && (
                <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-subheading">Trust Score:</span>
                  <span className="font-medium">{user.trustScore > 0 ? `⭐ ${parseFloat(user.trustScore).toFixed(1)}` : 'No ratings yet'}</span>
                </div>
              )}
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-subheading">Notifications:</span>
                <button
                  onClick={handleNotificationToggle}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notifications 
                      ? 'bg-secondary-100 text-secondary-800 border border-secondary-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {notifications ? '✅ Enabled' : '❌ Disabled'}
                </button>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 btn-accent"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-subheading text-sm mb-3">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-subheading text-sm mb-3">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-subheading text-sm mb-3">District</label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="input-field"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-subheading text-sm mb-3">New Password (Optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-secondary disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : '✅ Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-neutral-500 hover:bg-neutral-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}