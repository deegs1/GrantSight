import OpenAI from 'openai';
import { API_CONFIG } from './config';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: API_CONFIG.openaiApiKey,
});

/**
 * Analyzes a 990 form using OpenAI's GPT model
 * @param text The extracted text from the 990 form
 * @returns Structured data about the foundation and its grantees
 */
export async function analyze990Form(text: string) {
  try {
    // Check if API key is provided
    if (!API_CONFIG.openaiApiKey || API_CONFIG.openaiApiKey === '') {
      throw new Error('OpenAI API key is not configured');
    }
    
    console.log('Calling OpenAI API with model:', API_CONFIG.openaiModel);
    
    const response = await openai.chat.completions.create({
      model: API_CONFIG.openaiModel,
      messages: [
        {
          role: "system",
          content: `You are a specialized assistant that extracts structured data from IRS Form 990 documents.
          
          Extract the following information from the provided text:
          1. Foundation name
          2. EIN (Employer Identification Number)
          3. Total assets
          4. Total giving
          5. Contact information (phone, address, website)
          6. Key personnel (name and role)
          
          IMPORTANT: For grantee information, look specifically for the section titled:
          "3 Grants and Contributions Paid During the Year or Approved for Future Payment"
          
          This section contains all the grant information. Extract the following for each grantee:
          - Grantee name
          - Grant amount
          - Grant year (use the year from the form if not explicitly stated)
          - Location (city and state)
          - Purpose of grant
          
          The grantee information is typically formatted in a table or list under this section.
          Each grantee usually has their name, location, amount, and purpose listed.
          
          Format your response as a JSON object with the following structure:
          {
            "name": "Foundation Name",
            "ein": "12-3456789",
            "totalAssets": 1000000,
            "totalGiving": 500000,
            "contactInfo": {
              "phone": "(123) 456-7890",
              "address": "123 Main St, City, State 12345",
              "website": "https://www.foundation.org"
            },
            "keyPersonnel": [
              { "name": "John Smith", "role": "Executive Director" },
              { "name": "Jane Doe", "role": "Board Chair" }
            ],
            "grantees": [
              {
                "name": "Nonprofit Organization",
                "year": 2023,
                "location": {
                  "city": "City",
                  "state": "State"
                },
                "amount": 50000,
                "purpose": "Education"
              }
            ]
          }
          
          If you cannot find specific information, use null for that field. For numerical values, provide numbers without commas or currency symbols.
          
          If you cannot find the "3 Grants and Contributions" section, look for any tables or lists that appear to contain grant information.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: API_CONFIG.openaiTemperature,
      max_tokens: API_CONFIG.openaiMaxTokens,
      response_format: { type: "json_object" }
    });

    console.log('OpenAI API response received');
    
    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('JSON parsed successfully');
    } catch (error) {
      console.error('Error parsing OpenAI response as JSON:', error);
      console.log('Raw response:', response.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
    
    // Calculate average and median grant amounts
    if (result.grantees && result.grantees.length > 0) {
      const amounts = result.grantees.map((g: any) => g.amount).filter((a: any) => a !== null && !isNaN(a));
      
      if (amounts.length > 0) {
        const sum = amounts.reduce((a: number, b: number) => a + b, 0);
        result.averageGrantAmount = sum / amounts.length;
        
        const sortedAmounts = [...amounts].sort((a, b) => a - b);
        result.medianGrantAmount = sortedAmounts[Math.floor(sortedAmounts.length / 2)];
      } else {
        result.averageGrantAmount = 0;
        result.medianGrantAmount = 0;
      }
    } else {
      result.averageGrantAmount = 0;
      result.medianGrantAmount = 0;
      result.grantees = [];
    }

    return result;
  } catch (error) {
    console.error('Error analyzing 990 form with OpenAI:', error);
    
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
        code: error.code
      });
    }
    
    throw new Error(`Failed to analyze 990 form: ${error instanceof Error ? error.message : String(error)}`);
  }
} 