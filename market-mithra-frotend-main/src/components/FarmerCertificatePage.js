import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SellerCertificateUpload from './SellerCertificateUpload';

export default function FarmerCertificatePage() {
  const { productId } = useParams();

  useEffect(() => {
    // Check farmer auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'farmer') {
      window.location.href = '/login';
      return;
    }
  }, []);

  const handleUploadSuccess = () => {
    // Redirect back to farmer dashboard or show success message
    window.location.href = '/farmer';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Certificate</h1>
          <p className="text-gray-600 mt-1">Add quality certificates to increase buyer trust</p>
        </div>

        <SellerCertificateUpload 
          productId={productId} 
          onUploadSuccess={handleUploadSuccess}
        />

        <div className="mt-6">
          <a
            href="/farmer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}