/**
 * Wrapper for the pdf-parse library to avoid issues with its debug mode
 * 
 * The pdf-parse library has a debug mode that runs when it's imported directly,
 * which tries to read a file from disk. This wrapper ensures we import it properly.
 */

// Import the actual pdf-parse function from the library
// @ts-ignore - Ignore the missing type declaration
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

// Define the return type of the pdf-parse function
interface PDFData {
  text: string;
  numpages: number;
  numrender: number;
  info: {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    [key: string]: any;
  };
  metadata: any;
  version: string;
}

/**
 * Parse a PDF buffer and extract its text content
 * @param buffer The PDF file buffer
 * @returns The parsed PDF data with text content
 */
export async function parsePDF(buffer: Buffer): Promise<PDFData> {
  try {
    return await pdfParse(buffer);
  } catch (error) {
    console.error('Error in pdf-parse:', error);
    throw error;
  }
} 