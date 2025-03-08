import { NextRequest, NextResponse } from 'next/server';
import { processPDF } from '@/lib/ocrUtils';
import { cache } from '@/lib/cache';
import { CACHE_CONFIG, UPLOAD_CONFIG } from '@/lib/config';
import crypto from 'crypto';

/**
 * API route for processing PDF files
 * Extracts text from a PDF file
 */
export async function POST(req: NextRequest) {
  try {
    console.log('Processing PDF request received');
    
    // Check if the request is a multipart form
    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    if (!contentType.includes('multipart/form-data')) {
      console.log('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Get the form data
    let formData;
    try {
      formData = await req.formData();
      console.log('Form data entries:', [...formData.entries()].map(([key]) => key));
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json(
        { error: 'Failed to parse form data', details: error instanceof Error ? error.message : String(error) },
        { status: 400 }
      );
    }
    
    const file = formData.get('file') as File | null;

    // Check if a file was provided
    if (!file) {
      console.log('No file provided in form data');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Check if the file is a PDF
    if (!file.type.includes('pdf')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Check if the file size is within limits
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: `File size exceeds ${UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    let buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log('File converted to buffer, size:', buffer.length);
    } catch (error) {
      console.error('Error converting file to buffer:', error);
      return NextResponse.json(
        { error: 'Failed to process file', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
    
    // Create a hash of the buffer to use as a cache key
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const cacheKey = `process-pdf:${hash}`;
    console.log('Cache key generated:', cacheKey);
    
    // Try to get the result from cache or compute it
    let text;
    try {
      text = await cache.getOrCompute(
        cacheKey,
        async () => {
          console.log('Cache miss for process-pdf, processing PDF');
          // Pass the buffer directly to processPDF
          return processPDF(buffer);
        },
        CACHE_CONFIG.pdfProcessingTTL
      );
      console.log('Text extracted, length:', text.length);
      
      // Validate the extracted text
      if (!text || text.length === 0) {
        console.error('No text extracted from PDF');
        return NextResponse.json(
          { error: 'Failed to extract text from PDF: No text content found' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error processing PDF or accessing cache:', error);
      // Provide more detailed error information in the response
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        { error: 'Failed to process PDF', details: errorMessage },
        { status: 500 }
      );
    }

    // Return the extracted text
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Unhandled error in process-pdf API route:', error);
    // Provide more detailed error information in the response
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: errorMessage },
      { status: 500 }
    );
  }
} 