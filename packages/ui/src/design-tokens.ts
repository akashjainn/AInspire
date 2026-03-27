// AInspire Design System - Design Tokens
// Figma-based design system for mobile-first creation tool

export const colors = {
  // Primary brand colors
  primary: {
    coral: '#FF7F7F',
    coral_light: '#FFB2B2',
    coral_dark: '#E85555',
  },
  
  // Secondary colors
  purple: '#7C6FD7',
  purple_light: '#B5A7F0',
  
  // Background
  background: {
    cream: '#F5F3F0',
    light: '#FEFDFB',
    white: '#FFFFFF',
  },
  
  // Text
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    light: '#999999',
    white: '#FFFFFF',
  },
  
  // Neutral grays
  gray: {
    50: '#FAFAF8',
    100: '#F5F3F0',
    200: '#E8E6E3',
    300: '#D9D6D3',
    400: '#999999',
    500: '#666666',
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

export const typography = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  
  // Font sizes (mobile-first)
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
  },
  
  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

export const borderRadius = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 20px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.15)',
  glow: `0 0 20px ${colors.primary.coral}40`,
};

export const transitions = {
  fast: 'all 0.15s ease',
  base: 'all 0.2s ease',
  slow: 'all 0.3s ease',
};
