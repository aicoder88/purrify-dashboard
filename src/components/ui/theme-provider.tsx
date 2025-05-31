'use client';

import * as React from 'react';
import { ThemeConfig } from '@/types';

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const defaultTheme: ThemeConfig = {
  mode: 'dark',
  primaryColor: '#1ABC9C',
  borderRadius: 'lg',
  fontFamily: 'inter',
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme: initialTheme,
}) => {
  const [theme, setTheme] = React.useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
  });

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('purrify-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(prev => ({ ...prev, ...parsedTheme }));
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark/light mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', theme.primaryColor);
    
    // Apply border radius
    const radiusMap = {
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
    };
    root.style.setProperty('--border-radius', radiusMap[theme.borderRadius]);
    
    // Apply font family
    if (theme.fontFamily === 'inter') {
      root.style.setProperty('--font-family', 'Inter, sans-serif');
    } else {
      root.style.setProperty('--font-family', 'system-ui, sans-serif');
    }
    
    // Save to localStorage
    localStorage.setItem('purrify-theme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = React.useCallback((updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleDarkMode = React.useCallback(() => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const isDarkMode = theme.mode === 'dark';

  const value = React.useMemo(
    () => ({
      theme,
      updateTheme,
      toggleDarkMode,
      isDarkMode,
    }),
    [theme, updateTheme, toggleDarkMode, isDarkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};