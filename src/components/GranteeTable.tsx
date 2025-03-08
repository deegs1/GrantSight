import React from 'react';
import { Grantee } from '@/types';

interface GranteeTableProps {
  grantees: Grantee[];
}

const GranteeTable: React.FC<GranteeTableProps> = ({ grantees }) => {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Grantee Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Year
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grantees.length > 0 ? (
            grantees.map((grantee, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {grantee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {grantee.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {grantee.location.city}, {grantee.location.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  ${grantee.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {grantee.purpose}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-black">
                No grantees found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GranteeTable; 