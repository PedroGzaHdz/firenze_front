import { cn } from '@/utils/tailwind';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  subtitle,
  borderColor = 'blue',
  className,
  trend,
  onClick,
}) {
  const borderColorClass = {
    blue: 'border-l-blue-500',
    yellow: 'border-l-yellow-500',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-l-4 border-gray-200 bg-white p-6 transition-all duration-200',
        borderColorClass[borderColor],
        onClick && 'cursor-pointer hover:shadow-md hover:scale-105',
        className,
      )}
      onClick={onClick}
    >
      <div className='mb-1 text-sm text-gray-500'>{title}</div>
      <div className='mb-1 text-2xl font-bold text-gray-900'>{value}</div>
      <div className="flex items-center justify-between">
        {subtitle && <div className='text-sm text-gray-500'>{subtitle}</div>}
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
