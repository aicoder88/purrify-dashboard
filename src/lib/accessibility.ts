/**
 * Accessibility utilities for WCAG compliance and better user experience
 */

import React from 'react';

// ARIA live region types
export type LiveRegionPoliteness = 'off' | 'polite' | 'assertive';

// Focus management utilities
export class FocusManager {
  private static instance: FocusManager;
  private focusStack: HTMLElement[] = [];
  private trapStack: HTMLElement[] = [];

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  /**
   * Save current focus and set new focus
   */
  saveFocus(newFocus?: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== document.body) {
      this.focusStack.push(currentFocus);
    }

    if (newFocus) {
      newFocus.focus();
    }
  }

  /**
   * Restore previously saved focus
   */
  restoreFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container: HTMLElement): void {
    this.trapStack.push(container);
    this.setupFocusTrap(container);
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap(): void {
    const container = this.trapStack.pop();
    if (container) {
      this.removeFocusTrap(container);
    }
  }

  private setupFocusTrap(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    (container as any)._focusTrapHandler = handleKeyDown;

    // Focus first element
    firstElement?.focus();
  }

  private removeFocusTrap(container: HTMLElement): void {
    const handler = (container as any)._focusTrapHandler;
    if (handler) {
      container.removeEventListener('keydown', handler);
      delete (container as any)._focusTrapHandler;
    }
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }
}

/**
 * Announce messages to screen readers
 */
export class ScreenReaderAnnouncer {
  private static instance: ScreenReaderAnnouncer;
  private liveRegion: HTMLElement | null = null;

  static getInstance(): ScreenReaderAnnouncer {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer();
    }
    return ScreenReaderAnnouncer.instance;
  }

  private ensureLiveRegion(): HTMLElement {
    if (!this.liveRegion || !document.contains(this.liveRegion)) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.setAttribute('aria-relevant', 'text');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.left = '-10000px';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.overflow = 'hidden';
      document.body.appendChild(this.liveRegion);
    }
    return this.liveRegion;
  }

  announce(message: string, politeness: LiveRegionPoliteness = 'polite'): void {
    const liveRegion = this.ensureLiveRegion();
    liveRegion.setAttribute('aria-live', politeness);
    
    // Clear and set message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  announceError(message: string): void {
    this.announce(`Error: ${message}`, 'assertive');
  }

  announceSuccess(message: string): void {
    this.announce(`Success: ${message}`, 'polite');
  }

  announceLoading(message: string = 'Loading'): void {
    this.announce(message, 'polite');
  }
}

/**
 * Color contrast utilities
 */
export class ColorContrast {
  /**
   * Calculate relative luminance of a color
   */
  static getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if color combination meets WCAG AA standards
   */
  static meetsWCAG_AA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Check if color combination meets WCAG AAA standards
   */
  static meetsWCAG_AAA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result && result[1] && result[2] && result[3]
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
  /**
   * Handle arrow key navigation in a list
   */
  static handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: {
      loop?: boolean;
      orientation?: 'horizontal' | 'vertical' | 'both';
      onIndexChange?: (newIndex: number) => void;
    } = {}
  ): number {
    const { loop = true, orientation = 'vertical', onIndexChange } = options;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus();
      onIndexChange?.(newIndex);
    }

    return newIndex;
  }
}

/**
 * React hooks for accessibility
 */

/**
 * Hook for managing focus
 */
export function useFocusManagement() {
  const focusManager = React.useMemo(() => FocusManager.getInstance(), []);

  return {
    saveFocus: focusManager.saveFocus.bind(focusManager),
    restoreFocus: focusManager.restoreFocus.bind(focusManager),
    trapFocus: focusManager.trapFocus.bind(focusManager),
    releaseFocusTrap: focusManager.releaseFocusTrap.bind(focusManager),
  };
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const announcer = React.useMemo(() => ScreenReaderAnnouncer.getInstance(), []);

  return {
    announce: announcer.announce.bind(announcer),
    announceError: announcer.announceError.bind(announcer),
    announceSuccess: announcer.announceSuccess.bind(announcer),
    announceLoading: announcer.announceLoading.bind(announcer),
  };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
    initialIndex?: number;
  } = {}
) {
  const [currentIndex, setCurrentIndex] = React.useState(options.initialIndex || 0);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      const newIndex = KeyboardNavigation.handleArrowNavigation(
        event,
        items,
        currentIndex,
        {
          ...options,
          onIndexChange: setCurrentIndex,
        }
      );
      setCurrentIndex(newIndex);
    },
    [items, currentIndex, options]
  );

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
  };
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for high contrast preference
 */
export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

/**
 * Generate unique IDs for accessibility
 */
export function useId(prefix = 'id'): string {
  return React.useMemo(() => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, [prefix]);
}

/**
 * ARIA attributes helper
 */
export function getAriaAttributes(props: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: LiveRegionPoliteness;
  atomic?: boolean;
  relevant?: string;
  busy?: boolean;
  hidden?: boolean;
  level?: number;
  setSize?: number;
  posInSet?: number;
  controls?: string;
  owns?: string;
  flowTo?: string;
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  role?: string;
}) {
  const aria: Record<string, any> = {};

  if (props.label) aria['aria-label'] = props.label;
  if (props.labelledBy) aria['aria-labelledby'] = props.labelledBy;
  if (props.describedBy) aria['aria-describedby'] = props.describedBy;
  if (props.expanded !== undefined) aria['aria-expanded'] = props.expanded;
  if (props.selected !== undefined) aria['aria-selected'] = props.selected;
  if (props.disabled !== undefined) aria['aria-disabled'] = props.disabled;
  if (props.required !== undefined) aria['aria-required'] = props.required;
  if (props.invalid !== undefined) aria['aria-invalid'] = props.invalid;
  if (props.live) aria['aria-live'] = props.live;
  if (props.atomic !== undefined) aria['aria-atomic'] = props.atomic;
  if (props.relevant) aria['aria-relevant'] = props.relevant;
  if (props.busy !== undefined) aria['aria-busy'] = props.busy;
  if (props.hidden !== undefined) aria['aria-hidden'] = props.hidden;
  if (props.level) aria['aria-level'] = props.level;
  if (props.setSize) aria['aria-setsize'] = props.setSize;
  if (props.posInSet) aria['aria-posinset'] = props.posInSet;
  if (props.controls) aria['aria-controls'] = props.controls;
  if (props.owns) aria['aria-owns'] = props.owns;
  if (props.flowTo) aria['aria-flowto'] = props.flowTo;
  if (props.hasPopup !== undefined) aria['aria-haspopup'] = props.hasPopup;
  if (props.role) aria['role'] = props.role;

  return aria;
}

// Global instances
export const focusManager = FocusManager.getInstance();
export const screenReader = ScreenReaderAnnouncer.getInstance();