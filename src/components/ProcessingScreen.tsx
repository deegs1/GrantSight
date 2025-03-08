'use client';

import React from 'react';
import { ProcessingStatus, UploadedFile } from '@/types';

interface ProcessingScreenProps {
  status: ProcessingStatus;
  files: UploadedFile[];
  onCancel: () => void;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ status, files, onCancel }) => {
  const progress = status.totalFiles > 0 
    ? (status.processedFiles / status.totalFiles) * 100 
    : 0;
  
  const facts = [
    "Did you know? The IRS Form 990 was first introduced in 1941.",
    "Private foundations distribute approximately $80 billion in grants annually.",
    "The largest U.S. foundation is the Bill & Melinda Gates Foundation.",
    "Form 990s became publicly available online starting in 2016.",
    "About 1.5 million nonprofit organizations file some version of Form 990 each year.",
    "The 990-PF is specifically for private foundations, while 990-N is for small organizations.",
    "Foundations with assets less than $500,000 can file a simplified 990-EZ form.",
    "The IRS processes over 1.5 million tax-exempt returns annually.",
    "The average processing time for a 990 form is about 60 days.",
    "Digital filing of 990 forms became mandatory for most organizations in 2020."
  ];
  
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  
  // Calculate estimated time based on remaining files
  const remainingFiles = status.totalFiles - status.processedFiles;
  const estimatedSecondsPerFile = 30; // Estimate based on OCR and LLM processing
  const estimatedTimeRemaining = remainingFiles * estimatedSecondsPerFile;
  
  // Format the estimated time
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">
        Processing Your Documents
      </h2>
      
      <div className="h-4 bg-gray-200 rounded-full mb-4">
        <div 
          className="h-4 bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-lg font-medium text-gray-800 mb-2">
        {status.processedFiles} of {status.totalFiles} files processed
      </p>
      
      <p className="text-gray-800 mb-6">
        Estimated time remaining: {formatTime(estimatedTimeRemaining)}
      </p>
      
      {/* File processing status */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-800 mb-3">Processing Details</h3>
        <div className="space-y-2 text-left">
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <div className="truncate max-w-xs">
                  <p className="text-gray-800 font-medium truncate">{file.file.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                {file.status === 'pending' && (
                  <span className="text-gray-600">Pending</span>
                )}
                {file.status === 'processing' && (
                  <span className="text-blue-600 flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                )}
                {file.status === 'success' && (
                  <span className="text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="text-red-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Error
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <p className="text-gray-800 italic">
          "{randomFact}"
        </p>
      </div>
      
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default ProcessingScreen; 