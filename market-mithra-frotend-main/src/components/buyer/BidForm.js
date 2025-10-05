import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Reusable bid form component for buyers only
// Connects to POST /api/auctions/:id/bid and GET /api/admin/market-rates
const BidForm = ({ auctionId, onBidPlaced, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    spiceType: initialData.spiceType || '',
    quantity: initialData.quantity || '',
    grade: initialData.grade || '',
    bidAmount: '',
    certificate: null
  });
  const [spices, setSpices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const grades = [
    { value: 'A', label: 'Grade A (Premium)' },
    { value: 'B', label: 'Grade B (Standard)' },
    { value: 'C', label: 'Grade C (Basic)' }
  ];

  useEffect(() => {
    fetchSpices();
  }, []);

  // Fetch available spice types from market rates
  const fetchSpices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/market-rates`, {
        headers: { 'x-user-id': user._id || user.id }
      });
      setSpices(response.data);
    } catch (error) {
      console.error('Failed to fetch spices:', error);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.spiceType) newErrors.spiceType = 'Spice type is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.bidAmount || formData.bidAmount <= 0) newErrors.bidAmount = 'Valid bid amount is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit bid to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // No role check for prototype

      await axios.post(`${process.env.REACT_APP_API_URL}/api/auctions/${auctionId}/bid`, {
        amount: parseFloat(formData.bidAmount),
        spiceType: formData.spiceType,
        quantity: parseFloat(formData.quantity),
        grade: formData.grade
      }, {
        headers: { 'x-user-id': user._id || user.id }
      });

      alert('Bid placed successfully!');
      onBidPlaced?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Place Your Bid</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spice Type *
          </label>
          <select
            value={formData.spiceType}
            onChange={(e) => setFormData(prev => ({ ...prev, spiceType: e.target.value }))}
            className={`w-full p-3 border rounded-lg ${errors.spiceType ? 'border-red-500' : 'border-gray-300'}`}
            disabled={initialData.spiceType}
          >
            <option value="">Select spice type</option>
            {spices.map(spice => (
              <option key={spice.spice} value={spice.spice}>
                {spice.spice.charAt(0).toUpperCase() + spice.spice.slice(1)}
              </option>
            ))}
          </select>
          {errors.spiceType && <p className="text-red-500 text-sm mt-1">{errors.spiceType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity (kg) *
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className={`w-full p-3 border rounded-lg ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter quantity in kg"
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade *
          </label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
            className={`w-full p-3 border rounded-lg ${errors.grade ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select grade</option>
            {grades.map(grade => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
          {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bid Amount (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.bidAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, bidAmount: e.target.value }))}
            className={`w-full p-3 border rounded-lg ${errors.bidAmount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your bid amount"
          />
          {errors.bidAmount && <p className="text-red-500 text-sm mt-1">{errors.bidAmount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFormData(prev => ({ ...prev, certificate: e.target.files[0] }))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Upload quality certificates (PDF, JPG, PNG)</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;