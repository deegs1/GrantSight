# GrantSight

GrantSight is a powerful tool for analyzing IRS Form 990 data from nonprofit foundations. It extracts, processes, and visualizes grant information to help users understand funding patterns and make data-driven decisions.

## Features

- **PDF Processing**: Upload and process IRS Form 990 forms using OCR and AI
- **Data Extraction**: Automatically extract foundation information and grantee data
- **Interactive Visualizations**: Explore grant data through charts and graphs
- **Filtering**: Filter grants by year, state, amount, and purpose
- **Export Options**: Export analysis results in various formats

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/grantsight.git
   cd grantsight
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload 990 Forms**: Drag and drop or select PDF files of IRS Form 990s
2. **Process Data**: The system will extract text using OCR and analyze it with AI
3. **Explore Results**: View foundation information and grantee data
4. **Filter and Analyze**: Use filters to explore specific aspects of the grant data
5. **Export Results**: Export your analysis in your preferred format

## Technical Implementation

- **Frontend**: Next.js, React, Tailwind CSS
- **PDF Processing**: pdf-parse, Tesseract.js for OCR
- **Data Analysis**: OpenAI API for structured data extraction
- **Visualization**: Chart.js, react-chartjs-2

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for analyzing 990 form data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IRS for providing public access to 990 form data
- OpenAI for their powerful language models
- The open-source community for the amazing tools that made this project possible
