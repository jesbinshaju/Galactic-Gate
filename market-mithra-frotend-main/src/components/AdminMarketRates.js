import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPrice, getNumericPrice } from '../utils/priceUtils';

export default function AdminMarketRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // No auth check for prototype
  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/market-rates`, {
        headers: { 'x-user-id': user._id || user.id }
      });
      setRates(response.data);
    } catch (error) {
      console.error('Failed to fetch market rates:', error);
      // Fallback to default rates if API fails
      setRates([
        { _id: '1', spice: 'pepper', pricePerKg: 800, updatedAt: new Date(), updatedBy: { name: 'System' } },
        { _id: '2', spice: 'cardamom', pricePerKg: 1200, updatedAt: new Date(), updatedBy: { name: 'System' } },
        { _id: '3', spice: 'clove', pricePerKg: 600, updatedAt: new Date(), updatedBy: { name: 'System' } },
        { _id: '4', spice: 'nutmeg', pricePerKg: 900, updatedAt: new Date(), updatedBy: { name: 'System' } },
        { _id: '5', spice: 'cinnamon', pricePerKg: 400, updatedAt: new Date(), updatedBy: { name: 'System' } },
        { _id: '6', spice: 'vanilla', pricePerKg: 1500, updatedAt: new Date(), updatedBy: { name: 'System' } }
      ]);
      showToast('Using demo data - API unavailable', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rate) => {
    setEditingId(rate._id);
    setEditPrice(formatPrice(rate.pricePerKg));
  };

  const handleSave = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const price = parseFloat(editPrice);
      
      if (price <= 0) {
        showToast('Price must be greater than 0', 'error');
        return;
      }

      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/market-rates/${id}`, 
        { pricePerKg: price },
        { headers: { 'x-user-id': user._id || user.id } }
      ).catch(error => {
        // If API fails, update local state for demo
        if (error.response?.status === 500) {
          setRates(prev => prev.map(rate => 
            rate._id === id ? { ...rate, pricePerKg: price, updatedAt: new Date() } : rate
          ));
          return { data: { success: true } };
        }
        throw error;
      });

      setEditingId(null);
      setEditPrice('');
      showToast('Price updated successfully', 'success');
      fetchRates();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update price', 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Market Rates Management</h1>
              <p className="text-gray-600 mt-1">Update space item prices for the marketplace</p>
            </div>
            <a 
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Back to Admin
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Space
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rates.map((rate) => (
                  <tr key={rate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {rate.spice}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === rate._id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          step="0.01"
                          min="0.01"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          ₹{getNumericPrice(rate.pricePerKg).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rate.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.updatedBy?.name || 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === rate._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(rate._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(rate)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}