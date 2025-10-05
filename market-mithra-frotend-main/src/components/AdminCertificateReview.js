import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCertificateReview() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Check admin auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/certificates`, {
        headers: { 'x-user-id': user.id }
      });
      setCertificates(response.data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewCertificate = async (certId, status, comments = '') => {
    setReviewingId(certId);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/certificates/${certId}`,
        { status, comments },
        { headers: { 'x-user-id': user.id } }
      );

      showToast(`Certificate ${status} successfully!`, 'success');
      fetchCertificates(); // Refresh list
    } catch (error) {
      showToast(error.response?.data?.error || `Failed to ${status} certificate`, 'error');
    } finally {
      setReviewingId(null);
    }
  };

  const formatPrice = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (value && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    if (value && typeof value.toString === "function") {
      return parseFloat(value.toString());
    }
    return 0;
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Certificate Review</h1>
          <p className="text-gray-600 mt-1">Review and approve quality certificates from farmers</p>
        </div>

        <div className="space-y-4">
          {certificates.length > 0 ? (
            certificates.map(cert => (
              <div key={cert._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {cert.productId.spice} - Grade {cert.productId.grade}
                    </h3>
                    <p className="text-gray-600">
                      {formatPrice(cert.productId.quantityKg)} kg • ₹{formatPrice(cert.productId.calculatedTotal)} total value
                    </p>
                    <p className="text-sm text-gray-500">
                      by {cert.uploadedBy.name} from {cert.uploadedBy.district}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Uploaded</div>
                    <div className="font-medium">{new Date(cert.uploadedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Certificate File:</div>
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📎 View Certificate
                  </a>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => reviewCertificate(cert._id, 'approved')}
                    disabled={reviewingId === cert._id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {reviewingId === cert._id ? 'Processing...' : '✅ Approve'}
                  </button>
                  
                  <button
                    onClick={() => reviewCertificate(cert._id, 'rejected', 'Quality standards not met')}
                    disabled={reviewingId === cert._id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {reviewingId === cert._id ? 'Processing...' : '❌ Reject'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pending Certificates</h2>
              <p className="text-gray-600">All certificates have been reviewed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}