'use client';

import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';
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
          <span className={cn(
            "truncate",
            value.from && value.to ? 'text-charcoal-900 dark:text-neutral-200' : 'text-neutral-500'
          )}>
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
            className="absolute top-full left-0 right-0 mt-2 z-[1001]"
          >
            <Card className="shadow-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Preset Options */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Quick Select</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {presets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => handlePresetSelect(preset)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm rounded-md transition-all duration-200 font-medium",
                            selectedPreset === preset.value
                              ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Custom Range</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-1 ml-1">From</label>
                        <input
                          type="date"
                          value={customFromDate}
                          onChange={(e) => setCustomFromDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-charcoal-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-1 ml-1">To</label>
                        <input
                          type="date"
                          value={customToDate}
                          onChange={(e) => setCustomToDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-charcoal-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={handleCustomDateChange}
                        disabled={!customFromDate || !customToDate}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                      >
                        Apply Range
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearSelection}
                        className="flex-1 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold"
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