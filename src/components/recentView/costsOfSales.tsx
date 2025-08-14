import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CostItem {
  type: string;
  category: string;
  status: string;
  amount: number;
}

interface CostsOfSalesProps {
  costs: Record<string, CostItem[]>;
}

export const CostsOfSales: React.FC<CostsOfSalesProps> = ({ costs }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <main className='rounded-lg bg-white p-6 shadow-sm'>
      <section className='mb-4 flex items-center gap-2'>
        <h2 className='text-lg font-semibold text-gray-900'>Costs of Sales</h2>
        <button className='text-sm text-blue-600 hover:text-blue-700'>
          Ask Firenze
        </button>
        <div className='ml-auto text-sm text-gray-600'>Last Invoice</div>
      </section>

      <section className='space-y-2'>
        {Object.entries(costs).map(([section, items]) => (
          <div key={section} className='rounded-lg border border-gray-200'>
            <button
              onClick={() => toggleSection(section)}
              className='flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50'
            >
              <span className='font-medium text-gray-900'>{section}</span>
              {expandedSections.has(section) ? (
                <ChevronUpIcon className='h-4 w-4 text-gray-500' />
              ) : (
                <ChevronDownIcon className='h-4 w-4 text-gray-500' />
              )}
            </button>

            {expandedSections.has(section) && (
              <div className='space-y-2 px-4 pb-3'>
                {items.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between text-sm'
                  >
                    <div className='flex gap-4'>
                      <span className='text-gray-600'>{item.type}</span>
                      <span className='text-gray-500'>{item.category}</span>
                      <span className='text-gray-500'>{item.status}</span>
                    </div>
                    <span className='font-medium text-gray-900'>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};
