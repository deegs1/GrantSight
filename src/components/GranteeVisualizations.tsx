import React from 'react';
import { Grantee } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface GranteeVisualizationsProps {
  grantees: Grantee[];
}

const GranteeVisualizations: React.FC<GranteeVisualizationsProps> = ({ grantees }) => {
  // Group grantees by state and calculate total amount per state
  const stateData = grantees.reduce((acc, grantee) => {
    const state = grantee.location.state;
    if (!acc[state]) {
      acc[state] = 0;
    }
    acc[state] += grantee.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group grantees by year and calculate total amount per year
  const yearData = grantees.reduce((acc, grantee) => {
    const year = grantee.year.toString();
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year] += grantee.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group grantees by purpose and calculate total amount per purpose
  const purposeData = grantees.reduce((acc, grantee) => {
    const purpose = grantee.purpose;
    if (!acc[purpose]) {
      acc[purpose] = 0;
    }
    acc[purpose] += grantee.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort states by amount
  const sortedStates = Object.entries(stateData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 states

  // Sort years chronologically
  const sortedYears = Object.entries(yearData)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  // Sort purposes by amount
  const sortedPurposes = Object.entries(purposeData)
    .sort((a, b) => b[1] - a[1]);

  // Generate colors for charts
  const generateColors = (count: number) => {
    const baseColors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 205, 86, 0.6)',
      'rgba(201, 203, 207, 0.6)',
      'rgba(255, 99, 71, 0.6)',
      'rgba(46, 139, 87, 0.6)',
      'rgba(106, 90, 205, 0.6)'
    ];
    
    // Repeat colors if needed
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
  };

  // Highlight Wisconsin in the state chart if present
  const stateColors = generateColors(sortedStates.length).map((color, index) => {
    return sortedStates[index][0] === 'WI' ? 'rgba(0, 128, 0, 0.8)' : color;
  });

  // State distribution chart data
  const stateChartData = {
    labels: sortedStates.map(([state]) => state),
    datasets: [
      {
        label: 'Grant Amount by State',
        data: sortedStates.map(([, amount]) => amount),
        backgroundColor: stateColors,
        borderColor: stateColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1
      }
    ]
  };

  // Year trend chart data
  const yearChartData = {
    labels: sortedYears.map(([year]) => year),
    datasets: [
      {
        label: 'Grant Amount by Year',
        data: sortedYears.map(([, amount]) => amount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Purpose distribution chart data
  const purposeChartData = {
    labels: sortedPurposes.map(([purpose]) => purpose),
    datasets: [
      {
        label: 'Grant Amount by Purpose',
        data: sortedPurposes.map(([, amount]) => amount),
        backgroundColor: generateColors(sortedPurposes.length),
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#000000', // Black text for legend labels
          font: {
            weight: 'medium' as const
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
          color: '#000000' // Black text for y-axis ticks
        },
        title: {
          color: '#000000' // Black text for y-axis title
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)' // Slightly darker grid lines
        }
      },
      x: {
        ticks: {
          color: '#000000' // Black text for x-axis ticks
        },
        title: {
          color: '#000000' // Black text for x-axis title
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)' // Slightly darker grid lines
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">Grant Visualizations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">Geographic Distribution</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-64">
              <Bar data={stateChartData} options={chartOptions} />
            </div>
            <p className="text-center mt-4 text-black font-medium">
              Top states by grant amount (Wisconsin highlighted if present)
            </p>
          </div>
        </div>
        
        {/* Funding Trends */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">Funding Trends Over Time</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-64">
              <Bar data={yearChartData} options={chartOptions} />
            </div>
            <p className="text-center mt-4 text-black font-medium">
              Total grant amounts by year
            </p>
          </div>
        </div>
        
        {/* Purpose Distribution */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-black">Purpose Distribution</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-64 max-w-md mx-auto">
              <Pie 
                data={purposeChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#000000', // Black text for legend labels
                        font: {
                          weight: 'medium' as const
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = Math.round((context.raw / total) * 100);
                          return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            <p className="text-center mt-4 text-black font-medium">
              Breakdown of grants by purpose category
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GranteeVisualizations; 