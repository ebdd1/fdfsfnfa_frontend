// Premium Design System Colors
// Based on Trust Blue theme from stitch_kostfind_premium_marketplace_experience

export type BrandColorKey = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';

export interface BrandColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  DEFAULT: string;
  text: string;
  container: string;
  "on-container": string;
}

export const BRAND_COLORS: Record<BrandColorKey, BrandColorShades> = {
  // Primary - Trust Blue
  primary: {
    50: '#e5eeff',
    100: '#dbe1ff',
    200: '#b4c5ff',
    300: '#8fa3ff',
    400: '#6a81ff',
    500: '#003594',
    600: '#002a71',
    700: '#001f4e',
    800: '#00142b',
    900: '#000a0d',
    DEFAULT: '#003594',
    text: '#00174b',
    container: '#004ac6',
    "on-container": '#b8c8ff',
  },
  // Secondary - Sophisticated Indigo
  secondary: {
    50: '#e1e0ff',
    100: '#e1e0ff',
    200: '#c0c1ff',
    300: '#9f9fff',
    400: '#7e7dff',
    500: '#4648d4',
    600: '#3837ab',
    700: '#2a2982',
    800: '#1c1b59',
    900: '#0e0d30',
    DEFAULT: '#4648d4',
    text: '#07006c',
    container: '#6063ee',
    "on-container": '#fffbff',
  },
  // Tertiary - Professional Green
  tertiary: {
    50: '#89f5e7',
    100: '#89f5e7',
    200: '#6bd8cb',
    300: '#4dbbaf',
    400: '#2f9e93',
    500: '#004640',
    600: '#003833',
    700: '#002a26',
    800: '#001c19',
    900: '#000e0d',
    DEFAULT: '#004640',
    text: '#00201d',
    container: '#006058',
    "on-container": '#6fdcce',
  },
  // Success (maps to tertiary green)
  success: {
    50: '#89f5e7',
    100: '#89f5e7',
    200: '#6bd8cb',
    300: '#4dbbaf',
    400: '#2f9e93',
    500: '#004640',
    600: '#003833',
    700: '#002a26',
    800: '#001c19',
    900: '#000e0d',
    DEFAULT: '#004640',
    text: '#00201d',
    container: '#006058',
    "on-container": '#6fdcce',
  },
  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    DEFAULT: '#f59e0b',
    text: '#b45309',
    container: '#fef3c7',
    "on-container": '#92400e',
  },
  // Error - Red
  error: {
    50: '#ffdad6',
    100: '#ffdad6',
    200: '#ffb4ab',
    300: '#ff8a80',
    400: '#ff5449',
    500: '#ba1a1a',
    600: '#93000a',
    700: '#690005',
    800: '#410002',
    900: '#1a0001',
    DEFAULT: '#ba1a1a',
    text: '#93000a',
    container: '#ffdad6',
    "on-container": '#690005',
  },
};

export const BRAND_COLOR_KEYS: BrandColorKey[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'];

// Surface system colors
export const SURFACE_COLORS = {
  background: '#f8f9ff',
  surface: '#f8f9ff',
  'surface-dim': '#cbdbf5',
  'surface-bright': '#f8f9ff',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#eff4ff',
  surfaceContainer: '#e5eeff',
  'surface-container-high': '#dce9ff',
  'surface-container-highest': '#d3e4fe',
  'surface-variant': '#d3e4fe',
  'surface-tint': '#1b55d0',
  'on-surface': '#0b1c30',
  'on-surface-variant': '#434654',
  outline: '#737685',
  'outline-variant': '#c3c6d6',
};

// Inverse colors for dark mode
export const INVERSE_COLORS = {
  'inverse-surface': '#213145',
  'inverse-on-surface': '#eaf1ff',
  'inverse-primary': '#b4c5ff',
};

export function getBrandColorShades(colorKey: string): BrandColorShades {
  return BRAND_COLORS[colorKey as BrandColorKey] || BRAND_COLORS.primary;
}
