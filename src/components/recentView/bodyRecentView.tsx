import React from 'react';
import { CurrentInventoryStatus } from '@/components/recentView/currentInventoryStatus';
import { CostsOfSales } from '@/components/recentView/costsOfSales';
import { AnomaliesSection } from '@/components/recentView/anomaliesSection';
import { ExpectedIncomeCard } from '@/components/recentView/expectedIncomeCard';
import { InventoryRotationCard } from '@/components/recentView/inventoryRotationCard';
import { UpcomingPromos } from '@/components/recentView/upcomingPromos';

// Datos de ejemplo
const sampleData = {
  inventoryItems: [
    {
      id: '1',
      name: 'SPF 30 Sunscreen',
      sku: 'SKU-88227760a',
      shippedDate: '15-10-25',
      unitsOnHand: 220,
      paymentStatus: 'On Time' as const,
      marketValue: 150000,
    },
    {
      id: '2',
      name: 'SPF 50 Sunscreen',
      sku: 'SKU-88012767a',
      shippedDate: '15-08-25',
      unitsOnHand: 1000,
      paymentStatus: 'On Time' as const,
      marketValue: 175000,
    },
    {
      id: '3',
      name: 'Vetiver Facial Cleaner',
      sku: 'SKU-997826414a',
      shippedDate: '15-07-25',
      unitsOnHand: 1000,
      paymentStatus: 'Overdue' as const,
      marketValue: 89000,
    },
    {
      id: '4',
      name: 'Passion Fruit Scrub',
      sku: 'SKU-2392S132c',
      shippedDate: 'TBD',
      unitsOnHand: 2500,
      paymentStatus: 'On Time' as const,
      marketValue: 1200000,
    },
  ],
  anomalies: [
    {
      type: 'Increase in slotting fees',
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      type: 'Increase in chargebacks',
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more- or-less normal distribution.',
    },
  ],
  expectedIncome: {
    currentMonth: { amount: 1200000, label: 'This Month' },
    lastMonth: { amount: 1100000, label: 'Last Month' },
  },
  inventoryRotation: '6 Weeks',
  costs: {
    'SPF 30 Sunscreen': [
      {
        type: 'Slotting Fees',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 0.33,
      },
      {
        type: 'Deductions',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 0.1,
      },
      {
        type: 'Chargebacks',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 1.51,
      },
      {
        type: 'Others',
        category: 'N/A',
        status: 'Contract Compliant',
        amount: 0.86,
      },
    ],
    'SPF 50 Sunscreen': [
      {
        type: 'Slotting Fees',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 0.45,
      },
      {
        type: 'Deductions',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 0.15,
      },
    ],
    'Vetiver Facial Cleaner': [
      {
        type: 'Slotting Fees',
        category: 'COS',
        status: 'Contract Compliant',
        amount: 0.25,
      },
    ],
  },
  upcomingPromos: [
    {
      title: 'Buy 3 get 1',
      dateRange: '09/08/25 - 09/09/25',
      sku: '88227760a',
    },
    {
      title: 'Buy 3 get 1',
      dateRange: '09/08/25 - 09/09/25',
      sku: '88227760a',
    },
  ],
};

export const BodyRecentView: React.FC = () => {
  return (
    <main className='w-full bg-[#F4F4F4] p-6'>
      <section className='grid grid-cols-12 gap-4'>
        <article className='col-span-6'>
          <CurrentInventoryStatus items={sampleData.inventoryItems} />
        </article>
        <article className='col-span-3'>
          <AnomaliesSection anomalies={sampleData.anomalies} />
        </article>
        <article className='col-span-3 grid h-[35vh] grid-rows-2 gap-3 space-y-6 overflow-auto pb-1'>
          <ExpectedIncomeCard
            currentMonth={sampleData.expectedIncome.currentMonth}
            lastMonth={sampleData.expectedIncome.lastMonth}
          />
          <InventoryRotationCard rotation={sampleData.inventoryRotation} />
        </article>

        <article className='col-span-9'>
          <CostsOfSales costs={sampleData.costs} />
        </article>
        <article className='col-span-3 space-y-6'>
          <UpcomingPromos promos={sampleData.upcomingPromos} />
        </article>
      </section>
    </main>
  );
};

export default BodyRecentView;
