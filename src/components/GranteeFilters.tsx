'use client';

import React, { useState } from 'react';
import { FilterOptions } from '@/types';

interface GranteeFiltersProps {
  years: number[];
  states: string[];
  purposes: string[];
  amountRange: [number, number];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const GranteeFilters: React.FC<GranteeFiltersProps> = ({
  years,
  states,
  purposes,
  amountRange,
  filters,
  setFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Toggle a year filter
  const toggleYear = (year: number) => {
    setFilters(prev => {
      if (prev.years.includes(year)) {
        return {
          ...prev,
          years: prev.years.filter(y => y !== year)
        };
      } else {
        return {
          ...prev,
          years: [...prev.years, year]
        };
      }
    });
  };
  
  // Toggle a state filter
  const toggleState = (state: string) => {
    setFilters(prev => {
      if (prev.states.includes(state)) {
        return {
          ...prev,
          states: prev.states.filter(s => s !== state)
        };
      } else {
        return {
          ...prev,
          states: [...prev.states, state]
        };
      }
    });
  };
  
  // Toggle a purpose filter
  const togglePurpose = (purpose: string) => {
    setFilters(prev => {
      if (prev.purposes.includes(purpose)) {
        return {
          ...prev,
          purposes: prev.purposes.filter(p => p !== purpose)
        };
      } else {
        return {
          ...prev,
          purposes: [...prev.purposes, purpose]
        };
      }
    });
  };
  
  // Update amount range
  const updateAmountRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      amountRange: [min, max]
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      years: [],
      states: [],
      amountRange,
      purposes: []
    });
  };
  
  // Count active filters
  const activeFilterCount = 
    filters.years.length + 
    filters.states.length + 
    filters.purposes.length + 
    (filters.amountRange[0] !== amountRange[0] || filters.amountRange[1] !== amountRange[1] ? 1 : 0);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Filter Grants
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {activeFilterCount} active
            </span>
          )}
        </h3>
        
        <div className="flex space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {/* Year Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Year</h4>
            <div className="flex flex-wrap gap-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.years.includes(year)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          {/* State Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">State</h4>
            <div className="flex flex-wrap gap-2">
              {states.map(state => (
                <button
                  key={state}
                  onClick={() => toggleState(state)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.states.includes(state)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
          
          {/* Purpose Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Purpose</h4>
            <div className="flex flex-wrap gap-2">
              {purposes.map(purpose => (
                <button
                  key={purpose}
                  onClick={() => togglePurpose(purpose)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.purposes.includes(purpose)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
          
          {/* Amount Range Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Amount Range: {formatCurrency(filters.amountRange[0])} - {formatCurrency(filters.amountRange[1])}
            </h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={amountRange[0]}
                max={amountRange[1]}
                value={filters.amountRange[0]}
                onChange={(e) => updateAmountRange(Number(e.target.value), filters.amountRange[1])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min={amountRange[0]}
                max={amountRange[1]}
                value={filters.amountRange[1]}
                onChange={(e) => updateAmountRange(filters.amountRange[0], Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GranteeFilters; 