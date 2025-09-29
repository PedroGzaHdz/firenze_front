'use client';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, RotateCcw, TrendingUp, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [weekRange, setWeekRange] = useState('4w');
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

  const getFilteredChartData = (data, range) => {
    if (range === '4w') {
      return data.slice(0, 6); // W33-W38 (4 semanas históricas + 2 forecast)
    } else if (range === '8w') {
      // Extender datos para 8 semanas
      const extendedData = [...data];
      for (let i = 39; i <= 42; i++) {
        extendedData.push({
          week: `W${i}`,
          demand: null,
          finishedGoods: null,
          forecast: Math.round(2600 + (i - 37) * 50),
        });
      }
      return extendedData;
    } else if (range === '12w') {
      // Extender datos para 12 semanas
      const extendedData = [...data];
      for (let i = 39; i <= 46; i++) {
        extendedData.push({
          week: `W${i}`,
          demand: null,
          finishedGoods: null,
          forecast: Math.round(2600 + (i - 37) * 50),
        });
      }
      return extendedData;
    }
    return data;
  };

  // Efecto para marcar cuando el componente se hidrata
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

      // Obtener datos filtrados por rango de semanas
      const baseData = getFilteredChartData(baseChartData, weekRange);

      // Mapeo de semanas: posiciones 0-3 del chart corresponden a las semanas W33-W36 de la tabla
      const weekMapping = { 0: 'w33', 1: 'w34', 2: 'w35', 3: 'w36' };

      // Actualizar chart data con valores reales de la tabla
      const newChartData = baseData.map((item, index) => {
        if (index < 4) {
          // Para las primeras 4 semanas (W33-W36), usar los valores editables actuales
          let weekDemand = 0;
          
          if (selectedSKU === 'all-categories') {
            // Sumar todas las categorías y productos
            weekDemand = Object.keys(editableActualValues).reduce((sum, category) => {
              return sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => {
                const weekKey = weekMapping[index];
                return categorySum + (editableActualValues[category][product][weekKey] || 0);
              }, 0);
            }, 0);
          } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
            // Sumar una categoría completa
            const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
            if (editableActualValues[categoryName]) {
              weekDemand = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => {
                const weekKey = weekMapping[index];
                return sum + (editableActualValues[categoryName][product][weekKey] || 0);
              }, 0);
            }
          } else {
            // Usar un producto específico
            const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const weekKey = weekMapping[index];
            
            // Buscar el producto en todas las categorías
            let found = false;
            Object.keys(editableActualValues).forEach(category => {
              if (editableActualValues[category][productName]) {
                weekDemand = editableActualValues[category][productName][weekKey] || 0;
                found = true;
              }
            });
          }
          
          // Calcular finished goods usando la misma función que la tabla
          const weekKeys = ['w33', 'w34', 'w35', 'w36'];
          const currentWeek = weekKeys[index];
          const finishedGoodsBalance = calculateFinishedGoodsBalanceRaw(currentWeek, multiplier);
          
          return {
            ...item,
            demand: Math.round(weekDemand * multiplier),
            finishedGoods: finishedGoodsBalance,
          };
        } else {
          // Para forecast (W5 en adelante), usar el valor W36 como base + ajuste del slider
          let forecastBase = 0;
          
          if (selectedSKU === 'all-categories') {
            // Usar W36 como base para forecast de todas las categorías
            forecastBase = Object.keys(editableActualValues).reduce((sum, category) => {
              return sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => {
                return categorySum + (editableActualValues[category][product]['w36'] || 0);
              }, 0);
            }, 0);
          } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
            // Usar W36 de una categoría completa
            const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
            if (editableActualValues[categoryName]) {
              forecastBase = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => {
                return sum + (editableActualValues[categoryName][product]['w36'] || 0);
              }, 0);
            }
          } else {
            // Usar W36 de un producto específico
            const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            Object.keys(editableActualValues).forEach(category => {
              if (editableActualValues[category][productName]) {
                forecastBase = editableActualValues[category][productName]['w36'] || 0;
              }
            });
          }

          return {
            ...item,
            demand: null,
            finishedGoods: null,
            forecast: Math.round(forecastBase * multiplier * (1 + forecastAdjustment[0] / 100)),
          };
        }
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
  }, [selectedSKU, selectedChannel, forecastAdjustment, weekRange, editableActualValues, editablePlanValues, isHydrated, expandedCategories]);

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
        {/* Forecast Adjustment slider eliminado */}
      </div>

      {/* Forecast Adjustment alert eliminado */}

      {/* Metrics Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <MetricCard
          title='Days of Cover'
          value={(() => {
            // Stock actual = balance de W36 (dinámico) o valor estático
            let stock;
            let totalDemand = 0;
            let count = 0;
            const weeks = ['w33', 'w34', 'w35', 'w36'];
            
            if (editableActualValues && Object.keys(editableActualValues).length > 0) {
              stock = (() => {
                try {
                  if (selectedSKU === 'all-categories') {
                    return Object.keys(editableActualValues).reduce((sum, category) => 
                      sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                        categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0);
                  } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                    const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                    if (editableActualValues[categoryName]) {
                      return Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                        sum + (editableActualValues[categoryName][product]['w36'] || 0), 0);
                    }
                  } else {
                    const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    for (const category of Object.keys(editableActualValues)) {
                      if (editableActualValues[category][productName]) {
                        return editableActualValues[category][productName]['w36'] || 0;
                      }
                    }
                  }
                  return 0;
                } catch { return undefined; }
              })();
              
              weeks.forEach(week => {
                if (selectedSKU === 'all-categories') {
                  Object.keys(editableActualValues).forEach(category => {
                    Object.keys(editableActualValues[category]).forEach(product => {
                      totalDemand += editableActualValues[category][product][week] || 0;
                      count++;
                    });
                  });
                } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                  const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                  if (editableActualValues[categoryName]) {
                    Object.keys(editableActualValues[categoryName]).forEach(product => {
                      totalDemand += editableActualValues[categoryName][product][week] || 0;
                      count++;
                    });
                  }
                } else {
                  const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                  for (const category of Object.keys(editableActualValues)) {
                    if (editableActualValues[category][productName]) {
                      totalDemand += editableActualValues[category][productName][week] || 0;
                      count++;
                    }
                  }
                }
              });
            }
            
            if (!stock || stock === 0) {
              stock = selectedSKU === 'all-categories' ? 15000
                : selectedSKU === 'pistakios' ? 9750
                : selectedSKU === 'almonds' ? 5250
                : selectedSKU === 'pistakio-classic' ? 6581
                : selectedSKU === 'pistakio-salted' ? 3638
                : selectedSKU === 'pistakio-chocolate' ? 2811
                : selectedSKU === 'almond-classic' ? 4437
                : selectedSKU === 'almond-honey' ? 3393
                : 2500;
              
              totalDemand = selectedSKU === 'all-categories' ? 1465 * 4
                : selectedSKU === 'pistakios' ? 850 * 4
                : selectedSKU === 'almonds' ? 385 * 4
                : selectedSKU === 'pistakio-classic' ? 346 * 4
                : selectedSKU === 'pistakio-salted' ? 192 * 4
                : selectedSKU === 'pistakio-chocolate' ? 154 * 4
                : selectedSKU === 'almond-classic' ? 238 * 4
                : selectedSKU === 'almond-honey' ? 172 * 4
                : 200 * 4;
              count = 4;
            }
            const avgDemand = count > 0 ? totalDemand / count : 1;
            return avgDemand > 0 ? Math.round(stock / avgDemand) : 0;
          })()}
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
            return selectedSKU === 'all-categories' ? '15,000'
              : selectedSKU === 'pistakios' ? '9,750'
              : selectedSKU === 'almonds' ? '5,250'
              : selectedSKU === 'pistakio-classic' ? '6,581'
              : selectedSKU === 'pistakio-salted' ? '3,638'
              : selectedSKU === 'pistakio-chocolate' ? '2,811'
              : selectedSKU === 'almond-classic' ? '4,437'
              : selectedSKU === 'almond-honey' ? '3,393'
              : '2,500';
          })()}
          subtitle='$105,000'
          borderColor='blue'
        />
        <MetricCard
          title='Forecasted Sales (4w)'
          value={(() => {
            // Suma de forecast de W37-W40
            let forecast = 0;
            let multiplier = 1;
            
            // Ajustar multiplicadores para la nueva estructura
            if (selectedSKU === 'pistakios') multiplier = 0.65;
            else if (selectedSKU === 'almonds') multiplier = 0.35;
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
            
            // Usar forecast base de la última semana editable
            let base = 0;
            if (editableActualValues && Object.keys(editableActualValues).length > 0) {
              if (selectedSKU === 'all-categories') {
                base = Object.keys(editableActualValues).reduce((sum, category) => 
                  sum + Object.keys(editableActualValues[category]).reduce((categorySum, product) => 
                    categorySum + (editableActualValues[category][product]['w36'] || 0), 0), 0);
              } else if (selectedSKU === 'pistakios' || selectedSKU === 'almonds') {
                const categoryName = selectedSKU.charAt(0).toUpperCase() + selectedSKU.slice(1);
                if (editableActualValues[categoryName]) {
                  base = Object.keys(editableActualValues[categoryName]).reduce((sum, product) => 
                    sum + (editableActualValues[categoryName][product]['w36'] || 0), 0);
                }
              } else {
                const productName = selectedSKU.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                for (const category of Object.keys(editableActualValues)) {
                  if (editableActualValues[category][productName]) {
                    base = editableActualValues[category][productName]['w36'] || 0;
                    break;
                  }
                }
              }
            } else {
              base = selectedSKU === 'all-categories' ? 1102
                : selectedSKU === 'pistakios' ? 692
                : selectedSKU === 'almonds' ? 410
                : selectedSKU === 'pistakio-classic' ? 346
                : selectedSKU === 'pistakio-salted' ? 192
                : selectedSKU === 'pistakio-chocolate' ? 154
                : selectedSKU === 'almond-classic' ? 238
                : selectedSKU === 'almond-honey' ? 172
                : 200;
            }
            
            for (let i = 1; i <= 4; i++) {
              forecast += Math.round(base * multiplier);
            }
            return `${forecast.toLocaleString()} units`;
          })()}
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
        <div className='mt-4 text-center text-sm text-gray-500'>
          <p>
            W33-W36: Actual values from table • W37+: Forecast based on W36 data • 
            Adjust forecast with slider above
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
