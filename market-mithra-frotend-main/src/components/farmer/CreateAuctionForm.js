import React, { useState, useEffect } from 'react';

// Professional form to create new auctions from farmer's products
// Connects to POST /api/auctions endpoint
const CreateAuctionForm = ({ user, onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    spice: '',
    grade: '',
    quantity: '',
    startingPrice: '',
    duration: 7, // days
    certificate: null
  });

  const spices = [
    { value: 'pepper', label: 'Astroids' },
    { value: 'cardamom', label: 'Lunar Vehicle' },
    { value: 'clove', label: 'Lunar Particles' },
    { value: 'nutmeg', label: 'Space Suit' },
    { value: 'cinnamon', label: 'Space Rocket-Scraps' },
    { value: 'vanilla', label: 'Astronomer autograph' }
  ];

  const grades = [
    { value: 'A', label: 'Grade A (Premium)' },
    { value: 'B', label: 'Grade B (Standard)' },
    { value: 'C', label: 'Grade C (Basic)' }
  ];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/seller/products`, {
        headers: { 'x-user-id': user._id || user.id }
      });
      if (response.ok) {
        const data = await response.json();
        // Only show products without active auctions
        setProducts(data.filter(p => !p.auction || p.auction.status === 'closed'));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://galactic-gate.onrender.com'}/api/auctions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user._id || user.id
        },
        body: JSON.stringify({
          spice: formData.spice,
          grade: formData.grade,
          quantity: parseFloat(formData.quantity),
          startingPrice: parseFloat(formData.startingPrice),
          duration: formData.duration * 24 * 60 * 60 * 1000, // Convert days to ms
          hasCertificate: !!formData.certificate
        })
      });

      if (response.ok) {
        alert('Auction created successfully!');
        onSuccess?.();
        onClose?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create auction');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.productId);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-strong border border-neutral-100">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌿</div>
          <h2 className="text-heading text-2xl mb-2">Create New Auction</h2>
          <p className="text-body">List your spices for competitive bidding</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-subheading text-sm mb-3">Select Spice</label>
            <select
              value={formData.spice}
              onChange={(e) => setFormData(prev => ({ ...prev, spice: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Choose a spice...</option>
              {spices.map(spice => (
                <option key={spice.value} value={spice.value}>
                  {spice.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Select Grade</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Choose grade...</option>
              {grades.map(grade => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Quantity (kg)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="input-field"
              placeholder="Enter quantity in kg"
              required
            />
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Starting Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.startingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: e.target.value }))}
              className="input-field"
              placeholder="Enter starting price"
              required
            />
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Auction Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="input-field"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days (Recommended)</option>
              <option value={14}>14 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-subheading text-sm mb-3">Quality Certificate (Optional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData(prev => ({ ...prev, certificate: e.target.files[0] }))}
              className="input-field"
            />
            <p className="text-caption mt-2">Upload quality certificate to increase buyer trust</p>
            {formData.certificate && (
              <div className="mt-2 p-2 bg-secondary-50 rounded-lg border border-secondary-200">
                <p className="text-sm text-secondary-700">📄 {formData.certificate.name}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-secondary disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionForm;