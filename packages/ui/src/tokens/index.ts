/**
 * PANACEA CONSULTANCY — Design Tokens
 *
 * Brand-aligned design system based on UI-SPEC.md §3–§4.
 *
 * Color palette: Deep Navy, Burgundy/Red, Off-White, Neutral Gray, Muted Gold (accent)
 * Typography: Professional serif for display, readable sans-serif for body/UI
 *
 * NOTE: Exact hex values are preliminary. Final values should be confirmed
 * after official logo/brand assets are reviewed.
 */

// ---- Color Tokens ----

export const colors = {
  // Primary
  navy: {
    50: '#f0f3f8',
    100: '#d9e1ed',
    200: '#b3c3db',
    300: '#8da5c9',
    400: '#6787b7',
    500: '#2c4a7c',
    600: '#1e3a6e',
    700: '#152d5a',
    800: '#0f2145',
    900: '#0a1830',
    950: '#060e1d',
  },

  // Accent — Burgundy/Red
  burgundy: {
    50: '#fdf2f2',
    100: '#fce4e4',
    200: '#f9c9c9',
    300: '#f3a0a0',
    400: '#e86b6b',
    500: '#8b1a1a',
    600: '#7a1616',
    700: '#681212',
    800: '#560f0f',
    900: '#440c0c',
    950: '#2d0707',
  },

  // Muted Gold — premium accent, very limited use
  gold: {
    50: '#fdf8ef',
    100: '#f9ecd4',
    200: '#f2d8a8',
    300: '#eac474',
    400: '#d4a84a',
    500: '#b8922e',
    600: '#9a7824',
    700: '#7c5f1c',
    800: '#5e4715',
    900: '#40300f',
    950: '#2a1f09',
  },

  // Neutral Gray
  gray: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    950: '#0d1117',
  },

  // Semantic
  white: '#ffffff',
  offWhite: '#f8f9fa',
  black: '#0d1117',

  // Status (accessible, not relying on color alone)
  success: '#1a7a3a',
  warning: '#b86e00',
  error: '#c62828',
  info: '#1565c0',
} as const;

// ---- Typography Tokens ----

export const typography = {
  fontFamily: {
    display: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
    body: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    ui: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },

  fontSize: {
    h1: { desktop: '3.5rem', mobile: '2.25rem' }, // 56px / 36px
    h2: { desktop: '2.75rem', mobile: '1.875rem' }, // 44px / 30px
    h3: { desktop: '1.875rem', mobile: '1.5rem' }, // 30px / 24px
    h4: { desktop: '1.375rem', mobile: '1.125rem' }, // 22px / 18px
    body: '1rem', // 16px
    bodyLarge: '1.125rem', // 18px
    small: '0.875rem', // 14px
    xs: '0.8125rem', // 13px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
  },
} as const;

// ---- Spacing Tokens ----

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const;

// ---- Layout Tokens ----

export const layout = {
  maxWidth: '1280px',
  contentMaxWidth: '1200px',
  narrowMaxWidth: '720px',

  containerPadding: {
    desktop: '2rem',
    tablet: '1.5rem',
    mobile: '1rem',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// ---- Border & Shadow Tokens ----

export const borders = {
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

// ---- Motion Tokens (UI-SPEC §42) ----

export const motion = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ---- Z-Index Scale ----

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;
