import React from 'react';
import { Foundation } from '@/types';

interface OrganizationInfoProps {
  foundation: Foundation;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ foundation }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">Organization Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">Contact Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-black">Foundation Name</p>
              <p className="text-black">{foundation.name}</p>
            </div>
            
            <div>
              <p className="font-medium text-black">EIN</p>
              <p className="text-black">{foundation.ein}</p>
            </div>
            
            <div>
              <p className="font-medium text-black">Phone</p>
              <p className="text-black">{foundation.phone}</p>
            </div>
            
            <div>
              <p className="font-medium text-black">Address</p>
              <p className="text-black">{foundation.address}</p>
            </div>
            
            <div>
              <p className="font-medium text-black">Website</p>
              <a href={foundation.website} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-700 hover:text-blue-900 hover:underline">
                {foundation.website}
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">Key Personnel</h3>
          
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    NAME
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    ROLE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foundation.keyPersonnel.map((person, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {person.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {person.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo; 