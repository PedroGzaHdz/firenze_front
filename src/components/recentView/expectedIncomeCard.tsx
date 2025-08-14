import React from 'react';

interface ExpectedIncomeCardProps {
  currentMonth: {
    amount: number;
    label: string;
  };
  lastMonth: {
    amount: number;
    label: string;
  };
}

export const ExpectedIncomeCard: React.FC<ExpectedIncomeCardProps> = ({
  currentMonth,
  lastMonth,
}) => {
  const formatAmount = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <article className='flex h-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <h2 className='font-family-mondwest mb-6 w-full text-sm text-[#232323]'>
        Expected Income
      </h2>

      <div className='flex w-3/4 items-end justify-between'>
        <div className='text-center'>
          <div className='mb-2 text-4xl font-light text-[#3C6EDD]'>
            {formatAmount(currentMonth.amount)}
          </div>
          <div className='text-sm text-gray-600'>{currentMonth.label}</div>
        </div>

        <div className='mx-4 text-2xl font-light text-gray-400'>Vs</div>

        <div className='text-center'>
          <div className='mb-2 text-4xl font-light text-[#3C6EDD]'>
            {formatAmount(lastMonth.amount)}
          </div>
          <div className='text-sm text-gray-600'>{lastMonth.label}</div>
        </div>
      </div>
    </article>
  );
};
