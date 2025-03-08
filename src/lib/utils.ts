import { Grantee, FilterOptions } from '@/types';

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Filters grantees based on filter options
 */
export const filterGrantees = (grantees: Grantee[], filters: FilterOptions): Grantee[] => {
  return grantees.filter(grantee => {
    // Filter by year
    if (filters.years.length > 0 && !filters.years.includes(grantee.year)) {
      return false;
    }
    
    // Filter by state
    if (filters.states.length > 0 && !filters.states.includes(grantee.location.state)) {
      return false;
    }
    
    // Filter by amount range
    if (grantee.amount < filters.amountRange[0] || grantee.amount > filters.amountRange[1]) {
      return false;
    }
    
    // Filter by purpose
    if (filters.purposes.length > 0 && !filters.purposes.includes(grantee.purpose)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Gets unique values from an array of objects by a specific key
 */
export const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
  const uniqueValues = new Set<T[K]>();
  
  items.forEach(item => {
    uniqueValues.add(item[key]);
  });
  
  return Array.from(uniqueValues);
};

/**
 * Gets unique states from grantees
 */
export const getUniqueStates = (grantees: Grantee[]): string[] => {
  const uniqueStates = new Set<string>();
  
  grantees.forEach(grantee => {
    uniqueStates.add(grantee.location.state);
  });
  
  return Array.from(uniqueStates).sort();
};

/**
 * Gets unique years from grantees
 */
export const getUniqueYears = (grantees: Grantee[]): number[] => {
  const uniqueYears = new Set<number>();
  
  grantees.forEach(grantee => {
    uniqueYears.add(grantee.year);
  });
  
  return Array.from(uniqueYears).sort((a, b) => b - a); // Sort descending
};

/**
 * Gets unique purposes from grantees
 */
export const getUniquePurposes = (grantees: Grantee[]): string[] => {
  const uniquePurposes = new Set<string>();
  
  grantees.forEach(grantee => {
    uniquePurposes.add(grantee.purpose);
  });
  
  return Array.from(uniquePurposes).sort();
};

/**
 * Gets min and max grant amounts from grantees
 */
export const getGrantAmountRange = (grantees: Grantee[]): [number, number] => {
  if (grantees.length === 0) {
    return [0, 0];
  }
  
  const amounts = grantees.map(g => g.amount);
  return [Math.min(...amounts), Math.max(...amounts)];
};

/**
 * Generates a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
}; 