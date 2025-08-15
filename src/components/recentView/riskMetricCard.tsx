import React from 'react';

interface RiskMetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

const RiskMetricCard: React.FC<RiskMetricCardProps> = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  color = 'gray',
}) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <span className='text-sm'>{trendIcons[trend]}</span>
      </div>
      <div className='mb-1 text-2xl font-bold'>{value}</div>
      {subtitle && <div className='text-xs opacity-75'>{subtitle}</div>}
    </div>
  );
};

export default RiskMetricCard;
