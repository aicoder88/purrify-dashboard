/**
 * Comprehensive tests for utility functions in src/lib/utils.ts
 * Tests cover all exported functions with edge cases and typical usage scenarios
 */

import {
  cn,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  debounce,
  generateId,
  isEmpty,
  calculatePercentageChange,
  truncateText,
  sleep,
  getInitials,
  isValidEmail,
  stringToColor,
  deepClone,
} from '@/lib/utils';

// ============================================================================
// cn (className merging)
// ============================================================================
describe('cn', () => {
  it('should merge simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });

  it('should merge Tailwind classes intelligently', () => {
    // tailwind-merge should resolve conflicting classes
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('should handle object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle null and undefined values', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
  });

  it('should handle complex Tailwind responsive classes', () => {
    expect(cn('md:p-4', 'lg:p-8', 'p-2')).toBe('md:p-4 lg:p-8 p-2');
  });
});

// ============================================================================
// formatNumber
// ============================================================================
describe('formatNumber', () => {
  it('should format numbers less than 1000 as is', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(10000)).toBe('10.0K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(10000000)).toBe('10.0M');
    expect(formatNumber(999999999)).toBe('1000.0M');
  });

  it('should format billions with B suffix', () => {
    expect(formatNumber(1000000000)).toBe('1.0B');
    expect(formatNumber(1500000000)).toBe('1.5B');
    expect(formatNumber(10000000000)).toBe('10.0B');
  });

  it('should handle decimal precision correctly', () => {
    expect(formatNumber(1234)).toBe('1.2K');
    expect(formatNumber(1234567)).toBe('1.2M');
    expect(formatNumber(1234567890)).toBe('1.2B');
  });
});

// ============================================================================
// formatCurrency
// ============================================================================
describe('formatCurrency', () => {
  it('should format USD currency by default', () => {
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('should handle decimal values', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(100.5)).toBe('$100.50');
  });

  it('should format with different currencies', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100');
    expect(formatCurrency(100, 'GBP')).toContain('100');
    expect(formatCurrency(100, 'CAD')).toContain('100');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should handle negative values', () => {
    expect(formatCurrency(-100)).toBe('-$100');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });
});

// ============================================================================
// formatPercentage
// ============================================================================
describe('formatPercentage', () => {
  it('should format percentage with default 1 decimal', () => {
    expect(formatPercentage(50)).toBe('50.0%');
    expect(formatPercentage(33.333)).toBe('33.3%');
  });

  it('should format percentage with custom decimals', () => {
    expect(formatPercentage(33.333, 0)).toBe('33%');
    expect(formatPercentage(33.333, 2)).toBe('33.33%');
    expect(formatPercentage(33.333, 3)).toBe('33.333%');
  });

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should handle negative values', () => {
    expect(formatPercentage(-10.5)).toBe('-10.5%');
  });

  it('should handle values over 100', () => {
    expect(formatPercentage(150)).toBe('150.0%');
  });
});

// ============================================================================
// formatDate
// ============================================================================
describe('formatDate', () => {
  it('should format Date object with default options', () => {
    // Use explicit time to avoid timezone edge cases
    const date = new Date('2024-01-15T12:00:00');
    const result = formatDate(date);
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });

  it('should format date string', () => {
    const result = formatDate('2024-06-20T12:00:00');
    expect(result).toContain('Jun');
    expect(result).toContain('2024');
  });

  it('should accept custom format options', () => {
    const date = new Date('2024-01-15T12:00:00');
    const result = formatDate(date, { weekday: 'long' });
    // The weekday will be included in the result
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should override default options with custom ones', () => {
    const date = new Date('2024-01-15T12:00:00');
    const result = formatDate(date, { month: 'long' });
    expect(result).toContain('January');
  });

  it('should return a valid formatted string', () => {
    const date = new Date();
    const result = formatDate(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// debounce
// ============================================================================
describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use the latest arguments when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });
});

// ============================================================================
// generateId
// ============================================================================
describe('generateId', () => {
  it('should generate ID with default prefix', () => {
    const id = generateId();
    expect(id).toMatch(/^id-[a-z0-9]+$/);
  });

  it('should generate ID with custom prefix', () => {
    const id = generateId('custom');
    expect(id).toMatch(/^custom-[a-z0-9]+$/);
  });

  it('should generate unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('should generate IDs with consistent format', () => {
    const id = generateId('test');
    const parts = id.split('-');
    expect(parts[0]).toBe('test');
    expect(parts[1]).toBeDefined();
    expect(parts[1]?.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// isEmpty
// ============================================================================
describe('isEmpty', () => {
  it('should return true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty('\t\n')).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty(' hello ')).toBe(false);
  });

  it('should return true for empty arrays', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return false for non-empty arrays', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty([null])).toBe(false);
  });

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty objects', () => {
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  it('should return false for numbers', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(-1)).toBe(false);
  });

  it('should return false for booleans', () => {
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});

// ============================================================================
// calculatePercentageChange
// ============================================================================
describe('calculatePercentageChange', () => {
  it('should calculate positive percentage change', () => {
    expect(calculatePercentageChange(120, 100)).toBe(20);
    expect(calculatePercentageChange(200, 100)).toBe(100);
  });

  it('should calculate negative percentage change', () => {
    expect(calculatePercentageChange(80, 100)).toBe(-20);
    expect(calculatePercentageChange(50, 100)).toBe(-50);
  });

  it('should return 0 when values are equal', () => {
    expect(calculatePercentageChange(100, 100)).toBe(0);
  });

  it('should handle zero previous value', () => {
    expect(calculatePercentageChange(100, 0)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
    expect(calculatePercentageChange(-10, 0)).toBe(0);
  });

  it('should handle decimal values', () => {
    expect(calculatePercentageChange(1.5, 1)).toBe(50);
    expect(calculatePercentageChange(0.5, 1)).toBe(-50);
  });

  it('should handle negative values', () => {
    expect(calculatePercentageChange(-50, -100)).toBe(-50);
    expect(calculatePercentageChange(-150, -100)).toBe(50);
  });
});

// ============================================================================
// truncateText
// ============================================================================
describe('truncateText', () => {
  it('should not truncate text shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should truncate text longer than maxLength', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
    expect(truncateText('Hello World', 8)).toBe('Hello Wo...');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should handle maxLength of 0', () => {
    expect(truncateText('Hello', 0)).toBe('...');
  });

  it('should handle exact length match', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});

// ============================================================================
// sleep
// ============================================================================
describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a promise that resolves after specified time', async () => {
    const mockFn = jest.fn();

    sleep(100).then(mockFn);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    await Promise.resolve();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should resolve to void', async () => {
    const sleepPromise = sleep(100);
    jest.advanceTimersByTime(100);
    const result = await sleepPromise;
    expect(result).toBeUndefined();
  });
});

// ============================================================================
// getInitials
// ============================================================================
describe('getInitials', () => {
  it('should get initials from two-word name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should get initials from single-word name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('should limit initials to 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('should handle lowercase names', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('');
  });

  it('should handle single character names', () => {
    expect(getInitials('J D')).toBe('JD');
  });

  it('should get first character of each word', () => {
    expect(getInitials('Alice Bob')).toBe('AB');
  });
});

// ============================================================================
// isValidEmail
// ============================================================================
describe('isValidEmail', () => {
  it('should validate correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    expect(isValidEmail('123@domain.com')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
  });

  it('should reject emails with spaces', () => {
    expect(isValidEmail('user name@domain.com')).toBe(false);
    expect(isValidEmail('user@domain .com')).toBe(false);
  });
});

// ============================================================================
// stringToColor
// ============================================================================
describe('stringToColor', () => {
  it('should return HSL color format', () => {
    const color = stringToColor('test');
    expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
  });

  it('should return consistent color for same string', () => {
    const color1 = stringToColor('test');
    const color2 = stringToColor('test');
    expect(color1).toBe(color2);
  });

  it('should return different colors for different strings', () => {
    const color1 = stringToColor('test1');
    const color2 = stringToColor('test2');
    expect(color1).not.toBe(color2);
  });

  it('should handle empty string', () => {
    const color = stringToColor('');
    expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
  });

  it('should handle special characters', () => {
    const color = stringToColor('!@#$%^&*()');
    expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
  });

  it('should produce hue values within valid range (0-359)', () => {
    const testStrings = ['a', 'test', 'longer string', 'UPPERCASE', '12345'];
    testStrings.forEach((str) => {
      const color = stringToColor(str);
      const hueMatch = color.match(/hsl\((\d+),/);
      if (hueMatch && hueMatch[1]) {
        const hue = parseInt(hueMatch[1], 10);
        expect(hue).toBeGreaterThanOrEqual(0);
        expect(hue).toBeLessThan(360);
      }
    });
  });
});

// ============================================================================
// deepClone
// ============================================================================
describe('deepClone', () => {
  it('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('string')).toBe('string');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
  });

  it('should clone simple objects', () => {
    const original = { a: 1, b: 'test', c: true };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should clone nested objects', () => {
    const original = {
      level1: {
        level2: {
          level3: 'deep',
        },
      },
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned.level1).not.toBe(original.level1);
    expect(cloned.level1.level2).not.toBe(original.level1.level2);
  });

  it('should clone arrays', () => {
    const original = [1, 2, 3, [4, 5, [6, 7]]];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[3]).not.toBe(original[3]);
  });

  it('should clone Date objects', () => {
    const original = new Date('2024-01-15');
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.getTime()).toBe(original.getTime());
  });

  it('should clone objects with Date properties', () => {
    const original = {
      name: 'test',
      createdAt: new Date('2024-01-15'),
    };
    const cloned = deepClone(original);

    expect(cloned.createdAt).not.toBe(original.createdAt);
    expect(cloned.createdAt.getTime()).toBe(original.createdAt.getTime());
  });

  it('should clone mixed nested structures', () => {
    const original = {
      string: 'test',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2, { nested: true }],
      object: { a: 1, b: [2, 3] },
      date: new Date('2024-01-15'),
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned.array).not.toBe(original.array);
    expect(cloned.array[2]).not.toBe(original.array[2]);
    expect(cloned.object).not.toBe(original.object);
    expect(cloned.object.b).not.toBe(original.object.b);
    expect(cloned.date).not.toBe(original.date);
  });

  it('should not modify original when clone is modified', () => {
    const original = { a: 1, nested: { b: 2 } };
    const cloned = deepClone(original);

    cloned.a = 100;
    cloned.nested.b = 200;

    expect(original.a).toBe(1);
    expect(original.nested.b).toBe(2);
  });

  it('should handle undefined', () => {
    expect(deepClone(undefined)).toBe(undefined);
  });
});
