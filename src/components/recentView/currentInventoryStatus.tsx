import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  shippedDate: string;
  unitsOnHand: number;
  paymentStatus: 'On Time' | 'Overdue';
  marketValue: number;
}

interface CurrentInventoryStatusProps {
  items: InventoryItem[];
}

export const CurrentInventoryStatus: React.FC<CurrentInventoryStatusProps> = ({
  items,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className='h-[35vh] overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <h2 className='text-sm font-semibold text-gray-900'>
        Current Inventory Status
      </h2>
      <section className='overflow-auto'>
        <table className='w-full'>
          <thead className='border-t border-b border-black'>
            <tr>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                Item
              </th>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                SKU
              </th>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                Shipped Date
              </th>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                Units on Hand
              </th>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                Payment Status
              </th>
              <th className='py-3 text-left text-xs font-medium text-gray-700'>
                Market Value
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className='border-b border-gray-100 hover:bg-gray-50'
              >
                <td className='py-3 text-xs'>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className='flex items-center gap-2 text-left hover:text-blue-600'
                  >
                    <ChevronDownIcon
                      className={`h-3 w-3 transition-transform ${
                        expandedItems.has(item.id) ? 'rotate-180' : ''
                      }`}
                    />
                    <span className='text-gray-900'>{item.name}</span>
                  </button>
                </td>
                <td className='py-3 text-xs text-gray-600'>{item.sku}</td>
                <td className='py-3 text-xs text-gray-600'>
                  {item.shippedDate}
                </td>
                <td className='py-3 text-xs text-gray-900'>
                  {item.unitsOnHand.toLocaleString()} Units
                </td>
                <td className='py-3 text-xs'>
                  <span
                    className={`rounded px-2 py-1 ${
                      item.paymentStatus === 'On Time'
                        ? 'text-[#3C6EDD]'
                        : 'text-[#EB2323]'
                    }`}
                  >
                    {item.paymentStatus}
                  </span>
                </td>
                <td className='py-3 text-xs font-medium text-gray-900'>
                  {formatCurrency(item.marketValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};
