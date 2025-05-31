'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { useHapticFeedback } from '@/hooks/use-mobile-gestures';

interface MobileDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const MobileDatePicker: React.FC<MobileDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = '',
  disabled = false,
  minDate,
  maxDate
}) => {
  const { lightImpact, selectionChanged } = useHapticFeedback();
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !value) return false;
    return date.toDateString() === value.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    selectionChanged();
    onChange(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    lightImpact();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    lightImpact();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleOpen = () => {
    if (disabled) return;
    lightImpact();
    setIsOpen(true);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        disabled={disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl
          glass border border-glass-border
          text-left transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-teal-500/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
          }
        `}
      >
        <CalendarIcon />
        <span className={value ? 'text-white' : 'text-white/50'}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            >
              <div className="glass rounded-2xl border border-glass-border shadow-glass p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeftIcon />
                  </button>
                  
                  <h3 className="text-lg font-semibold text-white">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-white/50 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, index) => (
                    <motion.button
                      key={index}
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date || isDateDisabled(date)}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-lg
                        transition-all duration-200 relative
                        ${!date 
                          ? 'invisible' 
                          : isDateDisabled(date)
                          ? 'text-white/30 cursor-not-allowed'
                          : isDateSelected(date)
                          ? 'bg-teal-500 text-white font-semibold'
                          : isToday(date)
                          ? 'bg-white/10 text-white font-medium border border-teal-500/50'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                    >
                      {date?.getDate()}
                      
                      {/* Today indicator */}
                      {isToday(date) && !isDateSelected(date) && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-400 rounded-full" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (value) {
                        handleDateSelect(value);
                      } else {
                        handleDateSelect(new Date());
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors"
                  >
                    {value ? 'Select' : 'Today'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileDatePicker;