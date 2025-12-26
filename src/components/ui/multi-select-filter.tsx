'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent } from './card';

interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectFilterProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  maxDisplayItems?: number;
}

const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  searchable = true,
  className = '',
  maxDisplayItems = 2,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
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

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === filteredOptions.length) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map(opt => opt.value);
      onChange(value.filter(v => !filteredValues.includes(v)));
    } else {
      // Select all filtered options
      const allValues = [...new Set([...value, ...filteredOptions.map(opt => opt.value)])];
      onChange(allValues);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    }

    const selectedOptions = options.filter(opt => value.includes(opt.value));
    
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map(opt => opt.label).join(', ');
    }

    const displayItems = selectedOptions.slice(0, maxDisplayItems);
    const remainingCount = selectedOptions.length - maxDisplayItems;
    
    return `${displayItems.map(opt => opt.label).join(', ')} +${remainingCount} more`;
  };

  const removeItem = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    handleToggleOption(optionValue);
  };

  const allFilteredSelected = filteredOptions.length > 0 && 
    filteredOptions.every(opt => value.includes(opt.value));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-left font-normal min-h-[40px] h-auto"
      >
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {value.length <= maxDisplayItems ? (
            value.length === 0 ? (
              <span className="text-neutral-500">{placeholder}</span>
            ) : (
              options
                .filter(opt => value.includes(opt.value))
                .map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-md border border-teal-100 dark:border-teal-800"
                  >
                    {option.label}
                    <button
                      onClick={(e) => removeItem(option.value, e)}
                      className="hover:bg-teal-100 dark:hover:bg-teal-800 rounded-full p-0.5 transition-colors"
                    >
                      <XIcon />
                    </button>
                  </span>
                ))
            )
          ) : (
            <span className="text-charcoal-900 dark:text-neutral-300 truncate font-medium">
              {getDisplayText()}
            </span>
          )}
        </div>
        <ChevronDownIcon className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
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
              <CardContent className="p-0">
                {searchable && (
                  <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-charcoal-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
                      />
                    </div>
                  </div>
                )}

                <div className="p-2">
                  {/* Select All / Clear All */}
                  <div className="flex gap-2 mb-2 p-1">
                    <button
                      onClick={handleSelectAll}
                      className="flex-1 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-md transition-colors"
                    >
                      {allFilteredSelected ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                        No options found
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = value.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleToggleOption(option.value)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2.5 text-left text-sm rounded-md transition-all duration-200 mb-0.5",
                              isSelected
                                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                isSelected
                                  ? 'bg-teal-500 border-teal-500 text-white'
                                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                              )}>
                                {isSelected && <CheckIcon />}
                              </div>
                              <span className="font-medium">{option.label}</span>
                            </div>
                            {option.count !== undefined && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                {option.count}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
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

export { MultiSelectFilter };
export type { MultiSelectOption };