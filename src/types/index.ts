export interface Foundation {
  name: string;
  ein: string;
  totalAssets: number;
  totalGiving: number;
  averageGrantAmount: number;
  medianGrantAmount: number;
  contactInfo: ContactInfo;
  keyPersonnel: KeyPerson[];
  grantees: Grantee[];
}

export interface ContactInfo {
  phone?: string;
  address?: string;
  website?: string;
}

export interface KeyPerson {
  name: string;
  role: string;
}

export interface Grantee {
  name: string;
  year: number;
  location: {
    city: string;
    state: string;
  };
  amount: number;
  purpose: string;
}

export interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface ProcessingStatus {
  totalFiles: number;
  processedFiles: number;
  status: 'idle' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface FilterOptions {
  years: number[];
  states: string[];
  amountRange: [number, number];
  purposes: string[];
} 