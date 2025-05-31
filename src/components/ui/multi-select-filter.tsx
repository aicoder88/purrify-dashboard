'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                    className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md"
                  >
                    {option.label}
                    <button
                      onClick={(e) => removeItem(option.value, e)}
                      className="hover:bg-teal-100 rounded-full p-0.5"
                    >
                      <XIcon />
                    </button>
                  </span>
                ))
            )
          ) : (
            <span className="text-charcoal-900 truncate">
              {getDisplayText()}
            </span>
          )}
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
              <CardContent className="p-0">
                {searchable && (
                  <div className="p-3 border-b border-neutral-200">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="p-2">
                  {/* Select All / Clear All */}
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={handleSelectAll}
                      className="flex-1 px-3 py-1.5 text-xs text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    >
                      {allFilteredSelected ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-neutral-500">
                        No options found
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = value.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleToggleOption(option.value)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-md transition-colors ${
                              isSelected
                                ? 'bg-teal-50 text-teal-700'
                                : 'hover:bg-neutral-50 text-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                                isSelected
                                  ? 'bg-teal-500 border-teal-500 text-white'
                                  : 'border-neutral-300'
                              }`}>
                                {isSelected && <CheckIcon />}
                              </div>
                              <span>{option.label}</span>
                            </div>
                            {option.count !== undefined && (
                              <span className="text-xs text-neutral-500">
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