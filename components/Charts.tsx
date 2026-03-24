import React from 'react';

/**
 * Chart Components - Graphiques simples sans librairie externe
 * Utilise Canvas ou SVG pour une meilleure performance
 */

// Simple Bar Chart
export interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  height?: number;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 200,
  showValues = true 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const width = (100 / data.length);

  return (
    <div className="w-full space-y-4">
      {title && <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>}
      <div className="flex items-end justify-between gap-2 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg" style={{ minHeight: `${height}px` }}>
        {data.map(item => (
          <div key={item.label} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-t transition-all hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * (height - 40)}px`,
                minHeight: '4px'
              }}
            />
            {showValues && (
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 mt-2 text-center">
                {item.value}
              </span>
            )}
            <span className="text-xs text-stone-600 dark:text-stone-400 mt-1 text-center line-clamp-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Pie Chart
export interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  size?: number;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLegend = true
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const defaultColors = [
    '#ea580c', '#f97316', '#fb923c', '#fbbf24', '#fcd34d',
    '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8', '#1e40af'
  ];

  let currentAngle = 0;
  const paths = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = size / 2 + (size / 3) * Math.cos(startRad);
    const y1 = size / 2 + (size / 3) * Math.sin(startRad);
    const x2 = size / 2 + (size / 3) * Math.cos(endRad);
    const y2 = size / 2 + (size / 3) * Math.sin(endRad);
    
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 3} ${size / 3} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    const color = item.color || defaultColors[index % defaultColors.length];
    currentAngle = endAngle;
    
    return { pathData, color, ...item };
  });

  return (
    <div className="w-full space-y-4">
      {title && <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
          {paths.map((path, idx) => (
            <path
              key={idx}
              d={path.pathData}
              fill={path.color}
              opacity={0.8}
              className="hover:opacity-100 transition-opacity cursor-pointer"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
            />
          ))}
        </svg>
        
        {showLegend && (
          <div className="flex flex-col gap-2">
            {paths.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-stone-700 dark:text-stone-300">
                  {item.label}: {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Line Chart
export interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  height?: number;
  showPoints?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  showPoints = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;
  
  const width = 100 / Math.max(data.length - 1, 1);
  
  const points = data.map((item, idx) => ({
    x: idx * width,
    y: 100 - ((item.value - minValue) / range) * 100,
    ...item
  }));
  
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`)
    .join(' ');

  return (
    <div className="w-full space-y-4">
      {title && <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>}
      <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ height: `${height}px` }}>
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={`grid-${y}`}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
              className="text-stone-400"
            />
          ))}
          
          {/* Line */}
          <path
            d={pathD}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-orange-500"
          />
          
          {/* Area */}
          <path
            d={pathD + ` L 100 100 L 0 100 Z`}
            fill="currentColor"
            opacity="0.1"
            className="text-orange-500"
          />
          
          {/* Points */}
          {showPoints && points.map((p, idx) => (
            <circle
              key={idx}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r="2"
              fill="currentColor"
              className="text-orange-500"
            />
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between gap-4 flex-wrap text-xs text-stone-600 dark:text-stone-400">
        {points.map((p, idx) => (
          <span key={idx}>{p.label}: <strong>{p.value}</strong></span>
        ))}
      </div>
    </div>
  );
};

// Stat Card for Dashboard
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'orange' | 'green' | 'blue' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  color = 'orange'
}) => {
  const colorClass = {
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300'
  };

  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '';

  return (
    <div className={`p-4 rounded-lg border border-stone-200 dark:border-stone-700 ${colorClass[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium opacity-75">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <p className="text-xs mt-2 opacity-75">
          {trendIcon} <span className="font-medium">{change > 0 ? '+' : ''}{change}%</span> vs mois dernier
        </p>
      )}
    </div>
  );
};
