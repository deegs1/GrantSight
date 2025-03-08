import React, { useState } from 'react';
import { EnvelopeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportOptionsProps {
  onExportPDF: () => void;
  onEmailReport: (email: string) => Promise<void>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExportPDF, onEmailReport }) => {
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setEmailStatus('sending');
    setErrorMessage('');
    
    try {
      await onEmailReport(email);
      setEmailStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setEmailStatus('idle');
        setShowEmailForm(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      setEmailStatus('error');
      setErrorMessage('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-end space-y-2 md:space-y-0 md:space-x-4">
      <button
        onClick={() => setShowEmailForm(!showEmailForm)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <EnvelopeIcon className="h-5 w-5 mr-2" />
        Email Report
      </button>
      
      <button
        onClick={onExportPDF}
        className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Download PDF
      </button>
      
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Email Report</h3>
            
            {emailStatus === 'success' ? (
              <div className="text-green-600 mb-4">
                Report sent successfully!
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                  {errorMessage && (
                    <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  We don't store your email address after sending the report.
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {emailStatus === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions; 