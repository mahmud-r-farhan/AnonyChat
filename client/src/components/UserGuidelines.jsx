import React, { useEffect } from 'react';

const UserGuidelines = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all animate-scaleIn" 
        role="dialog" 
        aria-labelledby="guidelines-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="guidelines-title" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Guidelines
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-purple-600">Chat Rules</h3>
            <ul className="space-y-2">
              {[
                'Be respectful to others',
                'No spam or harmful content',
                'No personal information sharing',
                'Keep messages under 255 characters',
                'Limited to 2 links per message'
              ].map((rule, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-purple-600">Privacy & Security</h3>
            <ul className="space-y-2">
              {[
                'Messages stored for 30 days',
                'No personal data collection',
                'Stay anonymous for safety'
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default UserGuidelines;