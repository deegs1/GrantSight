import { parsePDF } from './pdfParseWrapper';

/**
 * Extracts text from a PDF file using pdf-parse
 * @param buffer The PDF file buffer
 * @returns The extracted text
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Directly use the buffer with pdf-parse
    // This avoids the issue where pdf-parse tries to read from a file path
    const data = await parsePDF(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
  }
}

/**
 * Performs OCR on an image
 * This is a placeholder for a real OCR implementation
 * In a production environment, you would use a service like Google Cloud Vision or AWS Textract
 * @param buffer The image buffer
 * @returns The extracted text
 */
export async function performOCR(buffer: Buffer): Promise<string> {
  // In a serverless environment, we can't use Tesseract.js directly
  // We would need to use a cloud-based OCR service instead
  console.log('OCR would be performed in a production environment');
  return "OCR text extraction is not available in this environment. Please use a cloud-based OCR service in production.";
}

/**
 * Processes a PDF file using pdf-parse
 * @param buffer The PDF file buffer
 * @returns The extracted text
 */
export async function processPDF(buffer: Buffer): Promise<string> {
  try {
    console.log(`Processing PDF buffer of size: ${buffer.length} bytes`);
    
    // Extract text directly from the PDF
    const pdfText = await extractTextFromPDF(buffer);
    
    console.log(`Extracted text length: ${pdfText.length} characters`);
    
    // If the PDF is scanned or has limited text, we would use OCR in production
    if (pdfText.length < 500) {
      console.log('PDF appears to be scanned or has limited text. OCR would be performed in a production environment.');
    }
    
    return pdfText;
  } catch (error) {
    console.error('Error processing PDF:', error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to process PDF: ${errorMessage}`);
  }
} 