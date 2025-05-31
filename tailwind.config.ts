import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Glassmorphic Color Palette
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8b93f8',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
          950: '#252338',
        },
        secondary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fcdcfe',
          300: '#f9bffc',
          400: '#f093fb',
          500: '#e568f5',
          600: '#d946ef',
          700: '#c026d3',
          800: '#a21caf',
          900: '#86198f',
          950: '#581c87',
        },
        accent: {
          50: '#f0fdff',
          100: '#ccfbfe',
          200: '#9af6fd',
          300: '#4facfe',
          400: '#22d3ee',
          500: '#00f2fe',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#43e97b',
          500: '#38f9d7',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#fa709a',
          600: '#fee140',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff6b6b',
          600: '#ee5a24',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Enhanced neutral palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Glass effect colors
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.15)',
          'border-strong': 'rgba(255, 255, 255, 0.25)',
          shadow: 'rgba(0, 0, 0, 0.37)',
          'shadow-strong': 'rgba(0, 0, 0, 0.45)',
        },
        // Glow effects
        glow: {
          primary: 'rgba(102, 126, 234, 0.3)',
          secondary: 'rgba(240, 147, 251, 0.3)',
          accent: 'rgba(79, 172, 254, 0.3)',
          success: 'rgba(67, 233, 123, 0.3)',
          warning: 'rgba(250, 112, 154, 0.3)',
          danger: 'rgba(255, 107, 107, 0.3)',
        },
        // Semantic colors for shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.025em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.025em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.025em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.025em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        // Glass morphism shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 16px 64px rgba(0, 0, 0, 0.45)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        // Glow effects
        'glow-sm': '0 0 10px rgba(102, 126, 234, 0.3)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-lg': '0 0 30px rgba(102, 126, 234, 0.4)',
        'glow-xl': '0 0 40px rgba(102, 126, 234, 0.5)',
        // Colored glows
        'glow-primary': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-secondary': '0 0 20px rgba(240, 147, 251, 0.3)',
        'glow-accent': '0 0 20px rgba(79, 172, 254, 0.3)',
        'glow-success': '0 0 20px rgba(67, 233, 123, 0.3)',
        'glow-warning': '0 0 20px rgba(250, 112, 154, 0.3)',
        'glow-danger': '0 0 20px rgba(255, 107, 107, 0.3)',
        // Enhanced shadows
        'soft': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.16)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.24)',
        'intense': '0 16px 64px rgba(0, 0, 0, 0.32)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '30px',
        '4xl': '40px',
      },
      backgroundImage: {
        // Gradient presets
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-success': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-warning': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        // Radial gradients
        'radial-primary': 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
        'radial-secondary': 'radial-gradient(circle, rgba(240, 147, 251, 0.15) 0%, transparent 70%)',
        'radial-accent': 'radial-gradient(circle, rgba(79, 172, 254, 0.15) 0%, transparent 70%)',
        // Mesh gradients
        'mesh-primary': `
          radial-gradient(at 40% 20%, hsla(228, 100%, 74%, 1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%)
        `,
      },
      animation: {
        // Enhanced animations
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-out': 'fadeOut 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 25s ease-in-out infinite',
        'float-delayed': 'float 30s ease-in-out infinite reverse',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-20px) rotate(1deg) scale(1.02)' },
          '50%': { transform: 'translateY(10px) rotate(-0.5deg) scale(0.98)' },
          '75%': { transform: 'translateY(-10px) rotate(0.5deg) scale(1.01)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Custom plugin for glassmorphic utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.45)',
        },
        '.glass-subtle': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 3s ease infinite',
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 3s ease infinite',
        },
        '.text-gradient-accent': {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 3s ease infinite',
        },
        '.glow-primary': {
          boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
        },
        '.glow-secondary': {
          boxShadow: '0 0 20px rgba(240, 147, 251, 0.3)',
        },
        '.glow-accent': {
          boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)',
        },
        '.glow-success': {
          boxShadow: '0 0 20px rgba(67, 233, 123, 0.3)',
        },
        '.glow-warning': {
          boxShadow: '0 0 20px rgba(250, 112, 154, 0.3)',
        },
        '.glow-danger': {
          boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};

export default config;
