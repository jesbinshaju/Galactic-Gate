import React, { useState } from 'react';
import axios from 'axios';

export default function SellerCertificateUpload({ productId, onUploadSuccess }) {
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.role !== 'farmer') {
        showToast('Only farmers can upload certificates', 'error');
        return;
      }

      if (!fileUrl.trim()) {
        showToast('Please enter a valid file URL', 'error');
        return;
      }

      // Validate file type
      const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
      const fileExtension = fileUrl.toLowerCase().substring(fileUrl.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        showToast('Invalid file type. Only PDF, JPG, and PNG files are allowed', 'error');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/seller/products/${productId}/certificate`,
        { fileUrl: fileUrl.trim() },
        { headers: { 'x-user-id': user.id } }
      );

      showToast('Certificate uploaded successfully! Pending admin review.', 'success');
      setFileUrl('');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to upload certificate', 'error');
    } finally {
      setUploading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">📜</span>
        <h3 className="font-bold text-blue-800">Upload Quality Certificate</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-4">
        Upload quality certificates to increase buyer trust and product visibility.
      </p>

      <form onSubmit={handleUpload} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Certificate File URL
          </label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="https://example.com/certificate.pdf"
            required
          />
          <p className="text-xs text-blue-600 mt-1">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded font-medium text-sm transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </button>
      </form>
    </div>
  );
}