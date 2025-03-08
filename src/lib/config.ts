/**
 * Application configuration
 * Centralizes access to environment variables and other configuration
 */

// API configuration
export const API_CONFIG = {
  // OpenAI API key
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // OpenAI model to use for analysis
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o',
  
  // Maximum tokens to generate in OpenAI responses
  openaiMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000', 10),
  
  // Temperature for OpenAI responses (0-1, lower is more deterministic)
  openaiTemperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
};

// File upload configuration
export const UPLOAD_CONFIG = {
  // Maximum file size in bytes (25MB)
  maxFileSize: 25 * 1024 * 1024,
  
  // Maximum number of files allowed
  maxFiles: 5,
  
  // Allowed file types
  allowedFileTypes: ['application/pdf'],
};

// Cache configuration
export const CACHE_CONFIG = {
  // Default TTL for cache entries in milliseconds (1 hour)
  defaultTTL: 60 * 60 * 1000,
  
  // TTL for PDF processing cache entries in milliseconds (7 days)
  pdfProcessingTTL: 7 * 24 * 60 * 60 * 1000,
  
  // TTL for 990 form analysis cache entries in milliseconds (24 hours)
  analysisTTL: 24 * 60 * 60 * 1000,
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // Maximum number of requests per minute
  maxRequestsPerMinute: 10,
  
  // Window size in milliseconds (1 minute)
  windowSizeMs: 60 * 1000,
}; 