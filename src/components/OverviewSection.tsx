'use client';

import React from 'react';
import { Foundation } from '@/types';

interface OverviewSectionProps {
  foundations: Foundation[];
  totalGrantees: number;
  totalGrantAmount: number;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  foundations, 
  totalGrantees, 
  totalGrantAmount 
}) => {
  // Calculate total assets and giving across all foundations
  const totalAssets = foundations.reduce((sum, foundation) => sum + foundation.totalAssets, 0);
  const totalGiving = foundations.reduce((sum, foundation) => sum + foundation.totalGiving, 0);
  
  // Calculate average grant amount
  const averageGrantAmount = totalGrantAmount / totalGrantees;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800">Total Assets</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(totalAssets)}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800">Total Giving</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalGiving)}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-800">Number of Grantees</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{totalGrantees}</p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800">Average Grant Size</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{formatCurrency(averageGrantAmount)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-gray-700">
          Analyzed {foundations.length} foundation{foundations.length !== 1 ? 's' : ''} with a total of {totalGrantees} grants worth {formatCurrency(totalGrantAmount)}.
        </p>
      </div>
    </div>
  );
};

export default OverviewSection; 