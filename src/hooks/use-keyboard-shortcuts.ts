'use client';

import * as React from 'react';
import { KeyboardShortcut } from '@/types';

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

interface UseKeyboardShortcutsReturn {
  shortcuts: KeyboardShortcut[];
  addShortcut: (shortcut: KeyboardShortcut) => void;
  removeShortcut: (key: string) => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const parseKeyCombo = (key: string): { keys: string[]; modifiers: string[] } => {
  const parts = key.toLowerCase().split('+').map(part => part.trim());
  const modifiers = parts.filter(part => 
    ['ctrl', 'cmd', 'alt', 'shift', 'meta'].includes(part)
  );
  const keys = parts.filter(part => 
    !['ctrl', 'cmd', 'alt', 'shift', 'meta'].includes(part)
  );
  
  return { keys, modifiers };
};

const matchesKeyCombo = (event: KeyboardEvent, keyCombo: string): boolean => {
  const { keys, modifiers } = parseKeyCombo(keyCombo);
  
  // Check modifiers
  const hasCtrl = modifiers.includes('ctrl') || modifiers.includes('cmd');
  const hasAlt = modifiers.includes('alt');
  const hasShift = modifiers.includes('shift');
  const hasMeta = modifiers.includes('meta');
  
  if (hasCtrl && !(event.ctrlKey || event.metaKey)) return false;
  if (hasAlt && !event.altKey) return false;
  if (hasShift && !event.shiftKey) return false;
  if (hasMeta && !event.metaKey) return false;
  
  // Check if we have extra modifiers
  if (!hasCtrl && (event.ctrlKey || event.metaKey)) return false;
  if (!hasAlt && event.altKey) return false;
  if (!hasShift && event.shiftKey) return false;
  if (!hasMeta && event.metaKey && !hasCtrl) return false;
  
  // Check the main key
  const mainKey = keys[0];
  if (!mainKey) return false;
  
  return event.key.toLowerCase() === mainKey.toLowerCase();
};

export const useKeyboardShortcuts = (
  options: UseKeyboardShortcutsOptions
): UseKeyboardShortcutsReturn => {
  const { shortcuts: initialShortcuts, enabled: initialEnabled = true } = options;
  
  const [shortcuts, setShortcuts] = React.useState<KeyboardShortcut[]>(initialShortcuts);
  const [isEnabled, setEnabled] = React.useState(initialEnabled);

  const addShortcut = React.useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      // Remove existing shortcut with same key
      const filtered = prev.filter(s => s.key !== shortcut.key);
      return [...filtered, shortcut];
    });
  }, []);

  const removeShortcut = React.useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  React.useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Find matching shortcut
      const matchingShortcut = shortcuts.find(shortcut =>
        matchesKeyCombo(event, shortcut.key)
      );

      if (matchingShortcut) {
        event.preventDefault();
        event.stopPropagation();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isEnabled]);

  return {
    shortcuts,
    addShortcut,
    removeShortcut,
    isEnabled,
    setEnabled,
  };
};

// Default shortcuts for the dashboard
export const createDefaultShortcuts = (actions: {
  refreshData: () => void;
  toggleSidebar: () => void;
  openSearch: () => void;
  exportData: () => void;
  showHelp: () => void;
  toggleDarkMode: () => void;
}): KeyboardShortcut[] => [
  {
    key: 'ctrl+r',
    description: 'Refresh dashboard data',
    action: actions.refreshData,
    category: 'data',
  },
  {
    key: 'ctrl+b',
    description: 'Toggle sidebar',
    action: actions.toggleSidebar,
    category: 'navigation',
  },
  {
    key: 'ctrl+k',
    description: 'Open search',
    action: actions.openSearch,
    category: 'navigation',
  },
  {
    key: 'ctrl+e',
    description: 'Export current view',
    action: actions.exportData,
    category: 'export',
  },
  {
    key: 'ctrl+shift+h',
    description: 'Show help',
    action: actions.showHelp,
    category: 'view',
  },
  {
    key: 'ctrl+shift+d',
    description: 'Toggle dark mode',
    action: actions.toggleDarkMode,
    category: 'view',
  },
];