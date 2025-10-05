import React from 'react';

export default function Contact() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:marketmithra123@gmail.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-blue-700 text-center">Contact Us</h1>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Get in Touch */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
            Have questions, suggestions, or partnership ideas?<br />
            We'd love to hear from you! Connect with us anytime.
          </p>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Contact Details</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl">📧</div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-blue-700 mb-1">Email</h4>
                <button 
                  onClick={handleEmailClick}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  marketmithra123@gmail.com
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="text-3xl">📍</div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-700 mb-1">Location</h4>
                <p className="text-gray-700">Kothamangalam, Kerala, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Quick Contact</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleEmailClick}
              className="flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
            >
              <span className="text-xl">📧</span>
              Send Email
            </button>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">🤝</div>
              <h4 className="font-bold text-gray-700 mb-2">Partnership Inquiries</h4>
              <p className="text-sm text-gray-600">
                Interested in partnering with Market Mithra? 
                <br />Email us your proposal!
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">💡</div>
              <h4 className="font-bold text-gray-700 mb-2">Suggestions & Feedback</h4>
              <p className="text-sm text-gray-600">
                Help us improve! Share your ideas and feedback
                <br />to make Market Mithra better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}