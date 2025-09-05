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
import {
  MessageCircle,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';
import AIAssistantTrigger from '@/components/aiChat/ai-assistant-trigger';

const baseMaterialsData = [
  {
    id: 1,
    item: 'Pistachios (Raw)',
    onHand: 2500,
    baseNeeded: 1332,
    baseCost: 0,
    status: 'sufficient',
    unit: 'lbs',
  },
  {
    id: 2,
    item: 'Primary Packaging',
    onHand: 850,
    baseNeeded: 1110,
    baseCost: 109,
    status: 'insufficient',
    unit: 'units',
  },
  {
    id: 3,
    item: 'Product Labels',
    onHand: 5000,
    baseNeeded: 1110,
    baseCost: 0,
    status: 'sufficient',
    unit: 'units',
  },
  {
    id: 4,
    item: 'Shipping Boxes',
    onHand: 200,
    baseNeeded: 278,
    baseCost: 94,
    status: 'insufficient',
    unit: 'units',
  },
];

const skuOptions = [
  {
    value: 'pistakio-original',
    label: 'Pistakio Original',
    baseQuantity: 5550,
    baseCost: 36075,
  },
  {
    value: 'pistakio-salted',
    label: 'Pistakio Salted',
    baseQuantity: 4200,
    baseCost: 28500,
  },
  {
    value: 'pistakio-premium',
    label: 'Pistakio Premium',
    baseQuantity: 3800,
    baseCost: 45600,
  },
];

export default function PlanProductionPage() {
  const [selectedSku, setSelectedSku] = useState('pistakio-original');
  const [runAdjustment, setRunAdjustment] = useState([0]);
  const [materialsData, setMaterialsData] = useState(baseMaterialsData);
  const [notification, setNotification] = useState(null);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [orderedMaterials, setOrderedMaterials] = useState(new Set());

  const currentSku = skuOptions.find((sku) => sku.value === selectedSku);
  const adjustmentFactor = 1 + runAdjustment[0] / 100;
  const adjustedQuantity = Math.round(
    currentSku.baseQuantity * adjustmentFactor,
  );
  const adjustedCost = Math.round(currentSku.baseCost * adjustmentFactor);

  useEffect(() => {
    // Update materials based on SKU and adjustment
    const updatedMaterials = baseMaterialsData.map((material) => {
      const adjustedNeeded = Math.round(
        (material.baseNeeded || 0) * adjustmentFactor,
      );
      const adjustedCost = (material.baseCost || 0) * adjustmentFactor;
      const isOrderedNow = orderedMaterials.has(material.id);
      const effectiveOnHand = isOrderedNow
        ? (material.onHand || 0) + adjustedNeeded
        : material.onHand || 0;

      return {
        ...material,
        needed: adjustedNeeded,
        cost: adjustedCost,
        status:
          effectiveOnHand >= adjustedNeeded ? 'sufficient' : 'insufficient',
      };
    });
    setMaterialsData(updatedMaterials);
  }, [selectedSku, runAdjustment, orderedMaterials, adjustmentFactor]);

  const handleOrderMaterial = (materialId) => {
    const newOrderedMaterials = new Set(orderedMaterials);
    newOrderedMaterials.add(materialId);
    setOrderedMaterials(newOrderedMaterials);

    setNotification({
      type: 'success',
      message: 'Material order placed successfully!',
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleSuggestedRun = () => {
    setRunAdjustment([-24]); // Reduce to 4,200 units (24% reduction)
    setNotification({
      type: 'info',
      message: 'Production run adjusted to suggested quantity',
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const calculateCoverDays = () => {
    const dailyDemand = 277;
    return Math.round((adjustedQuantity || 0) / dailyDemand);
  };

  const calculateCashUsage = () => {
    const totalCash = 120000;
    return (((adjustedCost || 0) / totalCash) * 100).toFixed(1);
  };

  const getCashUsageColor = () => {
    const usage = parseFloat(calculateCashUsage());
    if (usage <= 25) return 'bg-green-500';
    if (usage <= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return (
    <div className='p-8'>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg p-4 shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'border border-green-200 bg-green-50'
              : notification.type === 'info'
                ? 'border border-blue-200 bg-blue-50'
                : 'border border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className='flex items-center gap-2'>
            {notification.type === 'success' && (
              <CheckCircle className='h-5 w-5 text-green-500' />
            )}
            {notification.type === 'info' && (
              <AlertTriangle className='h-5 w-5 text-blue-500' />
            )}
            <span
              className={`text-sm font-medium ${
                notification.type === 'success'
                  ? 'text-green-800'
                  : notification.type === 'info'
                    ? 'text-blue-800'
                    : 'text-yellow-800'
              }`}
            >
              {notification.message}
            </span>
            <button
              onClick={() => setNotification(null)}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Plan Production Run
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Optimize production quantity and material requirements
          </p>
        </div>
        <AIAssistantTrigger />
      </div>

      {/* Filters */}
      <div className='mb-8 flex gap-4'>
        <div>
          <label className='mb-2 block text-sm text-gray-500'>
            Brand / SKU
          </label>
          <Select value={selectedSku} onValueChange={setSelectedSku}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {skuOptions.map((sku) => (
                <SelectItem key={sku.value} value={sku.value}>
                  {sku.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='mb-2 block text-sm text-gray-500'>
            Run Adjustment {runAdjustment[0]}%
          </label>
          <div className='w-48 pt-2'>
            <Slider
              value={runAdjustment}
              onValueChange={setRunAdjustment}
              min={-50}
              max={100}
              step={1}
              className='w-full bg-blue-300'
            />
            <div className='mt-1 flex justify-between text-xs text-gray-400'>
              <span>-50%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Run Impact Section */}
      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <h2 className='mb-6 text-xl font-semibold text-gray-900'>Run Impact</h2>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Left side - Run details */}
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Run Quantity</span>
              <div className='text-right'>
                <span className='text-lg font-semibold'>
                  {adjustedQuantity.toLocaleString()}
                </span>
                <span className='ml-1 text-gray-500'>units</span>
                {runAdjustment[0] !== 0 && (
                  <div
                    className={`text-xs ${runAdjustment[0] > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {runAdjustment[0] > 0 ? '+' : ''}
                    {(
                      adjustedQuantity - currentSku.baseQuantity
                    ).toLocaleString()}{' '}
                    units
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Coverage Days:</span>
              <span className='font-semibold'>{calculateCoverDays()} days</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Projected Finished Goods:</span>
              <span className='font-semibold'>
                {(adjustedQuantity + 15000).toLocaleString()} units
              </span>
            </div>
          </div>

          {/* Right side - Cost breakdown */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold'>
                ${adjustedCost.toLocaleString()}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              >
                Breakdown{' '}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${showCostBreakdown ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>

            {showCostBreakdown && (
              <div className='space-y-2 border-t pt-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Labor:</span>
                  <span>
                    ${Math.round(adjustedCost * 0.4).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Materials:</span>
                  <span>
                    ${Math.round(adjustedCost * 0.45).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Overhead:</span>
                  <span>
                    ${Math.round(adjustedCost * 0.15).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className='mt-4'>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Cash Usage</span>
                <span
                  className={`font-medium ${
                    parseFloat(calculateCashUsage()) <= 25
                      ? 'text-green-600'
                      : parseFloat(calculateCashUsage()) <= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {calculateCashUsage()}%
                </span>
              </div>
              <div className='h-2 w-full rounded-full bg-gray-200'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getCashUsageColor()}`}
                  style={{ width: `${calculateCashUsage()}%` }}
                ></div>
              </div>
              <div className='mt-1 flex justify-between text-xs text-gray-500'>
                <span>Low (0-25%)</span>
                <span>Medium (25-50%)</span>
                <span>High (50%+)</span>
              </div>
            </div>

            <div className='flex justify-between border-t pt-2'>
              <span className='text-gray-500'>Cash After Run:</span>
              <span className='font-semibold'>
                ${(120000 - adjustedCost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Check */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h2 className='mb-6 text-xl font-semibold text-gray-900'>
          Materials Check
        </h2>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  Item
                </th>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  On-hand qty
                </th>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  Needed qty
                </th>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  Needed $
                </th>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  Status
                </th>
                <th className='py-3 text-left text-sm font-medium text-gray-500'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {materialsData.map((material) => (
                <tr
                  key={material.id}
                  className='border-b border-gray-100 transition-colors hover:bg-gray-50'
                >
                  <td className='py-4 text-sm font-medium text-gray-900'>
                    {material.item}
                  </td>
                  <td className='py-4 text-sm text-gray-600'>
                    {(material.needed || 0).toLocaleString()} {material.unit}
                  </td>
                  <td className='py-4 text-sm text-gray-600'>
                    {(material.cost || 0) > 0
                      ? `$${(material.cost || 0).toLocaleString()}`
                      : '-'}
                  </td>
                  <td className='py-4 text-sm text-gray-600'>
                    {material.cost > 0
                      ? `$${material.cost.toLocaleString()}`
                      : '-'}
                  </td>
                  <td className='py-4'>
                    {material.status === 'sufficient' ? (
                      <div className='flex items-center gap-2'>
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-500'>
                          <CheckCircle className='h-3 w-3 text-white' />
                        </div>
                        <span className='text-xs font-medium text-green-600'>
                          Sufficient
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500'>
                          <AlertTriangle className='h-3 w-3 text-white' />
                        </div>
                        <span className='text-xs font-medium text-yellow-600'>
                          Short{' '}
                          {(material.needed - material.onHand).toLocaleString()}{' '}
                          {material.unit}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className='py-4'>
                    {material.status === 'insufficient' &&
                    !orderedMaterials.has(material.id) ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleOrderMaterial(material.id)}
                        className='flex items-center gap-1 hover:border-blue-300 hover:bg-blue-50'
                      >
                        <ShoppingCart className='h-3 w-3' />
                        Order
                      </Button>
                    ) : orderedMaterials.has(material.id) ? (
                      <div className='flex items-center gap-1 text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span className='text-xs font-medium'>Ordered</span>
                      </div>
                    ) : (
                      <span className='text-gray-400'>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Smart Suggestion */}
        {runAdjustment[0] > -24 && (
          <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
            <div className='flex items-start gap-2'>
              <div className='mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500'>
                <AlertTriangle className='h-3 w-3 text-white' />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-700'>
                  Reducing the run to{' '}
                  {Math.round(currentSku.baseQuantity * 0.76).toLocaleString()}{' '}
                  units would still meet demand and release $
                  {Math.round(currentSku.baseCost * 0.24).toLocaleString()} back
                  to cashflow.
                </p>
                <Button
                  variant='link'
                  className='mt-1 h-auto p-0 text-sm text-blue-600 hover:text-blue-700'
                  onClick={handleSuggestedRun}
                >
                  ← Apply Suggested Run
                </Button>
              </div>
            </div>
          </div>
        )}

        {runAdjustment[0] === -24 && (
          <div className='mt-6 rounded-lg border border-green-200 bg-green-50 p-4'>
            <div className='flex items-start gap-2'>
              <CheckCircle className='mt-0.5 h-5 w-5 text-green-600' />
              <div className='flex-1'>
                <p className='text-sm font-medium text-green-700'>
                  Optimal production run applied! This configuration balances
                  demand coverage with cash flow efficiency.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
