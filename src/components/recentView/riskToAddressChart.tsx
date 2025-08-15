import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface RiskData {
  name: string;
  value: number;
  color: string;
}

interface RiskToAddressChartProps {
  data?: RiskData[];
  totalValue?: number;
}

const defaultData: RiskData[] = [
  { name: 'Low', value: 45, color: '#10B981' },
  { name: 'No Risk', value: 35, color: '#6366F1' },
  { name: 'Critical', value: 25, color: '#EF4444' },
  { name: 'High', value: 40, color: '#8B5CF6' },
  { name: 'Medium', value: 30, color: '#F59E0B' },
  { name: 'High risk', value: 20, color: '#06B6D4' },
];

export const RiskToAddressChart: React.FC<RiskToAddressChartProps> = ({
  data = defaultData,
  totalValue = 300,
}) => {
  const CustomLabel = ({ cx, cy }: { cx?: number; cy?: number }) => {
    return (
      <text
        x={cx}
        y={cy}
        fill='#1F2937'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize='28'
        fontWeight='600'
      >
        {totalValue}
      </text>
    );
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className='mt-4 flex flex-wrap justify-center gap-4'>
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
      <div className='mb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>Risk to address</h2>
      </div>

      <div className='h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey='value'
              labelLine={false}
              label={<CustomLabel />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend content={renderCustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Risk level indicators */}
      {/*<div className='mt-6 space-y-2'>*/}
      {/*  <div className='flex items-center justify-between text-sm'>*/}
      {/*    <span className='text-gray-600'>Medium risk</span>*/}
      {/*    <span className='text-gray-400'>→</span>*/}
      {/*  </div>*/}
      {/*  <div className='flex items-center justify-between text-sm'>*/}
      {/*    <span className='text-gray-600'>High risk</span>*/}
      {/*    <span className='text-gray-400'>→</span>*/}
      {/*  </div>*/}
      {/*  <div className='flex items-center justify-between text-sm'>*/}
      {/*    <span className='text-gray-600'>Low risk</span>*/}
      {/*    <span className='text-gray-400'>→</span>*/}
      {/*  </div>*/}
      {/*  <div className='flex items-center justify-between text-sm'>*/}
      {/*    <span className='text-gray-600'>Critical risk</span>*/}
      {/*    <span className='text-gray-400'>→</span>*/}
      {/*  </div>*/}
      {/*  <div className='flex items-center justify-between text-sm'>*/}
      {/*    <span className='text-gray-600'>No risk</span>*/}
      {/*    <span className='text-gray-400'>→</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
