'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadedFile } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { UPLOAD_CONFIG } from '@/lib/config';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components with no SSR
const PDFViewer = dynamic(() => import('./PDFViewer'), { 
  ssr: false,
  loading: () => <LoadingSpinner size="lg" className="my-12" />
});

interface FileUploadProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [setFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: UPLOAD_CONFIG.maxFiles,
    maxSize: UPLOAD_CONFIG.maxFileSize,
  });
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setIsPreviewOpen(false);
    }
  };

  const openPreview = (file: UploadedFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  
  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-500 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          
          <p className="text-lg font-medium text-gray-800 mb-1">
            Drag & drop 990 PDF files here
          </p>
          <p className="text-gray-800">
            or click to select files
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Maximum {UPLOAD_CONFIG.maxFiles} files, {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB each
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Uploaded Files</h3>
          
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <div>
                    <p className="text-gray-800 font-medium">{file.file.name}</p>
                    <p className="text-sm text-gray-700">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => openPreview(file)}
                    className="text-gray-700 hover:text-blue-600"
                    title="Preview PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="text-gray-700 hover:text-red-600"
                    title="Remove file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {isPreviewOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900 truncate max-w-md">
                {selectedFile.file.name}
              </h3>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex justify-center">
              <PDFViewer file={selectedFile.file} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 