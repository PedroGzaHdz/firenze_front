import React from 'react';
import { CurrentInventoryStatus } from '@/components/recentView/currentInventoryStatus';
import { AnomaliesSection } from '@/components/recentView/anomaliesSection';
import { ExpectedIncomeCard } from '@/components/recentView/expectedIncomeCard';
import { InventoryRotationCard } from '@/components/recentView/inventoryRotationCard';
import { CostsOfSales } from '@/components/recentView/costsOfSales';
import { UpcomingPromos } from '@/components/recentView/upcomingPromos';
import { InventoryItem } from '@/types/inventory';

const sampleData = {
  inventoryItems: [
    {
      id: '1',
      name: 'Classic Pistachio Butter',
      sku: 'SKU-CP2024',
      shippedDate: '08-12-25',
      unitsOnHand: 850,
      paymentStatus: 'On Time',
      marketValue: 4250, // $4,250 in cents
    },
    {
      id: '2',
      name: 'Spiced Pistachio Butter',
      sku: 'SKU-SP2024',
      shippedDate: '08-10-25',
      unitsOnHand: 1200,
      paymentStatus: 'On Time',
      marketValue: 7200, // $7,200 in cents
    },
    {
      id: '3',
      name: 'Raw Pistachios (Bulk)',
      sku: 'SKU-RP-BULK',
      shippedDate: '08-08-25',
      unitsOnHand: 75, // kg
      paymentStatus: 'On Time',
      marketValue: 2250, // $2,250 in cents
    },
    {
      id: '4',
      name: 'Glass Jars 8oz',
      sku: 'SKU-JAR-8OZ',
      shippedDate: 'TBD',
      unitsOnHand: 2000,
      paymentStatus: 'On Time',
      marketValue: 1800, // $1,800 in cents
    },
  ],
  anomalies: [
    {
      type: 'High inventory carrying cost',
      description:
        'Your current stock represents 28 days of coverage. Consider reducing next production run by 400 units to free up $2,400 in working capital while maintaining 21-day optimal coverage.',
    },
    {
      type: 'Raw material shortage alert',
      description:
        'Pistachio inventory will run short in 12 days based on planned production. Recommend ordering 50kg minimum by August 18th to avoid production delays. Agent can draft supplier PO automatically.',
    },
  ],
  expectedIncome: {
    currentMonth: { amount: 18500, label: 'This Month' },
    lastMonth: { amount: 16200, label: 'Last Month' },
  },
  inventoryRotation: '4.2 Weeks',
  costs: {
    'Classic Pistachio Butter': [
      {
        type: 'Storage Fees',
        category: 'COS',
        status: 'Cash Impact High',
        amount: 0.28,
      },
      {
        type: 'Overstock Penalty',
        category: 'COS',
        status: 'Cash Impact Medium',
        amount: 0.12,
      },
      {
        type: 'Inventory Carrying Cost',
        category: 'COS',
        status: 'Cash Impact High',
        amount: 1.85,
      },
      {
        type: 'Working Capital Tied',
        category: 'CASH',
        status: 'Optimization Needed',
        amount: 2.4,
      },
    ],
    'Spiced Pistachio Butter': [
      {
        type: 'Storage Fees',
        category: 'COS',
        status: 'Cash Impact High',
        amount: 0.35,
      },
      {
        type: 'Inventory Carrying Cost',
        category: 'COS',
        status: 'Cash Impact High',
        amount: 2.2,
      },
      {
        type: 'Overproduction Cost',
        category: 'PROD',
        status: 'Reduce Next Run',
        amount: 1.15,
      },
    ],
    'Raw Pistachios (Bulk)': [
      {
        type: 'Shortage Risk',
        category: 'SUPPLY',
        status: 'Order Immediately',
        amount: 0.45,
      },
      {
        type: 'Rush Order Premium',
        category: 'SUPPLY',
        status: 'Avoidable Cost',
        amount: 1.2,
      },
    ],
  },
  upcomingPromos: [
    {
      title: 'Back to School Bundle',
      dateRange: '08/20/25 - 08/31/25',
      sku: 'SKU-CP2024',
      impact: 'Reduce inventory by 300 units',
    },
    {
      title: 'Wholesale Price Drop',
      dateRange: '09/01/25 - 09/15/25',
      sku: 'SKU-SP2024',
      impact: 'Clear excess stock faster',
    },
    {
      title: 'Production Run Scheduled',
      dateRange: '08/22/25',
      sku: 'SKU-CP2024',
      impact: 'Add 1600 units, $3200 cash impact',
    },
  ],
};

const GeneralTab = () => {
  return (
    <section className='grid grid-cols-12 gap-4'>
      <article className='col-span-6'>
        <CurrentInventoryStatus
          items={sampleData.inventoryItems as InventoryItem[]}
        />
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
  );
};

export default GeneralTab;
