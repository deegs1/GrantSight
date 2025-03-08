'use client';

import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import ProcessingScreen from '@/components/ProcessingScreen';
import OverviewSection from '@/components/OverviewSection';
import OrganizationInfo from '@/components/OrganizationInfo';
import GranteeFilters from '@/components/GranteeFilters';
import GranteeTable from '@/components/GranteeTable';
import GranteeVisualizations from '@/components/GranteeVisualizations';
import ExportOptions from '@/components/ExportOptions';
import Logo from '@/components/Logo';
import LandingHero from '@/components/LandingHero';
import { Foundation, UploadedFile, ProcessingStatus, FilterOptions, Grantee } from '@/types';
import { extract990Data } from '@/lib/pdfUtils';
import { filterGrantees, getUniqueYears, getUniqueStates, getUniquePurposes, getGrantAmountRange } from '@/lib/utils';

export default function Home() {
  // State for file upload
  const [files, setFiles] = useState<UploadedFile[]>([]);
  
  // State for processing
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    totalFiles: 0,
    processedFiles: 0,
    status: 'idle'
  });
  
  // State for foundation data
  const [foundations, setFoundations] = useState<Foundation[]>([]);
  
  // State for combined grantees
  const [allGrantees, setAllGrantees] = useState<Grantee[]>([]);
  
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    years: [],
    states: [],
    amountRange: [0, 0],
    purposes: []
  });
  
  // State for filter options
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availablePurposes, setAvailablePurposes] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 0]);
  
  // State for filtered grantees
  const [filteredGrantees, setFilteredGrantees] = useState<Grantee[]>([]);
  
  // State for application view
  const [view, setView] = useState<'upload' | 'processing' | 'results'>('upload');
  
  // Process files when the analyze button is clicked
  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setProcessingStatus({
      totalFiles: files.length,
      processedFiles: 0,
      status: 'processing'
    });
    
    setView('processing');
    
    try {
      const newFoundations: Foundation[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Update file status to processing
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'processing' } : f
          ));
          
          // Extract data from the PDF
          const foundation = await extract990Data(file.file);
          newFoundations.push(foundation);
          
          // Update file status
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'success' } : f
          ));
        } catch (error) {
          // Update file status on error
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'error', error: 'Failed to process file' } : f
          ));
        }
        
        // Update processing status
        setProcessingStatus(prev => ({
          ...prev,
          processedFiles: prev.processedFiles + 1
        }));
      }
      
      // Set the foundations data
      setFoundations(newFoundations);
      
      // Combine all grantees from all foundations
      const combinedGrantees = newFoundations.flatMap(foundation => 
        foundation.grantees.map(grantee => ({
          ...grantee,
          foundationName: foundation.name
        }))
      );
      
      setAllGrantees(combinedGrantees);
      
      // Set filter options
      const years = getUniqueYears(combinedGrantees);
      const states = getUniqueStates(combinedGrantees);
      const purposes = getUniquePurposes(combinedGrantees);
      const range = getGrantAmountRange(combinedGrantees);
      
      setAvailableYears(years);
      setAvailableStates(states);
      setAvailablePurposes(purposes);
      setAmountRange(range);
      
      // Initialize filters with full range
      setFilters({
        years: [],
        states: [],
        amountRange: range,
        purposes: []
      });
      
      // Set filtered grantees (initially all)
      setFilteredGrantees(combinedGrantees);
      
      // Update processing status
      setProcessingStatus(prev => ({
        ...prev,
        status: 'complete'
      }));
      
      // Switch to results view
      setView('results');
    } catch (error) {
      console.error('Error processing files:', error);
      
      setProcessingStatus({
        ...processingStatus,
        status: 'error',
        error: 'An error occurred while processing the files'
      });
    }
  };
  
  // Cancel processing
  const handleCancelProcessing = () => {
    setProcessingStatus({
      totalFiles: 0,
      processedFiles: 0,
      status: 'idle'
    });
    
    setView('upload');
  };
  
  // Reset to upload view
  const handleReset = () => {
    setFiles([]);
    setFoundations([]);
    setAllGrantees([]);
    setFilteredGrantees([]);
    setProcessingStatus({
      totalFiles: 0,
      processedFiles: 0,
      status: 'idle'
    });
    
    setView('upload');
  };
  
  // Update filtered grantees when filters change
  useEffect(() => {
    setFilteredGrantees(filterGrantees(allGrantees, filters));
  }, [allGrantees, filters]);
  
  // Handle PDF export
  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    // For the MVP, we'll just show an alert
    alert('PDF export functionality would be implemented here');
  };
  
  // Handle email report
  const handleEmailReport = async (email: string) => {
    // In a real implementation, this would send an email
    // For the MVP, we'll just return a promise that resolves after a delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Report would be sent to ${email}`);
        resolve();
      }, 1500);
    });
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          
          {view === 'results' && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
            >
              Upload New Files
            </button>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {view === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <LandingHero />
            
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">
                Upload Your 990 Forms
              </h2>
              
              <FileUpload files={files} setFiles={setFiles} />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={files.length === 0}
                  className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                    files.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Analyze Forms
                </button>
              </div>
            </div>
          </div>
        )}
        
        {view === 'processing' && (
          <ProcessingScreen 
            status={processingStatus} 
            files={files}
            onCancel={handleCancelProcessing} 
          />
        )}
        
        {view === 'results' && (
          <div className="space-y-8">
            {/* Overview Section */}
            <OverviewSection 
              foundations={foundations}
              totalGrantees={allGrantees.length}
              totalGrantAmount={allGrantees.reduce((sum, grantee) => sum + grantee.amount, 0)}
            />
            
            {/* Foundation Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Foundation Information</h2>
              
              <div className="space-y-8">
                {foundations.map((foundation, index) => (
                  <OrganizationInfo 
                    key={index}
                    foundation={foundation}
                  />
                ))}
              </div>
            </div>
            
            {/* Grantee Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Grantee Analysis</h2>
              
              <GranteeFilters 
                years={availableYears}
                states={availableStates}
                purposes={availablePurposes}
                amountRange={amountRange}
                filters={filters}
                setFilters={setFilters}
              />
              
              <div className="mt-8">
                <GranteeVisualizations grantees={filteredGrantees} />
              </div>
              
              <div className="mt-8">
                <GranteeTable grantees={filteredGrantees} />
              </div>
            </div>
            
            {/* Export Options */}
            <ExportOptions 
              onExportPDF={handleExportPDF}
              onEmailReport={handleEmailReport}
            />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-800 font-medium">
            GrantSight &copy; {new Date().getFullYear()} | Analyze foundation 990 forms with ease
          </p>
        </div>
      </footer>
    </main>
  );
}
