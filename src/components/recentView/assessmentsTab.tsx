import React from 'react';
import { RiskToAddressChart } from '@/components/recentView/riskToAddressChart';
import { DegreesOfRiskRadar } from '@/components/recentView/degreesOfRiskRadar';

const sampleRiskData = [
  { name: 'Critical', value: 35, color: '#EF4444' }, // High cash tied in excess inventory
  { name: 'High', value: 45, color: '#8B5CF6' }, // Stockout risk within 14 days
  { name: 'Medium', value: 80, color: '#F59E0B' }, // Suboptimal inventory levels
  { name: 'Low', value: 90, color: '#10B981' }, // Optimal stock coverage
  { name: 'High risk', value: 25, color: '#06B6D4' }, // Raw material shortage
  { name: 'No Risk', value: 25, color: '#6366F1' }, // Well-balanced inventory
];

const sampleRadarData = [
  { category: 'Cash Flow', value2022: 65, value2023: 75, value2024: 82 }, // Working capital optimization
  { category: 'Inventory Turn', value2022: 70, value2023: 80, value2024: 85 }, // Inventory rotation speed
  { category: 'Stockout Risk', value2022: 85, value2023: 90, value2024: 78 }, // Stock availability score (inverted)
  {
    category: 'Production Efficiency',
    value2022: 75,
    value2023: 85,
    value2024: 88,
  }, // Run size optimization
  { category: 'Material Supply', value2022: 80, value2023: 70, value2024: 92 }, // Raw material availability
  { category: 'Demand Forecast', value2022: 60, value2023: 75, value2024: 85 }, // Forecast accuracy
];

const AssessmentsTab = () => {
  return (
    <main className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <RiskToAddressChart data={sampleRiskData} totalValue={300} />
      <DegreesOfRiskRadar data={sampleRadarData} />
    </main>
  );
};

export default AssessmentsTab;
