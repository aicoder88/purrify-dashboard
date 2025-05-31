'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { ChartDataPoint, ChartExportOptions, ChartDrillDownData } from '@/types';

interface EnhancedChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'area' | 'bar' | 'pie';
  title: string;
  height?: number;
  animated?: boolean;
  exportable?: boolean;
  drillDownEnabled?: boolean;
  onDrillDown?: (data: ChartDrillDownData) => void;
  className?: string;
  colors?: string[];
  loading?: boolean;
}

const PURRIFY_COLORS = [
  '#1ABC9C', // Teal
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#E74C3C', // Red
  '#F39C12', // Orange
  '#2ECC71', // Green
  '#34495E', // Dark Blue
  '#E67E22', // Dark Orange
];

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DrillDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EnhancedChart: React.FC<EnhancedChartProps> = ({
  data,
  type,
  title,
  height = 400,
  animated = true,
  exportable = true,
  drillDownEnabled = false,
  onDrillDown,
  className = '',
  colors = PURRIFY_COLORS,
  loading = false,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  const handleExport = async (format: ChartExportOptions['format']) => {
    if (!chartRef.current) return;

    setIsExporting(true);
    setShowExportMenu(false);

    try {
      const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-chart`;

      if (format === 'csv') {
        // Export as CSV
        const csvContent = [
          ['Label', 'Value'],
          ...data.map(item => [item.label || item.x, item.y])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Export as image or PDF
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });

        if (format === 'png') {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${filename}.png`;
          link.click();
        } else if (format === 'pdf') {
          const pdf = new jsPDF();
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${filename}.pdf`);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataPointClick = (data: any) => {
    if (drillDownEnabled && onDrillDown) {
      const drillDownData: ChartDrillDownData = {
        level: 1,
        data: [data],
        breadcrumb: [title, data.label || data.x],
      };
      onDrillDown(drillDownData);
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x" 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2B2B',
                border: '1px solid #1ABC9C',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="y"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              animationDuration={animated ? 1000 : 0}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x" 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2B2B',
                border: '1px solid #1ABC9C',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="y"
              stroke={colors[0]}
              fill={`${colors[0]}20`}
              strokeWidth={2}
              animationDuration={animated ? 1000 : 0}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x" 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2B2B',
                border: '1px solid #1ABC9C',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Legend />
            <Bar
              dataKey="y"
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              animationDuration={animated ? 1000 : 0}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="y"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={animated ? 1000 : 0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2B2B',
                border: '1px solid #1ABC9C',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Legend />
          </PieChart>
        );

      default:
        return <div className="flex items-center justify-center h-full text-neutral-500">Unsupported chart type</div>;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="flex items-center justify-center bg-neutral-50 rounded-lg animate-pulse"
              style={{ height: `${height}px` }}
            >
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-neutral-500 text-sm">Loading chart...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-charcoal-900">
            {title}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {drillDownEnabled && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Drill down for details"
              >
                <DrillDownIcon />
              </Button>
            )}
            
            {exportable && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  title="Export chart"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
                  ) : (
                    <DownloadIcon />
                  )}
                </Button>
                
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
                    >
                      <button
                        onClick={() => handleExport('png')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors"
                      >
                        Export PNG
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors"
                      >
                        Export CSV
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ height: `${height}px` }}
            className="relative"
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EnhancedChart };