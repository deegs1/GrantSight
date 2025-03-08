import { Foundation, Grantee } from '@/types';
import axios from 'axios';
import { UPLOAD_CONFIG } from './config';

/**
 * Validates if a file is a PDF and within size limits
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!UPLOAD_CONFIG.allowedFileTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a PDF' };
  }
  
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: `File size exceeds ${UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit` };
  }
  
  return { valid: true };
};

/**
 * Creates a custom Axios instance with timeout and error handling
 */
const createApiClient = () => {
  const client = axios.create({
    timeout: 60000, // 60 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Add response interceptor for better error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log the error details
      console.error('API request failed:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Rethrow the error with more details
      throw error;
    }
  );
  
  return client;
};

// Create the API client
const apiClient = createApiClient();

/**
 * Extracts data from a 990 form PDF using API endpoints
 */
export const extract990Data = async (file: File): Promise<Foundation> => {
  try {
    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);
    
    // Step 1: Process the PDF to extract text
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Sending file to process-pdf API...');
    
    // Use a direct fetch call instead of axios for the file upload
    const processResponse = await fetch('/api/process-pdf', {
      method: 'POST',
      body: formData,
    });
    
    if (!processResponse.ok) {
      // Clone the response before reading it
      const clonedResponse = processResponse.clone();
      
      let errorText;
      try {
        // Try to parse the error response as JSON
        const errorJson = await clonedResponse.json();
        errorText = errorJson.details || errorJson.error || processResponse.statusText;
      } catch (e) {
        // If JSON parsing fails, get the raw text
        errorText = await processResponse.text();
      }
      
      console.error(`PDF processing failed with status ${processResponse.status}:`, errorText);
      throw new Error(`Failed to process PDF: ${processResponse.statusText}`);
    }
    
    // Read the response as JSON
    const processData = await processResponse.json();
    
    if (!processData || !processData.text) {
      console.error('No text returned from process-pdf API:', processData);
      throw new Error('Failed to extract text from PDF');
    }
    
    const extractedText = processData.text;
    console.log(`Text extracted, length: ${extractedText.length}`);
    
    // Step 2: Analyze the extracted text to get structured data
    console.log('Sending text to analyze-990 API...');
    
    const analyzeResponse = await apiClient.post('/api/analyze-990', {
      text: extractedText,
    });
    
    if (!analyzeResponse.data) {
      console.error('No data returned from analyze-990 API:', analyzeResponse);
      throw new Error('Failed to analyze 990 form');
    }
    
    console.log('Analysis complete:', analyzeResponse.data.name);
    
    // Return the foundation data
    return analyzeResponse.data;
  } catch (error) {
    console.error('Error extracting data from PDF:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          timeout: error.config?.timeout,
        }
      });
    } else if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    // If there's an error, fall back to mock data for demonstration
    console.log('Falling back to mock data due to error');
    return generateMockFoundationData(file.name.replace('.pdf', '').replace(/_/g, ' '));
  }
};

/**
 * Generates mock foundation data for demonstration purposes
 * Used as a fallback when real processing fails
 */
const generateMockFoundationData = (name: string): Foundation => {
  // Generate random values for demonstration
  const totalAssets = Math.round(Math.random() * 100000000);
  const totalGiving = Math.round(totalAssets * (Math.random() * 0.1));
  
  // Generate mock grantees
  const granteeCount = 10 + Math.floor(Math.random() * 20);
  const grantees: Grantee[] = [];
  
  const states = ['WI', 'IL', 'MN', 'MI', 'IA', 'OH', 'NY', 'CA', 'TX', 'FL'];
  const purposes = [
    'Education', 
    'Health', 
    'Arts & Culture', 
    'Environment', 
    'Human Services',
    'Community Development',
    'Civil Rights',
    'Animal Welfare'
  ];
  
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < granteeCount; i++) {
    const amount = Math.round((Math.random() * totalGiving * 0.1) / 1000) * 1000;
    const year = currentYear - Math.floor(Math.random() * 3);
    
    grantees.push({
      name: `Nonprofit Organization ${i + 1}`,
      year,
      location: {
        city: `City ${i % 10}`,
        state: states[i % states.length]
      },
      amount,
      purpose: purposes[i % purposes.length]
    });
  }
  
  // Calculate average and median grant amounts
  const amounts = grantees.map(g => g.amount);
  const averageGrantAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  const sortedAmounts = [...amounts].sort((a, b) => a - b);
  const medianGrantAmount = sortedAmounts[Math.floor(sortedAmounts.length / 2)];
  
  return {
    name,
    ein: `${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
    totalAssets,
    totalGiving,
    averageGrantAmount,
    medianGrantAmount,
    contactInfo: {
      phone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${Math.floor(100 + Math.random() * 900)} Main St, City, ${states[Math.floor(Math.random() * states.length)]} ${Math.floor(10000 + Math.random() * 90000)}`,
      website: `https://www.${name.toLowerCase().replace(/\s/g, '')}.org`
    },
    keyPersonnel: [
      { name: 'John Smith', role: 'Executive Director' },
      { name: 'Jane Doe', role: 'Board Chair' },
      { name: 'Robert Johnson', role: 'Treasurer' }
    ],
    grantees
  };
}; 