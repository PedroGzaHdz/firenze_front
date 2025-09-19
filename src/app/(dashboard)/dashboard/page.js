'use client';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import MetricCard from '@/components/metricCard';
import AIAssistantTrigger from '@/components/aiChat/ai-assistant-trigger';
import { RefreshCw, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [selectedSKU, setSelectedSKU] = useState('all-skus');
  const [selectedChannel, setSelectedChannel] = useState('all-channels');
  const [metrics, setMetrics] = useState({
    actualSales: { value: 14250, trend: 8.5 },
    coverage: { value: 12, trend: -2.1 },
    cashTied: { value: 230000, trend: 15.2 },
    slowSKUs: { value: 7, trend: -14.3 },
  });
  const [lastUpdated, setLastUpdated] = useState('');

  // Set lastUpdated solo en cliente para evitar hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // Simular cambios en métricas basados en filtros
  useEffect(() => {
    const adjustMetrics = () => {
      let salesMultiplier = 1;
      let coverageAdjust = 0;
      let cashMultiplier = 1;
      let slowSKUAdjust = 0;

      // Ajustar por SKU
      if (selectedSKU === 'pistakio-classic') {
        salesMultiplier = 0.45; // 45% de las ventas
        coverageAdjust = 2;
        cashMultiplier = 0.4;
        slowSKUAdjust = -5;
      } else if (selectedSKU === 'pistakio-salted') {
        salesMultiplier = 0.28;
        coverageAdjust = -1;
        cashMultiplier = 0.25;
        slowSKUAdjust = -4;
      } else if (selectedSKU === 'pistakio-chocolate') {
        salesMultiplier = 0.27;
        coverageAdjust = -2;
        cashMultiplier = 0.35;
        slowSKUAdjust = -3;
      }

      // Ajustar por canal
      if (selectedChannel === 'retail') {
        salesMultiplier *= 0.6;
        cashMultiplier *= 0.7;
      } else if (selectedChannel === 'online') {
        salesMultiplier *= 0.3;
        cashMultiplier *= 0.2;
      } else if (selectedChannel === 'wholesale') {
        salesMultiplier *= 0.1;
        cashMultiplier *= 0.1;
      }

      setMetrics({
        actualSales: {
          value: Math.round(14250 * salesMultiplier),
          trend: 8.5 + (Math.random() - 0.5) * 4,
        },
        coverage: {
          value: Math.max(5, 12 + coverageAdjust),
          trend: -2.1 + (Math.random() - 0.5) * 3,
        },
        cashTied: {
          value: Math.round(230000 * cashMultiplier),
          trend: 15.2 + (Math.random() - 0.5) * 5,
        },
        slowSKUs: {
          value: Math.max(0, 7 + slowSKUAdjust),
          trend: -14.3 + (Math.random() - 0.5) * 8,
        },
      });
  setLastUpdated(new Date().toLocaleTimeString());
    };

    adjustMetrics();
  }, [selectedSKU, selectedChannel]);

  const handleRefresh = () => {
    // Simular pequeños cambios aleatorios
    setMetrics((prev) => ({
      actualSales: {
        ...prev.actualSales,
        value: prev.actualSales.value + Math.round((Math.random() - 0.5) * 100),
        trend: prev.actualSales.trend + (Math.random() - 0.5) * 2,
      },
      coverage: {
        ...prev.coverage,
        value: Math.max(5, prev.coverage.value + (Math.random() - 0.5) * 2),
        trend: prev.coverage.trend + (Math.random() - 0.5) * 2,
      },
      cashTied: {
        ...prev.cashTied,
        value: prev.cashTied.value + Math.round((Math.random() - 0.5) * 10000),
        trend: prev.cashTied.trend + (Math.random() - 0.5) * 3,
      },
      slowSKUs: {
        ...prev.slowSKUs,
        value: Math.max(
          0,
          prev.slowSKUs.value + Math.round((Math.random() - 0.5) * 2),
        ),
        trend: prev.slowSKUs.trend + (Math.random() - 0.5) * 4,
      },
    }));
  setLastUpdated(new Date().toLocaleTimeString());
  };

  function fixNumber(num) {
    return parseFloat(num.toFixed(2));
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Last updated: {lastUpdated}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleRefresh}
            className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700'
          >
            <RefreshCw className='h-4 w-4' />
            Refresh
          </button>
          <AIAssistantTrigger />
        </div>
      </div>

      {/* Filters */}
      <div className='mb-8 flex gap-4'>
        <div>
          <label className='mb-2 block text-sm text-gray-500'>
            Brand / SKU
          </label>
          <Select value={selectedSKU} onValueChange={setSelectedSKU}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-skus'>All SKUs</SelectItem>
              <SelectItem value='pistakio-classic'>Pistakio Classic</SelectItem>
              <SelectItem value='pistakio-salted'>Pistakio Salted</SelectItem>
              <SelectItem value='pistakio-chocolate'>
                Pistakio Chocolate
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='mb-2 block text-sm text-gray-500'>Channel</label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-channels'>All Channels</SelectItem>
              <SelectItem value='retail'>Retail</SelectItem>
              <SelectItem value='online'>Online</SelectItem>
              <SelectItem value='wholesale'>Wholesale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <MetricCard
          title='Actual Sales (Last 4 Weeks)'
          value={`${fixNumber(metrics.actualSales.value).toLocaleString()} units`}
          subtitle='Recent sales performance'
          borderColor='blue'
          trend={fixNumber(metrics.actualSales.trend)}
        />
        <MetricCard
          title='Finished Goods Coverage'
          value={`${fixNumber(metrics.coverage.value)} days`}
          subtitle='Current stock vs demand'
          borderColor={
            metrics.coverage.value < 10
              ? 'red'
              : metrics.coverage.value < 15
                ? 'yellow'
                : 'green'
          }
          trend={fixNumber(metrics.coverage.trend)}
        />
        <MetricCard
          title='Cash Tied Up in Inventory'
          value={`$${fixNumber(metrics.cashTied.value).toLocaleString()}`}
          subtitle='FG + Materials value'
          borderColor='blue'
          trend={fixNumber(metrics.cashTied.trend)}
        />
        <MetricCard
          title='Slow-Moving SKUs'
          value={fixNumber(metrics.slowSKUs.value)}
          subtitle='Above 30-day threshold'
          borderColor={metrics.slowSKUs.value > 5 ? 'red' : 'yellow'}
          trend={fixNumber(metrics.slowSKUs.trend)}
        />
      </div>

      {/* Quick Insights */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h2 className='mb-4 text-xl font-semibold text-gray-900'>
          Quick Insights
        </h2>
        <div className='space-y-3'>
          <div className='flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50'>
            <div
              className={`mt-2 h-2 w-2 rounded-full ${
                metrics.coverage.value < 10
                  ? 'bg-red-500'
                  : metrics.coverage.value < 15
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
            ></div>
            <p className='text-gray-600'>
              Your inventory covers {metrics.coverage.value} days of demand at
              current sales levels
              {metrics.coverage.value < 10 && (
                <span className='ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'>
                  Critical
                </span>
              )}
            </p>
          </div>
          <div className='flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50'>
            <div
              className={`mt-2 h-2 w-2 rounded-full ${
                metrics.cashTied.trend > 10 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
            ></div>
            <p className='text-gray-600'>
              ${metrics.cashTied.value.toLocaleString()} is currently tied up in
              inventory across finished goods and materials
              {metrics.cashTied.trend > 10 && (
                <span className='ml-2 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800'>
                  High Growth
                </span>
              )}
            </p>
          </div>
          <div className='flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50'>
            <div
              className={`mt-2 h-2 w-2 rounded-full ${
                metrics.slowSKUs.value > 5 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
            ></div>
            <p className='text-gray-600'>
              {metrics.slowSKUs.value} SKUs are moving slowly and may need
              attention to free up working capital
              {metrics.slowSKUs.value > 5 && (
                <span className='ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'>
                  Action Required
                </span>
              )}
            </p>
          </div>
          {selectedSKU !== 'all-skus' && (
            <div className='flex items-start gap-3 rounded-lg bg-blue-50 p-3'>
              <div className='mt-2 h-2 w-2 rounded-full bg-blue-500'></div>
              <p className='text-blue-700'>
                <TrendingUp className='mr-1 inline h-4 w-4' />
                Filtered view showing data for{' '}
                {selectedSKU
                  .replace('-', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                {selectedChannel !== 'all-channels' &&
                  ` via ${selectedChannel} channel`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
