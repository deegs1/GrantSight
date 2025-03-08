'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import LoadingSpinner from './LoadingSpinner';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    if (!numPages) return;
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages, newPageNumber));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<LoadingSpinner size="lg" className="my-12" />}
        error={<p className="text-red-600 my-12">Failed to load PDF. The file may be corrupted.</p>}
      >
        <Page 
          pageNumber={pageNumber} 
          scale={1.2}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>
      
      {numPages && numPages > 1 && (
        <div className="p-4 border-t w-full flex items-center justify-between mt-4">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={`px-3 py-1 rounded ${pageNumber <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Previous
          </button>
          
          <p className="text-gray-700">
            Page {pageNumber} of {numPages}
          </p>
          
          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className={`px-3 py-1 rounded ${pageNumber >= (numPages || 1) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer; 