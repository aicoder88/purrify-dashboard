'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { DateRange, DateRangePreset } from '@/types';
import { Button } from './button';
import { Card, CardContent } from './card';

interface EnhancedDateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: DateRangePreset[];
  className?: string;
  placeholder?: string;
}

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const defaultPresets: DateRangePreset[] = [
  {
    label: 'Last 7 days',
    value: 'last-7-days',
    range: {
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Last 30 days',
    value: 'last-30-days',
    range: {
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Last 90 days',
    value: 'last-90-days',
    range: {
      from: startOfDay(subDays(new Date(), 89)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'This month',
    value: 'this-month',
    range: {
      from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Last month',
    value: 'last-month',
    range: {
      from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
      to: endOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0)),
    },
  },
];

const EnhancedDateRangePicker: React.FC<EnhancedDateRangePickerProps> = ({
  value,
  onChange,
  presets = defaultPresets,
  className = '',
  placeholder = 'Select date range',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);
  const [customFromDate, setCustomFromDate] = React.useState('');
  const [customToDate, setCustomToDate] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update custom date inputs when value changes
  React.useEffect(() => {
    if (value.from) {
      setCustomFromDate(format(value.from, 'yyyy-MM-dd'));
    }
    if (value.to) {
      setCustomToDate(format(value.to, 'yyyy-MM-dd'));
    }
  }, [value]);

  const handlePresetSelect = (preset: DateRangePreset) => {
    setSelectedPreset(preset.value);
    onChange(preset.range);
    setIsOpen(false);
  };

  const handleCustomDateChange = () => {
    if (customFromDate && customToDate) {
      const fromDate = startOfDay(new Date(customFromDate));
      const toDate = endOfDay(new Date(customToDate));
      
      if (fromDate <= toDate) {
        onChange({ from: fromDate, to: toDate });
        setSelectedPreset(null);
        setIsOpen(false);
      }
    }
  };

  const formatDisplayValue = () => {
    if (!value.from || !value.to) {
      return placeholder;
    }
    
    const fromStr = format(value.from, 'MMM d, yyyy');
    const toStr = format(value.to, 'MMM d, yyyy');
    
    if (fromStr === toStr) {
      return fromStr;
    }
    
    return `${fromStr} - ${toStr}`;
  };

  const clearSelection = () => {
    onChange({ from: null, to: null });
    setSelectedPreset(null);
    setCustomFromDate('');
    setCustomToDate('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-left font-normal"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span className={value.from && value.to ? 'text-charcoal-900' : 'text-neutral-500'}>
            {formatDisplayValue()}
          </span>
        </div>
        <ChevronDownIcon />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-lg border border-neutral-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Preset Options */}
                  <div>
                    <h4 className="text-sm font-medium text-charcoal-900 mb-2">Quick Select</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {presets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => handlePresetSelect(preset)}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                            selectedPreset === preset.value
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'hover:bg-neutral-50 text-neutral-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  <div className="border-t border-neutral-200 pt-4">
                    <h4 className="text-sm font-medium text-charcoal-900 mb-2">Custom Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">From</label>
                        <input
                          type="date"
                          value={customFromDate}
                          onChange={(e) => setCustomFromDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">To</label>
                        <input
                          type="date"
                          value={customToDate}
                          onChange={(e) => setCustomToDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={handleCustomDateChange}
                        disabled={!customFromDate || !customToDate}
                        className="flex-1"
                      >
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearSelection}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { EnhancedDateRangePicker };