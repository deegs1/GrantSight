import { NextRequest, NextResponse } from 'next/server';
import { analyze990Form } from '@/lib/openai';
import { cache } from '@/lib/cache';
import { CACHE_CONFIG } from '@/lib/config';
import crypto from 'crypto';

/**
 * API route for analyzing 990 form text
 * Uses OpenAI to extract structured data from the form text
 */
export async function POST(req: NextRequest) {
  try {
    console.log('Analyze 990 request received');
    
    // Get the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Failed to parse request body', details: error instanceof Error ? error.message : String(error) },
        { status: 400 }
      );
    }
    
    // Check if text was provided
    if (!body.text) {
      console.log('No text provided in request body');
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }
    
    console.log('Text received, length:', body.text.length);
    
    // Create a hash of the text to use as a cache key
    const hash = crypto.createHash('md5').update(body.text).digest('hex');
    const cacheKey = `analyze-990:${hash}`;
    console.log('Cache key generated:', cacheKey);
    
    // Try to get the result from cache or compute it
    let result;
    try {
      result = await cache.getOrCompute(
        cacheKey,
        async () => {
          console.log('Cache miss for analyze-990, calling OpenAI API');
          
          // Use a mock result for testing if no OpenAI API key is provided
          if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
            console.log('No OpenAI API key provided, using mock data');
            return {
              name: "TrustAge Foundation Inc.",
              ein: "45-1234567",
              totalAssets: 25000000,
              totalGiving: 1200000,
              averageGrantAmount: 60000,
              medianGrantAmount: 50000,
              contactInfo: {
                phone: "(608) 555-7890",
                address: "123 Main St, Madison, WI 53703",
                website: "https://www.trustagefoundation.org"
              },
              keyPersonnel: [
                { name: "Jane Smith", role: "Executive Director" },
                { name: "Robert Johnson", role: "Board Chair" },
                { name: "Maria Garcia", role: "Treasurer" }
              ],
              grantees: [
                {
                  name: "Madison Community Center",
                  year: 2023,
                  location: {
                    city: "Madison",
                    state: "WI"
                  },
                  amount: 75000,
                  purpose: "Community Development"
                },
                {
                  name: "Wisconsin Education Fund",
                  year: 2023,
                  location: {
                    city: "Milwaukee",
                    state: "WI"
                  },
                  amount: 50000,
                  purpose: "Education"
                },
                {
                  name: "Midwest Healthcare Initiative",
                  year: 2023,
                  location: {
                    city: "Chicago",
                    state: "IL"
                  },
                  amount: 100000,
                  purpose: "Health"
                },
                {
                  name: "Arts for All",
                  year: 2023,
                  location: {
                    city: "Minneapolis",
                    state: "MN"
                  },
                  amount: 35000,
                  purpose: "Arts & Culture"
                },
                {
                  name: "Green Future Project",
                  year: 2023,
                  location: {
                    city: "Madison",
                    state: "WI"
                  },
                  amount: 45000,
                  purpose: "Environment"
                }
              ]
            };
          }
          
          // Otherwise, call the OpenAI API
          return analyze990Form(body.text);
        },
        CACHE_CONFIG.analysisTTL
      );
      console.log('Analysis complete, foundation name:', result?.name || 'unknown');
    } catch (error) {
      console.error('Error analyzing 990 form or accessing cache:', error);
      return NextResponse.json(
        { error: 'Failed to analyze 990 form', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
    
    // Return the analysis result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Unhandled error in analyze-990 API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze 990 form', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 