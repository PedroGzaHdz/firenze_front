'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import MetricCard from '@/components/metricCard';
import AIAssistantTrigger from '@/components/aiChat/ai-assistant-trigger';

const baseChartData = [
  { week: 'W1', demand: 2500, finishedGoods: 15000 },
  { week: 'W2', demand: 2500, finishedGoods: 12500 },
  { week: 'W3', demand: 2500, finishedGoods: 10500 },
  { week: 'W4', demand: 2500, finishedGoods: 8000 },
  { week: 'W5', demand: null, finishedGoods: null, forecast: 2600 },
  { week: 'W6', demand: null, finishedGoods: null, forecast: 2650 },
];

const baseSalesData = [
  {
    sku: 'Pistakio Classic',
    w33: { actual: 330, left: '7,246 left' },
    w34: { actual: 345, left: '6,901 left' },
    w35: { actual: 320, left: '6,581 left' },
    w36: { forecast: 346, left: '6,235 left' },
  },
  {
    sku: 'Pistakio Salted',
    w33: { actual: 185, left: '4,003 left' },
    w34: { actual: 190, left: '3,813 left' },
    w35: { actual: 175, left: '3,638 left' },
    w36: { forecast: 192, left: '3,446 left' },
  },
  {
    sku: 'Pistakio Chocolate',
    w33: { actual: 135, left: '3,101 left' },
    w34: { actual: 140, left: '2,961 left' },
    w35: { actual: 150, left: '2,811 left' },
    w36: { forecast: 154, left: '2,657 left' },
  },
];

export default function SalesForecastPage() {
  const [selectedSKU, setSelectedSKU] = useState('all-skus');
  const [selectedChannel, setSelectedChannel] = useState('all-channels');
  const [weekRange, setWeekRange] = useState('4w');
  const [forecastAdjustment, setForecastAdjustment] = useState([0]);
  const [chartData, setChartData] = useState(baseChartData);
  const [salesData, setSalesData] = useState(baseSalesData);
  const [isSimulating, setIsSimulating] = useState(false);

  const getFilteredChartData = (data, range) => {
    if (range === '4w') {
      return data.slice(0, 6); // W1-W6 (4 semanas históricas + 2 forecast)
    } else if (range === '8w') {
      // Extender datos para 8 semanas
      const extendedData = [...data];
      for (let i = 7; i <= 10; i++) {
        extendedData.push({
          week: `W${i}`,
          demand: null,
          finishedGoods: null,
          forecast: Math.round(2600 + (i - 5) * 50),
        });
      }
      return extendedData;
    } else if (range === '12w') {
      // Extender datos para 12 semanas
      const extendedData = [...data];
      for (let i = 7; i <= 14; i++) {
        extendedData.push({
          week: `W${i}`,
          demand: null,
          finishedGoods: null,
          forecast: Math.round(2600 + (i - 5) * 50),
        });
      }
      return extendedData;
    }
    return data;
  };

  // Actualizar datos cuando cambian los filtros
  useEffect(() => {
    const updateData = () => {
      let multiplier = 1;

      // Ajustar por SKU seleccionado
      if (selectedSKU === 'pistakio-classic') multiplier = 0.45;
      else if (selectedSKU === 'pistakio-salted') multiplier = 0.28;
      else if (selectedSKU === 'pistakio-chocolate') multiplier = 0.27;

      // Ajustar por canal - CORREGIR: aplicar solo si no es 'all-channels'
      if (selectedChannel !== 'all-channels') {
        if (selectedChannel === 'retail') multiplier *= 0.6;
        else if (selectedChannel === 'online') multiplier *= 0.3;
        else if (selectedChannel === 'wholesale') multiplier *= 0.1;
      }

      // Obtener datos filtrados por rango de semanas
      const baseData = getFilteredChartData(baseChartData, weekRange);

      // Actualizar chart data con multiplicador y ajuste de forecast
      const newChartData = baseData.map((item) => ({
        ...item,
        demand: item.demand ? Math.round(item.demand * multiplier) : null,
        finishedGoods: item.finishedGoods
          ? Math.round(item.finishedGoods * multiplier)
          : null,
        forecast: item.forecast
          ? Math.round(
              item.forecast * multiplier * (1 + forecastAdjustment[0] / 100),
            )
          : null,
      }));

      // Actualizar sales data
      let newSalesData = baseSalesData;
      if (selectedSKU !== 'all-skus') {
        const skuName = selectedSKU
          .replace('-', ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        newSalesData = baseSalesData.filter((item) => item.sku === skuName);
      }

      // Aplicar multiplicador a sales data también
      newSalesData = newSalesData.map((item) => ({
        ...item,
        w33: {
          ...item.w33,
          actual: Math.round(item.w33.actual * multiplier),
        },
        w34: {
          ...item.w34,
          actual: Math.round(item.w34.actual * multiplier),
        },
        w35: {
          ...item.w35,
          actual: Math.round(item.w35.actual * multiplier),
        },
        w36: {
          ...item.w36,
          forecast: Math.round(
            item.w36.forecast * multiplier * (1 + forecastAdjustment[0] / 100),
          ),
        },
      }));

      setChartData(newChartData);
      setSalesData(newSalesData);
    };

    updateData();
  }, [selectedSKU, selectedChannel, forecastAdjustment, weekRange]);

  const handleSimulation = () => {
    setIsSimulating(true);

    // Simular cambios en el forecast durante 5 segundos
    const interval = setInterval(() => {
      setChartData((prev) =>
        prev.map((item) => {
          if (item.forecast) {
            const variation = (Math.random() - 0.5) * 200;
            return {
              ...item,
              forecast: Math.max(1000, Math.round(item.forecast + variation)),
            };
          }
          return item;
        }),
      );
    }, 1000);

    setTimeout(() => {
      setIsSimulating(false);
      clearInterval(interval);
    }, 5000);
  };

  const resetForecast = () => {
    setForecastAdjustment([0]);
    setChartData(baseChartData);
    setSalesData(baseSalesData);
  };

  const getDaysOfCover = () => {
    const currentStock =
      selectedSKU === 'all-skus'
        ? 15000
        : selectedSKU === 'pistakio-classic'
          ? 6581
          : selectedSKU === 'pistakio-salted'
            ? 3638
            : 2811;
    const avgDemand =
      selectedSKU === 'all-skus'
        ? 2500
        : selectedSKU === 'pistakio-classic'
          ? 332
          : selectedSKU === 'pistakio-salted'
            ? 183
            : 142;
    return Math.round(currentStock / avgDemand);
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-medium'>{`Week: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value ? entry.value.toLocaleString() : 'N/A'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Sales & Forecast</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Interactive demand planning and forecasting
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {/*<Button*/}
          {/*  onClick={handleSimulation}*/}
          {/*  disabled={isSimulating}*/}
          {/*  className={`flex items-center gap-2 ${isSimulating ? 'bg-orange-600' : 'bg-green-600'}`}*/}
          {/*>*/}
          {/*  <Play className="h-4 w-4" />*/}
          {/*  {isSimulating ? 'Simulating...' : 'Run Simulation'}*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  onClick={resetForecast}*/}
          {/*  variant="outline"*/}
          {/*  className='flex items-center gap-2'*/}
          {/*>*/}
          {/*  <RotateCcw className="h-4 w-4" />*/}
          {/*  Reset*/}
          {/*</Button>*/}
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
            <SelectContent className='bg-white'>
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
          <label className='mb-2 block text-sm text-gray-500'>Week Range</label>
          <Select value={weekRange} onValueChange={setWeekRange}>
            <SelectTrigger className='w-24'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='4w'>4w</SelectItem>
              <SelectItem value='8w'>8w</SelectItem>
              <SelectItem value='12w'>12w</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='mb-2 block text-sm text-gray-500'>
            Forecast Adjustment {forecastAdjustment[0]}%
          </label>
          <div className='w-48 pt-2'>
            <Slider
              value={forecastAdjustment}
              onValueChange={setForecastAdjustment}
              max={50}
              min={-50}
              step={1}
              className='w-full bg-blue-300'
            />
          </div>
        </div>
      </div>

      {/* Alert for high adjustments */}
      {Math.abs(forecastAdjustment[0]) > 20 && (
        <div className='mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center gap-2 text-yellow-800'>
            <AlertTriangle className='h-5 w-5' />
            <span className='font-medium'>High Forecast Adjustment</span>
          </div>
          <p className='mt-1 text-sm text-yellow-700'>
            Large forecast adjustments may indicate market volatility or data
            quality issues.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <MetricCard
          title='Days of Cover'
          value={getDaysOfCover()}
          subtitle='Current inventory coverage'
          borderColor={
            getDaysOfCover() < 10
              ? 'red'
              : getDaysOfCover() < 15
                ? 'yellow'
                : 'green'
          }
          trend={
            forecastAdjustment[0] > 0
              ? -5.2
              : forecastAdjustment[0] < 0
                ? 3.1
                : 0
          }
        />
        <MetricCard
          title='Finished Goods Stock'
          value={
            selectedSKU === 'all-skus'
              ? '15,000'
              : selectedSKU === 'pistakio-classic'
                ? '6,581'
                : selectedSKU === 'pistakio-salted'
                  ? '3,638'
                  : '2,811'
          }
          subtitle='$105,000'
          borderColor='blue'
        />
        <MetricCard
          title='Forecasted Sales (4w)'
          value={`${Math.round(16500 * (1 + forecastAdjustment[0] / 100)).toLocaleString()} units`}
          subtitle={`$${Math.round(121100 * (1 + forecastAdjustment[0] / 100)).toLocaleString()}`}
          borderColor='blue'
          trend={forecastAdjustment[0]}
        />
      </div>

      {/* Chart */}
      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Demand vs Finished Goods Projection
          </h2>
          {isSimulating && (
            <div className='flex items-center gap-2 text-orange-600'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-orange-500' />
              <span className='text-sm font-medium'>Running Simulation</span>
            </div>
          )}
        </div>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='week' />
              <YAxis />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line
                type='monotone'
                dataKey='demand'
                stroke='#3b82f6'
                strokeWidth={2}
                name='Actual Demand'
                connectNulls={false}
              />
              <Line
                type='monotone'
                dataKey='finishedGoods'
                stroke='#10b981'
                strokeWidth={2}
                name='Finished Goods'
                connectNulls={false}
              />
              <Line
                type='monotone'
                dataKey='forecast'
                stroke='#f59e0b'
                strokeWidth={2}
                strokeDasharray='5 5'
                name='Forecast'
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className='mt-4 text-center text-sm text-gray-500'>
          Forecast begins at W5 • Simulation available • Adjust forecast with
          slider above
        </p>
      </div>

      {/* Sales Table */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Sales by SKU & Week
          </h2>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span className='font-medium'>A</span>
              <span>Actual</span>
              <span className='ml-4 font-medium'>F</span>
              <span>Forecast</span>
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-500'>Channel:</label>
              <Select
                value={selectedChannel}
                onValueChange={setSelectedChannel}
              >
                <SelectTrigger className='w-32'>
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
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='px-4 py-3 text-left font-medium text-gray-700'>
                  SKU / Week
                </th>
                <th className='px-4 py-3 text-center font-medium text-gray-700'>
                  <div>W33</div>
                  <div className='text-xs font-normal text-gray-500'>A</div>
                </th>
                <th className='px-4 py-3 text-center font-medium text-gray-700'>
                  <div>W34</div>
                  <div className='text-xs font-normal text-gray-500'>A</div>
                </th>
                <th className='px-4 py-3 text-center font-medium text-gray-700'>
                  <div>W35</div>
                  <div className='text-xs font-normal text-gray-500'>A</div>
                </th>
                <th className='px-4 py-3 text-center font-medium text-gray-700'>
                  <div>W36</div>
                  <div className='text-xs font-normal text-gray-500'>F</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, index) => (
                <tr
                  key={index}
                  className='cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50'
                >
                  <td className='px-4 py-4 font-medium text-gray-900'>
                    <div className='flex items-center gap-2'>
                      {row.sku}
                      {selectedSKU ===
                        row.sku.toLowerCase().replace(' ', '-') && (
                        <div className='h-2 w-2 rounded-full bg-blue-500' />
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div className='font-semibold text-gray-900'>
                      {row.w33.actual}
                    </div>
                    <div className='text-xs text-red-500'>{row.w33.left}</div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div className='font-semibold text-gray-900'>
                      {row.w34.actual}
                    </div>
                    <div className='text-xs text-red-500'>{row.w34.left}</div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div className='font-semibold text-gray-900'>
                      {row.w35.actual}
                    </div>
                    <div className='text-xs text-red-500'>{row.w35.left}</div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div
                      className={`font-semibold ${
                        forecastAdjustment[0] !== 0
                          ? 'text-orange-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {row.w36.forecast}
                      {forecastAdjustment[0] !== 0 && (
                        <TrendingUp className='ml-1 inline h-3 w-3' />
                      )}
                    </div>
                    <div className='text-xs text-red-500'>{row.w36.left}</div>
                  </td>
                </tr>
              ))}
              <tr className='border-b border-gray-200 bg-gray-50'>
                <td className='px-4 py-4 font-semibold text-gray-900'>Total</td>
                <td className='px-4 py-4 text-center font-semibold text-gray-900'>
                  {salesData.reduce((sum, row) => sum + row.w33.actual, 0)}
                </td>
                <td className='px-4 py-4 text-center font-semibold text-gray-900'>
                  {salesData.reduce((sum, row) => sum + row.w34.actual, 0)}
                </td>
                <td className='px-4 py-4 text-center font-semibold text-gray-900'>
                  {salesData.reduce((sum, row) => sum + row.w35.actual, 0)}
                </td>
                <td className='px-4 py-4 text-center font-semibold text-gray-900'>
                  {salesData.reduce((sum, row) => sum + row.w36.forecast, 0)}
                </td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='px-4 py-4 font-semibold text-blue-600'>
                  Finished Goods Balance
                </td>
                <td className='px-4 py-4 text-center font-semibold text-blue-600'>
                  14,350
                </td>
                <td className='px-4 py-4 text-center font-semibold text-blue-600'>
                  13,675
                </td>
                <td className='px-4 py-4 text-center font-semibold text-blue-600'>
                  13,030
                </td>
                <td className='px-4 py-4 text-center font-semibold text-blue-600'>
                  {(
                    13030 -
                    salesData.reduce((sum, row) => sum + row.w36.forecast, 0)
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        {/*<div className='mt-6 flex gap-4'>*/}
        {/*  <Button variant='outline' className='flex items-center gap-2'>*/}
        {/*    Export to Excel*/}
        {/*  </Button>*/}
        {/*  <Button variant='outline'>Schedule Report</Button>*/}
        {/*  <Button variant='outline'>Save Forecast</Button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
