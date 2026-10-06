export interface TailwindPresetConfig {
  theme?: {
    extend?: Record<string, any>;
  };
  plugins?: any[];
}

/**
 * PANACEA CONSULTANCY — Shared Tailwind CSS Preset
 *
 * Provides the design system tokens as Tailwind theme extensions.
 * All apps (web, portal) extend this preset for brand consistency.
 */
const panaceaPreset: TailwindPresetConfig = {
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
        narrow: '720px',
      },
      boxShadow: {
        institutional:
          '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'institutional-lg':
          '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};

export default panaceaPreset;
