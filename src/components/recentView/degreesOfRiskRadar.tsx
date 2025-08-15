import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RadarDataPoint {
  category: string;
  value2022: number;
  value2023: number;
  value2024: number;
}

interface DegreesOfRiskRadarProps {
  data?: RadarDataPoint[];
}

const defaultRadarData: RadarDataPoint[] = [
  { category: 'Alpha', value2022: 80, value2023: 90, value2024: 85 },
  { category: 'Beta', value2022: 70, value2023: 85, value2024: 75 },
  { category: 'Gamma', value2022: 60, value2023: 70, value2024: 80 },
  { category: 'Delta', value2022: 90, value2023: 80, value2024: 85 },
  { category: 'Epsilon', value2022: 75, value2023: 85, value2024: 90 },
  { category: 'Zeta', value2022: 85, value2023: 75, value2024: 80 },
];

export const DegreesOfRiskRadar: React.FC<DegreesOfRiskRadarProps> = ({
  data = defaultRadarData,
}) => {
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className='mt-4 flex justify-center gap-6'>
        {payload.map((entry: any, index: number) => (
          <div key={index} className='flex items-center gap-2'>
            <div
              className='h-3 w-3 rounded-full'
              style={{ backgroundColor: entry.color }}
            />
            <span className='text-sm text-gray-600'>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-900'>Degrees of Risk</h2>
        {/*<span className='text-sm text-gray-500'>MORE</span>*/}
      </div>

      <div className='h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid stroke='#E5E7EB' />
            <PolarAngleAxis
              dataKey='category'
              tick={{ fontSize: 12, fill: '#6B7280' }}
              className='text-xs'
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickCount={6}
            />
            <Radar
              name='2022'
              dataKey='value2022'
              stroke='#EF4444'
              fill='rgba(239, 68, 68, 0.1)'
              strokeWidth={2}
            />
            <Radar
              name='2023'
              dataKey='value2023'
              stroke='#3B82F6'
              fill='rgba(59, 130, 246, 0.1)'
              strokeWidth={2}
            />
            <Radar
              name='2024'
              dataKey='value2024'
              stroke='#10B981'
              fill='rgba(16, 185, 129, 0.1)'
              strokeWidth={2}
            />
            <Legend content={renderCustomLegend} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
