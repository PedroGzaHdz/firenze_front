'use client';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
import { DateRangePicker } from '@heroui/date-picker';

const baseChartData = [
  { week: 'W33', demand: 2500, finishedGoods: 15000 },
  { week: 'W34', demand: 2500, finishedGoods: 12500 },
  { week: 'W35', demand: 2500, finishedGoods: 10500 },
  { week: 'W36', demand: 2500, finishedGoods: 8000 },
  { week: 'W37', demand: null, finishedGoods: null, forecast: 2600 },
  { week: 'W38', demand: null, finishedGoods: null, forecast: 2650 },
];

const baseCategoriesData = {
  'Pistakios': {
    products: {
      'Pistakio Classic': {
        w33: { actual: 330, left: '7,246 left' },
        w34: { actual: 345, left: '6,901 left' },
        w35: { actual: 320, left: '6,581 left' },
        w36: { forecast: 346, left: '6,235 left' },
      },
      'Pistakio Salted': {
        w33: { actual: 185, left: '4,003 left' },
        w34: { actual: 190, left: '3,813 left' },
        w35: { actual: 175, left: '3,638 left' },
        w36: { forecast: 192, left: '3,446 left' },
      },
      'Pistakio Chocolate': {
        w33: { actual: 135, left: '3,101 left' },
        w34: { actual: 140, left: '2,961 left' },
        w35: { actual: 150, left: '2,811 left' },
        w36: { forecast: 154, left: '2,657 left' },
      },
    }
  },
  'Almonds': {
    products: {
      'Almond Classic': {
        w33: { actual: 220, left: '5,120 left' },
        w34: { actual: 235, left: '4,885 left' },
        w35: { actual: 210, left: '4,675 left' },
        w36: { forecast: 238, left: '4,437 left' },
      },
      'Almond Honey': {
        w33: { actual: 165, left: '3,890 left' },
        w34: { actual: 170, left: '3,720 left' },
        w35: { actual: 155, left: '3,565 left' },
        w36: { forecast: 172, left: '3,393 left' },
      },
    }
  }
};

export default function SalesForecastPage() {
  const [selectedSKU, setSelectedSKU] = useState('all-categories');
  const [selectedChannel, setSelectedChannel] = useState('all-channels');
  // Backing week range derived from date picker (defaults show W33–W38)
  const [weekStart, setWeekStart] = useState(33);
  const [weekEnd, setWeekEnd] = useState(38);
  // Date range from DayPicker
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [forecastAdjustment, setForecastAdjustment] = useState([0]);
  const [chartData, setChartData] = useState(baseChartData);
  const [salesData, setSalesData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Estado para valores editables por categoría y producto
  const [editableActualValues, setEditableActualValues] = useState({
    'Pistakios': {
      'Pistakio Classic': { w33: 330, w34: 345, w35: 320, w36: 346 },
      'Pistakio Salted': { w33: 185, w34: 190, w35: 175, w36: 192 },
      'Pistakio Chocolate': { w33: 135, w34: 140, w35: 150, w36: 154 }
    },
    'Almonds': {
      'Almond Classic': { w33: 220, w34: 235, w35: 210, w36: 238 },
      'Almond Honey': { w33: 165, w34: 170, w35: 155, w36: 172 }
    }
  });
  
  const [editablePlanValues, setEditablePlanValues] = useState({
    'Pistakios': {
      'Pistakio Classic': { w33: 396, w34: 414, w35: 384, w36: 415 },
      'Pistakio Salted': { w33: 222, w34: 228, w35: 210, w36: 230 },
      'Pistakio Chocolate': { w33: 162, w34: 168, w35: 180, w36: 185 }
    },
    'Almonds': {
      'Almond Classic': { w33: 264, w34: 282, w35: 252, w36: 286 },
      'Almond Honey': { w33: 198, w34: 204, w35: 186, w36: 206 }
    }
  });

  // Estado para controlar qué categorías están expandidas
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Pistakios']));



  // Funciones para manejar cambios en valores editables
  const handleActualValueChange = (category, product, week, value) => {
    const numValue = parseInt(value) || 0;
    setEditableActualValues(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [product]: {
          ...prev[category][product],
          [week]: numValue
        }
      }
    }));
  };

  const handlePlanValueChange = (category, product, week, value) => {
    const numValue = parseInt(value) || 0;
    setEditablePlanValues(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [product]: {
          ...prev[category][product],
          [week]: numValue
        }
      }
    }));
  };

  // Función para alternar la expansión de categorías
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Función para calcular totales de categoría por semana
  const getCategoryTotal = (category, week, type = 'actual') => {
    const values = type === 'actual' ? editableActualValues : editablePlanValues;
    if (!values[category]) return 0;
    
    return Object.keys(values[category]).reduce((sum, product) => {
      return sum + (values[category][product][week] || 0);
    }, 0);
  };

  // Función para calcular el balance de Finished Goods dinámicamente
  const calculateFinishedGoodsBalanceRaw = (week, multiplier = 1) => {
    let initialStock = 15000; // Stock inicial
    let cumulativeDemand = 0;
    
    // Sumar la demanda acumulada hasta la semana actual
    const weeks = ['w33', 'w34', 'w35', 'w36'];
    const weekIndex = weeks.indexOf(week);
    
    for (let i = 0; i <= weekIndex; i++) {
      const weekKey = weeks[i];
      Object.keys(editableActualValues).forEach(category => {
        Object.keys(editableActualValues[category]).forEach(product => {
          cumulativeDemand += editableActualValues[category][product][weekKey] || 0;
        });
      });
    }
    
    const adjustedInitialStock = initialStock * multiplier;
    const adjustedDemand = cumulativeDemand * multiplier;
    
    return Math.max(0, Math.round(adjustedInitialStock - adjustedDemand));
  };

  // Función wrapper que aplica los multiplicadores actuales
  const calculateFinishedGoodsBalance = (week) => {
    let multiplier = 1;
    
    // Ajustar multiplicadores para la nueva estructura
    if (selectedSKU === 'pistakios') multiplier = 0.65; // Total categoría Pistakios
    else if (selectedSKU === 'almonds') multiplier = 0.35; // Total categoría Almonds
    else if (selectedSKU === 'pistakio-classic') multiplier = 0.30;
    else if (selectedSKU === 'pistakio-salted') multiplier = 0.18;
    else if (selectedSKU === 'pistakio-chocolate') multiplier = 0.17;
    else if (selectedSKU === 'almond-classic') multiplier = 0.22;
    else if (selectedSKU === 'almond-honey') multiplier = 0.13;

    if (selectedChannel !== 'all-channels') {
      if (selectedChannel === 'retail') multiplier *= 0.6;
      else if (selectedChannel === 'online') multiplier *= 0.3;
      else if (selectedChannel === 'wholesale') multiplier *= 0.1;
    }
    
    return calculateFinishedGoodsBalanceRaw(week, multiplier);
  };
  
  // ---------- Week helpers for dynamic range ----------
  const WEEK_MIN = 33;
  const WEEK_MAX = 46;
  const toWeekKey = (n) => `w${n}`;
  const toWeekLabel = (n) => `W${n}`;
  const clampWeek = (n) => Math.max(WEEK_MIN, Math.min(WEEK_MAX, n));
  const generateWeekNumbers = (start, end) => {
    const s = clampWeek(Math.min(start, end));
    const e = clampWeek(Math.max(start, end));
    return Array.from({ length: e - s + 1 }, (_, i) => s + i);
  };
  // Keep simple week clamp and range generation
  // ISO week number (1-53)
  const getISOWeek = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  // Efecto para marcar cuando el componente se hidrata
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // No popover handlers needed with HeroUI component

  // Update weeks when calendar range changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const ws = clampWeek(getISOWeek(dateRange.from));
      const we = clampWeek(getISOWeek(dateRange.to));
      setWeekStart(Math.min(ws, we));
      setWeekEnd(Math.max(ws, we));
    }
  }, [dateRange]);

  // Ensure weekEnd is always >= weekStart
  useEffect(() => {
    if (weekEnd < weekStart) setWeekEnd(weekStart);
  }, [weekStart, weekEnd]);

  // Actualizar datos cuando cambian los filtros o valores editables
  useEffect(() => {
    if (!isHydrated) return; // Esperar a que se hidrate antes de actualizar
    
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

      // Build chart data for selected week range (defaults to 33–38)
      const weeks = generateWeekNumbers(weekStart, weekEnd);

      // Forecast base uses W36 values
      let forecastBase = 0;
      if (selectedSKU === 'all-categories') {
        forecastBase = Object.keys(editableActualValues).reduce((sum, category) => {
          return sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => {
            return categorySum + (editableActualValues[category][product]['w36'] || 0);
          }, 0);
        }, 0);
      } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
        const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
        if (editableActualValues[categoryName]) {
          forecastBase = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => {
            return sum + (editableActualValues[categoryName][product]['w36'] || 0);
          }, 0);
        }
      } else {
        const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        Object.keys(editableActualValues).forEach(category => {
          if (editableActualValues[category][productName]) {
            forecastBase = editableActualValues[category][productName]['w36'] || 0;
          }
        });
      }

      const newChartData = weeks.map((wn) => {
        const label = toWeekLabel(wn);
        const key = toWeekKey(wn);
        const withinActuals = wn >= 33 && wn <= 36;

        if (withinActuals) {
          let weekDemand = 0;
          if (selectedSKU === 'all-categories') {
            weekDemand = Object.keys(editableActualValues).reduce((sum, category) => {
              return sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => {
                return categorySum + (editableActualValues[category][product][key] || 0);
              }, 0);
            }, 0);
          } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
            const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
            if (editableActualValues[categoryName]) {
              weekDemand = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => {
                return sum + (editableActualValues[categoryName][product][key] || 0);
              }, 0);
            }
          } else {
            const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            Object.keys(editableActualValues).forEach(category => {
              if (editableActualValues[category][productName]) {
                weekDemand = editableActualValues[category][productName][key] || 0;
              }
            });
          }

          const finishedGoodsBalance = calculateFinishedGoodsBalanceRaw(key, multiplier);
          return {
            week: label,
            demand: Math.round(weekDemand * multiplier),
            finishedGoods: finishedGoodsBalance,
            forecast: null,
          };
        }

        return {
          week: label,
          demand: null,
          finishedGoods: null,
          forecast: Math.round(forecastBase * multiplier * (1 + forecastAdjustment[0] / 100)),
        };
      });

      // Crear sales data con estructura de categorías
      let newSalesData = [];
      
      Object.keys(editableActualValues).forEach(categoryName => {
        // Agregar fila de categoría
        const categoryData = {
          type: 'category',
          name: categoryName,
          isExpanded: expandedCategories.has(categoryName),
          w33: {
            actual: getCategoryTotal(categoryName, 'w33', 'actual'),
            plan: getCategoryTotal(categoryName, 'w33', 'plan'),
          },
          w34: {
            actual: getCategoryTotal(categoryName, 'w34', 'actual'),
            plan: getCategoryTotal(categoryName, 'w34', 'plan'),
          },
          w35: {
            actual: getCategoryTotal(categoryName, 'w35', 'actual'),
            plan: getCategoryTotal(categoryName, 'w35', 'plan'),
          },
          w36: {
            forecast: getCategoryTotal(categoryName, 'w36', 'actual'),
            planForecast: getCategoryTotal(categoryName, 'w36', 'plan'),
          }
        };
        newSalesData.push(categoryData);
        
        // Si la categoría está expandida, agregar productos
        if (expandedCategories.has(categoryName)) {
          Object.keys(editableActualValues[categoryName]).forEach(productName => {
            const productData = {
              type: 'product',
              category: categoryName,
              name: productName,
              w33: {
                actual: editableActualValues[categoryName][productName].w33,
                plan: editablePlanValues[categoryName][productName].w33,
                left: `${6500 - (productName.length * 50)} left`
              },
              w34: {
                actual: editableActualValues[categoryName][productName].w34,
                plan: editablePlanValues[categoryName][productName].w34,
                left: `${6000 - (productName.length * 50)} left`
              },
              w35: {
                actual: editableActualValues[categoryName][productName].w35,
                plan: editablePlanValues[categoryName][productName].w35,
                left: `${5500 - (productName.length * 50)} left`
              },
              w36: {
                forecast: editableActualValues[categoryName][productName].w36,
                planForecast: editablePlanValues[categoryName][productName].w36,
                left: `${5000 - (productName.length * 50)} left`
              }
            };
            newSalesData.push(productData);
          });
        }
      });

      // Filtrar por selección si es necesario
      if (selectedSKU !== 'all-categories') {
        if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
          // Mostrar solo una categoría
          const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
          newSalesData = newSalesData.filter(item => 
            item.name === categoryName || item.category === categoryName
          );
        } else {
          // Mostrar solo un producto específico
          const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          newSalesData = newSalesData.filter(item => 
            item.name === productName || 
            (item.type === 'category' && Object.keys(editableActualValues[item.name] || {}).includes(productName))
          );
        }
      }

      setChartData(newChartData);
      setSalesData(newSalesData);
    };

    updateData();
  }, [selectedSKU, selectedChannel, forecastAdjustment, weekStart, weekEnd, editableActualValues, editablePlanValues, isHydrated, expandedCategories]);

  const getDaysOfCover = () => {
    const currentStock =
      selectedSKU === 'all-categories'
        ? 15000
        : selectedSKU === 'pistakios'
          ? 9750
        : selectedSKU === 'almonds'
          ? 5250
        : selectedSKU === 'pistakio-classic'
          ? 6581
          : selectedSKU === 'pistakio-salted'
            ? 3638
            : selectedSKU === 'pistakio-chocolate'
              ? 2811
            : selectedSKU === 'almond-classic'
              ? 4437
            : selectedSKU === 'almond-honey'
              ? 3393
            : 2500;
    const avgDemand =
      selectedSKU === 'all-categories'
        ? 1465
        : selectedSKU === 'pistakios'
          ? 850
        : selectedSKU === 'almonds'
          ? 385
        : selectedSKU === 'pistakio-classic'
          ? 346
          : selectedSKU === 'pistakio-salted'
            ? 192
            : selectedSKU === 'pistakio-chocolate'
              ? 154
            : selectedSKU === 'almond-classic'
              ? 238
            : selectedSKU === 'almond-honey'
              ? 172
            : 200;
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

  // Componente para input editable en la tabla
  const EditableCell = ({ value, onChange, type = 'actual' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      onChange(tempValue);
      setIsEditing(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        setTempValue(value);
        setIsEditing(false);
      }
    };

    return (
      <div className='relative'>
        {isEditing ? (
          <input
            type='number'
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className='w-full border border-blue-300 rounded px-2 py-1 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500'
            autoFocus
          />
        ) : (
          <div 
            className={`cursor-pointer hover:bg-gray-100 rounded px-2 py-1 font-semibold text-gray-900 ${
              type === 'plan' ? 'text-orange-600' : 'text-blue-600'
            }`}
            onClick={() => {
              setTempValue(value);
              setIsEditing(true);
            }}
          >
            {value}
          </div>
        )}
      </div>
    );
  };

  // Evitar hydration mismatch
  if (!isHydrated) {
    return (
      <div className='p-8'>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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
              <SelectItem value='all-categories'>All Categories</SelectItem>
              <SelectItem value='pistakios'>Pistakios Category</SelectItem>
              <SelectItem value='almonds'>Almonds Category</SelectItem>
              <SelectItem value='pistakio-classic'>Pistakio Classic</SelectItem>
              <SelectItem value='pistakio-salted'>Pistakio Salted</SelectItem>
              <SelectItem value='pistakio-chocolate'>Pistakio Chocolate</SelectItem>
              <SelectItem value='almond-classic'>Almond Classic</SelectItem>
              <SelectItem value='almond-honey'>Almond Honey</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='min-w-[280px]'>
          <label className='mb-2 block text-sm text-gray-500'>Date Range</label>
          <DateRangePicker
            className='w-full'
            selectionMode='range'
            placeholder='Select date range'
            classNames={{
              calendar: 'border border-gray-300',
              calendarContent : 'bg-white',
              separator: 'mx-2 text-gray-500',
            }}
            visibleMonths={2}
            showMonthAndYearPickers
            onChange={(val) => {
              // val has { start, end } as CalendarDate from @internationalized/date
              // Convert to JS Date for our ISO week mapping
              const toJS = (cd) => {
                if (!cd) return undefined;
                // CalendarDate has .year, .month, .day (1-based month)
                return new Date(cd.year, cd.month - 1, cd.day);
              };
              const from = toJS(val?.start);
              const to = toJS(val?.end);
              setDateRange({ from, to });
            }}
          />
          <div className='mt-1 text-xs text-gray-500'>
            Weeks {toWeekLabel(weekStart)} – {toWeekLabel(weekEnd)}
          </div>
        </div>
        {/* Forecast Adjustment slider eliminado */}
      </div>

      {/* Forecast Adjustment alert eliminado */}

      {/* Metrics Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <MetricCard
          title='Revenue'
          value={(() => {
            let totalRevenue = 0;
            let baseUnits = 0;
            
            if (editableActualValues && Object.keys(editableActualValues).length > 0) {
              if (selectedSKU === 'all-categories') {
                baseUnits = Object.keys(editableActualValues).reduce((sum, category) => 
                  sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                    categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0);
              } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                if (editableActualValues[categoryName]) {
                  baseUnits = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                    sum + (editableActualValues[categoryName][product]['w36'] || 0), 0);
                }
              } else {
                const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                for (const category of Object.keys(editableActualValues)) {
                  if (editableActualValues[category][productName]) {
                    baseUnits = editableActualValues[category][productName]['w36'] || 0;
                    break;
                  }
                }
              }
            } else {
              baseUnits = selectedSKU === 'all-categories' ? 1102
                : selectedSKU === 'pistakios' ? 692
                : selectedSKU === 'almonds' ? 410
                : selectedSKU === 'pistakio-classic' ? 346
                : selectedSKU === 'pistakio-salted' ? 192
                : selectedSKU === 'pistakio-chocolate' ? 154
                : selectedSKU === 'almond-classic' ? 238
                : selectedSKU === 'almond-honey' ? 172
                : 200;
            }
            
            // Average price per unit (based on $121,100 / 4,408 units from original data)
            const avgPricePerUnit = 27.5;
            totalRevenue = baseUnits * avgPricePerUnit * 4; // 4 weeks forecast
            
            return `$${Math.round(totalRevenue * (1 + forecastAdjustment[0] / 100)).toLocaleString()}`;
          })()}
          subtitle='4-week forecast revenue'
          borderColor='green'
          trend={forecastAdjustment[0]}
        />
        <MetricCard
          title='Units'
          value={(() => {
            if (editableActualValues && Object.keys(editableActualValues).length > 0) {
              if (selectedSKU === 'all-categories') {
                return Object.keys(editableActualValues).reduce((sum, category) => 
                  sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                    categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0).toLocaleString();
              } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                if (editableActualValues[categoryName]) {
                  return Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                    sum + (editableActualValues[categoryName][product]['w36'] || 0), 0).toLocaleString();
                }
              } else {
                const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                for (const category of Object.keys(editableActualValues)) {
                  if (editableActualValues[category][productName]) {
                    return (editableActualValues[category][productName]['w36'] || 0).toLocaleString();
                  }
                }
              }
            }
            return selectedSKU === 'all-categories' ? '1,102'
              : selectedSKU === 'pistakios' ? '692'
              : selectedSKU === 'almonds' ? '410'
              : selectedSKU === 'pistakio-classic' ? '346'
              : selectedSKU === 'pistakio-salted' ? '192'
              : selectedSKU === 'pistakio-chocolate' ? '154'
              : selectedSKU === 'almond-classic' ? '238'
              : selectedSKU === 'almond-honey' ? '172'
              : '200';
          })()}
          subtitle='Current weekly forecast'
          borderColor='blue'
        />
        <MetricCard
          title='Needed Units'
          value={(() => {
            // Calculate needed units based on gap between current stock and target coverage
            let currentStock = 0;
            let weeklyDemand = 0;
            let targetCoverage = 14; // target days of coverage
            
            if (editableActualValues && Object.keys(editableActualValues).length > 0) {
              if (selectedSKU === 'all-categories') {
                currentStock = 15000; // base stock
                weeklyDemand = Object.keys(editableActualValues).reduce((sum, category) => 
                  sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                    categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0);
              } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                currentStock = selectedSKU === 'pistakios' ? 9750 : 5250;
                const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                if (editableActualValues[categoryName]) {
                  weeklyDemand = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                    sum + (editableActualValues[categoryName][product]['w36'] || 0), 0);
                }
              } else {
                currentStock = selectedSKU === 'pistakio-classic' ? 6581
                  : selectedSKU === 'pistakio-salted' ? 3638
                  : selectedSKU === 'pistakio-chocolate' ? 2811
                  : selectedSKU === 'almond-classic' ? 4437
                  : selectedSKU === 'almond-honey' ? 3393
                  : 2500;
                const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                for (const category of Object.keys(editableActualValues)) {
                  if (editableActualValues[category][productName]) {
                    weeklyDemand = editableActualValues[category][productName]['w36'] || 0;
                    break;
                  }
                }
              }
            } else {
              currentStock = selectedSKU === 'all-categories' ? 15000
                : selectedSKU === 'pistakios' ? 9750
                : selectedSKU === 'almonds' ? 5250
                : selectedSKU === 'pistakio-classic' ? 6581
                : selectedSKU === 'pistakio-salted' ? 3638
                : selectedSKU === 'pistakio-chocolate' ? 2811
                : selectedSKU === 'almond-classic' ? 4437
                : selectedSKU === 'almond-honey' ? 3393
                : 2500;
              weeklyDemand = selectedSKU === 'all-categories' ? 1102
                : selectedSKU === 'pistakios' ? 692
                : selectedSKU === 'almonds' ? 410
                : selectedSKU === 'pistakio-classic' ? 346
                : selectedSKU === 'pistakio-salted' ? 192
                : selectedSKU === 'pistakio-chocolate' ? 154
                : selectedSKU === 'almond-classic' ? 238
                : selectedSKU === 'almond-honey' ? 172
                : 200;
            }
            
            const dailyDemand = weeklyDemand / 7;
            const targetStock = dailyDemand * targetCoverage;
            const neededUnits = Math.max(0, Math.round(targetStock - currentStock));
            
            return neededUnits.toLocaleString();
          })()}
          subtitle='To reach 14-day coverage'
          borderColor={
            (() => {
              // Calculate if we need units based on current coverage
              let currentStock = 0;
              let weeklyDemand = 0;
              
              if (editableActualValues && Object.keys(editableActualValues).length > 0) {
                if (selectedSKU === 'all-categories') {
                  currentStock = 15000;
                  weeklyDemand = Object.keys(editableActualValues).reduce((sum, category) => 
                    sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                      categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0);
                } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                  currentStock = selectedSKU === 'pistakios' ? 9750 : 5250;
                  const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                  if (editableActualValues[categoryName]) {
                    weeklyDemand = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                      sum + (editableActualValues[categoryName][product]['w36'] || 0), 0);
                  }
                } else {
                  currentStock = selectedSKU === 'pistakio-classic' ? 6581
                    : selectedSKU === 'pistakio-salted' ? 3638
                    : selectedSKU === 'pistakio-chocolate' ? 2811
                    : selectedSKU === 'almond-classic' ? 4437
                    : selectedSKU === 'almond-honey' ? 3393
                    : 2500;
                  const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                  for (const category of Object.keys(editableActualValues)) {
                    if (editableActualValues[category][productName]) {
                      weeklyDemand = editableActualValues[category][productName]['w36'] || 0;
                      break;
                    }
                  }
                }
              } else {
                currentStock = selectedSKU === 'all-categories' ? 15000
                  : selectedSKU === 'pistakios' ? 9750
                  : selectedSKU === 'almonds' ? 5250
                  : selectedSKU === 'pistakio-classic' ? 6581
                  : selectedSKU === 'pistakio-salted' ? 3638
                  : selectedSKU === 'pistakio-chocolate' ? 2811
                  : selectedSKU === 'almond-classic' ? 4437
                  : selectedSKU === 'almond-honey' ? 3393
                  : 2500;
                weeklyDemand = selectedSKU === 'all-categories' ? 1102
                  : selectedSKU === 'pistakios' ? 692
                  : selectedSKU === 'almonds' ? 410
                  : selectedSKU === 'pistakio-classic' ? 346
                  : selectedSKU === 'pistakio-salted' ? 192
                  : selectedSKU === 'pistakio-chocolate' ? 154
                  : selectedSKU === 'almond-classic' ? 238
                  : selectedSKU === 'almond-honey' ? 172
                  : 200;
              }
              
              const dailyDemand = weeklyDemand / 7;
              const currentCoverage = dailyDemand > 0 ? currentStock / dailyDemand : 0;
              
              return currentCoverage >= 14 ? 'green' : currentCoverage >= 10 ? 'yellow' : 'red';
            })()
          }
          trend={0}
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
        <div className='mt-4 text-center text-sm text-gray-500'>
          <p>
            {toWeekLabel(weekStart)}–{toWeekLabel(weekEnd)} selected • W33–W36 show Actuals from table • W37+ are Forecast based on W36
          </p>
          <p className='mt-1 text-xs text-blue-600'>
            💡 Edit values in the table below to see changes reflected here
          </p>
          <div className='mt-2 flex justify-center gap-6 text-xs'>
            <div className='flex items-center gap-1'>
              <div className='w-3 h-0.5 bg-blue-500'></div>
              <span>Actual Demand (Editable)</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-3 h-0.5 bg-green-500'></div>
              <span>Finished Goods Stock</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-3 h-0.5 bg-orange-500 border-dashed'></div>
              <span>Demand Forecast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Sales by SKU & Week
              </h2>
              <p className='text-sm text-gray-500 mt-1'>
                Click on any value to edit • Changes affect the forecast chart
              </p>
            </div>
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
          </div>        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='w-32 px-4 py-3 text-left font-medium text-gray-700'>
                  SKU / Week
                </th>
                <th className='w-20 px-4 py-3 text-center font-medium text-gray-700'>
                  Type
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
                <React.Fragment key={index}>
                  {row.type === 'category' ? (
                    // Filas de Categoría
                    <>
                      {/* Fila Actual de Categoría */}
                      <tr className='hover:bg-blue-25 border-b border-gray-100 transition-colors bg-blue-50'>
                        <td
                          rowSpan='2'
                          className='w-40 border-r border-gray-200 px-4 py-4 align-middle font-bold text-blue-900'
                        >
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => toggleCategoryExpansion(row.name)}
                              className='flex items-center gap-1 hover:bg-blue-100 p-1 rounded'
                            >
                              {row.isExpanded ? (
                                <ChevronDown className='h-4 w-4' />
                              ) : (
                                <ChevronRight className='h-4 w-4' />
                              )}
                              {row.name}
                            </button>
                            {(selectedSKU === row.name.toLowerCase()) && (
                              <div className='h-2 w-2 rounded-full bg-blue-500' />
                            )}
                          </div>
                        </td>
                        <td className='w-20 px-4 py-2 text-center'>
                          <span className='rounded-lg bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700'>
                            Actual
                          </span>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-blue-700'>
                            {row.w33.actual}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-blue-700'>
                            {row.w34.actual}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-blue-700'>
                            {row.w35.actual}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-blue-700'>
                            {row.w36.forecast}
                          </div>
                        </td>
                      </tr>

                      {/* Fila Plan de Categoría */}
                      <tr className='border-b-2 border-blue-200 transition-colors bg-orange-50 hover:bg-orange-75'>
                        <td className='px-4 py-2 text-center'>
                          <span className='rounded-lg bg-orange-100 px-4 py-1 text-sm font-bold text-orange-700'>
                            Plan
                          </span>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-orange-700'>
                            {row.w33.plan}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-orange-700'>
                            {row.w34.plan}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-orange-700'>
                            {row.w35.plan}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <div className='font-bold text-orange-700'>
                            {row.w36.planForecast}
                          </div>
                        </td>
                      </tr>
                    </>
                  ) : (
                    // Filas de Producto (cuando la categoría está expandida)
                    <>
                      {/* Fila Actual de Producto */}
                      <tr className='hover:bg-gray-25 border-b border-gray-100 transition-colors'>
                        <td
                          rowSpan='2'
                          className='w-40 border-r border-gray-200 px-4 py-4 align-middle font-medium text-gray-900 pl-8'
                        >
                          <div className='flex items-center gap-2'>
                            <span className='text-gray-400'>└</span>
                            {row.name}
                            {selectedSKU === row.name.toLowerCase().replace(' ', '-') && (
                              <div className='h-2 w-2 rounded-full bg-blue-500' />
                            )}
                          </div>
                        </td>
                        <td className='w-20 px-4 py-2 text-center'>
                          <span className='rounded-lg bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600'>
                            Actual
                          </span>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w33.actual}
                            onChange={(value) => handleActualValueChange(row.category, row.name, 'w33', value)}
                            type='actual'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w34.actual}
                            onChange={(value) => handleActualValueChange(row.category, row.name, 'w34', value)}
                            type='actual'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w35.actual}
                            onChange={(value) => handleActualValueChange(row.category, row.name, 'w35', value)}
                            type='actual'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w36.forecast}
                            onChange={(value) => handleActualValueChange(row.category, row.name, 'w36', value)}
                            type='actual'
                          />
                        </td>
                      </tr>

                      {/* Fila Plan de Producto */}
                      <tr className='border-b border-gray-100 transition-colors hover:bg-gray-50'>
                        <td className='px-4 py-2 text-center'>
                          <span className='rounded-lg bg-orange-50 px-4 py-1 text-sm font-medium text-orange-600'>
                            Plan
                          </span>
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w33.plan}
                            onChange={(value) => handlePlanValueChange(row.category, row.name, 'w33', value)}
                            type='plan'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w34.plan}
                            onChange={(value) => handlePlanValueChange(row.category, row.name, 'w34', value)}
                            type='plan'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w35.plan}
                            onChange={(value) => handlePlanValueChange(row.category, row.name, 'w35', value)}
                            type='plan'
                          />
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <EditableCell
                            value={row.w36.planForecast}
                            onChange={(value) => handlePlanValueChange(row.category, row.name, 'w36', value)}
                            type='plan'
                          />
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))}
              {/* Fila del Balance de Productos Terminados */}
              <tr className='bg-gradient-to-r from-green-50 to-blue-50 border-t-2 border-green-200'>
                <td className='px-4 py-4 font-semibold text-green-700'>
                  <div className='flex items-center gap-2'>
                    Finished Goods Balance
                    <div className='text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full'>
                      Stock Remaining
                    </div>
                  </div>
                </td>
                <td className='px-4 py-4 text-center'>
                  <span className='rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-700'>
                    Balance
                  </span>
                </td>
                <td className='px-4 py-4 text-center'>
                  <div className='font-semibold text-green-700'>
                    {calculateFinishedGoodsBalance('w33').toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    -{Object.keys(editableActualValues).reduce((sum, category) => 
                      sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                        categorySum + (editableActualValues[category][product]['w33'] || 0), 0), 0).toLocaleString()} sold
                  </div>
                </td>
                <td className='px-4 py-4 text-center'>
                  <div className='font-semibold text-green-700'>
                    {calculateFinishedGoodsBalance('w34').toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    -{Object.keys(editableActualValues).reduce((sum, category) => 
                      sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                        categorySum + (editableActualValues[category][product]['w34'] || 0), 0), 0).toLocaleString()} sold
                  </div>
                </td>
                <td className='px-4 py-4 text-center'>
                  <div className='font-semibold text-green-700'>
                    {calculateFinishedGoodsBalance('w35').toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    -{Object.keys(editableActualValues).reduce((sum, category) => 
                      sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                        categorySum + (editableActualValues[category][product]['w35'] || 0), 0), 0).toLocaleString()} sold
                  </div>
                </td>
                <td className='px-4 py-4 text-center'>
                  <div className='font-semibold text-green-700'>
                    {calculateFinishedGoodsBalance('w36').toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    -{Object.keys(editableActualValues).reduce((sum, category) => 
                      sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                        categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0).toLocaleString()} sold
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Nota explicativa sobre Finished Goods Balance */}
        <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <h3 className='font-medium text-green-800'>Finished Goods Balance Explained</h3>
          </div>
          <p className='text-sm text-green-700 mb-2'>
            The balance shows remaining inventory after each week's sales:
          </p>
          <ul className='text-xs text-green-600 space-y-1 ml-4'>
            <li>• Starts with initial stock (varies by SKU/Channel filter)</li>
            <li>• Subtracts cumulative sales week by week</li>
            <li>• Updates automatically when you edit Actual values above</li>
            <li>• Green line in chart represents this same data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
