'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 },
  ];

  const handlePresetClick = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    onDateRangeChange?.(startDate, endDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Date Range
        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 z-50"
        >
          <Card className="w-64 shadow-lg border">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-charcoal-900 mb-3">
                  Quick Select
                </h4>
                {presetRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePresetClick(range.days)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
                
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-neutral-500 text-center">
                    Custom date picker coming in v1.1
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export { DateRangePicker };